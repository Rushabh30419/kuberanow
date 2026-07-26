import type { Metadata } from "next";
import { MarketPage } from "@/components/ui/MarketPage";
import { getMarketRows } from "@/lib/data-access";

export const metadata: Metadata = {
  title: "Live Market — KuberaNow",
  description: "Real-time snapshot of Indian markets: indices and top stocks.",
};

export default async function LiveMarketPage() {
  const [indices, stocks] = await Promise.all([
    getMarketRows("index"),
    getMarketRows("stock"),
  ]);

  return (
    <MarketPage
      title="Live Market"
      subtitle="A real-time snapshot of Indian markets — indices, movers, and sentiment across the trading day."
      tables={[
        { title: "Indices", rows: indices },
        { title: "Top Stocks", rows: stocks, showVolume: true },
      ]}
    />
  );
}
