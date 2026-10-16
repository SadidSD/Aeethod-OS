const fs = require('fs');

const files = [
  'data/competitor_logs/manapool_third_party_tools.json',
  'data/competitor_logs/manapool_general_chat.json',
  'data/competitor_logs/sortswift_guest_chat.json'
];

let allMessages = [];
files.forEach(f => {
  if (fs.existsSync(f)) {
    const data = JSON.parse(fs.readFileSync(f, 'utf8'));
    allMessages = allMessages.concat(data);
  }
});

const targets = [
  { name: 'TCG Automate', regex: /tcg\s*automate/i },
  { name: 'CardUploader', regex: /carduploader/i },
  { name: 'Magic Sorter', regex: /magic\s*sorter/i },
  { name: 'PowerTools', regex: /powertools/i },
  { name: 'Lionz Sync', regex: /lionz/i },
  { name: 'CardBot', regex: /cardbot/i },
  { name: 'Misprint', regex: /misprint/i },
  { name: 'GrindlessPOS', regex: /grindless/i },
  { name: 'Leumas Live', regex: /leumas/i }
];

targets.forEach(t => {
  const matches = allMessages.filter(d => t.regex.test(d.content || ''));
  console.log(`\n=================== COMPETITOR: ${t.name} (${matches.length} mentions) ===================`);
  matches.slice(0, 3).forEach(m => {
    console.log(`[${m.date ? m.date.slice(0, 10) : 'N/A'}] ${m.author}: ${m.content.replace(/\n+/g, ' ').slice(0, 220)}...\n`);
  });
});
