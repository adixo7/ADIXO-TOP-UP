import React, { useState } from 'react';
import { SENSI_PACKAGE_CATEGORIES } from '../data';
import type { Package } from '../types';

interface SensiCatalogProps {
  packages: Package[];
  selectedPackage: Package | null;
  onSelectPackage: (pkg: Package | null) => void;
}

type ChoiceAccent = 'orange' | 'sky' | 'emerald' | 'violet';

interface SensiChoiceButtonProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  icon: string;
  accent: ChoiceAccent;
  onClick: () => void;
}

const choiceAccents: Record<ChoiceAccent, { card: string; glow: string; dot: string; icon: string; arrow: string }> = {
  orange: {
    card: 'border-orange-500/35 hover:border-orange-400/80 hover:shadow-[0_18px_40px_-18px_rgba(249,115,22,0.65)]',
    glow: 'bg-orange-500/15',
    dot: 'bg-orange-400 shadow-[0_0_10px_rgba(251,146,60,0.9)]',
    icon: 'border-orange-400/30 bg-orange-500/10 text-orange-300 group-hover:bg-orange-500/20',
    arrow: 'text-orange-300 group-hover:bg-orange-500 group-hover:text-black',
  },
  sky: {
    card: 'border-sky-500/35 hover:border-sky-400/80 hover:shadow-[0_18px_40px_-18px_rgba(14,165,233,0.65)]',
    glow: 'bg-sky-500/15',
    dot: 'bg-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.9)]',
    icon: 'border-sky-400/30 bg-sky-500/10 text-sky-300 group-hover:bg-sky-500/20',
    arrow: 'text-sky-300 group-hover:bg-sky-400 group-hover:text-black',
  },
  emerald: {
    card: 'border-emerald-500/35 hover:border-emerald-400/80 hover:shadow-[0_18px_40px_-18px_rgba(16,185,129,0.65)]',
    glow: 'bg-emerald-500/15',
    dot: 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)]',
    icon: 'border-emerald-400/30 bg-emerald-500/10 text-emerald-300 group-hover:bg-emerald-500/20',
    arrow: 'text-emerald-300 group-hover:bg-emerald-400 group-hover:text-black',
  },
  violet: {
    card: 'border-violet-500/35 hover:border-violet-400/80 hover:shadow-[0_18px_40px_-18px_rgba(139,92,246,0.65)]',
    glow: 'bg-violet-500/15',
    dot: 'bg-violet-400 shadow-[0_0_10px_rgba(167,139,250,0.9)]',
    icon: 'border-violet-400/30 bg-violet-500/10 text-violet-300 group-hover:bg-violet-500/20',
    arrow: 'text-violet-300 group-hover:bg-violet-400 group-hover:text-black',
  },
};

const SensiChoiceButton: React.FC<SensiChoiceButtonProps> = ({
  eyebrow,
  title,
  subtitle,
  icon,
  accent,
  onClick,
}) => {
  const colors = choiceAccents[accent];

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative isolate flex min-h-[176px] w-full flex-col justify-between overflow-hidden rounded-2xl border bg-gradient-to-br from-zinc-900 via-zinc-950 to-black p-5 text-left shadow-[0_12px_32px_-18px_rgba(0,0,0,0.9)] transition-all duration-300 hover:-translate-y-1 active:translate-y-0 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 ${colors.card}`}
    >
      <span className={`pointer-events-none absolute -right-8 -top-10 h-36 w-36 rounded-full blur-3xl transition-opacity duration-300 group-hover:opacity-100 ${colors.glow}`} />
      <span className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(135deg,transparent_46%,white_47%,transparent_48%)]" />

      <span className="relative z-10 flex w-full items-center justify-between">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/50 px-3 py-1.5 text-[8px] font-black uppercase tracking-[0.22em] text-zinc-400">
          <span className={`h-1.5 w-1.5 rounded-full ${colors.dot}`} />
          {eyebrow}
        </span>
        <span className={`flex h-11 w-11 items-center justify-center rounded-xl border backdrop-blur-sm transition-all duration-300 group-hover:scale-110 ${colors.icon}`}>
          <i className={`${icon} text-lg`} aria-hidden="true"></i>
        </span>
      </span>

      <span className="relative z-10 mt-8 flex w-full items-end justify-between gap-3">
        <span>
          <span className="block text-2xl font-black uppercase italic leading-none tracking-tight text-white transition-colors group-hover:text-white">
            {title}
          </span>
          <span className="mt-2 block text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-500">
            {subtitle}
          </span>
        </span>
        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] transition-all duration-300 group-hover:border-transparent ${colors.arrow}`}>
          <i className="fas fa-arrow-right text-xs transition-transform group-hover:translate-x-0.5" aria-hidden="true"></i>
        </span>
      </span>
    </button>
  );
};

const SensiCatalog: React.FC<SensiCatalogProps> = ({
  packages,
  selectedPackage,
  onSelectPackage,
}) => {
  const [device, setDevice] = useState<'mobile' | 'pc' | null>(null);
  const [mobileOS, setMobileOS] = useState<'android' | 'ios' | null>(null);

  const resetSelection = () => onSelectPackage(null);
  const chooseDevice = (nextDevice: 'mobile' | 'pc') => {
    resetSelection();
    setDevice(nextDevice);
    setMobileOS(null);
  };
  const chooseOS = (nextOS: 'android' | 'ios') => {
    resetSelection();
    setMobileOS(nextOS);
  };

  const packageCategory = device === 'pc'
    ? SENSI_PACKAGE_CATEGORIES.pc
    : mobileOS === 'android'
      ? SENSI_PACKAGE_CATEGORIES.android
      : mobileOS === 'ios'
        ? SENSI_PACKAGE_CATEGORIES.ios
        : null;
  const visiblePackages = packageCategory
    ? packages.filter((pkg) => pkg.category === packageCategory)
    : [];
  const selectedLabel = device === 'pc'
    ? 'PC'
    : mobileOS === 'android'
      ? 'Mobile · Android'
      : mobileOS === 'ios'
        ? 'Mobile · iOS'
        : 'Mobile';

  return (
    <section className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-orange-500/30 bg-orange-500/10 text-orange-400">
          <i className="fas fa-sliders-h" aria-hidden="true"></i>
        </div>
        <div>
          <h3 className="text-sm font-black uppercase tracking-widest text-white">
            {packageCategory ? `${selectedLabel} SENSI PACKS` : device === 'mobile' ? 'CHOOSE MOBILE DEVICE' : 'CHOOSE YOUR DEVICE'}
          </h3>
          <p className="mt-1 text-[10px] font-medium text-zinc-500">
            {packageCategory ? 'Select an available pack to continue.' : 'Choose the platform for your SENSI settings.'}
          </p>
        </div>
      </div>

      {!device && (
        <div className="grid gap-3 sm:grid-cols-2">
          <SensiChoiceButton
            eyebrow="Device 01"
            title="Mobile"
            subtitle="Android or iOS"
            icon="fas fa-mobile-alt"
            accent="orange"
            onClick={() => chooseDevice('mobile')}
          />
          <SensiChoiceButton
            eyebrow="Device 02"
            title="PC"
            subtitle="SENSI for PC"
            icon="fas fa-desktop"
            accent="sky"
            onClick={() => chooseDevice('pc')}
          />
        </div>
      )}

      {device === 'mobile' && !mobileOS && (
        <div className="grid gap-3 sm:grid-cols-2">
          <SensiChoiceButton
            eyebrow="Mobile 01"
            title="Android"
            subtitle="Android SENSI packs"
            icon="fab fa-android"
            accent="emerald"
            onClick={() => chooseOS('android')}
          />
          <SensiChoiceButton
            eyebrow="Mobile 02"
            title="iOS"
            subtitle="iOS SENSI packs"
            icon="fab fa-apple"
            accent="violet"
            onClick={() => chooseOS('ios')}
          />
        </div>
      )}

      {packageCategory && (
        <div className="space-y-4">
          {device === 'mobile' && (
            <button
              type="button"
              onClick={() => {
                resetSelection();
                setMobileOS(null);
              }}
              className="text-[10px] font-black uppercase tracking-widest text-zinc-500 transition-colors hover:text-white"
            >
              <i className="fas fa-arrow-left mr-2" aria-hidden="true"></i>
              Back to Mobile options
            </button>
          )}

          {visiblePackages.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {visiblePackages.map((pkg) => {
                const isSelected = selectedPackage?.id === pkg.id;
                return (
                  <button
                    key={pkg.id}
                    type="button"
                    onClick={() => onSelectPackage(isSelected ? null : pkg)}
                    className={`rounded-xl border p-4 text-left transition-all ${
                      isSelected
                        ? 'border-orange-400 bg-orange-500/10 ring-1 ring-orange-400/50'
                        : 'border-zinc-800 bg-zinc-900/70 hover:border-orange-500/50'
                    }`}
                  >
                    <span className="block text-xs font-black uppercase text-white">{pkg.unit}</span>
                    <span className="mt-2 block text-sm font-black text-orange-400">
                      {pkg.currency === 'USD' ? '$' : '৳'}{pkg.price.toLocaleString()}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/40 px-6 py-10 text-center">
              <i className="fas fa-box-open mb-3 text-xl text-zinc-600" aria-hidden="true"></i>
              <p className="text-xs font-black uppercase tracking-widest text-zinc-300">SENSI packs coming soon</p>
              <p className="mt-2 text-xs text-zinc-500">Packs for {selectedLabel} will appear here when they’re added.</p>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default SensiCatalog;