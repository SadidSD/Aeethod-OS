// Initial company data for Aeethod OS.
// Generated only when data/db.json does not exist (or on "Reset to seed" in Settings).
import { randomUUID } from 'crypto';

const now = () => new Date().toISOString();

// ---------------------------------------------------------------------------
// Topics (the 22 business disciplines + Development)
// ---------------------------------------------------------------------------
const CAT = {
  Strategy: '#8b5cf6',
  Growth: '#10b981',
  Money: '#f59e0b',
  Foundation: '#0ea5e9',
  Operations: '#f97316',
  Systems: '#06b6d4',
  Retention: '#ec4899',
  People: '#f43f5e',
  Execution: '#6366f1',
  Differentiation: '#d946ef',
  Self: '#14b8a6',
  Product: '#3b82f6',
  'Money / Analytics': '#eab308',
  Engineering: '#22d3ee',
};

const TOPICS = [
  [1, 'strategy', 'Business Strategy', 'Strategy', 'Target', 'Vision, competitive strategy, OKRs, beachhead selection and strategic bets for Aeethod.'],
  [2, 'marketing', 'Marketing', 'Growth', 'Megaphone', 'Demand generation: SEO, Shopify App Store, content, video demos, events and community.'],
  [3, 'sales', 'Sales', 'Growth', 'Handshake', 'Pipeline, outbound to card shops & power sellers, demos, trials, migration deals.'],
  [4, 'branding', 'Branding', 'Growth', 'Palette', 'Identity, voice, visual system and how Aeethod looks & sounds everywhere.'],
  [5, 'b2b-positioning', 'B2B Brand Positioning', 'Growth', 'Crosshair', 'Positioning vs incumbents, segment value props, messaging and battlecards.'],
  [6, 'finance', 'Finance', 'Money', 'Wallet', 'Budget, burn, cash management, pricing model and financial planning.'],
  [7, 'accounting', 'Accounting', 'Money', 'Calculator', 'Bookkeeping, chart of accounts, revenue recognition, taxes and monthly close.'],
  [8, 'economics', 'Economics', 'Foundation', 'TrendingUp', 'Microeconomics of the TCG merchant market: WTP, elasticity, consumer surplus, supply & demand.'],
  [9, 'scm', 'Supply Chain Management', 'Operations', 'Truck', 'How cards flow: publishers → distributors → stores/sellers → players; intake, grading, fulfillment.'],
  [10, 'retail', 'Retail Management', 'Operations', 'Store', 'Card-shop operations: counter workflows, POS, trade-ins, merchandising and retail KPIs.'],
  [11, 'mis', 'MIS', 'Systems', 'Database', 'Internal management information systems: CRM, billing, support, data governance.'],
  [12, 'bi', 'BI & Analytics', 'Systems', 'BarChart3', 'Product analytics, dashboards, market price intelligence and decision data.'],
  [13, 'operations', 'Operations Management', 'Operations', 'Cog', 'Processes, onboarding/migration ops, support SLAs, vendors and tooling.'],
  [14, 'customer-success', 'Customer Success', 'Retention', 'HeartHandshake', 'Onboarding, health scores, churn prevention, expansion and advocacy.'],
  [15, 'legal', 'Legal & Compliance', 'Foundation', 'Scale', 'Incorporation, contracts, ToS/Privacy, GDPR, IP/trademarks and marketplace API terms.'],
  [16, 'hrm', 'HRM', 'People', 'Users', 'Hiring, contractors, compensation, culture and people operations.'],
  [17, 'pm', 'Project Management', 'Execution', 'KanbanSquare', 'Company roadmap, operating cadence, cross-functional projects and risks.'],
  [18, 'integration', 'SCM + MIS + SaaS Integration', 'Differentiation', 'Network', 'Aeethod\'s moat: one inventory ledger unifying supply chain, management info and the SaaS product.'],
  [19, 'fundraising', 'Fundraising & VC', 'Money', 'Rocket', 'Narrative, deck, investor pipeline, data room and the financial model for the raise.'],
  [20, 'founder', 'Founder Psychology', 'Self', 'Brain', 'Founder energy, decision quality, resilience, focus and personal operating system.'],
  [21, 'product', 'Product Management', 'Product', 'Boxes', 'Discovery, PRDs, prioritisation (RICE), feedback loops and product roadmap.'],
  [22, 'saas-metrics', 'SaaS Metrics & Unit Economics', 'Money / Analytics', 'Gauge', 'MRR, churn, NRR, CAC, LTV, payback and the metrics review ritual.'],
];

// ---------------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------------
const opt = (label, color) => ({ id: label.toLowerCase().replace(/[^a-z0-9]+/g, '-'), label, color });

function makeField(topicId, key, name, type, order, options) {
  return { id: `${topicId}--${key}`, topicId, name, type, order, ...(options ? { options } : {}), createdAt: now(), updatedAt: now() };
}

let orderCounter = 0;
function task(topicId, title, o = {}) {
  orderCounter += 1;
  return {
    id: o.id || randomUUID(),
    topicId,
    title,
    description: o.description || '',
    status: o.status || (topicId === 'dev' ? 'backlog' : 'todo'),
    priority: o.priority || 'normal',
    assignee: o.assignee || '',
    dueDate: o.dueDate || null,
    tags: o.tags || [],
    parentId: o.parentId || null,
    fields: o.fields || {},
    comments: [],
    order: orderCounter,
    type: o.type,
    points: o.points ?? null,
    sprintId: o.sprintId ?? null,
    epicId: o.epicId ?? null,
    createdAt: now(),
    updatedAt: now(),
  };
}

function doc(topicId, title, content, pinned = false) {
  return { id: randomUUID(), topicId, title, content, pinned, createdAt: now(), updatedAt: now() };
}

const SADID = 'Sadid Hasan';
const NAYEM = 'Nayem Hasan';
const ANIKA = 'Anika Zaman';

export function buildSeed() {
  orderCounter = 0;
  const topics = TOPICS.map(([num, id, name, category, icon, description]) => ({
    id, num, name, category, icon, color: CAT[category], description, createdAt: now(), updatedAt: now(),
  }));
  topics.push({
    id: 'dev', num: 0, name: 'Development', category: 'Engineering', icon: 'Code2', color: CAT.Engineering,
    description: 'Engineering workflow: 2-week sprints, epics, backlog, roadmap and technical docs for the Aeethod SaaS.',
    createdAt: now(), updatedAt: now(),
  });

  // -------------------------------------------------------------------------
  // Custom fields (unlimited — no plan caps here)
  // -------------------------------------------------------------------------
  const elasticityOpts = [
    opt('Completely Inelastic', '#10b981'), opt('Extremely Inelastic', '#22c55e'), opt('Inelastic', '#3b82f6'),
    opt('Bifurcated', '#a855f7'), opt('Elastic', '#ef4444'),
  ];
  const phaseOpts = [opt('Phase 1 — Beachhead', '#ef4444'), opt('Phase 2 — Scale', '#f59e0b'), opt('Phase 3 — Expansion', '#3b82f6')];
  const modelOpts = [opt('Commission-Heavy', '#ef4444'), opt('Enterprise Hybrid', '#f59e0b'), opt('Flat SaaS', '#3b82f6'), opt('Freemium', '#a855f7')];
  const threatOpts = [opt('High', '#ef4444'), opt('Medium', '#f59e0b'), opt('Low', '#22c55e')];

  const fields = [
    makeField('economics', 'price', 'Proposed Price ($/mo)', 'currency', 1),
    makeField('economics', 'wtp', 'Estimated WTP ($/mo)', 'currency', 2),
    makeField('economics', 'surplus', 'Consumer Surplus ($/mo)', 'currency', 3),
    makeField('economics', 'savings', 'Savings vs Incumbent ($/mo)', 'currency', 4),
    makeField('economics', 'sam', 'SAM Accounts', 'number', 5),
    makeField('economics', 'elasticity', 'Elasticity of Demand', 'select', 6, elasticityOpts),
    makeField('economics', 'phase', 'GTM Phase', 'select', 7, phaseOpts),

    makeField('strategy', 'base', 'Base Price', 'text', 1),
    makeField('strategy', 'commission', 'Commission %', 'percent', 2),
    makeField('strategy', 'arr', 'Est. ARR ($M)', 'number', 3),
    makeField('strategy', 'model', 'Pricing Model', 'select', 4, modelOpts),
    makeField('strategy', 'threat', 'Threat Level', 'select', 5, threatOpts),

    makeField('marketing', 'channel', 'Channel', 'select', 1, [
      opt('SEO', '#10b981'), opt('Shopify App Store', '#22c55e'), opt('Video / Social', '#a855f7'), opt('Events', '#f59e0b'), opt('Community', '#3b82f6'),
    ]),
    makeField('marketing', 'budget', 'Budget', 'currency', 2),
    makeField('marketing', 'target-cac', 'Target CAC', 'currency', 3),

    makeField('sales', 'stage', 'Deal Stage', 'select', 1, [
      opt('Lead', '#64748b'), opt('Contacted', '#0ea5e9'), opt('Demo', '#3b82f6'), opt('Trial', '#a855f7'), opt('Negotiation', '#f59e0b'), opt('Won', '#22c55e'), opt('Lost', '#ef4444'),
    ]),
    makeField('sales', 'mrr', 'Deal MRR', 'currency', 2),
    makeField('sales', 'segment', 'Segment', 'select', 3, [
      opt('Indie LGS', '#f87171'), opt('Premier LGS', '#ef4444'), opt('Warehouse Seller', '#a78bfa'), opt('Show Dealer', '#f59e0b'), opt('Enterprise Chain', '#3b82f6'),
    ]),

    makeField('customer-success', 'health', 'Health', 'select', 1, [opt('Healthy', '#22c55e'), opt('At Risk', '#f59e0b'), opt('Critical', '#ef4444')]),
    makeField('customer-success', 'mrr', 'Account MRR', 'currency', 2),

    makeField('fundraising', 'stage', 'Investor Stage', 'select', 1, [
      opt('Researching', '#64748b'), opt('Intro', '#0ea5e9'), opt('Meeting', '#3b82f6'), opt('Due Diligence', '#a855f7'), opt('Term Sheet', '#22c55e'), opt('Passed', '#ef4444'),
    ]),
    makeField('fundraising', 'check', 'Check Size', 'currency', 2),

    makeField('product', 'reach', 'RICE Reach', 'number', 1),
    makeField('product', 'impact', 'RICE Impact (0.25–3)', 'number', 2),
    makeField('product', 'confidence', 'RICE Confidence', 'percent', 3),
    makeField('product', 'effort', 'RICE Effort (person-weeks)', 'number', 4),

    makeField('hrm', 'role-type', 'Role Type', 'select', 1, [opt('Full-time', '#3b82f6'), opt('Contractor', '#a855f7'), opt('Advisor', '#14b8a6')]),

    makeField('dev', 'component', 'Component', 'select', 1, [
      opt('Web App', '#3b82f6'), opt('API', '#22c55e'), opt('Mobile Scanner', '#a855f7'), opt('POS', '#f59e0b'), opt('Integrations', '#ec4899'), opt('Infra', '#64748b'),
    ]),
  ];
  const F = (topic, key) => `${topic}--${key}`;

  // -------------------------------------------------------------------------
  // Development: epics & sprints
  // -------------------------------------------------------------------------
  const epics = [
    ['ep-platform', 'Platform & DevOps', '#64748b', '2026-10-06', '2026-11-14', 'Monorepo, CI/CD, environments, observability.'],
    ['ep-catalog', 'Card Catalog & Data Engine', '#0ea5e9', '2026-10-06', '2026-11-28', 'Normalized multi-game card catalog (MTG, Pokémon, One Piece, Yu-Gi-Oh!, Lorcana).'],
    ['ep-inventory', 'Inventory Core', '#22c55e', '2026-10-13', '2026-12-12', 'Single inventory ledger: card × condition × finish × language × location.'],
    ['ep-pricing', 'Auto-Pricing Engine', '#f59e0b', '2026-10-20', '2027-01-09', 'Market-driven repricing rules, floors, rounding, schedules.'],
    ['ep-buylist', 'Buylist & Trade-In', '#ef4444', '2026-11-16', '2027-01-23', 'Customer buylist, in-store kiosk, cash/credit payouts.'],
    ['ep-scan', 'Bulk Camera Scanning', '#a855f7', '2026-10-20', '2027-02-06', 'On-device card recognition at ~0.2s/card with condition capture.'],
    ['ep-sync', 'Marketplace Sync', '#ec4899', '2026-11-02', '2027-02-20', 'Bi-directional inventory sync: Shopify, eBay, TCGplayer, Cardmarket.'],
    ['ep-pos', 'Offline-First POS', '#f97316', '2027-01-04', '2027-03-27', 'Counter & convention POS that works with zero connectivity.'],
    ['ep-multi', 'Multi-Location & RBAC', '#6366f1', '2027-02-01', '2027-04-24', 'Organizations, locations, roles, inter-store transfers.'],
    ['ep-billing', 'Billing & Onboarding', '#14b8a6', '2026-12-01', '2027-02-13', 'Stripe Billing plans and 24-hour migration importer (BinderPOS/Crystal).'],
  ].map(([id, name, color, startDate, endDate, description]) => ({ id, name, color, startDate, endDate, description, createdAt: now(), updatedAt: now() }));

  const sprints = [
    { id: 'sp-1', name: 'Sprint 1', goal: 'Foundation: monorepo, CI, database schema v0, MTG catalog ingest.', startDate: '2026-10-06', endDate: '2026-10-17', status: 'active' },
    { id: 'sp-2', name: 'Sprint 2', goal: 'Inventory ledger + pricing rules v0 + Shopify OAuth.', startDate: '2026-10-20', endDate: '2026-10-31', status: 'planned' },
  ].map((s) => ({ ...s, createdAt: now(), updatedAt: now() }));

  // -------------------------------------------------------------------------
  // Tasks
  // -------------------------------------------------------------------------
  const tasks = [];
  const add = (...a) => { const t = task(...a); tasks.push(t); return t; };

  // 1 Strategy
  add('strategy', 'Write Aeethod one-page strategy (vision, wedge, moat)', { status: 'in_progress', priority: 'high', assignee: SADID, dueDate: '2026-10-10', description: 'See the pinned doc **Aeethod Strategy One-Pager**. Finalise and share with the team.' });
  add('strategy', 'Lock beachhead: High-Volume Premier LGS + Warehouse PowerSellers', { status: 'review', priority: 'urgent', assignee: SADID, dueDate: '2026-10-08' });
  add('strategy', 'Define Q4 2026 OKRs', { priority: 'high', assignee: SADID, dueDate: '2026-10-12' });
  const competitors = [
    ['BinderPOS', '$100–$150/mo', 2.5, 8.0, 'commission-heavy', 'high', 'Est. 800–1,200 stores. **Signups paused Feb 2025** (maintenance mode). 2.0–2.5% on all online sales. Biggest migration opportunity.'],
    ['TCG Sync (Storefront Pro)', 'Tiered + £1,000 setup', 2, 4.35, 'commission-heavy', 'high', '1,210+ shops in 46 countries. 2% of TCG item sales (0% on Enterprise).'],
    ['Storepass', '$99 – $4,999/mo', 2, 1.8, 'enterprise-hybrid', 'high', '~250–400 premier stores. 2% on connected sales; flat (0%) plans only from $499/mo.'],
    ['Crystal Commerce', '$99/mo', 2.5, 2.3, 'commission-heavy', 'medium', '~527 stores. 2.5% on webstore & marketplace sales (0% on POS). Legacy platform.'],
    ['SortSwift', 'Free – $499/mo', 0, 0.68, 'freemium', 'medium', '~400–700 users. Freemium software; upsells Super Sorter hardware ($2,500–$6,000).'],
    ['Synq – TCG Manager', 'From $29/mo', 0, 0.48, 'flat-saas', 'medium', '~400–750 Shopify stores. Pricing automation without commission.'],
    ['TCG Automate', 'Usage-tiered', 0, 0.85, 'flat-saas', 'medium', '~500–1,000 sellers. Batch listing for eBay / Whatnot / Shopify power sellers.'],
    ['DeckTradr', '$49 – $129/mo', 0, 0.3, 'flat-saas', 'low', '~200–450 vendors. Fast camera scanner POS for convention dealers.'],
    ['TCG PowerTools', 'Free – €239/mo', 0, 2.3, 'flat-saas', 'medium', '~2,500–4,000 Cardmarket power sellers (EU). ARR in EUR (€1.8M–€2.8M).'],
  ];
  for (const [name, base, commission, arr, model, threat, description] of competitors) {
    add('strategy', `Competitor: ${name}`, {
      tags: ['competitor'], description: `${description}\n\n_Source: TCGMarketAnalysis/data/competitors.ts_`,
      fields: { [F('strategy', 'base')]: base, [F('strategy', 'commission')]: commission, [F('strategy', 'arr')]: arr, [F('strategy', 'model')]: model, [F('strategy', 'threat')]: threat },
    });
  }

  // 2 Marketing
  add('marketing', 'Launch "BinderPOS alternative" SEO landing page', { priority: 'high', assignee: NAYEM, dueDate: '2026-10-24', fields: { [F('marketing', 'channel')]: 'seo', [F('marketing', 'budget')]: 500, [F('marketing', 'target-cac')]: 300 } });
  add('marketing', 'Shopify App Store listing with 14-day free trial', { priority: 'high', dueDate: '2026-11-30', fields: { [F('marketing', 'channel')]: 'shopify-app-store', [F('marketing', 'target-cac')]: 250 } });
  add('marketing', 'Short-form video series: 0.2s camera scan demos', { fields: { [F('marketing', 'channel')]: 'video-social', [F('marketing', 'budget')]: 300 } });
  add('marketing', 'Event plan: GAMA Expo / MagicCon / Collect-A-Con booths', { fields: { [F('marketing', 'channel')]: 'events' } });
  add('marketing', 'Join & contribute to store-owner Discords and r/LGS', { fields: { [F('marketing', 'channel')]: 'community' } });

  // 3 Sales
  add('sales', 'Build lead list: 500 high-volume / WPN Premium stores', { priority: 'high', assignee: ANIKA, dueDate: '2026-10-20' });
  add('sales', 'Design-partner program: sign 10 founding stores', { priority: 'urgent', assignee: SADID, dueDate: '2026-11-15', description: 'Offer: founding price lock + free white-glove migration in exchange for weekly feedback.' });
  add('sales', 'BinderPOS migration script + ROI calculator', { priority: 'high', description: 'ROI = (base fee + commission % × online GMV) − Aeethod flat price.' });
  add('sales', 'Example deal: Premier LGS on BinderPOS', { tags: ['example'], fields: { [F('sales', 'stage')]: 'lead', [F('sales', 'mrr')]: 299, [F('sales', 'segment')]: 'premier-lgs' }, description: 'Template row — duplicate for real deals.' });

  // 4 Branding
  add('branding', 'Brand identity: logo, colour palette, typography', { priority: 'high', dueDate: '2026-10-31' });
  add('branding', 'Brand voice & messaging guide', {});
  add('branding', 'Website visual design system', {});

  // 5 B2B positioning
  add('b2b-positioning', 'Positioning statement: flat pricing, 0% commission, all-in-one', { status: 'in_progress', priority: 'high', assignee: SADID });
  add('b2b-positioning', 'Segment value props for all 5 customer tiers', { description: 'Use the Economics topic profiles as the source of truth.' });
  add('b2b-positioning', 'Battlecards for the top competitors', { description: 'One card per competitor in Business Strategy (tag: competitor).' });

  // 6 Finance
  add('finance', '12-month operating budget & burn plan', { priority: 'high', assignee: SADID, dueDate: '2026-10-25' });
  add('finance', 'Pricing tier model: $79 / $99 / $249 / $299 / $699', { description: 'Validate against WTP data in Economics; check blended ARPU in SaaS Metrics.' });
  add('finance', 'Open business bank account & Stripe account', { priority: 'high' });

  // 7 Accounting
  add('accounting', 'Choose accounting software & chart of accounts', {});
  add('accounting', 'Revenue recognition policy for subscriptions', {});
  add('accounting', 'Monthly close checklist', {});

  // 8 Economics — the 5 verified commercial profiles
  const profiles = [
    {
      title: 'Profile 1 — Indie Single-Store LGS', price: 99, wtp: 149, savings: 150, sam: 7500, el: 'elastic', ph: 'phase-2-scale',
      d: `**Who:** neighbourhood hobby shop, 1–3 staff, 1 register.\n\n| Metric | Value |\n|---|---|\n| SAM | 7,500 stores (US, CA, UK, W. Europe, ANZ) |\n| Monthly singles GMV | $12k – $35k |\n| Singles SKUs | 10k – 35k |\n| Current stack | Shopify/Square POS + Synq ($29) / Kori ($15–$25) / spreadsheets |\n| Current software spend | $49 – $150/mo |\n\n**Elasticity:** elastic (ε ≈ −1.2) — very sensitive to fixed monthly overhead and avoids % commissions.\n\n**Savings vs incumbent:** vs BinderPOS at ~$25k GMV with ~20% online: $125 base + 2.5% × $5k ≈ $250/mo → ~$150/mo saved.\n\n**Killer features:** one-click market repricing, phone-camera trade-in intake, zero commission.`,
    },
    {
      title: 'Profile 2 — High-Volume Premier LGS (WPN Premium)', price: 299, wtp: 599, savings: 1000, sam: 2400, el: 'extremely-inelastic', ph: 'phase-1-beachhead',
      d: `**Who:** destination store, 5–15 staff, 2–4 registers, dedicated trade-in counter.\n\n| Metric | Value |\n|---|---|\n| SAM | 2,400 stores |\n| Monthly singles GMV | $60k – $180k (≈45% online) |\n| Singles SKUs | 75k – 250k+ |\n| Current stack | BinderPOS / Crystal Commerce / Storepass |\n\n**BinderPOS cost (from competitor data: $100–$150/mo + 2.0–2.5% on online sales):**\n- $80k GMV → ~$36k online → $150 + $900 ≈ **$1,050/mo**\n- $150k GMV → ~$67.5k online → $150 + $1,688 ≈ **$1,840/mo**\n\nSavings at $299 flat: **~$750 – $1,540/mo**. BinderPOS signups have been paused since Feb 2025 — these stores need a successor.\n\n**Elasticity:** extremely inelastic (ε ≈ −0.3). **Phase 1 beachhead.**`,
    },
    {
      title: 'Profile 3 — Warehouse PowerSeller (TCGplayer / eBay / Cardmarket)', price: 249, wtp: 499, savings: 375, sam: 3500, el: 'inelastic', ph: 'phase-1-beachhead',
      d: `**Who:** online-only operation, 3–8 warehouse staff, no walk-ins.\n\n| Metric | Value |\n|---|---|\n| SAM | 3,500 operations (> $500k/yr singles) |\n| Monthly singles GMV | $50k – $250k |\n| Listings | 50k – 500k+ |\n| Current stack | TCG Automate + SortSwift + generic repricers + TCG PowerTools (EU) + scripts |\n| Current software spend | $350 – $900/mo across 3–4 vendors |\n\n**Pain:** cross-channel desync → double-sales → marketplace defects. Intake labour bottleneck.\n\n**Elasticity:** inelastic (ε ≈ −0.5) — judged on labour saved. **Phase 1 beachhead.**`,
    },
    {
      title: 'Profile 4 — Traveling Circuit / Show Dealer', price: 79, wtp: 119, savings: 0, sam: 4600, el: 'bifurcated', ph: 'phase-2-scale',
      d: `**Who:** convention & card-show vendors (Collect-A-Con, MagicCon, regionals), 1–3 staff.\n\n| Metric | Value |\n|---|---|\n| SAM | 4,600 active dealers |\n| Revenue per show weekend | $10k – $60k |\n| SKUs | 500 – 5,000 high-value (slabs, vintage) |\n| Current stack | Square / SnapSale ($39–$89) / DeckTradr ($49–$129) / Double Holo |\n\n**Pain:** no signal in convention halls; items sold at the booth stay live online.\n\n**Pricing:** $79/mo or $29 per-show pass. **Elasticity:** bifurcated — elastic off-season, inelastic during shows. Savings ≈ $0 on software; value is offline reliability + auto-delist.`,
    },
    {
      title: 'Profile 5 — Multi-Location Enterprise Chain', price: 699, wtp: 1499, savings: 2500, sam: 350, el: 'completely-inelastic', ph: 'phase-3-expansion',
      d: `**Who:** 3–15 stores + central depot, 20–100 staff.\n\n| Metric | Value |\n|---|---|\n| SAM | ~350 accounts (≈500 globally) |\n| Monthly singles GMV | $150k – $800k+ |\n| SKUs | 500k – 2M+ |\n| Current stack | Storepass Enterprise ($1,500 – $4,999/mo), TCG Sync Enterprise, custom ERP |\n\n**Pain:** inventory siloed per store, no inter-store transfers, release-day load.\n\n**Elasticity:** completely inelastic (ε ≈ −0.1) — decided on uptime, RBAC, SLA. **Phase 3.**`,
    },
  ];
  for (const p of profiles) {
    add('economics', p.title, {
      tags: ['customer-profile'], priority: p.ph.startsWith('phase-1') ? 'high' : 'normal', description: p.d,
      fields: {
        [F('economics', 'price')]: p.price, [F('economics', 'wtp')]: p.wtp, [F('economics', 'surplus')]: p.wtp - p.price,
        [F('economics', 'savings')]: p.savings, [F('economics', 'sam')]: p.sam,
        [F('economics', 'elasticity')]: p.el, [F('economics', 'phase')]: p.ph,
      },
    });
  }
  add('economics', 'Validate WTP: Van Westendorp survey with 50 store owners', { priority: 'high', dueDate: '2026-11-20' });
  add('economics', 'Supply–demand gap analysis: buylist, auto-pricing, scanning, sync', {});

  // 9 SCM
  add('scm', 'Map the TCG supply chain: publishers → distributors → stores → players', {});
  add('scm', 'Study sealed allocation & singles sourcing via buylists', {});
  add('scm', 'Inventory flow model: intake → grade → price → list → fulfil', { priority: 'high' });

  // 10 Retail
  add('retail', 'Interview 15 LGS owners about counter workflows', { priority: 'high', assignee: ANIKA, dueDate: '2026-10-31' });
  add('retail', 'Document in-store POS & trade-in flow', {});
  add('retail', 'Retail KPIs for singles: sell-through, turn, GMROI', {});

  // 11 MIS
  add('mis', 'Internal systems map (CRM, billing, support, analytics)', {});
  add('mis', 'Choose a CRM for the sales pipeline', {});
  add('mis', 'Data retention & access policy', {});

  // 12 BI
  add('bi', 'Define product analytics event taxonomy', {});
  add('bi', 'Founder KPI dashboard (lives in Aeethod OS → SaaS Metrics)', { status: 'done' });
  add('bi', 'Market price index dataset across marketplaces', {});

  // 13 Operations
  add('operations', 'Migration ops playbook: 24-hour BinderPOS / Crystal import', { priority: 'high' });
  add('operations', 'Support SLA & ticketing setup', {});
  add('operations', 'Vendor & tooling inventory', {});

  // 14 Customer success
  add('customer-success', 'New-store onboarding checklist', {});
  add('customer-success', 'Health score model (usage, sync errors, GMV)', {});
  add('customer-success', 'Churn-risk playbook', {});

  // 15 Legal
  add('legal', 'Incorporation, founder agreements & vesting', { priority: 'urgent', assignee: SADID });
  add('legal', 'Terms of Service, Privacy Policy, DPA (GDPR)', { priority: 'high' });
  add('legal', 'Review marketplace API terms (Shopify, eBay, TCGplayer, Cardmarket)', { priority: 'high', description: 'Confirm current API access policies before committing roadmap dates — access rules change.' });
  add('legal', 'Trademark search & filing for "Aeethod"', {});

  // 16 HRM
  add('hrm', 'Hiring plan: first 3 hires', { fields: { [F('hrm', 'role-type')]: 'full-time' } });
  add('hrm', 'Contractor agreements with IP assignment', { priority: 'high', fields: { [F('hrm', 'role-type')]: 'contractor' } });
  add('hrm', 'Culture & values doc', {});

  // 17 PM
  add('pm', 'Set up weekly operating cadence', { status: 'in_progress', assignee: SADID, description: 'See doc **Operating Cadence**.' });
  add('pm', 'Company roadmap Q4 2026 – Q2 2027', { priority: 'high' });
  add('pm', 'Risk register', {});

  // 18 Integration
  add('integration', 'Architecture: one inventory ledger across POS + all marketplaces', { priority: 'high' });
  add('integration', 'SCM features: purchase orders & distributor allocation tracking', {});
  add('integration', 'MIS layer: store-level & multi-location reporting', {});

  // 19 Fundraising
  add('fundraising', 'Pre-seed narrative & pitch deck', { priority: 'high', assignee: SADID, dueDate: '2026-11-30' });
  add('fundraising', 'Investor target list (vertical SaaS / retail-tech / gaming)', { fields: { [F('fundraising', 'stage')]: 'researching' } });
  add('fundraising', 'Data room setup', {});
  add('fundraising', 'Raise model: use of funds & 18-month runway', {});

  // 20 Founder
  add('founder', 'Weekly reflection & energy audit (Fridays)', { tags: ['recurring'] });
  add('founder', 'Start a decision journal', {});
  add('founder', 'Build a founder support network (peers, mentors)', {});

  // 21 Product
  const prd = (title, r, i, c, e) => add('product', title, { fields: { [F('product', 'reach')]: r, [F('product', 'impact')]: i, [F('product', 'confidence')]: c, [F('product', 'effort')]: e } });
  prd('PRD: Buylist & Trade-In module', 2400, 3, 80, 6);
  prd('PRD: Auto-Pricing Engine', 9900, 3, 90, 5);
  prd('PRD: Bulk Camera Scanning', 8000, 2, 60, 10);
  prd('PRD: Marketplace Sync (Shopify / eBay / TCGplayer / Cardmarket)', 5900, 3, 70, 12);
  add('product', 'Customer discovery synthesis (problem/solution fit)', { priority: 'high' });

  // 22 SaaS metrics
  add('saas-metrics', 'Agree metric definitions (see doc)', { status: 'done' });
  add('saas-metrics', 'Stripe → monthly metrics pipeline', {});
  add('saas-metrics', 'Monthly metrics review ritual (1st Monday)', { tags: ['recurring'] });

  // Development
  const dev = (title, o) => add('dev', title, o);
  dev('Set up TypeScript monorepo (pnpm + Turborepo)', { type: 'chore', points: 3, epicId: 'ep-platform', sprintId: 'sp-1', status: 'in_progress', assignee: NAYEM, fields: { [F('dev', 'component')]: 'infra' } });
  dev('CI on every PR: lint, typecheck, test (GitHub Actions)', { type: 'chore', points: 3, epicId: 'ep-platform', sprintId: 'sp-1', status: 'ready', fields: { [F('dev', 'component')]: 'infra' } });
  dev('Postgres + Prisma schema v0 (orgs, locations, catalog, inventory)', { type: 'feature', points: 5, epicId: 'ep-inventory', sprintId: 'sp-1', status: 'ready', priority: 'high', fields: { [F('dev', 'component')]: 'api' } });
  dev('Ingest Scryfall MTG bulk data into catalog', { type: 'feature', points: 8, epicId: 'ep-catalog', sprintId: 'sp-1', status: 'ready', fields: { [F('dev', 'component')]: 'api' } });
  dev('Spike: Pokémon / One Piece / Yu-Gi-Oh! catalog sources', { type: 'spike', points: 2, epicId: 'ep-catalog', sprintId: 'sp-1', status: 'in_review' });
  dev('Auth + organizations (store / team) model', { type: 'feature', points: 5, epicId: 'ep-multi', sprintId: 'sp-1', status: 'backlog', fields: { [F('dev', 'component')]: 'api' } });
  dev('Inventory ledger: SKU = card × condition × finish × language', { type: 'feature', points: 8, epicId: 'ep-inventory', sprintId: 'sp-2', priority: 'high' });
  dev('Pricing rules engine v0 (% of market, floors, rounding)', { type: 'feature', points: 8, epicId: 'ep-pricing', sprintId: 'sp-2' });
  dev('Shopify app OAuth + product sync', { type: 'feature', points: 8, epicId: 'ep-sync', sprintId: 'sp-2', fields: { [F('dev', 'component')]: 'integrations' } });
  dev('Spike: on-device card recognition accuracy & latency', { type: 'spike', points: 5, epicId: 'ep-scan', sprintId: 'sp-2', fields: { [F('dev', 'component')]: 'mobile-scanner' } });
  dev('Buylist kiosk UI (iPad)', { type: 'feature', points: 8, epicId: 'ep-buylist', fields: { [F('dev', 'component')]: 'web-app' } });
  dev('Store-credit payouts via Shopify gift cards', { type: 'feature', points: 5, epicId: 'ep-buylist' });
  dev('eBay inventory sync + instant auto-delist', { type: 'feature', points: 8, epicId: 'ep-sync', fields: { [F('dev', 'component')]: 'integrations' } });
  dev('Spike: TCGplayer seller integration options (verify API access)', { type: 'spike', points: 3, epicId: 'ep-sync', priority: 'high' });
  dev('Cardmarket API integration (EU)', { type: 'feature', points: 8, epicId: 'ep-sync' });
  dev('Offline queue + sync engine for POS', { type: 'feature', points: 13, epicId: 'ep-pos', fields: { [F('dev', 'component')]: 'pos' } });
  dev('Multi-register checkout', { type: 'feature', points: 8, epicId: 'ep-pos', fields: { [F('dev', 'component')]: 'pos' } });
  dev('Inter-store transfer workflow', { type: 'feature', points: 8, epicId: 'ep-multi' });
  dev('Role-based permissions (owner / manager / cashier)', { type: 'feature', points: 5, epicId: 'ep-multi' });
  dev('Stripe Billing: plans $79 – $699 + per-show pass', { type: 'feature', points: 5, epicId: 'ep-billing' });
  dev('BinderPOS / Crystal Commerce CSV migration importer', { type: 'feature', points: 8, epicId: 'ep-billing', priority: 'high' });
  dev('Observability: Sentry + structured logs + uptime checks', { type: 'chore', points: 3, epicId: 'ep-platform' });

  // -------------------------------------------------------------------------
  // Docs
  // -------------------------------------------------------------------------
  const docs = [
    doc('strategy', 'Aeethod Strategy One-Pager', STRATEGY_DOC, true),
    doc('economics', '5-Tier Customer Segmentation', SEGMENTATION_DOC, true),
    doc('dev', 'Engineering Workflow', WORKFLOW_DOC, true),
    doc('dev', 'Tech Stack Decision', STACK_DOC, true),
    doc('saas-metrics', 'Metric Definitions & Formulas', METRICS_DOC, true),
    doc('pm', 'Operating Cadence', CADENCE_DOC, true),
  ];

  // -------------------------------------------------------------------------
  // SaaS metrics — PLAN rows (assumptions, replace with actuals)
  // Year-1 target from TCGMarketAnalysis: ~100 stores. Blended ARPU ≈ $195, CAC ≈ $600.
  // -------------------------------------------------------------------------
  const ramp = [5, 10, 16, 23, 31, 40, 50, 60, 70, 80, 90, 100];
  const metrics = [];
  let prev = 0;
  ramp.forEach((customers, i) => {
    const d = new Date(Date.UTC(2026, 10 + i, 1)); // Nov 2026 →
    const month = d.toISOString().slice(0, 7);
    const churned = i >= 4 && i % 3 === 0 ? 1 : 0;
    const newCustomers = customers - prev + churned;
    const mrr = customers * 195;
    metrics.push({
      id: randomUUID(), month, kind: 'plan', mrr, customers, newCustomers, churnedCustomers: churned,
      salesMarketingSpend: newCustomers * 600, cogs: Math.round(mrr * 0.12), opex: 4000, cash: null,
      notes: i === 0 ? 'Plan assumptions — replace with actuals' : '', createdAt: now(), updatedAt: now(),
    });
    prev = customers;
  });

  return {
    version: 1,
    settings: { team: [SADID, NAYEM, ANIKA], company: 'Aeethod' },
    topics, fields, tasks, docs, metrics, sprints, epics,
  };
}

// ---------------------------------------------------------------------------
// Doc bodies
// ---------------------------------------------------------------------------
const STRATEGY_DOC = `# Aeethod — Strategy One-Pager

## Mission
Give every trading-card business — from the corner hobby shop to the multi-store chain — one operating system for buying, pricing, scanning, selling and syncing cards, **without taxing their sales**.

## The wedge
Incumbents monetise with **GMV commissions** (BinderPOS 2.0–2.5% on online sales, Crystal Commerce 2.5%, TCG Sync 2%, Storepass 2% below $499/mo). BinderPOS — the largest — **paused new signups in Feb 2025**. Aeethod offers **flat pricing, 0% commission** and a free 24-hour migration.

## Beachhead (Phase 1)
1. **High-Volume Premier LGS** — 2,400 stores, saves ~$750–$1,540/mo vs BinderPOS.
2. **Warehouse PowerSellers** — 3,500 operations, consolidates a $350–$900/mo tool stack.

## Market size (from TCGMarketAnalysis)
- TAM: 17,000 LGS + 28,000 online dealers + 25,000 prosumers.
- SAM: 9,900 LGS + 8,100 high-volume dealers = **18,000 businesses**.
- Year-1 target: ~100 stores. Year-3: ~600 stores.

## Moat
SCM + MIS + SaaS integration: a single inventory ledger across counter, buylist, scanner and every marketplace. Switching costs grow with every SKU and every integration.

## Pricing
| Tier | Segment | Price |
|---|---|---|
| Show | Circuit dealers | $79/mo or $29/show |
| Starter | Indie LGS | $99/mo |
| Warehouse | Online power sellers | $249/mo |
| Pro Retail | Premier LGS | $299/mo |
| Enterprise | Multi-location | $699/mo |
`;

const SEGMENTATION_DOC = `# 5-Tier Customer Segmentation

Source data: TCGMarketAnalysis (MarketCalculator + competitors). Each profile is a task in this topic with editable custom fields.

| Profile | SAM | Price | WTP | Consumer surplus | Elasticity | Phase |
|---|---|---|---|---|---|---|
| Indie Single-Store LGS | 7,500 | $99 | $149 | $50 | Elastic (−1.2) | 2 |
| Premier LGS | 2,400 | $299 | $599 | $300 | Extremely inelastic (−0.3) | **1** |
| Warehouse PowerSeller | 3,500 | $249 | $499 | $250 | Inelastic (−0.5) | **1** |
| Show Dealer | 4,600 | $79 | $119 | $40 | Bifurcated | 2 |
| Enterprise Chain | 350 | $699 | $1,499 | $800 | Completely inelastic (−0.1) | 3 |

**Definitions**
- *Consumer surplus* = WTP − price (value the customer keeps).
- *Savings vs incumbent* = what they pay today − Aeethod price (separate field — the sales argument).

**Excluded from Phase 1:** ~25,000 prosumers / part-time flippers (low WTP, high churn).

> Elasticity values and WTP are hypotheses — validate with the Van Westendorp survey task.
`;

const WORKFLOW_DOC = `# Engineering Workflow (decided)

## Cadence: 2-week sprints (Scrum-lite) + Kanban flow
Small team, fast feedback with design-partner stores → short sprints with a demo every 2 weeks.

| Day | Ritual | Length |
|---|---|---|
| Sprint day 1 (Mon) | Planning — pick from Ready, set sprint goal | 45 min |
| Daily | Async standup in chat (yesterday / today / blockers) | 5 min |
| Sprint day 10 (Fri) | Demo to design partners + retro | 60 min |
| Weekly | Backlog grooming → move items to **Ready** | 30 min |

## Statuses
**Backlog → Ready → In Progress → In Review → QA → Done**
- *Ready* = has acceptance criteria, estimate, no open questions.
- WIP limit: max 2 items In Progress per person.

## Work item types
Feature · Bug · Chore · Spike (time-boxed research) · Tech Debt

## Estimates
Fibonacci story points: 1, 2, 3, 5, 8, 13. Anything 13 gets split.

## Branching & release
- Trunk-based: short-lived branches off \`main\`, PR + review + green CI to merge.
- Every PR gets a preview deploy. \`main\` auto-deploys to **staging**; tagged releases go to **production**.
- Risky features ship behind feature flags.

## Definition of Done
- [ ] Acceptance criteria met
- [ ] Tests added/updated, CI green
- [ ] Reviewed by one other engineer
- [ ] Deployed to staging and verified
- [ ] Analytics events + error tracking in place
- [ ] Docs / changelog updated
`;

const STACK_DOC = `# Tech Stack Decision for the Aeethod SaaS

Principle: **one language (TypeScript) end-to-end** so a small team can move across web, API, POS and mobile.

| Layer | Choice | Why |
|---|---|---|
| Monorepo | pnpm + Turborepo | Shared types between web, API, mobile and workers |
| Web app (dashboard, buylist, storefront admin) | Next.js + React + Tailwind | Fast to build, SSR for public buylist pages |
| API | Node.js (NestJS) | Structured modules for many integrations |
| Database | PostgreSQL + Prisma | Relational inventory ledger, strong consistency for stock |
| Jobs / queues | Redis + BullMQ | Scheduled repricing, marketplace sync, webhooks retries |
| Search | Meilisearch | Typo-tolerant card search across millions of SKUs |
| POS (counter + convention) | React PWA, local SQLite/IndexedDB, sync queue | Offline-first; works with zero signal |
| Mobile scanner | React Native (Expo) + on-device recognition model | ~0.2s/card without network round-trips |
| Payments & billing | Stripe Billing (+ Stripe Terminal for POS) | Subscriptions, per-show passes, card-present payments |
| Auth | Organizations + locations + roles (owner/manager/cashier) | Required for multi-location & enterprise |
| Hosting | Vercel (web) + Fly.io or AWS (API, workers, DB) | Simple start, room to scale |
| Observability | Sentry, PostHog, uptime checks | Errors, product analytics, release-day monitoring |

## Integrations (priority order)
1. Shopify (app + webhooks) — most stores' webstore
2. eBay (Inventory API) — auto-delist on any sale
3. Cardmarket — EU power sellers
4. TCGplayer — **verify current API access policy before committing dates**
5. Catalog sources: Scryfall (MTG) and per-game data sources (spike in Sprint 1)

## Core data model
\`Organization → Location → InventoryItem(card, condition, finish, language, qty, cost, price) → Listing(channel)\` with an append-only **InventoryEvent** ledger so every sale, buy, transfer and sync is auditable.
`;

const METRICS_DOC = `# Metric Definitions & Formulas

Enter monthly numbers in **SaaS Metrics** (sidebar). Everything below is computed automatically.

| Metric | Formula |
|---|---|
| MRR | Sum of monthly recurring subscription revenue |
| ARR | MRR × 12 |
| ARPA | MRR ÷ customers |
| MoM growth | (MRR − previous MRR) ÷ previous MRR |
| Logo churn | churned customers ÷ previous month customers |
| Gross margin | (MRR − COGS) ÷ MRR |
| CAC | Sales & marketing spend ÷ new customers |
| LTV | ARPA × gross margin ÷ monthly churn |
| LTV : CAC | LTV ÷ CAC (target ≥ 3) |
| CAC payback | CAC ÷ (ARPA × gross margin) months (target ≤ 12) |
| Net burn | COGS + S&M + other opex − MRR |
| Runway | Cash ÷ net burn |

**COGS** = hosting, data/API costs, payment fees, support tooling.
**Other opex** = everything else excluding S&M and COGS (salaries, legal, tools).
`;

const CADENCE_DOC = `# Operating Cadence

| When | What | Where in Aeethod OS |
|---|---|---|
| Monday 09:00 | Weekly plan: top 3 company priorities | Home → Due this week |
| Daily | Async standup | Development → Board |
| Friday 16:00 | Weekly review + founder reflection | Founder Psychology |
| Every 2 weeks | Sprint demo & retro | Development → Sprints |
| 1st Monday of month | Metrics review | SaaS Metrics |
| Quarterly | OKR reset, strategy review | Business Strategy |
`;
