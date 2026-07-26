import { PlusCircle } from "lucide-react";
import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/auth-guard";
import { getUserPermissions } from "@/lib/data-access";
import { PageHeader, ButtonLink } from "@/components/admin/ui";
import MarketEditor from "./MarketEditor";

export default async function MarketAdminPage() {
  const user = await requirePermission("market.view");
  const perms = await getUserPermissions(user.id);
  const canEdit = perms.includes("market.edit");

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
        actions={canEdit && <ButtonLink href="/admin/market/new" icon={PlusCircle}>Add quote</ButtonLink>}
      />
      <MarketEditor byCategory={byCategory} canEdit={canEdit} />
    </div>
  );
}
