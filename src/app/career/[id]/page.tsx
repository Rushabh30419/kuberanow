import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Briefcase, MapPin, Wallet, Users } from "lucide-react";
import { prisma } from "@/lib/db";
import { PageShell } from "@/components/company/PageShell";

export const dynamic = "force-dynamic";

type Params = Promise<{ id: string }>;

export default async function JobDetailPage({ params }: { params: Params }) {
  const { id } = await params;
  const job = await prisma.job.findUnique({ where: { id } });
  if (!job || !job.active) notFound();

  return (
    <PageShell>
      <div className="border-border-soft bg-surface shadow-content-panel w-full max-w-3xl min-w-0 rounded-lg border p-4 md:p-8">
        <Link
          href="/career"
          className="text-career-muted hover:text-primary inline-flex items-center gap-1 text-xs font-semibold"
        >
          <ArrowLeft className="size-3.5" /> All openings
        </Link>

        <header className="mt-4">
          <h1 className="text-career-heading text-2xl leading-7 font-bold md:text-3xl">
            {job.title}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-600">
            <Pill icon={<MapPin className="size-3.5" />}>{job.location}</Pill>
            <Pill icon={<Briefcase className="size-3.5" />}>{job.type}</Pill>
            <Pill icon={<Users className="size-3.5" />}>{job.mode}</Pill>
            {job.experience && <Pill>{job.experience}</Pill>}
            {job.salary && (
              <Pill icon={<Wallet className="size-3.5" />}>{job.salary}</Pill>
            )}
          </div>
        </header>

        <section className="mt-6 border-t border-career-stroke pt-5">
          <h2 className="text-career-heading text-sm font-semibold tracking-wide uppercase">
            About the role
          </h2>
          {job.description ? (
            <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-700">
              {job.description}
            </p>
          ) : (
            <p className="mt-3 text-sm italic text-slate-500">
              No description has been provided for this role yet.
            </p>
          )}
        </section>

        <section className="mt-6 grid gap-3 rounded-md border border-career-stroke bg-career-tint p-4 text-sm text-slate-700 sm:grid-cols-2">
          <KV k="Location" v={job.location} />
          <KV k="Type" v={job.type} />
          <KV k="Mode" v={job.mode} />
          {job.experience && <KV k="Experience" v={job.experience} />}
          {job.salary && <KV k="Salary" v={job.salary} />}
          <KV k="Posted" v={new Date(job.createdAt).toLocaleDateString()} />
        </section>

        <div className="mt-7 flex flex-wrap items-center gap-3 border-t border-career-stroke pt-5">
          <Link
            href={`/career/${job.id}/apply`}
            className="bg-primary hover:bg-dark-navy1 inline-flex items-center gap-1.5 rounded-md px-5 py-2.5 text-sm font-semibold text-white transition-opacity"
          >
            Apply now <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/career"
            className="text-career-muted hover:text-primary text-sm font-semibold"
          >
            Browse other roles
          </Link>
        </div>
      </div>
    </PageShell>
  );
}

function Pill({ children, icon }: { children: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <span className="border-career-stroke bg-career-tint text-career-dark inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold">
      {icon}
      {children}
    </span>
  );
}

function KV({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <p className="text-[10px] font-semibold tracking-wide text-slate-500 uppercase">{k}</p>
      <p className="mt-0.5 text-sm font-semibold text-career-heading">{v}</p>
    </div>
  );
}
