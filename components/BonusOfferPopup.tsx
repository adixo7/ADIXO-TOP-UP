import React, { useEffect, useRef } from 'react';

interface BonusOfferPopupProps {
  onClose: () => void;
}

const RIBBONS = [
  { color: '#f97316', left: '8%',  top: '-6px',  rotate: '15deg',  w: 6,  h: 18 },
  { color: '#facc15', left: '20%', top: '-4px',  rotate: '-10deg', w: 5,  h: 14 },
  { color: '#ec4899', left: '34%', top: '-8px',  rotate: '20deg',  w: 7,  h: 20 },
  { color: '#22d3ee', left: '50%', top: '-5px',  rotate: '-15deg', w: 5,  h: 16 },
  { color: '#a78bfa', left: '65%', top: '-7px',  rotate: '12deg',  w: 6,  h: 18 },
  { color: '#fb923c', left: '80%', top: '-4px',  rotate: '-20deg', w: 5,  h: 14 },
  { color: '#34d399', left: '92%', top: '-6px',  rotate: '18deg',  w: 6,  h: 16 },
  { color: '#f43f5e', left: '8%',  bottom: '-6px', rotate: '-15deg', w: 5, h: 16 },
  { color: '#60a5fa', left: '25%', bottom: '-4px', rotate: '10deg',  w: 6, h: 14 },
  { color: '#facc15', left: '45%', bottom: '-7px', rotate: '-18deg', w: 7, h: 18 },
  { color: '#f97316', left: '65%', bottom: '-5px', rotate: '14deg',  w: 5, h: 16 },
  { color: '#c084fc', left: '82%', bottom: '-6px', rotate: '-12deg', w: 6, h: 14 },
];

const SIDE_RIBBONS = [
  { color: '#facc15', top: '12%', side: 'left',  rotate: '80deg', w: 5, h: 16 },
  { color: '#ec4899', top: '28%', side: 'left',  rotate: '75deg', w: 6, h: 18 },
  { color: '#22d3ee', top: '48%', side: 'left',  rotate: '85deg', w: 5, h: 14 },
  { color: '#a78bfa', top: '68%', side: 'left',  rotate: '78deg', w: 6, h: 16 },
  { color: '#34d399', top: '85%', side: 'left',  rotate: '82deg', w: 5, h: 14 },
  { color: '#f97316', top: '12%', side: 'right', rotate: '80deg', w: 6, h: 18 },
  { color: '#f43f5e', top: '30%', side: 'right', rotate: '75deg', w: 5, h: 14 },
  { color: '#facc15', top: '50%', side: 'right', rotate: '85deg', w: 6, h: 16 },
  { color: '#60a5fa', top: '70%', side: 'right', rotate: '78deg', w: 5, h: 14 },
  { color: '#c084fc', top: '86%', side: 'right', rotate: '82deg', w: 6, h: 18 },
];

const packages = [
  { icon: 'fa-box-open',      label: 'Mystery Box',    color: '#38bdf8' },
  { icon: 'fa-arrow-up',      label: 'Guild Level Up', color: '#34d399' },
  { icon: 'fa-trophy',        label: 'Glory Package',  color: '#facc15' },
  { icon: 'fa-robot',         label: 'Hire Bot',       color: '#f97316' },
  { icon: 'fa-unlock',        label: 'Event Bypass',   color: '#a78bfa' },
  { icon: 'fa-shield-halved', label: 'All FF Panels',  color: '#f43f5e' },
];

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
    <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
      <div
        ref={popupRef}
        className="relative max-w-[310px] w-full"
        style={{ filter: 'drop-shadow(0 0 40px rgba(249,115,22,0.35)) drop-shadow(0 0 80px rgba(168,85,247,0.2))' }}
      >
        {/* Ribbon decorations — top */}
        {RIBBONS.filter(r => r.top !== undefined && !r.bottom).map((r, i) => (
          <div key={`rt-${i}`} className="absolute pointer-events-none z-20" style={{ left: r.left, top: r.top }}>
            <div style={{
              width: r.w, height: r.h,
              background: r.color,
              borderRadius: '2px',
              transform: `rotate(${r.rotate})`,
              opacity: 0.95,
              boxShadow: `0 0 6px ${r.color}88`,
            }} />
          </div>
        ))}
        {/* Ribbon decorations — bottom */}
        {RIBBONS.filter(r => r.bottom !== undefined).map((r, i) => (
          <div key={`rb-${i}`} className="absolute pointer-events-none z-20" style={{ left: r.left, bottom: r.bottom }}>
            <div style={{
              width: r.w, height: r.h,
              background: r.color,
              borderRadius: '2px',
              transform: `rotate(${r.rotate})`,
              opacity: 0.95,
              boxShadow: `0 0 6px ${r.color}88`,
            }} />
          </div>
        ))}
        {/* Side ribbons */}
        {SIDE_RIBBONS.map((r, i) => (
          <div key={`rs-${i}`} className="absolute pointer-events-none z-20" style={{
            top: r.top,
            [r.side]: r.side === 'left' ? '-4px' : '-4px',
          }}>
            <div style={{
              width: r.w, height: r.h,
              background: r.color,
              borderRadius: '2px',
              transform: `rotate(${r.rotate})`,
              opacity: 0.85,
              boxShadow: `0 0 6px ${r.color}88`,
            }} />
          </div>
        ))}

        {/* Main card */}
        <div className="relative rounded-2xl overflow-hidden"
          style={{
            background: 'linear-gradient(160deg, #1a0030 0%, #0d001f 40%, #1a0a00 100%)',
            border: '1px solid transparent',
            backgroundClip: 'padding-box',
            boxShadow: '0 0 0 1.5px rgba(168,85,247,0.5), inset 0 0 60px rgba(168,85,247,0.05)',
          }}>

          {/* Rainbow top border */}
          <div className="absolute top-0 left-0 right-0 h-[3px]"
            style={{ background: 'linear-gradient(90deg, #f43f5e, #f97316, #facc15, #34d399, #22d3ee, #818cf8, #c084fc, #f43f5e)' }} />

          {/* Rainbow bottom border */}
          <div className="absolute bottom-0 left-0 right-0 h-[2px]"
            style={{ background: 'linear-gradient(90deg, #c084fc, #818cf8, #22d3ee, #34d399, #facc15, #f97316, #f43f5e)' }} />

          {/* Glow blobs */}
          <div className="absolute -top-8 -left-8 w-32 h-32 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.25), transparent)', filter: 'blur(20px)' }} />
          <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.2), transparent)', filter: 'blur(20px)' }} />

          {/* Close */}
          <button onClick={onClose}
            className="absolute top-2.5 right-2.5 z-20 w-6 h-6 flex items-center justify-center rounded-md transition-colors"
            style={{ color: 'rgba(255,255,255,0.3)' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'white')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}>
            <i className="fas fa-times text-xs"></i>
          </button>

          <div className="relative px-5 pt-5 pb-4">
            {/* Badge */}
            <div className="flex justify-center mb-3">
              <span className="inline-flex items-center gap-1 text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full"
                style={{ background: 'linear-gradient(135deg, rgba(168,85,247,0.2), rgba(249,115,22,0.2))', border: '1px solid rgba(168,85,247,0.4)', color: '#c084fc' }}>
                <i className="fas fa-star text-[6px]"></i> EXCLUSIVE BONUS OFFER
              </span>
            </div>

            {/* Icon */}
            <div className="flex justify-center mb-3">
              <div className="relative w-14 h-14">
                <div className="absolute inset-0 rounded-xl animate-pulse"
                  style={{ background: 'linear-gradient(135deg, rgba(168,85,247,0.4), rgba(249,115,22,0.3))', filter: 'blur(10px)' }} />
                <div className="relative w-14 h-14 rounded-xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #3b0764, #7c2d12)', border: '1px solid rgba(168,85,247,0.5)' }}>
                  <span className="text-2xl">🎁</span>
                </div>
              </div>
            </div>

            {/* Headline */}
            <div className="text-center mb-4">
              <p className="font-black uppercase tracking-wide mb-0.5"
                style={{ fontSize: '11px', background: 'linear-gradient(90deg, #f43f5e, #f97316, #facc15)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                100% BONUS OFFER
              </p>
              <h2 className="font-black uppercase italic leading-none mb-1"
                style={{ fontSize: '28px', background: 'linear-gradient(135deg, #fff 20%, #c084fc 60%, #f97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textShadow: 'none' }}>
                BUY 1 GET 2×
              </h2>
              <p className="font-bold" style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)' }}>
                Double product on selected packages
              </p>
            </div>

            {/* Package grid */}
            <div className="mb-4 rounded-xl overflow-hidden"
              style={{ border: '1px solid rgba(168,85,247,0.2)', background: 'rgba(255,255,255,0.02)' }}>
              <p className="text-center font-black uppercase tracking-[0.2em] py-1.5 border-b"
                style={{ fontSize: '7px', color: 'rgba(255,255,255,0.35)', borderColor: 'rgba(168,85,247,0.15)' }}>
                Eligible Packages
              </p>
              <div className="grid grid-cols-2">
                {packages.map((pkg, i) => (
                  <div key={i}
                    className="flex items-center gap-2 px-3 py-1.5"
                    style={{ borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.04)' : 'none', borderRight: i % 2 === 0 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                    <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
                      style={{ background: `${pkg.color}18`, border: `1px solid ${pkg.color}40` }}>
                      <i className={`fas ${pkg.icon}`} style={{ fontSize: '7px', color: pkg.color }}></i>
                    </div>
                    <span className="font-bold" style={{ fontSize: '8.5px', color: 'rgba(255,255,255,0.75)' }}>{pkg.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Support */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <a href="https://t.me/adixoglory" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl transition-opacity hover:opacity-80"
                style={{ background: 'rgba(14,165,233,0.08)', border: '1px solid rgba(14,165,233,0.25)' }}>
                <i className="fab fa-telegram text-sm" style={{ color: '#38bdf8' }}></i>
                <div>
                  <p className="font-black" style={{ fontSize: '8px', color: '#7dd3fc' }}>@adixoglory</p>
                  <p className="font-bold" style={{ fontSize: '7px', color: 'rgba(14,165,233,0.5)' }}>Group</p>
                </div>
              </a>
              <a href="https://t.me/AdiXO_TV" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl transition-opacity hover:opacity-80"
                style={{ background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.25)' }}>
                <i className="fas fa-headset text-sm" style={{ color: '#fb923c' }}></i>
                <div>
                  <p className="font-black" style={{ fontSize: '8px', color: '#fdba74' }}>@AdiXO_TV</p>
                  <p className="font-bold" style={{ fontSize: '7px', color: 'rgba(249,115,22,0.5)' }}>Support</p>
                </div>
              </a>
            </div>

            {/* CTA */}
            <button onClick={onClose}
              className="w-full py-2.5 rounded-xl font-black uppercase tracking-[0.1em] text-black transition-all active:scale-95"
              style={{ fontSize: '10px', background: 'linear-gradient(135deg, #f43f5e, #f97316, #facc15)', boxShadow: '0 4px 24px rgba(249,115,22,0.45)' }}>
              🎉 CLAIM MY BONUS
            </button>

            <p className="text-center mt-2 font-bold" style={{ fontSize: '7px', color: 'rgba(255,255,255,0.2)' }}>
              Contact support on Telegram to activate
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BonusOfferPopup;
