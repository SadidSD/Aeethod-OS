const fs = require('fs');

const filePath = 'Discord Data/Mana Pool - Community - sellers [1182457883556843520].csv';

console.log('Reading file:', filePath);
const raw = fs.readFileSync(filePath, 'utf8');

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
        i++;
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

console.log('Parsing CSV...');
const allRows = parseCSV(raw);
const headers = allRows[0];
const dataRows = allRows.slice(1);

console.log(`Parsed ${dataRows.length} messages from #sellers.`);

const messages = dataRows.map(r => ({
  authorId: r[0],
  author: r[1],
  date: r[2],
  content: r[3] || '',
  attachments: r[4] || '',
  reactions: r[5] || ''
}));

fs.writeFileSync('data/competitor_logs/manapool_sellers.json', JSON.stringify(messages, null, 2));
console.log('Saved data/competitor_logs/manapool_sellers.json');

// Analyze top participants
const authors = {};
messages.forEach(m => {
  authors[m.author] = (authors[m.author] || 0) + 1;
});

console.log('\n--- TOP 20 ACTIVE PARTICIPANTS IN #SELLERS ---');
Object.entries(authors).sort((a,b)=>b[1]-a[1]).slice(0, 20).forEach(([auth, count]) => {
  console.log(`${auth}: ${count} messages`);
});
