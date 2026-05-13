import React, { useEffect, useRef } from 'react';
import { useLanguage } from '../LanguageContext';
import { Language } from '../i18n';

interface LanguagePopupProps {
  onClose: () => void;
}

const LanguagePopup: React.FC<LanguagePopupProps> = ({ onClose }) => {
  const { lang, setLang, t } = useLanguage();
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const handleSelect = (selected: Language) => {
    setLang(selected);
    sessionStorage.setItem('adixo_lang_shown', '1');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[600] flex items-start justify-center md:items-center pt-16 md:pt-0 px-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={onClose}
      />
      <div
        ref={popupRef}
        className="relative bg-zinc-950 border border-zinc-800 rounded-3xl p-8 w-full max-w-sm shadow-[0_0_80px_-10px_rgba(249,115,22,0.2)] animate-in zoom-in-95 fade-in duration-300"
      >
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/40 to-transparent rounded-t-3xl" />

        <div className="flex flex-col items-center gap-1 mb-7">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-3">
            <i className="fas fa-globe text-orange-500 text-lg"></i>
          </div>
          <h2 className="text-white font-black uppercase italic tracking-tight text-xl leading-none">
            {t('lang.select')}
          </h2>
          <p className="text-zinc-500 text-[11px] font-bold text-center mt-1">
            {t('lang.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleSelect('en')}
            className={`flex flex-col items-center gap-3 p-5 rounded-2xl border transition-all active:scale-95 ${
              lang === 'en'
                ? 'border-orange-500 bg-orange-500/10 shadow-[0_0_20px_-4px_rgba(249,115,22,0.3)]'
                : 'border-zinc-800 bg-zinc-900/60 hover:border-zinc-600'
            }`}
          >
            <span className="text-3xl leading-none">🇬🇧</span>
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-white font-black text-sm uppercase italic tracking-tight">
                {t('lang.english')}
              </span>
              <span className="text-zinc-500 text-[9px] font-bold uppercase tracking-widest">English</span>
            </div>
            {lang === 'en' && (
              <div className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_6px_rgba(249,115,22,0.8)]" />
            )}
          </button>

          <button
            onClick={() => handleSelect('bn')}
            className={`flex flex-col items-center gap-3 p-5 rounded-2xl border transition-all active:scale-95 ${
              lang === 'bn'
                ? 'border-orange-500 bg-orange-500/10 shadow-[0_0_20px_-4px_rgba(249,115,22,0.3)]'
                : 'border-zinc-800 bg-zinc-900/60 hover:border-zinc-600'
            }`}
          >
            <span className="text-3xl leading-none">🇧🇩</span>
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-white font-black text-sm uppercase italic tracking-tight">
                {t('lang.bangla')}
              </span>
              <span className="text-zinc-500 text-[9px] font-bold uppercase tracking-widest">Bangla</span>
            </div>
            {lang === 'bn' && (
              <div className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_6px_rgba(249,115,22,0.8)]" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LanguagePopup;
