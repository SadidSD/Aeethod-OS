const fs = require('fs');

const data = JSON.parse(fs.readFileSync('data/competitor_logs/manapool_general_chat.json', 'utf8'));

function extractSnippets(keywords, maxCount = 5) {
  const matches = [];
  data.forEach((d, idx) => {
    const text = (d.content || '').toLowerCase();
    if (keywords.some(k => text.includes(k.toLowerCase()))) {
      const prev = data[idx - 1] ? `  [PREV] ${data[idx - 1].author}: ${data[idx - 1].content.slice(0, 150)}` : '';
      const curr = `  [CURR] ${d.author} (${d.date.slice(0, 10)}): ${d.content}`;
      const next = data[idx + 1] ? `  [NEXT] ${data[idx + 1].author}: ${data[idx + 1].content.slice(0, 150)}` : '';
      matches.push(`${prev}\n${curr}\n${next}\n---`);
    }
  });
  return matches.slice(0, maxCount);
}

console.log('=== 1. TCGPLAYER VS MANAPOOL COMPARISONS ===');
const tcgp = extractSnippets(['tcgplayer sucks', 'leaving tcgplayer', 'tcgplayer direct', 'compared to tcg', 'better than tcgplayer'], 5);
tcgp.forEach(s => console.log(s));

console.log('\n=== 2. FEES & BUSINESS MODEL ===');
const fees = extractSnippets(['take rate', 'seller fee', 'commission', '5%', '8%', '10%', 'marketplace fee'], 5);
fees.forEach(s => console.log(s));

console.log('\n=== 3. INVENTORY SYNCING & SORTSWIFT / SHOPIFY INTEGRATION ===');
const sync = extractSnippets(['sortswift', 'shopify sync', 'binderpos', 'csv import', 'oversell'], 5);
sync.forEach(s => console.log(s));

console.log('\n=== 4. SHIPPING & PWE (PLAIN WHITE ENVELOPE) ===');
const ship = extractSnippets(['pwe', 'plain white envelope', 'shipping fee', 'free shipping', 'pirate ship'], 5);
ship.forEach(s => console.log(s));

console.log('\n=== 5. CONDITION & GRADING DISPUTES ===');
const condition = extractSnippets(['damaged', 'curled foil', 'pringle', 'whitening', 'condition dispute', 'refund'], 5);
condition.forEach(s => console.log(s));
