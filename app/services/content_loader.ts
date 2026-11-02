import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { load } from 'js-yaml'

/** Dossier des textes éditables (content/ à la racine du projet, copié tel quel dans build/). */
export const CONTENT_DIRECTORY = fileURLToPath(new URL('../../content/', import.meta.url))

type ContentNode = Record<string, unknown>

function readPath(root: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((node, key) => {
    if (node === null || typeof node !== 'object') return undefined
    return (node as ContentNode)[key]
  }, root)
}

/**
 * Lit `content/<name>.yml` et vérifie que chaque chemin demandé existe.
 * - `text` : chaîne non vide ; `list` : liste non vide (les éléments sont à vérifier via `requiredPaths`).
 * Les erreurs nomment le fichier et la clé fautive pour qu'une coquille de saisie soit facile à corriger.
 */
export function loadContent<T>(
  name: string,
  requirements: { text?: string[]; list?: string[] } = {},
  directory: string = CONTENT_DIRECTORY
): T {
  const fileName = `${name}.yml`
  let rawText: string
  try {
    rawText = readFileSync(`${directory}${fileName}`, 'utf8')
  } catch {
    throw new Error(`Fichier de contenu introuvable : content/${fileName}`)
  }

  let parsed: unknown
  try {
    parsed = load(rawText)
  } catch (error) {
    throw new Error(`YAML invalide dans content/${fileName} : ${(error as Error).message}`)
  }
  if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error(`content/${fileName} doit contenir des clés (« clé: valeur »)`)
  }

  for (const path of requirements.text ?? []) {
    const value = readPath(parsed, path)
    if (typeof value !== 'string' || value.trim() === '') {
      throw new Error(`content/${fileName} : le texte « ${path} » est absent ou vide`)
    }
  }
  for (const path of requirements.list ?? []) {
    const value = readPath(parsed, path)
    if (!Array.isArray(value) || value.length === 0) {
      throw new Error(`content/${fileName} : la liste « ${path} » est absente ou vide`)
    }
  }
  return parsed as T
}
