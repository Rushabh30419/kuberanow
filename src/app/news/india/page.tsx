import type { Metadata } from "next";
import { NewsPage } from "@/components/ui/NewsPage";
import { getNewsArticles } from "@/lib/data-access";

export const metadata: Metadata = {
  title: "Economy News — KuberaNow",
  description: "Macro and economic news shaping India's growth story.",
};

export default async function EconomyNewsPage() {
  const articles = await getNewsArticles("india");
  return (
    <NewsPage
      title="Economy"
      subtitle="Macro indicators, policy moves and the economic forces shaping India's growth story."
      breadcrumb="News / Economy"
      articles={articles}
      categorySlug="india"
    />
  );
}
