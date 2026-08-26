import { createClient } from '@supabase/supabase-js';
import WebSocket from 'ws';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;

const isValidUrl = Boolean(
  supabaseUrl && (supabaseUrl.startsWith('http://') || supabaseUrl.startsWith('https://'))
);
const isValidKey = Boolean(
  supabaseKey && !supabaseKey.includes('your_supabase_')
);

if (!isValidUrl || !isValidKey) {
  console.warn('[Supabase] Missing or placeholder SUPABASE_URL / SUPABASE_KEY in .env');
  console.warn('[Supabase] Database storage features will be gracefully disabled until valid Supabase credentials are provided.');
}

export const supabase = (isValidUrl && isValidKey)
  ? createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
      },
      global: {
        fetch: fetch,
        headers: { 'x-my-custom-header': 'my-app-name' },
      },
      realtime: {
        transport: WebSocket,
      }
    })
  : null;
