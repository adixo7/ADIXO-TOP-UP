import React, { useState } from 'react';
import { SENSI_PACKAGE_CATEGORIES } from '../data';
import type { Package } from '../types';
import { MOBILE_PHONE_GROUPS } from './sensiPhoneModels';
import type { PhonePlatform } from './sensiPhoneModels';

interface SensiCatalogProps {
  packages: Package[];
  selectedPackage: Package | null;
  onSelectPackage: (pkg: Package | null) => void;
}

type ChoiceAccent = 'orange' | 'sky' | 'emerald' | 'violet';

const PC_EMULATORS = [
  'BlueStacks 5',
  'LDPlayer 9',
  'GameLoop',
  'MSI App Player',
  'MuMu Player',
  'NoxPlayer',
  'BlueStacks X',
  'BlueStacks 10',
  'MEmu Play',
  'Android Studio Emulator',
  'Genymotion',
  'Phoenix OS',
  'SmartGaGa',
  'Remix OS Player',
  'LeapDroid',
] as const;

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
      className={`group relative isolate flex min-h-[140px] w-full flex-col justify-between overflow-hidden rounded-xl border bg-gradient-to-br from-zinc-900 via-zinc-950 to-black p-4 text-left shadow-[0_12px_32px_-18px_rgba(0,0,0,0.9)] transition-all duration-300 hover:-translate-y-1 active:translate-y-0 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 ${colors.card}`}
    >
      <span className={`pointer-events-none absolute -right-7 -top-9 h-32 w-32 rounded-full blur-3xl transition-opacity duration-300 group-hover:opacity-100 ${colors.glow}`} />
      <span className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(135deg,transparent_46%,white_47%,transparent_48%)]" />

      <span className="relative z-10 flex w-full items-center justify-between">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/50 px-2.5 py-1 text-[8px] font-black uppercase tracking-[0.22em] text-zinc-400">
          <span className={`h-1.5 w-1.5 rounded-full ${colors.dot}`} />
          {eyebrow}
        </span>
        <span className={`flex h-9 w-9 items-center justify-center rounded-lg border backdrop-blur-sm transition-all duration-300 group-hover:scale-110 ${colors.icon}`}>
          <i className={`${icon} text-base`} aria-hidden="true"></i>
        </span>
      </span>

      <span className="relative z-10 mt-5 flex w-full items-end justify-between gap-3">
        <span style={{ textShadow: '0 1px 4px rgba(0, 0, 0, 0.95)' }}>
          <span className="block text-xl font-black uppercase italic leading-none tracking-tight text-white transition-colors group-hover:text-white">
            {title}
          </span>
          <span className="mt-1.5 block text-[9px] font-bold uppercase tracking-[0.14em] text-zinc-300">
            {subtitle}
          </span>
        </span>
        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] transition-all duration-300 group-hover:border-transparent ${colors.arrow}`}>
          <i className="fas fa-arrow-right text-[10px] transition-transform group-hover:translate-x-0.5" aria-hidden="true"></i>
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
  const [selectedEmulator, setSelectedEmulator] = useState<string | null>(null);
  const [mobilePlatform, setMobilePlatform] = useState<PhonePlatform | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedPhone, setSelectedPhone] = useState<{
    brand: string;
    model: string;
    platform: PhonePlatform;
  } | null>(null);
  const [phoneSearch, setPhoneSearch] = useState('');

  const resetSelection = () => onSelectPackage(null);
  const chooseDevice = (nextDevice: 'mobile' | 'pc') => {
    resetSelection();
    setDevice(nextDevice);
    setSelectedEmulator(null);
    setMobilePlatform(null);
    setSelectedBrand(null);
    setSelectedPhone(null);
    setPhoneSearch('');
  };
  const chooseMobilePlatform = (platform: PhonePlatform) => {
    resetSelection();
    setMobilePlatform(platform);
    setSelectedBrand(null);
    setSelectedPhone(null);
    setPhoneSearch('');
  };
  const chooseBrand = (brand: string) => {
    resetSelection();
    setSelectedBrand(brand);
    setPhoneSearch('');
  };
  const chooseEmulator = (emulator: string) => {
    resetSelection();
    setSelectedEmulator(emulator);
  };
  const choosePhone = (brand: string, model: string, platform: PhonePlatform) => {
    resetSelection();
    setSelectedPhone({ brand, model, platform });
  };

  const packageCategory = device === 'pc'
    ? selectedEmulator
      ? SENSI_PACKAGE_CATEGORIES.pc
      : null
    : selectedPhone?.platform === 'android'
      ? SENSI_PACKAGE_CATEGORIES.android
      : selectedPhone?.platform === 'ios'
        ? SENSI_PACKAGE_CATEGORIES.ios
        : null;
  const visiblePackages = packageCategory
    ? packages.filter((pkg) => pkg.category === packageCategory)
    : [];
  const selectedLabel = device === 'pc'
    ? selectedEmulator || 'PC'
    : selectedPhone
      ? selectedPhone.model
      : 'Mobile';
  const normalizedPhoneSearch = phoneSearch.trim().toLowerCase();
  const mobileGroups = MOBILE_PHONE_GROUPS.filter((group) => group.platform === mobilePlatform);
  const isChoosingAndroidBrand = mobilePlatform === 'android' && !selectedBrand;
  const visiblePhoneBrands = mobileGroups
    .filter((group) => group.brand.toLowerCase().includes(normalizedPhoneSearch));
  const visiblePhoneGroups = mobileGroups
    .filter((group) => mobilePlatform === 'ios' || group.brand === selectedBrand)
    .map((group) => ({
      ...group,
      models: group.models.filter((model) =>
        `${group.brand} ${model}`.toLowerCase().includes(normalizedPhoneSearch),
      ),
    }))
    .filter((group) => group.models.length > 0);
  const visiblePhoneCount = visiblePhoneGroups.reduce((total, group) => total + group.models.length, 0);

  return (
    <section className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-orange-500/30 bg-orange-500/10 text-orange-400">
          <i className="fas fa-sliders-h" aria-hidden="true"></i>
        </div>
        <div>
          <h3 className="text-sm font-black uppercase tracking-widest text-white">
            {packageCategory
              ? `${selectedLabel} SENSI PACKS`
              : device === 'pc'
                ? 'CHOOSE PC EMULATOR'
                : device === 'mobile'
                  ? !mobilePlatform
                    ? 'CHOOSE MOBILE PLATFORM'
                    : isChoosingAndroidBrand
                      ? 'CHOOSE ANDROID BRAND'
                      : 'CHOOSE PHONE MODEL'
                  : 'CHOOSE YOUR DEVICE'}
          </h3>
          <p className="mt-1 text-[10px] font-medium text-zinc-500">
            {packageCategory
              ? 'Select an available pack to continue.'
              : device === 'pc'
                ? 'Choose your Android emulator to see the PC SENSI packs.'
                : device === 'mobile'
                  ? !mobilePlatform
                    ? 'Choose Android or iOS to continue.'
                    : isChoosingAndroidBrand
                      ? 'Choose your Android phone brand to see its models.'
                      : `Choose an available ${mobilePlatform === 'ios' ? 'iPhone' : 'phone'} model.`
                  : 'Choose the platform for your SENSI settings.'}
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

      {device === 'pc' && !selectedEmulator && (
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => {
              resetSelection();
              setDevice(null);
              setSelectedEmulator(null);
            }}
            className="text-[10px] font-black uppercase tracking-widest text-zinc-500 transition-colors hover:text-white"
          >
            <i className="fas fa-arrow-left mr-2" aria-hidden="true"></i>
            Back to devices
          </button>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {PC_EMULATORS.map((emulator) => (
              <button
                key={emulator}
                type="button"
                onClick={() => chooseEmulator(emulator)}
                aria-label={`Choose ${emulator}`}
                className="group flex min-h-14 items-center justify-between gap-3 rounded-xl border border-zinc-800 bg-zinc-900/60 px-3 py-3 text-left transition-all hover:border-sky-400/60 hover:bg-sky-500/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/70"
              >
                <span className="text-[10px] font-bold leading-snug text-zinc-200 group-hover:text-white">{emulator}</span>
                <i className="fas fa-chevron-right shrink-0 text-[8px] text-zinc-600 transition-colors group-hover:text-sky-300" aria-hidden="true"></i>
              </button>
            ))}
          </div>
        </div>
      )}

      {device === 'mobile' && !mobilePlatform && (
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => {
              resetSelection();
              setDevice(null);
            }}
            className="text-[10px] font-black uppercase tracking-widest text-zinc-500 transition-colors hover:text-white"
          >
            <i className="fas fa-arrow-left mr-2" aria-hidden="true"></i>
            Back to devices
          </button>
          <div className="grid gap-3 sm:grid-cols-2">
            <SensiChoiceButton
              eyebrow="Platform 01"
              title="Android"
              subtitle="Choose your phone brand"
              icon="fab fa-android"
              accent="emerald"
              onClick={() => chooseMobilePlatform('android')}
            />
            <SensiChoiceButton
              eyebrow="Platform 02"
              title="iOS"
              subtitle="Browse iPhone models"
              icon="fab fa-apple"
              accent="violet"
              onClick={() => chooseMobilePlatform('ios')}
            />
          </div>
        </div>
      )}

      {device === 'mobile' && mobilePlatform && (
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => {
              resetSelection();
              setSelectedPhone(null);
              setPhoneSearch('');
              if (mobilePlatform === 'android' && selectedBrand) {
                setSelectedBrand(null);
              } else {
                setMobilePlatform(null);
                setSelectedBrand(null);
              }
            }}
            className="text-[10px] font-black uppercase tracking-widest text-zinc-500 transition-colors hover:text-white"
          >
            <i className="fas fa-arrow-left mr-2" aria-hidden="true"></i>
            {mobilePlatform === 'android' && selectedBrand ? 'Back to Android brands' : 'Back to platforms'}
          </button>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4 sm:p-5">
            <label htmlFor="sensi-phone-search" className="mb-2 block text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400">
              {isChoosingAndroidBrand ? 'Search Android brands' : 'Search phone models'}
            </label>
            <div className="relative">
              <i className="fas fa-search pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500" aria-hidden="true"></i>
              <input
                id="sensi-phone-search"
                type="search"
                value={phoneSearch}
                onChange={(event) => setPhoneSearch(event.target.value)}
                placeholder={isChoosingAndroidBrand ? 'Try Samsung, realme or OPPO' : mobilePlatform === 'ios' ? 'Try iPhone 15' : `Try a ${selectedBrand} model`}
                className="w-full rounded-xl border border-zinc-800 bg-black/50 py-3 pl-9 pr-3 text-xs text-white outline-none transition-colors placeholder:text-zinc-600 focus:border-orange-400/70"
              />
            </div>
            <div className="mt-3 flex items-center">
              <span className="ml-auto text-[9px] font-bold uppercase tracking-widest text-zinc-600">
                {isChoosingAndroidBrand
                  ? `${visiblePhoneBrands.length} brands`
                  : `${visiblePhoneCount} models`}
              </span>
            </div>
          </div>

          {isChoosingAndroidBrand ? (
            visiblePhoneBrands.length > 0 ? (
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {visiblePhoneBrands.map((group) => (
                  <button
                    key={group.brand}
                    type="button"
                    onClick={() => chooseBrand(group.brand)}
                    aria-label={`Choose ${group.brand}`}
                    className="group flex min-h-14 items-center justify-between gap-3 rounded-xl border border-zinc-800 bg-zinc-900/60 px-3 py-3 text-left transition-all hover:border-orange-400/60 hover:bg-orange-500/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/70"
                  >
                    <span>
                      <span className="block text-[10px] font-bold leading-snug text-zinc-200 group-hover:text-white">{group.brand}</span>
                      <span className="mt-1 block text-[8px] font-bold uppercase tracking-widest text-zinc-600">{group.models.length} models</span>
                    </span>
                    <i className="fas fa-chevron-right shrink-0 text-[8px] text-zinc-600 transition-colors group-hover:text-orange-300" aria-hidden="true"></i>
                  </button>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-zinc-800 px-5 py-8 text-center">
                <i className="fas fa-mobile-alt mb-2 text-lg text-zinc-600" aria-hidden="true"></i>
                <p className="text-xs font-black uppercase tracking-widest text-zinc-300">No brands found</p>
                <p className="mt-1 text-[10px] text-zinc-500">Try a different phone brand.</p>
              </div>
            )
          ) : visiblePhoneGroups.length > 0 ? (
            <div className="space-y-4">
              {visiblePhoneGroups.map((group) => (
                <section key={group.brand} aria-label={`${group.brand} phone models`} className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-300">{group.brand}</h4>
                    <span className="text-[8px] font-bold uppercase tracking-widest text-zinc-600">
                      {group.platform === 'ios' ? 'iOS' : 'Android'} · {group.models.length}
                    </span>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {group.models.map((model) => (
                      <button
                        key={model}
                        type="button"
                        onClick={() => choosePhone(group.brand, model, group.platform)}
                        aria-label={`Choose ${model}`}
                        className="group flex min-h-14 items-center justify-between gap-3 rounded-xl border border-zinc-800 bg-zinc-900/60 px-3 py-3 text-left transition-all hover:border-orange-400/60 hover:bg-orange-500/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/70"
                      >
                        <span className="text-[10px] font-bold leading-snug text-zinc-200 group-hover:text-white">{model}</span>
                        <i className="fas fa-chevron-right shrink-0 text-[8px] text-zinc-600 transition-colors group-hover:text-orange-300" aria-hidden="true"></i>
                      </button>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-zinc-800 px-5 py-8 text-center">
              <i className="fas fa-mobile-alt mb-2 text-lg text-zinc-600" aria-hidden="true"></i>
              <p className="text-xs font-black uppercase tracking-widest text-zinc-300">No models found</p>
              <p className="mt-1 text-[10px] text-zinc-500">Try a different model name.</p>
            </div>
          )}
        </div>
      )}

      {packageCategory && (
        <div className="space-y-4">
          {device === 'pc' && selectedEmulator && (
            <button
              type="button"
              onClick={() => {
                resetSelection();
                setSelectedEmulator(null);
              }}
              className="text-[10px] font-black uppercase tracking-widest text-zinc-500 transition-colors hover:text-white"
            >
              <i className="fas fa-arrow-left mr-2" aria-hidden="true"></i>
              Back to emulators
            </button>
          )}
          {device === 'mobile' && selectedPhone && (
            <button
              type="button"
              onClick={() => {
                resetSelection();
                setSelectedPhone(null);
                setPhoneSearch('');
              }}
              className="text-[10px] font-black uppercase tracking-widest text-zinc-500 transition-colors hover:text-white"
            >
              <i className="fas fa-arrow-left mr-2" aria-hidden="true"></i>
              Back to phone models
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