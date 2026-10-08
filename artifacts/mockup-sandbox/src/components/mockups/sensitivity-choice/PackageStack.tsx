import React, { useState } from "react";
import "./_group.css";

type SensitivityPackageTier = "basic" | "premium" | "elite";

interface SensitivityPackage {
  id: string;
  unit: string;
  price: number;
  currency: string;
}

const packages: SensitivityPackage[] = [
  { id: "android-basic", unit: "Basic Sensitivity", price: 450, currency: "BDT" },
  { id: "android-premium", unit: "Premium Sensitivity", price: 700, currency: "BDT" },
  { id: "android-elite", unit: "Elite Sensitivity", price: 999, currency: "BDT" },
];

const getSensitivityPackageTier = (unit: string): SensitivityPackageTier => {
  const normalizedUnit = unit.toLowerCase();
  if (normalizedUnit.includes("elite")) return "elite";
  if (normalizedUnit.includes("premium")) return "premium";
  return "basic";
};

const tierStyles: Record<
  SensitivityPackageTier,
  { card: string; accent: string; icon: string; price: string; selected: string; check: string }
> = {
  basic: {
    card: "border-orange-500/20 bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-950 hover:border-orange-400/60 hover:shadow-[0_14px_34px_-26px_rgba(249,115,22,0.9)]",
    accent: "from-orange-300/80 to-orange-600",
    icon: "border-orange-500/25 bg-orange-500/10 text-orange-300",
    price: "text-orange-300",
    selected: "border-orange-400/80 ring-1 ring-orange-400/45 shadow-[0_0_28px_-14px_rgba(249,115,22,0.75)]",
    check: "border-orange-300 bg-orange-400 text-zinc-950",
  },
  premium: {
    card: "border-violet-500/30 bg-gradient-to-r from-violet-950/50 via-zinc-900 to-zinc-950 shadow-[0_10px_34px_-28px_rgba(139,92,246,0.7)] hover:border-violet-300/70 hover:shadow-[0_16px_38px_-22px_rgba(139,92,246,0.8)]",
    accent: "from-violet-300 via-purple-500 to-indigo-600",
    icon: "border-violet-400/35 bg-violet-500/10 text-violet-200",
    price: "text-violet-200",
    selected: "border-violet-300/90 ring-1 ring-violet-300/50 shadow-[0_0_32px_-13px_rgba(139,92,246,0.85)]",
    check: "border-violet-200 bg-violet-300 text-zinc-950",
  },
  elite: {
    card: "border-amber-400/35 bg-gradient-to-r from-amber-950/55 via-amber-950/20 to-zinc-950 shadow-[0_12px_36px_-26px_rgba(251,191,36,0.55)] hover:border-amber-300/80 hover:shadow-[0_18px_42px_-22px_rgba(251,191,36,0.85)]",
    accent: "from-amber-200 via-yellow-400 to-amber-600",
    icon: "border-amber-300/40 bg-amber-400/10 text-amber-200",
    price: "text-amber-200",
    selected: "border-amber-300/90 ring-1 ring-amber-300/60 shadow-[0_0_36px_-12px_rgba(251,191,36,0.9)]",
    check: "border-amber-200 bg-amber-300 text-zinc-950",
  },
};

function SensitivityPackageIcon({ tier }: { tier: SensitivityPackageTier }) {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {tier === "basic" ? (
        <>
          <circle cx="12" cy="12" r="7.5" stroke="currentColor" strokeWidth="1.7" />
          <circle cx="12" cy="12" r="2" fill="currentColor" />
        </>
      ) : tier === "premium" ? (
        <path
          d="m12 3 8 7-8 11-8-11 8-7Zm-8 7h16M8 10l4 11 4-11"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <path
          d="m3.5 7.5 5 4 3.5-7 3.5 7 5-4-2 12H5.5l-2-12Zm2 8h13"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}

export function PackageStack() {
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);

  return (
    <main className="min-h-screen bg-[#09090b] px-4 py-5 text-zinc-100">
      <section className="mx-auto w-full max-w-[980px]">
        <header className="mb-3 flex items-end justify-between gap-3">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-orange-300/80">
              Android · High Sensitivity
            </p>
            <h1 className="mt-1 font-['Oxanium'] text-base font-bold uppercase tracking-wide text-white">
              Choose a package
            </h1>
          </div>
          <span className="shrink-0 pb-0.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
            3 tiers
          </span>
        </header>

        <div className="grid grid-cols-1 gap-3">
          {packages.map((pkg) => {
            const isSelected = selectedPackageId === pkg.id;
            const tier = getSensitivityPackageTier(pkg.unit);
            const styles = tierStyles[tier];

            return (
              <button
                key={pkg.id}
                type="button"
                onClick={() => setSelectedPackageId(isSelected ? null : pkg.id)}
                aria-label={`${pkg.unit}, ${pkg.currency === "USD" ? "$" : "৳"}${pkg.price.toLocaleString()}`}
                aria-pressed={isSelected}
                className={`group relative isolate flex min-h-[76px] w-full items-center gap-3 overflow-hidden rounded-2xl border p-3.5 pl-4 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300/70 ${styles.card} ${
                  isSelected ? styles.selected : ""
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`pointer-events-none absolute inset-y-2 left-0 w-1 rounded-r-full bg-gradient-to-b ${styles.accent}`}
                />
                <span className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${styles.icon}`}>
                  <SensitivityPackageIcon tier={tier} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[12px] font-black uppercase leading-tight tracking-[0.04em] text-white sm:text-sm">
                    {pkg.unit}
                  </span>
                </span>
                <span className="ml-auto flex shrink-0 items-center gap-2.5">
                  <span className="flex flex-col items-end">
                    <span className={`text-lg font-black tabular-nums tracking-tight sm:text-xl ${styles.price}`}>
                      {pkg.currency === "USD" ? "$" : "৳"}
                      {pkg.price.toLocaleString()}
                    </span>
                    <span className="text-[8px] font-bold uppercase tracking-[0.16em] text-zinc-500">
                      Price
                    </span>
                  </span>
                  <span
                    aria-hidden="true"
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors ${
                      isSelected
                        ? styles.check
                        : "border-white/15 bg-black/20 text-transparent group-hover:border-white/35"
                    }`}
                  >
                    {isSelected && (
                      <svg className="h-3 w-3" viewBox="0 0 16 16" fill="none">
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
                </span>
              </button>
            );
          })}
        </div>
      </section>
    </main>
  );
}
