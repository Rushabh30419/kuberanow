import type { Metadata } from "next";
import { CareerBoard } from "@/components/company/CareerBoard";
import { PageShell } from "@/components/company/PageShell";
import { getJobs } from "@/lib/data-access";

export const metadata: Metadata = {
  title: "Careers | KuberaNow",
  description:
    "Join KuberaNow — Gujarat's dedicated Gujarati-language business news digital TV. Open roles across editorial, production, design, and social media.",
};

export default async function CareerPage() {
  const jobs = await getJobs();
  return (
    <PageShell>
      <div className="border-border-soft bg-surface shadow-content-panel w-full max-w-[950px] min-w-0 rounded-lg border p-3 md:p-5">
        <section className="flex flex-col gap-3 md:gap-6">
          <CareerBoard jobs={jobs} />
        </section>
      </div>
    </PageShell>
  );
}
