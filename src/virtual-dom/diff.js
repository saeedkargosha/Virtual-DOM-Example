import render from './render.js'

function diffProps(oldProps, newProps) {
  const patches = []

  // setting newProps
  for (const [k, v] of Object.entries(newProps)) {
    patches.push($node => {
      $node.setAttribute(k, v)
      return $node
    })
  }

  // removing props
  for (const k in oldProps) {
    if (!(k in newProps)) {
      patches.push($node => {
        $node.removeAttribute(k)
        return $node
      })
    }
  }

  return $node => {
    for (const patch of patches) {
      patch($node)
    }
    return $node
  }
}

function diffChildren(oldVChildren, newVChildren) {
  const childPatches = []
  oldVChildren.forEach((oldVChild, i) => {
    childPatches.push(diff(oldVChild, newVChildren[i]))
  })

  const additionalPatches = []
  for (const additionalVChild of newVChildren.slice(oldVChildren.length)) {
    additionalPatches.push($node => {
      $node.appendChild(render(newVChildren))
      return $node
    })
  }

  return $parent => {
    // since childPatches are expecting the $child, not $parent,
    // we cannot just loop through them and call patch($parent)
    $parent.childNodes.forEach(($child, i) => {
      childPatches[i]($child)
    })

    for (const patch of additionalPatches) {
      patch($parent)
    }
    return $parent
  }
}

function diff(oldVirtualTree, newVirtualTree) {
  if (newVirtualTree === undefined) {
    return $node => {
      $node.remove()
      return undefined
    }
  }

  if (
    typeof oldVirtualTree === 'string' ||
    typeof newVirtualTree === 'string'
  ) {
    if (oldVirtualTree !== newVirtualTree) {
      return $node => {
        const $newNode = render(newVirtualTree)
        $node.replaceWith($newNode)
        return $newNode
      }
    } else {
      return $node => $node
    }
  }

  if (oldVirtualTree.tagName !== newVirtualTree.tagName) {
    return $node => {
      const $newNode = render(newVirtualTree)
      $node.replaceWith($newNode)
      return $newNode
    }
  }

  const patchProps = diffProps(oldVirtualTree.config, newVirtualTree.config)
  const patchChildren = diffChildren(
    oldVirtualTree.children,
    newVirtualTree.children
  )
  return $node => {
    patchProps($node)
    patchChildren($node)
    return $node
  }
}

export default diff
