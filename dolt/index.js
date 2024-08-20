import { rmSync } from 'fs';
import apollo from '@apollo/client/core/core.cjs';
import { allChallengeNode, allCertificateNode } from './graphql-query.js';
import { createDropTablesQueries } from './utils.js';
import {
  withConnection,
  seed,
  createTables,
  addChallenges,
  addCertifications
} from './mysql.js';

const { ApolloClient, InMemoryCache } = apollo;

const query_filename = ['create-tables', 'drop-tables'];

for (const filename of query_filename) {
  rmSync(`./queries/${filename}.sql`, {
    force: true
  });
}

const client = new ApolloClient({
  uri: 'http://localhost:8000/__graphql',
  cache: new InMemoryCache({ addTypename: false })
});

console.log('Querying challenge data...');

const allChallengeData = await client.query({
  query: allChallengeNode
});

await withConnection('mysql://root:@127.0.0.1/dolt', async connection => {
  console.log('Creating tables...');
  await seed(connection);

  await createTables(connection, allChallengeData.data.allChallengeNode.nodes);

  console.log('Adding challenges...');

  await addChallenges(connection, allChallengeData.data.allChallengeNode.nodes);

  console.log('Querying certificate data...');

  const allCertificateData = await client.query({
    query: allCertificateNode
  });

  console.log('Adding certifications...');

  await addCertifications(
    connection,
    allCertificateData.data.allCertificateNode.nodes
  );

  await createDropTablesQueries(connection);
});
