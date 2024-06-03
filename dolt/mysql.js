import { readFile } from 'fs/promises';
import { createConnection } from 'mysql';
import {
  getTableName,
  getColumnType,
  runCreateTable,
  insert,
  removeNulls
} from './utils.js';
import { challengeTypeToTablesMap } from './challenge-type-to-tables-map.js';
import { getSuperblockTitle, getBlockTitle } from './intro-dot-json-info.js';
import {
  getBlockIsUpcoming,
  getUsesMultifileEditor
} from './meta-dot-json-info.js';

export async function withConnection(connectionString, callback) {
  const connection = createConnection(connectionString);
  connection.connect();
  await callback(connection);
  connection.end();
}

export async function seed(connection) {
  const sql = await readFile('./queries/seed.sql', 'utf8');
  const queries = sql.split(';\n\n');
  for (const query of queries) {
    await runCreateTable(connection, query);
  }
}

export async function createTables(connection, data) {
  const createdTables = [];
  for (const challengeNode of data) {
    const {
      // Filter out fields not related to 'feature' tables
      __typename,
      /* eslint-disable @typescript-eslint/no-unused-vars */
      block,
      certification,
      challengeOrder,
      dashedName,
      id,
      order,
      superBlock,
      superOrder,

      description,
      time,
      url,
      required,
      ...challenge
    } = challengeNode.challenge;
    /* eslint-enable @typescript-eslint/no-unused-vars */

    // SPECIAL CASES
    // Usually, because of reserved words in mysql
    challenge.descriptions = description;
    // challenge.time_to_complete = time;
    challenge.course_url = url;
    challenge.required_resources = required;

    for (const [key, value] of Object.entries(challenge)) {
      // Filter out null values
      if (!value) {
        continue;
      }

      const tableName = getTableName(key);
      const columnType = getColumnType(value);
      let sql = '';
      if (columnType === 'BOOLEAN') {
        sql = `
CREATE TABLE IF NOT EXISTS ${tableName} (
  id INT NOT NULL AUTO_INCREMENT,
  challenge_id INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (challenge_id) REFERENCES challenges(id)
);`;
      } else {
        sql = `
CREATE TABLE IF NOT EXISTS ${tableName} (
  id INT NOT NULL AUTO_INCREMENT,
  challenge_id INT NOT NULL,
  ${key} ${columnType},
  PRIMARY KEY (id),
  FOREIGN KEY (challenge_id) REFERENCES challenges(id)
);`;
      }
      if (!createdTables.includes(tableName)) {
        createdTables.push(tableName);
        await runCreateTable(connection, sql);
      }
    }
  }
}

export async function addCertifications(connection, data) {
  let certification_id = 1;
  for (const certificateNode of data) {
    const { certification, id, tests, title } = certificateNode.challenge;

    await insert(
      connection,
      'certifications',
      ['id', 'title', 'object_id', 'dashed_name', 'state'],
      [
        certification_id,
        title,
        id,
        certification,
        title.includes('Legacy') ? 'legacy' : 'current'
      ]
    );
    for (const test of tests) {
      const { id: test_id } = test;
      await insert(
        connection,
        'certifications_prerequisites',
        ['certification_id', 'prerequisite_object_id'],
        [certification_id, test_id]
      );
    }

    certification_id += 1;
  }
}

export async function addChallenges(connection, data) {
  const superblockSet = new Set();
  const blockSet = new Set();

  const superblock_to_superblock_id_map = new Map();
  const block_to_block_id_map = new Map();
  const feature_table_ids = {};
  let block_id = 1;
  let superblock_id = 1;
  let block_time_to_complete_id = 1;
  let block_is_upcoming_id = 1;
  let uses_multifile_editor_id = 1;
  let c = 1;

  for (const challengeNode of data) {
    const {
      /* eslint-disable @typescript-eslint/no-unused-vars */
      superBlock,
      superOrder,
      id,
      challengeOrder,
      certification,
      order,
      block,
      title,
      dashedName,

      __typename,
      description,
      time,
      required,
      url,
      ...challenge
    } = challengeNode.challenge;
    /* eslint-enable @typescript-eslint/no-unused-vars */

    // SPECIAL CASES
    challenge.descriptions = description;
    // challenge.time_to_complete = time;
    challenge.course_url = url;
    challenge.required_resources = required;

    if (!superblockSet.has(superBlock)) {
      await insert(
        connection,
        'superblocks',
        ['id', 'title', 'dashed_name', 'superblock_order'],
        [superblock_id, getSuperblockTitle(superBlock), superBlock, superOrder]
      );
      superblockSet.add(superBlock);
      superblock_to_superblock_id_map.set(superBlock, superblock_id);
      superblock_id += 1;
    }

    if (!blockSet.has(block)) {
      await insert(
        connection,
        'blocks',
        ['id', 'title', 'dashed_name'],
        [block_id, getBlockTitle(block), block]
      );
      blockSet.add(block);
      block_to_block_id_map.set(block, block_id);

      // Add `block_time_to_complete` and `block_is_upcoming` as special case, because it is per-block
      if (time) {
        await insert(
          connection,
          'block_time_to_complete',
          ['id', 'block_id', 'time_to_complete'],
          [block_time_to_complete_id++, block_id, time]
        );
      }

      if (getBlockIsUpcoming(block)) {
        await insert(
          connection,
          'block_is_upcoming',
          ['id', 'block_id'],
          [block_is_upcoming_id++, block_id]
        );
      }

      const superblockId = superblock_to_superblock_id_map.get(superBlock);
      await insert(
        connection,
        'superblocks_blocks',
        ['superblock_id', 'block_id', 'block_order'],
        [superblockId, block_id, order]
      );

      block_id += 1;
    }

    await insert(
      connection,
      'challenges',
      ['id', 'title', 'object_id', 'dashed_name'],
      [c, title, id, dashedName]
    );

    if (block_to_block_id_map.get(block)) {
      const blockId = block_to_block_id_map.get(block);
      await insert(
        connection,
        'blocks_challenges',
        ['block_id', 'challenge_id', 'challenge_order'],
        [blockId, c, challengeOrder]
      );
    }

    challengeTypeToTablesMap[challenge.challengeType].forEach(async fn => {
      const reChallenge = { block, id: c, order, ...challenge };
      await fn(connection, reChallenge);
    });

    // Add to feature tables
    for (const [key, value] of Object.entries(challenge)) {
      const tableName = getTableName(key);
      if (typeof value !== 'number' && (!value || value?.length === 0)) {
        continue;
      }

      if (!feature_table_ids[tableName]) {
        feature_table_ids[tableName] = 1;
      } else {
        feature_table_ids[tableName]++;
      }

      const columnType = getColumnType(value);
      const values = [feature_table_ids[tableName], c];
      if (columnType === 'BOOLEAN') {
        if (value) {
          await insert(connection, tableName, ['id', 'challenge_id'], values);
        } else {
          continue;
        }
      } else if (columnType === 'JSON') {
        // to clone the object so we can delete the null values
        const newValue = JSON.parse(JSON.stringify(value));
        values.push(JSON.stringify(removeNulls(newValue)));
        await insert(
          connection,
          tableName,
          ['id', 'challenge_id', key],
          values
        );
      } else {
        values.push(value);
        await insert(
          connection,
          tableName,
          ['id', 'challenge_id', key],
          values
        );
      }
    }

    if (getUsesMultifileEditor(block)) {
      await insert(
        connection,
        'uses_multifile_editor',
        ['id', 'challenge_id'],
        [uses_multifile_editor_id++, c]
      );
    }

    c += 1;
  }
}
