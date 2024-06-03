const { readFileSync } = require('fs');

const newCurriculumFile = readFileSync('./curriculum.json', 'utf8');
const oldCurriculumFile = readFileSync('./learn-curriculum.json', 'utf8');
const newCurriculum = JSON.parse(newCurriculumFile);
const oldCurriculum = JSON.parse(oldCurriculumFile);

const newCertifications = newCurriculum.certifications;
const oldCertifications = oldCurriculum.certifications;
delete newCurriculum.certifications;
delete oldCurriculum.certifications;
const superblocks = Object.keys(newCurriculum);

const testCertifications = true;
const testMeta = true;
const testChallenges = true;

describe('curriculum', () => {
  it('should have all the same keys', () => {
    expect(Object.keys(newCurriculum)).toEqual(Object.keys(oldCurriculum));
  });

  if (testCertifications) {
    describe('certifications', () => {
      // uncomment this to see all the differences
      // it('should have the same certifications', () => {
      //   expect(newCertifications).toEqual(oldCertifications);
      // });

      describe('blocks', () => {
        const newBlocks = Object.keys(newCertifications.blocks);
        const oldBlocks = Object.keys(oldCertifications.blocks);

        it('should have the same keys', () => {
          expect(newBlocks).toEqual(oldBlocks);
        });

        newBlocks.forEach(certKey => {
          describe(certKey, () => {
            const newChallenges = newCertifications.blocks[certKey].challenges;
            const oldChallenges = oldCertifications.blocks[certKey].challenges;

            it(`should have a challenges array with a singe item`, () => {
              expect(newChallenges).toHaveLength(1);

              expect(oldChallenges).toHaveLength(1);
            });

            describe('challenges', () => {
              const newChallenge = newChallenges[0];
              const oldChallenge = oldChallenges[0];

              it(`should have the same properties and values`, () => {
                expect(newChallenge.id).toEqual(oldChallenge.id);

                expect(newChallenge.title).toEqual(oldChallenge.title);

                expect(newChallenge.certification).toEqual(
                  oldChallenge.certification
                );

                expect(newChallenge.challengeType).toEqual(
                  oldChallenge.challengeType
                );

                expect(newChallenge.isPrivate).toEqual(oldChallenge.isPrivate);

                // should have a 'tests' array with the same length
                expect(newChallenge.tests.length).toEqual(
                  oldChallenge.tests.length
                );

                // should have a 'tests' array with the same id's, in any order
                // order shouldn't matter?
                const newTestIds = newChallenge.tests
                  .map(test => test.id)
                  .sort();
                const oldTestIds = oldChallenge.tests
                  .map(test => test.id)
                  .sort();
                expect(newTestIds).toEqual(oldTestIds);
              });

              // I don't think the title matters, pretty sure it's not used.
              // The title's in the database don't always match the title used in this file.
              // also, some title's aren't challenges. E.g. the tests for the full stack cert
              // are other certifications. So they aren't in the database as challenges or anything.
            });
          });
        });
      });
    });
  }

  describe('superblocks', () => {
    superblocks.forEach(superblock => {
      describe(superblock, () => {
        const newBlocks = Object.keys(newCurriculum[superblock].blocks);
        const oldBlocks = Object.keys(oldCurriculum[superblock].blocks);

        it('should have all the same keys', () => {
          expect(Object.keys(newBlocks)).toEqual(Object.keys(oldBlocks));
        });

        newBlocks.forEach(block => {
          describe(block, () => {
            if (testMeta) {
              describe('meta', () => {
                const newBlockMeta =
                  newCurriculum[superblock].blocks[block].meta;
                const oldBlockMeta =
                  oldCurriculum[superblock].blocks[block].meta;

                // uncomment this to see all the differences
                // it(`${superblock} : ${block} should have the same meta`, () => {
                //   expect(newBlockMeta).toEqual(oldBlockMeta);
                // });

                it(`should have the same properties and values`, () => {
                  expect(Object.keys(newBlockMeta).sort()).toEqual(
                    Object.keys(oldBlockMeta).sort()
                  );

                  expect(newBlockMeta.isUpcomingChange).toEqual(
                    oldBlockMeta.isUpcomingChange
                  );

                  expect(newBlockMeta.dashedName).toEqual(
                    oldBlockMeta.dashedName
                  );

                  expect(newBlockMeta.helpCategory).toEqual(
                    oldBlockMeta.helpCategory
                  );

                  expect(newBlockMeta.usesMultifileEditor).toEqual(
                    oldBlockMeta.usesMultifileEditor
                  );

                  expect(newBlockMeta.hasEditableBoundaries).toEqual(
                    oldBlockMeta.hasEditableBoundaries
                  );

                  expect(newBlockMeta.disableLoopProtectTests).toEqual(
                    oldBlockMeta.disableLoopProtectTests
                  );

                  expect(newBlockMeta.disableLoopProtectPreview).toEqual(
                    oldBlockMeta.disableLoopProtectPreview
                  );

                  expect(newBlockMeta.translationPending).toEqual(
                    oldBlockMeta.translationPending
                  );

                  expect(newBlockMeta.order).toEqual(oldBlockMeta.order);

                  expect(newBlockMeta.time).toEqual(oldBlockMeta.time);

                  expect(newBlockMeta.superBlock).toEqual(
                    oldBlockMeta.superBlock
                  );

                  expect(newBlockMeta.template).toEqual(oldBlockMeta.template);

                  expect(newBlockMeta.required).toEqual(oldBlockMeta.required);

                  // challengeOrder, the titles aren't used in the clients
                  const newOrder = newBlockMeta.challengeOrder.map(({ id }) => {
                    return { id };
                  });
                  const oldOrder = oldBlockMeta.challengeOrder.map(({ id }) => {
                    return { id };
                  });
                  expect(newOrder).toEqual(oldOrder);
                });
              });
            }

            if (testChallenges) {
              describe('challenges', () => {
                const newBlockChallenges =
                  newCurriculum[superblock].blocks[block].challenges;
                const oldBlockChallenges =
                  oldCurriculum[superblock].blocks[block].challenges;

                // uncomment this to see all the differences
                // it(`${superblock} : ${block} should have the same challenges`, () => {
                //   expect(newBlockChallenges).toEqual(oldBlockChallenges);
                // });

                newBlockChallenges.forEach(newChallenge => {
                  describe(newChallenge.dashedName, () => {
                    const oldChallenge = oldBlockChallenges.find(
                      oldChallenge => oldChallenge.id === newChallenge.id
                    );

                    if (!oldChallenge) {
                      console.error(
                        `Could not find old challenge with id ${newChallenge.id}`
                      );
                      process.exit(1);
                    }

                    it('should have the same properties and values', () => {
                      expect(Object.keys(newChallenge).sort()).toEqual(
                        Object.keys(oldChallenge).sort()
                      );

                      expect(newChallenge.id).toEqual(oldChallenge.id);

                      expect(newChallenge.title).toEqual(oldChallenge.title);

                      expect(newChallenge.challengeType).toEqual(
                        oldChallenge.challengeType
                      );

                      expect(newChallenge.dashedName).toEqual(
                        oldChallenge.dashedName
                      );

                      expect(newChallenge.block).toEqual(oldChallenge.block);

                      expect(newChallenge.order).toEqual(oldChallenge.order);

                      expect(newChallenge.superBlock).toEqual(
                        oldChallenge.superBlock
                      );

                      expect(newChallenge.superOrder).toEqual(
                        oldChallenge.superOrder
                      );

                      expect(newChallenge.certification).toEqual(
                        oldChallenge.certification
                      );

                      expect(newChallenge.challengeOrder).toEqual(
                        oldChallenge.challengeOrder
                      );

                      expect(newChallenge.helpCategory).toEqual(
                        oldChallenge.helpCategory
                      );

                      expect(newChallenge.time).toEqual(oldChallenge.time);

                      expect(newChallenge.usesMultifileEditor).toEqual(
                        oldChallenge.usesMultifileEditor
                      );

                      expect(newChallenge.hasEditableBoundaries).toEqual(
                        oldChallenge.hasEditableBoundaries
                      );

                      expect(newChallenge.disableLoopProtectTests).toEqual(
                        oldChallenge.disableLoopProtectTests
                      );

                      expect(newChallenge.disableLoopProtectPreview).toEqual(
                        oldChallenge.disableLoopProtectPreview
                      );

                      expect(newChallenge.solutions).toEqual(
                        oldChallenge.solutions
                      );

                      expect(newChallenge.required).toEqual(
                        oldChallenge.required
                      );

                      expect(newChallenge.template).toEqual(
                        oldChallenge.template
                      );

                      expect(newChallenge.assignments).toEqual(
                        oldChallenge.assignments
                      );
                      expect(newChallenge.tests).toEqual(oldChallenge.tests);

                      expect(newChallenge.translationPending).toEqual(
                        oldChallenge.translationPending
                      );

                      expect(newChallenge.description).toEqual(
                        oldChallenge.description
                      );

                      expect(newChallenge.instructions).toEqual(
                        oldChallenge.instructions
                      );

                      expect(newChallenge.notes).toEqual(oldChallenge.notes);

                      expect(newChallenge.challengeFiles).toEqual(
                        oldChallenge.challengeFiles
                      );

                      // 3 failing - should be fixed with https://github.com/freeCodeCamp/freeCodeCamp/pull/55014
                      expect(newChallenge.fillInTheBlank).toEqual(
                        oldChallenge.fillInTheBlank
                      );

                      expect(newChallenge.bilibiliIds).toEqual(
                        oldChallenge.bilibiliIds
                      );

                      expect(newChallenge.scene).toEqual(oldChallenge.scene);

                      expect(newChallenge.forumTopicId).toEqual(
                        oldChallenge.forumTopicId
                      );

                      expect(newChallenge.msTrophyId).toEqual(
                        oldChallenge.msTrophyId
                      );

                      expect(newChallenge.prerequisites).toEqual(
                        oldChallenge.prerequisites
                      );

                      // 1 failing - should be fixed with https://github.com/freeCodeCamp/freeCodeCamp/pull/55013
                      expect(newChallenge.question).toEqual(
                        oldChallenge.question
                      );

                      expect(newChallenge.videoId).toEqual(
                        oldChallenge.videoId
                      );

                      expect(newChallenge.videoLocaleIds).toEqual(
                        oldChallenge.videoLocaleIds
                      );

                      expect(newChallenge.videoUrl).toEqual(
                        oldChallenge.videoUrl
                      );

                      expect(newChallenge.url).toEqual(oldChallenge.url);
                    });
                  });
                });
              });
            }
          });
        });
      });
    });
  });
});
