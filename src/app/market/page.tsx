import type { Metadata } from "next";
import { MarketPage } from "@/components/ui/MarketPage";
import { INDICES, STOCKS } from "@/lib/data";

export const metadata: Metadata = {
  title: "Live Market — KuberaNow",
  description: "Real-time snapshot of Indian markets: indices and top stocks.",
};

export default function LiveMarketPage() {
  return (
    <MarketPage
      title="Live Market"
      subtitle="A real-time snapshot of Indian markets — indices, movers, and sentiment across the trading day."
      tables={[
        { title: "Indices", rows: INDICES },
        { title: "Top Stocks", rows: STOCKS, showVolume: true },
      ]}
    />
  );
}
