// Gabarits HTML avec échappement automatique : toute valeur interpolée est échappée,
// sauf si elle provient d’un autre appel à html() ou de raw().

export class SafeHtml {
  constructor(value) {
    this.value = value
  }

  toString() {
    return this.value
  }
}

const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }

export function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, (character) => ESCAPES[character])
}

function renderValue(value) {
  if (value === null || value === undefined || value === false) return ''
  if (value instanceof SafeHtml) return value.value
  if (Array.isArray(value)) return value.map(renderValue).join('')
  return escapeHtml(value)
}

export function html(strings, ...values) {
  let output = strings[0]
  values.forEach((value, index) => {
    output += renderValue(value) + strings[index + 1]
  })
  return new SafeHtml(output)
}

export function raw(text) {
  return new SafeHtml(text)
}

// Sérialise un objet pour une balise <script type="application/json"> sans pouvoir la fermer.
export function jsonForScript(data) {
  return raw(JSON.stringify(data).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026'))
}
