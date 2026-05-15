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

  const packages = [
    { icon: 'fa-box-open',      label: 'Mystery Box' },
    { icon: 'fa-arrow-up',      label: 'Guild Level Up' },
    { icon: 'fa-trophy',        label: 'Glory Package' },
    { icon: 'fa-robot',         label: 'Hire Bot' },
    { icon: 'fa-unlock',        label: 'Event Bypass' },
    { icon: 'fa-shield-halved', label: 'All FF Panels' },
  ];

  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
      <div
        ref={popupRef}
        className="relative max-w-[320px] w-full rounded-3xl overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, #0a0a0a 0%, #1c0a00 50%, #0a0a0a 100%)',
          boxShadow: '0 0 0 1px rgba(251,146,60,0.25), 0 0 60px -8px rgba(251,146,60,0.5), 0 0 120px -20px rgba(234,88,12,0.3)',
        }}
      >
        {/* Animated top bar */}
        <div className="absolute top-0 left-0 right-0 h-[2px]"
          style={{ background: 'linear-gradient(90deg, transparent, #f97316, #fbbf24, #f97316, transparent)' }} />

        {/* Background star/sparkle decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-4 left-6 w-1 h-1 bg-orange-400 rounded-full opacity-60 animate-ping" style={{ animationDuration: '2s' }} />
          <div className="absolute top-10 right-8 w-1 h-1 bg-yellow-400 rounded-full opacity-40 animate-ping" style={{ animationDuration: '3s', animationDelay: '0.5s' }} />
          <div className="absolute bottom-16 left-10 w-0.5 h-0.5 bg-orange-300 rounded-full opacity-50 animate-ping" style={{ animationDuration: '2.5s', animationDelay: '1s' }} />
          <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #f97316, transparent)' }} />
          <div className="absolute -bottom-12 -left-12 w-40 h-40 rounded-full opacity-8"
            style={{ background: 'radial-gradient(circle, #ea580c, transparent)' }} />
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 w-6 h-6 flex items-center justify-center rounded-lg text-zinc-600 hover:text-white transition-colors"
        >
          <i className="fas fa-times text-xs"></i>
        </button>

        <div className="relative p-5">
          {/* Header badge */}
          <div className="flex justify-center mb-3">
            <span className="inline-flex items-center gap-1 text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full"
              style={{ background: 'rgba(251,146,60,0.12)', border: '1px solid rgba(251,146,60,0.3)', color: '#fb923c' }}>
              <i className="fas fa-star text-[6px]"></i> EXCLUSIVE OFFER
            </span>
          </div>

          {/* Icon + headline */}
          <div className="text-center mb-4">
            <div className="relative inline-flex items-center justify-center w-16 h-16 mb-3">
              <div className="absolute inset-0 rounded-2xl animate-pulse"
                style={{ background: 'linear-gradient(135deg, rgba(249,115,22,0.3), rgba(234,88,12,0.1))', filter: 'blur(8px)' }} />
              <div className="relative w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #7c2d12, #431407)', border: '1px solid rgba(249,115,22,0.4)' }}>
                <span className="text-2xl">🎁</span>
              </div>
            </div>

            <div className="space-y-0.5">
              <p className="text-[9px] font-black uppercase tracking-[0.25em] text-orange-400">100% Bonus Offer</p>
              <h2 className="font-black uppercase italic leading-none"
                style={{ fontSize: '22px', background: 'linear-gradient(135deg, #fff 30%, #fb923c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                BUY 1 GET 2×
              </h2>
              <p className="text-zinc-500 text-[9px] font-bold">On selected packages only</p>
            </div>
          </div>

          {/* Selected packages */}
          <div className="mb-4 rounded-2xl overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(249,115,22,0.12)' }}>
            <p className="text-center text-[8px] font-black uppercase tracking-[0.2em] text-zinc-500 py-2 border-b"
              style={{ borderColor: 'rgba(249,115,22,0.1)' }}>
              Eligible Packages
            </p>
            <div className="grid grid-cols-2 gap-px p-px"
              style={{ background: 'rgba(249,115,22,0.08)' }}>
              {packages.map((pkg, i) => (
                <div key={i}
                  className="flex items-center gap-2 px-3 py-2"
                  style={{ background: '#0a0a0a' }}>
                  <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(249,115,22,0.12)' }}>
                    <i className={`fas ${pkg.icon} text-orange-400`} style={{ fontSize: '7px' }}></i>
                  </div>
                  <span className="text-zinc-300 font-bold" style={{ fontSize: '9px' }}>{pkg.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Support */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <a href="https://t.me/adixoglory" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 rounded-xl transition-all hover:opacity-80"
              style={{ background: 'rgba(14,165,233,0.08)', border: '1px solid rgba(14,165,233,0.2)' }}>
              <i className="fab fa-telegram text-sky-400 text-sm"></i>
              <div>
                <p className="text-sky-300 font-black" style={{ fontSize: '8px' }}>@adixoglory</p>
                <p className="text-zinc-600 font-bold" style={{ fontSize: '7px' }}>Group</p>
              </div>
            </a>
            <a href="https://t.me/AdiXO_TV" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 rounded-xl transition-all hover:opacity-80"
              style={{ background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.2)' }}>
              <i className="fas fa-headset text-orange-400 text-sm"></i>
              <div>
                <p className="text-orange-300 font-black" style={{ fontSize: '8px' }}>@AdiXO_TV</p>
                <p className="text-zinc-600 font-bold" style={{ fontSize: '7px' }}>Support</p>
              </div>
            </a>
          </div>

          {/* CTA */}
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl font-black uppercase tracking-[0.12em] text-[10px] text-black transition-all active:scale-95"
            style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)', boxShadow: '0 4px 20px rgba(249,115,22,0.4)' }}>
            <i className="fas fa-rocket mr-1.5 text-[8px]"></i> CLAIM THIS OFFER
          </button>

          <p className="text-center text-zinc-700 font-bold mt-2" style={{ fontSize: '7px' }}>
            Contact support on Telegram to activate
          </p>
        </div>
      </div>
    </div>
  );
};

export default BonusOfferPopup;
