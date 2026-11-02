import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import { CARDS } from '#shared/index'
import { OFFERS } from '#content/offers'
import { OBJECTS, PROFILES } from '#validators/devis'
import DevisService from '#services/devis_service'

/** Accepte un slug d'offre ou de carte et le ramène à une offre existante. */
function resolveSolution(slug?: string): string {
  if (!slug) return ''
  if (OFFERS.some((offer) => offer.slug === slug)) return slug
  return CARDS.find((card: { slug: string }) => card.slug === slug)?.offer ?? ''
}

@inject()
export default class ContactController {
  constructor(protected devis: DevisService) {}

  async show({ request, view }: HttpContext) {
    const { solution, objet } = request.qs()
    const values = {
      objet: objet in OBJECTS ? objet : solution ? 'solution' : '',
      solution: resolveSolution(solution),
    }
    return view.render('pages/contact', { values, errors: {}, status: null, profiles: PROFILES, objects: OBJECTS })
  }

  /** Envoi sans JavaScript : la page est ré-affichée avec la saisie conservée. */
  async storeForm({ request, response, view }: HttpContext) {
    const result = await this.devis.submit(request.all())
    const page = (status: string, values = {}, errors = {}) =>
      view.render('pages/contact', { values, errors, status, profiles: PROFILES, objects: OBJECTS })
    if (result.status === 'sent') return page('sent')
    response.status(result.status === 'invalid' ? 422 : 500)
    return page(result.status, result.values, result.status === 'invalid' ? result.errors : {})
  }

  /** Envoi avec JavaScript. */
  async storeJson({ request, response }: HttpContext) {
    const result = await this.devis.submit(request.all())
    if (result.status === 'sent') return { ok: true }
    if (result.status === 'invalid') {
      return response.unprocessableEntity({ ok: false, errors: result.errors, message: 'Certaines informations sont à corriger.' })
    }
    return response.internalServerError({ ok: false, errors: {}, message: 'La demande n’a pas pu être transmise.' })
  }
}
