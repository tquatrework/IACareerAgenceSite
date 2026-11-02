import { randomUUID } from 'node:crypto'
import { appendFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import app from '@adonisjs/core/services/app'
import env from '#start/env'

export type DevisValues = Record<string, string | undefined>

/**
 * Enregistre chaque demande de devis sur une ligne du fichier JSON Lines.
 * La destination définitive (réception par email) reste à confirmer.
 */
export default class DevisStore {
  get filePath() {
    return env.get('DEVIS_FILE') || app.makePath('storage', 'demandes.jsonl')
  }

  async save(values: DevisValues): Promise<string> {
    const id = randomUUID()
    const entry = { id, receivedAt: new Date().toISOString(), ...values }
    await mkdir(path.dirname(this.filePath), { recursive: true })
    await appendFile(this.filePath, `${JSON.stringify(entry)}\n`, { mode: 0o600 })
    return id
  }
}
