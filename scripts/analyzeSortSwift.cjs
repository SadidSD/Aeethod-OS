const fs = require('fs');

const data = JSON.parse(fs.readFileSync('data/competitor_logs/sortswift_announcements.json', 'utf8'));

console.log('Total announcements:', data.length);

// Analyze keywords
const keywords = ['sync', 'shopify', 'tcgplayer', 'ebay', 'scanner', 'sorter', 'hardware', 'buylist', 'price', 'pricing', 'fee', 'pull', 'binder', 'slab', 'psa', 'cloud', 'app', 'mobile'];
const counts = {};
keywords.forEach(k => {
  counts[k] = data.filter(d => d.content.toLowerCase().includes(k)).length;
});
console.log('Keyword frequency across 337 announcements:');
console.table(counts);

// Print the last 15 announcements
console.log('\n--- 15 MOST RECENT ANNOUNCEMENTS ---');
const recent = data.slice(-15);
recent.forEach((r, i) => {
  console.log(`[#${data.length - 15 + i + 1}] ${r.date} (${r.author}):`);
  console.log(r.content);
  console.log('-'.repeat(60));
});
