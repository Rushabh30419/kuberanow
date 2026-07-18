import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Financial Tools — KuberaNow",
  description: "Free calculators for SIP, FD, EMI, tax and SWP.",
};

const TOOLS = [
  {
    slug: "sip",
    title: "SIP Calculator",
    desc: "Project the future value of your monthly mutual fund investments.",
    emoji: "📈",
  },
  {
    slug: "fd",
    title: "FD Calculator",
    desc: "Estimate the maturity value of a Fixed Deposit with compound interest.",
    emoji: "🏦",
  },
  {
    slug: "emi",
    title: "EMI Calculator",
    desc: "Compute your monthly loan EMI and total interest payable.",
    emoji: "🏠",
  },
  {
    slug: "tax",
    title: "Tax Calculator",
    desc: "Compare the New vs Old income tax regime for FY 2025-26.",
    emoji: "🧾",
  },
  {
    slug: "swp",
    title: "SWP Calculator",
    desc: "See how long your corpus lasts with regular monthly withdrawals.",
    emoji: "💸",
  },
];

export default function ToolsPage() {
  return (
    <>
      <PageHeader
        title="Financial Tools"
        subtitle="Free, fast calculators to help you plan investments, loans and taxes."
        breadcrumb="Tools"
      />
      <main className="bg-background-color mx-auto w-full max-w-7xl flex-1 px-4 py-10">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map((t) => (
            <Link
              key={t.slug}
              href={`/tools/${t.slug}`}
              className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-blue-500/40 hover:shadow-md"
            >
              <span className="text-3xl">{t.emoji}</span>
              <h2 className="mt-4 text-lg font-semibold text-slate-900 transition-colors group-hover:text-blue-700">
                {t.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {t.desc}
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-blue-700">
                Open calculator
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </span>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
