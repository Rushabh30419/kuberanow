import type { Metadata } from "next";
import { NewsPage } from "@/components/ui/NewsPage";
import { NEWS } from "@/lib/data";

export const metadata: Metadata = {
  title: "Personal Finance News — KuberaNow",
  description: "Tax, savings, insurance and investing guidance for everyday readers.",
};

export default function PersonalFinancePage() {
  return (
    <NewsPage
      title="Personal Finance"
      subtitle="Practical guidance on tax, savings, insurance, credit and investing — built for real-world decisions."
      breadcrumb="News / Personal Finance"
      articles={NEWS["personal-finance"]}
      hrefPrefix="/news/personal-finance"
    />
  );
}
