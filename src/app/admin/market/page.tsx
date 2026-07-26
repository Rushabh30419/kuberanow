import { prisma } from "@/lib/db";
import MarketEditor from "./MarketEditor";

export default async function MarketAdminPage() {
  const quotes = await prisma.marketQuote.findMany({
    orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
  });

  // Group by category
  const byCategory = quotes.reduce<Record<string, typeof quotes>>((acc, q) => {
    (acc[q.category] ??= []).push(q);
    return acc;
  }, {});

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Market data</h1>
      <p className="mt-1 text-sm text-slate-500">
        Edit price, change %, and volume. Changes appear on the live site immediately.
      </p>

      <MarketEditor byCategory={byCategory} />
    </div>
  );
}
