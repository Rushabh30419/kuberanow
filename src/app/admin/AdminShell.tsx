"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  LineChart,
  Inbox,
  Mail,
  Users,
  ShieldCheck,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
  Radio,
} from "lucide-react";
import { LogoutButton } from "./LogoutButton";

export type NavItem = {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  permission: string;
};

export type NavSection = {
  heading: string;
  items: NavItem[];
};

const NAV: NavSection[] = [
  {
    heading: "Overview",
    items: [{ href: "/admin", label: "Dashboard", icon: LayoutDashboard, permission: "dashboard.view" }],
  },
  {
    heading: "Content",
    items: [
      { href: "/admin/articles", label: "Articles", icon: FileText, permission: "articles.view" },
      { href: "/admin/jobs", label: "Jobs", icon: Briefcase, permission: "jobs.view" },
      { href: "/admin/market", label: "Market data", icon: LineChart, permission: "market.view" },
    ],
  },
  {
    heading: "Inbox",
    items: [
      { href: "/admin/applications", label: "Applications", icon: Inbox, permission: "applications.view" },
      { href: "/admin/contact", label: "Messages", icon: Mail, permission: "contact.view" },
    ],
  },
  {
    heading: "Live",
    items: [
      { href: "/admin/live", label: "Live control panel", icon: Radio, permission: "live.view" },
    ],
  },
  {
    heading: "Administration",
    items: [
      { href: "/admin/users", label: "Users", icon: Users, permission: "users.view" },
      { href: "/admin/roles", label: "Roles & permissions", icon: ShieldCheck, permission: "roles.view" },
      { href: "/admin/settings", label: "Settings", icon: Settings, permission: "settings.view" },
    ],
  },
];

type Props = {
  user: { name?: string | null; email?: string | null; role: string };
  permissions: string[];
  children: React.ReactNode;
};

export function AdminShell({ user, permissions, children }: Props) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Filter nav to items this user can see
  const visibleSections = NAV.map((section) => ({
    ...section,
    items: section.items.filter((item) => permissions.includes(item.permission)),
  })).filter((section) => section.items.length > 0);

  const SidebarBody = (
    <>
      <div className="border-b border-white/10 px-5 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-md bg-cyan-blue text-dark-navy2 font-black">
            K
          </span>
          <div>
            <div className="text-sm font-bold tracking-tight text-white">KuberaNow</div>
            <div className="text-[10px] tracking-widest text-cyan-blue uppercase">Admin Console</div>
          </div>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {visibleSections.map((section) => (
          <div key={section.heading} className="mb-5">
            <p className="mb-1 px-3 text-[10px] font-bold tracking-widest text-white/30 uppercase">
              {section.heading}
            </p>
            {section.items.map((item) => {
              const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`group relative mb-0.5 flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                    active
                      ? "bg-white/10 font-semibold text-cyan-blue"
                      : "text-white/70 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {active && (
                    <span className="absolute top-1 bottom-1 left-0 w-0.5 rounded-r bg-cyan-blue" aria-hidden />
                  )}
                  <Icon className={`size-4 shrink-0 ${active ? "text-cyan-blue" : "text-white/40 group-hover:text-white/70"}`} />
                  {item.label}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="border-t border-white/10 px-3 py-3">
        <div className="mb-2 truncate px-3 text-xs text-white/50">{user.email}</div>
        <LogoutButton />
      </div>
    </>
  );

  const TopBar = (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 md:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileOpen(true)}
          className="flex size-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="size-5" />
        </button>
        <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold capitalize text-blue-700">
          {user.role}
        </span>
        <span className="hidden text-sm text-slate-600 sm:inline">{user.name}</span>
      </div>
      <div className="flex items-center gap-3">
        <Link
          href="/"
          target="_blank"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 transition-colors hover:text-slate-900"
        >
          View site <ExternalLink className="size-3.5" />
        </Link>
      </div>
    </header>
  );

  return (
    <div className="flex min-h-svh bg-slate-50">
      {/* Desktop sidebar */}
      <aside className="bg-dark-navy1 fixed top-0 left-0 z-30 hidden h-svh w-64 shrink-0 flex-col lg:flex">
        {SidebarBody}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
            aria-hidden
          />
          <aside className="bg-dark-navy1 relative flex h-full w-72 max-w-[85vw] flex-col shadow-2xl">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 flex size-8 items-center justify-center rounded-md text-white/60 hover:bg-white/10 hover:text-white"
              aria-label="Close menu"
            >
              <X className="size-5" />
            </button>
            {SidebarBody}
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col lg:pl-64">
        {TopBar}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
