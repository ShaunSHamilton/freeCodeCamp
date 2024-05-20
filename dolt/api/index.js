import express from 'express';
// uncomment if you want to write the curriculum.json file below
// import { writeFileSync } from 'fs';
import { createConnection } from 'mysql';
import {
  booleanFeatureTables,
  columnsToGraphqlName,
  featureTablesWithColumns,
  tablesToJson
} from './variables.js';

const app = express();

const db = createConnection('mysql://root:@127.0.0.1/dolt');

db.connect(err => {
  if (err) throw err;
  console.log('MySQL database connected');
});

function maybeJson(table, value) {
  return tablesToJson.includes(table) ? JSON.parse(value) : value;
}

async function runSQL(sql, values = []) {
  return new Promise((resolve, _reject) => {
    db.query(sql, values, (err, _result) => {
      if (err) {
        console.error('Error running SQL:\n', sql);
        throw err;
      }
      resolve(_result);
    });
  });
}

let challengesData = {};
let challengesArray = [];
let curriculum = {};

async function fetchCurriculumFromDB() {
  console.log('Fetching challenge data from database...');
  try {
    // add all challenges with block and superblock info to `challengesData`
    // this join adds a little time, only like 10 seconds - see if refactoring to separate queries speeds it up
    const challengesQuery = `SELECT
    c.id,
    c.title,
    object_id AS objectId,
    c.dashed_name AS dashedName,
    challenge_order AS challengeOrder,
    b.id AS blockId,
    b.title AS blockTitle,
    b.dashed_name AS blockDashedName,
    bt.time_to_complete AS blockTimeToComplete,
    block_order AS blockOrder,
    s.title AS superblockTitle,
    s.dashed_name AS superblockDashedName,
    superblock_order AS superblockOrder
  FROM challenges AS c
  FULL JOIN blocks_challenges AS bc ON c.id = bc.challenge_id
  FULL JOIN blocks as b ON bc.block_id = b.id
  FULL JOIN block_time_to_complete AS bt ON bt.block_id = b.id
  FULL JOIN superblocks_blocks as sb ON sb.block_id = b.id
  FULL JOIN superblocks AS s ON s.id = sb.superblock_id;`;

    const challenges = await runSQL(challengesQuery);

    challenges.forEach(challenge => {
      challengesData[challenge.id] = challenge;
    });

    // add all from features tables to `challengesData`
    for (const table of Object.keys(featureTablesWithColumns)) {
      const challenges = await runSQL(`SELECT * FROM ${table}`);

      challenges.forEach(challenge => {
        const column = featureTablesWithColumns[table];
        // name our learn client expects
        const graphQlName = columnsToGraphqlName[column] || column;

        challengesData[challenge.challenge_id][graphQlName] = maybeJson(
          table,
          challenge[column]
        );
      });
    }

    // add all boolean tables to `challengesData`
    for (const table of Object.keys(booleanFeatureTables)) {
      const challenges = await runSQL(`SELECT challenge_id FROM ${table}`);

      challenges.forEach(challenge => {
        challengesData[challenge.challenge_id][booleanFeatureTables[table]] =
          true;
      });
    }

    // still missing certification? inferred based on superblock in client
    // translationPending?

    challengesArray = Object.values(challengesData);

    // Below this, we take the challengesArray and create the curriculum object in the
    // way the two clients need. It creates the return of getChallengesForLang('english')
    // Still need to add "certifications" to the curriculum object
    const upcomingBlockIdsQuery = await runSQL(
      'SELECT block_id FROM block_is_upcoming'
    );
    const upcomingBlockIds = upcomingBlockIdsQuery.map(
      ({ block_id }) => block_id
    );

    for (const challenge of challengesArray) {
      const {
        objectId,
        title,
        challengeFiles = [],
        challengeOrder,
        blockId,
        blockTitle,
        blockDashedName,
        blockOrder,
        superblockDashedName,
        blockTimeToComplete = '',
        required = [],
        template = '',
        helpCategory = ''
      } = challenge;

      // create superblock if it doesn't exist
      if (!curriculum[superblockDashedName]) {
        curriculum[superblockDashedName] = {
          blocks: {}
        };
      }

      // create block if it doesn't exist
      if (!curriculum[superblockDashedName].blocks[blockDashedName]) {
        curriculum[superblockDashedName].blocks[blockDashedName] = {
          meta: {
            name: blockTitle,
            isUpcomingChange: upcomingBlockIds.includes(blockId),
            dashedName: blockDashedName,
            helpCategory: helpCategory,
            order: blockOrder,
            time: blockTimeToComplete,
            template,
            required,
            superBlock: superblockDashedName,
            challengeOrder: [],
            ...(challenge.disableLoopProtectTests && {
              disableLoopProtectTests: true
            }),
            ...(challenge.disableLoopProtectPreview && {
              disableLoopProtectPreview: true
            }),
            ...(challenge.usesMultifileEditor && { usesMultifileEditor: true })
          },
          challenges: []
        };
      }

      // if any challenge hasEditableBoundaries, add hasEditableBoundaries: true to its block meta
      const hasEditableBoundaries = challengeFiles.some(
        cf => cf.editableRegionBoundaries?.length > 0
      );

      if (hasEditableBoundaries) {
        curriculum[superblockDashedName].blocks[
          blockDashedName
        ].meta.hasEditableBoundaries = true;
      }

      // for each challenge, push to their block.challenges
      // TODO: markdownize values that need it
      // TODO: adjust key names, e.g. blockDashedName -> block
      curriculum[superblockDashedName].blocks[blockDashedName].challenges.push(
        challenge
      );

      // for each challenge, push to meta.challengeOrder
      curriculum[superblockDashedName].blocks[
        blockDashedName
      ].meta.challengeOrder[challengeOrder] = {
        id: objectId,
        title
      };
    }

    // remove nulls from challengeOrder - this is just for the curriculum.test.js
    // can remove once https://github.com/freeCodeCamp/freeCodeCamp/pull/54802 is in and on this branch
    const superblockKeys = Object.keys(curriculum);
    superblockKeys.forEach(superblockKey => {
      const blockKeys = Object.keys(curriculum[superblockKey].blocks);
      blockKeys.forEach(blockKey => {
        curriculum[superblockKey].blocks[blockKey].meta.challengeOrder =
          curriculum[superblockKey].blocks[blockKey].meta.challengeOrder.filter(
            Boolean
          );
      });
    });

    // uncomment to write curriculum.json file
    // writeFileSync(`./curriculum.json`, JSON.stringify(curriculum, null, 2));
    // console.log('Curriculum written to file');
  } catch (err) {
    console.error(err);
  }

  console.log('Finished fetching challenge data from the database');
}

fetchCurriculumFromDB();

app.get('/curriculum', (req, res) => {
  console.log('Someone is trying to get the curriculum!');
  res.json(curriculum);
});

app.get('/challenges', (req, res) => {
  console.log('Someone is trying to get the challenges!');
  res.json(challengesArray);
});

app.get('/superblock-map', async (req, res) => {
  const query = `SELECT title, dashed_name FROM superblocks ORDER BY superblock_order;`;
  const result = await runSQL(query);
  res.json(result);
});

app.get('/block-map', async (req, res) => {
  const q1 = `
SELECT s.title AS superblock_title,
  b.title AS block_title,
  s.dashed_name AS superblock_dashed_mame,
  b.dashed_name AS block_dashed_name,
  superblock_order,
  block_order
  FROM superblocks AS s
  FULL JOIN superblocks_blocks AS sb
  ON s.id = sb.superblock_id
  FULL JOIN blocks AS b
  ON b.id = sb.block_id
  ORDER BY superblock_order, block_order;`;

  const map = await runSQL(q1);

  res.json(map);
});

// TODO: Make sure to sanitize data on any endpoints that run a query from input

app.get('/challenge/:object_id', (req, res) => {
  console.log('Someone is trying to get a challenge!');
  const { object_id } = req.params;

  const query = `SELECT * FROM challenges WHERE object_id = ?`;

  db.query(query, [object_id], async (err, rows) => {
    if (err) throw res.send('Challenge not found');
    if (rows.length > 1)
      throw (
        'More than one row returned for challenge with object_id: ' + object_id
      );

    const returnChallenge = { ...rows[0] };
    const challengeId = rows[0].id;

    for (const table of Object.keys(featureTablesWithColumns)) {
      const tableColumns = featureTablesWithColumns[table];
      const challenges = await runSQL(
        `SELECT * FROM ${table} WHERE challenge_id = ?`,
        [challengeId]
      );

      challenges.forEach(challenge => {
        tableColumns.forEach(column => {
          // name our learn client expects
          const graphQlName = columnsToGraphqlName[column] || column;

          returnChallenge[graphQlName] = maybeJson(table, challenge[column]);
        });
      });
    }

    // add all boolean tables to `curriculumData`
    for (const table of Object.keys(booleanFeatureTables)) {
      const challenges = await runSQL(
        `SELECT challenge_id FROM ${table} WHERE challenge_id = ?`,
        [challengeId]
      );

      challenges.forEach(() => {
        returnChallenge[booleanFeatureTables[table]] = true;
      });
    }

    res.json(returnChallenge);
  });
});

app.get('/superblock/dashed-name/:name', (req, res) => {
  console.log('Someone is trying to get a superblock!');
  const { name } = req.params;
  const query = `SELECT * FROM superblocks WHERE dashed_name = ?`;

  db.query(query, [name], (err, rows) => {
    if (err) throw err;

    res.json(rows);
  });
});

const PORT = 3010;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
