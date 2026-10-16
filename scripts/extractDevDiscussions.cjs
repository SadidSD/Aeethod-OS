const fs = require('fs');

const data = JSON.parse(fs.readFileSync('data/competitor_logs/manapool_third_party_tools.json', 'utf8'));

// Search for what developers are building
const building = data.filter(d => /(building|built|created|tool|script|project|app|bot|extension)/i.test(d.content || ''));
console.log('--- Developers building tools: ---', building.length);
building.slice(0, 8).forEach(d => console.log(`[${d.date.slice(0, 10)}] ${d.author}: ${d.content.replace(/\n+/g, ' ').slice(0, 250)}...\n`));

// Search for Scryfall and catalog mapping issues
const scryfallMatches = data.filter(d => /scryfall/i.test(d.content || ''));
console.log('\n--- Scryfall ID & Catalog mapping issues: ---', scryfallMatches.length);
scryfallMatches.slice(0, 5).forEach(d => console.log(`[${d.date.slice(0, 10)}] ${d.author}: ${d.content.replace(/\n+/g, ' ').slice(0, 250)}...\n`));

// Search for API documentation, endpoints, or limitations
const apiMatches = data.filter(d => /(endpoint|documentation|swagger|openapi|auth|bearer|webhook|payload|json)/i.test(d.content || ''));
console.log('\n--- API Architecture & Limitations: ---', apiMatches.length);
apiMatches.slice(0, 5).forEach(d => console.log(`[${d.date.slice(0, 10)}] ${d.author}: ${d.content.replace(/\n+/g, ' ').slice(0, 250)}...\n`));
