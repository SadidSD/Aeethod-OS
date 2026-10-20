const fs = require('fs');
const content = fs.readFileSync('C:/Users/MSI/.gemini/antigravity/brain/245462da-cdbf-400e-955d-3dff1fb1ae7c/.system_generated/steps/8419/content.md', 'utf8');

console.log('Total content length:', content.length);

const footerMatch = content.match(/<footer[\s\S]*?<\/footer>/i);
if (footerMatch) {
  console.log('--- FOOTER ---');
  console.log(footerMatch[0]);
}

// Find all script tags
const scripts = [];
const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
let match;
while ((match = scriptRegex.exec(content)) !== null) {
  const full = match[0];
  if (full.includes('src=')) {
    const srcMatch = full.match(/src=["']([^"']+)["']/);
    if (srcMatch) scripts.push(srcMatch[1]);
  }
}
console.log('--- SCRIPTS WITH SRC ---');
console.log([...new Set(scripts)]);

// Check for specific apps in content
const keywords = ['binderpos', 'sortswift', 'tcgsync', 'tcg sync', 'tcg csv', 'crystalcommerce', 'shopify', 'built by', 'powered by', 'designed by'];
keywords.forEach(kw => {
  const count = (content.match(new RegExp(kw, 'gi')) || []).length;
  console.log(`Keyword "${kw}": ${count} matches`);
});
