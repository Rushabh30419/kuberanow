import type { Metadata } from "next";
import { NewsPage } from "@/components/ui/NewsPage";
import { NEWS } from "@/lib/data";

export const metadata: Metadata = {
  title: "Entertainment News — KuberaNow",
  description: "Film, streaming, music and the business of entertainment.",
};

export default function EntertainmentPage() {
  return (
    <NewsPage
      title="Entertainment"
      subtitle="The business of entertainment — film, streaming, music, OTT and live events."
      breadcrumb="News / Entertainment"
      articles={NEWS.entertainment}
      hrefPrefix="/news/entertainment"
    />
  );
}
