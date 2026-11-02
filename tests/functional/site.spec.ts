import { test } from '@japa/runner'
import app from '@adonisjs/core/services/app'
import limiter from '@adonisjs/limiter/services/main'
import DevisStore from '#services/devis_store'
import { OFFERS } from '#content/offers'
import { REALISATIONS } from '#content/realisations'

const validBody = {
  name: 'Camille',
  email: 'camille@example.fr',
  profile: 'equipe',
  objet: 'audit',
  message: 'Nous voulons un audit.',
}

function fakeStore(saved: Record<string, unknown>[], shouldFail = false) {
  app.container.swap(DevisStore, () => {
    const store = new DevisStore()
    store.save = async (values) => {
      if (shouldFail) throw new Error('disque plein')
      saved.push(values)
      return 'id-test'
    }
    return store
  })
}

test.group('Pages publiques', () => {
  test('toutes les pages répondent 200 en français', async ({ client, assert }) => {
    const paths = [
      '/', '/audit-transformation', '/solutions-independants', '/solutions-pme', '/solutions',
      '/qualite-confiance', '/realisations', '/contact', '/mentions-legales',
      ...OFFERS.map((offer) => `/solutions/${offer.slug}`),
      ...REALISATIONS.map((item) => `/realisations/${item.slug}`),
    ]
    for (const path of paths) {
      const response = await client.get(path)
      response.assertStatus(200)
      assert.include(response.text(), '<html lang="fr">', path)
      assert.include(response.text(), '<h1', path)
    }
  })

  test("l'accueil contient le titre, la citation et les liens vers les autres sites", async ({ client, assert }) => {
    const body = (await client.get('/')).text()
    assert.include(body, 'Qu’est-ce que l’IA pourrait simplifier dans votre entreprise ?')
    assert.include(body, 'seul le premier pas coûte, le deuxième a déjà été remboursé…')
    assert.include(body, 'https://iacareer.fr')
    assert.include(body, 'https://formation.iacareer.fr')
    assert.isAtLeast(body.split('Demandez un devis').length - 1, 3)
  })

  test('une page ou une fiche inconnue renvoie 404', async ({ client }) => {
    ;(await client.get('/nimporte-quoi')).assertStatus(404)
    ;(await client.get('/solutions/inconnu')).assertStatus(404)
    ;(await client.get('/realisations/inconnu')).assertStatus(404)
  })

  test('les en-têtes de sécurité sont présents et aucun cookie n’est posé', async ({ client, assert }) => {
    const response = await client.get('/')
    assert.include(response.header('content-security-policy'), "default-src 'self'")
    assert.equal(response.header('x-content-type-options'), 'nosniff')
    assert.isUndefined(response.header('set-cookie'))
  })

  test('les fichiers statiques sont servis', async ({ client }) => {
    ;(await client.get('/css/site.css')).assertStatus(200)
    ;(await client.get('/js/shared/catalog.js')).assertStatus(200)
  })

  test('le contact reprend la solution passée dans l’adresse', async ({ client, assert }) => {
    const body = (await client.get('/contact?solution=crm-connecte-ia')).text()
    assert.match(body, /<option value="relation-client" selected>/)
  })

  test('robots.txt et sitemap.xml existent', async ({ client, assert }) => {
    assert.include((await client.get('/robots.txt')).text(), 'Sitemap')
    assert.include((await client.get('/sitemap.xml')).text(), 'agence.iacareer.fr/audit-transformation')
  })
})

test.group('Demande de devis', (group) => {
  group.each.setup(async () => {
    await limiter.clear()
  })
  group.each.teardown(() => {
    app.container.restore(DevisStore)
  })

  test('une demande valide est enregistrée', async ({ client, assert }) => {
    const saved: Record<string, unknown>[] = []
    fakeStore(saved)
    const response = await client.post('/api/devis').json(validBody)
    response.assertStatus(200)
    response.assertBodyContains({ ok: true })
    assert.equal(saved[0].email, 'camille@example.fr')
  })

  test('une demande invalide renvoie 422 avec les erreurs par champ', async ({ client, assert }) => {
    const saved: Record<string, unknown>[] = []
    fakeStore(saved)
    const response = await client.post('/api/devis').json({ ...validBody, email: 'oops', message: '' })
    response.assertStatus(422)
    assert.property(response.body().errors, 'email')
    assert.property(response.body().errors, 'message')
    assert.lengthOf(saved, 0)
  })

  test('un robot (champ piège rempli) reçoit un succès sans enregistrement', async ({ client, assert }) => {
    const saved: Record<string, unknown>[] = []
    fakeStore(saved)
    const response = await client.post('/api/devis').json({ ...validBody, website: 'http://spam' })
    response.assertStatus(200)
    assert.lengthOf(saved, 0)
  })

  test('un corps trop volumineux est refusé', async ({ client }) => {
    fakeStore([])
    const response = await client.post('/api/devis').json({ ...validBody, message: 'x'.repeat(60 * 1024) })
    response.assertStatus(413)
  })

  test('le formulaire sans JavaScript conserve la saisie et échappe le HTML', async ({ client, assert }) => {
    fakeStore([])
    const response = await client
      .post('/contact')
      .form({ name: 'Camille <b>', email: 'oops', message: 'Un message assez long' })
    response.assertStatus(422)
    assert.include(response.text(), 'Camille &lt;b&gt;')
    assert.include(response.text(), 'Un message assez long')
  })

  test('une erreur d’enregistrement est signalée en 500', async ({ client }) => {
    fakeStore([], true)
    const response = await client.post('/api/devis').json(validBody)
    response.assertStatus(500)
    response.assertBodyContains({ ok: false })
  })

  test('la onzième demande en une heure depuis la même IP est refusée', async ({ client }) => {
    fakeStore([])
    for (let i = 0; i < 10; i += 1) {
      ;(await client.post('/api/devis').json(validBody)).assertStatus(200)
    }
    ;(await client.post('/api/devis').json(validBody)).assertStatus(429)
  })
})

test.group('Page d’accueil pilotée par content/home.yml', () => {
  test('affiche les textes du YAML dans l’ordre voulu', async ({ client, assert }) => {
    const { loadHomeContent } = await import('#content/home')
    const home = loadHomeContent()
    const html = (await client.get('/')).text()
    const positions = [
      home.hero.title, home.realisations.title, home.quality.title, home.quote.text,
      home.method.title, home.publics.title, home.paths.title, home.invitation.title,
    ].map((text) => html.indexOf(text.replace(/’/g, '&#x2019;')) >= 0 ? html.indexOf(text.replace(/’/g, '&#x2019;')) : html.indexOf(text))
    for (const position of positions) assert.isAbove(position, -1)
    assert.deepEqual([...positions].sort((a, b) => a - b), positions)
  })
})
