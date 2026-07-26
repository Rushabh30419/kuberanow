"use client";

import { useState, useTransition } from "react";
import { Save } from "lucide-react";
import type { SiteSettingsData } from "@/lib/types";
import { updateSiteSettings } from "@/lib/actions";
import { Button, Field, inputClass, Card } from "@/components/admin/ui";

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
      className="space-y-6"
    >
      <Card className="space-y-4 p-5">
        <Field label="Contact emails" hint="One per line">
          <textarea
            value={emails}
            onChange={(e) => setEmails(e.target.value)}
            rows={4}
            className={`${inputClass} font-mono`}
          />
        </Field>
      </Card>

      <Card className="space-y-4 p-5">
        <Field label="Phone numbers" hint="label | number | wa.me URL — one per line">
          <textarea
            value={phones}
            onChange={(e) => setPhones(e.target.value)}
            rows={3}
            className={`${inputClass} font-mono text-xs`}
          />
        </Field>
        <Field label="Office address">
          <textarea value={address} onChange={(e) => setAddress(e.target.value)} rows={2} className={inputClass} />
        </Field>
        <Field label="Grievance officer">
          <input value={officer} onChange={(e) => setOfficer(e.target.value)} className={inputClass} />
        </Field>
      </Card>

      {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">{error}</div>}
      {saved && <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-700">✓ Settings saved.</div>}

      <Button type="submit" disabled={pending} icon={Save}>
        {pending ? "Saving…" : "Save settings"}
      </Button>
    </form>
  );
}
