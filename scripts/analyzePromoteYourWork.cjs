const fs = require('fs');

const filePath = 'Discord Data/Mana Pool - Community - promote-your-work [1270402233443291188].csv';

if (!fs.existsSync(filePath)) {
  console.error('File not found:', filePath);
  process.exit(1);
}

const raw = fs.readFileSync(filePath, 'utf8');

// Robust CSV parser handling multiline quotes
function parseCSV(text) {
  const rows = [];
  let currentRow = [];
  let currentField = '';
  let insideQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        currentField += '"';
        i++; // skip escaped quote
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      currentRow.push(currentField);
      currentField = '';
    } else if ((char === '\r' || char === '\n') && !insideQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++;
      }
      currentRow.push(currentField);
      if (currentRow.length > 1 || currentRow[0] !== '') {
        rows.push(currentRow);
      }
      currentRow = [];
      currentField = '';
    } else {
      currentField += char;
    }
  }
  if (currentField || currentRow.length > 0) {
    currentRow.push(currentField);
    rows.push(currentRow);
  }
  return rows;
}

const allRows = parseCSV(raw);
const headers = allRows[0];
const dataRows = allRows.slice(1);

console.log(`Parsed ${dataRows.length} messages from promote-your-work.`);

const messages = dataRows.map(r => ({
  authorId: r[0],
  author: r[1],
  date: r[2],
  content: r[3] || '',
  attachments: r[4] || '',
  reactions: r[5] || ''
}));

// Save parsed JSON for rapid querying
fs.writeFileSync('data/competitor_logs/manapool_promote_your_work.json', JSON.stringify(messages, null, 2));
console.log('Saved data/competitor_logs/manapool_promote_your_work.json');

// Analyze unique domains
const domains = {};
const urlRegex = /https?:\/\/[^\s\)\>\]\,\"]+/gi;

messages.forEach(m => {
  const matches = m.content.match(urlRegex);
  if (matches) {
    matches.forEach(u => {
      try {
        const host = new URL(u).hostname.replace(/^www\./, '').toLowerCase();
        domains[host] = (domains[host] || 0) + 1;
      } catch (e) {}
    });
  }
});

console.log('\n--- TOP PROMOTED DOMAINS ---');
const sortedDomains = Object.entries(domains).sort((a, b) => b[1] - a[1]);
sortedDomains.slice(0, 35).forEach(([dom, count]) => {
  console.log(`${dom}: ${count}`);
});

// Identify Authors and tools
const authors = {};
messages.forEach(m => {
  authors[m.author] = (authors[m.author] || 0) + 1;
});

console.log('\n--- TOP ACTIVE POSTERS ---');
Object.entries(authors).sort((a, b) => b[1] - a[1]).slice(0, 15).forEach(([auth, count]) => {
  console.log(`${auth}: ${count}`);
});
