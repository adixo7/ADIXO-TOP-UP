import React, { useEffect, useRef } from 'react';

interface BonusOfferPopupProps {
  onClose: () => void;
}

const BonusOfferPopup: React.FC<BonusOfferPopupProps> = ({ onClose }) => {
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-300">
      <div
        ref={popupRef}
        className="relative max-w-[380px] w-full rounded-[2rem] overflow-hidden shadow-[0_0_80px_-10px_rgba(249,115,22,0.45)]"
        style={{ background: 'linear-gradient(145deg, #0f0f0c, #1a0f00, #0f0f0c)' }}
      >
        {/* Top shimmer line */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-orange-500 to-transparent" />

        {/* Corner glows */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-orange-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-7 h-7 flex items-center justify-center rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800 transition-all"
        >
          <i className="fas fa-times text-sm"></i>
        </button>

        <div className="relative p-6">
          {/* Badge */}
          <div className="flex justify-center mb-4">
            <span className="inline-flex items-center gap-1.5 bg-orange-500/15 border border-orange-500/30 text-orange-400 text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full">
              <i className="fas fa-bolt text-[8px]"></i> LIMITED TIME OFFER
            </span>
          </div>

          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="relative w-20 h-20 flex items-center justify-center">
              <div className="absolute inset-0 bg-orange-500/20 rounded-full animate-pulse blur-md" />
              <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center shadow-[0_0_30px_rgba(249,115,22,0.5)]">
                <i className="fas fa-gift text-white text-3xl"></i>
              </div>
            </div>
          </div>

          {/* Headline */}
          <div className="text-center mb-5">
            <p className="text-orange-400 text-[10px] font-black uppercase tracking-[0.3em] mb-1">Exclusive Bonus</p>
            <h2 className="text-3xl font-black text-white uppercase italic tracking-tight leading-none mb-1">
              100% BONUS
            </h2>
            <h3 className="text-3xl font-black uppercase italic tracking-tight leading-none" style={{ color: '#f97316' }}>
              OFFER 🎁
            </h3>
            <p className="text-zinc-400 text-[11px] font-bold mt-3 leading-relaxed">
              Buy <span className="text-white font-black">any package</span> and get{' '}
              <span className="text-orange-400 font-black">DOUBLE the product</span> — pay for one, receive two!
            </p>
          </div>

          {/* Offer details */}
          <div className="bg-zinc-900/60 border border-orange-500/15 rounded-2xl p-4 mb-5 space-y-2.5">
            <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-500 font-black text-center mb-3">What you get</p>
            {[
              { icon: 'fa-gem', text: '2× Diamonds / UC / Gold on top-ups' },
              { icon: 'fa-robot', text: '2× AI Bot packs & Mystery Boxes' },
              { icon: 'fa-desktop', text: '2× PC Game accounts' },
              { icon: 'fa-shield-alt', text: '2× FF Panel access' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center flex-shrink-0">
                  <i className={`fas ${item.icon} text-orange-400 text-[9px]`}></i>
                </div>
                <span className="text-zinc-300 text-[10px] font-bold">{item.text}</span>
              </div>
            ))}
          </div>

          {/* Support section */}
          <div className="mb-5">
            <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-500 font-black text-center mb-3">
              Claim offer via support
            </p>
            <div className="grid grid-cols-2 gap-2">
              <a
                href="https://t.me/adixoglory"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-1 bg-sky-900/20 hover:bg-sky-600/20 border border-sky-700/40 hover:border-sky-500/60 text-sky-400 py-2.5 px-3 rounded-xl transition-all"
              >
                <i className="fab fa-telegram text-base"></i>
                <span className="text-[9px] font-black uppercase tracking-widest">@adixoglory</span>
                <span className="text-[8px] text-sky-500/70 font-bold">Group & Updates</span>
              </a>
              <a
                href="https://t.me/AdiXO_TV"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-1 bg-orange-900/20 hover:bg-orange-600/20 border border-orange-700/40 hover:border-orange-500/60 text-orange-400 py-2.5 px-3 rounded-xl transition-all"
              >
                <i className="fas fa-headset text-base"></i>
                <span className="text-[9px] font-black uppercase tracking-widest">@AdiXO_TV</span>
                <span className="text-[8px] text-orange-500/70 font-bold">Order Support</span>
              </a>
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={onClose}
            className="w-full py-3.5 rounded-xl font-black uppercase tracking-[0.15em] text-[11px] text-black transition-all active:scale-95 shadow-lg shadow-orange-600/30"
            style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}
          >
            <i className="fas fa-rocket mr-2"></i> CLAIM MY BONUS NOW
          </button>

          <p className="text-center text-zinc-600 text-[8px] font-bold uppercase tracking-widest mt-3">
            Contact support on Telegram to activate
          </p>
        </div>
      </div>
    </div>
  );
};

export default BonusOfferPopup;
