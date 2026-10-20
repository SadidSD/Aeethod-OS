# 🚀 Aeethod OS: Production PostgreSQL Architecture & Database Engineering Curriculum
### *Self-Paced Master Track: From Foundations to High-Concurrency Multi-Tenant TCG Architecture*

> **Engineered Specifically for Aeethod OS:**
> This curriculum contains zero generic or theoretical toy problems. Every module, data model, indexing strategy, and SQL script is designed directly for Aeethod's 4 core product engines:
> 1. **AI Optical Scanner & Sifter Management OS** (`pgvector`, HNSW, visual embeddings)
> 2. **Real-Time Omnichannel Sync Engine** (sub-500ms concurrency locks, anti-double-selling)
> 3. **Smart Chaos Warehousing & Inventory OS** (3D spatial coordinates, FIFO cost-basis)
> 4. **Automated Buylist & Trade-In Portal** (double-entry store credit ledgers, dynamic spreads)

---

## 🗺️ Master Curriculum Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│ PHASE 1: Modern PostgreSQL Core & Advanced Data Types                  │
│          • Financial precision, UUIDv7, GIN Trigram Search, JSONB      │
├────────────────────────────────────────────────────────────────────────┤
│ PHASE 2: Domain-Driven TCG Data Architecture                           │
│          • The 3-Tier Hierarchy, 14 Fingerprints, Chaos Warehousing    │
├────────────────────────────────────────────────────────────────────────┤
│ PHASE 3: AI Computer Vision & Vector Search                            │
│          • pgvector, HNSW indexing, 2-stage hybrid query, pHash        │
├────────────────────────────────────────────────────────────────────────┤
│ PHASE 4: SaaS Multi-Tenancy & Sub-500ms Concurrency                     │
│          • Hardened RLS, SELECT FOR UPDATE, anti-double-selling        │
├────────────────────────────────────────────────────────────────────────┤
│ PHASE 5: Event-Driven Real-Time Sync & Query Optimization              │
│          • Change Data Capture (CDC/WAL), EXPLAIN BUFFERS, indexes     │
├────────────────────────────────────────────────────────────────────────┤
│ PHASE 6: Modern Tooling, Migrations & The Capstone Build               │
│          • Drizzle ORM, zero-downtime DDL, complete runnable schema    │
└────────────────────────────────────────────────────────────────────────┘
```

---

# 🔷 PHASE 1: Modern PostgreSQL Core & Advanced Data Types
*Objective: Master precision data types, zero-table-scan fuzzy search, and hybrid relational-document modeling.*

### Module 1.1: Financial Precision & The Floating-Point Trap
* **The Problem:** Never store money as `FLOAT` or `REAL`. Binary floating-point representation causes IEEE-754 precision errors (e.g., `19.99 * 3` evaluates to `59.97000000000001`). Over thousands of card transactions, pennies disappear, breaking tax audits.
* **The Production Solution:** 
  * **Option A (Recommended for Performance): Integer Cents.** Store monetary values as `BIGINT cents` (`$25.50` is stored as `2550`). Integer math is instantaneous and 100% deterministic.
  * **Option B: Fixed-Point Decimals.** Use `NUMERIC(12, 2)` or `DECIMAL(12, 4)` when fractional cents are required for high-volume fee offsets.
* **Real-World Application:** Calculating TCGplayer marketplace commission offsets (`Price = Base / (1 - 0.1225) + 30 cents`) and dynamic buylist cash/credit spreads.

### Module 1.2: Primary Key Engineering: UUIDv7 vs. UUIDv4 vs. Integer
* **Why traditional IDs fail:**
  * Auto-incrementing `SERIAL` integers leak merchant order volume to competitors (Store B can see they are order #104 vs #10,000) and collide across distributed databases.
  * Standard `UUIDv4` is completely random, causing catastrophic B-Tree page fragmentation and memory thrashing in PostgreSQL cache.
* **The Modern Standard: UUIDv7 (RFC 9562):**
  * Time-ordered sequential UUIDs. Combines an accurate 48-bit millisecond timestamp prefix with random entropy bits.
  * Guarantees global uniqueness while preserving 100% sequential B-Tree index append performance.
  ```sql
  -- UUIDv7 conceptual layout in PostgreSQL
  CREATE TABLE orders (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- Use pg_uuidv7 extension in Postgres 16/17
      tenant_id UUID NOT NULL,
      total_cents BIGINT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );
  ```

### Module 1.3: Fast Typo-Tolerant Card Search (`pg_trgm`)
* **Why `LIKE '%chariz%'` is banned:** Wildcard prefix searches (`%keyword%`) cannot use standard B-Tree indexes, triggering sequential full table scans that choke under concurrent merchant lookups.
* **The Production Solution:** PostgreSQL Trigram Matching (`pg_trgm`) with Generalized Inverted Indexes (GIN).
  * Breaks text into 3-character slices (`cha`, `har`, `ari`, `riz`).
  ```sql
  CREATE EXTENSION IF NOT EXISTS pg_trgm;

  -- Create GIN Trigram index on the card name
  CREATE INDEX idx_cards_name_trgm ON master_cards USING gin (name gin_trgm_ops);

  -- Sub-5ms fuzzy search query matching typos ("Charzard" -> "Charizard")
  SELECT id, name, card_number, similarity(name, 'charzard') AS score
  FROM master_cards
  WHERE name % 'charzard'
  ORDER BY score DESC
  LIMIT 5;
  ```

### Module 1.4: Hybrid Relational + `JSONB` Modeling
* **When to Normalize vs. When to use `JSONB`:**
  * **Normalized columns:** For invariant, universally queried fields (`id`, `name`, `card_number`, `set_id`, `rarity`).
  * **`JSONB` columns:** For volatile, game-specific mechanics that change with every new TCG expansion (Pokémon *Weakness/Resistance/Retreat*, Magic *Mana Cost/Colors*, One Piece *Counter/Attribute*).
  ```sql
  ALTER TABLE master_cards ADD COLUMN game_metadata JSONB NOT NULL DEFAULT '{}'::jsonb;

  -- Indexing JSON expressions for sub-millisecond filtering
  CREATE INDEX idx_cards_metadata_gin ON master_cards USING gin (game_metadata jsonb_path_ops);

  -- Query cards with retreat cost = 2 and energy type = 'Fire'
  SELECT id, name FROM master_cards 
  WHERE game_metadata @> '{"energy": "Fire", "retreat_cost": 2}';
  ```

---

# 🔷 PHASE 2: Domain-Driven TCG Data Architecture (The Master Schema)
*Objective: Eliminate the fatal mistake of treating trading cards like standard retail items with single UPC barcodes.*

### Module 2.1: The 3-Tier Entity Hierarchy
You will architect the structural core of Aeethod OS, decoupling the abstract intellectual property from physical finishes and store inventory:

```
[Tier 1: master_cards] (Abstract IP - Global Catalog)
   └── Charizard | Base Set | #4/102 | HP 120 | Fire
         │
         ├── [Tier 2: card_variants] (Physical Finish & Printing - Global Catalog)
         │     ├── 1st Edition Shadowless Holofoil
         │     ├── Unlimited Shadowless Holofoil
         │     ├── Unlimited Holofoil
         │     └── 1999-2000 4th Print (UK)
         │
         └── [Tier 3: inventory_items] (Merchant Instance - Tenant Isolated)
               ├── Store A: Near Mint, Raw, $280.00, Qty: 2, Bin: Box 14-Row 2
               └── Store B: PSA 9 Graded Slab, Cert #84920192, $1,400.00, Qty: 1
```

### Module 2.2: Modeling the 14 Card Fingerprints & Variant Explosion
* Design the variant discriminator schema to cleanly track:
  1. Card Finishes: Normal, Holofoil, Reverse Holo, Cosmos Holo, Pokéball Mirror, Masterball Mirror.
  2. Edition & Print Runs: 1st Edition, Shadowless, Unlimited, 4th Print UK.
  3. Regional Frame Variants: Japanese Silver Borders vs. Western Yellow Borders.
  4. Stamps: Prerelease, Staff, Regional Championship, The List (Planeswalker stamp).
  5. Secret Rares: Handling numerators greater than denominators (`187/165`).

### Module 2.3: 3D Chaos Warehousing Coordinate Schema
* Architecting the spatial schema for warehouse single-card fulfillment:
  ```sql
  CREATE TABLE warehouse_bins (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      tenant_id UUID NOT NULL,
      warehouse_code VARCHAR(16) NOT NULL, -- 'MAIN'
      aisle VARCHAR(8) NOT NULL,           -- 'A03'
      shelf VARCHAR(8) NOT NULL,           -- 'S02'
      box_label VARCHAR(32) NOT NULL,      -- 'BOX-POKE-04'
      slot_index INT NOT NULL,             -- 1 to 500
      barcode_matrix VARCHAR(64) UNIQUE NOT NULL, -- 'WH-A03-S02-B04-001'
      is_locked BOOLEAN DEFAULT FALSE
  );
  ```

### Module 2.4: Double-Entry Ledger for Buylist & Store Credit
* **The Golden Rule:** Never mutate balances directly (`user.balance = user.balance + 50`).
* **The Production Solution:** An immutable financial ledger:
  ```sql
  CREATE TABLE store_credit_ledger (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      tenant_id UUID NOT NULL,
      customer_id UUID NOT NULL,
      entry_type VARCHAR(16) NOT NULL, -- 'CREDIT' | 'DEBIT'
      source VARCHAR(32) NOT NULL,     -- 'BUYLIST_PAYOUT' | 'POS_SALE' | 'MANUAL_ADJUST'
      amount_cents BIGINT NOT NULL,
      running_balance_cents BIGINT NOT NULL,
      reference_id UUID,               -- Links to buylist_submission_id or order_id
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );
  ```

---

# 🔷 PHASE 3: AI Computer Vision, Vector Embeddings & Image Fingerprinting
*Objective: Power sub-15ms visual identification for the AI Optical Scanner & Sifter companion.*

### Module 3.1: Vector Mathematics & The `pgvector` Extension
* **Embeddings:** How vision backbones (MobileNetV3, ResNet, CLIP) compress camera image pixels into a dense 512-dimension float vector (`vector(512)`).
* **Distance Metrics in SQL:**
  * Euclidean ($L_2$) Distance (`<->`): Measures straight-line geometric distance.
  * Inner Product (`<#>`): Fast dot-product (requires normalized vectors).
  * **Cosine Distance (`<=>`):** Measures the *angle* between vectors. **Mandatory for card scanning** because it remains invariant to variations in room lighting, exposure, and glare.

### Module 3.2: Vector Indexing: HNSW vs. IVFFlat
* **HNSW (Hierarchical Navigable Small World):** The undisputed choice for production vector search.
  ```sql
  CREATE EXTENSION IF NOT EXISTS vector;

  CREATE TABLE card_fingerprints (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      variant_id UUID NOT NULL REFERENCES card_variants(id) ON DELETE CASCADE,
      visual_embedding vector(512) NOT NULL,
      phash BIT(64) NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
  );

  -- Build HNSW index optimized for sub-15ms lookups
  CREATE INDEX idx_card_embeddings_hnsw 
  ON card_fingerprints 
  USING hnsw (visual_embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 64);
  ```
* **Memory Tuning:** Sizing `maintenance_work_mem` and configuring `hnsw.ef_search = 40` at query runtime to guarantee 50,000 vectors remain memory-resident in database RAM.

### Module 3.3: The Atomic 2-Stage Hybrid Query
* Real-world recognition query that combines OCR set pre-filtering with vector similarity in a single query execution plan:
  ```sql
  SELECT 
      c.id AS card_id,
      c.name,
      cv.id AS variant_id,
      cv.finish,
      (f.visual_embedding <=> $scanned_vector) AS visual_distance
  FROM card_fingerprints f
  JOIN card_variants cv ON f.variant_id = cv.id
  JOIN master_cards c ON cv.card_id = c.id
  WHERE c.set_id = $detected_set_id -- Hard metadata pre-filter
  ORDER BY visual_distance ASC
  LIMIT 1;
  ```

### Module 3.4: Perceptual Hashing (pHash) in SQL
* Generating 64-bit DCT image hashes for cropped card art.
* Executing bitwise Hamming distance comparisons using PostgreSQL bit operators:
  ```sql
  -- Fast XOR bitwise Hamming distance: lower score = identical artwork
  SELECT variant_id, bit_count(phash # x'c4f1a23e9812df01'::bit(64)) AS hamming_distance
  FROM card_fingerprints
  ORDER BY hamming_distance ASC
  LIMIT 3;
  ```

---

# 🔷 PHASE 4: SaaS Multi-Tenancy & Sub-500ms Concurrency
*Objective: Protect merchant data isolation and prevent double-selling across live physical and digital channels.*

### Module 4.1: Multi-Tenant Architecture & Isolation
* Why single-database shared-schema with a mandatory `tenant_id UUID` column is the only model that scales to thousands of card shops without multi-database connection exhaustion.

### Module 4.2: Hardened Row-Level Security (RLS)
* Configuring PostgreSQL RLS to guarantee that even if application backend code contains a bug, the database engine physically rejects unauthorized queries:
  ```sql
  ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;

  -- Enforces strict tenant separation using authenticated JWT claims
  CREATE POLICY tenant_isolation_policy ON inventory_items
  FOR ALL
  TO authenticated
  USING (tenant_id = (current_setting('request.jwt.claim.tenant_id', true))::uuid)
  WITH CHECK (tenant_id = (current_setting('request.jwt.claim.tenant_id', true))::uuid);
  ```

### Module 4.3: Concurrency Control & The Anti-Double-Selling Lock
* **The Scenario:** A store clerk at a card show sells the last `$500` PSA 10 Charizard with a mobile cash register at the exact millisecond an online buyer purchases it on eBay.
* **Pessimistic Row Locking (`SELECT ... FOR UPDATE`):**
  ```sql
  BEGIN;
  -- Acquires an exclusive row lock; concurrent transactions wait until this commits
  SELECT quantity 
  FROM inventory_items 
  WHERE id = $item_id AND tenant_id = $store_id 
  FOR UPDATE;

  -- Ensure quantity is sufficient before deduction
  UPDATE inventory_items 
  SET quantity = quantity - 1, updated_at = NOW()
  WHERE id = $item_id AND quantity >= 1;

  INSERT INTO orders (id, tenant_id, item_id, price_cents) 
  VALUES (gen_random_uuid(), $store_id, $item_id, 50000);

  COMMIT;
  ```
* **Hybrid Locking:** Pairing PostgreSQL transactional row locks with a **Redis Redlock cluster** on the card's universal UUID for sub-10ms distributed fan-out delisting to eBay, TCGplayer, and Shopify.

---

# 🔷 PHASE 5: Event-Driven Real-Time Sync & Query Optimization
*Objective: Power sub-500ms multi-channel delisting without polling, and diagnose slow queries.*

### Module 5.1: Change Data Capture (CDC) via PostgreSQL WAL
* **The Death of Periodic Polling:** Running cron jobs every 15 minutes leads to massive overselling during major set releases.
* **The Solution: Write-Ahead Log (WAL) Streaming:**
  * Streaming database change events directly from Postgres WAL to WebSocket workers via Supabase Realtime or `LISTEN/NOTIFY`.
  ```sql
  CREATE OR REPLACE FUNCTION notify_inventory_depletion()
  RETURNS trigger AS $$
  BEGIN
      IF NEW.quantity = 0 AND OLD.quantity > 0 THEN
          PERFORM pg_notify(
              'inventory_depleted',
              json_build_object(
                  'tenant_id', NEW.tenant_id,
                  'inventory_id', NEW.id,
                  'master_card_id', NEW.master_card_id
              )::text
          );
      END IF;
      RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;

  CREATE TRIGGER trg_inventory_zero
  AFTER UPDATE OF quantity ON inventory_items
  FOR EACH ROW EXECUTE FUNCTION notify_inventory_depletion();
  ```

### Module 5.2: Query Forensics with `EXPLAIN (ANALYZE, BUFFERS)`
* How to read execution plans like a Principal Database Architect:
  1. `Seq Scan` (Table Scan): Red flag on tables with > 1,000 rows.
  2. `Index Scan` vs. `Bitmap Index Scan`.
  3. `Buffers: shared hit=... read=...`: Proves whether queries are served from RAM or hitting physical disk I/O.
  4. Identifying costly sorting nodes and eliminating them using pre-sorted composite indexes.

### Module 5.3: Covering & Partial Indexing
* **Covering Index (`INCLUDE`):** Fulfills read queries directly from index RAM without touching table heap storage:
  ```sql
  CREATE INDEX idx_inventory_covering 
  ON inventory_items (tenant_id, master_card_id) 
  INCLUDE (price_cents, quantity, condition);
  ```
* **Partial Index:** Indexing only active, marketable inventory, ignoring hundreds of thousands of historical zero-quantity rows:
  ```sql
  CREATE INDEX idx_active_sellable_stock 
  ON inventory_items (tenant_id, master_card_id) 
  WHERE quantity > 0;
  ```

---

# 🔷 PHASE 6: Modern Tooling, Migrations & The Capstone Build
*Objective: Define the schema as TypeScript code, execute zero-downtime migrations, and verify the production database.*

### Module 6.1: Type-Safe Schema-as-Code with Drizzle ORM
* Why modern high-throughput architectures choose **Drizzle ORM** over Prisma:
  * Zero Rust engine overhead, instant cold starts, native `pgvector` and `pg_trgm` support, pure SQL transparency.
  ```typescript
  import { pgTable, uuid, varchar, bigint, integer, index } from 'drizzle-orm/pg-core';
  import { vector } from 'drizzle-orm/pg-core';

  export const masterCards = pgTable('master_cards', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 255 }).notNull(),
    cardNumber: varchar('card_number', { length: 32 }).notNull(),
    setId: varchar('set_id', { length: 64 }).notNull(),
  }, (table) => ({
    nameTrgmIdx: index('idx_card_name_trgm').using('gin', table.name),
  }));
  ```

### Module 6.2: Zero-Downtime Live Migrations
* The 3 non-negotiable rules for updating production databases without downtime:
  1. **Never rename columns directly.** Use expand-and-contract patterns (add new column $\rightarrow$ dual write $\rightarrow$ backfill $\rightarrow$ drop old column).
  2. **Always add indexes concurrently:**
     ```sql
     CREATE INDEX CONCURRENTLY idx_orders_created ON orders (created_at);
     ```
  3. **Add columns with safe defaults:** Never add `NOT NULL DEFAULT 'val'` on 10M rows without PostgreSQL 11+ metadata-only optimizations.

---

# 🏆 THE PRODUCTION CAPSTONE PROJECT
### *The Final Examination: Build & Verify Aeethod's Database Engine*

Complete and execute the following 6 implementation steps on your Supabase / PostgreSQL instance:

```
[Capstone Deliverables]
 1. Schema DDL Migration:
    Write and run the DDL creating `card_sets`, `master_cards`, `card_variants`, 
    `card_fingerprints`, `inventory_items`, and `store_credit_ledger`.

 2. Extension Initialization:
    Enable `vector` and `pg_trgm` extensions; configure HNSW and GIN indexes.

 3. Seed Mock Dataset:
    Insert 3 Sets, 15 Master Cards, 30 Variants, and 512-dimension test vectors.

 4. Hardened Multi-Tenancy Verification:
    Enable RLS on `inventory_items` and prove that Tenant B receives 0 rows 
    when querying Tenant A's inventory.

 5. Atomic Checkout Simulation:
    Write a transaction that locks a card row with `SELECT FOR UPDATE`, 
    decrements quantity, and writes an order record.

 6. The 15ms Visual Query Test:
    Execute a hybrid 2-stage query (Set Filter + Vector Distance) and run 
    `EXPLAIN (ANALYZE, BUFFERS)` to confirm sub-20ms latency and zero Seq Scans.
```
