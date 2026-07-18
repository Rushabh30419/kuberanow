import type { Metadata } from "next";
import { NewsPage } from "@/components/ui/NewsPage";
import { NEWS } from "@/lib/data";

export const metadata: Metadata = {
  title: "Economy News — KuberaNow",
  description: "Macro and economic news shaping India's growth story.",
};

export default function EconomyNewsPage() {
  return (
    <NewsPage
      title="Economy"
      subtitle="Macro indicators, policy moves and the economic forces shaping India's growth story."
      breadcrumb="News / Economy"
      articles={NEWS.india}
      hrefPrefix="/news/india"
    />
  );
}
