import type { Metadata } from "next";
import { NewsPage } from "@/components/ui/NewsPage";
import { getNewsArticles } from "@/lib/data-access";

export const metadata: Metadata = {
  title: "Technology News — KuberaNow",
  description: "India's tech sector, startups, semiconductors and digital policy.",
};

// Render at request time (DB not available at build time in Docker)
export const dynamic = "force-dynamic";

export default async function TechnologyPage() {
  const articles = await getNewsArticles("technology");
  return (
    <NewsPage
      title="Technology"
      subtitle="Semiconductors, startups, telecom, AI and the digital economy — India's tech pulse."
      breadcrumb="News / Technology"
      articles={articles}
      categorySlug="technology"
    />
  );
}
