import { FAMILIES, cardHref, findCard } from '/js/shared/catalog.js'
import { QUESTIONS, emptyAnswers, isAnswerValid, toggleOption, computeResult, summarizeAnswers } from '/js/shared/quiz.js'

const STORAGE_KEY = 'iacareer.quizSummary'
const SLOT_COUNT = 12
// Sélection de départ variée : chaque famille de solutions est représentée.
const DEFAULT_SLOTS = [3, 6, 16, 1, 9, 24, 13, 17, 21, 4, 23, 30]

const ICON_PATHS = {
  presence: '<rect x="3" y="4" width="18" height="14" rx="1.5"/><path d="M3 8h18M7 21h10M12 18v3"/>',
  messagerie: '<rect x="3" y="5" width="18" height="14" rx="1.5"/><path d="M3 7l9 6 9-6"/>',
  relation: '<circle cx="9" cy="8" r="3"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M16 6h5M16 10h5"/>',
  pilotage: '<path d="M4 20V10M10 20V4M16 20v-8M22 20H2"/>',
  documents: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/>',
  assistants: '<path d="M4 5h16v11H9l-5 4z"/><path d="M8 9h8M8 12h5"/>',
  applications: '<path d="M8 6L3 12l5 6M16 6l5 6-5 6M14 4l-4 16"/>',
  audit: '<circle cx="11" cy="11" r="6"/><path d="M16 16l5 5M8.5 11l2 2 3.5-4"/>',
}

const quizRoot = document.querySelector('[data-quiz]')
const mosaicRoot = document.querySelector('[data-mosaic]')
const statusRoot = document.getElementById('mosaic-status')

function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character])
}

function icon(family) {
  return `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${ICON_PATHS[family]}</svg>`
}

function saveSummary(text) {
  try {
    if (text) sessionStorage.setItem(STORAGE_KEY, text)
    else sessionStorage.removeItem(STORAGE_KEY)
  } catch {
    // Le stockage peut être indisponible : le parcours reste utilisable sans lui.
  }
}

// ---------- Mosaïque de cartes ----------

const slots = [...DEFAULT_SLOTS].slice(0, SLOT_COUNT)
const revealed = new Map()

function cardMarkup(card, reveal) {
  const number = String(card.id).padStart(2, '0')
  const reason = reveal?.reasons?.length
    ? `<p class="flip__reason">Vous avez indiqué : ${escapeHtml(reveal.reasons.slice(0, 2).join(' ; '))}</p>`
    : ''
  return `<div class="flip__inner">
    <div class="flip__face flip__face--back">
      ${icon(card.family)}
      <p class="flip__family">${escapeHtml(FAMILIES[card.family])}</p>
      <p class="flip__state">Carte face cachée</p>
    </div>
    <div class="flip__face flip__face--front">
      <p class="flip__num">${number} · ${escapeHtml(FAMILIES[card.family])}</p>
      <h3 class="flip__title">${icon(card.family)}<span>${escapeHtml(card.title)}</span></h3>
      <p class="flip__summary">${escapeHtml(card.summary)}</p>
      ${reason}
      <a class="flip__link" href="${cardHref(card)}">Voir la présentation<span class="visually-hidden"> : ${escapeHtml(card.title)}</span></a>
    </div>
  </div>`
}

function setFaces(item, isRevealed) {
  item.classList.toggle('is-revealed', isRevealed)
  item.querySelector('.flip__face--back').toggleAttribute('inert', isRevealed)
  item.querySelector('.flip__face--front').toggleAttribute('inert', !isRevealed)
  item.querySelector('.flip__face--back').setAttribute('aria-hidden', String(isRevealed))
  item.querySelector('.flip__face--front').setAttribute('aria-hidden', String(!isRevealed))
}

function paintSlot(index) {
  const item = mosaicRoot.children[index]
  const card = findCard(slots[index])
  const reveal = revealed.get(card.id)
  if (item.dataset.cardId !== String(card.id) || item.dataset.reasons !== (reveal?.reasons ?? []).join('|')) {
    item.dataset.cardId = String(card.id)
    item.dataset.reasons = (reveal?.reasons ?? []).join('|')
    item.querySelector('.flip').innerHTML = cardMarkup(card, reveal)
  }
  setFaces(item.querySelector('.flip'), Boolean(reveal))
  item.querySelector('.flip').setAttribute('data-card', String(card.id))
}

function buildMosaic() {
  mosaicRoot.innerHTML = slots.map(() => '<li class="mosaic__slot"><div class="flip"></div></li>').join('')
  slots.forEach((_, index) => paintSlot(index))
  updateStatus()
}

function updateStatus() {
  if (!statusRoot) return
  statusRoot.textContent = revealed.size === 0
    ? `${SLOT_COUNT} cartes affichées, toutes face cachée.`
    : `${revealed.size} carte${revealed.size > 1 ? 's' : ''} révélée${revealed.size > 1 ? 's' : ''} sur ${SLOT_COUNT} affichées.`
}

function applyReveal(cards) {
  revealed.clear()
  cards.forEach((entry) => revealed.set(entry.id, entry))
  // Une carte révélée absente de la mosaïque prend la place d’une carte restée cachée.
  const missing = cards.filter((entry) => !slots.includes(entry.id))
  const replaceable = slots.map((id, index) => ({ id, index })).filter((slot) => !revealed.has(slot.id)).reverse()
  missing.forEach((entry, position) => {
    const target = replaceable[position]
    if (target) slots[target.index] = entry.id
  })
  slots.forEach((_, index) => paintSlot(index))
  updateStatus()
}

// ---------- Questionnaire ----------

let answers = emptyAnswers()
let stepIndex = 0

function renderQuestion() {
  const question = QUESTIONS[stepIndex]
  const value = answers[question.id]
  const inputType = question.mode === 'single' ? 'radio' : 'checkbox'
  const options = question.options
    .map((option) => {
      const checked = question.mode === 'single' ? value === option.id : value.includes(option.id)
      return `<label class="choice"><input type="${inputType}" name="${question.id}" value="${option.id}" ${checked ? 'checked' : ''} /><span>${escapeHtml(option.label)}</span></label>`
    })
    .join('')
  const isLast = stepIndex === QUESTIONS.length - 1
  quizRoot.innerHTML = `
    <form class="quiz__form" novalidate>
      <p class="quiz__progress" id="quiz-progress">Question ${stepIndex + 1} sur ${QUESTIONS.length}</p>
      <div class="quiz__bar" aria-hidden="true"><span class="quiz__bar-fill quiz__bar-fill--${stepIndex + 1}"></span></div>
      <fieldset class="quiz__fieldset" aria-describedby="quiz-progress">
        <legend tabindex="-1" id="quiz-legend">${escapeHtml(question.title)}</legend>
        ${question.hint ? `<p class="hint">${escapeHtml(question.hint)}</p>` : ''}
        <div class="choices ${question.options.length > 8 ? 'choices--dense' : ''}">${options}</div>
      </fieldset>
      <p class="error" id="quiz-error" role="alert" hidden></p>
      <div class="quiz__actions">
        <button type="button" class="button button--ghost" data-action="back" ${stepIndex === 0 ? 'hidden' : ''}>Retour</button>
        <button type="submit" class="button button--primary">${isLast ? 'Voir les pistes' : 'Continuer'}</button>
      </div>
    </form>`
  const form = quizRoot.querySelector('form')
  form.addEventListener('change', (event) => onChoice(event, question))
  form.addEventListener('submit', (event) => {
    event.preventDefault()
    onNext(question)
  })
  form.querySelector('[data-action="back"]').addEventListener('click', () => {
    stepIndex = Math.max(0, stepIndex - 1)
    renderQuestion()
    focusLegend()
  })
}

function focusLegend() {
  quizRoot.querySelector('#quiz-legend')?.focus({ preventScroll: false })
}

function onChoice(event, question) {
  const optionId = event.target.value
  if (question.mode === 'single') {
    answers[question.id] = optionId
  } else {
    answers[question.id] = toggleOption(question, answers[question.id], optionId)
    quizRoot.querySelectorAll('input').forEach((input) => {
      input.checked = answers[question.id].includes(input.value)
    })
  }
  const errorNode = quizRoot.querySelector('#quiz-error')
  if (errorNode) errorNode.hidden = true
}

function errorMessage(question) {
  if (question.mode === 'single') return 'Choisissez une réponse pour continuer.'
  return question.max === 8
    ? 'Choisissez au moins une réponse pour continuer.'
    : `Choisissez entre ${question.min} et ${question.max} réponses pour continuer.`
}

function onNext(question) {
  if (!isAnswerValid(question, answers[question.id])) {
    const errorNode = quizRoot.querySelector('#quiz-error')
    errorNode.textContent = errorMessage(question)
    errorNode.hidden = false
    return
  }
  // Les cartes se retournent dès que le besoin est précisé (à partir de la question 2).
  if (stepIndex >= 1) applyReveal(computeResult(answers).cards)
  if (stepIndex === QUESTIONS.length - 1) {
    renderResults()
    return
  }
  stepIndex += 1
  renderQuestion()
  focusLegend()
}

function quoteHref(result) {
  const objet = result.nextStep.id === 'audit' ? 'audit' : 'solution'
  return `/contact?from=questionnaire&objet=${objet}`
}

function renderResults() {
  const result = computeResult(answers)
  saveSummary(summarizeAnswers(answers, result))
  const cardItems = result.cards
    .map((entry) => {
      const card = findCard(entry.id)
      return `<li class="result__card">
        <h4><a href="${cardHref(card)}">${escapeHtml(card.title)}</a></h4>
        <p>${escapeHtml(card.summary)}</p>
        ${entry.reasons.length ? `<p class="muted">Pertinent parce que vous avez indiqué : ${escapeHtml(entry.reasons.slice(0, 3).join(' ; '))}.</p>` : ''}
      </li>`
    })
    .join('')
  const clarify = result.cards
    .slice(0, 4)
    .map((entry) => `<li>${escapeHtml(findCard(entry.id).clarify)}</li>`)
    .join('')
  const expressed = result.expressed.map((label) => `<li>${escapeHtml(label)}</li>`).join('')
  quizRoot.innerHTML = `
    <section class="result" aria-labelledby="result-title">
      <h2 class="headline headline--small" id="result-title" tabindex="-1">Voici les pistes à examiner pour votre activité.</h2>
      ${result.needsMoreDetail
        ? `<p class="notice">Vos réponses ne permettent pas encore de proposer des pistes précises. Mieux vaut préciser votre besoin ensemble plutôt que d’afficher une sélection artificiellement large.</p>`
        : `${expressed ? `<h3 class="subhead">Besoins exprimés</h3><ul class="chips">${expressed}</ul>` : ''}
           <h3 class="subhead">${result.cards.length} carte${result.cards.length > 1 ? 's' : ''} révélée${result.cards.length > 1 ? 's' : ''}</h3>
           <ul class="result__cards">${cardItems}</ul>
           ${result.sectorExample ? `<p class="muted">Dans votre secteur, cela pourrait concerner ${escapeHtml(result.sectorExample)}.</p>` : ''}
           <h3 class="subhead">Points à préciser</h3><ul class="ticks">${clarify}</ul>`}
      <h3 class="subhead">Prochaine étape possible : ${escapeHtml(result.nextStep.label.toLowerCase())}</h3>
      <p>${escapeHtml(result.nextStep.text)}</p>
      <p class="muted">Ces résultats expriment une orientation. Ils ne mesurent ni une rentabilité, ni un niveau de conformité, ni une faisabilité déjà démontrée. Les cartes restées cachées ne sont pas des solutions écartées.</p>
      <div class="quiz__actions">
        <a class="button button--primary" href="${quoteHref(result)}">Demandez un devis</a>
        <a class="button button--ghost" href="/solutions">Voir toutes les solutions</a>
      </div>
      <div class="quiz__actions quiz__actions--secondary">
        <button type="button" class="text-button" data-action="edit">Modifier mes réponses</button>
        <button type="button" class="text-button" data-action="restart">Recommencer</button>
      </div>
    </section>`
  quizRoot.querySelector('[data-action="edit"]').addEventListener('click', () => {
    stepIndex = 0
    renderQuestion()
    focusLegend()
  })
  quizRoot.querySelector('[data-action="restart"]').addEventListener('click', restart)
  quizRoot.querySelector('#result-title').focus()
}

function restart() {
  answers = emptyAnswers()
  stepIndex = 0
  saveSummary('')
  slots.splice(0, slots.length, ...DEFAULT_SLOTS)
  applyReveal([])
  buildMosaic()
  renderQuestion()
  focusLegend()
}

if (quizRoot && mosaicRoot) {
  buildMosaic()
  renderQuestion()
}
