"use client";

import { useMemo, useState } from "react";
import { CalculatorLayout } from "../ui/CalculatorLayout";
import { Slider, ResultStat } from "../ui/Slider";

const inr = (n: number) =>
  "₹" + Math.round(n).toLocaleString("en-IN", { maximumFractionDigits: 0 });

// New regime FY 2025-26 slabs (post rebate u/s 87A up to 12L)
const NEW_SLABS: [number, number][] = [
  [400000, 0],
  [800000, 0.05],
  [1200000, 0.1],
  [1600000, 0.15],
  [2000000, 0.2],
  [Infinity, 0.25],
];
// Old regime slabs (simplified, no exemptions modelled beyond std deduction)
const OLD_SLABS: [number, number][] = [
  [250000, 0],
  [500000, 0.05],
  [1000000, 0.2],
  [Infinity, 0.3],
];

function taxFromSlabs(taxable: number, slabs: [number, number][]): number {
  let tax = 0;
  let prev = 0;
  for (const [cap, rate] of slabs) {
    if (taxable <= prev) break;
    const slice = Math.min(taxable, cap) - prev;
    tax += slice * rate;
    prev = cap;
  }
  return tax;
}

export function TaxCalculator() {
  const [income, setIncome] = useState(1200000);
  const [deductions, setDeductions] = useState(150000);

  const { newTax, oldTax, best } = useMemo(() => {
    const stdDeduction = 75000; // new regime
    const oldStd = 50000;
    const newTaxable = Math.max(0, income - stdDeduction);
    const oldTaxable = Math.max(0, income - oldStd - deductions);

    let nt = taxFromSlabs(newTaxable, NEW_SLABS);
    // 87A rebate up to 12L taxable under new regime
    if (newTaxable <= 1200000) nt = 0;
    nt *= 1.04; // 4% cess

    const ot = taxFromSlabs(oldTaxable, OLD_SLABS) * 1.04;
    return {
      newTax: nt,
      oldTax: ot,
      best: nt <= ot ? "New" : "Old",
    };
  }, [income, deductions]);

  return (
    <CalculatorLayout
      title="Tax Calculator"
      subtitle="Compare the New vs Old tax regime for FY 2025-26 (Assessment Year 2026-27)."
      formula="Tax = Σ(slab × rate) + 4% Health & Education Cess"
    >
      <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <Slider
          label="Gross Annual Income"
          value={income}
          min={300000}
          max={50000000}
          step={50000}
          onChange={setIncome}
          format={inr}
        />
        <Slider
          label="Deductions (80C, 80D, HRA — old regime only)"
          value={deductions}
          min={0}
          max={500000}
          step={10000}
          onChange={setDeductions}
          format={inr}
        />
      </div>

      <div className="space-y-4">
        <div className="grid min-w-0 grid-cols-1 gap-4">
          <ResultStat
            label="New Regime Tax"
            value={inr(newTax)}
            accent={best === "New"}
          />
          <ResultStat
            label="Old Regime Tax"
            value={inr(oldTax)}
            accent={best === "Old"}
          />
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold tracking-widest text-slate-500 uppercase">
            Recommendation
          </p>
          <p className="mt-2 text-base text-slate-700">
            The <span className="font-bold text-blue-700">{best} Regime</span>{" "}
            saves you{" "}
            <span className="font-bold text-blue-700">
              {inr(Math.abs(newTax - oldTax))}
            </span>{" "}
            in taxes for this income.
          </p>
        </div>
      </div>
    </CalculatorLayout>
  );
}
