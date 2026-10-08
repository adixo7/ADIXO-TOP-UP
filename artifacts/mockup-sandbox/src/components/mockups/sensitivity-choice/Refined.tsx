import React, { useState } from "react";
import "./_group.css";

type SensitivityLevel = "high" | "low";

export function Refined() {
  const [selected, setSelected] = useState<SensitivityLevel | null>("high");
  const choices: { value: SensitivityLevel; label: string }[] = [
    { value: "high", label: "High" },
    { value: "low", label: "Low" },
  ];

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#09090b] p-5">
      <section className="w-full max-w-[520px]">
        <div className="mb-2.5 flex items-center justify-between gap-3">
          <h2 className="font-['Oxanium'] text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-400">
            Sensitivity
          </h2>
          <span className="text-[10px] font-medium text-zinc-600">Choose one</span>
        </div>

        <div
          className="grid grid-cols-2 gap-2"
          role="group"
          aria-label="Choose sensitivity"
        >
          {choices.map(({ value, label }) => {
            const isSelected = selected === value;

            return (
              <button
                key={value}
                type="button"
                onClick={() => setSelected(value)}
                aria-label={`${label} sensitivity`}
                aria-pressed={isSelected}
                data-testid={`button-sensi-${value}-sensitivity`}
                className={`flex min-h-[52px] w-full items-center justify-between gap-3 rounded-lg border px-4 py-3 text-left transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/70 ${
                  isSelected
                    ? "border-orange-400/80 bg-orange-500/10 text-white shadow-[inset_0_0_0_1px_rgba(249,115,22,0.12)]"
                    : "border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:border-zinc-600 hover:bg-zinc-900 hover:text-zinc-200"
                }`}
              >
                <span className="text-sm font-semibold tracking-wide">{label}</span>
                <span
                  aria-hidden="true"
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors ${
                    isSelected
                      ? "border-orange-400 bg-orange-400 text-zinc-950"
                      : "border-zinc-600 bg-transparent"
                  }`}
                >
                  {isSelected && (
                    <svg
                      className="h-3 w-3"
                      viewBox="0 0 16 16"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="m3.5 8.5 3 3 6-7"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </section>
    </main>
  );
}
