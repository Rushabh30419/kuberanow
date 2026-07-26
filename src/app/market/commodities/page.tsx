import type { Metadata } from "next";
import { MarketPage } from "@/components/ui/MarketPage";
import { getMarketRows } from "@/lib/data-access";

export const metadata: Metadata = {
  title: "Commodities — KuberaNow",
  description: "MCX commodity prices: gold, silver, crude oil and more.",
};

// Render at request time (DB not available at build time in Docker)
export const dynamic = "force-dynamic";

export default async function CommoditiesPage() {
  const commodities = await getMarketRows("commodity");
  return (
    <MarketPage
      title="Commodities"
      subtitle="Live MCX commodity prices — precious metals, energy and agri-commodities."
      tables={[{ title: "MCX Commodities", rows: commodities }]}
    />
  );
}
