const fs = require('fs');

const csvPath = 'F:\\Projects\\clickup\\Discord Data\\Mana Pool - Community - third-party-tools [1402842260910903439].csv';
console.log('Reading Third-Party Tools CSV:', csvPath);

const content = fs.readFileSync(csvPath, 'utf8');

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
      if (currentRow.some(f => f.trim().length > 0)) {
        rows.push(currentRow);
      }
      currentRow = [];
      currentField = '';
    } else {
      currentField += char;
    }
  }

  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField);
    if (currentRow.some(f => f.trim().length > 0)) {
      rows.push(currentRow);
    }
  }

  return rows;
}

const parsedRows = parseCSV(content);
console.log('Total raw CSV rows parsed:', parsedRows.length);

const headers = parsedRows[0].map(h => h.trim().toLowerCase());
console.log('Headers:', headers);

const authorIdIdx = headers.indexOf('authorid');
const authorIdx = headers.indexOf('author');
const dateIdx = headers.indexOf('date');
const contentIdx = headers.indexOf('content');
const attachmentsIdx = headers.indexOf('attachments');
const reactionsIdx = headers.indexOf('reactions');

const records = [];
for (let i = 1; i < parsedRows.length; i++) {
  const row = parsedRows[i];
  records.push({
    authorId: row[authorIdIdx] || '',
    author: row[authorIdx] || '',
    date: row[dateIdx] || '',
    content: row[contentIdx] || '',
    attachments: row[attachmentsIdx] || '',
    reactions: row[reactionsIdx] || ''
  });
}

console.log('Total parsed message objects:', records.length);
console.log('Date range:', records[0]?.date, 'to', records[records.length - 1]?.date);

// Save parsed JSON
const outJsonPath = 'data/competitor_logs/manapool_third_party_tools.json';
fs.writeFileSync(outJsonPath, JSON.stringify(records, null, 2), 'utf8');
console.log('Saved parsed JSON to:', outJsonPath);
