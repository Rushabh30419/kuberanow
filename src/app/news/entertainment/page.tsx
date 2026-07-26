import type { Metadata } from "next";
import { NewsPage } from "@/components/ui/NewsPage";
import { getNewsArticles } from "@/lib/data-access";

export const metadata: Metadata = {
  title: "Entertainment News — KuberaNow",
  description: "Film, streaming, music and the business of entertainment.",
};

export default async function EntertainmentPage() {
  const articles = await getNewsArticles("entertainment");
  return (
    <NewsPage
      title="Entertainment"
      subtitle="The business of entertainment — film, streaming, music, OTT and live events."
      breadcrumb="News / Entertainment"
      articles={articles}
      categorySlug="entertainment"
    />
  );
}
