import { test } from '@japa/runner'
import { mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { loadContent } from '#services/content_loader'
import { loadHomeContent } from '#content/home'
import { loadPages } from '#content/pages'
import { OFFERS, assertValidOffers, type Offer } from '#content/offers'
import { REALISATIONS, FICHE_SECTIONS } from '#content/realisations'

function contentDirectory(files: Record<string, string>) {
  const directory = mkdtempSync(join(tmpdir(), 'content-'))
  for (const [name, text] of Object.entries(files)) writeFileSync(join(directory, name), text)
  return `${directory}/`
}

test.group('Chargeur de contenu YAML', () => {
  test('lit les textes et les listes demandés', ({ assert }) => {
    const directory = contentDirectory({ 'page.yml': 'title: "Bonjour : monde"\nitems:\n  - a\n  - b\n' })
    const content = loadContent<{ title: string; items: string[] }>('page', { text: ['title'], list: ['items'] }, directory)
    assert.equal(content.title, 'Bonjour : monde')
    assert.deepEqual(content.items, ['a', 'b'])
  })

  test('un fichier absent produit une erreur qui nomme le fichier', ({ assert }) => {
    const directory = contentDirectory({})
    assert.throws(() => loadContent('absent', {}, directory), 'content/absent.yml')
  })

  test('un YAML mal formé produit une erreur claire', ({ assert }) => {
    const directory = contentDirectory({ 'page.yml': 'title: "non fermé\n' })
    assert.throws(() => loadContent('page', {}, directory), 'YAML invalide dans content/page.yml')
  })

  test('un contenu qui n’est pas une suite de clés est refusé', ({ assert }) => {
    const directory = contentDirectory({ 'page.yml': '- a\n- b\n' })
    assert.throws(() => loadContent('page', {}, directory), 'doit contenir des clés')
  })

  test('un texte manquant ou vide est signalé avec son chemin', ({ assert }) => {
    const blank = contentDirectory({ 'page.yml': 'hero:\n  title: "  "\n' })
    assert.throws(() => loadContent('page', { text: ['hero.title'] }, blank), '« hero.title »')
    const missing = contentDirectory({ 'page.yml': 'hero:\n  title: "Titre"\n' })
    assert.throws(() => loadContent('page', { text: ['hero.lead'] }, missing), '« hero.lead »')
  })

  test('une liste vide ou d’un autre type est signalée', ({ assert }) => {
    const empty = contentDirectory({ 'page.yml': 'items: []\n' })
    assert.throws(() => loadContent('page', { list: ['items'] }, empty), '« items »')
    const wrongType = contentDirectory({ 'page.yml': 'other: texte\n' })
    assert.throws(() => loadContent('page', { list: ['other'] }, wrongType), '« other »')
  })
})

test.group('Chargeur de contenu YAML : champs vides', () => {
  test('un texte laissé vide n’importe où dans le fichier est signalé avec son chemin', ({ assert }) => {
    const directory = contentDirectory({ 'page.yml': 'sections:\n  - title: "A"\n  - title: ""\n' })
    assert.throws(() => loadContent('page', {}, directory), 'sections[2].title')
  })

  test('une liste vide ou une clé sans valeur est signalée', ({ assert }) => {
    assert.throws(() => loadContent('page', {}, contentDirectory({ 'page.yml': 'ticks: []\n' })), '« ticks »')
    assert.throws(() => loadContent('page', {}, contentDirectory({ 'page.yml': 'title:\n' })), '« title » n’a pas de valeur')
  })
})

test.group('Contenu des pages', () => {
  test('les pages éditables se chargent toutes', ({ assert }) => {
    const pages = loadPages()
    assert.sameMembers(Object.keys(pages), ['audit', 'independants', 'pme', 'qualite', 'solutions'])
    assert.lengthOf(pages.qualite.sections, 5)
    assert.lengthOf(pages.audit.method.steps, 5)
  })

  test('les offres du YAML sont valides et complètes', ({ assert }) => {
    assert.lengthOf(OFFERS, 14)
    assert.lengthOf(OFFERS.filter((offer) => offer.audience === 'independant'), 6)
    assert.lengthOf(OFFERS.filter((offer) => offer.audience === 'pme'), 8)
  })

  test('les réalisations héritent des mentions communes', ({ assert }) => {
    assert.lengthOf(REALISATIONS, 4)
    assert.isTrue(REALISATIONS.every((item) => item.status.includes('fiche à venir')))
    assert.lengthOf(FICHE_SECTIONS, 9)
  })
})

test.group('Validation des offres', () => {
  const base = OFFERS[0]
  const withChange = (change: Partial<Offer>) => [{ ...base, ...change }]

  test('accepte les offres existantes', () => {
    assertValidOffers(OFFERS)
  })

  test('refuse une adresse invalide ou en double', ({ assert }) => {
    assert.throws(() => assertValidOffers(withChange({ slug: 'Mauvaise Adresse' })), 'minuscules, chiffres et tirets')
    assert.throws(() => assertValidOffers([base, { ...base }]), 'en double')
  })

  test('refuse une audience inconnue', ({ assert }) => {
    assert.throws(() => assertValidOffers(withChange({ audience: 'grand-compte' as Offer['audience'] })), '« audience »')
  })

  test('refuse un numéro de carte hors de 1 à 30', ({ assert }) => {
    assert.throws(() => assertValidOffers(withChange({ cards: [1, 31] })), 'de 1 à 30')
  })

  test('refuse une liste vide ou un texte vide', ({ assert }) => {
    assert.throws(() => assertValidOffers(withChange({ receives: [] })), '« receives »')
    assert.throws(() => assertValidOffers(withChange({ summary: ' ' })), '« summary »')
  })
})

test.group('Contenu de la page d’accueil', () => {
  test('content/home.yml est complet', ({ assert }) => {
    const home = loadHomeContent()
    assert.lengthOf(home.quality.points, 4)
    assert.lengthOf(home.method.steps, 5)
    assert.lengthOf(home.publics.items, 2)
    assert.lengthOf(home.paths.items, 2)
    for (const item of [...home.publics.items, ...home.paths.items]) assert.match(item.linkHref, /^\//)
  })
})
