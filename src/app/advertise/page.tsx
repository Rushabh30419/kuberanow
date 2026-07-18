import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

export const metadata: Metadata = {
  title: "Advertise — KuberaNow",
  description: "Reach Gujarat's most active investors and entrepreneurs.",
};

const SLOTS = [
  {
    name: "Display Banners",
    desc: "High-visibility leaderboard and sidebar placements across market and news pages.",
    reach: "2M+ monthly impressions",
  },
  {
    name: "Sponsored Content",
    desc: "Native, editorial-grade articles that educate Gujarati investors about your brand.",
    reach: "Avg. 3 min read time",
  },
  {
    name: "Newsletter Takeover",
    desc: "Exclusive sponsorship of our daily market briefing delivered to engaged subscribers.",
    reach: "1.2L+ subscribers",
  },
  {
    name: "Video & Pre-roll",
    desc: "Brand-safe video inventory on KuberaNow Digital TV across web and apps.",
    reach: "4K HD inventory",
  },
];

const AUDIENCE = [
  "2.6 Cr active Gujarati investors",
  "Decision-makers across 5 Lakh MSMEs",
  "10,000+ startups & founders",
  "Affluent, mobile-first, financially literate",
];

export default function AdvertisePage() {
  return (
    <>
      <PageHeader
        title="Advertise with KuberaNow"
        subtitle="Reach Gujarat's most active investors, entrepreneurs and wealth creators — at the moment they're making financial decisions."
        breadcrumb="Company"
      />
      <main className="bg-background-color mx-auto w-full max-w-5xl flex-1 px-4 py-12">
        {/* Audience */}
        <RevealOnScroll className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-xs font-semibold tracking-widest text-blue-700 uppercase">
            Who you reach
          </p>
          <h2 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">
            An audience that&apos;s actively investing
          </h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {AUDIENCE.map((a) => (
              <li
                key={a}
                className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/60 px-4 py-3 text-sm text-slate-700"
              >
                <span className="text-blue-600">●</span>
                {a}
              </li>
            ))}
          </ul>
        </RevealOnScroll>

        {/* Ad slots */}
        <h2 className="mt-12 text-2xl font-bold text-slate-900 sm:text-3xl">
          Advertising options
        </h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {SLOTS.map((s, i) => (
            <RevealOnScroll
              key={s.name}
              delay={0.05 * i}
              className="rounded-2xl border border-slate-200 bg-white/70 p-6 shadow-sm transition-colors hover:border-blue-500/40 hover:bg-white"
            >
              <h3 className="text-lg font-semibold text-slate-900">{s.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {s.desc}
              </p>
              <p className="mt-4 inline-block rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-700">
                {s.reach}
              </p>
            </RevealOnScroll>
          ))}
        </div>

        {/* CTA */}
        <RevealOnScroll className="mt-12 overflow-hidden rounded-3xl bg-gradient-to-r from-dark-navy2 to-primary-navy p-8 text-white shadow-sm">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Let&apos;s build a campaign together
          </h2>
          <p className="mt-3 max-w-xl text-sm text-white/80 sm:text-base">
            Get our full media kit, rate card and case studies. Our partnerships
            team will help you craft the right plan for your goals.
          </p>
          <a
            href="/contact"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#00FFEE] px-6 py-3 text-sm font-semibold text-dark-navy1 transition-transform hover:scale-105"
          >
            Request media kit →
          </a>
        </RevealOnScroll>
      </main>
    </>
  );
}
