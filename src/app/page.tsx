import { Hero } from "@/components/home/Hero";
import { Convergence } from "@/components/home/Convergence";
import { MarketGap } from "@/components/home/MarketGap";
import { Ecosystem } from "@/components/home/Ecosystem";
import { Revolution } from "@/components/home/Revolution";
import { BottomLine } from "@/components/home/BottomLine";

export default function Home() {
  return (
    <main className="bg-background-color flex w-full flex-1 justify-center px-4 py-4 md:py-6">
      <div className="flex w-full flex-col items-start gap-5 md:max-w-7xl md:flex-row">
        <div className="min-w-full flex-1 md:min-w-[57%] xl:min-w-[37rem]">
          <Hero />
          <Convergence />
          <MarketGap />
          <Ecosystem />
          <Revolution />
          <BottomLine />
        </div>
      </div>
    </main>
  );
}
