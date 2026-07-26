"use client";

import { useState, useTransition } from "react";
import { Check, Save, Trash2 } from "lucide-react";
import { updateMarketQuote, deleteMarketQuote } from "@/lib/actions";

export const CATEGORY_LABELS: Record<string, string> = {
  index: "Indices",
  stock: "Stocks",
  mutual_fund: "Mutual Funds",
  ipo: "IPO",
  commodity: "Commodities",
  crypto: "Crypto",
};

export type Quote = {
  id: string;
  category: string;
  symbol: string;
  name: string;
  price: number;
  change: number;
  volume: string | null;
};

type Props = {
  quotes: Quote[];
  canEdit: boolean;
  page: number;
  pageCount: number;
};

export default function MarketTable({ quotes, canEdit, page, pageCount }: Props) {
  const [pending, start] = useTransition();
  const [savedId, setSavedId] = useState<string | null>(null);

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-xs font-semibold tracking-wide text-slate-500 uppercase">
            <tr>
              <th className="px-3 py-3 text-left">Category</th>
              <th className="px-3 py-3 text-left">Symbol</th>
              <th className="px-3 py-3 text-left">Name</th>
              <th className="px-3 py-3 text-right">Price</th>
              <th className="px-3 py-3 text-right">Change %</th>
              <th className="px-3 py-3 text-left">Volume</th>
              {canEdit && <th className="px-3 py-3"></th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {quotes.map((q) => (
              <QuoteRow
                key={q.id}
                quote={q}
                pending={pending}
                canEdit={canEdit}
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
                onDelete={() =>
                  start(async () => {
                    if (!confirm(`Delete ${q.symbol}?`)) return;
                    const res = await deleteMarketQuote(q.id);
                    if (!res.ok) alert((res as { error?: string }).error ?? "Delete failed.");
                  })
                }
              />
            ))}
          </tbody>
        </table>
      </div>

      {pageCount > 1 && (
        <div className="flex items-center justify-between border-t border-slate-100 px-3 py-2 text-xs text-slate-500">
          <span>
            Page <span className="font-semibold text-slate-700">{page}</span> of {pageCount}
          </span>
          <span>Use the filters above to change pages.</span>
        </div>
      )}
    </div>
  );
}

function QuoteRow({
  quote,
  pending,
  saved,
  canEdit,
  onSave,
  onDelete,
}: {
  quote: Quote;
  pending: boolean;
  saved: boolean;
  canEdit: boolean;
  onSave: (price: number, change: number, volume?: string) => void;
  onDelete: () => void;
}) {
  const [price, setPrice] = useState(String(quote.price));
  const [change, setChange] = useState(String(quote.change));
  const [volume, setVolume] = useState(quote.volume ?? "");

  return (
    <tr>
      <td className="px-3 py-2 text-slate-600">
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
          {CATEGORY_LABELS[quote.category] ?? quote.category}
        </span>
      </td>
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
      {canEdit && (
        <td className="px-3 py-2 text-right">
          <div className="flex items-center justify-end gap-3 text-xs font-semibold">
            {saved ? (
              <span className="inline-flex items-center gap-1 text-emerald-700">
                <Check className="size-3.5" /> Saved
              </span>
            ) : (
              <button
                type="button"
                disabled={pending}
                onClick={() => onSave(Number(price), Number(change), volume || undefined)}
                className="inline-flex items-center gap-1 text-blue-700 hover:underline disabled:opacity-60"
              >
                <Save className="size-3.5" /> Save
              </button>
            )}
            <button
              type="button"
              disabled={pending}
              onClick={onDelete}
              aria-label={`Delete ${quote.symbol}`}
              className="inline-flex items-center gap-1 text-red-600 hover:bg-red-50 disabled:opacity-60"
            >
              <Trash2 className="size-3.5" /> Delete
            </button>
          </div>
        </td>
      )}
    </tr>
  );
}
