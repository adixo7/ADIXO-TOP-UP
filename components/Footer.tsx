import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#050507] border-t border-zinc-800/30 py-12 px-6 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
        
        {/* Logo and Description */}
        <div className="flex flex-col gap-4 max-w-sm">
          <div className="flex items-center gap-3">
            <i className="fas fa-gamepad text-indigo-500 text-2xl"></i>
            <span className="text-xl font-black tracking-tighter text-white uppercase italic logo-font">
              ADIXO <span className="text-indigo-500">TOPUP</span>
            </span>
          </div>
          <p className="text-zinc-500 text-sm leading-relaxed font-medium">
            The fastest and most secure way to top up your favorite games. Instant delivery, 24/7 support.
          </p>
        </div>

        {/* Links */}
        <div className="flex items-center gap-8 md:gap-12 text-zinc-400 font-bold uppercase tracking-widest text-[10px]">
          <a 
            href="https://adixo-topup.com/terms" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-white transition-colors"
          >
            Terms
          </a>
          <a 
            href="https://adixo-topup.com/privacy" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-white transition-colors"
          >
            Privacy
          </a>
          <a 
            href="https://t.me/AdiXO_TV" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-white transition-colors"
          >
            Support
          </a>
        </div>

        {/* Copyright */}
        <div className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest md:text-right">
          © 2024 ADIXO TOPUP. All rights reserved.
        </div>

      </div>
    </footer>
  );
};

export default Footer;