const fs = require('fs');

const files = [
  'data/competitor_logs/manapool_third_party_tools.json',
  'data/competitor_logs/manapool_general_chat.json',
  'data/competitor_logs/sortswift_guest_chat.json'
];

let allMessages = [];
files.forEach(f => {
  if (fs.existsSync(f)) {
    const data = JSON.parse(fs.readFileSync(f, 'utf8'));
    allMessages = allMessages.concat(data);
  }
});

console.log(`Total messages across all datasets: ${allMessages.length}`);

// Let's create an exhaustive regex pattern for software, platforms, scanners, and tools
const toolPatterns = [
  'tcgplayer', 'tcg player', 'binderpos', 'binder pos', 'sortswift', 'tcgtracking',
  'card dealer pro', 'cdp', 'cardbot', 'roca', 'cardtrader', 'card trader',
  'manapool', 'delver lens', 'delver', 'manabox', 'card conduit', 'cardconduit',
  'crystal commerce', 'crystalcommerce', 'tcg automate', 'tcgautomate', 'carduploader',
  'leumas live', 'leumas', 'magic sorter', 'magicsorter', 'super sorter',
  'tcg powersync', 'powersync', 'powertools', 'lionz', 'lionz sync',
  'cardsphere', 'purplemana', 'purple mana', 'echo mtg', 'echomtg',
  'deckbox', 'moxfield', 'archidekt', 'tcgtop', 'tcg power',
  'clover', 'lightspeed', 'square', 'grindless', 'grindlesspos',
  'whatnot', 'drip', 'fanatics', 'collx', 'ludex', 'cardfolio',
  'pricecharting', 'price charting', 'scryfall', 'mtgban', 'mtgjson',
  'misprint', 'cardnexus', 'pirateship', 'shipstation', 'qz tray', 'easypost'
];

const counts = {};
toolPatterns.forEach(t => {
  counts[t] = 0;
});

allMessages.forEach(d => {
  const content = (d.content || '').toLowerCase();
  toolPatterns.forEach(t => {
    if (content.includes(t)) {
      counts[t]++;
    }
  });
});

console.log('\n--- Tool / Platform Mentions Ranked ---');
const sorted = Object.entries(counts).filter(([k, v]) => v > 0).sort((a, b) => b[1] - a[1]);
sorted.forEach(([k, v]) => console.log(`${k}: ${v} mentions`));
