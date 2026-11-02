import { loadContent } from '#services/content_loader'

/** Textes de la page d'accueil, édités dans content/home.yml. */
export interface HomeContent {
  meta: { title: string; description: string }
  hero: { eyebrow: string; title: string; lead: string; noscript: string; skipLink: string }
  realisations: { title: string; lead: string; allLink: string }
  quality: { title: string; link: string; points: { title: string; text: string }[] }
  quote: { text: string; button: string }
  method: {
    title: string
    steps: { title: string; text: string }[]
    deliverablesLabel: string
    deliverables: string
    link: string
  }
  publics: { title: string; items: { title: string; text: string; ticks: string[]; linkLabel: string; linkHref: string }[] }
  paths: { title: string; note: string; items: { title: string; text: string; linkLabel: string; linkHref: string }[] }
  invitation: { title: string; button: string; trainingText: string; trainingLinkLabel: string }
}

const HOME_TEXTS = [
  'meta.title', 'meta.description',
  'hero.eyebrow', 'hero.title', 'hero.lead', 'hero.noscript', 'hero.skipLink',
  'realisations.title', 'realisations.lead', 'realisations.allLink',
  'quality.title', 'quality.link',
  'quote.text', 'quote.button',
  'method.title', 'method.deliverablesLabel', 'method.deliverables', 'method.link',
  'publics.title',
  'paths.title', 'paths.note',
  'invitation.title', 'invitation.button', 'invitation.trainingText', 'invitation.trainingLinkLabel',
]
const HOME_LISTS = ['quality.points', 'method.steps', 'publics.items', 'paths.items']

export function loadHomeContent(directory?: string): HomeContent {
  return loadContent<HomeContent>('home', { text: HOME_TEXTS, list: HOME_LISTS }, directory)
}
