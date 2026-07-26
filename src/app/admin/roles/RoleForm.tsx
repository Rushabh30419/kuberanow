"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Save, Lock } from "lucide-react";
import { upsertRole } from "@/lib/actions";
import { permissionsByCategory } from "@/lib/permissions";
import { Button, Field, inputClass, Card } from "@/components/admin/ui";

type Props = {
  role?: {
    id: string;
    name: string;
    description: string | null;
    system: boolean;
    permissions: { permission: { key: string } }[];
  };
};

export default function RoleForm({ role }: Props) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const initialPerms = new Set(role?.permissions.map((rp) => rp.permission.key) ?? []);
  const grouped = permissionsByCategory();
  const isSystem = role?.system ?? false;

  return (
    <form
      action={(fd) =>
        start(async () => {
          setError(null);
          const res = await upsertRole(fd);
          if (res.ok) {
            router.push("/admin/roles");
            router.refresh();
          } else {
            setError(res.error ?? "Save failed.");
          }
        })
      }
      className="space-y-6"
    >
      {role && <input type="hidden" name="id" value={role.id} />}

      <Card className="space-y-4 p-5">
        <Field label="Role name">
          <input name="name" defaultValue={role?.name ?? ""} required className={inputClass} />
        </Field>
        <Field label="Description">
          <textarea name="description" defaultValue={role?.description ?? ""} rows={2} className={inputClass} />
        </Field>
      </Card>

      <Card className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-career-heading">Permission matrix</h2>
            <p className="mt-0.5 text-xs text-slate-500">Toggle what this role can do.</p>
          </div>
          {isSystem && (
            <span className="inline-flex items-center gap-1.5 rounded-md bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
              <Lock className="size-3.5" /> System role — permissions locked
            </span>
          )}
        </div>

        <div className="space-y-5">
          {Object.entries(grouped).map(([category, perms]) => (
            <div key={category}>
              <p className="mb-2 text-[10px] font-bold tracking-widest text-slate-400 uppercase">{category}</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {perms.map((p) => {
                  const checked = initialPerms.has(p.key);
                  return (
                    <label
                      key={p.key}
                      className={`flex items-start gap-3 rounded-lg border p-3 transition-colors ${
                        checked && !isSystem ? "border-blue-200 bg-blue-50/40" : "border-slate-200"
                      } ${isSystem ? "opacity-60" : "cursor-pointer hover:border-slate-300"}`}
                    >
                      <input
                        type="checkbox"
                        name="permissions"
                        value={p.key}
                        defaultChecked={checked}
                        disabled={isSystem}
                        className="mt-0.5 size-4 rounded border-slate-300"
                      />
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-slate-800">{p.label}</div>
                        <div className="text-xs text-slate-500">{p.description}</div>
                        <code className="mt-0.5 inline-block rounded bg-slate-100 px-1 text-[10px] text-slate-500">{p.key}</code>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">{error}</div>}

      <div className="flex gap-2">
        <Button type="submit" disabled={pending} icon={Save}>
          {pending ? "Saving…" : role ? "Save role" : "Create role"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/roles")}>Cancel</Button>
      </div>
    </form>
  );
}
