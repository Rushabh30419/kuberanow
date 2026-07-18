"use client";

import { useMemo, useState } from "react";
import { CalculatorLayout } from "../ui/CalculatorLayout";
import { Slider, ResultStat } from "../ui/Slider";

const inr = (n: number) =>
  "₹" + Math.round(n).toLocaleString("en-IN", { maximumFractionDigits: 0 });

export function FDCalculator() {
  const [principal, setPrincipal] = useState(100000);
  const [rate, setRate] = useState(7);
  const [years, setYears] = useState(5);

  const { maturity, interest } = useMemo(() => {
    const m = principal * Math.pow(1 + rate / 100, years);
    return { maturity: m, interest: m - principal };
  }, [principal, rate, years]);

  return (
    <CalculatorLayout
      title="FD Calculator"
      subtitle="Estimate the maturity value of a Fixed Deposit with compound interest."
      formula="A = P × (1 + r/100)^t"
    >
      <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <Slider
          label="Principal Amount"
          value={principal}
          min={1000}
          max={10000000}
          step={1000}
          onChange={setPrincipal}
          format={inr}
        />
        <Slider
          label="Interest Rate (p.a.)"
          value={rate}
          min={1}
          max={15}
          step={0.1}
          onChange={setRate}
          suffix="%"
        />
        <Slider
          label="Time Period"
          value={years}
          min={1}
          max={30}
          onChange={setYears}
          suffix=" yrs"
        />
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-4">
        <ResultStat label="Principal" value={inr(principal)} />
        <ResultStat label="Total Interest" value={inr(interest)} />
        <ResultStat label="Maturity Value" value={inr(maturity)} accent />
      </div>
    </CalculatorLayout>
  );
}
