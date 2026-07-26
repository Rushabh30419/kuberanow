"use client";

import { useState, useTransition } from "react";
import type { SiteSettingsData } from "@/lib/types";

type Props = {
  initial: SiteSettingsData | null;
  action: (jsonData: string) => Promise<{ ok: boolean; error?: string }>;
};

export default function SettingsForm({ initial, action }: Props) {
  const [emails, setEmails] = useState((initial?.emails ?? []).join("\n"));
  const [address, setAddress] = useState(initial?.address ?? "");
  const [officer, setOfficer] = useState(initial?.grievanceOfficer ?? "");
  const [phones, setPhones] = useState(
    (initial?.phones ?? []).map((p) => `${p.label}|${p.value}|${p.href}`).join("\n")
  );
  const [pending, start] = useTransition();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      action={() =>
        start(async () => {
          setError(null);
          setSaved(false);
          const data: SiteSettingsData = {
            emails: emails.split("\n").map((s) => s.trim()).filter(Boolean),
            address: address.trim(),
            grievanceOfficer: officer.trim(),
            phones: phones
              .split("\n")
              .map((line) => line.split("|"))
              .filter((p) => p.length >= 3)
              .map((p) => ({ label: p[0].trim(), value: p[1].trim(), href: p[2].trim() })),
            socials: initial?.socials ?? [],
          };
          const res = await action(JSON.stringify(data));
          if (res.ok) setSaved(true);
          else setError(res.error ?? "Save failed.");
        })
      }
      className="space-y-5"
    >
      <div>
        <label className="mb-1.5 block text-xs font-semibold text-slate-700">Contact emails (one per line)</label>
        <textarea
          value={emails}
          onChange={(e) => setEmails(e.target.value)}
          rows={4}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold text-slate-700">
          Phone numbers <span className="text-slate-400">(label | number | wa.me URL, one per line)</span>
        </label>
        <textarea
          value={phones}
          onChange={(e) => setPhones(e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-xs"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold text-slate-700">Office address</label>
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          rows={2}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold text-slate-700">Grievance officer</label>
        <input
          value={officer}
          onChange={(e) => setOfficer(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">{error}</div>
      )}
      {saved && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-sm text-green-700">
          ✓ Settings saved.
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-blue-700 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save settings"}
      </button>
    </form>
  );
}
