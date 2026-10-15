const fs = require('fs');

const data = JSON.parse(fs.readFileSync('data/competitor_logs/sortswift_guest_chat.json', 'utf8'));

// Helper to extract conversation snippets around keywords
function extractSnippets(keywords, maxCount = 5) {
  const matches = [];
  data.forEach((d, idx) => {
    const text = (d.content || '').toLowerCase();
    if (keywords.some(k => text.includes(k.toLowerCase()))) {
      // Get context: preceding message and succeeding message
      const prev = data[idx - 1] ? `  [PREV] ${data[idx - 1].author}: ${data[idx - 1].content.slice(0, 150)}` : '';
      const curr = `  [CURR] ${d.author} (${d.date.slice(0, 10)}): ${d.content}`;
      const next = data[idx + 1] ? `  [NEXT] ${data[idx + 1].author}: ${data[idx + 1].content.slice(0, 150)}` : '';
      matches.push(`${prev}\n${curr}\n${next}\n---`);
    }
  });
  return matches.slice(0, maxCount);
}

console.log('=== COMPETITOR MENTIONS (BinderPOS, Roca, TCGplayer Pro) ===');
const compSnippets = extractSnippets(['binderpos', 'binder pos', 'roca', 'tcgplayer pro'], 6);
compSnippets.forEach(s => console.log(s));

console.log('\n=== HARDWARE & SCANNER FRICTION (Ricoh, Pi, Reflash, Jam) ===');
const hwSnippets = extractSnippets(['reflash', 'sd card', 'corrupt', 'jam', 'fi-8170', 'pi setup'], 6);
hwSnippets.forEach(s => console.log(s));

console.log('\n=== PRICING OBJECTIONS & TIER CONFUSION ===');
const priceSnippets = extractSnippets(['expensive', 'price hike', 'too much', 'why $', 'cancel', 'refund', 'scan limit'], 6);
priceSnippets.forEach(s => console.log(s));

console.log('\n=== VISION ACCURACY & MISIDENTIFICATION ===');
const visionSnippets = extractSnippets(['wrong card', 'misidentif', 'reverse holo', 'cant recognize', 'false grade'], 6);
visionSnippets.forEach(s => console.log(s));
