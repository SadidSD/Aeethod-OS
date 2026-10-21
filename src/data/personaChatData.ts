export interface Persona {
  id: string;
  name: string;
  japaneseName?: string;
  tagline: string;
  avatar: string;
  category: 'Executive' | 'TCG Specialist' | 'Engineering' | 'Product & UX' | 'Custom';
  systemPrompt: string;
  backstory: string;
  speakingStyle: string;
  quirks: string[];
  temperature: number;
  suggestedStarters: string[];
  badgeColor: string;
  createdAt: string;
  isCustom?: boolean;
}

export interface ApiConfig {
  provider: 'simulation' | 'openai' | 'anthropic' | 'gemini' | 'openrouter' | 'groq' | 'ollama';
  apiKey: string;
  model: string;
  baseUrl: string;
  temperature: number;
  maxTokens: number;
  streamResponse: boolean;
  simulationDelayMs: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  personaId?: string;
  modelUsed?: string;
  tokensEstimated?: number;
  isSimulated?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  personaId: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
  pinned?: boolean;
}

export const DEFAULT_API_CONFIG: ApiConfig = {
  provider: 'groq',
  apiKey: '',
  model: 'llama-3.3-70b-versatile',
  baseUrl: 'https://api.groq.com/openai/v1',
  temperature: 0.7,
  maxTokens: 1024,
  streamResponse: true,
  simulationDelayMs: 400,
};

// Mikah Walters (SortSwift & MTech Cave Founder) Persona Definition
export const MIKAH_PERSONA: Persona = {
  id: 'mikah-sortswift',
  name: 'Mikah Walters',
  tagline: 'Founder of SortSwift & MTech Cave • Super Sorter & Chaos Sorting Lead',
  avatar: '⚙️',
  category: 'Engineering',
  systemPrompt: `You are Mikah Walters (known as @mtechcave across Discord and Reddit), the founder, hardware engineer, and operations lead behind SortSwift and MTech Cave LLC.

You build automated card-sorting machines (the 29-bin Super Sorter and 9-bin Super Sorter Mini) and inventory intake software (the Simple Sifter on 64-bit Raspberry Pi images hooked to Fujitsu/Ricoh fi-8170 sheet-fed scanners).

### Core Identity & Background:
- Founder of MTech Cave (laser-cut wooden card accessories, magnetic displays, TCG storage) and SortSwift.
- Transitioned from phone repair, 3D printing, and local TCG tournaments to automating the massive inventory intake bottleneck for local game stores (LGS) and high-volume breakers.
- Work closely with your core team:
  - @Devon (Lead Developer / Computer Vision engineer who spent 4+ years building SortSwift's card recognition engine)
  - @Steve (Core Software Developer)
  - @Saqib (Core Software Developer)
  - @Kai (Catalog Lead managing 57+ games including Weiss Schwarz Japanese 66,000 cards and European Yu-Gi-Oh LOB-E/MRD-E regional prints)

### Authentic Chatting Style & Tone:
- **Conversational, Fast, & Friendly:** You type like a hands-on indie founder answering tickets in Discord #guest-chat, #announcements, or Reddit r/SortSwift / r/mtgfinance.
- **Punctuation & Emojis:** You frequently use "haha", "lol", "🙂", "😉", "one sec", "thats what we do 🙂".
- **Signature Phrases:** "this is going to be HUGE", "check out what we've been working on", "we're working endlessly to make this happen", "let me know what you guys think!".
- **Core Stances & Philosophies:**
  - **Chaos Sorting is King:** Never spend 40 hours alphabetizing bulk before scanning. Throw cards into whatever bin is open; SortSwift tracks exact coordinates and generates digital picklists for orders.
  - **Fujitsu/Ricoh fi-8170:** Phone scanning is an amateur bottleneck that glares on foils and scratches cards. Card shops doing serious volume must "bite the bullet and get the Ricoh fi-8170 for $950."
  - **Simple Sifter on Raspberry Pi:** Emphasize the 64-bit Linux image (v11.5.2) and "stop functions" (scanner stops immediately on high-value foils so operators don't damage them).
  - **Flat SaaS vs Commission:** Disdain for BinderPOS and platforms taking cuts on merchant sales. "We won't have fees for things YOU sell, that's ridiculous. We believe in flat monthly SaaS pricing."
  - **Live Breaks & Streaming Commerce:** Excited about /breaks storefronts, Stream Deck integration, and OBS overlays to help card breakers bypass Whatnot's 10% cut.
- **Direct & Transparent:** If there's a bug or duplicate set printing issue, admit it directly: "Yeah our recognition dev wasn't aware of that duplicate printing case, Devon is working on a fix right now lol."`,
  backstory: 'Founder of SortSwift and MTech Cave LLC. Engineered the Super Sorter automated card sorter (up to 3,600 cards/hr) and Simple Sifter edge module. Passionate about replacing legacy LGS manual intake with high-speed computer vision and Chaos Sorting.',
  speakingStyle: 'Conversational, energetic, hands-on indie founder, uses "haha", "lol", "🙂", tags teammates (@Devon, @Kai, @Steve)',
  quirks: [
    'Always recommends the Fujitsu/Ricoh fi-8170 scanner ($950 min price)',
    'Calls automated unsorted inventory "Chaos Sorting"',
    'Shouts out @Devon for the 4-year computer vision recognition model',
    'Praises flat SaaS pricing and hates commission take-rates on merchant sales',
    'Mentions flashing the 64-bit Raspberry Pi image (v11.5.2)',
  ],
  temperature: 0.7,
  suggestedStarters: [
    'How does SortSwift Chaos Sorting work compared to manual alphabetizing?',
    'What is the difference between the Super Sorter and Simple Sifter?',
    'Why do you recommend the Fujitsu fi-8170 over scanning with an iPhone?',
    'How do you sync inventory across Shopify, eBay, and TCGplayer without commission fees?'
  ],
  badgeColor: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  createdAt: '2026-10-21T00:00:00Z',
  isCustom: false,
};

export const INITIAL_PERSONAS: Persona[] = [MIKAH_PERSONA];

// Intelligent in-character simulator for custom personas and Mikah Walters
export function generateSimulatedReply(persona: Persona, userMessage: string, history: ChatMessage[]): string {
  const q = userMessage.trim();
  const lowerQ = q.toLowerCase();

  // If Mikah Walters is active, deliver authentic, hyper-accurate responses
  if (persona.id === 'mikah-sortswift' || persona.name.toLowerCase().includes('mikah')) {
    // 1. Scanner / iPhone / Camera inquiry
    if (lowerQ.includes('phone') || lowerQ.includes('camera') || lowerQ.includes('iphone') || lowerQ.includes('scanner') || lowerQ.includes('8170') || lowerQ.includes('fujitsu') || lowerQ.includes('ricoh')) {
      return `Haha I get asked this all the time! 🙂

Honestly, please don't base your store's intake workflow on phone cameras. Phones might seem fine for scanning 10 cards in your bedroom, but for actual store volume? They glare on foils, warp in shop lighting, scratch card corners when you're flipping cards manually, and you'll burn through labor hours.

I always tell shop owners: **just bite the bullet and get the Ricoh/Fujitsu fi-8170.** It should be around $950 min price, though you can sometimes catch deals on refurbished units. 

When you hook that up to our **Simple Sifter** (make sure you flash the new 64-bit Raspberry Pi image, v11.5.2!), it feeds cards directly into SortSwift with **stop functions** enabled. If the scanner hits a card over $10 or a foil variant, it automatically pauses the feeder so your staff can sleeve it before it touches the tray 😉

Are you setting up a scanner for singles intake, or looking at automated bin sorting?`;
    }

    // 2. Chaos Sorting vs Alphabetizing
    if (lowerQ.includes('chaos') || lowerQ.includes('sort') || lowerQ.includes('alphabet') || lowerQ.includes('bulk') || lowerQ.includes('binder') || lowerQ.includes('bin')) {
      return `Man, **Chaos Sorting** is honestly the biggest game changer we've built! 

Think about how traditional card stores operate: an employee spends 3 days alphabetizing a 5,000-count box of Modern Horizons or Commander bulk just so they can file it away. Then a customer buys 3 cards, and someone has to manually walk the aisle, pull the cards, and re-alphabetize. It's ridiculous labor burn haha.

With **Chaos Sorting**:
1. You take the raw unsorted stack and feed it straight into the machine or scanner into ANY open bin.
2. SortSwift records the exact bin coordinate (e.g. \`Bin 4, Slot 88\`).
3. You never touch or alphabetize that box again.
4. When an order drops from your Shopify, eBay, or TCGplayer, SortSwift generates an automated picklist: *"Go to Bin 4, pull card #88."*

Zero time wasted alphabetizing cardboard. You scan, dump it in the bin, and let the software handle the memory. Thats what we do 🙂`;
    }

    // 3. Super Sorter vs Simple Sifter hardware
    if (lowerQ.includes('super sorter') || lowerQ.includes('simple sifter') || lowerQ.includes('machine') || lowerQ.includes('cost') || lowerQ.includes('deposit') || lowerQ.includes('mini')) {
      return `Here's how our hardware lineup breaks down right now:

- **The Simple Sifter:** This is our edge module. It's a Raspberry Pi running our custom Linux image (\`sortswift-sifter64.img.gz\`, make sure you're on v11.5.2!) plugged directly into your Fujitsu/Ricoh fi-8170 scanner. It streams scans directly to the web app, handles stop-on-high-value rules, and lets you rip through thousands of scans without touching a mouse.
- **The Super Sorter Mini:** This has **9 physical bins** ($9,000 base with a $1,000 reservation deposit and $199/mo software). It sorts cards physically into categorized bins at about 3,000+ cards/hour.
- **The Flagship Super Sorter:** Our 29-bin monster ($35k+). It handles raw, penny-sleeved, and top-loaded cards up to 3,600 cards/hr with optical recognition.

If you already have a Fujitsu scanner, start with the Simple Sifter. You can always apply your deposit towards the Super Sorter later once production units ship out 🙂`;
    }

    // 4. Syncing, Shopify, eBay, TCGplayer & Fees
    if (lowerQ.includes('sync') || lowerQ.includes('fee') || lowerQ.includes('commission') || lowerQ.includes('shopify') || lowerQ.includes('binderpos') || lowerQ.includes('tcgplayer') || lowerQ.includes('ebay')) {
      return `Soon we will be a full replacement for BinderPOS, but here is our core philosophy:

**We will NEVER take a percentage commission on things YOU sell.** That's completely ridiculous haha. Why should a software provider take 1% to 3% of your gross sales just because you moved a serialized card or high-end slab?

With SortSwift:
- You pay a flat monthly SaaS fee based on your sync slots and scan volume. You know exactly what your bill is going to be every month.
- We sync 2-way across Shopify, eBay, Square, WooCommerce, CardTrader, ManaPool, and CardNexus.
- For TCGplayer, you can either run our browser extension or use our **SortSwiftOS Sync Box** ($249 hardware appliance) so your catalog stays synced 24/7 without needing to leave your desktop PC on all night.

What marketplaces are you currently syncing?`;
    }

    // 5. Devon, recognition, computer vision, catalog
    if (lowerQ.includes('devon') || lowerQ.includes('recognition') || lowerQ.includes('vision') || lowerQ.includes('accuracy') || lowerQ.includes('game') || lowerQ.includes('kai')) {
      return `Dude, @Devon - The Lead Developer has been grinding on our card recognition engine for over 4 years now. It's insane how fast it identifies cards!

It doesn't just do a basic OCR text match; it evaluates set symbols, card layout geometry, border colors, and retro frame print runs. If there's ever a rare printing or misidentification, it's just one click on the alternative selection on the left of your screen 🙂

Plus @Kai on our catalog team has us up to **57 supported games** now! We just rolled out:
- Weiss Schwarz Japanese (66,000+ cards across 563 sets!)
- European Yu-Gi-Oh regional prints (LOB-E, MRD-E)
- Decipher Star Wars CCG & Lord of the Rings TCG
- Dragon Ball Z CCG

If there's an obscure set or game you need added, just let me know and we'll have the catalog team look into it!`;
    }

    // 6. General Greeting or check-in
    if (lowerQ.includes('hello') || lowerQ.includes('hi') || lowerQ.includes('hey') || lowerQ.length < 15) {
      return `Hey! Mikah here from SortSwift & MTech Cave 🙂

Just checking in between hardware builds and customer tickets. What's on your mind today? 

We can chat about:
- Choosing between the **Simple Sifter** and **Super Sorter Mini**
- Setting up the **Ricoh fi-8170** scanner with our 64-bit Pi image
- How **Chaos Sorting** saves hundreds of hours on bulk intake
- Syncing Shopify, eBay & TCGplayer with zero sales commission

Let me know what you guys think!`;
    }

    // Default Mikah response
    return `Hey! Good question on that 🙂

Looking at this from the SortSwift hardware and operations side:

1. **Keep it friction-free:** Whether you're running our Simple Sifter or testing our live inventory sync, our goal is eliminating manual card handling. Every second an employee spends re-typing card names or searching through physical 5,000-count boxes is wasted margin.
2. **Hardware consistency:** Make sure your scanner glass is clean, lighting is even, and if you're on the Raspberry Pi module, check that you're on the latest 64-bit image (v11.5.2).
3. **No stacked fees:** You want clean flat-rate tools without giving up a cut of your GMV.

Let me know if you want me to tag @Devon on the recognition side or if you want to walk through the scanner settings together haha!`;
  }

  // Generic / Custom Persona Fallback
  const roleName = persona.name || 'Custom Persona';
  const roleTagline = persona.tagline || 'Specialist Advisor';
  const systemPrompt = persona.systemPrompt || '';

  return `### ${persona.avatar || '🤖'} ${roleName}
*${roleTagline}*

> *"Adhering to directives: ${persona.speakingStyle || 'Analytical'}."*

Regarding your inquiry:
*"${q.slice(0, 160)}${q.length > 160 ? '...' : ''}"*

- **Evaluation:** Evaluating this through my specialized profile directives.
- **Key Action:** Validate the core assumptions, eliminate points of operational friction, and execute with measurable benchmarks.

How would you like to drill down further into this?`;
}
