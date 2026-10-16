const fs = require('fs');

const data = JSON.parse(fs.readFileSync('data/competitor_logs/manapool_third_party_tools.json', 'utf8'));

// Filter for 2026 messages
const in2026 = data.filter(d => d.date && d.date.startsWith('2026-'));
console.log('2026 messages in third-party-tools:', in2026.length);

// What were the biggest topics in 2026?
// Sample 15 messages from 2026
in2026.slice(-15).forEach(d => {
  console.log(`[${d.date.slice(0, 10)}] ${d.author}: ${d.content.replace(/\n+/g, ' ').slice(0, 250)}...\n`);
});
