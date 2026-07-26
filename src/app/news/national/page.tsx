import type { Metadata } from "next";
import { NewsPage } from "@/components/ui/NewsPage";
import { getNewsArticles } from "@/lib/data-access";

export const metadata: Metadata = {
  title: "National News — KuberaNow",
  description: "National policy, governance and political economy updates.",
};

// Render at request time (DB not available at build time in Docker)
export const dynamic = "force-dynamic";

export default async function NationalPage() {
  const articles = await getNewsArticles("national");
  return (
    <NewsPage
      title="National"
      subtitle="Policy, Parliament, governance and the political economy that moves markets."
      breadcrumb="News / National"
      articles={articles}
      categorySlug="national"
    />
  );
}
