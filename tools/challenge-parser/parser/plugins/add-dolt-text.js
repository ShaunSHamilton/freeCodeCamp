const { isEmpty } = require('lodash');
const { root } = require('mdast-builder');
const mdastToMarkdown = require('mdast-util-to-markdown');
const getAllBetween = require('./utils/between-headings');

function addDoltText(sectionIds) {
  if (!sectionIds || !Array.isArray(sectionIds) || sectionIds.length <= 0) {
    throw new Error('addText must have an array of section ids supplied');
  }
  function transformer(tree, file) {
    for (const sectionId of sectionIds) {
      const textNodes = getAllBetween(tree, `--${sectionId}--`);
      const sectionText = mdastToMarkdown(root(textNodes));

      if (!isEmpty(sectionText)) {
        file.data = {
          ...file.data,
          [sectionId]: sectionText.trim()
        };
      }
    }
  }
  return transformer;
}

module.exports = addDoltText;
