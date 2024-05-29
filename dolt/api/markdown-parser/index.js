const directive = require('remark-directive');
const remark = require('remark-parse');
const unified = require('unified');
const restoreDirectives = require('./plugins/restore-directives.js');
const tableAndStrikeThrough = require('./plugins/table-and-strikethrough.js');
const toHtml = require('./plugins/to-html.js');

const processor = unified()
  .use(remark)
  .use(tableAndStrikeThrough)
  .use(directive)
  .use(restoreDirectives)
  .use(toHtml);

const parseMdSync = markdown => {
  const tree = processor.parse(markdown);
  const html = processor.runSync(tree, markdown);
  return html;
};

module.exports = { parseMdSync };
