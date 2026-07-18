import type { Metadata } from "next";
import { MarketPage } from "@/components/ui/MarketPage";
import { MUTUAL_FUNDS } from "@/lib/data";

export const metadata: Metadata = {
  title: "Mutual Funds — KuberaNow",
  description: "Top performing mutual funds with NAV and 3-year CAGR.",
};

export default function MutualFundsPage() {
  return (
    <MarketPage
      title="Mutual Funds"
      subtitle="Compare top-rated mutual funds across categories — NAV, returns and performance."
      tables={[{ title: "Top Mutual Funds", rows: MUTUAL_FUNDS }]}
    />
  );
}
