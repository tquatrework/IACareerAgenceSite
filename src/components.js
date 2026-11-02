import { html, raw } from './html.js'
import { CARDS, FAMILIES, cardHref } from '../shared/catalog.js'

const ICON_PATHS = {
  presence: '<rect x="3" y="4" width="18" height="14" rx="1.5"/><path d="M3 8h18M7 21h10M12 18v3"/>',
  messagerie: '<rect x="3" y="5" width="18" height="14" rx="1.5"/><path d="M3 7l9 6 9-6"/>',
  relation: '<circle cx="9" cy="8" r="3"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M16 6h5M16 10h5"/>',
  pilotage: '<path d="M4 20V10M10 20V4M16 20v-8M22 20H2"/>',
  documents: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/>',
  assistants: '<path d="M4 5h16v11H9l-5 4z"/><path d="M8 9h8M8 12h5"/>',
  applications: '<path d="M8 6L3 12l5 6M16 6l5 6-5 6M14 4l-4 16"/>',
  audit: '<circle cx="11" cy="11" r="6"/><path d="M16 16l5 5M8.5 11l2 2 3.5-4"/>',
}

export function familyIcon(family) {
  return html`<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${raw(ICON_PATHS[family] ?? ICON_PATHS.documents)}</svg>`
}

export function pageHeader({ eyebrow, title, lead, actions }) {
  return html`<section class="page-head">
    <div class="wrap">
      ${eyebrow ? html`<p class="eyebrow">${eyebrow}</p>` : ''}
      <h1 class="display">${title}</h1>
      ${lead ? html`<p class="lead">${lead}</p>` : ''}
      ${actions ? html`<div class="actions">${actions}</div>` : ''}
    </div>
  </section>`
}

export function sectionHead({ marker, title, lead, id }) {
  return html`<header class="section-head">
    ${marker ? html`<p class="eyebrow"><span class="marker">${marker}</span></p>` : ''}
    <h2 class="headline" ${id ? html`id="${id}"` : ''}>${title}</h2>
    ${lead ? html`<p class="lead">${lead}</p>` : ''}
  </header>`
}

export function quoteLink(label = 'Demandez un devis', params = '') {
  return html`<a class="button button--primary" href="/contact${params}">${label}</a>`
}

export function offerTeaser(offer) {
  return html`<li class="teaser">
    <p class="eyebrow">${offer.kind}</p>
    <h3><a href="/solutions/${offer.slug}">${offer.title}</a></h3>
    <p>${offer.summary}</p>
  </li>`
}

export function catalogEntry(card) {
  return html`<li class="catalog-entry" id="${card.slug}">
    <span class="catalog-entry__num" aria-hidden="true">${String(card.id).padStart(2, '0')}</span>
    <div>
      <p class="eyebrow">${FAMILIES[card.family]}</p>
      <h3>${card.title}</h3>
      <p>${card.summary}</p>
      <p class="catalog-entry__links"><a href="${cardHref(card)}">Voir la présentation détaillée</a>
        <a href="/contact?solution=${card.slug}">Demander un devis pour cette solution</a></p>
    </div>
  </li>`
}

export function cardsForOffer(offer) {
  return offer.cards.map((id) => CARDS.find((card) => card.id === id)).filter(Boolean)
}
