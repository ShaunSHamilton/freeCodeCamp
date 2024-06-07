require('colors');
const { readFile } = require('fs/promises');
const { writeFileSync } = require('fs');
const Diff = require('diff');

async function main() {
  const data = await readFile('./cdb-progress.json', 'utf8');
  writeFileSync('./diff.txt', '');

  const json = JSON.parse(data);

  for (const val of json) {
    const diff = Diff.diffJson(val.expected, val.actual);
    let nicer = `|---- ${val.challenge_id} > ${val.property} ----|\n`;
    diff.forEach(part => {
      // green for additions, red for deletions
      let text = part.added
        ? part.value.green
        : part.removed
          ? part.value.red
          : part.value;

      nicer += text;
    });
    writeFileSync('./diff.txt', nicer + '\n', { flag: 'a' });
    // console.log();
  }
}

main();
