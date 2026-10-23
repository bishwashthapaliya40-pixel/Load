import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase settings भेटिएन। .env फाइल जाँच गर्नुहोस्।');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
