import { html } from '../html.js'
import { layout } from '../layout.js'
import { sectionHead, quoteLink, familyIcon } from '../components.js'
import { REALISATIONS } from '../content/realisations.js'
import { SITE } from '../layout.js'

const PUBLIC_EXAMPLES = {
  independants: ['Mails triés et réponses préparées', 'Relances et échéances suivies', 'Un tableau de bord lisible de l’activité'],
  pme: ['Applications métier et outils connectés', 'Assistant qui répond à partir de vos documents', 'Un agent partagé par l’équipe'],
}

const METHOD_STEPS = [
  ['Comprendre', 'Le besoin, les pratiques actuelles, les objectifs.'],
  ['Auditer ou cadrer', 'Un audit pour plusieurs projets, un cadrage pour une solution précise.'],
  ['Réaliser', 'Un périmètre explicite, des utilisateurs identifiés.'],
  ['Valider', 'Cas réels, erreurs, retours des utilisateurs.'],
  ['Accompagner', 'Prise en main, documentation et suivi.'],
]

const QUALITY_POINTS = [
  ['Cybersécurité et confidentialité', 'Quelles données circulent, qui y accède, avec quelles permissions.'],
  ['Gouvernance et responsabilités', 'Un responsable identifié, des actions autorisées, une validation humaine quand il le faut.'],
  ['Experts métiers', 'Les solutions confrontées aux règles et aux pratiques de la fonction ou du secteur.'],
  ['Vérifications et suivi', 'Cas de test, documentation, transmission et suivi après la livraison.'],
]

function hero() {
  return html`<section class="hero" aria-labelledby="hero-title">
    <div class="wrap hero__grid">
      <div class="hero__quiz">
        <p class="eyebrow"><span class="marker">IACareer · Agence IA</span></p>
        <h1 class="display" id="hero-title">Qu’est-ce que l’IA pourrait simplifier dans votre entreprise ?</h1>
        <p class="lead">Quelques questions pour faire apparaître des solutions adaptées à vos besoins et à votre organisation.</p>
        <div class="quiz" id="quiz" data-quiz aria-live="polite">
          <noscript>
            <p class="notice">Le questionnaire demande JavaScript. Vous pouvez parcourir l’offre directement.</p>
          </noscript>
        </div>
        <p class="hero__skip"><a href="/solutions">Voir toutes les solutions</a></p>
      </div>
      <div class="hero__mosaic">
        <h2 class="visually-hidden">Cartes de solutions</h2>
        <p class="mosaic-status" id="mosaic-status" role="status"></p>
        <ul class="mosaic" id="mosaic" data-mosaic></ul>
      </div>
    </div>
  </section>`
}

function twoWays() {
  return html`<section class="section" aria-labelledby="deux-facons">
    <div class="wrap">
      ${sectionHead({ marker: '01', title: 'Deux façons d’avancer', id: 'deux-facons' })}
      <div class="split">
        <article class="split__item">
          <h3>Un besoin précis à résoudre</h3>
          <p>Un projet ou un pack avec un cadrage adapté : vous savez ce qui vous gêne, nous définissons ensemble un périmètre clair.</p>
          <a class="text-link" href="/solutions">Parcourir les solutions</a>
        </article>
        <article class="split__item">
          <h3>Une transformation à organiser</h3>
          <p>Un audit initial, des priorités et une démarche d’accompagnement quand les idées et les usages sont dispersés.</p>
          <a class="text-link" href="/audit-transformation">Découvrir l’audit</a>
        </article>
      </div>
      <p class="muted note">Un audit global n’est pas le préalable obligé de chaque petite réalisation.</p>
    </div>
  </section>`
}

function audiences() {
  return html`<section class="section section--ruled" aria-labelledby="publics">
    <div class="wrap">
      ${sectionHead({ marker: '02', title: 'Deux publics, deux façons d’en tirer parti', id: 'publics' })}
      <div class="split">
        <article class="split__item">
          <h3>Indépendants</h3>
          <p>Moins de charge mentale : organisation, relation client, communication, gestion et pilotage.</p>
          <ul class="ticks">${PUBLIC_EXAMPLES.independants.map((item) => html`<li>${item}</li>`)}</ul>
          <a class="text-link" href="/solutions-independants">Solutions indépendants</a>
        </article>
        <article class="split__item">
          <h3>PME</h3>
          <p>Relier l’IA aux applications métier, aux données et au travail des équipes.</p>
          <ul class="ticks">${PUBLIC_EXAMPLES.pme.map((item) => html`<li>${item}</li>`)}</ul>
          <a class="text-link" href="/solutions-pme">Solutions PME</a>
        </article>
      </div>
    </div>
  </section>`
}

function method() {
  return html`<section class="section" aria-labelledby="methode">
    <div class="wrap">
      ${sectionHead({ marker: '03', title: 'Une méthode, de la compréhension à l’appropriation', id: 'methode' })}
      <ol class="steps">
        ${METHOD_STEPS.map(
          ([title, text], index) => html`<li><span class="steps__num">${String(index + 1).padStart(2, '0')}</span><h3>${title}</h3><p>${text}</p></li>`,
        )}
      </ol>
      <p class="deliverables"><strong>Selon la mission, vous recevez :</strong> un état des lieux, des priorités, une feuille de route, une solution utilisable, une documentation et une prise en main.</p>
      <a class="text-link" href="/audit-transformation">Voir la démarche en détail</a>
    </div>
  </section>`
}

function quoteBand() {
  return html`<section class="quote-band" aria-label="Citation">
    <div class="wrap quote-band__grid">
      <blockquote class="quote-band__quote">
        <p>« En matière d’IA, seul le premier pas coûte, le deuxième a déjà été remboursé… »</p>
      </blockquote>
      <div class="quote-band__action">${quoteLink()}</div>
    </div>
  </section>`
}

function realisations() {
  return html`<section class="section" aria-labelledby="realisations">
    <div class="wrap">
      ${sectionHead({
        marker: '04',
        title: 'Réalisations',
        id: 'realisations',
        lead: 'Quatre emplacements pour présenter des projets documentés. Aucun projet n’est présenté comme livré tant que sa fiche n’existe pas.',
      })}
      <ul class="realisations">
        ${REALISATIONS.map(
          (item) => html`<li class="realisation">
            <p class="tag">${item.nature}</p>
            <h3><a href="/realisations/${item.slug}">${item.title}</a></h3>
            <p class="muted">${item.status}</p>
            <p>${item.summary}</p>
          </li>`,
        )}
      </ul>
      <a class="text-link" href="/realisations">Toutes les réalisations</a>
    </div>
  </section>`
}

function quality() {
  return html`<section class="section section--ruled" aria-labelledby="qualite">
    <div class="wrap">
      ${sectionHead({ marker: '05', title: 'Qualité et garanties', id: 'qualite' })}
      <ul class="quality-list">
        ${QUALITY_POINTS.map(([title, text]) => html`<li>${familyIcon('audit')}<div><h3>${title}</h3><p>${text}</p></div></li>`)}
      </ul>
      <a class="text-link" href="/qualite-confiance">Qualité & confiance</a>
    </div>
  </section>`
}

function finalInvite() {
  return html`<section class="section final-invite" aria-labelledby="invitation">
    <div class="wrap">
      <h2 class="headline" id="invitation">Décrivez votre besoin et demandez un devis.</h2>
      <div class="actions">${quoteLink()}</div>
      <p class="muted">Pour faire progresser vos compétences en complément des réalisations, découvrez
        <a href="${SITE.trainingUrl}">formation.iacareer.fr</a>.</p>
    </div>
  </section>`
}

export function homePage() {
  return layout({
    title: 'IACareer Agence — Conseil et solutions IA pour indépendants et PME',
    description: 'Audit, conseil et développement de solutions d’IA pour les indépendants et les PME : analyse, réalisation et appropriation par les utilisateurs.',
    path: '/',
    scripts: ['/js/quiz.js'],
    bodyClass: 'is-home',
    body: html`${hero()}${twoWays()}${audiences()}${method()}${quoteBand()}${realisations()}${quality()}${finalInvite()}`,
  })
}
