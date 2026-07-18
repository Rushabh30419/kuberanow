import { Hero } from "@/components/home/Hero";
import { Convergence } from "@/components/home/Convergence";
import { MarketGap } from "@/components/home/MarketGap";
import { Ecosystem } from "@/components/home/Ecosystem";
import { Revolution } from "@/components/home/Revolution";
import { BottomLine } from "@/components/home/BottomLine";
import { ScrollRefresh } from "@/components/home/ScrollRefresh";

export default function Home() {
  return (
    <main className="bg-background-color flex w-full flex-1 justify-center">
      <div className="flex w-full flex-col">
        <Hero />
        <Convergence />
        <MarketGap />
        <Ecosystem />
        <Revolution />
        <BottomLine />
      </div>
      {/* Recalculate GSAP ScrollTrigger pin positions once fonts/layout settle */}
      <ScrollRefresh />
    </main>
  );
}
