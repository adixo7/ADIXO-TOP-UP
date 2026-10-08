import React, { useState } from "react";
import "./_group.css";

type ChoiceAccent = "orange" | "sky" | "emerald" | "violet";

interface SensiChoiceButtonProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  icon: string;
  accent: ChoiceAccent;
  onClick: () => void;
  selected?: boolean;
  testId?: string;
}

const choiceAccents: Record<
  ChoiceAccent,
  { card: string; glow: string; dot: string; icon: string; arrow: string }
> = {
  orange: {
    card: "border-orange-500/35 hover:border-orange-400/80 hover:shadow-[0_18px_40px_-18px_rgba(249,115,22,0.65)]",
    glow: "bg-orange-500/15",
    dot: "bg-orange-400 shadow-[0_0_10px_rgba(251,146,60,0.9)]",
    icon: "border-orange-400/30 bg-orange-500/10 text-orange-300 group-hover:bg-orange-500/20",
    arrow: "text-orange-300 group-hover:bg-orange-500 group-hover:text-black",
  },
  sky: {
    card: "border-sky-500/35 hover:border-sky-400/80 hover:shadow-[0_18px_40px_-18px_rgba(14,165,233,0.65)]",
    glow: "bg-sky-500/15",
    dot: "bg-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.9)]",
    icon: "border-sky-400/30 bg-sky-500/10 text-sky-300 group-hover:bg-sky-500/20",
    arrow: "text-sky-300 group-hover:bg-sky-400 group-hover:text-black",
  },
  emerald: {
    card: "border-emerald-500/35 hover:border-emerald-400/80 hover:shadow-[0_18px_40px_-18px_rgba(16,185,129,0.65)]",
    glow: "bg-emerald-500/15",
    dot: "bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)]",
    icon: "border-emerald-400/30 bg-emerald-500/10 text-emerald-300 group-hover:bg-emerald-500/20",
    arrow: "text-emerald-300 group-hover:bg-emerald-400 group-hover:text-black",
  },
  violet: {
    card: "border-violet-500/35 hover:border-violet-400/80 hover:shadow-[0_18px_40px_-18px_rgba(139,92,246,0.65)]",
    glow: "bg-violet-500/15",
    dot: "bg-violet-400 shadow-[0_0_10px_rgba(167,139,250,0.9)]",
    icon: "border-violet-400/30 bg-violet-500/10 text-violet-300 group-hover:bg-violet-500/20",
    arrow: "text-violet-300 group-hover:bg-violet-400 group-hover:text-black",
  },
};

const SensiChoiceButton: React.FC<SensiChoiceButtonProps> = ({
  eyebrow,
  title,
  subtitle,
  icon,
  accent,
  onClick,
  selected,
  testId,
}) => {
  const colors = choiceAccents[accent];

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      data-testid={testId}
      className={`group relative isolate flex min-h-[140px] w-full flex-col justify-between overflow-hidden rounded-xl border bg-gradient-to-br from-zinc-900 via-zinc-950 to-black p-4 text-left shadow-[0_12px_32px_-18px_rgba(0,0,0,0.9)] transition-all duration-300 hover:-translate-y-1 active:translate-y-0 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 ${colors.card} ${selected ? "border-white/70 ring-1 ring-white/50" : ""}`}
    >
      <span
        className={`pointer-events-none absolute -right-7 -top-9 h-32 w-32 rounded-full blur-3xl transition-opacity duration-300 group-hover:opacity-100 ${colors.glow}`}
      />
      <span className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(135deg,transparent_46%,white_47%,transparent_48%)]" />

      <span className="relative z-10 flex w-full items-center justify-between">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/50 px-2.5 py-1 text-[8px] font-black uppercase tracking-[0.22em] text-zinc-400">
          <span className={`h-1.5 w-1.5 rounded-full ${colors.dot}`} />
          {eyebrow}
        </span>
        <span
          className={`flex h-9 w-9 items-center justify-center rounded-lg border backdrop-blur-sm transition-all duration-300 group-hover:scale-110 ${colors.icon}`}
        >
          <i className={`${icon} text-base`} aria-hidden="true"></i>
        </span>
      </span>

      <span className="relative z-10 mt-5 flex w-full items-end justify-between gap-3">
        <span style={{ textShadow: "0 1px 4px rgba(0, 0, 0, 0.95)" }}>
          <span className="block text-xl font-black uppercase italic leading-none tracking-tight text-white transition-colors group-hover:text-white">
            {title}
          </span>
          <span className="mt-1.5 block text-[9px] font-bold uppercase tracking-[0.14em] text-zinc-300">
            {subtitle}
          </span>
        </span>
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] transition-all duration-300 group-hover:border-transparent ${colors.arrow}`}
        >
          <i
            className="fas fa-arrow-right text-[10px] transition-transform group-hover:translate-x-0.5"
            aria-hidden="true"
          ></i>
        </span>
      </span>
    </button>
  );
};

export function Current() {
  const [selected, setSelected] = useState<"high" | "low" | null>("high");

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 p-5">
      <div
        className="grid w-full max-w-[520px] gap-3 sm:grid-cols-2"
        role="group"
        aria-label="Choose sensitivity"
      >
        <SensiChoiceButton
          eyebrow="Sensitivity 01"
          title="High"
          subtitle="Sensitivity"
          icon="fas fa-arrow-up"
          accent="orange"
          selected={selected === "high"}
          testId="button-sensi-high-sensitivity"
          onClick={() => setSelected("high")}
        />
        <SensiChoiceButton
          eyebrow="Sensitivity 02"
          title="Low"
          subtitle="Sensitivity"
          icon="fas fa-arrow-down"
          accent="sky"
          selected={selected === "low"}
          testId="button-sensi-low-sensitivity"
          onClick={() => setSelected("low")}
        />
      </div>
    </main>
  );
}
