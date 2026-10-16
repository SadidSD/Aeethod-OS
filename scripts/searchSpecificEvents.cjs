const fs = require('fs');

const data = JSON.parse(fs.readFileSync('data/competitor_logs/manapool_general_chat.json', 'utf8'));

// 1. The September 2024 Commander Ban Crisis (Jeweled Lotus, Mana Crypt, Dockside)
const banCrisis = data.filter(d => /jeweled lotus|mana crypt|dockside|nadu/i.test(d.content || ''));
console.log('Commander Ban Crisis mentions:', banCrisis.length);

// 2. Modern Horizons 3 & Major Set Releases
const mh3 = data.filter(d => /modern horizons|mh3|bloomburrow|duskmourn|secret lair/i.test(d.content || ''));
console.log('Set releases & Secret Lairs:', mh3.length);

// 3. MagicCon & Convention attendance
const conventions = data.filter(d => /magiccon|gen con|booth|vendor table|convention/i.test(d.content || ''));
console.log('Conventions & Booths:', conventions.length);

// 4. USPS Postal Hikes & 1099-K Taxes
const logisticsTaxes = data.filter(d => /1099|usps rate|stamp price|postage hike|tax threshold/i.test(d.content || ''));
console.log('USPS hikes & 1099 taxes:', logisticsTaxes.length);

// Sample the Commander Ban discussions (Massive seller event)
console.log('\n--- SAMPLE: Commander Ban Crisis Discussions ---');
banCrisis.slice(0, 5).forEach(d => {
  console.log(`[${d.date.slice(0, 10)}] ${d.author}: ${d.content.replace(/\n+/g, ' ').slice(0, 250)}...\n`);
});

// Sample the Convention & Booth discussions
console.log('\n--- SAMPLE: Convention & MagicCon Discussions ---');
conventions.slice(0, 5).forEach(d => {
  console.log(`[${d.date.slice(0, 10)}] ${d.author}: ${d.content.replace(/\n+/g, ' ').slice(0, 250)}...\n`);
});

// Sample Set releases & Secret Lair discussions
console.log('\n--- SAMPLE: Secret Lair & Set Release Discussions ---');
mh3.slice(0, 5).forEach(d => {
  console.log(`[${d.date.slice(0, 10)}] ${d.author}: ${d.content.replace(/\n+/g, ' ').slice(0, 250)}...\n`);
});
