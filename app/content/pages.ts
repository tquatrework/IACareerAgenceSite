import { loadContent } from '#services/content_loader'

/**
 * Textes des pages éditables dans content/<page>.yml (hors accueil et offres, qui ont leur module).
 * Les chemins listés ici sont exigés au démarrage ; le chargeur refuse en plus tout texte ou liste vide.
 */
const HEAD = ['head.eyebrow', 'head.title', 'head.lead']
const META = ['meta.title', 'meta.description']

const PAGE_REQUIREMENTS: Record<string, { text: string[]; list: string[] }> = {
  audit: {
    text: [
      ...META, ...HEAD, 'head.button', 'dimensions.title', 'deliverables.title', 'method.title',
      'levels.title', 'levels.lead', 'levels.questionnaire.title', 'levels.questionnaire.before',
      'levels.questionnaire.linkLabel', 'levels.questionnaire.after', 'levels.note', 'cta.text',
    ],
    list: ['dimensions.items', 'deliverables.ticks', 'method.steps', 'levels.items'],
  },
  independants: {
    text: [...META, ...HEAD, 'head.button', 'recognize.title', 'recognize.paragraph', 'packs.title', 'packs.note', 'packs.allLink'],
    list: ['recognize.ticks'],
  },
  pme: {
    text: [
      ...META, ...HEAD, 'head.button', 'contexts.title', 'contexts.paragraph', 'families.title', 'families.note',
      'families.allLink',
    ],
    list: ['contexts.ticks', 'contexts.glossary'],
  },
  qualite: { text: [...META, ...HEAD], list: ['sections'] },
  solutions: {
    text: [...META, ...HEAD, 'cardLinks.details', 'cardLinks.quote'],
    list: ['glossary'],
  },
}

/* eslint-disable @typescript-eslint/no-explicit-any -- le gabarit lit ces contenus par leurs clés YAML */
export type PageContent = Record<string, any>

export function loadPages(directory?: string): Record<string, PageContent> {
  const pages: Record<string, PageContent> = {}
  for (const [name, requirements] of Object.entries(PAGE_REQUIREMENTS)) {
    pages[name] = loadContent<PageContent>(name, requirements, directory)
  }
  for (const [index, section] of (pages.qualite.sections as PageContent[]).entries()) {
    if (typeof section.title !== 'string') {
      throw new Error(`content/qualite.yml : le bloc n° ${index + 1} de « sections » n’a pas de « title »`)
    }
  }
  return pages
}
