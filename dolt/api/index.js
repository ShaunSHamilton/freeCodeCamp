// uncomment if you want to write the curriculum.json file below
import { writeFileSync } from 'fs';
import express from 'express';
import { createConnection } from 'mysql';
import {
  maybeJson,
  fixSolutions,
  fixChallengeFiles,
  fixTests,
  fixNotes,
  fixDescription,
  fixInstructions,
  fixAssignments,
  fixFillInTheBlank,
  fixQuestion
} from './helpers.js';
import {
  booleanFeatureTables,
  columnsToGraphqlName,
  featureTablesWithColumns,
  certDashedNameToKey
} from './variables.js';

const app = express();

const db = createConnection('mysql://root:@127.0.0.1/dolt');

db.connect(err => {
  if (err) throw err;
  console.log('MySQL database connected');
});

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
let curriculum = {
  certifications: {
    blocks: {}
  }
};

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

    // Below this, we take the challengesArray and make other queries to create the
    // curriculum object in the way the two clients need. It creates the return of
    // getChallengesForLang('english').
    // TODO: allow for upcomingChanges in endpoint - delete/don't add those if true

    // add certifications key to curriculumData
    const certificationsQuery = 'SELECT * FROM certifications;';
    const certificationsWithTestsQuery = `SELECT * FROM certifications
      FULL JOIN certifications_prerequisites
      ON certifications.id = certifications_prerequisites.certification_id;`;

    const certifications = await runSQL(certificationsQuery);
    const certificationWithTests = await runSQL(certificationsWithTestsQuery);

    certifications.forEach(certification => {
      const { object_id, title, dashed_name } = certification;

      const certKey = certDashedNameToKey[dashed_name];
      if (!certKey) {
        throw new Error(`'certKey' not found for ${dashed_name}`);
      }

      const certTests = certificationWithTests
        .filter(cert => cert.dashed_name === dashed_name)
        .map(({ title = 'placeholder title', prerequisite_object_id }) => {
          return {
            id: prerequisite_object_id,
            title
          };
        });

      curriculum.certifications.blocks[certKey] = {
        challenges: [
          {
            id: object_id,
            title: title,
            certification: dashed_name,
            challengeType: 7,
            isPrivate: true,
            tests: certTests
          }
        ]
      };
    });

    // add superblocks, meta, and challenges keys to curriculumData object
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
        dashedName,
        challengeFiles,
        challengeOrder,
        challengeType,
        blockId,
        blockTitle,
        blockDashedName,
        blockOrder,
        superblockDashedName,
        superblockOrder,
        helpCategory,
        // default these to false cause all challenges have them on client
        usesMultifileEditor = false,
        disableLoopProtectTests = false,
        disableLoopProtectPreview = false
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
            superBlock: superblockDashedName,
            challengeOrder: [],

            // These only get added to meta if they exist
            ...(challenge.template && {
              template: challenge.template
            }),
            ...(challenge.required && {
              required: challenge.required
            }),
            ...(challenge.disableLoopProtectTests && {
              disableLoopProtectTests: true
            }),
            ...(challenge.disableLoopProtectPreview && {
              disableLoopProtectPreview: true
            }),
            ...(challenge.usesMultifileEditor && { usesMultifileEditor: true }),
            ...(challenge.blockTimeToComplete && {
              time: challenge.blockTimeToComplete
            })
          },
          challenges: []
        };
      }

      // I think these properties are added to the meta and each challenge:
      // we'll find out when we test it
      /*
            "usesMultifileEditor"
            "disableLoopProtectTests"
            "disableLoopProtectPreview"
            "hasEditableBoundaries"
            "translationPending" ?
      */

      // if any challenge hasEditableBoundaries, add hasEditableBoundaries: true to its block meta
      const hasEditableBoundaries = challengeFiles?.some(
        cf => cf.editableRegionBoundaries?.length > 0
      );

      if (hasEditableBoundaries) {
        curriculum[superblockDashedName].blocks[
          blockDashedName
        ].meta.hasEditableBoundaries = true;
      }

      // for each challenge, push to their block.challenges
      curriculum[superblockDashedName].blocks[blockDashedName].challenges.push({
        // All challenges should have these
        id: objectId,
        title,
        challengeType,
        dashedName,
        block: blockDashedName,
        order: blockOrder,
        superBlock: superblockDashedName,
        superOrder: superblockOrder,
        // The clients just use superblock dashed name for certification. Except for 2022/rwd
        certification: superblockDashedName.includes('responsive-web-design')
          ? 'responsive-web-design'
          : superblockDashedName,
        challengeOrder,
        helpCategory,
        usesMultifileEditor,
        hasEditableBoundaries: hasEditableBoundaries ? true : false,
        disableLoopProtectTests,
        disableLoopProtectPreview,

        // see if we need to default these or not
        solutions: challenge.solutions ? fixSolutions(challenge.solutions) : [],
        assignments: challenge.assignments
          ? fixAssignments(challenge.assignments)
          : [],
        tests: challenge.tests ? fixTests(challenge.tests) : [],
        required: challenge.required ? challenge.required : [],

        // false for all English, come back to this for i18n
        translationPending: false,

        // Not all challenges have these, only add if they exist
        ...(challenge.blockTimeToComplete && {
          time: challenge.blockTimeToComplete
        }),
        ...(challenge.description && {
          description: fixDescription(challenge.description)
        }),
        ...(challenge.instructions && {
          instructions: fixInstructions(challenge.instructions)
        }),
        ...(challenge.notes && {
          notes: fixNotes(challenge.notes)
        }),
        ...(challenge.challengeFiles && {
          challengeFiles: fixChallengeFiles(challenge.challengeFiles)
        }),
        ...(challenge.scene && {
          scene: challenge.scene
        }),
        ...(challenge.fillInTheBlank && {
          fillInTheBlank: fixFillInTheBlank(challenge.fillInTheBlank)
        }),
        ...(challenge.bilibiliIds && {
          bilibiliIds: challenge.bilibiliIds
        }),
        ...(challenge.forumTopicId && {
          forumTopicId: challenge.forumTopicId
        }),
        ...(challenge.msTrophyId && {
          msTrophyId: challenge.msTrophyId
        }),
        ...(challenge.prerequisites && {
          prerequisites: challenge.prerequisites
        }),
        ...(challenge.question && {
          question: fixQuestion(challenge.question)
        }),
        ...(challenge.template && {
          template: challenge.template
        }),
        ...(challenge.videoId && {
          videoId: challenge.videoId
        }),
        ...(challenge.videoLocaleIds && {
          videoLocaleIds: challenge.videoLocaleIds
        }),
        ...(challenge.videoUrl && {
          videoUrl: challenge.videoUrl
        }),
        ...(challenge.url && {
          url: challenge.url
        })
      });

      // for each challenge, push to meta.challengeOrder
      curriculum[superblockDashedName].blocks[
        blockDashedName
      ].meta.challengeOrder[challengeOrder] = {
        id: objectId,
        title
      };
    }

    writeFileSync(`./curriculum.json`, JSON.stringify(curriculum, null, 2));
    console.log('Curriculum written to file');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }

  console.log('Finished fetching challenge data from the database');
}

fetchCurriculumFromDB();

// TODO: Add logic for fetching specific language
// TODO: Add logic for removing upcoming blocks
app.get('/curriculum', (req, res) => {
  const { lang = 'english' } = req.query;
  console.log(`Someone is trying to get the ${lang} curriculum!`);
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
