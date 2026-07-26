import type { Metadata } from "next";
import { NewsPage } from "@/components/ui/NewsPage";
import { getNewsArticles } from "@/lib/data-access";

export const metadata: Metadata = {
  title: "Global News — KuberaNow",
  description: "Global markets, central banks and geopolitics that move capital.",
};

// Render at request time (DB not available at build time in Docker)
export const dynamic = "force-dynamic";

export default async function GlobalPage() {
  const articles = await getNewsArticles("global");
  return (
    <NewsPage
      title="Global"
      subtitle="Central banks, commodities, geopolitics and cross-border capital flows — through an Indian lens."
      breadcrumb="News / Global"
      articles={articles}
      categorySlug="global"
    />
  );
}
