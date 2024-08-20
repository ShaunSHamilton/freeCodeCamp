import { readFileSync } from 'fs';

let introJson = {};

try {
  const jsonData = readFileSync(
    '../client/i18n/locales/english/intro.json',
    'utf8'
  );
  introJson = JSON.parse(jsonData);
  delete introJson['misc-text'];
} catch (error) {
  console.error('Error reading file:', error);
}

const flatBlocks = Object.values(introJson).reduce((allBlocks, superblock) => {
  return { ...allBlocks, ...superblock.blocks };
}, {});

export const getSuperblockTitle = dashedName => {
  return introJson[dashedName].title;
};

export const getBlockTitle = dashedName => {
  return flatBlocks[dashedName].title;
};
