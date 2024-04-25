import { challengeTypes } from '../shared/config/challenge-types.js';

const app_url = required => async (connection, challenge_id) =>
  await insert(
    connection,
    'app_url',
    ['challenge_id', 'required'],
    [challenge_id, required]
  );
const source_code_url = required => async (connection, challenge_id) =>
  await insert(
    connection,
    'source_code_url',
    ['challenge_id', 'required'],
    [challenge_id, required]
  );
const local_address_allowed = async (connection, challenge_id) =>
  await insert(
    connection,
    'local_address_allowed',
    ['challenge_id'],
    [challenge_id]
  );
const editor_address_allowed = async (connection, challenge_id) =>
  await insert(
    connection,
    'editor_address_allowed',
    ['challenge_id'],
    [challenge_id]
  );

// Currently, needs the challenge_order to determine if is first challenge
const _display_preview_modal = async (connection, challenge_id) =>
  await insert(
    connection,
    'display_preview_modal',
    ['challenge_id'],
    [challenge_id]
  );

export const challengeTypeToTablesMap = {
  [challengeTypes.html]: [],
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
  [challengeTypes.modern]: [],
  [challengeTypes.step]: [],
  [challengeTypes.quiz]: [],
  [challengeTypes.backend]: [app_url(true), local_address_allowed],
  [challengeTypes.video]: [],
  [challengeTypes.codeAllyPractice]: [],
  [challengeTypes.codeAllyCert]: [app_url(true), editor_address_allowed],
  [challengeTypes.multifileCertProject]: [],
  [challengeTypes.theOdinProject]: [],
  [challengeTypes.colab]: [],
  [challengeTypes.exam]: [],
  [challengeTypes.msTrophy]: [],
  [challengeTypes.multipleChoice]: [],
  [challengeTypes.python]: [],
  [challengeTypes.dialogue]: [],
  [challengeTypes.fillInTheBlank]: [],
  [challengeTypes.multifilePythonCertProject]: []
};

async function insert(connection, tableName, columnNames, columnValues) {
  const values = columnValues.map(_v => `?`).join(', ');
  const columns = columnNames.join(', ');
  const sql = `INSERT INTO ${tableName} (${columns}) VALUES (${values});`;
  return new Promise((resolve, _reject) => {
    connection.query(sql, columnValues, (err, result) => {
      if (err) {
        console.error('Error running SQL:\n', sql);
        throw err;
      }
      resolve(result);
    });
  });
}

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
