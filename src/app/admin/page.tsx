import Link from "next/link";
import { getAdminCounts } from "@/lib/data-access";

export default async function AdminHome() {
  const counts = await getAdminCounts();

  const cards = [
    { label: "Articles", value: counts.articles, href: "/admin/articles", color: "bg-blue-50 text-blue-700" },
    { label: "Jobs", value: counts.jobs, href: "/admin/jobs", color: "bg-emerald-50 text-emerald-700" },
    { label: "Users", value: counts.users, href: "/admin/users", color: "bg-violet-50 text-violet-700" },
    { label: "Messages", value: counts.submissions, href: "/admin/contact", color: "bg-amber-50 text-amber-700" },
    { label: "Applications", value: counts.applications, href: "/admin/applications", color: "bg-rose-50 text-rose-700" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
      <p className="mt-1 text-sm text-slate-500">Overview of KuberaNow content and activity.</p>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="rounded-xl border border-slate-200 bg-white p-5 transition hover:border-slate-300 hover:shadow-sm"
          >
            <div className={`inline-flex rounded-md px-2 py-0.5 text-xs font-semibold ${c.color}`}>
              {c.label}
            </div>
            <p className="mt-3 text-3xl font-bold text-slate-900">{c.value}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="text-sm font-semibold text-slate-900">Quick actions</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href="/admin/articles/new" className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800">
            + New article
          </Link>
          <Link href="/admin/jobs/new" className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-slate-400">
            + New job
          </Link>
          <Link href="/admin/market" className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-slate-400">
            Update market data
          </Link>
        </div>
      </div>
    </div>
  );
}
