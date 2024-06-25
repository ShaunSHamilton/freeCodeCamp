const mdastToHTML = require('./utils/mdast-to-html');

function plugin() {
  return transformer;

  function transformer(tree) {
    return mdastToHTML(tree.children);
  }
}

module.exports = plugin;
