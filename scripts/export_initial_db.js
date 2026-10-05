import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const dbPath = path.join(ROOT, 'data', 'db.json');
const outPath = path.join(ROOT, 'src', 'data', 'initialDb.ts');

const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
const content = `import type { DB } from '../types';\n\nexport const INITIAL_DB: DB = ${JSON.stringify(db, null, 2)};\n`;

fs.writeFileSync(outPath, content, 'utf8');
console.log('src/data/initialDb.ts created successfully!');
