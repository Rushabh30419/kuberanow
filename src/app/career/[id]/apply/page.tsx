import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/db";
import { PageShell } from "@/components/company/PageShell";
import ApplyForm from "@/components/company/ApplyForm";

export const dynamic = "force-dynamic";

type Params = Promise<{ id: string }>;

export default async function ApplyPage({ params }: { params: Params }) {
  const { id } = await params;
  const job = await prisma.job.findUnique({ where: { id } });
  if (!job || !job.active) notFound();

  return (
    <PageShell>
      <div className="w-full max-w-2xl min-w-0">
        <Link
          href="/career"
          className="text-career-muted hover:text-primary inline-flex items-center gap-1 text-xs font-semibold"
        >
          <ArrowLeft className="size-3.5" /> All openings
        </Link>
        <div className="mt-3">
          <ApplyForm
            job={{
              id: job.id,
              title: job.title,
              location: job.location,
              type: job.type,
              mode: job.mode,
            }}
          />
        </div>
      </div>
    </PageShell>
  );
}
