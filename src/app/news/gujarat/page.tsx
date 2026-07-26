import type { Metadata } from "next";
import { NewsPage } from "@/components/ui/NewsPage";
import { getNewsArticles } from "@/lib/data-access";

export const metadata: Metadata = {
  title: "Gujarat News — KuberaNow",
  description: "Business, markets and economy news from across Gujarat.",
};

// Render at request time (DB not available at build time in Docker)
export const dynamic = "force-dynamic";

export default async function GujaratPage() {
  const articles = await getNewsArticles("gujarat");
  return (
    <NewsPage
      title="Gujarat"
      subtitle="Business, industry and markets from across Gujarat — Surat, Ahmedabad, Vadodara, Rajkot and beyond."
      breadcrumb="News / Gujarat"
      articles={articles}
      categorySlug="gujarat"
    />
  );
}
