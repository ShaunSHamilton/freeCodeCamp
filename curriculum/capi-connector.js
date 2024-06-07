const { readFile, writeFile } = require('fs/promises');

// RESET LOG FILE:
writeFile('./cdb-progress.json', '[]');

const writeQueue = {
  queue: [],
  isWriting: false
};

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
  const matching_challenge = challenges.find(
    ({ objectId }) => objectId === challenge.id
  );

  if (!matching_challenge) {
    return await addToLog({
      challenge_id: challenge.id,
      property: null,
      expected: challenge,
      actual: 'fcc-undefined'
    });
  }

  const challenge_keys = Object.keys(challenge);

  for (let key of challenge_keys) {
    switch (key) {
      case 'id':
        continue;
      case 'order':
        key = 'blockOrder';
        break;
      case 'superOrder':
        key = 'superblockOrder';
        break;
      case 'block':
        key = 'blockDashedName';
        break;
      case 'superBlock':
        key = 'superblockDashedName';
        break;
      default:
        break;
    }
    if (!isDeepEqual(challenge[key], matching_challenge[key])) {
      await addToLog({
        challenge_id: challenge.id,
        property: key,
        expected: fccUndefined(challenge[key]),
        actual: fccUndefined(matching_challenge[key])
      });
    }
  }
}

function fccUndefined(val) {
  return typeof val === 'undefined' ? 'fcc-undefined' : val;
}

function isDeepEqual(a, b) {
  if (a === b) {
    return true;
  }

  // API returns undefined for props which are empty arrays.
  // This should probably be fixed, but, for the sake of less diff,
  // empty arrays are treated equivalent to undefined.
  if (emptyArrayEqUndefined(a, b)) {
    return true;
  }

  if (typeof a !== typeof b) {
    return false;
  }

  if (typeof a === 'object' && a !== null && b !== null) {
    // Handle arrays such that order does not matter
    if (Array.isArray(a) && Array.isArray(b)) {
      const every = a.every(e_a => {
        return b.some(e_b => isDeepEqual(e_a, e_b));
      });
      return every;
    }

    // Props to ignore:
    if ('error' in a || 'error' in b) {
      return true;
    }

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

function emptyArrayEqUndefined(a, b) {
  if (Array.isArray(a) && a.length === 0) {
    return typeof b === 'undefined';
  }

  if (Array.isArray(b) && b.length === 0) {
    return typeof a === 'undefined';
  }

  return false;
}

async function addToLog(value) {
  if (writeQueue.isWriting) {
    writeQueue.queue.push(value);
    return;
  }
  writeQueue.isWriting = true;
  const data = await readFile('./cdb-progress.json', 'utf-8');
  // console.log('Data: ', data);
  // console.log('-----------');
  // console.log('Value: ', value);
  const logs = JSON.parse(data);
  logs.push(value);
  await writeFile('./cdb-progress.json', JSON.stringify(logs, null, 2));
  writeQueue.isWriting = false;
  handleQueue();
}

// Handle any remaining logs in the queue
async function handleQueue() {
  if (writeQueue.queue.length > 0) {
    const value = writeQueue.queue.shift();
    if (value) {
      await addToLog(value);
    }
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
let curriculum = fetch(`http://localhost:3010/challenges`)
  .then(r => r.json())
  .catch(console.error);

async function getChallenges(lang = 'english') {
  if (curriculum) {
    return curriculum;
  }

  const res = await fetch(`http://localhost:3010/challenges`);
  curriculum = await res.json();

  return curriculum;
}

module.exports = {
  compareCDBToFS,
  getCapDescription,
  getCapInstructions,
  fetchCapCurriculum
};
