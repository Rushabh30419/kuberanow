import type { Metadata } from "next";
import { CareerBoard, type Job } from "@/components/company/CareerBoard";
import { PageShell } from "@/components/company/PageShell";

export const metadata: Metadata = {
  title: "Careers | KuberaNow",
  description:
    "Join KuberaNow — Gujarat's dedicated Gujarati-language business news digital TV. Open roles across editorial, production, design, and social media.",
};

const JOBS: Job[] = [
  {
    title: "Anchor Cum Producer",
    experience: "2-5 years | Freshers",
    salary: "Competitive & Best in Industry",
    location: "Ahmedabad",
    type: "Full-time",
    mode: "On-site",
  },
  {
    title: "News Reporter",
    experience: "2-5 years | Freshers",
    salary: "Competitive & Best in Industry",
    location: "Ahmedabad",
    type: "Full-time",
    mode: "On-site",
  },
  {
    title: "Copy Editor/Sub Editor",
    experience: "2-5 years | Freshers",
    salary: "Competitive & Best in Industry",
    location: "Ahmedabad",
    type: "Full-time",
    mode: "On-site",
  },
  {
    title: "Graphic Designer/Video Editor",
    experience: "2-5 years | Freshers",
    salary: "Competitive & Best in Industry",
    location: "Ahmedabad",
    type: "Full-time",
    mode: "On-site",
  },
  {
    title: "Social Media Manager",
    experience: "2-5 years | Freshers",
    salary: "Competitive & Best in Industry",
    location: "Ahmedabad",
    type: "Full-time",
    mode: "On-site",
  },
];

export default function CareerPage() {
  return (
    <PageShell>
      <div className="border-border-soft bg-surface shadow-content-panel w-full max-w-[950px] min-w-0 rounded-lg border p-3 md:p-5">
        <section className="flex flex-col gap-3 md:gap-6">
          <CareerBoard jobs={JOBS} />
        </section>
      </div>
    </PageShell>
  );
}
