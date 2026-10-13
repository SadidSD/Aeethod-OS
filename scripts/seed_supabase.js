import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const DB_FILE = path.join(ROOT, 'data', 'db.json');

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://lgskrbzmcuipxvgxqjur.supabase.co';
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxnc2tyYnptY3VpcHh2Z3hxanVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk4MzA4MDUsImV4cCI6MjEwNTQwNjgwNX0.PWgly6dDl82j5IvJf50Be2cZ2efRLvYEn8BEvGVIXA8';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function seed() {
  console.log(`Connecting to Supabase: ${SUPABASE_URL}`);
  if (!fs.existsSync(DB_FILE)) {
    console.error('db.json not found!');
    process.exit(1);
  }

  const db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));

  const tables = ['topics', 'fields', 'tasks', 'docs', 'metrics', 'sprints', 'epics', 'content_videos'];
  for (const table of tables) {
    const rawRecords = db[table];
    if (!Array.isArray(rawRecords) || rawRecords.length === 0) continue;

    console.log(`Syncing ${table} (${rawRecords.length} records)...`);
    // Attempt upsert; if category column missing in remote postgres, retry without category
    let { data, error } = await supabase.from(table).upsert(rawRecords);
    if (error && error.message.includes("Could not find the 'category' column")) {
      const sanitized = rawRecords.map(({ category, ...rest }) => rest);
      const retry = await supabase.from(table).upsert(sanitized);
      error = retry.error;
    }
    if (error) {
      console.error(`  Failed to sync ${table}:`, error.message);
    } else {
      console.log(`  ✓ Synced ${table}`);
    }
  }

  // Sync settings
  if (db.settings) {
    const { error } = await supabase.from('settings').upsert({
      id: 'current',
      team: db.settings.team || [],
      company: db.settings.company || 'Aeethod'
    });
    if (error) {
      console.error(`  Failed to sync settings:`, error.message);
    } else {
      console.log(`  ✓ Synced settings`);
    }
  }
}

seed();
