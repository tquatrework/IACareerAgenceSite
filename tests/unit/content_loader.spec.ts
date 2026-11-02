import { test } from '@japa/runner'
import { mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { loadContent } from '#services/content_loader'
import { loadHomeContent } from '#content/home'

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
    const directory = contentDirectory({ 'page.yml': 'hero:\n  title: "  "\n' })
    assert.throws(() => loadContent('page', { text: ['hero.title'] }, directory), '« hero.title »')
    assert.throws(() => loadContent('page', { text: ['hero.lead'] }, directory), '« hero.lead »')
  })

  test('une liste vide ou d’un autre type est signalée', ({ assert }) => {
    const directory = contentDirectory({ 'page.yml': 'items: []\nother: texte\n' })
    assert.throws(() => loadContent('page', { list: ['items'] }, directory), '« items »')
    assert.throws(() => loadContent('page', { list: ['other'] }, directory), '« other »')
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
