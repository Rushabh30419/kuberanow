// Shared domain types — used by both the UI components and the data-access layer.
// Keeping these separate from the Prisma-generated types lets the UI stay
// decoupled from the database schema.

export type UserRole = "admin" | "editor" | "reader";

export type MarketCategory =
  | "index"
  | "stock"
  | "mutual_fund"
  | "ipo"
  | "commodity"
  | "crypto";

/** Display-shape market row (matches MarketTable component contract). */
export type MarketRow = {
  symbol: string;
  name: string;
  price: string; // pre-formatted with currency symbol
  change: number; // percentage
  volume?: string;
  extra?: { label: string; value: string };
};

/** Display-shape news article (matches NewsGrid component contract). */
export type NewsArticle = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string; // formatted display string
  readTime: string;
  image: string;
  body?: string;
};

/** Display-shape job opening (matches CareerBoard component contract). */
export type Job = {
  id: string;
  title: string;
  description?: string;
  experience: string;
  salary: string;
  location: string;
  type: string;
  mode: string;
};

/** CMS page section — used by About/Advertise/Legal pages. */
export type PageSection =
  | { type: "heading"; value: string; level?: 2 | 3 | 4 }
  | { type: "paragraph"; value: string }
  | { type: "list"; items: string[] };

export type PageContent = {
  slug: string;
  title: string;
  subtitle?: string;
  sections: PageSection[];
};

export type SiteSettingsData = {
  emails: string[];
  phones: { label: string; value: string; href: string }[];
  address: string;
  grievanceOfficer: string;
  socials: { title: string; href: string; src: string }[];
};

export type CalculationType = "sip" | "fd" | "emi" | "tax" | "swp";
