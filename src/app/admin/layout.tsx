import Link from "next/link";
import { requireEditor } from "@/lib/auth-guard";
import { logout } from "@/app/auth-actions";
import LogoutButton from "./LogoutButton";

export const metadata = {
  title: "Admin · KuberaNow",
};

const EDITOR_NAV = [
  { href: "/admin", label: "Dashboard", icon: "▦" },
  { href: "/admin/articles", label: "Articles", icon: "✎" },
  { href: "/admin/jobs", label: "Jobs", icon: "◈" },
  { href: "/admin/market", label: "Market data", icon: "↕" },
];

const ADMIN_ONLY_NAV = [
  { href: "/admin/applications", label: "Applications", icon: "✓" },
  { href: "/admin/contact", label: "Messages", icon: "✉" },
  { href: "/admin/users", label: "Users", icon: "☺" },
  { href: "/admin/settings", label: "Settings", icon: "⚙" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireEditor();
  const nav = user.role === "admin" ? [...EDITOR_NAV, ...ADMIN_ONLY_NAV] : EDITOR_NAV;

  return (
    <div className="bg-slate-50 flex min-h-svh">
      {/* Sidebar */}
      <aside className="bg-dark-navy1 hidden w-60 shrink-0 flex-col text-white md:flex">
        <div className="border-b border-white/10 px-5 py-4">
          <Link href="/" className="text-lg font-bold tracking-tight">
            KuberaNow
          </Link>
          <p className="text-xs text-white/50">Admin console</p>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-white/80 transition-colors hover:bg-white/5 hover:text-white"
            >
              <span className="w-5 text-center text-xs opacity-70">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-white/10 px-3 py-3">
          <div className="mb-2 truncate px-3 text-xs text-white/50">{user.email}</div>
          <LogoutButton />
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 md:px-6">
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 capitalize">
              {user.role}
            </span>
            <span className="text-sm text-slate-600">{user.name}</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className="text-xs text-slate-500 hover:text-slate-900">
              ← View site
            </Link>
          </div>
        </header>

        {/* Mobile nav row */}
        <div className="border-b border-slate-200 bg-white px-4 py-2 md:hidden">
          <div className="flex gap-2 overflow-x-auto">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="shrink-0 rounded-md bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
