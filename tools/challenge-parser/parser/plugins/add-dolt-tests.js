const { root } = require('mdast-builder');
const chunk = require('lodash/chunk');
const mdastToMarkdown = require('mdast-util-to-markdown');
const getAllBetween = require('./utils/between-headings');

function plugin() {
  return transformer;

  function transformer(tree, file) {
    const hintNodes = getAllBetween(tree, '--hints--');
    if (hintNodes.length % 2 !== 0)
      throw Error('Tests must be in (text, ```testString```) order');

    const tests = chunk(hintNodes, 2).map(getTest);
    file.data.tests = tests;
  }
}

function getTest(hintNodes) {
  const [textNode, testStringNode] = hintNodes;
  const text = mdastToMarkdown(root([textNode])).trim();
  const testString = testStringNode.value;

  if (!text) throw Error('text is missing from hint');
  // stub tests (i.e. text, but no testString) are allowed, but the md must
  // have a code block, even if it is empty.
  if (!testString && testString !== '')
    throw Error('testString (code block) is missing from hint');

  return { text, testString };
}

module.exports = plugin;
