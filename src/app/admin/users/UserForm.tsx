"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import { upsertUser } from "@/lib/actions";
import { Button, Field, inputClass } from "@/components/admin/ui";

type Role = { id: string; name: string };

type Props = {
  user?: {
    id: string;
    name: string | null;
    email: string;
    roleId: string | null;
  };
  roles: Role[];
  canAssignRole: boolean;
  isSelf: boolean;
};

export default function UserForm({ user, roles, canAssignRole, isSelf }: Props) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      action={(fd) =>
        start(async () => {
          setError(null);
          const res = await upsertUser(fd);
          if (res.ok) {
            router.push("/admin/users");
            router.refresh();
          } else {
            setError(res.error ?? "Save failed.");
          }
        })
      }
      className="space-y-5"
    >
      {user && <input type="hidden" name="id" value={user.id} />}

      <Field label="Full name">
        <input name="name" defaultValue={user?.name ?? ""} className={inputClass} />
      </Field>

      <Field label="Email">
        <input name="email" type="email" defaultValue={user?.email ?? ""} required className={inputClass} />
      </Field>

      <Field label={user ? "New password" : "Password"} hint={user ? "Leave blank to keep current" : "Min 6 characters"}>
        <input name="password" type="password" minLength={user ? 0 : 6} placeholder={user ? "••••••••" : ""} className={inputClass} />
      </Field>

      <Field label="Role">
        <select name="roleId" defaultValue={user?.roleId ?? ""} disabled={!canAssignRole} className={inputClass}>
          <option value="">— No role —</option>
          {roles.map((r) => (
            <option key={r.id} value={r.id}>{r.name}</option>
          ))}
        </select>
      </Field>
      {!canAssignRole && (
        <p className="text-xs text-amber-700">
          You can edit name and email but not the role — that requires the <code className="rounded bg-amber-50 px-1">users.assignRole</code> permission.
        </p>
      )}
      {isSelf && canAssignRole && (
        <p className="text-xs text-amber-700">You can&apos;t change your own role (safety lock).</p>
      )}

      {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">{error}</div>}

      <div className="flex gap-2">
        <Button type="submit" disabled={pending} icon={Save}>
          {pending ? "Saving…" : user ? "Save changes" : "Create user"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/users")}>Cancel</Button>
      </div>
    </form>
  );
}
