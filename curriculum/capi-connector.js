const { readFile, writeFile } = require('fs/promises');

async function fetchCapCurriculum() {
  try {
    const response = await fetch('http://localhost:3010/curriculum');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching curriculum data:', error);
    throw error;
  }
}

function getChallengeFromPath(capCurriculum, englishPath) {
  return capCurriculum.find(
    c =>
      englishPath.endsWith(`${c.block}/${c.objectId}.md`) ||
      englishPath.endsWith(`${c.block}/${c.challengeDashedName}.md`)
  );
}

function getCapDescription(capCurriculum, englishPath) {
  const challenge = getChallengeFromPath(capCurriculum, englishPath);

  return challenge?.description
    ? `<section id="description">${challenge.description}</section>`
    : '';
}

function getCapInstructions(capCurriculum, englishPath) {
  const challenge = getChallengeFromPath(capCurriculum, englishPath);

  return challenge?.instructions
    ? `<section id="instruction">${challenge.instructions}</section>`
    : '';
}

/**
 * Compares the challenge in the Curriculum Database with the challenge in the file system after parsing.
 *
 * Stores a log of the differences at `/curriculum/cdb-progress.json`
 *
 * ```json
 * [{
 *   "challenge_id": string,
 *   "property": string,
 *   "expected": JSON,
 *   "actual": JSON | undefined
 * }]
 * ```
 * @param {Object} file - The file information
 * @param {Record<string, unknown>} file.challenge - The challenge information
 * @param {string} file.lang - The langauge of the file
 */
async function compareCDBToFS({ challenge, lang }) {
  const challenges = await getChallenges();
  const matching_challenge = challenges.find(({ id }) => id === challenge.id);

  if (!matching_challenge) {
    await addToLog('./cdb-progress.json', {
      challenge_id: challenge.id,
      property: null,
      expected: challenge,
      actual: undefined
    });
  }

  const challenge_keys = Object.keys(challenge);

  for (const key of challenge_keys) {
    if (!isDeepEqual(challenge[key], matching_challenge[key])) {
      await addToLog({
        challenge_id: challenge.id,
        property: key,
        expected: challenge[key],
        actual: matching_challenge[key]
      });
    }
  }
}

function isDeepEqual(a, b) {
  if (a === b) {
    return true;
  }

  if (typeof a !== typeof b) {
    return false;
  }

  if (typeof a === 'object' && a !== null && b !== null) {
    const a_keys = Object.keys(a);
    const b_keys = Object.keys(b);

    if (a_keys.length !== b_keys.length) {
      return false;
    }

    for (const key of a_keys) {
      if (!isDeepEqual(a[key], b[key])) {
        return false;
      }
    }

    return true;
  }

  return false;
}

async function addToLog(value) {
  const data = await readFile('./cdb-progress.json');
  const logs = JSON.parse(data);

  if (logs.length === 0) {
    await writeFile('./cdb-progress.json', JSON.stringify([value]));
  } else {
    logs.push(value);
    await writeFile('./cdb-progress.json', JSON.stringify(logs));
  }
}

/**
 * @type {{
 *     audioPath?: string,
 *     block: string,
 *     blockId?: string,
 *     challengeOrder?: number,
 *     certification: string,
 *     challengeType: number,
 *     dashedName: string,
 *     description?: string,
 *     disableLoopProtectTests: boolean,
 *     disableLoopProtectPreview: boolean,
 *     challengeFiles?: { fileKey: string, ext: string, name: string, editableRegionBoundaries: number[], path: string, head: string, tail: string, seed: string, contents: string, id: string, history: string[]},
 *     guideUrl?: string,
 *     hasEditableBoundaries?: boolean,
 *     helpCategory?: string,
 *     videoUrl?: string,
 *     fillInTheBlank?: { sentence: string, blanks: { answer: string, feedback: string }[] },
 *     forumTopicId?: number,
 *     id: string,
 *     instructions?: string,
 *     isComingSoon?: boolean,
 *     isLocked?: boolean,
 *     isPrivate?: boolean,
 *     msTrophyId?: string,
 *     notes?: string,
 *     order?: number,
 *     prerequisites?: { id: string, title: string }[],
 *     videoId?: string,
 *     videoLocaleIds?: string[],
 *     bilibiliIds?: { aid: number, bvid: string, cid: number },
 *     question?: { text: string, answers: { answer: string, feedback: string }[] },
 *     required?: { link: string, raw: boolean, src: string, crossDomain: boolean}[],
 *     assignments?: string[],
 *     scene?: { setup: { code: string, language: string }, commands: { command: string, code: string, language: string }[] },
 *     solutions?: { [T in FileKey]: FileKeyChallenge },
 *     superBlock: string,
 *     superOrder?: number,
 *     tests: { id: string, text: string, testString?: string, title?: string }[],
 *     template?: string,
 *     title: string,
 *     time?: string,
 *     translationPending: boolean,
 *     url?: string,
 *     usesMultifileEditor?: boolean,
 *   }}
 */
let curriculum;

async function getChallenges(lang = 'english') {
  if (curriculum) {
    return curriculum;
  }

  curriculum = await fetch(
    `http://localhost:3010/curriculum?lang=${lang}`
  ).then(res => res.json());

  return curriculum;
}

module.exports = {
  compareCDBToFS,
  getCapDescription,
  getCapInstructions,
  fetchCapCurriculum
};
