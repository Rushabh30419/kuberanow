"use client";

import { useTransition } from "react";
import type { UserRole } from "@/lib/types";

type Props = {
  userId: string;
  role: UserRole;
  action: (userId: string, role: UserRole) => Promise<{ ok: boolean; error?: string }>;
};

const ROLES: UserRole[] = ["admin", "editor", "reader"];

export default function RoleSelect({ userId, role, action }: Props) {
  const [pending, start] = useTransition();

  return (
    <select
      defaultValue={role}
      disabled={pending}
      onChange={(e) =>
        start(async () => {
          const res = await action(userId, e.target.value as UserRole);
          if (!res.ok) alert(res.error ?? "Update failed.");
        })
      }
      className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs font-semibold capitalize text-slate-700 disabled:opacity-60"
    >
      {ROLES.map((r) => (
        <option key={r} value={r} className="capitalize">
          {r}
        </option>
      ))}
    </select>
  );
}
