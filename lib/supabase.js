import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key:', supabaseAnonKey);

if (!supabaseUrl) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL');
    throw new Error('Missing environment variable NEXT_PUBLIC_SUPABASE_URL');
}

if (!supabaseAnonKey) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY');
    throw new Error('Missing environment variable NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

// Try to construct the URL properly
let finalUrl = supabaseUrl;
try {
    // Make sure it's a valid URL
    new URL(finalUrl);
} catch (error) {
    console.error('Invalid URL format, trying to fix:', finalUrl);
    // If it doesn't start with https://, add it
    if (!finalUrl.startsWith('https://')) {
        finalUrl = 'https://' + finalUrl;
    }
}

console.log('Final Supabase URL:', finalUrl);

export const supabase = createClient(finalUrl, supabaseAnonKey);