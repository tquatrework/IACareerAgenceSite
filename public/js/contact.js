const STORAGE_KEY = 'iacareer.quizSummary'

const form = document.getElementById('devis-form')
const statusNode = document.getElementById('form-status')
const contextBox = document.getElementById('quiz-context')
const summaryField = document.getElementById('quizSummary')

function readSummary() {
  try {
    return sessionStorage.getItem(STORAGE_KEY) ?? ''
  } catch {
    return ''
  }
}

function showStatus(kind, title, text) {
  statusNode.replaceChildren()
  const box = document.createElement('p')
  box.className = `notice notice--${kind}`
  const strong = document.createElement('strong')
  strong.textContent = title
  box.append(strong, ` ${text}`)
  statusNode.append(box)
  statusNode.focus()
}

function showFieldErrors(errors) {
  form.querySelectorAll('.field').forEach((field) => {
    field.classList.remove('field--error')
    field.querySelector('.error')?.remove()
  })
  Object.entries(errors).forEach(([name, message]) => {
    const input = form.elements[name]
    if (!input) return
    const field = input.closest('.field')
    field.classList.add('field--error')
    input.setAttribute('aria-invalid', 'true')
    const error = document.createElement('p')
    error.className = 'error'
    error.id = `${name}-error`
    error.textContent = message
    field.append(error)
    input.setAttribute('aria-describedby', [input.getAttribute('aria-describedby'), error.id].filter(Boolean).join(' '))
  })
}

// Le résumé du questionnaire n’est repris que s’il vient de ce parcours, et reste modifiable.
const params = new URLSearchParams(location.search)
if (form && params.get('from') === 'questionnaire' && summaryField && !summaryField.value) {
  const summary = readSummary()
  if (summary) {
    summaryField.value = summary
    contextBox.hidden = false
  }
}

document.querySelector('[data-remove-context]')?.addEventListener('click', () => {
  summaryField.value = ''
  contextBox.hidden = true
  form.elements.message.focus()
})

form?.addEventListener('submit', async (event) => {
  event.preventDefault()
  const submit = form.querySelector('[type="submit"]')
  submit.disabled = true
  try {
    const response = await fetch('/api/devis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(Object.fromEntries(new FormData(form))),
    })
    const result = await response.json().catch(() => ({}))
    if (response.ok && result.ok) {
      form.hidden = true
      showStatus('ok', 'Votre demande a bien été reçue.', 'Nous revenons vers vous à l’adresse indiquée.')
      return
    }
    showFieldErrors(result.errors ?? {})
    if (response.status === 422) {
      showStatus('error', 'Quelques informations sont à corriger.', 'Votre saisie est conservée.')
    } else {
      showStatus('error', 'Votre demande n’a pas pu être transmise.', 'Votre message est conservé : vous pouvez le corriger ou réessayer.')
    }
  } catch {
    showStatus('error', 'Votre demande n’a pas pu être transmise.', 'Vérifiez votre connexion : votre message est conservé, vous pouvez réessayer.')
  } finally {
    submit.disabled = false
  }
})
