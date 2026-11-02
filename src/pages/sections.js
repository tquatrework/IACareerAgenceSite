import { html } from '../html.js'
import { layout, SITE } from '../layout.js'
import { pageHeader, sectionHead, quoteLink, offerTeaser, catalogEntry, cardsForOffer } from '../components.js'
import { CARDS, FAMILIES } from '../../shared/catalog.js'
import { OFFERS, findOffer, SECTOR_EXAMPLES_PME } from '../content/offers.js'
import { REALISATIONS, findRealisation, FICHE_SECTIONS } from '../content/realisations.js'

function list(items, className = 'ticks') {
  return html`<ul class="${className}">${items.map((item) => html`<li>${item}</li>`)}</ul>`
}

function closingQuote(text = 'Parlez-nous de votre besoin.', params = '') {
  return html`<section class="section final-invite"><div class="wrap">
    <h2 class="headline">${text}</h2>
    <div class="actions">${quoteLink('Demandez un devis', params)}</div>
  </div></section>`
}

export function auditPage() {
  const body = html`
    ${pageHeader({
      eyebrow: 'Audit & transformation',
      title: 'Savoir où investir, puis avancer dans le bon ordre.',
      lead: 'L’audit s’adresse à celles et ceux qui ont plusieurs idées, des usages dispersés ou besoin de fixer leurs priorités avant d’engager un projet.',
      actions: quoteLink('Demandez un devis', '?objet=audit'),
    })}
    <section class="section"><div class="wrap">
      ${sectionHead({ marker: '01', title: 'Deux dimensions examinées' })}
      <div class="split">
        <article class="split__item"><h3>Maturité</h3>
          ${list(['Quels usages de l’IA existent déjà ?', 'Quels outils, données et compétences sont disponibles ?', 'Quelles règles, responsabilités et contraintes encadrent ces usages ?'])}
        </article>
        <article class="split__item"><h3>Opportunités</h3>
          ${list(['Quelles tâches posent problème ?', 'Où se trouvent les répétitions, ressaisies, oublis ou difficultés d’accès à l’information ?', 'Quels projets méritent un examen prioritaire ?'])}
        </article>
      </div>
    </div></section>
    <section class="section section--ruled"><div class="wrap">
      ${sectionHead({ marker: '02', title: 'Ce que vous obtenez' })}
      ${list(['Un état des lieux des usages, outils et données.', 'Une cartographie des processus ou tâches concernés.', 'Des opportunités décrites et hiérarchisées.', 'Les conditions de faisabilité et les points de vigilance.', 'Une feuille de route adaptée à votre organisation.'])}
    </div></section>
    <section class="section"><div class="wrap">
      ${sectionHead({ marker: '03', title: 'La démarche en cinq temps' })}
      <ol class="steps">
        ${[['Comprendre', 'Besoins, pratiques actuelles et objectifs.'], ['Évaluer et prioriser', 'Opportunités, données, contraintes et critères de réussite.'], ['Réaliser un premier projet', 'Périmètre explicite et utilisateurs identifiés.'], ['Vérifier et ajuster', 'Résultats observés, erreurs, cas difficiles et retours des utilisateurs.'], ['Déployer et accompagner', 'Appropriation, responsabilités, documentation et suivi.']].map(
          ([title, text], index) => html`<li><span class="steps__num">${String(index + 1).padStart(2, '0')}</span><h3>${title}</h3><p>${text}</p></li>`,
        )}
      </ol>
    </div></section>
    <section class="section section--ruled"><div class="wrap">
      ${sectionHead({ marker: '04', title: 'Trois niveaux de profondeur', lead: 'Un audit global n’est pas nécessaire avant chaque petite réalisation.' })}
      <div class="levels">
        <article><h3>Le questionnaire</h3><p>Une première orientation, sans inscription, depuis <a href="/">l’accueil</a>. Elle ne remplace ni un cadrage ni un audit.</p></article>
        <article><h3>Le cadrage</h3><p>La vérification du besoin et du périmètre d’une solution précise.</p></article>
        <article><h3>L’audit</h3><p>Un examen plus large, qui prépare plusieurs projets ou une transformation.</p></article>
      </div>
      <p class="muted note">Les durées, tarifs et modalités de ces prestations sont précisés dans le devis.</p>
    </div></section>
    ${closingQuote('Demandez un échange sur un audit.', '?objet=audit')}`
  return layout({
    title: 'Audit & transformation',
    description: 'Évaluer la maturité, repérer les opportunités et organiser une transformation par l’IA, avec une méthode en cinq temps.',
    path: '/audit-transformation',
    body,
  })
}

function audiencePage({ path, title, eyebrow, lead, offers, extra, metaDescription }) {
  const body = html`
    ${pageHeader({ eyebrow, title, lead, actions: quoteLink() })}
    ${extra}
    <section class="section section--ruled"><div class="wrap">
      ${sectionHead({ marker: '·', title: offers[0].kind === 'Pack' ? 'Six packs, combinables' : 'Huit familles de solutions' })}
      <ul class="teasers">${offers.map(offerTeaser)}</ul>
      <p class="muted note">${offers[0].kind === 'Pack' ? 'Chaque pack répond à un besoin délimité. Ils peuvent être combinés ; ils ne forment pas un forfait unique imposant tous les services.' : 'Chaque fiche précise le périmètre, les utilisateurs, les droits, les sources documentaires et les validations.'}</p>
      <a class="text-link" href="/solutions">Voir les trente solutions</a>
    </div></section>
    ${closingQuote()}`
  return layout({ title, description: metaDescription, path, body })
}

export function independantsPage() {
  const offers = OFFERS.filter((offer) => offer.audience === 'independant')
  return audiencePage({
    path: '/solutions-independants',
    eyebrow: 'Solutions indépendants',
    title: 'Moins de charge mentale, une activité mieux suivie.',
    lead: 'Boîte mail encombrée, relances oubliées, informations clients éparpillées, communication irrégulière, chiffres difficiles à suivre : chaque pack répond à une situation précise.',
    metaDescription: 'Packs IA pour indépendants : messagerie, relation client, pilotage, communication, documents et site web.',
    offers,
    extra: html`<section class="section"><div class="wrap">
      ${sectionHead({ marker: '·', title: 'Vous vous reconnaissez ?' })}
      ${list(['Une boîte mail qui déborde.', 'Des relances oubliées.', 'Des informations clients éparpillées.', 'Une communication irrégulière.', 'Des chiffres difficiles à suivre.', 'Un administratif envahissant.'])}
      <p>Le développement de sites avec l’aide de l’IA fait partie de l’offre, avec l’objectif d’un coût et d’une maintenance réduits. Les conditions commerciales sont précisées dans le devis.</p>
    </div></section>`,
  })
}

export function pmePage() {
  const offers = OFFERS.filter((offer) => offer.audience === 'pme')
  return audiencePage({
    path: '/solutions-pme',
    eyebrow: 'Solutions PME',
    title: 'Relier l’IA à vos outils, à vos données et au travail de vos équipes.',
    lead: 'Des solutions intégrées au fonctionnement collectif, avec un périmètre d’action et des responsabilités compréhensibles : les collaborateurs les utilisent et les contrôlent.',
    metaDescription: 'Solutions IA pour PME : applications métier, connexions aux outils, assistants, RAG, agents et automatisation.',
    offers,
    extra: html`<section class="section"><div class="wrap">
      ${sectionHead({ marker: '·', title: 'Par fonction ou par secteur' })}
      <p>Commercial, support, opérations, finance, ressources humaines ou direction : les exemples varient selon la fonction. Le secteur rend les situations concrètes. Ces exemples illustrent des usages possibles, pas des réalisations déjà livrées.</p>
      ${list(SECTOR_EXAMPLES_PME)}
      <dl class="glossary">
        <dt>RAG</dt><dd>Un assistant qui cherche dans vos documents et cite ses sources pour répondre.</dd>
        <dt>MCP / API</dt><dd>Des moyens de connecter un assistant IA à vos logiciels, avec des droits précis.</dd>
        <dt>Agent</dt><dd>Un assistant capable d’accomplir des actions définies, sous votre contrôle.</dd>
      </dl>
    </div></section>`,
  })
}

export function solutionsCatalogPage() {
  const families = Object.entries(FAMILIES)
  const body = html`
    ${pageHeader({
      eyebrow: 'Toutes les solutions',
      title: 'Trente types de solutions, à combiner.',
      lead: 'Ces cartes représentent des types de solutions, pas trente packs indépendants : certaines sont des briques d’un même projet. Un traitement de mails peut alimenter un CRM et un tableau de bord ; un chatbot peut s’appuyer sur un RAG.',
    })}
    <section class="section"><div class="wrap">
      ${families.map(([key, label]) => {
        const cards = CARDS.filter((card) => card.family === key)
        return html`<section class="family" aria-labelledby="fam-${key}">
          <h2 class="subhead" id="fam-${key}">${label}</h2>
          <ul class="catalog">${cards.map(catalogEntry)}</ul>
        </section>`
      })}
      <dl class="glossary">
        <dt>SEO / GEO</dt><dd>Être trouvé dans les moteurs de recherche (SEO) et cité par les moteurs d’IA (GEO).</dd>
        <dt>CRM</dt><dd>Outil de suivi des clients et des prospects.</dd>
        <dt>RAG</dt><dd>Réponses élaborées à partir de vos documents, avec les sources.</dd>
        <dt>MCP / API</dt><dd>Moyens de connecter des assistants IA à vos logiciels.</dd>
      </dl>
    </div></section>
    ${closingQuote()}`
  return layout({
    title: 'Toutes les solutions',
    description: 'Le catalogue des trente types de solutions IA proposés par IACareer pour les indépendants et les PME.',
    path: '/solutions',
    body,
  })
}

function receivesList(offer) {
  return list(offer.receives)
}

export function offerPage(slug) {
  const offer = findOffer(slug)
  if (!offer) return null
  const related = cardsForOffer(offer)
  const backHref = offer.audience === 'pme' ? '/solutions-pme' : '/solutions-independants'
  const body = html`
    ${pageHeader({
      eyebrow: `${offer.kind} · ${offer.audience === 'pme' ? 'Solutions PME' : 'Solutions indépendants'}`,
      title: offer.title,
      lead: offer.summary,
      actions: quoteLink('Demandez un devis pour ce ' + offer.kind.toLowerCase(), `?solution=${offer.slug}`),
    })}
    <section class="section"><div class="wrap fiche">
      <div class="fiche__row"><h2 class="subhead">Le problème traité</h2><p>${offer.problem}</p></div>
      <div class="fiche__row"><h2 class="subhead">Personnes et situations concernées</h2><p>${offer.concerned}</p></div>
      <div class="fiche__row"><h2 class="subhead">Ce que vous recevez</h2>${receivesList(offer)}</div>
      <div class="fiche__row"><h2 class="subhead">Outils et documents nécessaires</h2>${list(offer.tools)}</div>
      <div class="fiche__row"><h2 class="subhead">Dans le périmètre</h2>${list(offer.inScope)}</div>
      <div class="fiche__row"><h2 class="subhead">Relève d’une adaptation</h2>${list(offer.adaptation)}</div>
      <div class="fiche__row"><h2 class="subhead">Validations à votre charge</h2>${list(offer.validations)}</div>
      <div class="fiche__row"><h2 class="subhead">Prise en main, maintenance et suivi</h2><p>Les conditions de prise en main, de maintenance et de suivi sont précisées dans le devis, selon le périmètre retenu.</p></div>
      <div class="fiche__row"><h2 class="subhead">Prix</h2><p><strong>Sur devis.</strong> Les abonnements, licences et consommations récurrents éventuels sont indiqués dans le devis.</p></div>
      <div class="fiche__row"><h2 class="subhead">Réalisation associée</h2><p>Aucune réalisation n’est encore publiée pour cette offre. <a href="/realisations">Voir les réalisations</a>.</p></div>
      <div class="fiche__row"><h2 class="subhead">Solutions concernées</h2>
        <ul class="ticks">${related.map((card) => html`<li><a href="/solutions#${card.slug}">${card.title}</a></li>`)}</ul></div>
    </div></section>
    ${closingQuote('Cette offre correspond à votre besoin ?', `?solution=${offer.slug}`)}
    <div class="wrap back-link"><a class="text-link" href="${backHref}">Retour aux offres</a></div>`
  return layout({
    title: offer.title,
    description: `${offer.summary} ${offer.problem}`.slice(0, 240),
    path: `/solutions/${offer.slug}`,
    body,
  })
}

export function qualityPage() {
  const body = html`
    ${pageHeader({
      eyebrow: 'Qualité & confiance',
      title: 'Comment les projets sont encadrés.',
      lead: 'Cybersécurité, gouvernance, experts métiers, validation et suivi : ce que vous pouvez attendre d’un projet, et ce qui reste de votre responsabilité.',
    })}
    <section class="section"><div class="wrap">
      ${sectionHead({ marker: '01', title: 'Cybersécurité et confidentialité' })}
      ${list(['Données utilisées et circulation de l’information.', 'Accès aux outils et permissions.', 'Confidentialité, hébergement et prestataires concernés.', 'Protection des connexions et des informations sensibles.', 'Risques propres aux usages et aux agents IA.', 'Gestion des anomalies et des incidents selon le projet.'])}
      <p class="notice">IACareer travaille avec des partenaires en cybersécurité. Leurs noms, rôles et modalités d’intervention seront présentés ici une fois confirmés.</p>
    </div></section>
    <section class="section section--ruled"><div class="wrap">
      ${sectionHead({ marker: '02', title: 'Gouvernance' })}
      ${list(['Le responsable du système.', 'Les utilisateurs et leurs droits.', 'Les usages et actions autorisés.', 'Les situations exigeant une validation humaine.', 'La traçabilité et les possibilités de contrôle.', 'Les responsabilités de maintenance et de mise à jour.'])}
      <p class="notice">Des partenaires en gouvernance existent également ; leur présentation sera ajoutée une fois confirmée.</p>
    </div></section>
    <section class="section"><div class="wrap">
      ${sectionHead({ marker: '03', title: 'Experts métiers', lead: 'Leur rôle : confronter les solutions aux règles, aux pratiques et aux contraintes du métier.' })}
      <div class="split">
        <article class="split__item"><h3>Par fonction</h3><p>Commercial, ressources humaines, finance, opérations, support, direction.</p></article>
        <article class="split__item"><h3>Par secteur</h3><p>Selon les besoins et les compétences effectivement mobilisables pour votre projet.</p></article>
      </div>
      <p class="muted note">Nous n’affichons pas d’expert pour une fonction ou un secteur tant que son intervention n’est pas établie.</p>
    </div></section>
    <section class="section section--ruled"><div class="wrap">
      ${sectionHead({ marker: '04', title: 'Qualité des réalisations', lead: 'Un projet commence par un besoin défini et des résultats attendus.' })}
      ${list(['Des cas de vérification, dont les cas difficiles.', 'La prise en compte des erreurs et des exceptions.', 'Les retours des utilisateurs.', 'Une documentation et une appropriation par les équipes.', 'Une place précisée pour la validation humaine : nous ne promettons pas une autonomie totale dans toutes les situations.'])}
    </div></section>
    <section class="section"><div class="wrap">
      ${sectionHead({ marker: '05', title: 'Garanties et accompagnement' })}
      ${list(['Périmètre et livrables convenus.', 'Conditions de validation de la réalisation.', 'Maintenance et assistance.', 'Propriété, licences et conditions d’utilisation.', 'Transmission, autonomie et possibilités de reprise.', 'Suivi et évolution.'])}
      <p class="muted note">Ces points sont détaillés dans le devis de chaque projet.</p>
    </div></section>
    ${closingQuote()}`
  return layout({
    title: 'Qualité & confiance',
    description: 'Cybersécurité, gouvernance, experts métiers, validation et suivi : comment IACareer encadre ses projets IA.',
    path: '/qualite-confiance',
    body,
  })
}

export function realisationsPage() {
  const body = html`
    ${pageHeader({
      eyebrow: 'Réalisations',
      title: 'Des projets documentés, avec leurs limites.',
      lead: 'Les quatre emplacements ci-dessous sont réservés. Aucune réalisation n’est encore publiée : nous ne présentons pas comme livré un projet qui ne l’est pas.',
    })}
    <section class="section"><div class="wrap">
      <ul class="realisations realisations--wide">
        ${REALISATIONS.map(
          (item) => html`<li class="realisation">
            <p class="tag">${item.nature}</p>
            <h2 class="subhead"><a href="/realisations/${item.slug}">${item.title}</a></h2>
            <p class="muted">${item.theme} · ${item.status}</p>
            <p>${item.summary}</p>
          </li>`,
        )}
      </ul>
      <p class="muted note">Les projets internes porteront la mention « Projet interne IACareer » ; les projets clients et les prototypes seront identifiés comme tels, avec leur état d’avancement.</p>
    </div></section>
    ${closingQuote()}`
  return layout({
    title: 'Réalisations',
    description: 'Les réalisations IACareer : emplacements réservés, projets internes et projets clients identifiés comme tels.',
    path: '/realisations',
    body,
  })
}

export function realisationPage(slug) {
  const item = findRealisation(slug)
  if (!item) return null
  const body = html`
    ${pageHeader({
      eyebrow: item.nature,
      title: item.title,
      lead: `${item.status}. Ce projet n’est pas présenté comme livré.`,
      actions: quoteLink('Demander une réalisation comparable', `?objet=solution&realisation=${item.slug}`),
    })}
    <section class="section"><div class="wrap">
      ${sectionHead({ title: 'Ce que contiendra la fiche' })}
      ${list(FICHE_SECTIONS)}
      <a class="text-link" href="/realisations">Toutes les réalisations</a>
    </div></section>`
  return layout({
    title: item.title,
    description: `${item.title} : emplacement de réalisation en préparation.`,
    path: `/realisations/${item.slug}`,
    noindex: true,
    body,
  })
}

export function legalPage() {
  const body = html`
    ${pageHeader({ eyebrow: 'Informations légales', title: 'Mentions légales et confidentialité' })}
    <section class="section"><div class="wrap prose">
      <h2 class="subhead">Éditeur du site</h2>
      <p>Le site ${SITE.url.replace('https://', '')} est édité par <strong>VisioScience SASU</strong>, sous la marque IACareer.</p>
      <p class="notice">À compléter par l’éditeur : forme et capital, adresse du siège, numéro d’immatriculation, numéro de TVA, directeur de la publication.</p>
      <p>Contact : <a href="mailto:${SITE.email}">${SITE.email}</a> · <a href="tel:${SITE.phoneHref}">${SITE.phone}</a></p>
      <h2 class="subhead">Hébergement</h2>
      <p class="notice">À compléter : nom et coordonnées de l’hébergeur.</p>
      <h2 class="subhead">Données personnelles</h2>
      <h3>Questionnaire de l’accueil</h3>
      <p>Les réponses au questionnaire restent dans votre navigateur, le temps de la session. Elles ne sont pas transmises à nos serveurs lorsque vous découvrez les résultats. Aucune inscription ni coordonnée n’est demandée.</p>
      <h3>Formulaire de contact et de devis</h3>
      <p>Les informations saisies (nom, adresse email, organisation et téléphone facultatifs, profil, objet, message) servent uniquement à traiter votre demande. Si vous arrivez depuis le questionnaire, un résumé de vos réponses est affiché dans le formulaire : vous pouvez le modifier ou le retirer avant l’envoi, et il n’est transmis que si vous l’envoyez.</p>
      <p>N’y transmettez ni accès, ni mot de passe, ni document confidentiel.</p>
      <p class="notice">À compléter : base légale, durée de conservation, destinataires et sous-traitants effectifs, modalités d’exercice de vos droits (accès, rectification, effacement) et contact dédié.</p>
      <h3>Cookies et traceurs</h3>
      <p>Ce site n’utilise ni cookie publicitaire ni outil de mesure d’audience tiers. Il ne charge aucune police ni ressource externe.</p>
    </div></section>`
  return layout({ title: 'Mentions légales et confidentialité', description: 'Mentions légales et politique de confidentialité du site agence.iacareer.fr.', path: '/mentions-legales', body })
}
