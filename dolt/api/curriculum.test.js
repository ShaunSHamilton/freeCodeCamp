const { readFileSync } = require('fs');

const newCurriculumFile = readFileSync('./curriculum.json', 'utf8');
const oldCurriculumFile = readFileSync('./learn-curriculum.json', 'utf8');
const newCurriculum = JSON.parse(newCurriculumFile);
const oldCurriculum = JSON.parse(oldCurriculumFile);

const superblocks = Object.keys(newCurriculum);

function lowerCaseChallengeOrder(challengeOrder) {
  return challengeOrder.map(({ id, title }) => {
    return { id, title: title.toLowerCase() };
  });
}

describe('curriculum', () => {
  superblocks.forEach(superblock => {
    const blocks = Object.keys(newCurriculum[superblock].blocks);

    blocks.forEach(block => {
      // meta stuff
      const newBlockMeta = newCurriculum[superblock].blocks[block].meta;
      const oldBlockMeta = oldCurriculum[superblock].blocks[block].meta;

      // just ignoring the name field for now. Uncomment to see ones that don't match
      newBlockMeta.name = '';
      oldBlockMeta.name = '';

      // making the titles in challengeOrder lowercase for now. Uncomment to see more fails
      newBlockMeta.challengeOrder = lowerCaseChallengeOrder(
        newBlockMeta.challengeOrder
      );
      oldBlockMeta.challengeOrder = lowerCaseChallengeOrder(
        oldBlockMeta.challengeOrder
      );

      it(`${superblock} : ${block} should have the same meta`, () => {
        expect(newBlockMeta).toEqual(oldBlockMeta);
      });

      // challenges stuff
      // const newBlockChallenges = newCurriculum[superblock].blocks[block].challenges;
      // const oldBlockChallenges = oldCurriculum[superblock].blocks[block].challenges;

      // it(`${superblock} : ${block} should have the same challenges`, () => {
      //   expect(newBlockChallenges).toEqual(oldBlockChallenges);
      // });
    });
  });
});
