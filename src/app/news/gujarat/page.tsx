import type { Metadata } from "next";
import { NewsPage } from "@/components/ui/NewsPage";
import { NEWS } from "@/lib/data";

export const metadata: Metadata = {
  title: "Gujarat News — KuberaNow",
  description: "Business, markets and economy news from across Gujarat.",
};

export default function GujaratPage() {
  return (
    <NewsPage
      title="Gujarat"
      subtitle="Business, industry and markets from across Gujarat — Surat, Ahmedabad, Vadodara, Rajkot and beyond."
      breadcrumb="News / Gujarat"
      articles={NEWS.gujarat}
      hrefPrefix="/news/gujarat"
    />
  );
}
