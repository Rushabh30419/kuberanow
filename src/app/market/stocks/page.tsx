import type { Metadata } from "next";
import { MarketPage } from "@/components/ui/MarketPage";
import { STOCKS } from "@/lib/data";

export const metadata: Metadata = {
  title: "Stocks — KuberaNow",
  description: "Live stock prices, movers and volume across NSE and BSE.",
};

export default function StocksPage() {
  return (
    <MarketPage
      title="Stocks"
      subtitle="Track live prices, intraday movers and volume across NSE and BSE listed companies."
      tables={[{ title: "Most Active Stocks", rows: STOCKS, showVolume: true }]}
    />
  );
}
