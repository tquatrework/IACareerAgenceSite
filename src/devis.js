import { appendFile, mkdir } from 'node:fs/promises'
import { randomUUID } from 'node:crypto'
import path from 'node:path'

export const PROFILES = { independant: 'Indépendant', equipe: 'Entreprise avec équipe', autre: 'Autre' }
export const OBJECTS = { audit: 'Audit', solution: 'Solution précise', autre: 'Autre demande' }

const EMAIL_PATTERN = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]{2,}$/
const PHONE_PATTERN = /^[+()\d\s.-]{6,30}$/

function clean(value, maxLength) {
  return String(value ?? '').replace(/\r\n/g, '\n').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim().slice(0, maxLength)
}

// Retourne { values, errors }; errors est vide quand la demande est recevable.
export function validateDevis(input) {
  const source = input ?? {}
  const values = {
    name: clean(source.name, 120),
    email: clean(source.email, 254),
    organisation: clean(source.organisation, 150),
    phone: clean(source.phone, 30),
    profile: clean(source.profile, 20),
    objet: clean(source.objet, 20),
    solution: clean(source.solution, 120),
    message: clean(source.message, 5000),
    quizSummary: clean(source.quizSummary, 2000),
  }
  const errors = {}
  if (!values.name) errors.name = 'Indiquez votre nom.'
  if (!values.email) errors.email = 'Indiquez votre adresse email.'
  else if (!EMAIL_PATTERN.test(values.email)) errors.email = 'Cette adresse email semble incomplète.'
  if (values.phone && !PHONE_PATTERN.test(values.phone)) errors.phone = 'Ce numéro de téléphone semble incorrect.'
  if (!PROFILES[values.profile]) errors.profile = 'Choisissez votre profil.'
  if (!OBJECTS[values.objet]) errors.objet = 'Choisissez l’objet de votre demande.'
  if (values.message.length < 10) errors.message = 'Décrivez votre besoin en quelques mots (10 caractères minimum).'
  return { values, errors }
}

// Un champ invisible que seuls les robots remplissent.
export function isSpam(input) {
  return Boolean(input && String(input.website ?? '').trim())
}

export function createRateLimiter({ limit, windowMs, maxKeys = 10000, now = () => Date.now() }) {
  const hits = new Map()
  return function isAllowed(key) {
    const current = now()
    // Purge des clés inactives pour borner la mémoire.
    if (hits.size >= maxKeys) {
      for (const [storedKey, times] of hits) {
        if (times.every((time) => current - time >= windowMs)) hits.delete(storedKey)
      }
      if (hits.size >= maxKeys) return false
    }
    const recent = (hits.get(key) ?? []).filter((time) => current - time < windowMs)
    if (recent.length >= limit) {
      hits.set(key, recent)
      return false
    }
    recent.push(current)
    hits.set(key, recent)
    return true
  }
}

// Adresse du visiteur : X-Forwarded-For n'est lu que si la connexion vient d'un proxy de confiance
// (variable TRUSTED_PROXIES, adresses séparées par des virgules). On prend l'entrée la plus à droite
// non fiable, la seule que le proxy a réellement observée.
export function clientAddress(request, trustedProxies = []) {
  const peer = request.socket.remoteAddress ?? 'unknown'
  if (!trustedProxies.includes(peer)) return peer
  const forwarded = String(request.headers['x-forwarded-for'] ?? '').split(',').map((item) => item.trim()).filter(Boolean)
  for (let i = forwarded.length - 1; i >= 0; i -= 1) {
    if (!trustedProxies.includes(forwarded[i])) return forwarded[i]
  }
  return peer
}

// Les demandes sont conservées dans un fichier JSON Lines ; la destination définitive reste à confirmer.
export function createFileStore(filePath) {
  return async function store(values) {
    const id = randomUUID()
    const entry = { id, receivedAt: new Date().toISOString(), ...values }
    await mkdir(path.dirname(filePath), { recursive: true })
    await appendFile(filePath, `${JSON.stringify(entry)}\n`, { mode: 0o600 })
    return id
  }
}
