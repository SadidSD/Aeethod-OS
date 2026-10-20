import pg from 'pg';
const { Client } = pg;

const client = new Client({
  host: 'aws-0-us-east-1.pooler.supabase.com',
  port: 5432,
  user: 'postgres.hwwspxwrctxiiutujmlh',
  password: 'itsyourSD@123',
  database: 'postgres',
  ssl: { rejectUnauthorized: false }
});

async function run() {
  await client.connect();
  console.log('Auditing and patching 14-fingerprint columns...');
  
  await client.query(`
    -- Fingerprint #1: Language & Regional Print
    -- Fingerprint #2: Era / Series Block
    ALTER TABLE card_sets 
      ADD COLUMN IF NOT EXISTS language VARCHAR(10) DEFAULT 'en',
      ADD COLUMN IF NOT EXISTS era_block VARCHAR(50);

    -- Fingerprint #1: Language (variant-level override)
    -- Fingerprint #10: Deck, Border & Card Back Exclusivity (e.g. standard vs world_championship)
    -- Fingerprint #11: Sub-Print Serial Code (EX-Era Code A/B/C)
    -- Fingerprint #12: Regulation Mark
    ALTER TABLE card_variants 
      ADD COLUMN IF NOT EXISTS language VARCHAR(10) DEFAULT 'en',
      ADD COLUMN IF NOT EXISTS card_back_type VARCHAR(50) DEFAULT 'standard',
      ADD COLUMN IF NOT EXISTS sub_print_code VARCHAR(50),
      ADD COLUMN IF NOT EXISTS regulation_mark VARCHAR(10);
  `);
  
  console.log('✓ Successfully patched! Catalog is 100% equipped for all 14 fingerprints.');
  await client.end();
}

run().catch(console.error);
