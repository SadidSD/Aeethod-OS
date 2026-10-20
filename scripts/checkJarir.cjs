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
  const { data: js } = await get('https://cnstrc.com/js/cust/jarir_bookstore_Kz-fec.js');
  const matches = js.match(/"(key_[^"]+)"/g) || [];
  console.log('Matches:', matches);
  // look for api.constructor.io
  const cUrls = js.match(/https?:\/\/[a-zA-Z0-9_\-\.]*constructor\.io[^\s"'`)]*/g) || [];
  console.log('Constructor URLs:', cUrls.slice(0, 10));
}

run().catch(console.error);
