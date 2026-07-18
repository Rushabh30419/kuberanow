"use client";

import { useState } from "react";

export type MarketRow = {
  symbol: string;
  name: string;
  price: string;
  change: number; // percentage
  volume?: string;
  extra?: { label: string; value: string };
};

type Props = {
  title?: string;
  rows: MarketRow[];
  showVolume?: boolean;
};

export function MarketTable({ title, rows, showVolume }: Props) {
  const [sort, setSort] = useState<"change" | "default">("default");

  const sorted =
    sort === "change"
      ? [...rows].sort((a, b) => b.change - a.change)
      : rows;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {title && (
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          <button
            onClick={() =>
              setSort((s) => (s === "change" ? "default" : "change"))
            }
            className="rounded-md border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50"
          >
            {sort === "change" ? "Reset order" : "Sort by % change"}
          </button>
        </div>
      )}

      {/* Desktop table */}
      <table className="hidden w-full text-sm sm:table">
        <thead>
          <tr className="border-b border-slate-100 text-left text-xs tracking-wider text-slate-500 uppercase">
            <th className="px-5 py-3 font-medium">Symbol</th>
            <th className="px-5 py-3 font-medium">Price</th>
            <th className="px-5 py-3 font-medium">Change</th>
            {showVolume && <th className="px-5 py-3 font-medium">Volume</th>}
            {sorted[0]?.extra && (
              <th className="px-5 py-3 font-medium">{sorted[0].extra.label}</th>
            )}
          </tr>
        </thead>
        <tbody>
          {sorted.map((r) => {
            const up = r.change >= 0;
            return (
              <tr
                key={r.symbol}
                className="border-b border-slate-50 transition-colors hover:bg-slate-50/60"
              >
                <td className="px-5 py-3">
                  <div className="font-semibold text-slate-900">{r.symbol}</div>
                  <div className="text-xs text-slate-500">{r.name}</div>
                </td>
                <td className="px-5 py-3 font-medium text-slate-700">
                  {r.price}
                </td>
                <td className="px-5 py-3">
                  <span
                    className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold ${
                      up
                        ? "bg-green-50 text-green-700"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    {up ? "▲" : "▼"} {Math.abs(r.change).toFixed(2)}%
                  </span>
                </td>
                {showVolume && (
                  <td className="px-5 py-3 text-slate-600">{r.volume}</td>
                )}
                {r.extra && (
                  <td className="px-5 py-3 text-slate-600">{r.extra.value}</td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Mobile cards */}
      <div className="divide-y divide-slate-50 sm:hidden">
        {sorted.map((r) => {
          const up = r.change >= 0;
          return (
            <div key={r.symbol} className="px-4 py-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-900">{r.symbol}</div>
                  <div className="text-xs text-slate-500">{r.name}</div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-slate-700">{r.price}</div>
                  <span
                    className={`text-xs font-semibold ${
                      up ? "text-green-700" : "text-red-700"
                    }`}
                  >
                    {up ? "▲" : "▼"} {Math.abs(r.change).toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
