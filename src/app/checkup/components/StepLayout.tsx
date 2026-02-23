"use client";

import { ProgressBar } from "./ProgressBar";

interface StepLayoutProps {
  step: number;
  title: string;
  helper?: string;
  children: React.ReactNode;
  onBack?: () => void;
  showBack?: boolean;
}

export function StepLayout({
  step,
  title,
  helper,
  children,
  onBack,
  showBack = true,
}: StepLayoutProps) {
  return (
    <div className="max-w-md mx-auto px-4 py-6 pb-24">
      <div className="space-y-6">
        <ProgressBar step={step} />
        <div className="flex items-start gap-3">
          {showBack && onBack && (
            <button
              type="button"
              onClick={onBack}
              className="p-2 -ml-1 rounded-xl text-gray-500 hover:bg-emerald-50 hover:text-gray-700 transition-all duration-200 flex-shrink-0"
              aria-label="Буцах"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          )}
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            {helper && (
              <p className="text-sm text-gray-500 mt-1">{helper}</p>
            )}
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 transition-all duration-300">
          {children}
        </div>
      </div>
    </div>
  );
}
