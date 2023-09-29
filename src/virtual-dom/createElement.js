function creareElement(tagName, config = {}, children = []) {
  const virtualElement = Object.create(null)
  Object.assign(virtualElement, {
    tagName,
    config: config === null ? {} : config,
    children,
  })
  return virtualElement
}

export default creareElement
