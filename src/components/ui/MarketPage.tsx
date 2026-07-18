import { PageHeader } from "./PageHeader";
import { MarketTable } from "./MarketTable";
import type { MarketRow } from "./MarketTable";

type Props = {
  title: string;
  subtitle: string;
  tables: { title: string; rows: MarketRow[]; showVolume?: boolean }[];
};

export function MarketPage({ title, subtitle, tables }: Props) {
  return (
    <>
      <PageHeader title={title} subtitle={subtitle} breadcrumb="Markets" />
      <main className="bg-background-color mx-auto w-full max-w-7xl flex-1 px-4 py-10">
        <div className="grid gap-8">
          {tables.map((t) => (
            <MarketTable
              key={t.title}
              title={t.title}
              rows={t.rows}
              showVolume={t.showVolume}
            />
          ))}
        </div>

        <div className="mt-10 rounded-xl border border-slate-200 bg-white/60 p-5 text-xs text-slate-500 italic">
          Market data shown is for demonstration purposes only and is not
          real-time. KuberaNow is an editorial clone for design reference.
        </div>
      </main>
    </>
  );
}
