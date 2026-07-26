import Link from "next/link";
import { prisma } from "@/lib/db";
import { deleteJob } from "@/lib/actions";
import DeleteButton from "../DeleteButton";

export default async function JobsList() {
  const jobs = await prisma.job.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Jobs</h1>
          <p className="mt-1 text-sm text-slate-500">{jobs.length} total · {jobs.filter(j => j.active).length} active</p>
        </div>
        <Link href="/admin/jobs/new" className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800">
          + New job
        </Link>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {jobs.map((j) => (
          <div key={j.id} className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <Link href={`/admin/jobs/${j.id}`} className="font-semibold text-slate-900 hover:text-blue-700">
                  {j.title}
                </Link>
                <p className="mt-1 text-xs text-slate-500">
                  {j.experience} · {j.location} · {j.type} · {j.mode}
                </p>
              </div>
              <span
                className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${
                  j.active ? "bg-green-50 text-green-700" : "bg-slate-100 text-slate-500"
                }`}
              >
                {j.active ? "Active" : "Hidden"}
              </span>
            </div>
            <div className="mt-3 flex gap-3 text-xs font-semibold">
              <Link href={`/admin/jobs/${j.id}`} className="text-blue-700 hover:underline">Edit</Link>
              <DeleteButton id={j.id} action={deleteJob} />
            </div>
          </div>
        ))}
        {jobs.length === 0 && (
          <p className="col-span-full rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500">
            No jobs yet.
          </p>
        )}
      </div>
    </div>
  );
}
