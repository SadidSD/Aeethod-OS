const fs = require('fs');

const data = JSON.parse(fs.readFileSync('data/competitor_logs/manapool_third_party_tools.json', 'utf8'));

console.log(`Analyzing ${data.length} messages in Third-Party Tools channel...`);

// 1. Author breakdown
const authors = {};
data.forEach(d => {
  const a = d.author || 'Unknown';
  authors[a] = (authors[a] || 0) + 1;
});

const sortedAuthors = Object.entries(authors).sort((a, b) => b[1] - a[1]);
console.log('Total unique authors:', sortedAuthors.length);
console.log('\nTop 15 speakers in Third-Party Tools:');
sortedAuthors.slice(0, 15).forEach(([name, count]) => {
  console.log(`  - ${name}: ${count} messages`);
});

// 2. Identify tools mentioned
const tools = {
  sortswift: /sortswift|mtechcave/i,
  shopify: /shopify/i,
  binderpos: /binderpos|binder pos/i,
  card_dealer_pro: /card dealer pro|cdp/i,
  crystal_commerce: /crystal commerce|crystalcommerce/i,
  scryfall: /scryfall/i,
  tcgplayer: /tcgplayer|tcg player/i,
  ebay: /ebay/i,
  cardtrader: /cardtrader|card trader/i,
  api_and_webhooks: /api|webhook|endpoint|token|rate limit|429|cors/i,
  csv_and_sync: /csv|sync|inventory|quantity|stock|import/i
};

console.log('\n--- Tool & Tech Mention Counts ---');
Object.entries(tools).forEach(([name, regex]) => {
  const c = data.filter(d => regex.test(d.content || '')).length;
  console.log(`${name}: ${c} messages (${Math.round(c / data.length * 100)}%)`);
});

// Sample 5 conversations with mtechcave (SortSwift founder)
console.log('\n=== SAMPLE: SortSwift & mtechcave in ManaPool ===');
data.filter(d => d.author === 'mtechcave' || (d.content || '').toLowerCase().includes('sortswift')).slice(0, 5).forEach(d => {
  console.log(`[${d.date.slice(0, 10)}] ${d.author}: ${d.content.replace(/\n+/g, ' ').slice(0, 250)}...\n`);
});

// Sample 5 conversations about API / Webhooks
console.log('\n=== SAMPLE: API, Webhooks & Sync Issues ===');
data.filter(d => /api|webhook|rate limit|429/i.test(d.content || '')).slice(0, 5).forEach(d => {
  console.log(`[${d.date.slice(0, 10)}] ${d.author}: ${d.content.replace(/\n+/g, ' ').slice(0, 250)}...\n`);
});
