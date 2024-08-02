const {
  parsedId,
  parsedTitle,
  parsedChallengeType,
  parsedDashedName,
  parsedVideoId,
  parsedBilibiliIds,
  parsedVideoLocaleIds,
  parsedForumTopicId,
  parsedHelpCategory,
  parsedMsTrophyId,
  parsedPrerequisites,
  parsedVideoUrl,
  parsedUrl,
  parsedDescription,
  parsedInstructions,
  parsedNotes,
  parsedHints,
  parsedAssignment,
  parsedQuestion,
  parsedFillInTheBlank,
  parsedScene,
  parsedChallengeFiles,
  parsedSolutions
} = require('./super-challenge.js');

const parseMDSync = require('./index.js').parseMDSync;
const parsed = parseMDSync('./super-challenge.md');

const {
  id,
  title,
  challengeFiles,
  challengeType,
  dashedName,
  videoId,
  bilibiliIds,
  videoLocaleIds,
  forumTopicId,
  helpCategory,
  msTrophyId,
  prerequisites,
  videoUrl,
  url,
  description,
  instructions,
  notes,
  tests,
  assignments,
  question,
  fillInTheBlank,
  scene,
  solutions
} = parsed;

describe('super-challenge parsed', () => {
  it('should have the correct ID', async () => {
    expect(id).toEqual(parsedId);
  });

  it('should have the correct title', async () => {
    expect(title).toEqual(parsedTitle);
  });

  it('should have the correct challenge type', async () => {
    expect(challengeType).toEqual(parsedChallengeType);
  });

  it('should have the correct dashed name', async () => {
    expect(dashedName).toEqual(parsedDashedName);
  });

  it('should have the correct video ID', async () => {
    expect(videoId).toEqual(parsedVideoId);
  });

  it("should have the correct Bilibili ID's", async () => {
    expect(bilibiliIds).toEqual(parsedBilibiliIds);
  });

  it("should have the correct video locale ID's", async () => {
    expect(videoLocaleIds).toEqual(parsedVideoLocaleIds);
  });

  it('should have the correct forum topic ID', async () => {
    expect(forumTopicId).toEqual(parsedForumTopicId);
  });

  it('should have the correct help category', async () => {
    expect(helpCategory).toEqual(parsedHelpCategory);
  });

  it('should have the correct MS trophy ID', async () => {
    expect(msTrophyId).toEqual(parsedMsTrophyId);
  });

  it('should have the correct prerequisites', async () => {
    expect(prerequisites).toEqual(parsedPrerequisites);
  });

  it('should have the correct video URL', async () => {
    expect(videoUrl).toEqual(parsedVideoUrl);
  });

  it('should have the correct URL', async () => {
    expect(url).toEqual(parsedUrl);
  });

  it('should have the correct description', async () => {
    expect(description).toEqual(parsedDescription);
  });

  it('should have the correct instructions', async () => {
    expect(instructions).toEqual(parsedInstructions);
  });

  it('should have the correct notes', async () => {
    expect(notes).toEqual(parsedNotes);
  });

  it('should have the correct tests', async () => {
    expect(tests).toEqual(parsedHints);
  });

  it('should have the correct assignments', async () => {
    expect(assignments).toEqual(parsedAssignment);
  });

  it('should have the correct question', async () => {
    expect(question).toEqual(parsedQuestion);
  });

  it('should have the correct fill in the blank', async () => {
    expect(fillInTheBlank).toEqual(parsedFillInTheBlank);
  });

  it('should have the correct scene', async () => {
    expect(scene).toEqual(parsedScene);
  });

  it('should have the correct challenge files', async () => {
    expect(challengeFiles).toEqual(parsedChallengeFiles);
  });

  it('should have the correct solutions', async () => {
    expect(solutions).toEqual(parsedSolutions);
  });
});
