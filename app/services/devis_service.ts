import { inject } from '@adonisjs/core'
import logger from '@adonisjs/core/services/logger'
import { errors } from '@vinejs/vine'
import DevisStore from '#services/devis_store'
import { devisValidator } from '#validators/devis'

export type DevisResult =
  | { status: 'sent' }
  | { status: 'invalid'; errors: Record<string, string>; values: Record<string, string> }
  | { status: 'error'; values: Record<string, string> }

// eslint-disable-next-line no-control-regex
const CONTROL_CHARACTERS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g

/** Ne garde que des chaînes, sans caractères de contrôle, pour la validation et le ré-affichage. */
export function cleanInput(input: unknown): Record<string, string> {
  const cleaned: Record<string, string> = {}
  if (input && typeof input === 'object') {
    for (const [key, value] of Object.entries(input)) {
      if (typeof value === 'string') cleaned[key] = value.replace(CONTROL_CHARACTERS, '').slice(0, 6000)
    }
  }
  return cleaned
}

@inject()
export default class DevisService {
  constructor(protected store: DevisStore) {}

  async submit(input: unknown): Promise<DevisResult> {
    const values = cleanInput(input)
    // Champ piège que seuls les robots remplissent : réponse identique à un succès, sans enregistrement.
    if (values.website?.trim()) return { status: 'sent' }
    const { website: _website, ...fields } = values
    try {
      const validated = await devisValidator.validate(fields)
      await this.store.save(validated)
      return { status: 'sent' }
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        const fieldErrors: Record<string, string> = {}
        for (const message of error.messages) {
          fieldErrors[message.field] ??= message.message
        }
        return { status: 'invalid', errors: fieldErrors, values: fields }
      }
      logger.error({ err: error }, 'Enregistrement de la demande impossible')
      return { status: 'error', values: fields }
    }
  }
}
