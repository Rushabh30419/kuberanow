"use client";

import { useMemo, useState } from "react";
import { CalculatorLayout } from "../ui/CalculatorLayout";
import { Slider, ResultStat } from "../ui/Slider";

const inr = (n: number) =>
  "₹" + Math.round(n).toLocaleString("en-IN", { maximumFractionDigits: 0 });

export function SWPCalculator() {
  const [corpus, setCorpus] = useState(5000000);
  const [withdrawal, setWithdrawal] = useState(30000);
  const [rate, setRate] = useState(8);
  const [years, setYears] = useState(15);

  const { finalBalance, totalWithdrawn, depletedYear } = useMemo(() => {
    let balance = corpus;
    let withdrawn = 0;
    const monthlyRate = rate / 100 / 12;
    let depletedAt: number | null = null;

    for (let y = 1; y <= years; y++) {
      for (let m = 0; m < 12; m++) {
        balance = balance * (1 + monthlyRate) - withdrawal;
        withdrawn += withdrawal;
        if (balance <= 0 && depletedAt === null) {
          depletedAt = y;
          balance = 0;
          break;
        }
      }
      if (balance <= 0) break;
    }
    return {
      finalBalance: Math.max(0, balance),
      totalWithdrawn: withdrawn,
      depletedYear: depletedAt,
    };
  }, [corpus, withdrawal, rate, years]);

  return (
    <CalculatorLayout
      title="SWP Calculator"
      subtitle="Estimate how long your corpus lasts with regular monthly withdrawals."
      formula="Each month: balance = balance × (1 + r/12) − withdrawal"
    >
      <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <Slider
          label="Total Investment (Corpus)"
          value={corpus}
          min={100000}
          max={50000000}
          step={100000}
          onChange={setCorpus}
          format={inr}
        />
        <Slider
          label="Monthly Withdrawal"
          value={withdrawal}
          min={1000}
          max={500000}
          step={1000}
          onChange={setWithdrawal}
          format={inr}
        />
        <Slider
          label="Expected Return"
          value={rate}
          min={1}
          max={20}
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

      <div className="space-y-4">
        <div className="grid min-w-0 grid-cols-1 gap-4">
          <ResultStat label="Total Withdrawn" value={inr(totalWithdrawn)} />
          <ResultStat label="Final Balance" value={inr(finalBalance)} accent />
          <ResultStat
            label="Corpus Lasts"
            value={depletedYear ? `${depletedYear} yrs` : `> ${years} yrs`}
          />
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold tracking-widest text-slate-500 uppercase">
            Summary
          </p>
          <p className="mt-2 text-sm text-slate-600">
            With a corpus of{" "}
            <span className="font-semibold text-slate-900">{inr(corpus)}</span>,
            withdrawing{" "}
            <span className="font-semibold text-slate-900">
              {inr(withdrawal)}/month
            </span>{" "}
            at{" "}
            <span className="font-semibold text-slate-900">{rate}% p.a.</span>{" "}
            expected return,{" "}
            {depletedYear
              ? `your corpus will be exhausted in ${depletedYear} years.`
              : `your corpus will last beyond ${years} years with ${inr(
                  finalBalance
                )} remaining.`}
          </p>
        </div>
      </div>
    </CalculatorLayout>
  );
}
