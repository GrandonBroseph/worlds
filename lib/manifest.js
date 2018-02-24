module.exports = function manifest(node) {
  if (typeof node !== "object") {
    return document.createTextNode(node)
  }
  var element = document.createElement(node.tag)
  for (var name in node.attributes) {
    var value = node.attributes[name]
    element.setAttribute(name, value)
  }
  for (var i = 0; i < node.children.length; i++) {
    var child = node.children[i]
    element.appendChild(manifest(child))
  }
  return element
}
