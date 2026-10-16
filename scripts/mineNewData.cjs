const fs = require('fs');

const mp = JSON.parse(fs.readFileSync('data/competitor_logs/manapool_general_chat.json', 'utf8'));
const ss = JSON.parse(fs.readFileSync('data/competitor_logs/sortswift_guest_chat.json', 'utf8'));

console.log(`Searching across ${mp.length} ManaPool messages and ${ss.length} SortSwift messages...`);

// 1. Uncover Sales Volume, AOV, and Conversion Numbers
const salesMetrics = mp.filter(d => /(order|orders|sales|revenue|aov|conversion|per day|per week|gmv)/i.test(d.content || '') && /(\$|\d+\s*orders|\d+\s*sales)/i.test(d.content || ''));
console.log('Sales volume & order mentions:', salesMetrics.length);

// 2. Packaging, Postal Surcharges, and Envelope Weight Rules
const shippingSpecs = mp.filter(d => /(non-machinable|ounces|ounce|oz|butterfly|rigid|toploader|shield|cardboard gold|semi-rigid|thickness|0\.7|0\.6)/i.test(d.content || ''));
console.log('Shipping specs & postal rules:', shippingSpecs.length);

// 3. Payment Methods & Processing (Stripe, Apple Pay, PayPal fees)
const payments = mp.filter(d => /(apple pay|google pay|paypal|stripe fee|chargeback fee|payout time|hold)/i.test(d.content || ''));
console.log('Payment & payout mentions:', payments.length);

// 4. International / Cross-border Selling Pain
const crossBorder = mp.filter(d => /(customs|vat|canada|uk|europe|international shipping|tariff)/i.test(d.content || ''));
console.log('Cross-border & international mentions:', crossBorder.length);

// Let's sample key findings from each
console.log('\n=== SAMPLE: Real Seller Sales Volume & AOV ===');
salesMetrics.slice(0, 5).forEach(d => console.log(`[${d.date.slice(0, 10)}] ${d.author}: ${d.content.replace(/\n+/g, ' ').slice(0, 220)}...\n`));

console.log('\n=== SAMPLE: Postal & Shipping Specs (PWE Thickness & USPS Secrets) ===');
shippingSpecs.slice(0, 5).forEach(d => console.log(`[${d.date.slice(0, 10)}] ${d.author}: ${d.content.replace(/\n+/g, ' ').slice(0, 220)}...\n`));

console.log('\n=== SAMPLE: Payment & Payout Realities ===');
payments.slice(0, 5).forEach(d => console.log(`[${d.date.slice(0, 10)}] ${d.author}: ${d.content.replace(/\n+/g, ' ').slice(0, 220)}...\n`));
