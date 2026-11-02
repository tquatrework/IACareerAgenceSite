import test, { before, after } from 'node:test'
import assert from 'node:assert/strict'
import { createApp } from '../src/app.js'
import { OFFERS } from '../src/content/offers.js'
import { REALISATIONS } from '../src/content/realisations.js'

const stored = []
let server
let baseUrl

before(async () => {
  server = createApp({ storeRequest: async (values) => { stored.push(values); return 'id-test' }, rateLimiter: () => true })
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
  baseUrl = `http://127.0.0.1:${server.address().port}`
})
after(() => server.close())

const get = (pathname) => fetch(baseUrl + pathname)
const postJson = (body) => fetch(`${baseUrl}/api/devis`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
const validBody = { name: 'Camille', email: 'camille@example.fr', profile: 'equipe', objet: 'audit', message: 'Nous voulons un audit.' }

test('toutes les pages publiques répondent 200 en français', async () => {
  const paths = ['/', '/audit-transformation', '/solutions-independants', '/solutions-pme', '/solutions', '/qualite-confiance', '/realisations', '/contact', '/mentions-legales',
    ...OFFERS.map((offer) => `/solutions/${offer.slug}`), ...REALISATIONS.map((item) => `/realisations/${item.slug}`)]
  for (const pathname of paths) {
    const response = await get(pathname)
    assert.equal(response.status, 200, pathname)
    const body = await response.text()
    assert.match(body, /<html lang="fr">/, pathname)
    assert.match(body, /<h1/, pathname)
  }
})

test('l’accueil contient le titre, le bandeau de citation et les liens du pied de page', async () => {
  const body = await (await get('/')).text()
  assert.match(body, /Qu’est-ce que l’IA pourrait simplifier dans votre entreprise ?/)
  assert.match(body, /seul le premier pas coûte, le deuxième a déjà été remboursé…/)
  assert.match(body, /https:\/\/iacareer\.fr/)
  assert.match(body, /https:\/\/formation\.iacareer\.fr/)
  assert.equal((body.match(/Demandez un devis/g) ?? []).length >= 3, true)
})

test('une page inconnue renvoie 404', async () => {
  assert.equal((await get('/nimporte-quoi')).status, 404)
  assert.equal((await get('/solutions/inconnu')).status, 404)
})

test('les en-têtes de sécurité sont présents', async () => {
  const response = await get('/')
  assert.match(response.headers.get('content-security-policy'), /default-src 'self'/)
  assert.equal(response.headers.get('x-content-type-options'), 'nosniff')
})

test('les fichiers statiques sont servis et l’accès hors dossier est refusé', async () => {
  assert.equal((await get('/css/site.css')).status, 200)
  assert.equal((await get('/shared/catalog.js')).status, 200)
  assert.equal((await get('/js/%2e%2e/%2e%2e/package.json')).status, 404)
  assert.equal((await get('/shared/../package.json')).status, 404)
})

test('une demande valide est enregistrée', async () => {
  const response = await postJson(validBody)
  assert.equal(response.status, 200)
  assert.deepEqual(await response.json(), { ok: true })
  assert.equal(stored.at(-1).email, 'camille@example.fr')
})

test('une demande invalide renvoie 422 avec les erreurs par champ', async () => {
  const response = await postJson({ ...validBody, email: 'oops', message: '' })
  assert.equal(response.status, 422)
  const result = await response.json()
  assert.ok(result.errors.email)
  assert.ok(result.errors.message)
})

test('un robot (champ piège rempli) reçoit un succès sans enregistrement', async () => {
  const before = stored.length
  const response = await postJson({ ...validBody, website: 'http://spam' })
  assert.equal(response.status, 200)
  assert.equal(stored.length, before)
})

test('un JSON malformé est refusé sans planter le serveur', async () => {
  const response = await fetch(`${baseUrl}/api/devis`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{pas du json' })
  assert.equal(response.status, 400)
  assert.equal((await get('/')).status, 200)
})

test('un corps trop volumineux est refusé', async () => {
  const response = await postJson({ ...validBody, message: 'x'.repeat(60 * 1024) })
  assert.equal(response.status, 413)
})

test('le formulaire sans JavaScript conserve la saisie en cas d’erreur', async () => {
  const response = await fetch(`${baseUrl}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ name: 'Camille <b>', email: 'oops', message: 'Un message assez long' }),
  })
  assert.equal(response.status, 422)
  const body = await response.text()
  assert.match(body, /Camille &lt;b&gt;/)
  assert.match(body, /Un message assez long/)
})

test('une erreur d’enregistrement est signalée et la saisie reste disponible', async () => {
  const failing = createApp({ storeRequest: async () => { throw new Error('disque plein') } })
  await new Promise((resolve) => failing.listen(0, '127.0.0.1', resolve))
  const original = console.error
  console.error = () => {}
  try {
    const response = await fetch(`http://127.0.0.1:${failing.address().port}/api/devis`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(validBody) })
    assert.equal(response.status, 500)
    assert.equal((await response.json()).ok, false)
  } finally {
    console.error = original
    failing.close()
  }
})

test('la limite de débit renvoie 429', async () => {
  const limited = createApp({ storeRequest: async () => 'id', rateLimiter: () => false })
  await new Promise((resolve) => limited.listen(0, '127.0.0.1', resolve))
  try {
    const response = await fetch(`http://127.0.0.1:${limited.address().port}/api/devis`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(validBody) })
    assert.equal(response.status, 429)
  } finally {
    limited.close()
  }
})

test('le contact reprend la solution passée dans l’adresse', async () => {
  const body = await (await get('/contact?solution=crm-connecte-ia')).text()
  assert.match(body, /<option value="relation-client" selected>/)
})

test('robots.txt et sitemap.xml existent', async () => {
  assert.match(await (await get('/robots.txt')).text(), /Sitemap/)
  assert.match(await (await get('/sitemap.xml')).text(), /agence\.iacareer\.fr\/audit-transformation/)
})

test('un client qui n’envoie jamais son corps est coupé et rend sa place globale', async () => {
  const net = await import('node:net')
  let settled = []
  const limiter = Object.assign(() => true, { settle: (isStored) => settled.push(isStored) })
  const slow = createApp({ storeRequest: async () => 'id', rateLimiter: limiter, bodyTimeoutMs: 100 })
  await new Promise((resolve) => slow.listen(0, '127.0.0.1', resolve))
  const original = console.error
  console.error = () => {}
  try {
    const socket = net.connect(slow.address().port, '127.0.0.1')
    socket.write('POST /api/devis HTTP/1.1\r\nHost: x\r\nContent-Type: application/json\r\nContent-Length: 500\r\n\r\n{"name":')
    await new Promise((resolve) => socket.on('close', resolve))
    await new Promise((resolve) => setTimeout(resolve, 50))
    assert.deepEqual(settled, [false])
  } finally {
    console.error = original
    slow.close()
  }
})
