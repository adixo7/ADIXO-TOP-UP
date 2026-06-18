import React from 'react';
import { useLanguage } from '../LanguageContext';

const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="w-full bg-[#050507] border-t border-zinc-800/30 py-5 md:py-12 px-4 md:px-6 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-10">

        {/* Logo and Description */}
        <div className="flex flex-col gap-2 md:gap-4 max-w-sm">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-6 h-6 md:w-8 md:h-8 rounded-lg overflow-hidden flex items-center justify-center">
              <img src="/adixo-logo.png" alt="ADIXO STORE" className="w-full h-full object-cover" />
            </div>
            <span className="text-base md:text-xl font-black tracking-tighter text-white uppercase italic logo-font">
              ADIXO <span className="text-orange-500">STORE</span>
            </span>
          </div>
          <p className="text-zinc-500 text-[10px] md:text-sm leading-relaxed font-medium">
            {t('footer.desc')}
          </p>
        </div>

        {/* Links */}
        <div className="flex items-center gap-6 md:gap-12 text-zinc-400 font-bold uppercase tracking-widest text-[10px]">
          <a href="https://adixo-topup.com/terms" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
            {t('footer.terms')}
          </a>
          <a href="https://adixo-topup.com/privacy" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
            {t('footer.privacy')}
          </a>
          <a href="https://t.me/AdiXO_TV" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
            {t('footer.support')}
          </a>
        </div>

        {/* Copyright */}
        <div className="text-zinc-600 text-[9px] md:text-[10px] font-bold uppercase tracking-widest md:text-right">
          {t('footer.rights')}
        </div>

      </div>
    </footer>
  );
};

export default Footer;
