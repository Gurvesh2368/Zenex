import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const { Client } = pg;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const connectionString =
  process.env.SUPABASE_DIRECT_URL ||
  'postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT.supabase.co:5432/postgres';

async function seedDocsAndSteps() {
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    console.log('Connected to remote database.');

    const fallbackPath = path.join(__dirname, '..', 'public', 'schemes.fallback.json');
    const schemes = JSON.parse(fs.readFileSync(fallbackPath, 'utf8'));

    // Clear existing docs and steps to avoid duplicates
    await client.query('DELETE FROM public.scheme_documents');
    await client.query('DELETE FROM public.scheme_steps');

    let totalDocs = 0;
    let totalSteps = 0;

    for (const scheme of schemes) {
      // Find scheme ID by slug
      const res = await client.query('SELECT id FROM public.schemes WHERE slug = $1', [scheme.slug]);
      if (res.rows.length === 0) {
        console.warn(`Scheme ${scheme.slug} not found in database!`);
        continue;
      }
      const schemeId = res.rows[0].id;

      // Insert documents
      if (scheme.scheme_documents && scheme.scheme_documents.length > 0) {
        for (const doc of scheme.scheme_documents) {
          await client.query(
            `INSERT INTO public.scheme_documents (scheme_id, sort, mandatory, alt_group, name_i18n, hint_i18n)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [
              schemeId,
              doc.sort,
              doc.mandatory !== false,
              doc.alt_group || null,
              JSON.stringify(doc.name_i18n),
              doc.hint_i18n ? JSON.stringify(doc.hint_i18n) : null,
            ]
          );
          totalDocs++;
        }
      }

      // Insert steps
      if (scheme.scheme_steps && scheme.scheme_steps.length > 0) {
        for (const step of scheme.scheme_steps) {
          await client.query(
            `INSERT INTO public.scheme_steps (scheme_id, sort, text_i18n)
             VALUES ($1, $2, $3)`,
            [schemeId, step.sort, JSON.stringify(step.text_i18n)]
          );
          totalSteps++;
        }
      }
    }

    console.log(`Successfully seeded ${totalDocs} documents and ${totalSteps} steps into Supabase!`);

    const docCount = await client.query('SELECT count(*) FROM public.scheme_documents');
    const stepCount = await client.query('SELECT count(*) FROM public.scheme_steps');
    console.log(`Verified DB Counts -> Documents: ${docCount.rows[0].count}, Steps: ${stepCount.rows[0].count}`);
  } catch (err) {
    console.error('Error seeding docs and steps:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

seedDocsAndSteps();

