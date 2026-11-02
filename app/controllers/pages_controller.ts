import type { HttpContext } from '@adonisjs/core/http'
import { findOffer } from '#content/offers'
import { findRealisation } from '#content/realisations'

export default class PagesController {
  /** Fiche détaillée d'un pack ou d'une famille de solutions. */
  async offer({ params, view, response }: HttpContext) {
    const offer = findOffer(params.slug)
    if (!offer) return response.notFound(await view.render('pages/errors/not_found'))
    return view.render('pages/offer', { offer })
  }

  /** Détail d'un emplacement de réalisation. */
  async realisation({ params, view, response }: HttpContext) {
    const realisation = findRealisation(params.slug)
    if (!realisation) return response.notFound(await view.render('pages/errors/not_found'))
    return view.render('pages/realisation', { realisation })
  }
}
