import type { Metadata } from "next";
import { MarketPage } from "@/components/ui/MarketPage";
import { CRYPTO } from "@/lib/data";

export const metadata: Metadata = {
  title: "Cryptocurrency — KuberaNow",
  description: "Live cryptocurrency prices in INR: Bitcoin, Ethereum and more.",
};

export default function CryptoPage() {
  return (
    <MarketPage
      title="Cryptocurrency"
      subtitle="Track the price of major cryptocurrencies in INR, including 24-hour change and volume."
      tables={[
        { title: "Top Cryptocurrencies (INR)", rows: CRYPTO, showVolume: true },
      ]}
    />
  );
}
