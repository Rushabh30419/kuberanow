"use client";

import { useMemo, useState } from "react";
import { CalculatorLayout } from "../ui/CalculatorLayout";
import { Slider, ResultStat } from "../ui/Slider";

const inr = (n: number) =>
  "₹" + Math.round(n).toLocaleString("en-IN", { maximumFractionDigits: 0 });

export function SIPCalculator() {
  const [monthly, setMonthly] = useState(25000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10);

  const { invested, gains, maturity } = useMemo(() => {
    const n = years * 12;
    const i = rate / 100 / 12;
    const factor = Math.pow(1 + i, n);
    const maturityVal = i === 0 ? monthly * n : monthly * ((factor - 1) / i) * (1 + i);
    const investedVal = monthly * n;
    return {
      invested: investedVal,
      gains: maturityVal - investedVal,
      maturity: maturityVal,
    };
  }, [monthly, rate, years]);

  const investedPct = (invested / maturity) * 100 || 0;
  const gainsPct = 100 - investedPct;

  return (
    <CalculatorLayout
      title="SIP Calculator"
      subtitle="See how your monthly Systematic Investment Plan grows over time."
      formula="M = P × [((1 + i)^n − 1) / i] × (1 + i)"
    >
      {/* Inputs */}
      <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <Slider
          label="Monthly Investment"
          value={monthly}
          min={500}
          max={200000}
          step={500}
          onChange={setMonthly}
          format={inr}
        />
        <Slider
          label="Expected Annual Return"
          value={rate}
          min={1}
          max={30}
          step={0.5}
          onChange={setRate}
          suffix="%"
        />
        <Slider
          label="Time Period"
          value={years}
          min={1}
          max={40}
          onChange={setYears}
          suffix=" yrs"
        />
      </div>

      {/* Results */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <ResultStat label="Invested" value={inr(invested)} />
          <ResultStat label="Estimated Gains" value={inr(gains)} />
          <ResultStat label="Maturity Value" value={inr(maturity)} accent />
        </div>

        {/* Composition bar */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold tracking-widest text-slate-500 uppercase">
            Investment Breakdown
          </p>
          <div className="mt-4 flex h-3 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="bg-blue-600"
              style={{ width: `${investedPct}%` }}
              title={`Invested ${investedPct.toFixed(1)}%`}
            />
            <div
              className="bg-cyan-400"
              style={{ width: `${gainsPct}%` }}
              title={`Gains ${gainsPct.toFixed(1)}%`}
            />
          </div>
          <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-xs text-slate-600">
            <span className="inline-flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />
              Invested ({investedPct.toFixed(1)}%)
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-cyan-400" />
              Gains ({gainsPct.toFixed(1)}%)
            </span>
          </div>
        </div>
      </div>
    </CalculatorLayout>
  );
}
