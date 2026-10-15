const fs = require('fs');

const data = JSON.parse(fs.readFileSync('data/competitor_logs/sortswift_guest_chat.json', 'utf8'));

// Search specifically for mentions of BinderPOS
console.log('=== BINDERPOS MENTIONS & COMPARISONS ===');
data.filter(d => (d.content || '').toLowerCase().includes('binderpos') || (d.content || '').toLowerCase().includes('binder pos')).forEach(d => {
  console.log(`[${d.date.slice(0, 10)}] ${d.author}: ${d.content}\n`);
});

// Search specifically for mentions of Roca
console.log('\n=== ROCA MENTIONS & COMPARISONS ===');
data.filter(d => (d.content || '').toLowerCase().includes('roca')).forEach(d => {
  console.log(`[${d.date.slice(0, 10)}] ${d.author}: ${d.content}\n`);
});

// Search for mentions of TCGplayer Sync / issues / Chrome extension
console.log('\n=== TCGPLAYER SYNC / EXTENSION / SYNC BOX DISCUSSIONS ===');
data.filter(d => (d.content || '').toLowerCase().includes('sync box') || ((d.content || '').toLowerCase().includes('tcgplayer') && (d.content || '').toLowerCase().includes('extension'))).slice(0, 10).forEach(d => {
  console.log(`[${d.date.slice(0, 10)}] ${d.author}: ${d.content.slice(0, 300)}...\n`);
});

// Search for Sorter Mini reservations and customer questions
console.log('\n=== SUPER SORTER MINI ($9,000) DISCUSSIONS ===');
data.filter(d => (d.content || '').toLowerCase().includes('mini') && ((d.content || '').toLowerCase().includes('sorter') || (d.content || '').toLowerCase().includes('deposit') || (d.content || '').toLowerCase().includes('9,000') || (d.content || '').toLowerCase().includes('9000'))).slice(0, 8).forEach(d => {
  console.log(`[${d.date.slice(0, 10)}] ${d.author}: ${d.content.slice(0, 300)}...\n`);
});
