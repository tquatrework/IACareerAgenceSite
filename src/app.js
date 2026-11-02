import http from 'node:http'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { homePage } from './pages/home.js'
import { auditPage, independantsPage, pmePage, solutionsCatalogPage, offerPage, qualityPage, realisationsPage, realisationPage, legalPage } from './pages/sections.js'
import { contactPage } from './pages/contact.js'
import { validateDevis, isSpam, createRateLimiter, createFileStore, clientAddress } from './devis.js'
import { SITE } from './layout.js'
import { OFFERS } from './content/offers.js'
import { REALISATIONS } from './content/realisations.js'
import { html } from './html.js'
import { layout } from './layout.js'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const MAX_BODY_BYTES = 32 * 1024

const MIME_TYPES = {
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
}

const SECURITY_HEADERS = {
  'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'; form-action 'self'; base-uri 'self'; frame-ancestors 'none'; object-src 'none'",
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Frame-Options': 'DENY',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
}

const STATIC_DIRECTORIES = { '/css/': 'public/css', '/js/': 'public/js', '/shared/': 'shared' }

const STATIC_PAGES = new Map([
  ['/', homePage],
  ['/audit-transformation', auditPage],
  ['/solutions-independants', independantsPage],
  ['/solutions-pme', pmePage],
  ['/solutions', solutionsCatalogPage],
  ['/qualite-confiance', qualityPage],
  ['/realisations', realisationsPage],
  ['/mentions-legales', legalPage],
])

function sendHtml(response, status, content) {
  const body = String(content)
  response.writeHead(status, { ...SECURITY_HEADERS, 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-cache' })
  response.end(body)
}

function sendJson(response, status, data) {
  response.writeHead(status, { ...SECURITY_HEADERS, 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' })
  response.end(JSON.stringify(data))
}

function notFoundPage() {
  return layout({
    title: 'Page introuvable',
    description: 'Cette page n’existe pas.',
    path: '/404',
    noindex: true,
    body: html`<section class="page-head"><div class="wrap">
      <p class="eyebrow">Erreur 404</p>
      <h1 class="display">Cette page n’existe pas.</h1>
      <p class="lead">Le lien est peut-être ancien. Retournez à <a href="/">l’accueil</a> ou parcourez <a href="/solutions">toutes les solutions</a>.</p>
    </div></section>`,
  })
}

async function readBody(request) {
  const chunks = []
  let size = 0
  for await (const chunk of request) {
    size += chunk.length
    if (size > MAX_BODY_BYTES) throw Object.assign(new Error('Corps trop volumineux'), { statusCode: 413 })
    chunks.push(chunk)
  }
  return Buffer.concat(chunks).toString('utf8')
}

function parseBody(rawBody, contentType = '') {
  if (contentType.includes('application/json')) return JSON.parse(rawBody || '{}')
  return Object.fromEntries(new URLSearchParams(rawBody))
}

async function serveStatic(response, pathname) {
  const prefix = Object.keys(STATIC_DIRECTORIES).find((item) => pathname.startsWith(item))
  let filePath = null
  if (prefix) {
    const directory = path.join(ROOT, STATIC_DIRECTORIES[prefix])
    const candidate = path.resolve(directory, decodeURIComponent(pathname.slice(prefix.length)))
    if (candidate.startsWith(directory + path.sep)) filePath = candidate
  } else if (pathname === '/favicon.svg') {
    filePath = path.join(ROOT, 'public/favicon.svg')
  }
  if (!filePath) return false
  try {
    const content = await readFile(filePath)
    response.writeHead(200, { ...SECURITY_HEADERS, 'Content-Type': MIME_TYPES[path.extname(filePath)] ?? 'application/octet-stream', 'Cache-Control': 'no-cache' })
    response.end(content)
    return true
  } catch {
    return false
  }
}

function sitemap() {
  const paths = [...STATIC_PAGES.keys(), '/contact', ...OFFERS.map((offer) => `/solutions/${offer.slug}`)]
  const entries = paths.map((item) => `  <url><loc>${SITE.url}${item === '/' ? '' : item}</loc></url>`).join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`
}

export function createApp({ storeRequest, rateLimiter, trustedProxies } = {}) {
  const proxies = trustedProxies ?? (process.env.TRUSTED_PROXIES ?? '').split(',').map((item) => item.trim()).filter(Boolean)
  const store = storeRequest ?? createFileStore(process.env.DEVIS_FILE ?? path.join(ROOT, 'data', 'demandes.jsonl'))
  const isAllowed = rateLimiter ?? createRateLimiter({ limit: 5, windowMs: 10 * 60 * 1000 })

  async function handleDevis(request, response, wantsJson) {
    const respondError = (status, errors, formStatus, values = {}) => {
      if (wantsJson) return sendJson(response, status, { ok: false, errors, message: formStatus === 'error' ? 'La demande n’a pas pu être transmise.' : 'Certaines informations sont à corriger.' })
      return sendHtml(response, status, contactPage({ values, errors, status: formStatus }))
    }
    if (!isAllowed(clientAddress(request, proxies))) {
      return respondError(429, {}, 'error')
    }
    let input
    try {
      input = parseBody(await readBody(request), request.headers['content-type'])
    } catch (error) {
      return respondError(error.statusCode ?? 400, {}, 'error')
    }
    if (isSpam(input)) {
      // Réponse identique à un succès pour ne rien apprendre aux robots.
      return wantsJson ? sendJson(response, 200, { ok: true }) : sendHtml(response, 200, contactPage({ status: 'sent' }))
    }
    const { values, errors } = validateDevis(input)
    if (Object.keys(errors).length > 0) return respondError(422, errors, 'invalid', values)
    try {
      await store(values)
    } catch (error) {
      console.error('Enregistrement de la demande impossible :', error.message)
      return respondError(500, {}, 'error', values)
    }
    return wantsJson ? sendJson(response, 200, { ok: true }) : sendHtml(response, 200, contactPage({ status: 'sent' }))
  }

  return http.createServer(async (request, response) => {
    try {
      const url = new URL(request.url, 'http://localhost')
      const pathname = url.pathname.length > 1 ? url.pathname.replace(/\/+$/, '') : url.pathname
      const query = Object.fromEntries(url.searchParams)

      if (request.method === 'POST' && (pathname === '/contact' || pathname === '/api/devis')) {
        return await handleDevis(request, response, pathname === '/api/devis')
      }
      if (request.method !== 'GET' && request.method !== 'HEAD') {
        response.writeHead(405, { ...SECURITY_HEADERS, Allow: 'GET, HEAD, POST' })
        return response.end()
      }

      if (STATIC_PAGES.has(pathname)) return sendHtml(response, 200, STATIC_PAGES.get(pathname)())
      if (pathname === '/contact') return sendHtml(response, 200, contactPage({ query }))
      const offerMatch = pathname.match(/^\/solutions\/([a-z0-9-]+)$/)
      if (offerMatch) {
        const page = offerPage(offerMatch[1])
        return page ? sendHtml(response, 200, page) : sendHtml(response, 404, notFoundPage())
      }
      const realisationMatch = pathname.match(/^\/realisations\/([a-z0-9-]+)$/)
      if (realisationMatch && REALISATIONS.some((item) => item.slug === realisationMatch[1])) {
        return sendHtml(response, 200, realisationPage(realisationMatch[1]))
      }
      if (pathname === '/robots.txt') {
        response.writeHead(200, { ...SECURITY_HEADERS, 'Content-Type': MIME_TYPES['.txt'] })
        return response.end(`User-agent: *\nAllow: /\nSitemap: ${SITE.url}/sitemap.xml\n`)
      }
      if (pathname === '/sitemap.xml') {
        response.writeHead(200, { ...SECURITY_HEADERS, 'Content-Type': 'application/xml; charset=utf-8' })
        return response.end(sitemap())
      }
      if (await serveStatic(response, pathname)) return undefined
      return sendHtml(response, 404, notFoundPage())
    } catch (error) {
      console.error(error)
      response.writeHead(500, { ...SECURITY_HEADERS, 'Content-Type': 'text/plain; charset=utf-8' })
      return response.end('Erreur interne')
    }
  })
}
