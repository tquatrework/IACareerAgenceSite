import { html } from './html.js'

export const SITE = {
  name: 'IACareer',
  tagline: 'Agence IA',
  url: 'https://agence.iacareer.fr',
  email: 'contact@iacareer.fr',
  phone: '07 49 13 74 31',
  phoneHref: '+33749137431',
  brandUrl: 'https://iacareer.fr',
  trainingUrl: 'https://formation.iacareer.fr',
}

export const NAV_ITEMS = [
  { href: '/audit-transformation', label: 'Audit & transformation' },
  { href: '/solutions-independants', label: 'Solutions indépendants' },
  { href: '/solutions-pme', label: 'Solutions PME' },
  { href: '/qualite-confiance', label: 'Qualité & confiance' },
]

// Symbole commun : une grille de cartes dont une est retournée.
function logoMark() {
  return html`<svg class="logo__mark" viewBox="0 0 32 32" aria-hidden="true" focusable="false">
    <rect x="3" y="3" width="11" height="11" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.6"/>
    <rect x="18" y="3" width="11" height="11" rx="1.5" fill="var(--orange)"/>
    <rect x="3" y="18" width="11" height="11" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.6"/>
    <rect x="18" y="18" width="11" height="11" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.6"/>
  </svg>`
}

function header(currentPath) {
  return html`<header class="site-header">
    <div class="wrap site-header__bar">
      <a class="logo" href="/" aria-label="IACareer Agence — retour à l’accueil">
        ${logoMark()}
        <span class="logo__text"><strong>IACareer</strong><span>Agence IA</span></span>
      </a>
      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="main-nav" data-nav-toggle>
        <span class="nav-toggle__label">Menu</span>
      </button>
      <nav id="main-nav" class="main-nav" aria-label="Navigation principale">
        <ul>
          ${NAV_ITEMS.map(
            (item) => html`<li><a href="${item.href}" ${currentPath === item.href ? html`aria-current="page"` : ''}>${item.label}</a></li>`,
          )}
        </ul>
        <a class="button button--primary main-nav__cta" href="/contact">Demandez un devis</a>
      </nav>
    </div>
  </header>`
}

function footer() {
  return html`<footer class="site-footer">
    <div class="wrap site-footer__grid">
      <div>
        <p class="site-footer__brand">IACareer <span>Agence IA</span></p>
        <p class="muted">Conseil et développement de solutions d’IA pour les indépendants et les PME.</p>
        <p class="muted">
          <a href="mailto:${SITE.email}">${SITE.email}</a><br />
          <a href="tel:${SITE.phoneHref}">${SITE.phone}</a>
        </p>
      </div>
      <nav aria-label="Rubriques">
        <h2 class="eyebrow">Rubriques</h2>
        <ul>
          ${NAV_ITEMS.map((item) => html`<li><a href="${item.href}">${item.label}</a></li>`)}
          <li><a href="/realisations">Réalisations</a></li>
          <li><a href="/solutions">Toutes les solutions</a></li>
          <li><a href="/contact">Contact / devis</a></li>
        </ul>
      </nav>
      <nav aria-label="Autres sites IACareer">
        <h2 class="eyebrow">Les sites IACareer</h2>
        <ul>
          <li><a href="${SITE.brandUrl}">iacareer.fr — la marque</a></li>
          <li><a href="${SITE.trainingUrl}">formation.iacareer.fr — la formation</a></li>
          <li><a href="/mentions-legales">Mentions légales et confidentialité</a></li>
        </ul>
      </nav>
    </div>
    <div class="wrap site-footer__legal muted">
      <small>© ${new Date().getFullYear()} IACareer — VisioScience SASU</small>
    </div>
  </footer>`
}

export function layout({ title, description, path = '/', body, scripts = [], noindex = false, bodyClass = '' }) {
  const fullTitle = path === '/' ? title : `${title} — IACareer Agence`
  return html`<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${fullTitle}</title>
  <meta name="description" content="${description}" />
  ${noindex ? html`<meta name="robots" content="noindex" />` : ''}
  <link rel="canonical" href="${SITE.url}${path === '/' ? '' : path}" />
  <meta property="og:title" content="${fullTitle}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:type" content="website" />
  <meta property="og:locale" content="fr_FR" />
  <meta name="theme-color" content="#FFF5E9" />
  <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
  <link rel="stylesheet" href="/css/site.css" />
  <script src="/js/nav.js" defer></script>
  ${scripts.map((src) => html`<script type="module" src="${src}"></script>`)}
</head>
<body class="${bodyClass}">
  <a class="skip-link" href="#contenu">Aller au contenu</a>
  ${header(path)}
  <main id="contenu" tabindex="-1">${body}</main>
  ${footer()}
</body>
</html>`
}
