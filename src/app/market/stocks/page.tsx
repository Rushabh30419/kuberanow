import type { Metadata } from "next";
import { MarketPage } from "@/components/ui/MarketPage";
import { getMarketRows } from "@/lib/data-access";

export const metadata: Metadata = {
  title: "Stocks — KuberaNow",
  description: "Live stock prices, movers and volume across NSE and BSE.",
};

export default async function StocksPage() {
  const stocks = await getMarketRows("stock");
  return (
    <MarketPage
      title="Stocks"
      subtitle="Track live prices, intraday movers and volume across NSE and BSE listed companies."
      tables={[{ title: "Most Active Stocks", rows: stocks, showVolume: true }]}
    />
  );
}
