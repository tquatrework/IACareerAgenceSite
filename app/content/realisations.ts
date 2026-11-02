import { loadContent } from '#services/content_loader'

// Quatre emplacements prévus (specs.md §11). Aucune réalisation n’est encore documentée :
// les entrées de content/realisations.yml sont des pistes de projets internes, présentées comme non livrées.

interface RealisationsFile {
  items: { slug: string; title: string; theme: string }[]
  defaults: { nature: string; status: string; summary: string }
  ficheSections: string[]
  listPage: {
    meta: { title: string; description: string }
    head: { eyebrow: string; title: string; lead: string }
    note: string
  }
  detailPage: { descriptionSuffix: string; leadSuffix: string; button: string; sectionTitle: string; backLink: string }
}

const content = loadContent<RealisationsFile>('realisations', {
  list: ['items', 'ficheSections'],
  text: [
    'defaults.nature', 'defaults.status', 'defaults.summary',
    'listPage.meta.title', 'listPage.meta.description', 'listPage.head.eyebrow', 'listPage.head.title',
    'listPage.head.lead', 'listPage.note',
    'detailPage.descriptionSuffix', 'detailPage.leadSuffix', 'detailPage.button', 'detailPage.sectionTitle',
    'detailPage.backLink',
  ],
})

const slugs = new Set<string>()
content.items.forEach((item, index) => {
  const where = `content/realisations.yml : emplacement n° ${index + 1}`
  if (typeof item.slug !== 'string' || !/^[a-z0-9-]+$/.test(item.slug)) {
    throw new Error(`${where} : « slug » doit contenir seulement minuscules, chiffres et tirets`)
  }
  if (slugs.has(item.slug)) throw new Error(`${where} : « slug » en double (${item.slug})`)
  slugs.add(item.slug)
  for (const key of ['title', 'theme'] as const) {
    if (typeof item[key] !== 'string' || item[key].trim() === '') throw new Error(`${where} : « ${key} » est absent ou vide`)
  }
})

export const REALISATIONS = content.items.map((item) => ({ ...content.defaults, ...item }))
export const REALISATIONS_PAGES = { list: content.listPage, detail: content.detailPage }
export const FICHE_SECTIONS: string[] = content.ficheSections

export function findRealisation(slug: string) {
  return REALISATIONS.find((item) => item.slug === slug)
}
