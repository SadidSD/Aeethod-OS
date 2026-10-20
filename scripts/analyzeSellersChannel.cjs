const fs = require('fs');

const msgs = JSON.parse(fs.readFileSync('data/competitor_logs/manapool_sellers.json', 'utf8'));
console.log(`Analyzing ${msgs.length} messages from #sellers...`);

// 1. Competitor & Software Tool Mentions
const tools = [
  'tcgplayer', 'sortswift', 'tcgtracking', 'tcgt', 'binderpos',
  'carduploader', 'tcg automate', 'tcgautomate', 'tcgsync', 'crystalcommerce',
  'crystal commerce', 'pirate ship', 'pirateship', 'easypost', 'shipstation',
  'roca', 'cardbot', 'manabox', 'delver', 'card conduit', 'cardconduit',
  'cardtrader', 'card market', 'cardmarket', 'ebay', 'whatnot', 'tcgbuddy',
  'hippolink', 'cardchaos', 'misprint'
];

const toolStats = {};
tools.forEach(t => toolStats[t] = 0);

msgs.forEach(m => {
  if (!m.content) return;
  const lower = m.content.toLowerCase();
  tools.forEach(t => {
    if (lower.includes(t)) {
      toolStats[t]++;
    }
  });
});

console.log('\n--- COMPETITOR & TOOL MENTIONS IN #SELLERS ---');
Object.entries(toolStats).sort((a,b)=>b[1]-a[1]).forEach(([tool, count]) => {
  if (count > 0) console.log(`${tool}: ${count} mentions`);
});

// 2. Shipping & Logistics Discussions
const shippingKeywords = [
  'pwe', 'ground advantage', 'tracking', 'imb', 'stamp', 'postage',
  'pirate ship', 'envelope', 'shipping shield', 'top loader', 'lost',
  'non-machinable', 'meter'
];
const shippingStats = {};
shippingKeywords.forEach(k => shippingStats[k] = 0);

msgs.forEach(m => {
  if (!m.content) return;
  const lower = m.content.toLowerCase();
  shippingKeywords.forEach(k => {
    if (lower.includes(k)) {
      shippingStats[k]++;
    }
  });
});

console.log('\n--- SHIPPING TOPICS IN #SELLERS ---');
Object.entries(shippingStats).sort((a,b)=>b[1]-a[1]).forEach(([k, count]) => {
  console.log(`${k}: ${count} mentions`);
});

// 3. Condition & Grading Discussions
const gradingKeywords = [
  'near mint', 'nm', 'lightly played', 'lp', 'moderately played', 'mp',
  'heavily played', 'hp', 'damaged', 'foil', 'curling', 'clouding', 'scratch'
];
const gradingStats = {};
gradingKeywords.forEach(k => gradingStats[k] = 0);

msgs.forEach(m => {
  if (!m.content) return;
  const lower = m.content.toLowerCase();
  gradingKeywords.forEach(k => {
    if (lower.includes(k)) {
      gradingStats[k]++;
    }
  });
});

console.log('\n--- GRADING TOPICS IN #SELLERS ---');
Object.entries(gradingStats).sort((a,b)=>b[1]-a[1]).forEach(([k, count]) => {
  console.log(`${k}: ${count} mentions`);
});

// 4. Mikah (SortSwift) presence in #sellers
const mikahMsgs = msgs.filter(m => m.author === 'mtechcave');
console.log(`\nMikah (mtechcave) sent ${mikahMsgs.length} messages in #sellers.`);

// 5. Inspect the clash between BlueBird Bytes and Mikah
console.log('\n--- BLUEBIRD BYTES VS MIKAH CLASH ---');
const clashIndex = msgs.findIndex(m => m.content && m.content.includes('Tcgtracking does everything sortswift does Better For free'));
if (clashIndex !== -1) {
  msgs.slice(Math.max(0, clashIndex - 5), clashIndex + 12).forEach(m => {
    console.log(`[${m.date ? m.date.split('T')[0] : ''}] ${m.author}: ${m.content}`);
  });
}
