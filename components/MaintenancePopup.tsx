import React from 'react';

interface MaintenancePopupProps {
  onClose: () => void;
}

const MaintenancePopup: React.FC<MaintenancePopupProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-[#121214] rounded-3xl border border-zinc-800 shadow-2xl overflow-hidden relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-white transition-colors"
        >
          <i className="fas fa-times text-xs"></i>
        </button>

        <div className="p-8 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center mb-6 border border-orange-500/20">
            <i className="fas fa-shield-alt text-2xl text-orange-500"></i>
          </div>

          <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-4">
            PAYMENT <span className="text-orange-500">NOTICE</span>
          </h2>

          <div className="space-y-4 text-zinc-400 text-sm leading-relaxed">
            <p>
              We are currently performing scheduled maintenance on our <span className="text-white font-bold">bKash Payment Gateway</span> to provide you with a more secure and seamless experience.
            </p>
            
            <div className="bg-black/40 border border-zinc-800/50 p-4 rounded-xl italic">
              "Our systems are being optimized for better performance and instant transaction processing."
            </div>

            <p>
              bKash payments will be enabled shortly. In the meantime, you can use our <span className="text-yellow-500 font-bold italic">Binance Gateway</span> for instant top-ups.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-zinc-800/50 w-full">
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-4">
              Reach out to us on Telegram: <span className="text-orange-500">@AdiXO_TV</span>
            </p>
            
            <button 
              onClick={onClose}
              className="w-full bg-orange-500 hover:bg-orange-600 text-black font-black py-4 rounded-xl uppercase tracking-widest text-xs transition-all active:scale-95 shadow-lg shadow-orange-500/20"
            >
              I UNDERSTAND
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenancePopup;
