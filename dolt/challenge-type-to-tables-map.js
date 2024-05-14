import { challengeTypes } from '../shared/config/challenge-types.js';
import { insert } from './utils.js';

const ids = {
  app_url: 1,
  source_code_url: 1,
  local_address_allowed: 1,
  editor_address_allowed: 1,
  display_preview_modal: 1
};

const app_url = required => async (connection, challenge) =>
  await insert(
    connection,
    'app_url',
    ['id', 'challenge_id', 'required'],
    [ids.app_url++, challenge.id, required]
  );
const source_code_url = required => async (connection, challenge) =>
  await insert(
    connection,
    'source_code_url',
    ['id', 'challenge_id', 'required'],
    [ids.source_code_url++, challenge.id, required]
  );
const local_address_allowed = async (connection, challenge) =>
  await insert(
    connection,
    'local_address_allowed',
    ['id', 'challenge_id'],
    [ids.local_address_allowed++, challenge.id]
  );
const editor_address_allowed = async (connection, challenge) =>
  await insert(
    connection,
    'editor_address_allowed',
    ['id', 'challenge_id'],
    [ids.editor_address_allowed++, challenge.id]
  );

const display_preview_modal = async (connection, challenge) => {
  if (
    challenge.order === 0 &&
    challenge.block !==
      'learn-introductory-javascript-by-building-a-pyramid-generator'
  ) {
    await insert(
      connection,
      'display_preview_modal',
      ['id', 'challenge_id'],
      [ids.display_preview_modal++, challenge.id]
    );
  }
};

export const challengeTypeToTablesMap = {
  [challengeTypes.html]: [display_preview_modal],
  [challengeTypes.js]: [],
  [challengeTypes.jsProject]: [],
  [challengeTypes.frontEndProject]: [app_url(true)],
  [challengeTypes.backEndProject]: [
    app_url(false),
    source_code_url(true),
    local_address_allowed,
    editor_address_allowed
  ],
  [challengeTypes.pythonProject]: [source_code_url(true)],
  [challengeTypes.modern]: [display_preview_modal],
  [challengeTypes.step]: [],
  [challengeTypes.quiz]: [],
  [challengeTypes.backend]: [app_url(true), local_address_allowed],
  [challengeTypes.video]: [],
  [challengeTypes.codeAllyPractice]: [],
  [challengeTypes.codeAllyCert]: [app_url(true), editor_address_allowed],
  [challengeTypes.multifileCertProject]: [display_preview_modal],
  [challengeTypes.theOdinProject]: [],
  [challengeTypes.colab]: [],
  [challengeTypes.exam]: [],
  [challengeTypes.msTrophy]: [],
  [challengeTypes.multipleChoice]: [],
  [challengeTypes.python]: [display_preview_modal],
  [challengeTypes.dialogue]: [],
  [challengeTypes.fillInTheBlank]: [],
  [challengeTypes.multifilePythonCertProject]: [display_preview_modal]
};

// Features
/**
 * 1. app_url (required) {
 *  challenge_id INT
 *  required BOOLEAN
 * }
 * 2. source_code_url (required)
 * 3. local_address_allowed
 * 4. editor_address_allowed
 * 5. display_preview_modal
 * 6. js_console
 * 7. python_console
 * 8.
 */

// challengeType.modern === challengeType.js + preview
