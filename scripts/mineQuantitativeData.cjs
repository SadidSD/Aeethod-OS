const fs = require('fs');

const mp = JSON.parse(fs.readFileSync('data/competitor_logs/manapool_general_chat.json', 'utf8'));
const ss = JSON.parse(fs.readFileSync('data/competitor_logs/sortswift_guest_chat.json', 'utf8'));

// 1. Search for shipping dollar thresholds (e.g. $20, $25, $50, $40, $45)
const thresholds = mp.filter(d => /(threshold|over \$|free shipping over|tracked over|pwe up to)/i.test(d.content || ''));
console.log('--- Shipping Threshold Matches: ---', thresholds.length);
thresholds.slice(0, 6).forEach(d => console.log(`[${d.date.slice(0, 10)}] ${d.author}: ${d.content.replace(/\n+/g, ' ').slice(0, 200)}...\n`));

// 2. Search for Payout times & Hold periods
const payouts = mp.concat(ss).filter(d => /(payout takes|stripe payout|hold period|funds available|cleared funds|direct deposit)/i.test(d.content || ''));
console.log('\n--- Payout Times & Hold Matches: ---', payouts.length);
payouts.slice(0, 6).forEach(d => console.log(`[${d.date.slice(0, 10)}] ${d.author}: ${d.content.replace(/\n+/g, ' ').slice(0, 200)}...\n`));

// 3. Search for Card damage during shipping or scanning
const damages = mp.concat(ss).filter(d => /(roller scratch|sorting machine scratch|damaged in mail|arrived bent|creased)/i.test(d.content || ''));
console.log('\n--- Card Damage Reports: ---', damages.length);
damages.slice(0, 6).forEach(d => console.log(`[${d.date.slice(0, 10)}] ${d.author}: ${d.content.replace(/\n+/g, ' ').slice(0, 200)}...\n`));

// 4. Search for mentions of competitors shutting down or failing (e.g. PurpleMana, Grindless, etc.)
const failingComps = mp.concat(ss).filter(d => /(shutting down|went out of business|bankrupt|closing down|dead software)/i.test(d.content || ''));
console.log('\n--- Competitors Failing/Shutting Down: ---', failingComps.length);
failingComps.slice(0, 6).forEach(d => console.log(`[${d.date.slice(0, 10)}] ${d.author}: ${d.content.replace(/\n+/g, ' ').slice(0, 200)}...\n`));
