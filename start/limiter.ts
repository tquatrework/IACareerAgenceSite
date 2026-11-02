/*
|--------------------------------------------------------------------------
| Limites de débit HTTP
|--------------------------------------------------------------------------
*/

import limiter from '@adonisjs/limiter/services/main'

/**
 * Demandes de devis : au plus 10 par heure et par adresse IP.
 * L'IP réelle derrière un reverse proxy dépend de TRUSTED_PROXIES (config/app.ts).
 */
export const throttleDevis = limiter.define('devis', (ctx) => {
  return limiter.allowRequests(10).every('1 hour').usingKey(`devis_${ctx.request.ip()}`)
})
