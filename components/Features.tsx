import React from 'react';
import { useLanguage } from '../LanguageContext';

const Features: React.FC = () => {
  const { t } = useLanguage();

  const featureList = [
    {
      titleKey: 'features.instantDelivery',
      descKey: 'features.instantDeliveryDesc',
      icon: 'bolt',
      color: 'text-orange-400',
      bg: 'bg-orange-500/5',
    },
    {
      titleKey: 'features.securePayment',
      descKey: 'features.securePaymentDesc',
      icon: 'shield',
      color: 'text-orange-400',
      bg: 'bg-orange-500/5',
    },
    {
      titleKey: 'features.bestPrices',
      descKey: 'features.bestPricesDesc',
      icon: 'card',
      color: 'text-orange-400',
      bg: 'bg-orange-500/5',
    },
  ];

  return (
    <section className="py-6 md:py-16 animate-in fade-in duration-1000">
      <div className="max-w-2xl mx-auto px-4 mb-8 md:mb-16">
        <div className="bg-[#0c0c0e] border border-zinc-800/50 rounded-2xl overflow-hidden flex flex-row">
          {/* Left Side: Support Info */}
          <div className="flex-[3] p-4 md:p-8 flex flex-col justify-between border-r border-zinc-800/50">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20 mb-2 md:mb-4">
                <i className="far fa-comment-dots text-orange-500 text-[8px]"></i>
                <span className="text-orange-500 text-[8px] font-bold tracking-widest uppercase">{t('features.liveSupport')}</span>
              </div>
              <h2 className="text-white text-lg md:text-3xl font-black italic uppercase tracking-tighter leading-tight mb-2 md:mb-3">
                {t('features.needHelp')}<br />
                {t('features.with') && <>{t('features.with')}<br /></>}
                <span className="text-orange-500">{t('features.yourOrder')}</span>
              </h2>
              <p className="text-zinc-400 text-[9px] md:text-xs leading-relaxed mb-3 md:mb-5">
                {t('features.supportDesc')}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center flex-shrink-0">
                <i className="fab fa-telegram-plane text-orange-500 text-xs md:text-sm"></i>
              </div>
              <div>
                <p className="text-zinc-500 text-[7px] font-bold uppercase tracking-widest">{t('features.telegramUsername')}</p>
                <p className="text-white text-[10px] md:text-xs font-bold italic">@AdiXO_TV</p>
              </div>
            </div>
          </div>

          {/* Right Side: Profile */}
          <div className="flex-[2] p-3 md:p-8 flex flex-col items-center justify-center text-center bg-zinc-900/20">
            <div className="relative mb-2 md:mb-4">
              <div className="w-12 h-12 md:w-28 md:h-28 rounded-full border-2 md:border-[3px] border-zinc-800 p-0.5 md:p-1 overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full"></div>
                <img src="/images/support-avatar.jpg" alt="Support Admin" className="w-full h-full rounded-full object-cover grayscale hover:grayscale-0 transition-all duration-700 scale-110" />
              </div>
              <div className="absolute bottom-0.5 right-0.5 w-3 h-3 md:w-4 md:h-4 bg-green-500 rounded-full border-2 md:border-[3px] border-[#0c0c0e] shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
            </div>
            <h3 className="text-white text-[10px] md:text-lg font-black italic uppercase tracking-tight mb-0.5">Adixo Support</h3>
            <p className="text-orange-500 text-[7px] md:text-[8px] font-bold uppercase tracking-[0.2em] mb-2 md:mb-5">{t('features.headAdmin')}</p>
            <a href="https://t.me/AdiXO_TV" target="_blank" rel="noopener noreferrer"
              className="w-full bg-orange-500 hover:bg-orange-600 text-black font-black italic uppercase tracking-wider py-1.5 md:py-3 px-2 md:px-4 rounded-lg flex items-center justify-center gap-1 md:gap-2 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-orange-500/20 text-[7px] md:text-[11px]">
              <span className="hidden md:inline">{t('features.messageOnTelegram')}</span>
              <span className="md:hidden">Message</span>
              <i className="fas fa-external-link-alt text-[7px] md:text-[9px]"></i>
            </a>
            <p className="mt-1.5 md:mt-3 text-zinc-500 text-[6px] md:text-[7px] font-bold uppercase tracking-widest hidden md:block">{t('features.responseTime')}</p>
          </div>
        </div>
      </div>

      {/* Feature cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-5 px-4 md:px-0">
        {featureList.map((feature) => (
          <div
            key={feature.titleKey}
            className="group relative flex min-h-[148px] w-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-zinc-800/80 bg-gradient-to-b from-zinc-900/80 to-[#0c0c0e] p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:border-orange-500/40 hover:shadow-[0_12px_32px_-18px_rgba(249,115,22,0.55)] md:min-h-[180px] md:p-7"
          >
            <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />
            <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-orange-500/15 bg-orange-500/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition-transform duration-300 group-hover:scale-105 md:mb-5 md:h-14 md:w-14`}>
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`h-6 w-6 ${feature.color} md:h-7 md:w-7`}
              >
                {feature.icon === 'bolt' ? (
                  <path d="M13.2 2.8 5.8 13h5.1l-.6 8.2L18.2 11h-5.1l.1-8.2Z" />
                ) : feature.icon === 'shield' ? (
                  <>
                    <path d="M12 3 19 6v5c0 4.6-2.8 8-7 10-4.2-2-7-5.4-7-10V6l7-3Z" />
                    <path d="m9 12 2 2 4-4" />
                  </>
                ) : (
                  <>
                    <rect x="3" y="5" width="18" height="14" rx="2.5" />
                    <path d="M3 10h18M7 15h3" />
                  </>
                )}
              </svg>
            </div>
            <h3 className="mb-2 text-sm font-black uppercase italic leading-snug tracking-tight text-white md:text-base">
              {t(feature.titleKey)}
            </h3>
            <p className="max-w-[20rem] text-xs font-medium leading-relaxed text-zinc-400 md:text-sm">
              {t(feature.descKey)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
