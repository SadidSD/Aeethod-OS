const fs = require('fs');

const data = JSON.parse(fs.readFileSync('data/competitor_logs/sortswift_guest_chat.json', 'utf8'));

// Filter for complaints / bug reports from users (excluding team members)
const teamAuthors = ['mtechcave', 'Devon', 'Steve', 'Saqib', 'Kai', 'dazzah02', 'Swift#1889', 'Sortman#3923', 'SupportSwift'];

const complaints = data.filter(d => {
  if (teamAuthors.some(t => d.author.toLowerCase().includes(t.toLowerCase()))) return false;
  const c = (d.content || '').toLowerCase();
  return c.includes('not working') || c.includes('error') || c.includes('bug') || c.includes('stuck') || c.includes('issue') || c.includes('failed') || c.includes('broken');
});

console.log('Total user complaints/issues found:', complaints.length);

// Sample some prominent ones
console.log('\n--- 10 Sample User Complaints/Issues ---');
complaints.slice(0, 10).forEach((d, i) => {
  console.log(`[#${i+1}] ${d.date.slice(0, 10)} | ${d.author}:`);
  console.log(`${d.content.slice(0, 250)}...\n`);
});

// Group complaints by topic
const topics = {
  'Scanner / Hardware / Camera / Pi': /scanner|camera|pi|reflash|fujitsu|ricoh|jam/i,
  'Sync / Shopify / TCGplayer / eBay': /sync|shopify|tcgplayer|ebay|cardtrader|manapool|quantity|oversell/i,
  'Pricing / Repricing / Inaccurate Price': /price|repric|market price|wrong price/i,
  'Buylist Issues': /buylist|trade in|payout/i,
  'Catalog / Wrong Card Recognition': /wrong card|foil|holo|variant|misidentif|cant find/i,
  'Login / UI / Performance / Freezing': /login|freeze|stuck|slow|crash|load/i
};

console.log('\n--- Complaint Topic Distribution ---');
Object.entries(topics).forEach(([top, regex]) => {
  const matches = complaints.filter(d => regex.test(d.content));
  console.log(`${top}: ${matches.length} complaints (${Math.round(matches.length/complaints.length*100)}%)`);
});
