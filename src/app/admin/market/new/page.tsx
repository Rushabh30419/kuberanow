import { requirePermission } from "@/lib/auth-guard";
import { PageHeader, Card } from "@/components/admin/ui";
import MarketQuoteForm from "../MarketQuoteForm";

export default async function NewMarketQuotePage() {
  await requirePermission("market.edit");
  return (
    <div>
      <PageHeader title="Add market quote" subtitle="Pick a category and add a new symbol/price row." />
      <div className="max-w-xl">
        <Card className="p-6">
          <MarketQuoteForm />
        </Card>
      </div>
    </div>
  );
}
