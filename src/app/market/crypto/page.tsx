import type { Metadata } from "next";
import { MarketPage } from "@/components/ui/MarketPage";
import { getMarketRows } from "@/lib/data-access";

export const metadata: Metadata = {
  title: "Cryptocurrency — KuberaNow",
  description: "Live cryptocurrency prices in INR: Bitcoin, Ethereum and more.",
};

export default async function CryptoPage() {
  const crypto = await getMarketRows("crypto");
  return (
    <MarketPage
      title="Cryptocurrency"
      subtitle="Track the price of major cryptocurrencies in INR, including 24-hour change and volume."
      tables={[
        { title: "Top Cryptocurrencies (INR)", rows: crypto, showVolume: true },
      ]}
    />
  );
}
