"use client";

const TOTAL_STEPS = 12;

export function ProgressBar({ step }: { step: number }) {
  const percent = Math.min(100, (step / TOTAL_STEPS) * 100);
  return (
    <div className="w-full">
      <p className="text-sm text-gray-500 mb-2">Алхам {step} / 12</p>
      <div className="h-2 w-full rounded-full bg-emerald-100 overflow-hidden">
        <div
          className="h-full rounded-full bg-emerald-600 transition-all duration-300 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
