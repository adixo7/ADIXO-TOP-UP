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
                className={`group relative isolate flex min-h-[68px] w-full items-center gap-1.5 overflow-hidden rounded-xl border px-2 py-2 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/70 ${
                  isSelected
                    ? "border-orange-400/70 bg-gradient-to-r from-orange-500/15 via-orange-500/[0.06] to-zinc-950 text-white shadow-[0_12px_26px_-20px_rgba(249,115,22,0.95)]"
                    : "border-zinc-800 bg-gradient-to-br from-zinc-900/95 to-zinc-950 text-zinc-300 hover:border-orange-400/40 hover:from-zinc-900 hover:to-black"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`pointer-events-none absolute inset-y-2 left-0 w-[2px] rounded-r-full transition-colors ${
                    isSelected
                      ? "bg-orange-400"
                      : "bg-transparent group-hover:bg-orange-400/50"
                  }`}
                />

                <span
                  aria-hidden="true"
                  className={`relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border transition-colors ${
                    isSelected
                      ? "border-orange-400/30 bg-orange-500/10 text-orange-300"
                      : "border-zinc-800 bg-black/30 text-zinc-500 group-hover:border-zinc-700 group-hover:text-zinc-300"
                  }`}
                >
                  <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                    <path
                      d={value === "high" ? "M10 15V5m0 0L6 9m4-4 4 4" : "M10 5v10m0 0 4-4m-4 4-4-4"}
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>

                <span className="relative z-10 min-w-0 flex-1">
                  <span className="block truncate text-[12px] font-bold leading-4 text-white">{label}</span>
                  <span
                    className={`mt-0.5 block whitespace-nowrap text-[9px] font-semibold uppercase leading-3 tracking-[0.08em] ${
                      isSelected ? "text-orange-200/80" : "text-zinc-500 group-hover:text-zinc-400"
                    }`}
                  >
                    Sensitivity
                  </span>
                </span>

                <span
                  aria-hidden="true"
                  className={`relative z-10 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-all ${
                    isSelected
                      ? "border-orange-400 bg-orange-400 text-zinc-950"
                      : "border-zinc-700 bg-black/20 text-transparent group-hover:border-zinc-500"
                  }`}
                >
                  {isSelected && (
                    <svg
                      className="h-2.5 w-2.5"
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
