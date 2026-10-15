const fs = require('fs');

const data = JSON.parse(fs.readFileSync('data/competitor_logs/sortswift_guest_chat.json', 'utf8'));

console.log(`Analyzing ${data.length} guest-chat messages...`);

// 1. Author breakdown
const authors = {};
data.forEach(d => {
  const a = d.author || 'Unknown';
  authors[a] = (authors[a] || 0) + 1;
});

const sortedAuthors = Object.entries(authors).sort((a, b) => b[1] - a[1]);
console.log('Total unique authors:', sortedAuthors.length);
console.log('Top 15 speakers:');
sortedAuthors.slice(0, 15).forEach(([name, count]) => {
  console.log(`  - ${name}: ${count} messages`);
});

// Identify team members
const teamAuthors = ['mtechcave', 'Devon', 'Steve', 'Saqib', 'Kai', 'dazzah02', 'Swift#1889', 'Sortman#3923', 'SupportSwift'];
let teamCount = 0;
let userCount = 0;
data.forEach(d => {
  if (teamAuthors.some(t => d.author.toLowerCase().includes(t.toLowerCase()))) {
    teamCount++;
  } else {
    userCount++;
  }
});
console.log(`Team messages: ${teamCount} (${Math.round(teamCount/data.length*100)}%), User/Guest messages: ${userCount} (${Math.round(userCount/data.length*100)}%)`);

// 2. Keyword & Theme Clustering
const clusters = {
  hardware_scanners: {
    label: 'Hardware, Scanners & Raspberry Pi',
    keywords: ['scanner', 'ricoh', 'fi-8170', 'fi-7160', 'fujitsu', 'ix1600', 'ix1500', 'pi', 'raspberry', 'micro sd', 'sd card', 'reflash', 'usb', 'jam', 'adf', 'feed', 'camera'],
    matches: []
  },
  sorter_mini: {
    label: 'Super Sorter & Sorter Mini ($9k machine)',
    keywords: ['super sorter', 'sorter mini', 'sorter', 'reservation', 'deposit', '9,000', '$9000', 'bin', 'hopper', 'build queue'],
    matches: []
  },
  sync_box: {
    label: 'SortSwiftOS Sync Box ($249 hardware)',
    keywords: ['sync box', 'box', 'touchscreen', '$249', '$199', 'cooler', 'fan', 'plug and play'],
    matches: []
  },
  marketplace_sync: {
    label: 'Marketplace Syncing & Platform Bugs',
    keywords: ['sync', 'shopify', 'tcgplayer', 'ebay', 'cardtrader', 'manapool', 'square', 'woocommerce', 'cardnexus', 'walmart', 'oversell', 'quantity', 'out of stock'],
    matches: []
  },
  pricing_and_plans: {
    label: 'Pricing, Subscriptions, Tiers & Confusion',
    keywords: ['price', 'pricing', 'cost', 'plan', 'tier', 'subscription', 'free trial', 'starter', 'core', 'cancel', 'refund', 'charge', 'stripe', 'billing', 'limit', 'scan limit'],
    matches: []
  },
  card_accuracy_and_grading: {
    label: 'Vision Recognition Accuracy & Condition Grading',
    keywords: ['foil', 'holo', 'reverse', 'edition', 'variant', 'grade', 'grading', 'condition', 'nm', 'lp', 'mp', 'whitening', 'misidentify', 'wrong card', 'accuracy'],
    matches: []
  },
  competitors_mentioned: {
    label: 'Competitors & Rival Comparisons',
    keywords: ['binderpos', 'binder pos', 'tcg sync', 'roca', 'card conduit', 'ludex', 'tcgplayer pro', 'delver', 'pricecharting', 'blstr', 'crystal commerce', 'manabox'],
    matches: []
  },
  buylist_intake: {
    label: 'Buylist & Trade-In Inquiries',
    keywords: ['buylist', 'trade-in', 'trade in', 'store credit', 'cash payout'],
    matches: []
  },
  live_breaks_rip_ship: {
    label: 'Live Breaks, Rip & Ship Streaming',
    keywords: ['break', 'breaks', 'rip', 'rip and ship', 'obs', 'stream deck', 'stream', 'auction', 'pack opening'],
    matches: []
  },
  frustrations_and_bugs: {
    label: 'Customer Complaints, Errors & Frustrations',
    keywords: ['bug', 'error', 'broken', 'not working', 'failed', 'stuck', 'crash', 'issue', 'help', 'problem', 'fix', 'disappointed', 'terrible', 'frustrated'],
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
  topSpeakers: sortedAuthors.slice(0, 20),
  clustersCount: Object.fromEntries(Object.entries(clusters).map(([k, v]) => [k, v.matches.length]))
};

fs.writeFileSync('data/competitor_logs/guest_chat_cluster_summary.json', JSON.stringify(summary, null, 2), 'utf8');

// Inspect competitor mentions specifically
console.log('\n--- Competitor Mentions Deep Dive ---');
const compKeywords = ['binderpos', 'binder pos', 'roca', 'tcg sync', 'card conduit', 'ludex', 'tcgplayer pro', 'blstr', 'crystal commerce', 'delver lens'];
compKeywords.forEach(ck => {
  const found = data.filter(d => (d.content || '').toLowerCase().includes(ck));
  console.log(`Competitor "${ck}": ${found.length} mentions`);
});
