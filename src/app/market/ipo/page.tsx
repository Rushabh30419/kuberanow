import type { Metadata } from "next";
import { MarketPage } from "@/components/ui/MarketPage";
import { getMarketRows } from "@/lib/data-access";

export const metadata: Metadata = {
  title: "IPO — KuberaNow",
  description: "Latest IPO listings with listing gains and lot sizes.",
};

export default async function IpoPage() {
  const ipos = await getMarketRows("ipo");
  return (
    <MarketPage
      title="IPO"
      subtitle="New listings, subscription status and listing-day performance for current and recent IPOs."
      tables={[{ title: "Recent IPO Listings", rows: ipos }]}
    />
  );
}
