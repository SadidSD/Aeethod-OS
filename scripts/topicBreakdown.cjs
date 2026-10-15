const fs = require('fs');

const data = JSON.parse(fs.readFileSync('data/competitor_logs/sortswift_announcements.json', 'utf8'));

// Let's inspect announcements by year and key topics
console.log('Total entries:', data.length);

const topics = {
  pricing_and_plans: [],
  hardware_and_sifter: [],
  marketplace_sync: [],
  scanner_vision: [],
  pos_and_kiosk: [],
  live_breaks: [],
  buylist: [],
  tcgplayer_issues: []
};

data.forEach((d, idx) => {
  const content = d.content.toLowerCase();
  const summary = { id: idx + 1, date: d.date, author: d.author, snippet: d.content.slice(0, 200).replace(/\n/g, ' ') };
  
  if (content.includes('plan') || content.includes('pricing') || content.includes('subscription') || content.includes('price charting') || content.includes('$')) {
    topics.pricing_and_plans.push(summary);
  }
  if (content.includes('sifter') || content.includes('raspberry') || content.includes('pi') || content.includes('hardware') || content.includes('microcontroller') || content.includes('firmware') || content.includes('hopper')) {
    topics.hardware_and_sifter.push(summary);
  }
  if (content.includes('sync') || content.includes('shopify') || content.includes('ebay') || content.includes('tcgplayer') || content.includes('channel') || content.includes('cardmarket')) {
    topics.marketplace_sync.push(summary);
  }
  if (content.includes('scanner') || content.includes('camera') || content.includes('vision') || content.includes('ocr') || content.includes('webcam')) {
    topics.scanner_vision.push(summary);
  }
  if (content.includes('pos') || content.includes('register') || content.includes('in-store') || content.includes('barcode')) {
    topics.pos_and_kiosk.push(summary);
  }
  if (content.includes('break') || content.includes('rip') || content.includes('stream') || content.includes('whatnot') || content.includes('tiktok')) {
    topics.live_breaks.push(summary);
  }
  if (content.includes('buylist') || content.includes('trade-in') || content.includes('intake')) {
    topics.buylist.push(summary);
  }
  if (content.includes('tcgplayer') && (content.includes('down') || content.includes('cloudflare') || content.includes('issue') || content.includes('block') || content.includes('sync'))) {
    topics.tcgplayer_issues.push(summary);
  }
});

console.log('Topic summary counts:');
Object.keys(topics).forEach(k => console.log(`- ${k}: ${topics[k].length}`));

// Let's inspect key milestones chronologically across all 337 announcements
fs.writeFileSync('data/competitor_logs/sortswift_topic_breakdown.json', JSON.stringify(topics, null, 2), 'utf8');
