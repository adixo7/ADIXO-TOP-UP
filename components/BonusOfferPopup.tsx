import React, { useEffect, useRef, useState } from 'react';

interface BonusOfferPopupProps {
  onClose: () => void;
  onNavigate: (gameId: string) => void;
}

const LIGHT_COLORS = ['#f97316', '#facc15', '#ec4899', '#22d3ee', '#a78bfa', '#34d399', '#f43f5e', '#60a5fa', '#fb923c', '#c084fc'];
function getLightColor(i: number) { return LIGHT_COLORS[i % LIGHT_COLORS.length]; }

const packages = [
  { icon: 'fa-box-open',      label: 'Mystery Box',    color: '#38bdf8', gameId: 'ai-bots' },
  { icon: 'fa-arrow-up',      label: 'Guild Level Up', color: '#34d399', gameId: 'ai-bots' },
  { icon: 'fa-trophy',        label: 'Glory Package',  color: '#facc15', gameId: 'ai-bots' },
  { icon: 'fa-robot',         label: 'Hire Bot',       color: '#f97316', gameId: 'ai-bots' },
  { icon: 'fa-unlock',        label: 'Event Bypass',   color: '#a78bfa', gameId: 'event-bypass' },
  { icon: 'fa-shield-halved', label: 'All FF Panels',  color: '#f43f5e', gameId: 'ff-panel' },
];

const topLights    = Array.from({ length: 14 }, (_, i) => i);
const bottomLights = Array.from({ length: 14 }, (_, i) => i);
const leftLights   = Array.from({ length: 10 }, (_, i) => i);
const rightLights  = Array.from({ length: 10 }, (_, i) => i);

const BonusOfferPopup: React.FC<BonusOfferPopupProps> = ({ onClose, onNavigate }) => {
  const popupRef = useRef<HTMLDivElement>(null);
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => onClose(), 220);
  };

  const handleNavigate = (gameId: string) => {
    setIsClosing(true);
    setTimeout(() => onNavigate(gameId), 220);
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <div
      className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
      style={{ animation: isClosing ? 'popupFadeOut 0.22s ease forwards' : 'popupFadeIn 0.3s ease forwards' }}
    >
      <style>{`
        @keyframes popupFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes popupFadeOut { from { opacity: 1; } to { opacity: 0; } }
        @keyframes twinkle {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(0.6); }
        }
        .light-bulb { animation: twinkle var(--dur, 1.4s) ease-in-out infinite; animation-delay: var(--delay, 0s); }
        .pkg-row:hover { background: rgba(255,255,255,0.06) !important; cursor: pointer; }
        .pkg-row:hover .pkg-label { text-decoration: underline; }
      `}</style>

      <div ref={popupRef} className="relative max-w-[310px] w-full">

        {/* TOP LIGHTS */}
        <div className="absolute top-0 left-0 right-0 flex justify-around items-start z-30 pointer-events-none" style={{ padding: '0 10px', transform: 'translateY(-7px)' }}>
          {topLights.map((_, i) => (
            <div key={i} className="flex flex-col items-center">
              <div style={{ width: 1, height: 6, background: 'rgba(255,255,255,0.2)' }} />
              <div className="light-bulb rounded-full" style={{ width: 7, height: 9, background: getLightColor(i + 1), boxShadow: `0 0 6px 2px ${getLightColor(i + 1)}cc, 0 0 12px ${getLightColor(i + 1)}66`, ['--dur' as any]: `${1.1 + (i * 0.17) % 1.2}s`, ['--delay' as any]: `${(i * 0.13) % 1.5}s` }} />
            </div>
          ))}
        </div>

        {/* BOTTOM LIGHTS */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-around items-end z-30 pointer-events-none" style={{ padding: '0 10px', transform: 'translateY(7px)' }}>
          {bottomLights.map((_, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="light-bulb rounded-full" style={{ width: 7, height: 9, background: getLightColor(i + 3), boxShadow: `0 0 6px 2px ${getLightColor(i + 3)}cc, 0 0 12px ${getLightColor(i + 3)}66`, ['--dur' as any]: `${1.0 + (i * 0.19) % 1.3}s`, ['--delay' as any]: `${(i * 0.15) % 1.6}s` }} />
              <div style={{ width: 1, height: 6, background: 'rgba(255,255,255,0.2)' }} />
            </div>
          ))}
        </div>

        {/* LEFT LIGHTS */}
        <div className="absolute top-0 left-0 bottom-0 flex flex-col justify-around items-start z-30 pointer-events-none" style={{ padding: '10px 0', transform: 'translateX(-7px)' }}>
          {leftLights.map((_, i) => (
            <div key={i} className="flex flex-row items-center">
              <div style={{ height: 1, width: 6, background: 'rgba(255,255,255,0.2)' }} />
              <div className="light-bulb rounded-full" style={{ width: 9, height: 7, background: getLightColor(i + 5), boxShadow: `0 0 6px 2px ${getLightColor(i + 5)}cc, 0 0 12px ${getLightColor(i + 5)}66`, ['--dur' as any]: `${1.2 + (i * 0.21) % 1.1}s`, ['--delay' as any]: `${(i * 0.18) % 1.4}s` }} />
            </div>
          ))}
        </div>

        {/* RIGHT LIGHTS */}
        <div className="absolute top-0 right-0 bottom-0 flex flex-col justify-around items-end z-30 pointer-events-none" style={{ padding: '10px 0', transform: 'translateX(7px)' }}>
          {rightLights.map((_, i) => (
            <div key={i} className="flex flex-row items-center">
              <div className="light-bulb rounded-full" style={{ width: 9, height: 7, background: getLightColor(i + 2), boxShadow: `0 0 6px 2px ${getLightColor(i + 2)}cc, 0 0 12px ${getLightColor(i + 2)}66`, ['--dur' as any]: `${1.1 + (i * 0.23) % 1.2}s`, ['--delay' as any]: `${(i * 0.12) % 1.5}s` }} />
              <div style={{ height: 1, width: 6, background: 'rgba(255,255,255,0.2)' }} />
            </div>
          ))}
        </div>

        {/* Main card */}
        <div className="relative rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(160deg, #0d001f 0%, #1a0030 50%, #0a0a00 100%)', boxShadow: '0 0 0 1.5px rgba(168,85,247,0.4), 0 0 60px -10px rgba(168,85,247,0.3)' }}>

          <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(168,85,247,0.6), rgba(249,115,22,0.6), transparent)' }} />
          <div className="absolute -top-10 -left-10 w-36 h-36 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.18), transparent)', filter: 'blur(20px)' }} />
          <div className="absolute -bottom-10 -right-10 w-36 h-36 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.15), transparent)', filter: 'blur(20px)' }} />

          <button onClick={handleClose} className="absolute top-2.5 right-2.5 z-20 w-6 h-6 flex items-center justify-center rounded-md transition-colors" style={{ color: 'rgba(255,255,255,0.25)' }} onMouseEnter={e => (e.currentTarget.style.color = 'white')} onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.25)')}>
            <i className="fas fa-times text-xs"></i>
          </button>

          <div className="relative px-5 pt-5 pb-4">
            {/* Badge */}
            <div className="flex justify-center mb-3">
              <span className="inline-flex items-center gap-1 text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full" style={{ background: 'linear-gradient(135deg, rgba(168,85,247,0.2), rgba(249,115,22,0.15))', border: '1px solid rgba(168,85,247,0.35)', color: '#c084fc' }}>
                <i className="fas fa-star text-[6px]"></i> EID UL ADHA SPECIAL OFFER
              </span>
            </div>

            {/* Icon */}
            <div className="flex justify-center mb-3">
              <div className="relative w-14 h-14">
                <div className="absolute inset-0 rounded-xl animate-pulse" style={{ background: 'linear-gradient(135deg, rgba(168,85,247,0.35), rgba(249,115,22,0.25))', filter: 'blur(10px)' }} />
                <div className="relative w-14 h-14 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #3b0764, #7c2d12)', border: '1px solid rgba(168,85,247,0.45)' }}>
                  <span className="text-2xl">🌙</span>
                </div>
              </div>
            </div>

            {/* Headline */}
            <div className="text-center mb-4">
              <p className="font-black uppercase tracking-wide mb-0.5" style={{ fontSize: '10px', background: 'linear-gradient(90deg, #f43f5e, #f97316, #facc15)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                100% BONUS OFFER
              </p>
              <h2 className="font-black uppercase italic leading-none mb-1" style={{ fontSize: '28px', background: 'linear-gradient(135deg, #fff 20%, #c084fc 60%, #f97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                BUY 1 GET 2×
              </h2>
              <p className="font-bold" style={{ fontSize: '9px', color: 'rgba(255,255,255,0.35)' }}>
                Eid Mubarak! Tap a package below to claim
              </p>
            </div>

            {/* Package grid — CLICKABLE */}
            <div className="mb-4 rounded-xl overflow-hidden" style={{ border: '1px solid rgba(168,85,247,0.18)', background: 'rgba(255,255,255,0.02)' }}>
              <p className="text-center font-black uppercase tracking-[0.2em] py-1.5 border-b" style={{ fontSize: '7px', color: 'rgba(255,255,255,0.3)', borderColor: 'rgba(168,85,247,0.12)' }}>
                Eligible Packages — tap to shop
              </p>
              <div className="grid grid-cols-2">
                {packages.map((pkg, i) => (
                  <button
                    key={i}
                    onClick={() => handleNavigate(pkg.gameId)}
                    className="pkg-row flex items-center gap-2 px-3 py-2 text-left transition-all duration-200 w-full"
                    style={{
                      borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                      borderRight: i % 2 === 0 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                      background: 'transparent',
                    }}
                  >
                    <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0" style={{ background: `${pkg.color}18`, border: `1px solid ${pkg.color}40` }}>
                      <i className={`fas ${pkg.icon}`} style={{ fontSize: '7px', color: pkg.color }}></i>
                    </div>
                    <span className="pkg-label font-bold flex items-center gap-1" style={{ fontSize: '8.5px', color: 'rgba(255,255,255,0.8)' }}>
                      {pkg.label}
                      <i className="fas fa-arrow-right" style={{ fontSize: '6px', color: pkg.color, opacity: 0.7 }}></i>
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Support */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <a href="https://t.me/adixoglory" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl transition-opacity hover:opacity-80" style={{ background: 'rgba(14,165,233,0.07)', border: '1px solid rgba(14,165,233,0.22)' }}>
                <i className="fab fa-telegram text-sm" style={{ color: '#38bdf8' }}></i>
                <div>
                  <p className="font-black" style={{ fontSize: '8px', color: '#7dd3fc' }}>@adixoglory</p>
                  <p className="font-bold" style={{ fontSize: '7px', color: 'rgba(14,165,233,0.45)' }}>Group</p>
                </div>
              </a>
              <a href="https://t.me/AdiXO_TV" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl transition-opacity hover:opacity-80" style={{ background: 'rgba(249,115,22,0.07)', border: '1px solid rgba(249,115,22,0.22)' }}>
                <i className="fas fa-headset text-sm" style={{ color: '#fb923c' }}></i>
                <div>
                  <p className="font-black" style={{ fontSize: '8px', color: '#fdba74' }}>@AdiXO_TV</p>
                  <p className="font-bold" style={{ fontSize: '7px', color: 'rgba(249,115,22,0.45)' }}>Support</p>
                </div>
              </a>
            </div>

            {/* CTA */}
            <button onClick={handleClose} className="w-full py-2.5 rounded-xl font-black uppercase tracking-[0.1em] text-black transition-all active:scale-95" style={{ fontSize: '10px', background: 'linear-gradient(135deg, #f43f5e, #f97316, #facc15)', boxShadow: '0 4px 24px rgba(249,115,22,0.4)' }}>
              🎉 CLAIM MY BONUS
            </button>

            <p className="text-center mt-2 font-bold" style={{ fontSize: '7px', color: 'rgba(255,255,255,0.18)' }}>
              Contact support on Telegram to activate
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BonusOfferPopup;
