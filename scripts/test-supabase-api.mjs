import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://cetjbnojxzlmrwtixjfk.supabase.co';
const supabasePublishableKey = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_iZyCCJQ3QCdTz2qRpRQYEQ_4TSUBbSd';
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY || 'YOUR_SUPABASE_SECRET_KEY';

async function testSupabaseApi() {
  console.log('--- Testing Supabase API with Publishable Key ---');
  const client = createClient(supabaseUrl, supabasePublishableKey);

  // 1. Test fetching categories
  console.log('1. Querying categories...');
  const { data: categories, error: catErr } = await client
    .from('categories')
    .select('*');

  if (catErr) {
    console.error('Error fetching categories:', catErr);
  } else {
    console.log(`Success! Fetched ${categories.length} categories:`, categories.map((c) => `${c.id} (${c.pillar})`));
  }

  // 2. Test fetching schemes with relations
  console.log('\n2. Querying published schemes...');
  const { data: schemes, error: schErr } = await client
    .from('schemes')
    .select('id, slug, category_id, name_i18n, last_verified')
    .eq('is_published', true);

  if (schErr) {
    console.error('Error fetching schemes:', schErr);
  } else {
    console.log(`Success! Fetched ${schemes.length} schemes.`);
    console.log('First 3 schemes:', schemes.slice(0, 3).map((s) => ({ slug: s.slug, name: s.name_i18n.en })));
  }

  // 3. Test service client for auth admin/checks
  console.log('\n3. Testing Service/Secret Client...');
  const adminClient = createClient(supabaseUrl, supabaseSecretKey);
  const { data: users, error: userErr } = await adminClient.auth.admin.listUsers();
  if (userErr) {
    console.error('Admin user list error:', userErr);
  } else {
    console.log(`Success! Admin Auth API functional. Current users count: ${users.users.length}`);
  }

  console.log('\nAll Supabase client API checks passed successfully!');
}

testSupabaseApi().catch((err) => {
  console.error('Fatal API test error:', err);
  process.exit(1);
});
