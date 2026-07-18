import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

export const metadata: Metadata = {
  title: "About Us — KuberaNow",
  description: "KuberaNow — Gujarat's most trusted business media platform.",
};

const STATS = [
  { value: "13+ Cr", label: "New demat accounts nationally since 2020" },
  { value: "2.6 Cr", label: "Gujarati investors in the market" },
  { value: "15%", label: "Gujarat's share of India's demat accounts" },
  { value: "₹22L Cr", label: "Gujarat GSDP" },
];

const VALUES = [
  {
    title: "Credible Journalism",
    body: "Trusted, verified, Gujarati-first reporting that investors can act on — no rumor, no hype.",
    emoji: "🛡️",
  },
  {
    title: "Technology-Driven",
    body: "HD 4K cameras, robotic cameras and a digital-first delivery model built for mobile-first audiences.",
    emoji: "⚙️",
  },
  {
    title: "Integrated Communication",
    body: "Multi-platform reach across digital, broadcast, bulletin and social channels.",
    emoji: "🔗",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        title="About KuberaNow"
        subtitle="Building the definitive home for Gujarati prosperity — bridging sophisticated financial intelligence with regional-language accessibility."
        breadcrumb="Company"
      />
      <main className="bg-background-color mx-auto w-full max-w-5xl flex-1 px-4 py-12">
        {/* Mission */}
        <RevealOnScroll className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-xs font-semibold tracking-widest text-blue-700 uppercase">
            Our Mission
          </p>
          <h2 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">
            To become Gujarat&apos;s most trusted and influential business media
            platform.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600">
            India&apos;s retail investing landscape has undergone a permanent,
            structural shift. Between 2020 and 2026, a post-COVID surge added over
            13 crore new demat accounts nationally. At the epicenter of this
            revolution is Gujarat — 5% of India&apos;s population, but 15% of its
            demat accounts.
          </p>
          <p className="mt-3 text-base leading-relaxed text-slate-600">
            Yet despite this massive audience, there is no dedicated, high-quality
            Gujarati business media platform. KuberaNow exists to close that gap.
          </p>
        </RevealOnScroll>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <RevealOnScroll
              key={s.label}
              delay={0.05 * i}
              className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm"
            >
              <p className="from-blue-700 to-cyan-600 bg-gradient-to-br bg-clip-text text-2xl font-bold text-transparent sm:text-3xl">
                {s.value}
              </p>
              <p className="mt-2 text-xs text-slate-600">{s.label}</p>
            </RevealOnScroll>
          ))}
        </div>

        {/* Values */}
        <h2 className="mt-16 text-2xl font-bold text-slate-900 sm:text-3xl">
          What we stand for
        </h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          {VALUES.map((v, i) => (
            <RevealOnScroll
              key={v.title}
              delay={0.05 * i}
              className="rounded-2xl border border-slate-200 bg-white/70 p-6 shadow-sm"
            >
              <span className="text-3xl">{v.emoji}</span>
              <h3 className="mt-3 text-lg font-semibold text-slate-900">
                {v.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {v.body}
              </p>
            </RevealOnScroll>
          ))}
        </div>

        {/* Vision */}
        <RevealOnScroll className="mt-12 overflow-hidden rounded-3xl bg-gradient-to-r from-dark-navy2 to-primary-navy p-8 text-white shadow-sm">
          <p className="text-xs font-semibold tracking-widest text-[#00FFEE] uppercase">
            The Opportunity
          </p>
          <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
            The capital is there. The audience is searching. The timing is
            mathematically absolute.
          </h2>
          <p className="mt-4 max-w-2xl text-sm text-white/80 sm:text-base">
            We are not simply launching a business digital TV — we are building the
            definitive home for Gujarati prosperity. KuberaNow arrives at the
            perfect inflection point.
          </p>
        </RevealOnScroll>
      </main>
    </>
  );
}
