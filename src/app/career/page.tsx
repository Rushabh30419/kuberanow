import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

export const metadata: Metadata = {
  title: "Careers — KuberaNow",
  description: "Join KuberaNow — build the future of Gujarati business media.",
};

const JOBS = [
  {
    title: "Senior Business Reporter",
    location: "Ahmedabad · Hybrid",
    type: "Full-time",
    dept: "Editorial",
    desc: "Break and own market-moving stories across Gujarat's business landscape. 5+ years covering markets or corporate India.",
  },
  {
    title: "Gujarati Financial Editor",
    location: "Ahmedabad · On-site",
    type: "Full-time",
    dept: "Editorial",
    desc: "Lead our Gujarati-language desk, ensuring clarity, accuracy and authority in every story. Native Gujarati fluency essential.",
  },
  {
    title: "Video Producer, Digital TV",
    location: "Gandhinagar · On-site",
    type: "Full-time",
    dept: "Production",
    desc: "Produce daily business shows for KuberaNow Digital TV in 4K. Experience with multi-camera studio production required.",
  },
  {
    title: "Full-Stack Engineer",
    location: "Remote · India",
    type: "Full-time",
    dept: "Engineering",
    desc: "Build and scale our news, market-data and tools products. Next.js, TypeScript, Node.js and cloud experience.",
  },
  {
    title: "Data Journalist",
    location: "Ahmedabad · Hybrid",
    type: "Full-time",
    dept: "Editorial",
    desc: "Find the story in the numbers. Analyze SEBI, NSDL, RBI and corporate filings to produce data-driven features.",
  },
  {
    title: "Growth & Social Media Lead",
    location: "Ahmedabad · Hybrid",
    type: "Full-time",
    dept: "Marketing",
    desc: "Own our social presence and audience growth across Instagram, YouTube, X and LinkedIn. Bilingual a plus.",
  },
];

const PERKS = [
  { emoji: "🚀", title: "High-impact work", desc: "Shape the narrative for millions of Gujarati investors." },
  { emoji: "🌐", title: "Modern newsroom", desc: "4K studios, digital-first tools and a culture of curiosity." },
  { emoji: "📈", title: "Real ownership", desc: "Flat structure where your ideas ship fast." },
  { emoji: "🤝", title: "Great benefits", desc: "Health insurance, learning budget and flexible policies." },
];

export default function CareerPage() {
  return (
    <>
      <PageHeader
        title="Careers at KuberaNow"
        subtitle="Help us build Gujarat's most trusted business media platform. We're hiring across editorial, production, engineering and marketing."
        breadcrumb="Company"
      />
      <main className="bg-background-color mx-auto w-full max-w-5xl flex-1 px-4 py-12">
        {/* Perks */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PERKS.map((p, i) => (
            <RevealOnScroll
              key={p.title}
              delay={0.05 * i}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <span className="text-2xl">{p.emoji}</span>
              <h3 className="mt-2 text-sm font-semibold text-slate-900">
                {p.title}
              </h3>
              <p className="mt-1 text-xs text-slate-600">{p.desc}</p>
            </RevealOnScroll>
          ))}
        </div>

        {/* Open roles */}
        <h2 className="mt-12 text-2xl font-bold text-slate-900 sm:text-3xl">
          Open positions
        </h2>
        <div className="mt-6 grid gap-4">
          {JOBS.map((j, i) => (
            <RevealOnScroll
              key={j.title}
              delay={0.03 * i}
              className="group flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-blue-500/40 hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-semibold text-slate-900 group-hover:text-blue-700">
                    {j.title}
                  </h3>
                  <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-wider text-blue-700 uppercase">
                    {j.dept}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {j.desc}
                </p>
                <p className="mt-3 text-xs text-slate-500">
                  {j.location} · {j.type}
                </p>
              </div>
              <a
                href="/contact"
                className="shrink-0 self-start rounded-full border border-slate-200 px-5 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-blue-500 hover:text-blue-700 sm:self-center"
              >
                Apply →
              </a>
            </RevealOnScroll>
          ))}
        </div>

        {/* No-fit CTA */}
        <RevealOnScroll className="mt-12 rounded-3xl border border-slate-200 bg-white/70 p-8 text-center shadow-sm">
          <p className="text-sm text-slate-600">
            Don&apos;t see the right role? We&apos;re always looking for great
            people.
          </p>
          <a
            href="/contact"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-blue-700 px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-105"
          >
            Send us your profile →
          </a>
        </RevealOnScroll>
      </main>
    </>
  );
}
