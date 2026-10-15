const fs = require('fs');

const data = JSON.parse(fs.readFileSync('data/competitor_logs/sortswift_guest_chat.json', 'utf8'));

// Filter for 2026 messages
const in2026 = data.filter(d => d.date && d.date.startsWith('2026-'));
console.log('Total messages in 2026:', in2026.length);

// What do people ask the AI or team about in 2026?
const questions2026 = in2026.filter(d => (d.content || '').includes('?') && !d.author.includes('Swift') && !d.author.includes('mtechcave'));
console.log('Customer questions in 2026:', questions2026.length);

// Let's sample 15 customer questions from mid to late 2026
console.log('\n--- Sample Customer Questions in 2026 ---');
questions2026.slice(-20).forEach((q, i) => {
  console.log(`[Q ${i+1}] ${q.date.slice(0, 10)} | ${q.author}: ${q.content.replace(/\n+/g, ' ').slice(0, 200)}...`);
});
