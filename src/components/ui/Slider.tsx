"use client";

type Props = {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  format?: (v: number) => string;
  suffix?: string;
};

export function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  format,
  suffix,
}: Props) {
  const display = format ? format(value) : `${value}${suffix ?? ""}`;
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <label className="text-sm font-medium text-slate-700">{label}</label>
        <span className="text-lg font-bold text-blue-700">{display}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-blue-600"
      />
      <div className="mt-1 flex justify-between text-[10px] text-slate-400">
        <span>{format ? format(min) : `${min}${suffix ?? ""}`}</span>
        <span>{format ? format(max) : `${max}${suffix ?? ""}`}</span>
      </div>
    </div>
  );
}

export function ResultStat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
      <p className="text-xs text-slate-500">{label}</p>
      <p
        className={`mt-1 break-words text-2xl font-bold leading-tight tracking-tight sm:text-3xl ${
          accent ? "text-blue-700" : "text-slate-900"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
