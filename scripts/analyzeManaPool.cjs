const fs = require('fs');

const data = JSON.parse(fs.readFileSync('data/competitor_logs/manapool_general_chat.json', 'utf8'));
console.log(`Analyzing ${data.length} ManaPool general chat messages...`);

// 1. Author breakdown
const authors = {};
data.forEach(d => {
  const a = d.author || 'Unknown';
  authors[a] = (authors[a] || 0) + 1;
});

const sortedAuthors = Object.entries(authors).sort((a, b) => b[1] - a[1]);
console.log('Total unique authors:', sortedAuthors.length);
console.log('Top 20 speakers:');
sortedAuthors.slice(0, 20).forEach(([name, count]) => {
  console.log(`  - ${name}: ${count} messages`);
});

// Identify ManaPool team members
// Look for keywords in author names or early messages
const teamCandidates = ['andrew', 'manapool', 'nathan', 'abhishek', 'mana pool'];
console.log('\nPotential team handles:');
sortedAuthors.filter(([name]) => teamCandidates.some(tc => name.toLowerCase().includes(tc))).forEach(([name, count]) => {
  console.log(`  * ${name}: ${count}`);
});

// 2. Keyword & Theme Clustering
const clusters = {
  tcgplayer_mentions: {
    label: 'TCGplayer Mentions, Complaints & Comparisons',
    keywords: ['tcgplayer', 'tcg player', 'tcgp', 'direct', 'cart optimizer', 'syndicate'],
    matches: []
  },
  binderpos_and_tools: {
    label: 'BinderPOS, SortSwift & Third-Party Tools',
    keywords: ['binderpos', 'binder pos', 'sortswift', 'card dealer pro', 'roca', 'crystal commerce', 'shopify', 'delver', 'manabox'],
    matches: []
  },
  fees_and_pricing: {
    label: 'Fees, Commission, Pricing & Payouts',
    keywords: ['fee', 'commission', 'payout', 'stripe', 'percent', '2.5%', '5%', '10%', 'cheaper', 'margin', 'bank', 'transfer'],
    matches: []
  },
  shipping_and_labels: {
    label: 'Shipping, Labels, Packaging & USPS',
    keywords: ['shipping', 'label', 'usps', 'envelope', 'pwe', 'bubble mailer', 'pirate ship', 'pirateship', 'tracking', 'tracked', 'postage'],
    matches: []
  },
  inventory_and_sync: {
    label: 'Inventory Syncing, Import & Overselling',
    keywords: ['sync', 'inventory', 'csv', 'import', 'export', 'oversell', 'oversold', 'quantity', 'stock', 'api'],
    matches: []
  },
  card_grading_and_condition: {
    label: 'Condition Grading, Foils & Accuracy',
    keywords: ['condition', 'grade', 'nm', 'lp', 'mp', 'hp', 'dmg', 'foil', 'pringle', 'curl', 'scratch', 'whitening'],
    matches: []
  },
  buylist_intake: {
    label: 'Buylist & Trade-Ins',
    keywords: ['buylist', 'trade in', 'trade-in', 'buying singles', 'cash offer'],
    matches: []
  },
  bugs_and_frustrations: {
    label: 'Bugs, Platform Errors & Technical Issues',
    keywords: ['bug', 'broken', 'error', 'down', 'glitch', 'stuck', 'failed', 'issue', 'not working', 'crash'],
    matches: []
  },
  games_supported: {
    label: 'TCG Games (MTG, Pokemon, Lorcana, One Piece, Star Wars)',
    keywords: ['magic', 'mtg', 'pokemon', 'lorcana', 'one piece', 'star wars', 'yugioh', 'yu-gi-oh', 'flesh and blood'],
    matches: []
  }
};

data.forEach((d, idx) => {
  const contentLower = (d.content || '').toLowerCase();
  Object.keys(clusters).forEach(key => {
    const cluster = clusters[key];
    if (cluster.keywords.some(kw => contentLower.includes(kw))) {
      cluster.matches.push({
        idx,
        date: d.date,
        author: d.author,
        content: d.content
      });
    }
  });
});

console.log('\n--- Theme Volume Breakdown ---');
Object.entries(clusters).forEach(([key, cl]) => {
  console.log(`${cl.label}: ${cl.matches.length} messages (${Math.round(cl.matches.length/data.length*100)}%)`);
});

// Save cluster stats
const summary = {
  totalMessages: data.length,
  uniqueAuthors: sortedAuthors.length,
  dateRange: { start: data[0]?.date, end: data[data.length - 1]?.date },
  topSpeakers: sortedAuthors.slice(0, 25),
  clustersCount: Object.fromEntries(Object.entries(clusters).map(([k, v]) => [k, v.matches.length]))
};

fs.writeFileSync('data/competitor_logs/manapool_cluster_summary.json', JSON.stringify(summary, null, 2), 'utf8');
