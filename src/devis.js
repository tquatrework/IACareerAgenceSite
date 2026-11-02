import { appendFile, mkdir } from 'node:fs/promises'
import { randomUUID } from 'node:crypto'
import path from 'node:path'
import net from 'node:net'

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

const OVERFLOW_KEY = '*overflow*'
const GLOBAL_KEY = '*global*'

// Limite par clé, plus deux garde-fous :
// - plafond global (globalLimit) qui borne le total des écritures sur la fenêtre ;
// - table pleine : purge des clés expirées, puis les nouvelles clés partagent un seul seau de débordement.
// Une clé encore active n'est jamais évincée et les clés déjà connues restent évaluées normalement.
export function createRateLimiter({ limit, windowMs, maxKeys = 10000, globalLimit = limit * 40, overflowLimit = limit * 4, now = () => Date.now() }) {
  const hits = new Map()
  const recentHits = (key, current) => (hits.get(key) ?? []).filter((time) => current - time < windowMs)
  const consume = (key, max, current) => {
    const recent = recentHits(key, current)
    if (recent.length >= max) {
      hits.set(key, recent)
      return false
    }
    recent.push(current)
    hits.set(key, recent)
    return true
  }
  return function isAllowed(key) {
    const current = now()
    if (recentHits(GLOBAL_KEY, current).length >= globalLimit) return false
    let effectiveKey = key
    let max = limit
    if (!hits.has(key) && hits.size >= maxKeys) {
      for (const [storedKey, times] of hits) {
        if (times.every((time) => current - time >= windowMs)) hits.delete(storedKey)
      }
      if (hits.size >= maxKeys) {
        effectiveKey = OVERFLOW_KEY
        max = overflowLimit
      }
    }
    if (!consume(effectiveKey, max, current)) return false
    consume(GLOBAL_KEY, Infinity, current)
    return true
  }
}

// Clé de limitation : IPv4 telle quelle ; IPv6 normalisée sur 8 groupes puis réduite à son /64
// (un abonné contrôle tout un /64) ; IPv4 mappée ramenée à l'IPv4 ; valeur invalide = clé unique.
export function rateLimitKey(address) {
  const bare = String(address).split('%')[0].toLowerCase()
  if (net.isIPv4(bare)) return bare
  if (!net.isIPv6(bare)) return 'invalid-address'
  const mapped = bare.match(/^(?:0*:)*:?ffff:(\d+\.\d+\.\d+\.\d+)$/)
  if (mapped) return mapped[1]
  let text = bare
  const dotted = text.match(/(\d+)\.(\d+)\.(\d+)\.(\d+)$/)
  if (dotted) {
    const [, a, b, c, d] = dotted.map(Number)
    text = text.replace(dotted[0], `${((a << 8) | b).toString(16)}:${((c << 8) | d).toString(16)}`)
  }
  const [head, tail] = text.split('::')
  const headGroups = head ? head.split(':') : []
  const tailGroups = tail === undefined ? [] : tail ? tail.split(':') : []
  const missing = tail === undefined ? 0 : 8 - headGroups.length - tailGroups.length
  const groups = [...headGroups, ...Array(missing).fill('0'), ...tailGroups].map((group) => parseInt(group, 16).toString(16))
  return `${groups.slice(0, 4).join(':')}::/64`
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
