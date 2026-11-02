// Menu mobile : le menu reste visible sans JavaScript, il n’est replié que lorsque ce script est chargé.
const toggle = document.querySelector('[data-nav-toggle]')
const nav = document.getElementById('main-nav')

if (toggle && nav) {
  document.documentElement.classList.add('js')
  toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true'
    toggle.setAttribute('aria-expanded', String(!isOpen))
    nav.classList.toggle('is-open', !isOpen)
  })
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && nav.classList.contains('is-open')) {
      toggle.setAttribute('aria-expanded', 'false')
      nav.classList.remove('is-open')
      toggle.focus()
    }
  })
}
