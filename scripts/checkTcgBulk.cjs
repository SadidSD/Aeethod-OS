const https = require('https');

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve({ status: res.statusCode, data }));
    }).on('error', reject);
  });
}

async function run() {
  const scanner = await get('https://tcgbulk.com/scanner');
  // strip tags and print body
  const text = scanner.data.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '').replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  console.log('Scanner page content:');
  console.log(text.slice(0, 2000));

  // Let's check legal or terms or pricing
  const terms = await get('https://tcgbulk.com/terms-and-conditions');
  console.log('Terms status:', terms.status);
  if (terms.status === 200) {
    const termsText = terms.data.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
    console.log('Terms snippet:', termsText.slice(0, 1000));
  }
}

run().catch(console.error);
