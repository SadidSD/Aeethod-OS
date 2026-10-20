const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, '..', 'data', 'db.json');
const INITIAL_DB_FILE = path.join(__dirname, '..', 'src', 'data', 'initialDb.ts');

const epics = [
  {
    id: "epic-optical-scanner-os",
    name: "AI Optical Scanner & Sifter Management OS",
    color: "#6366f1",
    description: "Sub-100ms computer-vision scanning, 9-pocket binder multi-card segmentation, specular foil glare normalization, and industrial Roca Sorter companion API bridge with real-time physical-to-digital bin coordinate mapping.",
    startDate: "2026-10-01",
    endDate: "2027-01-15",
    createdAt: "2026-10-19T22:15:00.000Z",
    updatedAt: "2026-10-19T22:15:00.000Z"
  },
  {
    id: "epic-buylist-tradein-portal",
    name: "Automated Buylist & Trade-In Portal",
    color: "#10b981",
    description: "Standalone customer-facing trade-in portal, self-service counter kiosk, dynamic cash/store-credit spread pricing engine, and pre-inspection mail-in discrepancy reconciliation pipeline.",
    startDate: "2026-10-15",
    endDate: "2027-02-15",
    createdAt: "2026-10-19T22:15:00.000Z",
    updatedAt: "2026-10-19T22:15:00.000Z"
  },
  {
    id: "epic-chaos-warehouse-os",
    name: "Smart Chaos Warehousing & Inventory OS",
    color: "#f59e0b",
    description: "Amazon-style chaotic storage bin-level indexing, 3D warehouse spatial coordinates, dynamic consolidation, Bill-of-Materials (BOM) box cracking, and strict FIFO cost-basis accounting for singles.",
    startDate: "2026-11-01",
    endDate: "2027-02-28",
    createdAt: "2026-10-19T22:15:00.000Z",
    updatedAt: "2026-10-19T22:15:00.000Z"
  },
  {
    id: "epic-omnichannel-sync-engine",
    name: "Real-Time Omnichannel Sync Engine",
    color: "#3b82f6",
    description: "Sub-500ms multi-channel distributed concurrency engine, token-bucket rate limiter, schema normalization across TCGplayer/eBay/Shopify, and mobile convention POS rapid delisting.",
    startDate: "2026-10-01",
    endDate: "2027-01-31",
    createdAt: "2026-10-19T22:15:00.000Z",
    updatedAt: "2026-10-19T22:15:00.000Z"
  }
];

const devTasks = [
  // --- Epic 1: Scanner OS ---
  {
    id: "task-dev-scan-1",
    topicId: "dev",
    epicId: "epic-optical-scanner-os",
    title: "Sub-100ms Edge Vision Pipeline & Local Feature Hashing",
    description: "Implement client-side on-device frame difference, edge detection, and perceptual hashing to identify card candidates before cloud fallback.",
    status: "in_progress",
    priority: "urgent",
    type: "spike",
    points: 8,
    assignee: "Sadid Hasan",
    dueDate: "2026-11-01",
    tags: ["Computer Vision", "Performance", "WebAssembly"],
    parentId: null,
    fields: {},
    comments: [],
    order: 1,
    createdAt: "2026-10-19T22:15:00.000Z",
    updatedAt: "2026-10-19T22:15:00.000Z"
  },
  {
    id: "task-dev-scan-2",
    topicId: "dev",
    epicId: "epic-optical-scanner-os",
    title: "9-Pocket Binder Multi-Object Segmentation & Dewarping",
    description: "Build multi-bounding box segmentation model that identifies, crops, and dewarps all 9 or 12 cards simultaneously on a binder page.",
    status: "todo",
    priority: "high",
    type: "feature",
    points: 5,
    assignee: "Nayem Hasan",
    dueDate: "2026-11-15",
    tags: ["Computer Vision", "Mobile App"],
    parentId: null,
    fields: {},
    comments: [],
    order: 2,
    createdAt: "2026-10-19T22:15:00.000Z",
    updatedAt: "2026-10-19T22:15:00.000Z"
  },
  {
    id: "task-dev-scan-3",
    topicId: "dev",
    epicId: "epic-optical-scanner-os",
    title: "Prismatic Foil Glare & Specular Normalization Filter",
    description: "Develop specular highlight normalization to prevent holographic card reflection flare from blowing out camera sensors and set symbols.",
    status: "todo",
    priority: "high",
    type: "feature",
    points: 5,
    assignee: "Sadid Hasan",
    dueDate: "2026-11-20",
    tags: ["Image Processing", "Holo Detection"],
    parentId: null,
    fields: {},
    comments: [],
    order: 3,
    createdAt: "2026-10-19T22:15:00.000Z",
    updatedAt: "2026-10-19T22:15:00.000Z"
  },
  {
    id: "task-dev-scan-4",
    topicId: "dev",
    epicId: "epic-optical-scanner-os",
    title: "Roca Sorter Real-Time WebSocket Daemon & Bin Mapping",
    description: "Replace legacy CSV exports with a bi-directional local WebSocket service syncing Roca physical drop pockets directly to warehouse WMS shelves.",
    status: "backlog",
    priority: "urgent",
    type: "feature",
    points: 8,
    assignee: "Nayem Hasan",
    dueDate: "2026-12-05",
    tags: ["Roca Sorter", "Hardware Integration", "WebSockets"],
    parentId: null,
    fields: {},
    comments: [],
    order: 4,
    createdAt: "2026-10-19T22:15:00.000Z",
    updatedAt: "2026-10-19T22:15:00.000Z"
  },
  {
    id: "task-dev-scan-5",
    topicId: "dev",
    epicId: "epic-optical-scanner-os",
    title: "Hands-Free Auto-Motion Shutter & USB Foot-Pedal Hook",
    description: "Implement motion vector stabilization trigger and WebHID foot pedal hook for continuous 30+ cards/minute manual desk intake.",
    status: "done",
    priority: "normal",
    type: "feature",
    points: 3,
    assignee: "Anika Zaman",
    dueDate: "2026-10-18",
    tags: ["Hardware Hook", "UX", "Intake"],
    parentId: null,
    fields: {},
    comments: [],
    order: 5,
    createdAt: "2026-10-19T22:15:00.000Z",
    updatedAt: "2026-10-19T22:15:00.000Z"
  },
  {
    id: "task-dev-scan-6",
    topicId: "dev",
    epicId: "epic-optical-scanner-os",
    title: "Asynchronous Optical Quarantine & 5-Second Review Queue",
    description: "Divert ambiguous variants and low-confidence scans to an async review queue for instant 1-click human verification.",
    status: "done",
    priority: "normal",
    type: "chore",
    points: 3,
    assignee: "Anika Zaman",
    dueDate: "2026-10-16",
    tags: ["Quality Assurance", "Workflow"],
    parentId: null,
    fields: {},
    comments: [],
    order: 6,
    createdAt: "2026-10-19T22:15:00.000Z",
    updatedAt: "2026-10-19T22:15:00.000Z"
  },

  // --- Epic 2: Buylist Portal ---
  {
    id: "task-dev-buy-1",
    topicId: "dev",
    epicId: "epic-buylist-tradein-portal",
    title: "Headless Responsive Buylist Portal & Embeddable Widget",
    description: "Build clean, mobile-first customer submission portal with instant card search, condition guidance, and live basket checkout.",
    status: "in_progress",
    priority: "urgent",
    type: "feature",
    points: 5,
    assignee: "Anika Zaman",
    dueDate: "2026-11-10",
    tags: ["Frontend", "Customer Portal", "Buylist"],
    parentId: null,
    fields: {},
    comments: [],
    order: 7,
    createdAt: "2026-10-19T22:15:00.000Z",
    updatedAt: "2026-10-19T22:15:00.000Z"
  },
  {
    id: "task-dev-buy-2",
    topicId: "dev",
    epicId: "epic-buylist-tradein-portal",
    title: "Dynamic Cash/Store-Credit Spread Engine & Cashflow Guard",
    description: "Configurable margin formula linking TCGplayer market prices to target acquisition percentages with daily cash payout velocity limits.",
    status: "todo",
    priority: "high",
    type: "feature",
    points: 5,
    assignee: "Sadid Hasan",
    dueDate: "2026-11-25",
    tags: ["Pricing Engine", "Cashflow Guard"],
    parentId: null,
    fields: {},
    comments: [],
    order: 8,
    createdAt: "2026-10-19T22:15:00.000Z",
    updatedAt: "2026-10-19T22:15:00.000Z"
  },
  {
    id: "task-dev-buy-3",
    topicId: "dev",
    epicId: "epic-buylist-tradein-portal",
    title: "Self-Service Counter Kiosk Mode for In-Store Walk-Ins",
    description: "Dedicated locked iPad kiosk mode for retail stores allowing customers to submit trade-ins and receive a digitized queue ticket.",
    status: "todo",
    priority: "high",
    type: "feature",
    points: 5,
    assignee: "Anika Zaman",
    dueDate: "2026-12-01",
    tags: ["Kiosk", "Retail POS", "UX"],
    parentId: null,
    fields: {},
    comments: [],
    order: 9,
    createdAt: "2026-10-19T22:15:00.000Z",
    updatedAt: "2026-10-19T22:15:00.000Z"
  },
  {
    id: "task-dev-buy-4",
    topicId: "dev",
    epicId: "epic-buylist-tradein-portal",
    title: "Mail-In Shipping Label Automation (EasyPost / Shippo API)",
    description: "Generate automated printable packing slips, tracking manifests, and discounted commercial shipping labels for customer submissions.",
    status: "backlog",
    priority: "normal",
    type: "chore",
    points: 3,
    assignee: "Nayem Hasan",
    dueDate: "2026-12-15",
    tags: ["Logistics", "EasyPost", "Shipping"],
    parentId: null,
    fields: {},
    comments: [],
    order: 10,
    createdAt: "2026-10-19T22:15:00.000Z",
    updatedAt: "2026-10-19T22:15:00.000Z"
  },
  {
    id: "task-dev-buy-5",
    topicId: "dev",
    epicId: "epic-buylist-tradein-portal",
    title: "Grading Discrepancy & 1-Click Counter-Offer Portal",
    description: "Streamlined inspection workstation to record condition downgrades and trigger an automated SMS/email customer renegotiation flow.",
    status: "backlog",
    priority: "high",
    type: "feature",
    points: 5,
    assignee: "Sadid Hasan",
    dueDate: "2026-12-20",
    tags: ["Workflow", "Discrepancy", "Customer Success"],
    parentId: null,
    fields: {},
    comments: [],
    order: 11,
    createdAt: "2026-10-19T22:15:00.000Z",
    updatedAt: "2026-10-19T22:15:00.000Z"
  },
  {
    id: "task-dev-buy-6",
    topicId: "dev",
    epicId: "epic-buylist-tradein-portal",
    title: "Store Credit Ledger & Shopify Gift Card Sync API",
    description: "Automated instant credit issuance into merchant POS balances or Shopify customer gift cards with zero transaction processing fees.",
    status: "done",
    priority: "normal",
    type: "feature",
    points: 3,
    assignee: "Nayem Hasan",
    dueDate: "2026-10-14",
    tags: ["Shopify API", "Accounting", "Ledger"],
    parentId: null,
    fields: {},
    comments: [],
    order: 12,
    createdAt: "2026-10-19T22:15:00.000Z",
    updatedAt: "2026-10-19T22:15:00.000Z"
  },

  // --- Epic 3: Chaos Warehousing OS ---
  {
    id: "task-dev-ware-1",
    topicId: "dev",
    epicId: "epic-chaos-warehouse-os",
    title: "3D Hierarchical Chaos Bin Storage & DataMatrix Binding",
    description: "Spatial warehouse coordinate indexing (Warehouse -> Aisle -> Shelf -> Box -> Partition -> Slot) with instant 2D DataMatrix scanning.",
    status: "todo",
    priority: "urgent",
    type: "feature",
    points: 8,
    assignee: "Nayem Hasan",
    dueDate: "2026-11-30",
    tags: ["WMS", "Database", "Chaos Storage"],
    parentId: null,
    fields: {},
    comments: [],
    order: 13,
    createdAt: "2026-10-19T22:15:00.000Z",
    updatedAt: "2026-10-19T22:15:00.000Z"
  },
  {
    id: "task-dev-ware-2",
    topicId: "dev",
    epicId: "epic-chaos-warehouse-os",
    title: "Wave Picking & Traveling Salesman Pathfinding Algorithm",
    description: "Algorithmic pick path optimization grouping up to 50 concurrent orders into the shortest physical walking distance across warehouse aisles.",
    status: "todo",
    priority: "high",
    type: "feature",
    points: 5,
    assignee: "Sadid Hasan",
    dueDate: "2026-12-10",
    tags: ["Pathfinding", "Fulfillment", "Algorithms"],
    parentId: null,
    fields: {},
    comments: [],
    order: 14,
    createdAt: "2026-10-19T22:15:00.000Z",
    updatedAt: "2026-10-19T22:15:00.000Z"
  },
  {
    id: "task-dev-ware-3",
    topicId: "dev",
    epicId: "epic-chaos-warehouse-os",
    title: "BOM Box Cracking Decomposition & Pack Value Engine",
    description: "Convert 1 sealed Booster Box into 36 individual Booster Packs or expected singles inventory without breaking double-entry ledger balance.",
    status: "backlog",
    priority: "high",
    type: "feature",
    points: 5,
    assignee: "Anika Zaman",
    dueDate: "2026-12-28",
    tags: ["Inventory", "BOM", "Accounting"],
    parentId: null,
    fields: {},
    comments: [],
    order: 15,
    createdAt: "2026-10-19T22:15:00.000Z",
    updatedAt: "2026-10-19T22:15:00.000Z"
  },
  {
    id: "task-dev-ware-4",
    topicId: "dev",
    epicId: "epic-chaos-warehouse-os",
    title: "Automated Bin Consolidation & Defragmentation Service",
    description: "Background worker analyzing bin fill percentages and automatically suggesting optimal card consolidation to reclaim empty storage rows.",
    status: "backlog",
    priority: "normal",
    type: "chore",
    points: 3,
    assignee: "Nayem Hasan",
    dueDate: "2027-01-10",
    tags: ["Optimization", "Storage", "Maintenance"],
    parentId: null,
    fields: {},
    comments: [],
    order: 16,
    createdAt: "2026-10-19T22:15:00.000Z",
    updatedAt: "2026-10-19T22:15:00.000Z"
  },
  {
    id: "task-dev-ware-5",
    topicId: "dev",
    epicId: "epic-chaos-warehouse-os",
    title: "Strict FIFO Cost-Basis Accounting & Lot Tracking",
    description: "Maintain discrete acquisition lot costs per single card to report true realized gross margin across volatile market spikes.",
    status: "in_progress",
    priority: "urgent",
    type: "feature",
    points: 5,
    assignee: "Sadid Hasan",
    dueDate: "2026-11-18",
    tags: ["Accounting", "FIFO", "Margins"],
    parentId: null,
    fields: {},
    comments: [],
    order: 17,
    createdAt: "2026-10-19T22:15:00.000Z",
    updatedAt: "2026-10-19T22:15:00.000Z"
  },
  {
    id: "task-dev-ware-6",
    topicId: "dev",
    epicId: "epic-chaos-warehouse-os",
    title: "Offline Local-First IndexedDB Cache for Warehouse Scanners",
    description: "Enable handheld mobile scanners to continue barcode validation and pick confirmation during Wi-Fi dead-zone dropouts in steel warehouse racks.",
    status: "done",
    priority: "normal",
    type: "spike",
    points: 5,
    assignee: "Nayem Hasan",
    dueDate: "2026-10-12",
    tags: ["Offline", "IndexedDB", "PWA"],
    parentId: null,
    fields: {},
    comments: [],
    order: 18,
    createdAt: "2026-10-19T22:15:00.000Z",
    updatedAt: "2026-10-19T22:15:00.000Z"
  },

  // --- Epic 4: Omnichannel Sync Engine ---
  {
    id: "task-dev-sync-1",
    topicId: "dev",
    epicId: "epic-omnichannel-sync-engine",
    title: "Distributed Concurrency & Sub-500ms Multi-Marketplace Lock",
    description: "Implement Redis Redlock cluster on universal card UUIDs fanning out parallel delisting calls to eBay, TCGplayer, and Shopify on sale.",
    status: "in_progress",
    priority: "urgent",
    type: "feature",
    points: 8,
    assignee: "Sadid Hasan",
    dueDate: "2026-11-05",
    tags: ["Distributed Systems", "Redis", "Concurrency"],
    parentId: null,
    fields: {},
    comments: [],
    order: 19,
    createdAt: "2026-10-19T22:15:00.000Z",
    updatedAt: "2026-10-19T22:15:00.000Z"
  },
  {
    id: "task-dev-sync-2",
    topicId: "dev",
    epicId: "epic-omnichannel-sync-engine",
    title: "Token-Bucket Delta Batcher & Rate-Limit Controller",
    description: "Intelligent queueing system prioritizing high-value $50+ cards over bulk during 25,000-card catalog repricing runs without triggering 429 errors.",
    status: "todo",
    priority: "urgent",
    type: "feature",
    points: 5,
    assignee: "Nayem Hasan",
    dueDate: "2026-11-20",
    tags: ["Rate Limiting", "Queue", "APIs"],
    parentId: null,
    fields: {},
    comments: [],
    order: 20,
    createdAt: "2026-10-19T22:15:00.000Z",
    updatedAt: "2026-10-19T22:15:00.000Z"
  },
  {
    id: "task-dev-sync-3",
    topicId: "dev",
    epicId: "epic-omnichannel-sync-engine",
    title: "Universal Taxonomy & Aspect Mapping Pipeline",
    description: "Normalize conflicting schema aspects between TCGplayer product IDs, eBay item specifics, and Shopify metafields without metadata loss.",
    status: "todo",
    priority: "high",
    type: "feature",
    points: 5,
    assignee: "Anika Zaman",
    dueDate: "2026-12-01",
    tags: ["Data Normalization", "Taxonomy", "ETL"],
    parentId: null,
    fields: {},
    comments: [],
    order: 21,
    createdAt: "2026-10-19T22:15:00.000Z",
    updatedAt: "2026-10-19T22:15:00.000Z"
  },
  {
    id: "task-dev-sync-4",
    topicId: "dev",
    epicId: "epic-omnichannel-sync-engine",
    title: "Mobile Convention POS & 1-Tap Live-Stream Delister",
    description: "Dedicated mobile register for card show dealers (Profile 4) & Whatnot streamers executing 1-tap cash sales and broadcasting instant marketplace delists.",
    status: "backlog",
    priority: "urgent",
    type: "feature",
    points: 8,
    assignee: "Sadid Hasan",
    dueDate: "2026-12-18",
    tags: ["POS", "Mobile", "Live Stream"],
    parentId: null,
    fields: {},
    comments: [],
    order: 22,
    createdAt: "2026-10-19T22:15:00.000Z",
    updatedAt: "2026-10-19T22:15:00.000Z"
  },
  {
    id: "task-dev-sync-5",
    topicId: "dev",
    epicId: "epic-omnichannel-sync-engine",
    title: "Channel-Specific Pricing Formulas & Margin Guard",
    description: "Automatically offset marketplace commission percentages (e.g. eBay base + 13.25%) to preserve exact net profit margins across all channels.",
    status: "done",
    priority: "high",
    type: "feature",
    points: 5,
    assignee: "Nayem Hasan",
    dueDate: "2026-10-15",
    tags: ["Pricing Engine", "Margin Guard"],
    parentId: null,
    fields: {},
    comments: [],
    order: 23,
    createdAt: "2026-10-19T22:15:00.000Z",
    updatedAt: "2026-10-19T22:15:00.000Z"
  },
  {
    id: "task-dev-sync-6",
    topicId: "dev",
    epicId: "epic-omnichannel-sync-engine",
    title: "Cloud-Native Headless Session Daemon & IP Rotation",
    description: "Eliminate $249 local hardware sync boxes by orchestrating cloud headless browser sessions with residential IP rotation against Cloudflare blocks.",
    status: "backlog",
    priority: "high",
    type: "feature",
    points: 8,
    assignee: "Sadid Hasan",
    dueDate: "2027-01-10",
    tags: ["Cloud Infrastructure", "Automation", "Security"],
    parentId: null,
    fields: {},
    comments: [],
    order: 24,
    createdAt: "2026-10-19T22:15:00.000Z",
    updatedAt: "2026-10-19T22:15:00.000Z"
  }
];

function updateDbJson() {
  const raw = fs.readFileSync(DB_FILE, 'utf8');
  const db = JSON.parse(raw);

  // Set epics
  db.epics = epics;

  // Merge devTasks into tasks without duplicates
  const existingTaskIds = new Set((db.tasks || []).map(t => t.id));
  const newTasks = [...(db.tasks || [])];

  for (const dt of devTasks) {
    if (!existingTaskIds.has(dt.id)) {
      newTasks.push(dt);
      existingTaskIds.add(dt.id);
    }
  }
  db.tasks = newTasks;

  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
  console.log(`[db.json] Successfully saved ${db.epics.length} epics and ${db.tasks.length} total tasks.`);
}

function updateInitialDbTs() {
  const content = fs.readFileSync(INITIAL_DB_FILE, 'utf8');
  
  // Replace "epics": [] with epics json
  const epicsJson = JSON.stringify(epics, null, 4).replace(/^/gm, '  ');
  let updated = content.replace(/"epics":\s*\[\],/, `"epics": ${epicsJson.trim()},`);
  
  // Also check if tasks need devTasks added in INITIAL_DB
  // Let's verify if devTasks are present
  if (!updated.includes('task-dev-scan-1')) {
    const tasksInsertIdx = updated.indexOf('"tasks": [');
    if (tasksInsertIdx !== -1) {
      const devTasksJson = JSON.stringify(devTasks, null, 4).slice(1, -1).trim(); // remove outer [ and ]
      updated = updated.replace('"tasks": [', `"tasks": [\n    ${devTasksJson},`);
    }
  }

  fs.writeFileSync(INITIAL_DB_FILE, updated, 'utf8');
  console.log('[initialDb.ts] Successfully updated with 4 epics and dev tasks.');
}

updateDbJson();
updateInitialDbTs();
