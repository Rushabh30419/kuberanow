import type { MarketRow } from "@/components/ui/MarketTable";
import type { NewsArticle } from "@/components/ui/NewsGrid";

/* ============ MARKET DATA ============ */

export const INDICES: MarketRow[] = [
  { symbol: "NIFTY 50", name: "Nifty 50 Index", price: "24,180.45", change: 0.42, extra: { label: "Day Range", value: "24,080 – 24,210" } },
  { symbol: "SENSEX", name: "BSE Sensex", price: "79,640.18", change: 0.38, extra: { label: "Day Range", value: "79,320 – 79,720" } },
  { symbol: "BANK NIFTY", name: "Nifty Bank Index", price: "52,210.70", change: -0.21, extra: { label: "Day Range", value: "52,010 – 52,410" } },
  { symbol: "NIFTY IT", name: "Nifty IT Index", price: "38,950.05", change: 1.12, extra: { label: "Day Range", value: "38,610 – 39,020" } },
  { symbol: "NIFTY MIDCAP", name: "Nifty Midcap 100", price: "56,720.30", change: 0.66, extra: { label: "Day Range", value: "56,420 – 56,810" } },
];

export const STOCKS: MarketRow[] = [
  { symbol: "RELIANCE", name: "Reliance Industries", price: "₹2,945.60", change: 1.24, volume: "8.2M" },
  { symbol: "TCS", name: "Tata Consultancy Services", price: "₹3,890.10", change: 0.85, volume: "2.1M" },
  { symbol: "HDFCBANK", name: "HDFC Bank", price: "₹1,684.25", change: -0.34, volume: "12.5M" },
  { symbol: "INFY", name: "Infosys", price: "₹1,572.40", change: 1.56, volume: "5.8M" },
  { symbol: "ICICIBANK", name: "ICICI Bank", price: "₹1,210.75", change: 0.62, volume: "9.3M" },
  { symbol: "ADANIENT", name: "Adani Enterprises", price: "₹2,415.30", change: 2.18, volume: "3.4M" },
  { symbol: "SBIN", name: "State Bank of India", price: "₹824.50", change: -0.78, volume: "15.1M" },
  { symbol: "BHARTIARTL", name: "Bharti Airtel", price: "₹1,585.90", change: 0.95, volume: "4.7M" },
  { symbol: "ITC", name: "ITC Limited", price: "₹462.15", change: 0.18, volume: "11.2M" },
  { symbol: "LT", name: "Larsen & Toubro", price: "₹3,620.80", change: 1.42, volume: "1.9M" },
];

export const MUTUAL_FUNDS: MarketRow[] = [
  { symbol: "PARAG PARIKH", name: "Parag Parikh Flexi Cap Fund", price: "₹84.32", change: 0.78, extra: { label: "3Y CAGR", value: "21.4%" } },
  { symbol: "SBI SMALL CAP", name: "SBI Small Cap Fund", price: "₹172.45", change: 1.32, extra: { label: "3Y CAGR", value: "27.8%" } },
  { symbol: "MIRAE ASSET", name: "Mirae Asset Large Cap Fund", price: "₹98.12", change: 0.45, extra: { label: "3Y CAGR", value: "17.2%" } },
  { symbol: "AXIS BLUECHIP", name: "Axis Bluechip Fund", price: "₹58.74", change: -0.21, extra: { label: "3Y CAGR", value: "14.9%" } },
  { symbol: "HDFC MIDCAP", name: "HDFC Mid-Cap Opportunities", price: "₹172.30", change: 1.05, extra: { label: "3Y CAGR", value: "26.1%" } },
  { symbol: "KOTAK EMERGING", name: "Kotak Emerging Equity Fund", price: "₹112.85", change: 0.92, extra: { label: "3Y CAGR", value: "24.3%" } },
];

export const IPO_DATA: MarketRow[] = [
  { symbol: "NOVA AGRI", name: "Nova Agritech Ltd", price: "₹142", change: 28.4, extra: { label: "Lot Size", value: "105 shares" } },
  { symbol: "ELECTROFORCE", name: "Electroforce India Ltd", price: "₹98", change: 15.2, extra: { label: "Lot Size", value: "1200 shares" } },
  { symbol: "GLOBAL HEALTH", name: "Global Health Ltd", price: "₹368", change: 22.1, extra: { label: "Lot Size", value: "40 shares" } },
  { symbol: "BHARAT HIGHWAYS", name: "Bharat Highways InvIT", price: "₹105", change: 4.8, extra: { label: "Lot Size", value: "140 shares" } },
  { symbol: "ENNTEC SERVICES", name: "Enntec Services Ltd", price: "₹134", change: 18.6, extra: { label: "Lot Size", value: "1000 shares" } },
];

export const COMMODITIES: MarketRow[] = [
  { symbol: "GOLD", name: "Gold (10 g)", price: "₹72,450", change: 0.62, extra: { label: "Unit", value: "MCX" } },
  { symbol: "SILVER", name: "Silver (1 kg)", price: "₹92,300", change: 1.18, extra: { label: "Unit", value: "MCX" } },
  { symbol: "CRUDE OIL", name: "Crude Oil (bbl)", price: "₹6,540", change: -0.84, extra: { label: "Unit", value: "MCX" } },
  { symbol: "NATURAL GAS", name: "Natural Gas", price: "₹182.5", change: 2.34, extra: { label: "Unit", value: "MCX" } },
  { symbol: "COPPER", name: "Copper", price: "₹842.6", change: 0.45, extra: { label: "Unit", value: "MCX" } },
  { symbol: "COTTON", name: "Cotton Candy", price: "₹58,200", change: -0.32, extra: { label: "Unit", value: "MCX" } },
];

export const CRYPTO: MarketRow[] = [
  { symbol: "BTC", name: "Bitcoin", price: "₹62,45,000", change: 2.84, volume: "₹1.2L Cr" },
  { symbol: "ETH", name: "Ethereum", price: "₹3,18,400", change: 1.92, volume: "₹48,000 Cr" },
  { symbol: "BNB", name: "Binance Coin", price: "₹52,180", change: -0.74, volume: "₹8,200 Cr" },
  { symbol: "SOL", name: "Solana", price: "₹14,820", change: 4.18, volume: "₹12,500 Cr" },
  { symbol: "XRP", name: "Ripple", price: "₹48.6", change: 0.85, volume: "₹6,800 Cr" },
  { symbol: "ADA", name: "Cardano", price: "₹42.3", change: -1.42, volume: "₹3,100 Cr" },
];

/* ============ NEWS ARTICLES ============ */

const GRADIENTS = [
  "bg-gradient-to-br from-blue-500 to-cyan-400",
  "bg-gradient-to-br from-amber-500 to-orange-400",
  "bg-gradient-to-br from-emerald-500 to-teal-400",
  "bg-gradient-to-br from-violet-500 to-purple-400",
  "bg-gradient-to-br from-rose-500 to-pink-400",
  "bg-gradient-to-br from-indigo-500 to-blue-400",
];

function makeArticles(
  category: string,
  titles: string[]
): NewsArticle[] {
  return titles.map((title, i) => ({
    slug: title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, ""),
    title,
    excerpt:
      "In-depth analysis and breaking coverage of this story — what it means for Gujarati investors, businesses, and the broader Indian economy. Our editorial team brings verified, regional-language-first reporting.",
    category,
    author: ["Karan Mehta", "Priya Shah", "Rohan Desai", "Anjali Patel"][i % 4],
    date: ["Jul 18, 2026", "Jul 17, 2026", "Jul 16, 2026"][i % 3],
    readTime: `${3 + (i % 5)} min read`,
    gradient: GRADIENTS[i % GRADIENTS.length],
  }));
}

export const NEWS: Record<string, NewsArticle[]> = {
  india: makeArticles("Economy", [
    "RBI Holds Repo Rate Steady at 6.5% Amid Inflation Concerns",
    "India's GDP Growth Projected at 7.2% for FY 2026",
    "GST Collections Hit Record ₹2.1 Lakh Crore in June Quarter",
    "Manufacturing PMI Rises to 58.5 as Factory Output Expands",
    "Foreign Portfolio Investors Pump ₹45,000 Cr Into Indian Equities",
    "Government Announces ₹10 Lakh Cr Infrastructure Push",
  ]),
  "personal-finance": makeArticles("Personal Finance", [
    "How New Tax Regime Changes Impact Salaried Taxpayers in FY26",
    "SIP vs Lump Sum: Where to Invest During Market Highs",
    "Credit Card Debt at All-Time High: RBI Issues Fresh Warning",
    "5 High-Yield Savings Account Options in July 2026",
    "Why Term Insurance Should Be Your First Financial Decision",
    "Step-by-Step Guide to Filing ITR for Capital Gains This Year",
  ]),
  technology: makeArticles("Technology", [
    "India's Semiconductor Mission: First Fab Plant Operational in Gujarat",
    "Reliance Jio Launches 6G Pilot in Mumbai and Ahmedabad",
    "TCS Reports 12% Jump in Net Profit on AI Demand",
    "Startups Raise $4.2 Billion in Q2 2026 Funding Round",
    "Government Finalizes Digital Personal Data Protection Rules",
    "India Crosses 900 Million Internet Users, Says TRAI Report",
  ]),
  gujarat: makeArticles("Gujarat", [
    "Surat Becomes India's Fastest-Growing City for New Startups",
    "Vibrant Gujarat 2026: ₹35 Lakh Crore in MoUs Signed",
    "Ahmedabad Real Estate Sees 28% Price Jump in Premium Segment",
    "GIFT City Attracts 50 New Financial Firms This Quarter",
    "Gujarat's Diamond Polishing Industry Bounces Back Post Slowdown",
    "Tata Motors Sanand Plant Hits Record EV Production Milestone",
  ]),
  national: makeArticles("National", [
    "Parliament Passes Key Banking Amendment Bill Unanimously",
    "Monsoon Session: Centre to Table New Competition Law",
    "Supreme Court Upholds Constitutional Validity of Digital Tax",
    "Cabinet Approves National Manufacturing Mission",
    "India Successfully Test-Fires Agni-V Missile with New Tech",
    "PM Inaugurates 12 New Vande Bharat Express Trains Nationwide",
  ]),
  global: makeArticles("Global", [
    "US Federal Reserve Signals Possible Rate Cut in September",
    "Oil Prices Surge as OPEC+ Extends Production Cuts",
    "China's Economic Slowdown Deepens: Q2 Growth at 4.7%",
    "EU Implements Landmark AI Act, Sets Global Benchmark",
    "Japan Intervenes in Currency Markets as Yen Hits 38-Year Low",
    "Global Tech Stocks Rally on Strong Earnings from AI Giants",
  ]),
  entertainment: makeArticles("Entertainment", [
    "Box Office Record: Gujarati Film Crosses ₹100 Cr Milestone",
    "Streaming Wars: New Regional Platforms Launch This Quarter",
    "Music Industry Revenue Hits ₹3,000 Cr in FY26",
    "Bollywood-OTT Crossover Deals Reach All-Time High",
    "Gujarat International Film Festival Announces 2026 Lineup",
    "Live Events Sector Bounces Back with Record Concert Bookings",
  ]),
};
