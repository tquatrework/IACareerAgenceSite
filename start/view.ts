/*
|--------------------------------------------------------------------------
| Données partagées par toutes les vues
|--------------------------------------------------------------------------
*/

import edge from 'edge.js'
import { CARDS, FAMILIES, cardHref } from '#shared/index'
import { OFFERS } from '#content/offers'
import { REALISATIONS, FICHE_SECTIONS } from '#content/realisations'

edge.global('site', {
  name: 'IACareer',
  url: 'https://agence.iacareer.fr',
  email: 'contact@iacareer.fr',
  phone: '07 49 13 74 31',
  phoneHref: '+33749137431',
  brandUrl: 'https://iacareer.fr',
  trainingUrl: 'https://formation.iacareer.fr',
})
edge.global('navItems', [
  { href: '/audit-transformation', label: 'Audit & transformation' },
  { href: '/solutions-independants', label: 'Solutions indépendants' },
  { href: '/solutions-pme', label: 'Solutions PME' },
  { href: '/qualite-confiance', label: 'Qualité & confiance' },
])
edge.global('cards', CARDS)
edge.global('families', FAMILIES)
edge.global('offers', OFFERS)
edge.global('realisations', REALISATIONS)
edge.global('ficheSections', FICHE_SECTIONS)
edge.global('cardHref', cardHref)
edge.global('padNumber', (value: number) => String(value).padStart(2, '0'))
edge.global('cardsFor', (offer: { cards: number[] }) =>
  offer.cards.map((id) => CARDS.find((card: { id: number }) => card.id === id)).filter(Boolean)
)
edge.global('currentYear', () => new Date().getFullYear())
