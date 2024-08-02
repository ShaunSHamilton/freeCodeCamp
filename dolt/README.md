# Curriculum Database

## Usage

1. Start the SQL server:

```bash
dolt sql-server
```

2. Run commands/scripts
3. Stop the SQL server
4. Commit changes:

```bash
dolt add .
dolt commit -m "message"
dolt push origin main
```

**NOTE:** If you drop the database, you will have a bad time. Instead drop all the tables for a clean start. See `queries/drop-tables.sql`

## Notes

The database name in Dolt is the directory name. This is NOT configurable.

Make a query with a file

```bash
mysql --host 127.0.0.1 --port 3306 -u root -p dolt < queries/<name>.sql
# OR
dolt sql < queries/<name>.sql
```

```bash
DATABASE_URL=mysql://root:@127.0.0.1/dolt
```

MYSQL has reserved words: https://dev.mysql.com/doc/refman/8.0/en/keywords.html

- `description` has been renamed to `descriptions`
- `url` has been renamed to `course_url`
- `required` has been renamed to `required_resources`

- [x] `fields` to go
- [x] `time` to stay, but be added per block **not** per challenge
  - Turned into `block_time_to_complete` table
- `disableLoopProtect*` to go?
  - Maybe, because we can.
- [x] `hasEditableBoundaries` to go
  - `if challengeFiles && challengeFiles.editabledBoundaries.length > 0`
- [x] `certification.slug` keep out of database
- [ ] `certification.dashed_name` remove
