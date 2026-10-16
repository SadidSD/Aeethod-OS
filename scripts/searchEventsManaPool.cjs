const fs = require('fs');

const data = JSON.parse(fs.readFileSync('data/competitor_logs/manapool_general_chat.json', 'utf8'));

console.log(`Total messages in dataset: ${data.length}`);

const eventCategories = {
  conventions_and_tournaments: {
    label: 'Conventions, Pro Tours & Tournaments (MagicCon, Gen Con, RCQs, Worlds)',
    keywords: ['magiccon', 'gen con', 'pro tour', 'commandfest', 'scg', 'rcq', 'tournament', 'championship', 'gp', 'fnm', 'prerelease'],
    matches: []
  },
  meta_shifts_and_bans: {
    label: 'Ban List Announcements, Rules Changes & Set Releases',
    keywords: ['banned', 'banlist', 'unbanned', 'secret lair', 'serialized', 'modern horizons', 'bloomburrow', 'duskmourn', 'outlaws', 'erik', 'nadu', 'ring'],
    matches: []
  },
  financial_taxes_and_logistics: {
    label: 'Taxes, 1099-K, Postal Rate Hikes & Black Friday',
    keywords: ['1099', 'tax', 'irs', 'black friday', 'holiday', 'rate hike', 'rate increase', 'usps price'],
    matches: []
  },
  lgs_and_local_events: {
    label: 'Physical LGS In-Store Events & Community Nights',
    keywords: ['lgs', 'local game store', 'in-store', 'game night', 'commander night', 'draft night'],
    matches: []
  }
};

data.forEach((d, idx) => {
  const contentLower = (d.content || '').toLowerCase();
  Object.keys(eventCategories).forEach(cat => {
    if (eventCategories[cat].keywords.some(kw => contentLower.includes(kw))) {
      eventCategories[cat].matches.push({
        idx,
        date: d.date,
        author: d.author,
        content: d.content
      });
    }
  });
});

console.log('\n--- Events Discussion Breakdown ---');
Object.entries(eventCategories).forEach(([key, cl]) => {
  console.log(`${cl.label}: ${cl.matches.length} messages (${Math.round(cl.matches.length/data.length*100)}%)`);
});

// Sample some prominent discussions in each category
Object.entries(eventCategories).forEach(([key, cl]) => {
  console.log(`\n=== SAMPLES FOR: ${cl.label} ===`);
  cl.matches.slice(0, 4).forEach(m => {
    console.log(`[${m.date.slice(0, 10)}] ${m.author}: ${m.content.replace(/\n+/g, ' ').slice(0, 200)}...\n`);
  });
});
