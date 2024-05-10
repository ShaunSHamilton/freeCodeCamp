const { root } = require('mdast-builder');
const mdastToMarkdown = require('mdast-util-to-markdown');
const getAllBetween = require('./utils/between-headings');
const { splitOnThematicBreak } = require('./utils/split-on-thematic-break');

function plugin() {
  return transformer;

  function transformer(tree, file) {
    const assignmentNodes = getAllBetween(tree, '--assignment--');

    const assignment = getAssignments(assignmentNodes).filter(a => a != '');

    file.data.assignments = assignment;
  }

  function getAssignments(assignmentNodes) {
    const assignmentGroups = splitOnThematicBreak(assignmentNodes);

    return assignmentGroups.map(assignment =>
      mdastToMarkdown(root(assignment)).trim()
    );
  }
}

module.exports = plugin;
