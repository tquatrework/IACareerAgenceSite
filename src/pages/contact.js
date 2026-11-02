import { html } from '../html.js'
import { layout, SITE } from '../layout.js'
import { pageHeader } from '../components.js'
import { OFFERS } from '../content/offers.js'
import { CARDS } from '../../shared/catalog.js'
import { PROFILES, OBJECTS } from '../devis.js'

// Accepte un slug d’offre ou de carte et le ramène à une offre de la liste.
export function resolveSolution(slug) {
  if (!slug) return ''
  if (OFFERS.some((offer) => offer.slug === slug)) return slug
  const card = CARDS.find((item) => item.slug === slug)
  return card?.offer ?? ''
}

function field({ name, label, error, required, children, hint }) {
  return html`<div class="field ${error ? 'field--error' : ''}">
    <label for="${name}">${label}${required ? html` <span class="required">(obligatoire)</span>` : html` <span class="optional">(facultatif)</span>`}</label>
    ${hint ? html`<p class="hint" id="${name}-hint">${hint}</p>` : ''}
    ${children}
    ${error ? html`<p class="error" id="${name}-error">${error}</p>` : ''}
  </div>`
}

function describedBy(name, errors, hint) {
  return [hint ? `${name}-hint` : '', errors[name] ? `${name}-error` : ''].filter(Boolean).join(' ')
}

function selectOptions(map, selected) {
  return Object.entries(map).map(([value, label]) => html`<option value="${value}" ${value === selected ? html`selected` : ''}>${label}</option>`)
}

// status : null | 'sent' | 'error' ; values/errors conservent la saisie en cas de problème (sans JavaScript).
export function contactPage({ values = {}, errors = {}, status = null, query = {} } = {}) {
  const current = {
    name: values.name ?? '',
    email: values.email ?? '',
    organisation: values.organisation ?? '',
    phone: values.phone ?? '',
    profile: values.profile ?? '',
    objet: values.objet ?? (OBJECTS[query.objet] ? query.objet : query.solution ? 'solution' : ''),
    solution: values.solution ?? resolveSolution(query.solution),
    message: values.message ?? '',
    quizSummary: values.quizSummary ?? '',
  }
  const body = html`
    ${pageHeader({
      eyebrow: 'Contact / demande de devis',
      title: 'Décrivez votre besoin.',
      lead: 'Demandez un devis pour une solution, ou sollicitez un échange sur un audit. Ce premier contact ne demande ni accès, ni document confidentiel.',
    })}
    <section class="section"><div class="wrap contact-grid">
      <div>
        <div id="form-status" class="status" role="status" tabindex="-1">
          ${status === 'sent' ? html`<p class="notice notice--ok"><strong>Votre demande a bien été reçue.</strong> Nous revenons vers vous à l’adresse indiquée.</p>` : ''}
          ${status === 'error' ? html`<p class="notice notice--error"><strong>Votre demande n’a pas pu être transmise.</strong> Votre message est conservé ci-dessous : vous pouvez le corriger ou réessayer.</p>` : ''}
          ${status === 'invalid' ? html`<p class="notice notice--error"><strong>Quelques informations sont à corriger.</strong> Votre saisie est conservée.</p>` : ''}
        </div>
        <form id="devis-form" method="post" action="/contact" novalidate ${status === 'sent' ? html`hidden` : ''}>
          ${field({ name: 'name', label: 'Nom', required: true, error: errors.name, children: html`<input id="name" name="name" type="text" autocomplete="name" required maxlength="120" value="${current.name}" aria-describedby="${describedBy('name', errors)}" ${errors.name ? html`aria-invalid="true"` : ''} />` })}
          ${field({ name: 'email', label: 'Adresse email', required: true, error: errors.email, children: html`<input id="email" name="email" type="email" autocomplete="email" required maxlength="254" value="${current.email}" aria-describedby="${describedBy('email', errors)}" ${errors.email ? html`aria-invalid="true"` : ''} />` })}
          ${field({ name: 'organisation', label: 'Organisation', error: errors.organisation, children: html`<input id="organisation" name="organisation" type="text" autocomplete="organization" maxlength="150" value="${current.organisation}" />` })}
          ${field({ name: 'phone', label: 'Téléphone', error: errors.phone, children: html`<input id="phone" name="phone" type="tel" autocomplete="tel" maxlength="30" value="${current.phone}" aria-describedby="${describedBy('phone', errors)}" ${errors.phone ? html`aria-invalid="true"` : ''} />` })}
          ${field({ name: 'profile', label: 'Votre profil', required: true, error: errors.profile, children: html`<select id="profile" name="profile" required aria-describedby="${describedBy('profile', errors)}" ${errors.profile ? html`aria-invalid="true"` : ''}><option value="">Choisir…</option>${selectOptions(PROFILES, current.profile)}</select>` })}
          ${field({ name: 'objet', label: 'Objet de la demande', required: true, error: errors.objet, children: html`<select id="objet" name="objet" required aria-describedby="${describedBy('objet', errors)}" ${errors.objet ? html`aria-invalid="true"` : ''}><option value="">Choisir…</option>${selectOptions(OBJECTS, current.objet)}</select>` })}
          ${field({ name: 'solution', label: 'Solution ou pack concerné', children: html`<select id="solution" name="solution"><option value="">Aucun / je ne sais pas encore</option>${OFFERS.map((offer) => html`<option value="${offer.slug}" ${offer.slug === current.solution ? html`selected` : ''}>${offer.kind} — ${offer.title}</option>`)}</select>` })}
          ${field({ name: 'message', label: 'Votre message', required: true, error: errors.message, hint: 'Décrivez la situation et ce que vous aimeriez améliorer.', children: html`<textarea id="message" name="message" rows="6" required maxlength="5000" aria-describedby="${describedBy('message', errors, true)}" ${errors.message ? html`aria-invalid="true"` : ''}>${current.message}</textarea>` })}
          <fieldset class="quiz-context" id="quiz-context" ${current.quizSummary ? '' : html`hidden`}>
            <legend>Résumé de votre questionnaire</legend>
            <p class="hint" id="quizSummary-hint">Ce résumé est joint à votre demande. Vous pouvez le modifier ou le retirer avant l’envoi.</p>
            <label class="visually-hidden" for="quizSummary">Résumé du questionnaire</label>
            <textarea id="quizSummary" name="quizSummary" rows="6" maxlength="2000" aria-describedby="quizSummary-hint">${current.quizSummary}</textarea>
            <button type="button" class="button button--ghost" data-remove-context>Retirer ce résumé</button>
          </fieldset>
          <div class="trap" aria-hidden="true"><label for="website">Ne pas remplir</label><input id="website" name="website" type="text" tabindex="-1" autocomplete="off" /></div>
          <p class="hint">Les informations saisies servent uniquement à traiter votre demande. <a href="/mentions-legales">Confidentialité</a>.</p>
          <button class="button button--primary" type="submit">Envoyer ma demande</button>
        </form>
      </div>
      <aside class="contact-aside" aria-label="Coordonnées">
        <h2 class="subhead">Coordonnées</h2>
        <p><a href="mailto:${SITE.email}">${SITE.email}</a><br /><a href="tel:${SITE.phoneHref}">${SITE.phone}</a></p>
        <p class="muted">IACareer — agence IA, VisioScience SASU.</p>
      </aside>
    </div></section>`
  return layout({
    title: 'Contact / demande de devis',
    description: 'Décrivez votre besoin et demandez un devis ou un échange sur un audit IA auprès d’IACareer.',
    path: '/contact',
    scripts: ['/js/contact.js'],
    body,
  })
}
