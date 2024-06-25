import { readFileSync, readdirSync } from 'fs';

let upcomingBlocks = {};
let usesMultifileEditorBlocks = {};

const metaPath = '../curriculum/challenges/_meta';

const filesToIgnore = ['.DS_Store'];

try {
  const metaDir = readdirSync(metaPath);

  metaDir.forEach(file => {
    if (!filesToIgnore.includes(file)) {
      const metaFile = readFileSync(`${metaPath}/${file}/meta.json`, 'utf8');
      const metaJson = JSON.parse(metaFile);
      upcomingBlocks[metaJson.dashedName] = metaJson.isUpcomingChange;
      usesMultifileEditorBlocks[metaJson.dashedName] =
        metaJson.usesMultifileEditor;
    }
  });
} catch (error) {
  console.error('Error:', error);
}

export const getBlockIsUpcoming = dashedName => {
  return upcomingBlocks[dashedName];
};

export const getUsesMultifileEditor = dashedName => {
  return usesMultifileEditorBlocks[dashedName];
};
