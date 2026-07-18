"use client";

import { useMemo, useState } from "react";
import { CalculatorLayout } from "../ui/CalculatorLayout";
import { Slider, ResultStat } from "../ui/Slider";

const inr = (n: number) =>
  "₹" + Math.round(n).toLocaleString("en-IN", { maximumFractionDigits: 0 });

export function EMICalculator() {
  const [principal, setPrincipal] = useState(2500000);
  const [rate, setRate] = useState(9);
  const [years, setYears] = useState(20);

  const { emi, totalInterest, totalPayment } = useMemo(() => {
    const n = years * 12;
    const r = rate / 100 / 12;
    const factor = Math.pow(1 + r, n);
    const emiVal = r === 0 ? principal / n : (principal * r * factor) / (factor - 1);
    const payment = emiVal * n;
    return {
      emi: emiVal,
      totalInterest: payment - principal,
      totalPayment: payment,
    };
  }, [principal, rate, years]);

  return (
    <CalculatorLayout
      title="EMI Calculator"
      subtitle="Calculate your monthly EMI and total interest for any loan."
      formula="EMI = [P × r × (1+r)^n] / [(1+r)^n − 1]"
    >
      <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <Slider
          label="Loan Amount"
          value={principal}
          min={50000}
          max={50000000}
          step={50000}
          onChange={setPrincipal}
          format={inr}
        />
        <Slider
          label="Interest Rate (p.a.)"
          value={rate}
          min={1}
          max={20}
          step={0.1}
          onChange={setRate}
          suffix="%"
        />
        <Slider
          label="Loan Tenure"
          value={years}
          min={1}
          max={30}
          onChange={setYears}
          suffix=" yrs"
        />
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-4">
        <ResultStat label="Monthly EMI" value={inr(emi)} accent />
        <ResultStat label="Total Interest" value={inr(totalInterest)} />
        <ResultStat label="Total Payment" value={inr(totalPayment)} />
      </div>
    </CalculatorLayout>
  );
}
