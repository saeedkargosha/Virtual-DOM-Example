import creareElement from './virtual-dom/createElement.js'
import diff from './virtual-dom/diff.js'
import mount from './virtual-dom/mount.js'
import render from './virtual-dom/render.js'

function createVirtalApp(count) {
  return creareElement('div', { id: 'app2' }, [
    'This is a test.',
    creareElement('input', { type: 'text' }),
    creareElement('div', null, [
      creareElement('p', null, ['count: ', String(count)]),
    ]),
  ])
}
let count = 0
let vApp = createVirtalApp(count)
const $app = render(vApp)
let $root = mount($app, document.getElementById('app'))

setInterval(() => {
  count++
  const vNewApp = createVirtalApp(count)
  const patch = diff(vApp, vNewApp)
  $root = patch($root)
  vApp = vNewApp
}, 1000)
