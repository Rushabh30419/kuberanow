"use client";

import { useState, useTransition } from "react";
import { Check, Save } from "lucide-react";
import { updateMarketQuote } from "@/lib/actions";

type Quote = {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change: number;
  volume: string | null;
};

const CATEGORY_LABELS: Record<string, string> = {
  index: "Indices",
  stock: "Stocks",
  mutual_fund: "Mutual Funds",
  ipo: "IPO",
  commodity: "Commodities",
  crypto: "Crypto",
};

type Props = {
  byCategory: Record<string, Quote[]>;
};

export default function MarketEditor({ byCategory }: Props) {
  const categories = Object.keys(byCategory);
  const [active, setActive] = useState(categories[0] ?? "index");
  const [pending, start] = useTransition();
  const [savedId, setSavedId] = useState<string | null>(null);

  return (
    <div>
      {/* Tabs */}
      <div className="flex flex-wrap gap-1 border-b border-slate-200">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setActive(c)}
            className={`-mb-px border-b-2 px-3 py-2 text-sm font-semibold transition-colors ${
              active === c
                ? "border-primary-navy text-primary-navy"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            {CATEGORY_LABELS[c] ?? c}
          </button>
        ))}
      </div>

      <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-xs font-semibold tracking-wide text-slate-500 uppercase">
            <tr>
              <th className="px-3 py-2 text-left">Symbol</th>
              <th className="px-3 py-2 text-left">Name</th>
              <th className="px-3 py-2 text-right">Price</th>
              <th className="px-3 py-2 text-right">Change %</th>
              <th className="px-3 py-2 text-left">Volume</th>
              <th className="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {(byCategory[active] ?? []).map((q) => (
              <QuoteRow
                key={q.id}
                quote={q}
                pending={pending}
                saved={savedId === q.id}
                onSave={(price, change, volume) =>
                  start(async () => {
                    const res = await updateMarketQuote(q.id, { price, change, volume });
                    if (res.ok) {
                      setSavedId(q.id);
                      setTimeout(() => setSavedId(null), 1500);
                    }
                  })
                }
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function QuoteRow({
  quote,
  pending,
  saved,
  onSave,
}: {
  quote: Quote;
  pending: boolean;
  saved: boolean;
  onSave: (price: number, change: number, volume?: string) => void;
}) {
  const [price, setPrice] = useState(String(quote.price));
  const [change, setChange] = useState(String(quote.change));
  const [volume, setVolume] = useState(quote.volume ?? "");

  return (
    <tr>
      <td className="px-3 py-2 font-mono font-semibold text-career-heading">{quote.symbol}</td>
      <td className="px-3 py-2 text-slate-600">{quote.name}</td>
      <td className="px-3 py-2 text-right">
        <input
          type="number"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-28 rounded-md border border-slate-300 px-2 py-1 text-right text-sm focus:border-primary-navy focus:outline-none"
        />
      </td>
      <td className="px-3 py-2 text-right">
        <input
          type="number"
          step="0.01"
          value={change}
          onChange={(e) => setChange(e.target.value)}
          className="w-20 rounded-md border border-slate-300 px-2 py-1 text-right text-sm focus:border-primary-navy focus:outline-none"
        />
      </td>
      <td className="px-3 py-2">
        <input
          type="text"
          value={volume}
          onChange={(e) => setVolume(e.target.value)}
          placeholder="—"
          className="w-24 rounded-md border border-slate-300 px-2 py-1 text-sm focus:border-primary-navy focus:outline-none"
        />
      </td>
      <td className="px-3 py-2 text-right">
        {saved ? (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
            <Check className="size-3.5" /> Saved
          </span>
        ) : (
          <button
            type="button"
            disabled={pending}
            onClick={() => onSave(Number(price), Number(change), volume || undefined)}
            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 hover:underline disabled:opacity-60"
          >
            <Save className="size-3.5" /> Save
          </button>
        )}
      </td>
    </tr>
  );
}
