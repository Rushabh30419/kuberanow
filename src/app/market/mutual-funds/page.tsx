import type { Metadata } from "next";
import { MarketPage } from "@/components/ui/MarketPage";
import { getMarketRows } from "@/lib/data-access";

export const metadata: Metadata = {
  title: "Mutual Funds — KuberaNow",
  description: "Top performing mutual funds with NAV and 3-year CAGR.",
};

// Render at request time (DB not available at build time in Docker)
export const dynamic = "force-dynamic";

export default async function MutualFundsPage() {
  const funds = await getMarketRows("mutual_fund");
  return (
    <MarketPage
      title="Mutual Funds"
      subtitle="Compare top-rated mutual funds across categories — NAV, returns and performance."
      tables={[{ title: "Top Mutual Funds", rows: funds }]}
    />
  );
}
