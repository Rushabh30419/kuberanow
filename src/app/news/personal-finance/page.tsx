import type { Metadata } from "next";
import { NewsPage } from "@/components/ui/NewsPage";
import { getNewsArticles } from "@/lib/data-access";

export const metadata: Metadata = {
  title: "Personal Finance News — KuberaNow",
  description: "Tax, savings, insurance and investing guidance for everyday readers.",
};

export default async function PersonalFinancePage() {
  const articles = await getNewsArticles("personal-finance");
  return (
    <NewsPage
      title="Personal Finance"
      subtitle="Practical guidance on tax, savings, insurance, credit and investing — built for real-world decisions."
      breadcrumb="News / Personal Finance"
      articles={articles}
      categorySlug="personal-finance"
    />
  );
}
