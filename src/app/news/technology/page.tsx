import type { Metadata } from "next";
import { NewsPage } from "@/components/ui/NewsPage";
import { NEWS } from "@/lib/data";

export const metadata: Metadata = {
  title: "Technology News — KuberaNow",
  description: "India's tech sector, startups, semiconductors and digital policy.",
};

export default function TechnologyPage() {
  return (
    <NewsPage
      title="Technology"
      subtitle="Semiconductors, startups, telecom, AI and the digital economy — India's tech pulse."
      breadcrumb="News / Technology"
      articles={NEWS.technology}
    />
  );
}
