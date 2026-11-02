import test from 'node:test'
import assert from 'node:assert/strict'
import { computeResult, emptyAnswers, isAnswerValid, toggleOption, QUESTIONS, summarizeAnswers } from '../shared/quiz.js'
import { CARDS } from '../shared/catalog.js'

const question = (id) => QUESTIONS.find((item) => item.id === id)
const ids = (result) => result.cards.map((entry) => entry.id)

test('le catalogue contient trente cartes uniques', () => {
  assert.equal(CARDS.length, 30)
  assert.equal(new Set(CARDS.map((card) => card.id)).size, 30)
  assert.equal(new Set(CARDS.map((card) => card.slug)).size, 30)
})

test('six questions sont proposées', () => {
  assert.equal(QUESTIONS.length, 6)
})

test('sans réponse, aucune carte n’est révélée et le résultat invite à préciser', () => {
  const result = computeResult(emptyAnswers())
  assert.deepEqual(result.cards, [])
  assert.equal(result.needsMoreDetail, true)
})

test('une tâche précise révèle la carte correspondante en tête', () => {
  const result = computeResult({ ...emptyAnswers(), org: 'independent', needs: ['mails_admin'], tasks: ['mails'] })
  assert.equal(ids(result)[0], 3)
  assert.ok(result.cards[0].reasons.length > 0)
})

test('modifier une réponse remet face cachée les cartes qui ne correspondent plus', () => {
  const before = computeResult({ ...emptyAnswers(), needs: ['site'], tasks: ['contenus'] })
  const after = computeResult({ ...emptyAnswers(), needs: ['pilotage'], tasks: ['chiffres'] })
  assert.ok(ids(before).includes(1))
  assert.ok(!ids(after).includes(1))
  assert.ok(ids(after).includes(9))
})

test('« savoir par où commencer » et la démarche de transformation révèlent l’audit', () => {
  assert.ok(ids(computeResult({ ...emptyAnswers(), needs: ['depart'] })).includes(30))
  assert.ok(ids(computeResult({ ...emptyAnswers(), needs: ['site'], next: 'transformation' })).includes(30))
  assert.ok(ids(computeResult({ ...emptyAnswers(), needs: ['site'], tasks: ['unknown'] })).includes(30))
})

test('un indépendant ne voit pas les cartes réservées aux équipes', () => {
  const answers = { ...emptyAnswers(), needs: ['outils'], tasks: ['onboarding'] }
  assert.ok(ids(computeResult({ ...answers, org: 'team' })).includes(26))
  assert.ok(!ids(computeResult({ ...answers, org: 'independent' })).includes(26))
})

test('le secteur seul ne révèle aucune carte', () => {
  const result = computeResult({ ...emptyAnswers(), sector: 'commerce' })
  assert.deepEqual(result.cards, [])
  assert.match(result.sectorExample, /fiches produits/)
})

test('le catalogue produits exige un besoin documentaire ou de demandes', () => {
  const withNeed = computeResult({ ...emptyAnswers(), needs: ['demandes'], sector: 'commerce' })
  assert.ok(ids(withNeed).includes(28))
  const withoutNeed = computeResult({ ...emptyAnswers(), needs: ['site'], sector: 'commerce' })
  assert.ok(!ids(withoutNeed).includes(28))
})

test('posséder un logiciel ne fait apparaître aucune carte à lui seul', () => {
  assert.deepEqual(computeResult({ ...emptyAnswers(), tools: ['crm', 'erp'] }).cards, [])
})

test('le nombre de cartes révélées est plafonné selon l’étape souhaitée', () => {
  const broad = { ...emptyAnswers(), needs: ['mails_admin', 'prospects', 'outils'], tasks: ['mails', 'rdv', 'relances', 'devis'] }
  assert.ok(computeResult({ ...broad, next: 'precise' }).cards.length <= 5)
  assert.ok(computeResult({ ...broad, next: 'compare' }).cards.length <= 8)
})

test('validation des réponses : bornes min et max', () => {
  const needs = question('needs')
  assert.equal(isAnswerValid(needs, []), false)
  assert.equal(isAnswerValid(needs, ['site']), true)
  assert.equal(isAnswerValid(needs, ['site', 'pilotage', 'outils', 'depart']), false)
  assert.equal(isAnswerValid(needs, ['inconnu']), false)
  assert.equal(isAnswerValid(question('org'), 'team'), true)
  assert.equal(isAnswerValid(question('org'), ''), false)
})

test('sélection multiple : maximum respecté et réponses exclusives', () => {
  const tasks = question('tasks')
  let selection = []
  for (const optionId of ['mails', 'rdv', 'relances', 'devis', 'faq']) selection = toggleOption(tasks, selection, optionId)
  assert.deepEqual(selection, ['mails', 'rdv', 'relances', 'devis'])
  assert.deepEqual(toggleOption(tasks, selection, 'unknown'), ['unknown'])
  assert.deepEqual(toggleOption(tasks, ['unknown'], 'mails'), ['mails'])
  assert.deepEqual(toggleOption(tasks, ['mails'], 'mails'), [])
})

test('la synthèse transmise au devis reprend besoins et pistes', () => {
  const answers = { ...emptyAnswers(), org: 'independent', needs: ['mails_admin'], tasks: ['mails'], tools: ['mailbox'], sector: 'services', next: 'precise' }
  const summary = summarizeAnswers(answers, computeResult(answers))
  assert.match(summary, /Alléger les mails/)
  assert.match(summary, /Mails : tri et réponses préparées/)
})
