import type { ReactNode } from "react";
import { PageHeader } from "./PageHeader";

type Props = {
  title: string;
  subtitle: string;
  children: ReactNode;
  formula?: string;
};

export function CalculatorLayout({ title, subtitle, children, formula }: Props) {
  return (
    <>
      <PageHeader title={title} subtitle={subtitle} breadcrumb="Tools" />
      <main className="bg-background-color mx-auto w-full max-w-5xl flex-1 px-4 py-10">
        <div className="grid min-w-0 gap-8 lg:grid-cols-2">{children}</div>

        {formula && (
          <div className="mt-8 rounded-xl border border-slate-200 bg-white/60 p-5">
            <p className="text-xs font-semibold tracking-widest text-slate-500 uppercase">
              Formula used
            </p>
            <p className="mt-2 font-mono text-sm text-slate-700">{formula}</p>
          </div>
        )}

        <p className="mt-6 text-xs text-slate-500 italic">
          These calculators are for illustration only and do not constitute
          financial advice. Actual returns vary with market conditions.
        </p>
      </main>
    </>
  );
}
