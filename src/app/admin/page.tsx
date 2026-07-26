import Link from "next/link";
import {
  FileText,
  Briefcase,
  Users,
  Mail,
  Inbox,
  PlusCircle,
  LineChart,
} from "lucide-react";
import { getAdminCounts, getUserPermissions } from "@/lib/data-access";
import { requireEditor } from "@/lib/auth-guard";
import { PageHeader, StatCard, Card } from "@/components/admin/ui";

export default async function AdminHome() {
  const user = await requireEditor();
  const [counts, perms] = await Promise.all([getAdminCounts(), getUserPermissions(user.id)]);

  const cards = [
    { label: "Articles", value: counts.articles, href: "/admin/articles", icon: FileText, color: "navy" as const, show: perms.includes("articles.view") },
    { label: "Jobs", value: counts.jobs, href: "/admin/jobs", icon: Briefcase, color: "green" as const, show: perms.includes("jobs.view") },
    { label: "Users", value: counts.users, href: "/admin/users", icon: Users, color: "cyan" as const, show: perms.includes("users.view") },
    { label: "Messages", value: counts.submissions, href: "/admin/contact", icon: Mail, color: "amber" as const, show: perms.includes("contact.view") },
    { label: "Applications", value: counts.applications, href: "/admin/applications", icon: Inbox, color: "red" as const, show: perms.includes("applications.view") },
  ].filter((c) => c.show);

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle={`Welcome back, ${user.name ?? user.email}.`}
      />

      {cards.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {cards.map((c) => (
            <StatCard key={c.label} label={c.label} value={c.value} icon={c.icon} href={c.href} color={c.color} />
          ))}
        </div>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <h2 className="text-sm font-semibold text-career-heading">Quick actions</h2>
          <p className="mt-1 text-xs text-slate-500">Jump straight into the most common tasks.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {perms.includes("articles.create") && (
              <Link href="/admin/articles/new" className="inline-flex items-center gap-2 rounded-lg bg-primary-navy px-4 py-2 text-sm font-semibold text-white transition hover:bg-dark-navy1">
                <PlusCircle className="size-4" /> New article
              </Link>
            )}
            {perms.includes("jobs.create") && (
              <Link href="/admin/jobs/new" className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                <PlusCircle className="size-4" /> New job
              </Link>
            )}
            {perms.includes("market.edit") && (
              <Link href="/admin/market" className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                <LineChart className="size-4" /> Update market data
              </Link>
            )}
            {perms.includes("users.create") && (
              <Link href="/admin/users/new" className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                <PlusCircle className="size-4" /> Invite user
              </Link>
            )}
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="text-sm font-semibold text-career-heading">Your access</h2>
          <p className="mt-1 text-xs text-slate-500">
            You have <span className="font-semibold text-slate-700">{perms.length}</span> permissions assigned to your role.
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {perms.slice(0, 8).map((p) => (
              <span key={p} className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                {p}
              </span>
            ))}
            {perms.length > 8 && (
              <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-400">
                +{perms.length - 8} more
              </span>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
