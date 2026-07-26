import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/auth-guard";
import { PageHeader } from "@/components/admin/ui";
import MarketEditor from "./MarketEditor";

export default async function MarketAdminPage() {
  await requirePermission("market.view");
  const quotes = await prisma.marketQuote.findMany({
    orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
  });

  const byCategory = quotes.reduce<Record<string, typeof quotes>>((acc, q) => {
    (acc[q.category] ??= []).push(q);
    return acc;
  }, {});

  return (
    <div>
      <PageHeader
        title="Market data"
        subtitle="Edit price, change %, and volume. Changes appear on the live site immediately."
      />
      <MarketEditor byCategory={byCategory} />
    </div>
  );
}
