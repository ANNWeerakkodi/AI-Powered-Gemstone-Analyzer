import 'dotenv/config';
import { supabase } from './lib/supabase.js';


async function test() {
  console.log('Testing Supabase Connection...');
  if (!supabase) {
    console.error('Supabase client failed to initialize. Check your URL and keys.');
    process.exit(1);
  }

  try {
    const { data, error } = await supabase.from('gemstones').select('*').limit(1);
    if (error) {
      console.error('Database connection or query failed:', error.message);
      process.exit(1);
    }
    console.log('Successfully connected to Supabase!');
    console.log('Fetched data:', data);
    process.exit(0);
  } catch (err) {
    console.error('Unexpected error:', err.message);
    process.exit(1);
  }
}

test();
