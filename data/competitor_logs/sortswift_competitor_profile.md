# Competitor Profile: SortSwift (MTechCave LLC)
**Last Updated:** October 15, 2026  
**Source Dataset:** 337 Discord Announcements (June 2024 – October 2026)  
**Status in Aeethod OS:** Integrated into `src/lib/competitorsData.ts` & `src/views/CompetitorMatrixView.tsx`

---

## 1. Company & Core Team
* **Entity:** SortSwift Technologies / MTechCave LLC (USA)
* **Team Size:** 5 Core Members
  * **`mtechcave`**: Founder, Hardware Engineer, Operations & Support
  * **`Devon`**: Lead Developer
  * **`Steve`**: Core Software Developer
  * **`Saqib`**: Core Software Developer
  * **`Kai`**: Card Catalog Specialist (TCG database ingestion)
* **Estimated Scale:** ~500 – 850 active card shops & breakers
* **Estimated ARR:** \$650K – \$1.2M ARR (Blended SaaS + Sorter hardware + Sync Boxes)

---

## 2. Active Engineering Focus & Priorities
Based on statistical topic frequency from 337 announcements:

| Focus Area | % of Recent Engineering Focus | Description & Architectural Strategy |
| :--- | :---: | :--- |
| **Catalog Ingestion & Breadth** | **64%** | Continuously adding long-tail card sets and obscure games (57 games total, Weiss Schwarz Japanese 66,000 cards across 563 sets, European Yu-Gi-Oh regional prints LOB-E/MRD-E, Decipher Star Wars CCG, Lord of the Rings, Naruto Mythos). |
| **Hardware & Edge Firmware** | **58%** | Constant maintenance of Raspberry Pi Linux images (migrated to 64-bit v11.5.2 on Oct 15, 2026), Sync Box thermal fan fixes, and LAN socket protocols. Highly prone to SD card corruption. |
| **Condition Grading & Computer Vision** | **44%** | Crowdsourced whitening brush training on Sifter scans (v10.3.5) to automate Near Mint vs Lightly Played classification. Subjective and noisy due to varying store lighting. |
| **Marketplace Sync & Sync Slots** | **38%** | Sync slot gating (1 to 7 slots) across Shopify, eBay, Square, WooCommerce, CardTrader, ManaPool, and CardNexus. Local browser scrapers and Sync Box appliances used for TCGplayer. |
| **Live Breaks & Streaming Commerce** | **25% (Flagship Pivot)** | Major Q4 2026 pivot: `/breaks` storefronts, Stream Deck cockpit, OBS browser overlays, hype meters, and automated vertical short clippers for TikTok/Reels to bypass Whatnot's 8–11% cut. |

---

## 3. Full Commercial Pricing Model (Effective 2026)

### A. Monthly Base SaaS Plans
* **Entry (Free):** 5,000 items, 500 scans, CSV tools, TCGplayer extension, 1-game basic pricing.
* **Entry+ (\$19/mo):** 25,000 items, 1,000 scans, 1 sync slot.
* **Entry Max (\$49/mo):** 50,000 items, 1,500 scans, 2 sync slots.
* **Starter (\$99/mo):** Unlimited inventory, 2,000 scans, 3 sync slots.
* **Starter+ (\$149/mo):** Unlimited inventory, 3,000 scans, 4 sync slots.
* **Online (\$219/mo):** 5 sync slots, multi-channel ecommerce routing.
* **Core (\$249/mo):** 6 sync slots, 6 games auto-pricing.
* **Core+ (\$369/mo):** 7 sync slots, includes Consignment.
* **Core Max (\$499/mo):** Unlimited sync slots, includes Consignment.

### B. Hardware & Upfront Costs
* **Simple Sifter (Edge Scanner):** Raspberry Pi microSD boot image (`sortswift-sifter64.img.gz`).
* **SortSwiftOS Sync Box:** **\$249** one-time purchase + **\$12.99/mo per channel** for background 24/7 syncing without leaving a PC on.
* **Super Sorter Mini:** **\$9,000** upfront + **\$1,000 non-refundable deposit** + **\$199/month** software license (9 physical bins, 3,000+ cards/hr).
* **Super Sorter (Full):** **\$35,000+** (29 physical bins).

### C. A La Carte Add-Ons
* **Consignment Module:** \$49.99/month.
* **Dedicated Buylist Domain:** \$25/month.
* **In-Store Kiosk:** \$9.99/month.
* **PriceCharting Sub:** Extra tier for sports cards & video games.

---

## 4. Fatal Weaknesses & Aeethod OS Attack Vectors

| SortSwift Weakness | Aeethod OS Decisive Counter-Measure |
| :--- | :--- |
| **No FIFO Cost-Basis & Tax COGS:** SortSwift only counts cards. Zero lot tracking, purchase order deprecation, or CPA tax reports. | **`prod-inventory-warehouse` (Problems #1–10):** Real-time purchase lot tracking, FIFO inventory depletion, and CPA-ready IRS Form 1125-A tax export. |
| **No Return Quarantine / Counterfeit Defense:** Returned items automatically restock into live inventory. Proxies and swap fakes contaminate stock. | **Return Quarantine Air-Lock (Problem #5):** Optical verification holding pen isolates returned cards until tamper verification clears. |
| **No Graded Slab Support:** Mechanical sifters and sorters physically reject encapsulated PSA, BGS, and CGC slabs. 40%+ of market ignored. | **High-Res Slab Cert Engine:** Instant barcode scanning, certification registry verification, and population report lookups. |
| **Hardware MicroSD Hell:** Requires downloading `.img.gz` files and flashing SD cards with Raspberry Pi Imager. Reflashing wipes open batches. | **Zero Hardware Friction:** Pure browser WebAssembly & WebRTC running on any smartphone, iPad, or standard USB webcam. |
| **No Dynamic 4x Playset Bundling:** Static quantities only; cannot calculate dynamic $\lfloor N/4 \rfloor$ eBay playsets vs Shopify singles. | **Mathematical Dynamic Bundling:** Native playset sync updating in milliseconds across channels. |
