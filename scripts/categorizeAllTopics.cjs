const fs = require('fs');

const data = JSON.parse(fs.readFileSync('data/competitor_logs/manapool_general_chat.json', 'utf8'));

// Categorize broad conversation topics
const topics = {
  platform_and_bugs: {
    label: 'ManaPool Features, Bug Fixes & UI Updates',
    keywords: ['manapool', 'bug', 'deploy', 'feature', 'cart', 'checkout', 'payout', 'stripe', 'csv', 'import'],
    count: 0
  },
  gameplay_and_decks: {
    label: 'Deckbuilding, Formats & Commander Gameplay',
    keywords: ['commander', 'edh', 'deck', 'combo', 'synergy', 'mana curve', 'tribal', 'counter', 'wincon'],
    count: 0
  },
  spoilers_and_card_art: {
    label: 'New Set Spoilers, Lore, Art & Universes Beyond',
    keywords: ['spoiler', 'leak', 'artwork', 'lore', 'fallout', 'assassin', 'marvel', 'final fantasy', 'universes beyond', 'secret lair'],
    count: 0
  },
  market_speculation_and_prices: {
    label: 'Market Speculation, Card Price Spikes & Buying Deals',
    keywords: ['price spike', 'spec', 'buyout', 'expensive', 'worth', 'market price', 'cheap', 'tcglow', 'deal'],
    count: 0
  },
  pack_openings_and_pulls: {
    label: 'Opening Packs, Pulls, Serialized & Foil Hits',
    keywords: ['pulled', 'cracked', 'box opening', 'pack', 'serialized', 'collector booster', 'god pack', 'case hit'],
    count: 0
  },
  tournaments_and_events: {
    label: 'Tournaments, MagicCons, Prereleases & LGS Nights',
    keywords: ['magiccon', 'tournament', 'prerelease', 'fnm', 'rcq', 'draft night', 'pro tour', 'convention', 'booth'],
    count: 0
  },
  shipping_and_seller_ops: {
    label: 'Seller Shipping, USPS Logistics & Packaging',
    keywords: ['usps', 'shipping', 'pwe', 'bubble mailer', 'pirateship', 'envelope', 'postage', 'toploader'],
    count: 0
  }
};

data.forEach(d => {
  const content = (d.content || '').toLowerCase();
  Object.keys(topics).forEach(t => {
    if (topics[t].keywords.some(k => content.includes(k))) {
      topics[t].count++;
    }
  });
});

console.log('--- Broad Conversation Breakdown (18,585 total messages) ---');
Object.entries(topics).forEach(([k, t]) => {
  console.log(`${t.label}: ${t.count} messages (${Math.round(t.count / data.length * 100)}%)`);
});
