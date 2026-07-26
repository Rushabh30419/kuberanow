import Link from "next/link";
import JobForm from "../JobForm";

export default async function NewJobPage() {
  return (
    <div>
      <Link href="/admin/jobs" className="text-xs text-slate-500 hover:text-slate-900">
        ← Back to jobs
      </Link>
      <h1 className="mt-2 text-2xl font-bold text-slate-900">New job</h1>
      <div className="mt-6 max-w-2xl rounded-xl border border-slate-200 bg-white p-6">
        <JobForm />
      </div>
    </div>
  );
}
