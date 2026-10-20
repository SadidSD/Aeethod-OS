const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = 'https://lgskrbzmcuipxvgxqjur.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxnc2tyYnptY3VpcHh2Z3hxanVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk4MzA4MDUsImV4cCI6MjEwNTQwNjgwNX0.PWgly6dDl82j5IvJf50Be2cZ2efRLvYEn8BEvGVIXA8';
const client = createClient(supabaseUrl, supabaseAnonKey);

const DB_FILE = path.join(__dirname, '..', 'data', 'db.json');
const INITIAL_DB_FILE = path.join(__dirname, '..', 'src', 'data', 'initialDb.ts');

async function removeTasks() {
  // 1. Delete from Supabase
  console.log('Deleting 24 dev tasks from Supabase tasks table...');
  const { error: delErr } = await client.from('tasks').delete().eq('topicId', 'dev');
  console.log('Supabase tasks delete error:', delErr ? delErr.message : 'Success!');

  // 2. Update data/db.json
  const db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  const originalTaskCount = db.tasks.length;
  db.tasks = db.tasks.filter(t => t.topicId !== 'dev');
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
  console.log('Updated db.json: tasks reduced from', originalTaskCount, 'to', db.tasks.length);
  console.log('Epics in db.json:', db.epics.length);

  // 3. Update src/data/initialDb.ts
  let tsContent = fs.readFileSync(INITIAL_DB_FILE, 'utf8');
  const taskRegex = /\{\s*"id":\s*"task-dev-[^"]+"[\s\S]*?\}(,\s*)?/g;
  tsContent = tsContent.replace(taskRegex, '');
  tsContent = tsContent.replace(/,\s*,/g, ',');
  fs.writeFileSync(INITIAL_DB_FILE, tsContent, 'utf8');
  console.log('Updated initialDb.ts: removed dev tasks.');

  // 4. Verify Supabase state
  const { data: epicsLeft } = await client.from('epics').select('id, name');
  console.log('Epics remaining in Supabase:', epicsLeft ? epicsLeft.length : 0);
  const { data: tasksLeft } = await client.from('tasks').select('id').eq('topicId', 'dev');
  console.log('Dev tasks remaining in Supabase:', tasksLeft ? tasksLeft.length : 0);
}

removeTasks();
