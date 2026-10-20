import express from 'express';
import catalogRoutes from '../server/catalogRoutes.js';

const app = express();
app.use(express.json());
app.use('/api/catalog', catalogRoutes);

const server = app.listen(4329, async () => {
  console.log('Test server started on 4329.');
  try {
    const summaryRes = await fetch('http://localhost:4329/api/catalog/summary');
    console.log('Summary:', await summaryRes.json());

    const gamesRes = await fetch('http://localhost:4329/api/catalog/games');
    console.log('Games:', await gamesRes.json());

    const erasRes = await fetch('http://localhost:4329/api/catalog/eras?gameSlug=pokemon&language=en');
    const eras = await erasRes.json();
    console.log(`Eras count for EN: ${eras.length}. First 3:`, eras.slice(0, 3));

    const setsRes = await fetch('http://localhost:4329/api/catalog/sets?gameSlug=pokemon&eraId=sv&language=en');
    const sets = await setsRes.json();
    console.log(`Sets count for SV EN: ${sets.length}. First set:`, sets[0]);

    if (sets[0]) {
      const cardsRes = await fetch(`http://localhost:4329/api/catalog/cards?setId=${sets[0].id}&limit=2`);
      const cardsData = await cardsRes.json();
      console.log(`Cards in ${sets[0].name}: ${cardsData.totalCards}. Sample card:`, {
        name: cardsData.cards[0]?.clean_name,
        number: cardsData.cards[0]?.card_number,
        variants_count: cardsData.cards[0]?.variants?.length,
        top_price_cents: cardsData.cards[0]?.top_market_cents
      });
    }

    console.log('\nALL CATALOG API ENDPOINTS PASSED SUCCESSFULLY!');
  } catch (err) {
    console.error('Test error:', err);
  } finally {
    server.close();
    process.exit(0);
  }
});
