import type { Metadata } from "next";
import { NewsPage } from "@/components/ui/NewsPage";
import { NEWS } from "@/lib/data";

export const metadata: Metadata = {
  title: "Global News — KuberaNow",
  description: "Global markets, central banks and geopolitics that move capital.",
};

export default function GlobalPage() {
  return (
    <NewsPage
      title="Global"
      subtitle="Central banks, commodities, geopolitics and cross-border capital flows — through an Indian lens."
      breadcrumb="News / Global"
      articles={NEWS.global}
    />
  );
}
