/*
|--------------------------------------------------------------------------
| Routes du site agence.iacareer.fr (voir docs/routes.md)
|--------------------------------------------------------------------------
*/

import router from '@adonisjs/core/services/router'
import { throttleDevis } from '#start/limiter'

const PagesController = () => import('#controllers/pages_controller')
const ContactController = () => import('#controllers/contact_controller')

router.on('/').render('pages/home').as('home')
router.on('/audit-transformation').render('pages/audit').as('audit')
router.on('/solutions-independants').render('pages/independants').as('independants')
router.on('/solutions-pme').render('pages/pme').as('pme')
router.on('/solutions').render('pages/solutions').as('solutions')
router.get('/solutions/:slug', [PagesController, 'offer']).as('offer').where('slug', /^[a-z0-9-]+$/)
router.on('/qualite-confiance').render('pages/qualite').as('qualite')
router.on('/realisations').render('pages/realisations').as('realisations')
router.get('/realisations/:slug', [PagesController, 'realisation']).as('realisation').where('slug', /^[a-z0-9-]+$/)
router.on('/mentions-legales').render('pages/legal').as('legal')

router.get('/contact', [ContactController, 'show']).as('contact')
router.post('/contact', [ContactController, 'storeForm']).use(throttleDevis)
router.post('/api/devis', [ContactController, 'storeJson']).use(throttleDevis)

router.get('/robots.txt', ({ response }) => {
  response.type('text/plain')
  return 'User-agent: *\nAllow: /\nSitemap: https://agence.iacareer.fr/sitemap.xml\n'
})

router.get('/sitemap.xml', async ({ response, view }) => {
  response.type('application/xml')
  return view.render('sitemap')
})
