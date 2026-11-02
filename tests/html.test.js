import test from 'node:test'
import assert from 'node:assert/strict'
import { html, raw, escapeHtml, jsonForScript } from '../src/html.js'

test('les valeurs interpolées sont échappées', () => {
  assert.equal(String(html`<p>${'<script>alert(1)</script>'}</p>`), '<p>&lt;script&gt;alert(1)&lt;/script&gt;</p>')
})

test('les fragments html() imbriqués ne sont pas échappés deux fois', () => {
  assert.equal(String(html`<ul>${['a', 'b'].map((item) => html`<li>${item}</li>`)}</ul>`), '<ul><li>a</li><li>b</li></ul>')
})

test('null, undefined et false ne produisent rien', () => {
  assert.equal(String(html`[${null}${undefined}${false}]`), '[]')
})

test('raw() n’échappe pas, escapeHtml() échappe les guillemets', () => {
  assert.equal(String(raw('<b>')), '<b>')
  assert.equal(escapeHtml('"a" & \'b\''), '&quot;a&quot; &amp; &#39;b&#39;')
})

test('jsonForScript ne permet pas de fermer la balise script', () => {
  assert.ok(!String(jsonForScript({ text: '</script><b>' })).includes('<'))
})
