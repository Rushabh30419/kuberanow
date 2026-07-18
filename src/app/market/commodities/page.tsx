import type { Metadata } from "next";
import { MarketPage } from "@/components/ui/MarketPage";
import { COMMODITIES } from "@/lib/data";

export const metadata: Metadata = {
  title: "Commodities — KuberaNow",
  description: "MCX commodity prices: gold, silver, crude oil and more.",
};

export default function CommoditiesPage() {
  return (
    <MarketPage
      title="Commodities"
      subtitle="Live MCX commodity prices — precious metals, energy and agri-commodities."
      tables={[{ title: "MCX Commodities", rows: COMMODITIES }]}
    />
  );
}
