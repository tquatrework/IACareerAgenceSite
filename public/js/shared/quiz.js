// Questionnaire d’accueil : questions (specs.md §5.3) et correspondances besoin → cartes (§5.4).
// Le résultat exprime une orientation, jamais une rentabilité, une conformité ou une faisabilité.

import { CARDS } from './catalog.js'

export const QUESTIONS = [
  {
    id: 'org',
    title: 'Pour quelle organisation cherchez-vous une solution ?',
    mode: 'single',
    options: [
      { id: 'independent', label: 'Une activité indépendante, exercée seul' },
      { id: 'team', label: 'Une entreprise avec une équipe, notamment une TPE ou une PME' },
      { id: 'other', label: 'Une autre organisation / je ne sais pas encore' },
    ],
  },
  {
    id: 'needs',
    title: 'Qu’aimeriez-vous améliorer en priorité ?',
    hint: 'Une à trois réponses.',
    mode: 'multiple',
    min: 1,
    max: 3,
    options: [
      { id: 'mails_admin', label: 'Alléger les mails et l’administratif' },
      { id: 'prospects', label: 'Mieux suivre les prospects et les clients' },
      { id: 'documents', label: 'Retrouver et exploiter les documents' },
      { id: 'pilotage', label: 'Mieux piloter l’activité' },
      { id: 'site', label: 'Améliorer le site et la communication' },
      { id: 'demandes', label: 'Répondre aux demandes clients ou internes' },
      { id: 'outils', label: 'Relier les outils et fluidifier les processus' },
      { id: 'depart', label: 'Savoir par où commencer' },
    ],
  },
  {
    id: 'tasks',
    title: 'Sur quelles tâches voudriez-vous agir ?',
    hint: 'Une à quatre réponses, ou « Je ne sais pas encore ».',
    mode: 'multiple',
    min: 1,
    max: 4,
    exclusive: ['unknown'],
    options: [
      { id: 'mails', label: 'Trier les mails et préparer des réponses' },
      { id: 'rdv', label: 'Transformer les rendez-vous en notes et actions' },
      { id: 'relances', label: 'Suivre les relances et les échéances' },
      { id: 'devis', label: 'Préparer les devis et les propositions commerciales' },
      { id: 'faq', label: 'Répondre aux questions récurrentes' },
      { id: 'docs', label: 'Chercher dans les documents et les procédures' },
      { id: 'extraction', label: 'Extraire ou vérifier des informations dans des dossiers' },
      { id: 'chiffres', label: 'Regrouper les chiffres et préparer des rapports' },
      { id: 'contenus', label: 'Créer ou actualiser des contenus et le site' },
      { id: 'ressaisies', label: 'Éviter les ressaisies entre logiciels' },
      { id: 'app', label: 'Créer ou améliorer une application métier' },
      { id: 'onboarding', label: 'Organiser l’intégration administrative des nouveaux collaborateurs' },
      { id: 'unknown', label: 'Je ne sais pas encore' },
    ],
  },
  {
    id: 'tools',
    title: 'Quels outils ou informations utilisez-vous déjà ?',
    hint: 'Plusieurs réponses possibles. Aucun identifiant, mot de passe ni document n’est demandé.',
    mode: 'multiple',
    min: 1,
    max: 8,
    exclusive: ['none', 'unknown'],
    options: [
      { id: 'mailbox', label: 'Une messagerie et un agenda' },
      { id: 'crm', label: 'Un CRM ou des fichiers de suivi des clients' },
      { id: 'docs', label: 'Des documents et des dossiers partagés' },
      { id: 'sheets', label: 'Des tableurs ou des données de gestion' },
      { id: 'web', label: 'Un site web ou une boutique en ligne' },
      { id: 'erp', label: 'Des logiciels métier ou un ERP (logiciel de gestion intégré)' },
      { id: 'none', label: 'Pas encore d’outils structurés' },
      { id: 'unknown', label: 'Je ne sais pas' },
    ],
  },
  {
    id: 'sector',
    title: 'Quel est votre secteur d’activité ?',
    hint: 'Il sert à illustrer les exemples, pas à choisir une solution.',
    mode: 'single',
    options: [
      { id: 'services', label: 'Services et conseil' },
      { id: 'formation', label: 'Formation et enseignement' },
      { id: 'commerce', label: 'Commerce et e-commerce' },
      { id: 'artisanat', label: 'Artisanat et bâtiment' },
      { id: 'industrie', label: 'Industrie' },
      { id: 'immobilier', label: 'Immobilier' },
      { id: 'finance', label: 'Finance et expertise comptable' },
      { id: 'juridique', label: 'Juridique' },
      { id: 'sante', label: 'Santé et médico-social' },
      { id: 'transport', label: 'Transport et logistique' },
      { id: 'tourisme', label: 'Tourisme et événementiel' },
      { id: 'culture', label: 'Culture et médias' },
      { id: 'public', label: 'Secteur public et associatif' },
      { id: 'autre', label: 'Autre / plusieurs secteurs' },
      { id: 'nr', label: 'Je préfère ne pas préciser' },
    ],
  },
  {
    id: 'next',
    title: 'Quelle prochaine étape vous conviendrait ?',
    mode: 'single',
    options: [
      { id: 'precise', label: 'Résoudre un besoin précis' },
      { id: 'compare', label: 'Comparer plusieurs possibilités' },
      { id: 'transformation', label: 'Construire une démarche de transformation' },
    ],
  },
]

// Exemples sectoriels : ils personnalisent le texte, jamais la sélection.
export const SECTOR_EXAMPLES = {
  services: 'par exemple des propositions, des comptes rendus de mission ou un suivi de prospects',
  formation: 'par exemple des supports de cours, des inscriptions ou des documents de formation',
  commerce: 'par exemple des fiches produits, des demandes clients ou un suivi de commandes',
  artisanat: 'par exemple des devis de chantier, des relances ou le suivi d’interventions',
  industrie: 'par exemple des pièces et fiches techniques, des procédures ou des demandes internes',
  immobilier: 'par exemple des demandes de biens, des dossiers à compléter ou des visites à planifier',
  finance: 'par exemple des pièces justificatives, des dossiers à contrôler ou des échéances',
  juridique: 'par exemple des dossiers, des modèles d’actes ou des échéances de procédure',
  sante: 'par exemple des documents administratifs, des rendez-vous ou des consignes à retrouver',
  transport: 'par exemple des documents de transport, des demandes de suivi ou des plannings',
  tourisme: 'par exemple des réservations, des demandes d’information ou la coordination d’événements',
  culture: 'par exemple des publications, des contenus à décliner ou des dossiers de partenaires',
  public: 'par exemple des dossiers d’usagers, des procédures ou des comptes rendus',
}

const NEED_CARDS = {
  mails_admin: [3, 4, 5, 13, 14, 15],
  prospects: [6, 7, 8, 4, 5, 19],
  documents: [13, 16, 27],
  pilotage: [9, 10, 25],
  site: [1, 2, 11, 12],
  demandes: [16, 17, 18],
  outils: [24, 25, 23],
  depart: [30],
}

const TASK_CARDS = {
  mails: [3],
  rdv: [4, 19],
  relances: [5],
  devis: [8, 12],
  faq: [16, 17],
  docs: [16, 13],
  extraction: [14, 15],
  chiffres: [10, 9, 25],
  contenus: [11, 1, 2],
  ressaisies: [24, 25, 23],
  app: [21, 29, 22],
  onboarding: [26],
}

// Le logiciel possédé n’ajoute jamais une carte : il précise celles déjà évoquées.
const TOOL_BOOSTS = {
  crm: [6, 7],
  docs: [13, 16],
  sheets: [9, 10, 25],
  web: [1, 2, 11],
  erp: [23, 24, 29],
  mailbox: [3, 4, 19],
}

const WEIGHT_NEED = 1
const WEIGHT_TASK = 3
const WEIGHT_TOOL = 0.5
const REVEAL_THRESHOLD = 1
export const MAX_REVEALED = { precise: 5, compare: 8, default: 6 }

function labelOf(questionId, optionId) {
  const question = QUESTIONS.find((item) => item.id === questionId)
  return question?.options.find((option) => option.id === optionId)?.label ?? optionId
}

function lowerFirst(text) {
  return text.charAt(0).toLowerCase() + text.slice(1)
}

export function emptyAnswers() {
  return { org: '', needs: [], tasks: [], tools: [], sector: '', next: '' }
}

// Une question est « complète » quand sa réponse respecte min/max.
export function isAnswerValid(question, value) {
  if (question.mode === 'single') {
    return question.options.some((option) => option.id === value)
  }
  if (!Array.isArray(value)) return false
  const known = value.every((id) => question.options.some((option) => option.id === id))
  return known && value.length >= question.min && value.length <= question.max
}

// Applique le clic sur une option multiple en respectant max et réponses exclusives.
export function toggleOption(question, current, optionId) {
  const exclusives = question.exclusive ?? []
  if (current.includes(optionId)) return current.filter((id) => id !== optionId)
  if (exclusives.includes(optionId)) return [optionId]
  const withoutExclusive = current.filter((id) => !exclusives.includes(id))
  if (withoutExclusive.length >= question.max) return withoutExclusive
  return [...withoutExclusive, optionId]
}

export function computeResult(answers) {
  const scores = new Map()
  const reasons = new Map()
  const addScore = (cardId, weight, reason) => {
    scores.set(cardId, (scores.get(cardId) ?? 0) + weight)
    if (reason) {
      const list = reasons.get(cardId) ?? []
      if (!list.includes(reason)) list.push(reason)
      reasons.set(cardId, list)
    }
  }

  const needs = answers.needs ?? []
  const tasks = (answers.tasks ?? []).filter((id) => id !== 'unknown')
  const tools = answers.tools ?? []
  const wantsTransformation = answers.next === 'transformation' || needs.includes('depart')
  const tasksUnknown = (answers.tasks ?? []).includes('unknown')

  for (const need of needs) {
    for (const cardId of NEED_CARDS[need] ?? []) {
      const weight = need === 'depart' ? WEIGHT_TASK : WEIGHT_NEED
      addScore(cardId, weight, labelOf('needs', need))
    }
  }
  for (const task of tasks) {
    for (const cardId of TASK_CARDS[task] ?? []) {
      addScore(cardId, WEIGHT_TASK, labelOf('tasks', task))
    }
  }
  if (tasksUnknown || answers.next === 'transformation') {
    addScore(30, WEIGHT_TASK, tasksUnknown ? labelOf('tasks', 'unknown') : labelOf('next', 'transformation'))
  }
  if (wantsTransformation) addScore(30, WEIGHT_TASK, labelOf('next', 'transformation'))

  // Veille : seulement si le besoin documentaire est confirmé par une tâche de recherche.
  if (!(needs.includes('documents') && tasks.includes('docs'))) scores.delete(27)
  // Catalogue produits : un secteur seul ne suffit pas, il faut un besoin documentaire ou de demandes.
  const productSector = ['commerce', 'industrie'].includes(answers.sector)
  if (productSector && (needs.includes('documents') || needs.includes('demandes'))) {
    addScore(28, WEIGHT_TASK, labelOf('sector', answers.sector))
  }

  for (const tool of tools) {
    for (const cardId of TOOL_BOOSTS[tool] ?? []) {
      if (scores.has(cardId)) addScore(cardId, WEIGHT_TOOL, null)
    }
  }

  // Une activité seule n’a pas d’équipe à qui partager un agent ni de collaborateurs à intégrer.
  if (answers.org === 'independent') {
    for (const card of CARDS) if (card.teamOnly) scores.delete(card.id)
  }

  const capKey = MAX_REVEALED[answers.next] ? answers.next : 'default'
  const ranked = [...scores.entries()]
    .filter(([, score]) => score >= REVEAL_THRESHOLD)
    .sort((first, second) => second[1] - first[1] || first[0] - second[0])
    .slice(0, MAX_REVEALED[capKey])

  const cards = ranked.map(([cardId, score]) => ({
    id: cardId,
    score,
    reasons: reasons.get(cardId) ?? [],
  }))

  const expressed = [
    ...needs.map((need) => labelOf('needs', need)),
    ...tasks.map((task) => labelOf('tasks', task)),
  ]

  return {
    cards,
    expressed,
    sectorExample: SECTOR_EXAMPLES[answers.sector] ?? '',
    nextStep: nextStepFor(answers.next, cards.length),
    needsMoreDetail: cards.length === 0,
  }
}

export function nextStepFor(nextAnswer, cardCount) {
  if (nextAnswer === 'transformation') {
    return { id: 'audit', label: 'Un audit', text: 'Un audit examinerait vos usages, vos outils et vos données pour préparer plusieurs projets dans le bon ordre.' }
  }
  if (nextAnswer === 'compare' || cardCount > 3) {
    return { id: 'comparer', label: 'Comparer les pistes', text: 'Un échange permettrait de comparer ces pistes et de retenir celles qui valent un cadrage.' }
  }
  return { id: 'cadrage', label: 'Un cadrage', text: 'Un cadrage vérifierait le besoin et le périmètre de la solution retenue avant toute réalisation.' }
}

// Synthèse textuelle reprise dans le formulaire de devis (visible et retirable par le visiteur).
export function summarizeAnswers(answers, result) {
  const lines = []
  if (answers.org) lines.push(`Organisation : ${lowerFirst(labelOf('org', answers.org))}`)
  if (result.expressed.length) lines.push(`Besoins exprimés : ${result.expressed.join(' ; ')}`)
  if ((answers.tools ?? []).length) {
    lines.push(`Outils : ${answers.tools.map((tool) => labelOf('tools', tool)).join(' ; ')}`)
  }
  if (answers.sector && answers.sector !== 'nr') lines.push(`Secteur : ${labelOf('sector', answers.sector)}`)
  if (answers.next) lines.push(`Étape envisagée : ${lowerFirst(labelOf('next', answers.next))}`)
  const titles = result.cards.map((entry) => CARDS.find((card) => card.id === entry.id)?.title).filter(Boolean)
  if (titles.length) lines.push(`Pistes révélées : ${titles.join(' ; ')}`)
  return lines.join('\n')
}
