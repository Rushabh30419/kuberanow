import type { Metadata } from "next";
import { NewsPage } from "@/components/ui/NewsPage";
import { NEWS } from "@/lib/data";

export const metadata: Metadata = {
  title: "National News — KuberaNow",
  description: "National policy, governance and political economy updates.",
};

export default function NationalPage() {
  return (
    <NewsPage
      title="National"
      subtitle="Policy, Parliament, governance and the political economy that moves markets."
      breadcrumb="News / National"
      articles={NEWS.national}
      hrefPrefix="/news/national"
    />
  );
}
