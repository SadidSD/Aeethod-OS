import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://lgskrbzmcuipxvgxqjur.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxnc2tyYnptY3VpcHh2Z3hxanVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk4MzA4MDUsImV4cCI6MjEwNTQwNjgwNX0.PWgly6dDl82j5IvJf50Be2cZ2efRLvYEn8BEvGVIXA8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
