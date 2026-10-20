const fs = require('fs');

const msgs = JSON.parse(fs.readFileSync('data/competitor_logs/manapool_promote_your_work.json', 'utf8'));

const tools = [];
const seenUrls = new Set();
const ignore = [
  'youtube.com', 'youtu.be', 'discord.com', 'discord.gg', 'tenor.com',
  'giphy.com', 'klipy.com', 'github.com', 'google.com', 'docs.google.com',
  'twitter.com', 'x.com', 'reddit.com', 'facebook.com', 'instagram.com',
  'twitch.tv', 'tiktok.com', 'bsky.app', 'media.discordapp.net', 'cdn.discordapp.com'
];

msgs.forEach(m => {
  if (!m.content) return;
  const urls = m.content.match(/https?:\/\/[^\s\)\>\]\,\"]+/gi);
  if (urls) {
    urls.forEach(u => {
      try {
        const host = new URL(u).hostname.replace(/^www\./, '').toLowerCase();
        if (!ignore.includes(host)) {
          if (!seenUrls.has(host)) {
            seenUrls.add(host);
            tools.push({
              domain: host,
              fullUrl: u,
              author: m.author,
              date: m.date ? m.date.split('T')[0] : 'unknown',
              content: m.content
            });
          }
        }
      } catch(e) {}
    });
  }
});

console.log(`Found ${tools.length} unique platforms/tools promoted in #promote-your-work:\n`);

tools.slice(0, 28).forEach((t, i) => {
  console.log(`=== [${i + 1}] ${t.domain} (by ${t.author} on ${t.date}) ===`);
  console.log(`URL: ${t.fullUrl}`);
  console.log(`Summary: ${t.content.replace(/\s+/g, ' ').substring(0, 300)}...\n`);
});
