import Link from "next/link";
import { notFound } from "next/navigation";
import JobForm from "../JobForm";
import { prisma } from "@/lib/db";

export default async function EditJobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const job = await prisma.job.findUnique({ where: { id } });
  if (!job) notFound();

  return (
    <div>
      <Link href="/admin/jobs" className="text-xs text-slate-500 hover:text-slate-900">
        ← Back to jobs
      </Link>
      <h1 className="mt-2 text-2xl font-bold text-slate-900">Edit job</h1>
      <div className="mt-6 max-w-2xl rounded-xl border border-slate-200 bg-white p-6">
        <JobForm job={job} />
      </div>
    </div>
  );
}
