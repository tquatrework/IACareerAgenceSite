/*
|--------------------------------------------------------------------------
| Environment variables service
|--------------------------------------------------------------------------
|
| The `Env.create` method creates an instance of the Env service. The
| service validates the environment variables and also cast values
| to JavaScript data types.
|
*/

import { Env } from '@adonisjs/core/env'

export default await Env.create(new URL('../', import.meta.url), {
  NODE_ENV: Env.schema.enum(['development', 'production', 'test'] as const),
  PORT: Env.schema.number(),
  APP_KEY: Env.schema.string(),
  HOST: Env.schema.string({ format: 'host' }),
  LOG_LEVEL: Env.schema.string(),

  /*
  |----------------------------------------------------------
  | Limite de débit (demandes de devis)
  |----------------------------------------------------------
  */
  LIMITER_STORE: Env.schema.enum.optional(['memory'] as const),

  /*
  |----------------------------------------------------------
  | Site agence.iacareer.fr
  |----------------------------------------------------------
  */
  // Fichier JSON Lines où sont enregistrées les demandes de devis
  DEVIS_FILE: Env.schema.string.optional(),
  // Adresses de reverse proxys de confiance, séparées par des virgules
  TRUSTED_PROXIES: Env.schema.string.optional(),
})
