function renderElement(node) {
  const $el = document.createElement(node.tagName)

  for (const [k, v] of Object.entries(node.config)) {
    $el.setAttribute(k, v)
  }

  for (const child of node.children) {
    $el.appendChild(render(child))
  }

  return $el
}

function render(virtualNode) {
  if (typeof virtualNode === 'string') {
    return document.createTextNode(virtualNode)
  }

  return renderElement(virtualNode)
}

export default render
