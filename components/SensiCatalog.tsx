import React, { useState } from 'react';
import { SENSI_PACKAGE_CATEGORIES } from '../data';
import { Package } from '../types';

interface SensiCatalogProps {
  packages: Package[];
  selectedPackage: Package | null;
  onSelectPackage: (pkg: Package | null) => void;
}

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

  const optionClass = 'group rounded-2xl border border-orange-500/20 bg-zinc-900/70 p-5 text-left transition-all hover:border-orange-400/70 hover:bg-orange-950/20 hover:shadow-[0_0_28px_rgba(249,115,22,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400';

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
          <button type="button" className={optionClass} onClick={() => chooseDevice('mobile')}>
            <i className="fas fa-mobile-alt mb-4 text-xl text-orange-400" aria-hidden="true"></i>
            <span className="block text-base font-black uppercase italic text-white group-hover:text-orange-300">Mobile</span>
            <span className="mt-1 block text-xs text-zinc-500">Android or iOS</span>
            <i className="fas fa-arrow-right mt-4 text-xs text-orange-400 transition-transform group-hover:translate-x-1" aria-hidden="true"></i>
          </button>
          <button type="button" className={optionClass} onClick={() => chooseDevice('pc')}>
            <i className="fas fa-desktop mb-4 text-xl text-orange-400" aria-hidden="true"></i>
            <span className="block text-base font-black uppercase italic text-white group-hover:text-orange-300">PC</span>
            <span className="mt-1 block text-xs text-zinc-500">SENSI for PC</span>
            <i className="fas fa-arrow-right mt-4 text-xs text-orange-400 transition-transform group-hover:translate-x-1" aria-hidden="true"></i>
          </button>
        </div>
      )}

      {device === 'mobile' && !mobileOS && (
        <div className="space-y-3">
          <button type="button" onClick={() => chooseDevice('mobile')} className="text-[10px] font-black uppercase tracking-widest text-zinc-500 transition-colors hover:text-white">
            <i className="fas fa-arrow-left mr-2" aria-hidden="true"></i>Back to devices
          </button>
          <div className="grid gap-3 sm:grid-cols-2">
            {(['android', 'ios'] as const).map((os) => (
              <button key={os} type="button" className={optionClass} onClick={() => chooseOS(os)}>
                <i className={`fab ${os === 'android' ? 'fa-android' : 'fa-apple'} mb-4 text-xl text-orange-400`} aria-hidden="true"></i>
                <span className="block text-base font-black uppercase italic text-white group-hover:text-orange-300">{os === 'ios' ? 'iOS' : 'Android'}</span>
                <span className="mt-1 block text-xs text-zinc-500">Choose {os === 'ios' ? 'iOS' : 'Android'} SENSI packs</span>
                <i className="fas fa-arrow-right mt-4 text-xs text-orange-400 transition-transform group-hover:translate-x-1" aria-hidden="true"></i>
              </button>
            ))}
          </div>
        </div>
      )}

      {packageCategory && (
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => {
              resetSelection();
              if (device === 'mobile') setMobileOS(null);
              else setDevice(null);
            }}
            className="text-[10px] font-black uppercase tracking-widest text-zinc-500 transition-colors hover:text-white"
          >
            <i className="fas fa-arrow-left mr-2" aria-hidden="true"></i>
            {device === 'mobile' ? 'Back to Mobile options' : 'Back to devices'}
          </button>

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