"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import { createMarketQuote } from "@/lib/actions";
import { Button, Field, inputClass, Card } from "@/components/admin/ui";

const CATEGORIES = [
  { value: "index", label: "Indices" },
  { value: "stock", label: "Stocks" },
  { value: "mutual_fund", label: "Mutual Funds" },
  { value: "ipo", label: "IPO" },
  { value: "commodity", label: "Commodities" },
  { value: "crypto", label: "Cryptocurrency" },
];

export default function MarketQuoteForm() {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      action={(fd) =>
        start(async () => {
          setError(null);
          const res = await createMarketQuote(fd);
          if (res.ok) {
            router.push("/admin/market");
            router.refresh();
          } else {
            setError(res.error ?? "Save failed.");
          }
        })
      }
      className="space-y-5"
    >
      <Field label="Category">
        <select name="category" required className={inputClass}>
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
      </Field>

      <Field label="Symbol" hint="Trading symbol, e.g. RELIANCE, BTC">
        <input name="symbol" required className={`${inputClass} font-mono`} />
      </Field>

      <Field label="Name" hint="Display name, e.g. Reliance Industries">
        <input name="name" required className={inputClass} />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Price">
          <input name="price" type="number" step="0.01" required defaultValue="0" className={inputClass} />
        </Field>
        <Field label="Change %">
          <input name="change" type="number" step="0.01" required defaultValue="0" className={inputClass} />
        </Field>
      </div>

      <Field label="Volume" hint="Optional">
        <input name="volume" className={inputClass} />
      </Field>

      {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">{error}</div>}

      <div className="flex gap-2">
        <Button type="submit" disabled={pending} icon={Save}>
          {pending ? "Saving…" : "Add quote"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/market")}>Cancel</Button>
      </div>
    </form>
  );
}
