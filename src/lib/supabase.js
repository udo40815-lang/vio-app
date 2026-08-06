import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Vio: Missing Supabase environment variables. Copy .env.example to .env and fill in your project values.');
}

export const supabase = createClient(supabaseUrl || 'https://example.supabase.co', supabaseAnonKey || 'placeholder', {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, storage: typeof window !== 'undefined' ? window.localStorage : undefined },
});