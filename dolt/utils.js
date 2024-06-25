import { writeFileSync } from 'fs';

export function getTableName(key) {
  return snakerize(key);
}

export function getColumnType(value) {
  switch (typeof value) {
    case 'string':
      return 'TEXT';
    case 'number':
      return 'INT';
    case 'boolean':
      return 'BOOLEAN';
    case 'object':
      return 'JSON';
    default:
      return 'TEXT';
  }
}

export function snakerize(str) {
  return str.replace(/(([A-Z]{2,}(?![a-z]))|([A-Z]))/g, $1 => {
    return '_' + $1.toLowerCase();
  });
}

export function removeNulls(obj) {
  if (obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    for (let i = obj.length - 1; i >= 0; i--) {
      if (obj[i] === null) {
        obj.splice(i, 1);
      } else if (typeof obj[i] === 'object') {
        removeNulls(obj[i]);
      }
    }
  } else if (typeof obj === 'object') {
    for (const key in obj) {
      if (obj[key] === null) {
        delete obj[key];
      } else if (typeof obj[key] === 'object') {
        removeNulls(obj[key]);
      }
    }
  }
  return obj;
}

export async function runSQL(connection, sql) {
  return new Promise((resolve, _reject) => {
    connection.query(sql, (err, _result) => {
      if (err) {
        console.error('Error running SQL:\n', sql);
        throw err;
      }
      resolve();
    });
  });
}

export async function runCreateTable(connection, sql) {
  writeFileSync(`./queries/create-tables.sql`, '\n' + sql + '\n', {
    flag: 'a'
  });
  await runSQL(connection, sql);
}

/**
 * The order of the tables is important.
 * Tables with refs are dropped first.
 */
export async function createDropTablesQueries(connection) {
  const sql = `SELECT TABLE_NAME,COLUMN_NAME,CONSTRAINT_NAME, REFERENCED_TABLE_NAME,REFERENCED_COLUMN_NAME
FROM
  INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE
  REFERENCED_TABLE_SCHEMA = (SELECT DATABASE());`;
  return new Promise((resolve, _reject) => {
    connection.query(sql, (err, result) => {
      if (err) {
        console.error('Error running SQL:\n', sql);
        throw err;
      }
      const referenced_tables = new Set();
      const referrers = new Set();
      for (const referrer of result) {
        const { TABLE_NAME, REFERENCED_TABLE_NAME } = referrer;
        referrers.add(TABLE_NAME);
        referenced_tables.add(REFERENCED_TABLE_NAME);
      }
      for (const table_name of referrers) {
        const sql = `DROP TABLE IF EXISTS ${table_name};`;
        writeFileSync(`./queries/drop-tables.sql`, sql + '\n', {
          flag: 'a'
        });
      }
      for (const table_name of referenced_tables) {
        const sql = `DROP TABLE IF EXISTS ${table_name};`;
        writeFileSync(`./queries/drop-tables.sql`, sql + '\n', {
          flag: 'a'
        });
      }
      resolve();
    });
  });
}

export async function insert(connection, tableName, columnNames, columnValues) {
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
