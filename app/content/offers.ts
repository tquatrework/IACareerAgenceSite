import { loadContent } from '#services/content_loader'

// Packs indépendants (specs.md §9.2) et familles PME (§10.2), avec les rubriques d’une fiche (§9.3).
// Les textes sont dans content/offers.yml. Prix, délais et volumes ne sont pas établis : « Sur devis ».

export interface Offer {
  slug: string
  audience: 'independant' | 'pme'
  kind: string
  title: string
  summary: string
  problem: string
  concerned: string
  receives: string[]
  tools: string[]
  inScope: string[]
  adaptation: string[]
  validations: string[]
  cards: number[]
}

export interface OffersPageLabels {
  audienceLabels: Record<Offer['audience'], string>
  buttonPrefix: string
  problemTitle: string
  concernedTitle: string
  receivesTitle: string
  toolsTitle: string
  inScopeTitle: string
  adaptationTitle: string
  validationsTitle: string
  supportTitle: string
  supportText: string
  priceTitle: string
  priceLead: string
  priceText: string
  associatedTitle: string
  associatedText: string
  associatedLink: string
  cardsTitle: string
  ctaText: string
  backLink: string
}

const OFFER_TEXTS = ['kind', 'title', 'summary', 'problem', 'concerned'] as const
const OFFER_LISTS = ['receives', 'tools', 'inScope', 'adaptation', 'validations', 'cards'] as const
const PAGE_LABELS = [
  'audienceLabels.pme', 'audienceLabels.independant', 'buttonPrefix', 'problemTitle', 'concernedTitle',
  'receivesTitle', 'toolsTitle', 'inScopeTitle', 'adaptationTitle', 'validationsTitle', 'supportTitle',
  'supportText', 'priceTitle', 'priceLead', 'priceText', 'associatedTitle', 'associatedText',
  'associatedLink', 'cardsTitle', 'ctaText', 'backLink',
].map((key) => `page.${key}`)

/** Contrôle ce que l'on ne peut pas voir à l'écran : adresses uniques, audiences et numéros de cartes valides. */
export function assertValidOffers(offers: Offer[], fileLabel = 'content/offers.yml') {
  const slugs = new Set<string>()
  offers.forEach((offer, index) => {
    const where = `${fileLabel} : offre n° ${index + 1} (${offer.slug ?? 'sans slug'})`
    if (typeof offer.slug !== 'string' || !/^[a-z0-9-]+$/.test(offer.slug)) {
      throw new Error(`${where} : « slug » doit contenir seulement minuscules, chiffres et tirets`)
    }
    if (slugs.has(offer.slug)) throw new Error(`${where} : « slug » en double`)
    slugs.add(offer.slug)
    if (offer.audience !== 'independant' && offer.audience !== 'pme') {
      throw new Error(`${where} : « audience » doit valoir "independant" ou "pme"`)
    }
    for (const key of OFFER_TEXTS) {
      if (typeof offer[key] !== 'string' || offer[key].trim() === '') throw new Error(`${where} : « ${key} » est absent ou vide`)
    }
    for (const key of OFFER_LISTS) {
      if (!Array.isArray(offer[key]) || offer[key].length === 0) throw new Error(`${where} : la liste « ${key} » est absente ou vide`)
    }
    for (const cardId of offer.cards) {
      if (!Number.isInteger(cardId) || cardId < 1 || cardId > 30) {
        throw new Error(`${where} : « cards » ne peut contenir que des numéros de 1 à 30 (reçu : ${cardId})`)
      }
    }
  })
}

const content = loadContent<{ offers: Offer[]; page: OffersPageLabels }>('offers', {
  list: ['offers'],
  text: PAGE_LABELS,
})
assertValidOffers(content.offers)

export const OFFERS: Offer[] = content.offers
export const OFFERS_PAGE: OffersPageLabels = content.page

export function findOffer(slug: string) {
  return OFFERS.find((offer) => offer.slug === slug)
}
