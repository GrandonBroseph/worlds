module.exports = function h2node(tag, attributes, children) {
  if (!children) children = []
  return {
    tag: tag,
    attributes: attributes,
    children: children
  }
}
