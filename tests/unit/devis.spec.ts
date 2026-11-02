import { test } from '@japa/runner'
import { mkdtemp, readFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { devisValidator } from '#validators/devis'
import { cleanInput } from '#services/devis_service'
import DevisStore from '#services/devis_store'

const valid = {
  name: 'Camille Martin',
  email: 'camille@example.fr',
  profile: 'independant',
  objet: 'solution',
  message: 'Je voudrais trier mes mails.',
}

async function errorFields(input: Record<string, unknown>) {
  try {
    await devisValidator.validate(input)
    return []
  } catch (error) {
    return (error as { messages: { field: string }[] }).messages.map((message) => message.field)
  }
}

test.group('Validation du devis', () => {
  test('une demande complète est acceptée', async ({ assert }) => {
    assert.deepEqual(await errorFields(valid), [])
  })

  test('les champs obligatoires manquants sont signalés', async ({ assert }) => {
    assert.sameMembers(await errorFields({}), ['name', 'email', 'profile', 'objet', 'message'])
  })

  test('une adresse email invalide est refusée', async ({ assert }) => {
    assert.include(await errorFields({ ...valid, email: 'camille@' }), 'email')
  })

  test('un téléphone facultatif invalide est refusé, vide ou valide il est accepté', async ({ assert }) => {
    assert.include(await errorFields({ ...valid, phone: 'abc' }), 'phone')
    assert.deepEqual(await errorFields({ ...valid, phone: '07 49 13 74 31' }), [])
    assert.deepEqual(await errorFields(valid), [])
  })

  test('un message trop court est refusé', async ({ assert }) => {
    assert.include(await errorFields({ ...valid, message: 'court' }), 'message')
  })

  test('un profil ou un objet hors liste est refusé', async ({ assert }) => {
    assert.include(await errorFields({ ...valid, profile: 'x' }), 'profile')
    assert.include(await errorFields({ ...valid, objet: 'x' }), 'objet')
  })

  test('les caractères de contrôle sont retirés et les valeurs non textuelles ignorées', ({ assert }) => {
    const cleaned = cleanInput({ name: 'A\u0000B', nested: { a: 1 }, count: 3 })
    assert.deepEqual(cleaned, { name: 'AB' })
  })
})

test.group('Enregistrement du devis', () => {
  test('chaque demande est écrite sur une ligne JSON', async ({ assert }) => {
    const directory = await mkdtemp(path.join(os.tmpdir(), 'devis-'))
    const store = new DevisStore()
    Object.defineProperty(store, 'filePath', { value: path.join(directory, 'sous-dossier', 'demandes.jsonl') })
    const id = await store.save(valid)
    const lines = (await readFile(store.filePath, 'utf8')).trim().split('\n')
    assert.lengthOf(lines, 1)
    assert.equal(JSON.parse(lines[0]).id, id)
    assert.equal(JSON.parse(lines[0]).email, valid.email)
  })
})
