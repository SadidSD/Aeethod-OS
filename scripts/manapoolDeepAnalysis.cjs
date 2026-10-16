const fs = require('fs');

const data = JSON.parse(fs.readFileSync('data/competitor_logs/manapool_general_chat.json', 'utf8'));

// Timeline distribution
const yearly = {};
data.forEach(d => {
  if (!d.date) return;
  const y = d.date.slice(0, 4);
  yearly[y] = (yearly[y] || 0) + 1;
});
console.log('Yearly volume:', yearly);

// Search for recurring seller pain points
const searches = {
  cart_optimizer: ['cart optimizer', 'optimize', 'multiple packages', 'split packages', 'consolidated'],
  shipping_headaches: ['postage', 'stamp', 'pwe', 'lost in mail', 'damaged in transit', 'envelope'],
  tcgplayer_gripes: ['tcgplayer', 'tcgp', 'direct', 'fee increase', 'tcgplayer sucks'],
  sorting_intake: ['scan', 'scanner', 'sortswift', 'ricoh', 'typing', 'csv'],
  condition_disputes: ['lightly played', 'near mint', 'moderately played', 'foil curl', 'pringle', 'scratched']
};

const results = {};
Object.entries(searches).forEach(([name, list]) => {
  const matches = data.filter(d => list.some(k => (d.content || '').toLowerCase().includes(k)));
  results[name] = matches.length;
  console.log(`${name}: ${matches.length} matches`);
});

// Sample 5 key discussions about why sellers use ManaPool vs TCGplayer
console.log('\n--- Why ManaPool vs TCGplayer ---');
data.filter(d => (d.content || '').toLowerCase().includes('why manapool') || (d.content || '').toLowerCase().includes('switch to manapool') || (d.content || '').toLowerCase().includes('tcgplayer fee')).slice(0, 5).forEach(d => {
  console.log(`[${d.date.slice(0, 10)}] ${d.author}: ${d.content.slice(0, 250)}...\n`);
});

// Sample discussions about shipping & fraud
console.log('\n--- Shipping & Fraud Discussions ---');
data.filter(d => (d.content || '').toLowerCase().includes('fraud') || (d.content || '').toLowerCase().includes('chargeback') || (d.content || '').toLowerCase().includes('claimed not received')).slice(0, 5).forEach(d => {
  console.log(`[${d.date.slice(0, 10)}] ${d.author}: ${d.content.slice(0, 250)}...\n`);
});
