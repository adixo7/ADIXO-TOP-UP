import React, { useEffect, useState } from 'react';

interface ServerIssuePopupProps {
  onAgree: () => void;
  onAvoid: () => void;
}

const ServerIssuePopup: React.FC<ServerIssuePopupProps> = ({ onAgree, onAvoid }) => {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = (callback: () => void) => {
    setIsClosing(true);
    setTimeout(() => callback(), 220);
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose(onAvoid); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <div
      className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      style={{ animation: isClosing ? 'siFadeOut 0.22s ease forwards' : 'siFadeIn 0.3s ease forwards' }}
    >
      <style>{`
        @keyframes siFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes siFadeOut { from { opacity: 1; } to { opacity: 0; } }
      `}</style>
      <div
        className="relative max-w-[320px] w-full rounded-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, #071a12 0%, #0b2418 60%, #0a0a0f 100%)',
          border: '1px solid rgba(34,197,94,0.35)',
          boxShadow: '0 0 0 1px rgba(34,197,94,0.1), 0 0 60px -10px rgba(34,197,94,0.25)',
        }}
      >
        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(34,197,94,0.7), rgba(250,204,21,0.5), transparent)' }} />

        {/* Glow blobs */}
        <div className="absolute -top-8 -left-8 w-32 h-32 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(34,197,94,0.14), transparent)', filter: 'blur(18px)' }} />
        <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(250,204,21,0.10), transparent)', filter: 'blur(18px)' }} />

        <div className="relative px-5 pt-5 pb-5">

          {/* Icon + badge row */}
          <div className="flex items-center gap-3 mb-4">
            <div className="relative w-11 h-11 shrink-0">
              <div className="absolute inset-0 rounded-xl animate-pulse" style={{ background: 'rgba(34,197,94,0.2)', filter: 'blur(8px)' }} />
              <div className="relative w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #064e3b, #166534)', border: '1px solid rgba(34,197,94,0.5)' }}>
                <i className="fas fa-circle-check text-green-400 text-lg"></i>
              </div>
            </div>
            <div>
              <span className="inline-flex items-center gap-1 text-[8px] font-black uppercase tracking-[0.18em] px-2.5 py-0.5 rounded-full mb-1" style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)', color: '#86efac' }}>
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block"></span>
                Service Update
              </span>
              <h2 className="font-black uppercase text-white leading-tight" style={{ fontSize: '14px', letterSpacing: '-0.01em' }}>
                Guild Glory Bot
              </h2>
            </div>
          </div>

          {/* Divider */}
          <div className="mb-4 h-px" style={{ background: 'linear-gradient(90deg, rgba(34,197,94,0.3), rgba(255,255,255,0.05), transparent)' }} />

          {/* Message body */}
          <div className="rounded-xl p-3.5 mb-4" style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.18)' }}>
            <p className="text-[9px] font-black uppercase tracking-[0.2em] mb-2" style={{ color: 'rgba(248,113,113,0.7)' }}>
              ✓ Current Service Status
            </p>
            <p className="text-xs font-semibold leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)' }}>
              The <span className="text-green-400 font-black">low glory issue is solved!</span>{' '}
              You can now get <span className="text-yellow-300 font-black">high glory</span> from the{' '}
              <span className="text-orange-400 font-black">Guild Glory Bot</span> at a low price.
            </p>
          </div>

          {/* Condition note */}
          <div className="rounded-xl p-3 mb-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <p className="text-[9.5px] font-semibold leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
              <i className="fas fa-circle-info text-[8px] mr-1.5" style={{ color: 'rgba(148,163,184,0.6)' }}></i>
              Our service is running normally again. Order with confidence and enjoy high glory for less.
            </p>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleClose(onAvoid)}
              className="py-2.5 rounded-xl font-black uppercase tracking-[0.08em] transition-all active:scale-95 hover:opacity-90"
              style={{
                fontSize: '9px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.45)',
              }}
            >
              <i className="fas fa-xmark mr-1.5"></i>
              Avoid for Now
            </button>
            <button
              onClick={() => handleClose(onAgree)}
              className="py-2.5 rounded-xl font-black uppercase tracking-[0.08em] text-black transition-all active:scale-95"
              style={{
                fontSize: '9px',
                background: 'linear-gradient(135deg, #facc15, #22c55e)',
                boxShadow: '0 4px 18px rgba(34,197,94,0.35)',
              }}
            >
              <i className="fas fa-check mr-1.5"></i>
              Order Now
            </button>
          </div>

          <p className="text-center mt-3 font-bold" style={{ fontSize: '7px', color: 'rgba(255,255,255,0.15)' }}>
            High glory, low price · Thank you for your patience
          </p>
        </div>
      </div>
    </div>
  );
};

export default ServerIssuePopup;
