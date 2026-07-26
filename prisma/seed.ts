/* eslint-disable @typescript-eslint/no-unused-vars */
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcryptjs";

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

// ─── Helpers ────────────────────────────────────────────────────────────

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const GRADIENTS = [
  "bg-gradient-to-br from-blue-500 to-cyan-400",
  "bg-gradient-to-br from-amber-500 to-orange-400",
  "bg-gradient-to-br from-emerald-500 to-teal-400",
  "bg-gradient-to-br from-violet-500 to-purple-400",
  "bg-gradient-to-br from-rose-500 to-pink-400",
  "bg-gradient-to-br from-indigo-500 to-blue-400",
];

// ─── Market data (mirrors src/lib/data.ts) ──────────────────────────────

type Quote = {
  category: string;
  symbol: string;
  name: string;
  price: number;
  change: number;
  volume?: string;
  dayRangeLow?: number;
  dayRangeHigh?: number;
  cagr3y?: number;
  lotSize?: string;
  unit?: string;
};

const QUOTES: Quote[] = [
  // Indices
  { category: "index", symbol: "NIFTY 50", name: "Nifty 50 Index", price: 24180.45, change: 0.42, dayRangeLow: 24080, dayRangeHigh: 24210 },
  { category: "index", symbol: "SENSEX", name: "BSE Sensex", price: 79640.18, change: 0.38, dayRangeLow: 79320, dayRangeHigh: 79720 },
  { category: "index", symbol: "BANK NIFTY", name: "Nifty Bank Index", price: 52210.7, change: -0.21, dayRangeLow: 52010, dayRangeHigh: 52410 },
  { category: "index", symbol: "NIFTY IT", name: "Nifty IT Index", price: 38950.05, change: 1.12, dayRangeLow: 38610, dayRangeHigh: 39020 },
  { category: "index", symbol: "NIFTY MIDCAP", name: "Nifty Midcap 100", price: 56720.3, change: 0.66, dayRangeLow: 56420, dayRangeHigh: 56810 },
  // Stocks
  { category: "stock", symbol: "RELIANCE", name: "Reliance Industries", price: 2945.6, change: 1.24, volume: "8.2M" },
  { category: "stock", symbol: "TCS", name: "Tata Consultancy Services", price: 3890.1, change: 0.85, volume: "2.1M" },
  { category: "stock", symbol: "HDFCBANK", name: "HDFC Bank", price: 1684.25, change: -0.34, volume: "12.5M" },
  { category: "stock", symbol: "INFY", name: "Infosys", price: 1572.4, change: 1.56, volume: "5.8M" },
  { category: "stock", symbol: "ICICIBANK", name: "ICICI Bank", price: 1210.75, change: 0.62, volume: "9.3M" },
  { category: "stock", symbol: "ADANIENT", name: "Adani Enterprises", price: 2415.3, change: 2.18, volume: "3.4M" },
  { category: "stock", symbol: "SBIN", name: "State Bank of India", price: 824.5, change: -0.78, volume: "15.1M" },
  { category: "stock", symbol: "BHARTIARTL", name: "Bharti Airtel", price: 1585.9, change: 0.95, volume: "4.7M" },
  { category: "stock", symbol: "ITC", name: "ITC Limited", price: 462.15, change: 0.18, volume: "11.2M" },
  { category: "stock", symbol: "LT", name: "Larsen & Toubro", price: 3620.8, change: 1.42, volume: "1.9M" },
  // Mutual Funds
  { category: "mutual_fund", symbol: "PARAG PARIKH", name: "Parag Parikh Flexi Cap Fund", price: 84.32, change: 0.78, cagr3y: 21.4 },
  { category: "mutual_fund", symbol: "SBI SMALL CAP", name: "SBI Small Cap Fund", price: 172.45, change: 1.32, cagr3y: 27.8 },
  { category: "mutual_fund", symbol: "MIRAE ASSET", name: "Mirae Asset Large Cap Fund", price: 98.12, change: 0.45, cagr3y: 17.2 },
  { category: "mutual_fund", symbol: "AXIS BLUECHIP", name: "Axis Bluechip Fund", price: 58.74, change: -0.21, cagr3y: 14.9 },
  { category: "mutual_fund", symbol: "HDFC MIDCAP", name: "HDFC Mid-Cap Opportunities", price: 172.3, change: 1.05, cagr3y: 26.1 },
  { category: "mutual_fund", symbol: "KOTAK EMERGING", name: "Kotak Emerging Equity Fund", price: 112.85, change: 0.92, cagr3y: 24.3 },
  // IPO
  { category: "ipo", symbol: "NOVA AGRI", name: "Nova Agritech Ltd", price: 142, change: 28.4, lotSize: "105 shares" },
  { category: "ipo", symbol: "ELECTROFORCE", name: "Electroforce India Ltd", price: 98, change: 15.2, lotSize: "1200 shares" },
  { category: "ipo", symbol: "GLOBAL HEALTH", name: "Global Health Ltd", price: 368, change: 22.1, lotSize: "40 shares" },
  { category: "ipo", symbol: "BHARAT HIGHWAYS", name: "Bharat Highways InvIT", price: 105, change: 4.8, lotSize: "140 shares" },
  { category: "ipo", symbol: "ENNTEC SERVICES", name: "Enntec Services Ltd", price: 134, change: 18.6, lotSize: "1000 shares" },
  // Commodities
  { category: "commodity", symbol: "GOLD", name: "Gold (10 g)", price: 72450, change: 0.62, unit: "MCX" },
  { category: "commodity", symbol: "SILVER", name: "Silver (1 kg)", price: 92300, change: 1.18, unit: "MCX" },
  { category: "commodity", symbol: "CRUDE OIL", name: "Crude Oil (bbl)", price: 6540, change: -0.84, unit: "MCX" },
  { category: "commodity", symbol: "NATURAL GAS", name: "Natural Gas", price: 182.5, change: 2.34, unit: "MCX" },
  { category: "commodity", symbol: "COPPER", name: "Copper", price: 842.6, change: 0.45, unit: "MCX" },
  { category: "commodity", symbol: "COTTON", name: "Cotton Candy", price: 58200, change: -0.32, unit: "MCX" },
  // Crypto
  { category: "crypto", symbol: "BTC", name: "Bitcoin", price: 6245000, change: 2.84, volume: "₹1.2L Cr" },
  { category: "crypto", symbol: "ETH", name: "Ethereum", price: 318400, change: 1.92, volume: "₹48,000 Cr" },
  { category: "crypto", symbol: "BNB", name: "Binance Coin", price: 52180, change: -0.74, volume: "₹8,200 Cr" },
  { category: "crypto", symbol: "SOL", name: "Solana", price: 14820, change: 4.18, volume: "₹12,500 Cr" },
  { category: "crypto", symbol: "XRP", name: "Ripple", price: 48.6, change: 0.85, volume: "₹6,800 Cr" },
  { category: "crypto", symbol: "ADA", name: "Cardano", price: 42.3, change: -1.42, volume: "₹3,100 Cr" },
];

// ─── News categories + articles ─────────────────────────────────────────

const CATEGORIES: { slug: string; name: string; description: string }[] = [
  { slug: "india", name: "Economy", description: "Macro and economic news shaping India's growth story." },
  { slug: "personal-finance", name: "Personal Finance", description: "Money management, tax, and investing guidance." },
  { slug: "technology", name: "Technology", description: "Tech, startups, and digital India coverage." },
  { slug: "gujarat", name: "Gujarat", description: "Business and economy news from Gujarat." },
  { slug: "national", name: "National", description: "National policy, government, and politics." },
  { slug: "global", name: "Global", description: "Global markets and geopolitical developments." },
  { slug: "entertainment", name: "Entertainment", description: "Film, music, streaming, and live events." },
];

type ArticleSeed = { title: string; image: string };
const ARTICLES: Record<string, ArticleSeed[]> = {
  india: [
    { title: "RBI Holds Repo Rate Steady at 6.5% Amid Inflation Concerns", image: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=640&h=360&fit=crop&auto=format&q=80" },
    { title: "India's GDP Growth Projected at 7.2% for FY 2026", image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=640&h=360&fit=crop&auto=format&q=80" },
    { title: "GST Collections Hit Record ₹2.1 Lakh Crore in June Quarter", image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=640&h=360&fit=crop&auto=format&q=80" },
    { title: "Manufacturing PMI Rises to 58.5 as Factory Output Expands", image: "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=640&h=360&fit=crop&auto=format&q=80" },
    { title: "Foreign Portfolio Investors Pump ₹45,000 Cr Into Indian Equities", image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=640&h=360&fit=crop&auto=format&q=80" },
    { title: "Government Announces ₹10 Lakh Cr Infrastructure Push", image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=640&h=360&fit=crop&auto=format&q=80" },
  ],
  "personal-finance": [
    { title: "How New Tax Regime Changes Impact Salaried Taxpayers in FY26", image: "https://images.unsplash.com/photo-1554224155-1696413565d3?w=640&h=360&fit=crop&auto=format&q=80" },
    { title: "SIP vs Lump Sum: Where to Invest During Market Highs", image: "https://images.unsplash.com/photo-1579621970795-87facc2f976d?w=640&h=360&fit=crop&auto=format&q=80" },
    { title: "Credit Card Debt at All-Time High: RBI Issues Fresh Warning", image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=640&h=360&fit=crop&auto=format&q=80" },
    { title: "5 High-Yield Savings Account Options in July 2026", image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=640&h=360&fit=crop&auto=format&q=80" },
    { title: "Why Term Insurance Should Be Your First Financial Decision", image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=640&h=360&fit=crop&auto=format&q=80" },
    { title: "Step-by-Step Guide to Filing ITR for Capital Gains This Year", image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=640&h=360&fit=crop&auto=format&q=80" },
  ],
  technology: [
    { title: "India's Semiconductor Mission: First Fab Plant Operational in Gujarat", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=640&h=360&fit=crop&auto=format&q=80" },
    { title: "Reliance Jio Launches 6G Pilot in Mumbai and Ahmedabad", image: "https://images.unsplash.com/photo-1591696205602-2f950c417cb9?w=640&h=360&fit=crop&auto=format&q=80" },
    { title: "TCS Reports 12% Jump in Net Profit on AI Demand", image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=640&h=360&fit=crop&auto=format&q=80" },
    { title: "Startups Raise $4.2 Billion in Q2 2026 Funding Round", image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=640&h=360&fit=crop&auto=format&q=80" },
    { title: "Government Finalizes Digital Personal Data Protection Rules", image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=640&h=360&fit=crop&auto=format&q=80" },
    { title: "India Crosses 900 Million Internet Users, Says TRAI Report", image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=640&h=360&fit=crop&auto=format&q=80" },
  ],
  gujarat: [
    { title: "Surat Becomes India's Fastest-Growing City for New Startups", image: "https://images.unsplash.com/photo-1577234285295-5b9f8263c3d3?w=640&h=360&fit=crop&auto=format&q=80" },
    { title: "Vibrant Gujarat 2026: ₹35 Lakh Crore in MoUs Signed", image: "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=640&h=360&fit=crop&auto=format&q=80" },
    { title: "Ahmedabad Real Estate Sees 28% Price Jump in Premium Segment", image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=640&h=360&fit=crop&auto=format&q=80" },
    { title: "GIFT City Attracts 50 New Financial Firms This Quarter", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=640&h=360&fit=crop&auto=format&q=80" },
    { title: "Gujarat's Diamond Polishing Industry Bounces Back Post Slowdown", image: "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=640&h=360&fit=crop&auto=format&q=80" },
    { title: "Tata Motors Sanand Plant Hits Record EV Production Milestone", image: "https://images.unsplash.com/photo-1593941707882-a5bba14938be?w=640&h=360&fit=crop&auto=format&q=80" },
  ],
  national: [
    { title: "Parliament Passes Key Banking Amendment Bill Unanimously", image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=640&h=360&fit=crop&auto=format&q=80" },
    { title: "Monsoon Session: Centre to Table New Competition Law", image: "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=640&h=360&fit=crop&auto=format&q=80" },
    { title: "Supreme Court Upholds Constitutional Validity of Digital Tax", image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=640&h=360&fit=crop&auto=format&q=80" },
    { title: "Cabinet Approves National Manufacturing Mission", image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=640&h=360&fit=crop&auto=format&q=80" },
    { title: "India Successfully Test-Fires Agni-V Missile with New Tech", image: "https://images.unsplash.com/photo-1551845728-6820a30c64ab?w=640&h=360&fit=crop&auto=format&q=80" },
    { title: "PM Inaugurates 12 New Vande Bharat Express Trains Nationwide", image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=640&h=360&fit=crop&auto=format&q=80" },
  ],
  global: [
    { title: "US Federal Reserve Signals Possible Rate Cut in September", image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=640&h=360&fit=crop&auto=format&q=80" },
    { title: "Oil Prices Surge as OPEC+ Extends Production Cuts", image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=640&h=360&fit=crop&auto=format&q=80" },
    { title: "China's Economic Slowdown Deepens: Q2 Growth at 4.7%", image: "https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=640&h=360&fit=crop&auto=format&q=80" },
    { title: "EU Implements Landmark AI Act, Sets Global Benchmark", image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=640&h=360&fit=crop&auto=format&q=80" },
    { title: "Japan Intervenes in Currency Markets as Yen Hits 38-Year Low", image: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=640&h=360&fit=crop&auto=format&q=80" },
    { title: "Global Tech Stocks Rally on Strong Earnings from AI Giants", image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=640&h=360&fit=crop&auto=format&q=80" },
  ],
  entertainment: [
    { title: "Box Office Record: Gujarati Film Crosses ₹100 Cr Milestone", image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=640&h=360&fit=crop&auto=format&q=80" },
    { title: "Streaming Wars: New Regional Platforms Launch This Quarter", image: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=640&h=360&fit=crop&auto=format&q=80" },
    { title: "Music Industry Revenue Hits ₹3,000 Cr in FY26", image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=640&h=360&fit=crop&auto=format&q=80" },
    { title: "Bollywood-OTT Crossover Deals Reach All-Time High", image: "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=640&h=360&fit=crop&auto=format&q=80" },
    { title: "Gujarat International Film Festival Announces 2026 Lineup", image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=640&h=360&fit=crop&auto=format&q=80" },
    { title: "Live Events Sector Bounces Back with Record Concert Bookings", image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=640&h=360&fit=crop&auto=format&q=80" },
  ],
};

const AUTHORS = ["Karan Mehta", "Priya Shah", "Rohan Desai", "Anjali Patel"];
const DATES = ["Jul 18, 2026", "Jul 17, 2026", "Jul 16, 2026"];

// ─── Jobs ────────────────────────────────────────────────────────────────

const JOBS = [
  { title: "Anchor Cum Producer", description: "Lead daily business-news programming and produce segments from concept to air. On-camera presence required.", experience: "3-5 years", salary: "Competitive & Best in Industry", location: "Ahmedabad", type: "Full-time", mode: "On-site" },
  { title: "News Reporter", description: "Break original business stories across markets, companies, and policy. Strong sourcing and a fast turnaround required.", experience: "2-4 years", salary: "Competitive & Best in Industry", location: "Ahmedabad", type: "Full-time", mode: "On-site" },
  { title: "Copy Editor / Sub Editor", description: "Sharpen copy, fact-check, and write crisp headlines for digital and broadcast. AP style and SEO awareness a plus.", experience: "2-5 years", salary: "Competitive & Best in Industry", location: "Ahmedabad", type: "Full-time", mode: "On-site" },
  { title: "Graphic Designer / Video Editor", description: "Create on-air graphics, motion design, and short-form video for digital. Proficiency in Premiere/After Effects.", experience: "1-4 years", salary: "Competitive & Best in Industry", location: "Ahmedabad", type: "Full-time", mode: "On-site" },
  { title: "Social Media Manager", description: "Own KuberaNow's social presence across X, Instagram, LinkedIn, and YouTube. Analytics-driven growth mindset.", experience: "2-5 years", salary: "Competitive & Best in Industry", location: "Ahmedabad", type: "Full-time", mode: "On-site" },
];

// ─── CMS pages (About, Advertise, Legal) ─────────────────────────────────

const PAGES = [
  {
    slug: "about-us",
    title: "About KuberaNow",
    subtitle: "Independent business and financial journalism for India's next decade of growth.",
    sections: [
      { type: "heading", value: "Our Story", level: 2 },
      { type: "paragraph", value: "KuberaNow is an independent digital business news platform covering India's markets, economy, and the stories shaping the country's next chapter of wealth creation. We are built for India's investors, executives, entrepreneurs, and policymakers — and especially for the rising Gujarati business community whose capital and culture sit at the heart of this story." },
      { type: "paragraph", value: "Our newsroom combines deep market expertise with modern, data-led reporting. We publish verified, regional-language-first journalism with the speed of a wire service and the depth of a magazine." },
      { type: "heading", value: "What We Cover", level: 2 },
      { type: "paragraph", value: "Live markets (stocks, MF, IPO, commodities, crypto), macro and policy news, personal finance guidance, and the technology and Gujarat-economy stories that move India forward." },
      { type: "heading", value: "Our Mission", level: 2 },
      { type: "paragraph", value: "To make world-class financial journalism accessible to every Indian — in their language, on their device, and at the speed of the markets they follow." },
    ],
  },
  {
    slug: "advertise",
    title: "Advertise With KuberaNow",
    subtitle: "Reach India's most engaged business audience.",
    sections: [
      { type: "heading", value: "Why KuberaNow", level: 2 },
      { type: "paragraph", value: "Our audience is high-intent: active investors, business owners, and decision-makers across India. We offer brand-safe, contextually relevant placements across our market, news, and tools sections." },
      { type: "heading", value: "Ad Formats", level: 2 },
      { type: "list", items: ["Display banners (leaderboard, rectangle, sidebar)", "Sponsored content and branded articles", "Newsletter sponsorships", "Section takeovers (Markets / News / Tools)"] },
      { type: "heading", value: "Get In Touch", level: 2 },
      { type: "paragraph", value: "Contact our partnerships team at connect@kuberanow.com or +91 93288 88771 for a media kit and rate card." },
    ],
  },
  {
    slug: "disclaimer",
    title: "Disclaimer",
    sections: [
      { type: "paragraph", value: "The content on KuberaNow is for informational and educational purposes only and does not constitute investment, legal, tax, or financial advice." },
      { type: "heading", value: "1. No Investment Advice", level: 3 },
      { type: "paragraph", value: "Nothing published on this website should be construed as a recommendation to buy, sell, or hold any security or financial product. All investment decisions are made at your own risk." },
      { type: "heading", value: "2. Market Data", level: 3 },
      { type: "paragraph", value: "Market data shown is for demonstration purposes and may be delayed. Always verify with official sources before transacting." },
      { type: "heading", value: "3. Calculators", level: 3 },
      { type: "paragraph", value: "Our calculators are for illustration only and do not account for fees, taxes, or market-specific returns. Actual results will vary." },
      { type: "heading", value: "4. External Links", level: 3 },
      { type: "paragraph", value: "KuberaNow is not responsible for the content or privacy practices of third-party sites linked from our pages." },
    ],
  },
  {
    slug: "privacy-policy",
    title: "Privacy Policy",
    sections: [
      { type: "paragraph", value: "This Privacy Policy describes how KuberaNow collects, uses, and protects your information when you use our website." },
      { type: "heading", value: "1. Information We Collect", level: 3 },
      { type: "paragraph", value: "We collect information you provide directly (such as when you register or contact us) and usage data collected automatically via cookies and analytics." },
      { type: "heading", value: "2. How We Use Information", level: 3 },
      { type: "paragraph", value: "To deliver and improve our services, respond to inquiries, and send relevant updates. We do not sell your personal information." },
      { type: "heading", value: "3. Data Security", level: 3 },
      { type: "paragraph", value: "We implement industry-standard safeguards to protect your data, but no method of transmission over the Internet is fully secure." },
      { type: "heading", value: "4. Your Rights", level: 3 },
      { type: "paragraph", value: "You may request access to, correction of, or deletion of your personal data by contacting us at info@kuberanow.com." },
    ],
  },
  {
    slug: "terms-of-use",
    title: "Terms of Use",
    sections: [
      { type: "paragraph", value: "By accessing KuberaNow you agree to these Terms of Use. Please read them carefully." },
      { type: "heading", value: "1. Acceptance of Terms", level: 3 },
      { type: "paragraph", value: "Your use of this website constitutes acceptance of these terms and our Privacy Policy." },
      { type: "heading", value: "2. Intellectual Property", level: 3 },
      { type: "paragraph", value: "All content on KuberaNow — including articles, logos, and design — is owned by K Globes Digital Media Private Limited and protected by copyright laws." },
      { type: "heading", value: "3. User Conduct", level: 3 },
      { type: "paragraph", value: "You agree not to misuse the site, attempt to gain unauthorized access, or reproduce content without permission." },
      { type: "heading", value: "4. Limitation of Liability", level: 3 },
      { type: "paragraph", value: "KuberaNow is not liable for any damages arising from the use of, or inability to use, this website." },
    ],
  },
];

// ─── Site settings ───────────────────────────────────────────────────────

const SITE_SETTINGS = {
  emails: ["editor@kuberanow.com", "connect@kuberanow.com", "it@kuberanow.com", "info@kuberanow.com"],
  phones: [
    { label: "News Desk", value: "+91 93288 88771", href: "https://wa.me/919328888771" },
    { label: "Sales", value: "+91 8160567228", href: "https://wa.me/918160567228" },
    { label: "Tech Support", value: "+91 99042 77760", href: "https://wa.me/919904277760" },
  ],
  address: "KuberaNow, K Globes Digital Media Pvt. Ltd., Ahmedabad, Gujarat, India",
  grievanceOfficer: "Mitesh Bhavsar",
  socials: [
    { title: "Instagram", href: "https://instagram.com/kuberanow", src: "/insta.svg" },
    { title: "Facebook", href: "https://facebook.com/kuberanow", src: "/fb.svg" },
    { title: "X", href: "https://x.com/kuberanow", src: "/x.svg" },
    { title: "YouTube", href: "https://youtube.com/@kuberanow", src: "/yt.svg" },
    { title: "LinkedIn", href: "https://linkedin.com/company/kuberanow", src: "/linkedin.svg" },
  ],
};

// ─── Main ────────────────────────────────────────────────────────────────

async function main() {
  console.log("🌱 Seeding…");

  // Wipe (order matters for FK constraints)
  await prisma.savedCalculation.deleteMany();
  await prisma.contactSubmission.deleteMany();
  await prisma.application.deleteMany();
  await prisma.job.deleteMany();
  await prisma.article.deleteMany();
  await prisma.category.deleteMany();
  await prisma.marketQuote.deleteMany();
  await prisma.page.deleteMany();
  await prisma.siteSettings.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  // Users
  const passwordHash = await bcrypt.hash("admin123", 12);
  const editorHash = await bcrypt.hash("editor123", 12);
  const readerHash = await bcrypt.hash("reader123", 12);

  await prisma.user.createMany({
    data: [
      { email: "admin@kuberanow.com", name: "Admin User", role: "admin", passwordHash },
      { email: "editor@kuberanow.com", name: "Editor User", role: "editor", passwordHash: editorHash },
      { email: "reader@kuberanow.com", name: "Reader User", role: "reader", passwordHash: readerHash },
    ],
  });

  // Categories
  for (const c of CATEGORIES) {
    await prisma.category.create({ data: c });
  }

  // Articles
  const authors = AUTHORS;
  const dates = DATES;
  for (const [catSlug, seeds] of Object.entries(ARTICLES)) {
    const category = await prisma.category.findUnique({ where: { slug: catSlug } });
    if (!category) continue;
    for (const [i, seed] of seeds.entries()) {
      await prisma.article.create({
        data: {
          slug: slugify(seed.title),
          title: seed.title,
          excerpt:
            "In-depth analysis and breaking coverage of this story — what it means for Gujarati investors, businesses, and the broader Indian economy. Our editorial team brings verified, regional-language-first reporting.",
          body:
            "In-depth analysis and breaking coverage of this story — what it means for Gujarati investors, businesses, and the broader Indian economy. Our editorial team brings verified, regional-language-first reporting.\n\nThe full article will expand on the headline with on-the-ground sourcing, expert commentary, and the data our readers expect. We will continue to update this piece as the story develops.",
          imageUrl: seed.image,
          categoryId: category.id,
          author: authors[i % authors.length],
          status: "published",
        },
      });
    }
  }

  // Market quotes
  for (const [i, q] of QUOTES.entries()) {
    await prisma.marketQuote.create({
      data: {
        category: q.category,
        symbol: q.symbol,
        name: q.name,
        price: q.price,
        change: q.change,
        volume: q.volume,
        dayRangeLow: q.dayRangeLow,
        dayRangeHigh: q.dayRangeHigh,
        cagr3y: q.cagr3y,
        lotSize: q.lotSize,
        unit: q.unit,
        sortOrder: i,
      },
    });
  }

  // Jobs
  await prisma.job.createMany({ data: JOBS });

  // CMS pages
  for (const p of PAGES) {
    await prisma.page.create({
      data: {
        slug: p.slug,
        title: p.title,
        subtitle: p.subtitle ?? null,
        sections: JSON.stringify(p.sections),
      },
    });
  }

  // Site settings
  await prisma.siteSettings.create({
    data: { id: "singleton", data: JSON.stringify(SITE_SETTINGS) },
  });

  console.log("✅ Seed complete:");
  console.log("   Users:      admin / editor / reader @kuberanow.com (pw: <role>123)");
  console.log("   Articles:   42 across 7 categories");
  console.log("   Quotes:     38 across 6 asset classes");
  console.log("   Jobs:       5 openings");
  console.log("   Pages:      5 CMS pages");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
