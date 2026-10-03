import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const { Client } = pg;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const connectionString =
  process.env.SUPABASE_DIRECT_URL ||
  'postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT.supabase.co:5432/postgres';

async function setup() {
  console.log('Connecting to remote Supabase Postgres database...');
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }, // required for cloud Supabase connection
  });

  try {
    await client.connect();
    console.log('Connected successfully to remote database!');

    // 1. Read & execute 0001_init.sql
    const initSqlPath = path.join(__dirname, '..', 'supabase', 'migrations', '0001_init.sql');
    const initSql = fs.readFileSync(initSqlPath, 'utf8');
    console.log('Applying 0001_init.sql schema & policies...');
    await client.query(initSql);
    console.log('Schema migration applied successfully.');

    // 2. Read & execute seed.sql
    const seedSqlPath = path.join(__dirname, '..', 'supabase', 'seed.sql');
    const seedSql = fs.readFileSync(seedSqlPath, 'utf8');
    console.log('Applying seed.sql data...');
    await client.query(seedSql);
    console.log('Seed data applied successfully.');

    // 3. Test queries
    const resCategories = await client.query('SELECT count(*) FROM public.categories');
    console.log(`Categories count: ${resCategories.rows[0].count}`);

    const resSchemes = await client.query('SELECT count(*) FROM public.schemes');
    console.log(`Schemes count: ${resSchemes.rows[0].count}`);

    const resSample = await client.query('SELECT slug, level, category_id FROM public.schemes LIMIT 5');
    console.log('Sample schemes in database:', resSample.rows);

    console.log('\nAll database setup and checks completed successfully!');
  } catch (err) {
    console.error('Database setup error:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

setup();
