const fs = require('fs');

const filePath = 'c:\\Users\\MSI\\Downloads\\SortSwift - Information - announcements [1241876928005406781].html';
const raw = fs.readFileSync(filePath, 'utf8');

// Parse CSV lines
function parseCSV(text) {
  const lines = [];
  let row = [];
  let inQuotes = false;
  let currentField = '';

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentField += '"';
        i++; // skip escaped quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      row.push(currentField);
      currentField = '';
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++;
      }
      row.push(currentField);
      currentField = '';
      if (row.some(f => f.trim().length > 0)) {
        lines.push(row);
      }
      row = [];
    } else {
      currentField += char;
    }
  }
  if (currentField || row.length > 0) {
    row.push(currentField);
    lines.push(row);
  }
  return lines;
}

const rows = parseCSV(raw);
console.log('Total CSV rows:', rows.length);
console.log('Header:', rows[0]);

const headers = rows[0];
const data = rows.slice(1).map(r => {
  return {
    authorId: r[0],
    author: r[1],
    date: r[2],
    content: r[3],
    attachments: r[4],
    reactions: r[5]
  };
});

console.log('Total parsed announcements:', data.length);
if (data.length > 0) {
  console.log('First date:', data[0].date);
  console.log('Last date:', data[data.length - 1].date);
}

// Write out to Markdown
let mdOutput = `# 📑 SortSwift Official Announcements & Changelog Archive\n\n`;
mdOutput += `**Total Announcements Extracted:** ${data.length}\n`;
mdOutput += `**Date Range:** ${data[0].date} to ${data[data.length - 1].date}\n\n---\n\n`;

data.forEach((item, index) => {
  mdOutput += `### Announcement #${index + 1} | ${item.date} | By: **${item.author}**\n\n`;
  mdOutput += `${item.content}\n\n`;
  if (item.attachments) {
    mdOutput += `*Attachments:* ${item.attachments}\n\n`;
  }
  if (item.reactions) {
    mdOutput += `*Reactions:* ${item.reactions}\n\n`;
  }
  mdOutput += `---\n\n`;
});

fs.mkdirSync('data/competitor_logs', { recursive: true });
fs.writeFileSync('data/competitor_logs/sortswift_announcements.md', mdOutput, 'utf8');
fs.writeFileSync('data/competitor_logs/sortswift_announcements.json', JSON.stringify(data, null, 2), 'utf8');
console.log('Saved to data/competitor_logs/sortswift_announcements.md');
