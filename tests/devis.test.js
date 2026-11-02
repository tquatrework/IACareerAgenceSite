import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, readFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { validateDevis, isSpam, createRateLimiter, createFileStore } from '../src/devis.js'

const valid = { name: 'Camille Martin', email: 'camille@example.fr', profile: 'independant', objet: 'solution', message: 'Je voudrais trier mes mails.' }

test('une demande complète est acceptée', () => {
  assert.deepEqual(validateDevis(valid).errors, {})
})

test('les champs obligatoires manquants sont signalés', () => {
  const { errors } = validateDevis({})
  assert.deepEqual(Object.keys(errors).sort(), ['email', 'message', 'name', 'objet', 'profile'])
})

test('une adresse email invalide est refusée', () => {
  assert.ok(validateDevis({ ...valid, email: 'camille@' }).errors.email)
})

test('un téléphone facultatif invalide est refusé, vide il est accepté', () => {
  assert.ok(validateDevis({ ...valid, phone: 'abc' }).errors.phone)
  assert.equal(validateDevis({ ...valid, phone: '' }).errors.phone, undefined)
  assert.equal(validateDevis({ ...valid, phone: '07 49 13 74 31' }).errors.phone, undefined)
})

test('un message trop court est refusé', () => {
  assert.ok(validateDevis({ ...valid, message: 'court' }).errors.message)
})

test('les valeurs hors liste de profil ou d’objet sont refusées', () => {
  assert.ok(validateDevis({ ...valid, profile: 'x' }).errors.profile)
  assert.ok(validateDevis({ ...valid, objet: 'x' }).errors.objet)
})

test('les entrées sont tronquées et nettoyées des caractères de contrôle', () => {
  const { values } = validateDevis({ ...valid, name: `A\u0000${'b'.repeat(500)}` })
  assert.ok(values.name.length <= 120)
  assert.ok(!values.name.includes('\u0000'))
})

test('le champ piège détecte les robots', () => {
  assert.equal(isSpam({ website: 'http://spam' }), true)
  assert.equal(isSpam({ website: '' }), false)
  assert.equal(isSpam(undefined), false)
})

test('la limite de débit bloque puis libère après la fenêtre', () => {
  let current = 0
  const isAllowed = createRateLimiter({ limit: 2, windowMs: 1000, now: () => current })
  assert.equal(isAllowed('a'), true)
  assert.equal(isAllowed('a'), true)
  assert.equal(isAllowed('a'), false)
  assert.equal(isAllowed('b'), true)
  current = 1500
  assert.equal(isAllowed('a'), true)
})

test('le stockage écrit une ligne JSON par demande', async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'devis-'))
  const file = path.join(directory, 'sous-dossier', 'demandes.jsonl')
  const store = createFileStore(file)
  const id = await store(validateDevis(valid).values)
  const lines = (await readFile(file, 'utf8')).trim().split('\n')
  assert.equal(lines.length, 1)
  assert.equal(JSON.parse(lines[0]).id, id)
  assert.equal(JSON.parse(lines[0]).email, valid.email)
})
