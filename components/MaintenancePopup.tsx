import React from 'react';

interface MaintenancePopupProps {
  onClose: () => void;
}

const MaintenancePopup: React.FC<MaintenancePopupProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="w-full max-w-[90%] md:max-w-md bg-[#121214] rounded-2xl md:rounded-3xl border border-zinc-800 shadow-2xl overflow-hidden relative">
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 w-7 h-7 md:top-4 md:right-4 md:w-8 md:h-8 flex items-center justify-center rounded-full bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-white transition-colors"
        >
          <i className="fas fa-times text-[10px] md:text-xs"></i>
        </button>

        <div className="p-5 md:p-8 flex flex-col items-center text-center">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-orange-500/10 rounded-full flex items-center justify-center mb-4 md:mb-6 border border-orange-500/20">
            <i className="fas fa-shield-alt text-xl md:text-2xl text-orange-500"></i>
          </div>

          <h2 className="text-xl md:text-2xl font-black text-white uppercase italic tracking-tighter mb-3 md:mb-4">
            PAYMENT <span className="text-orange-500">NOTICE</span>
          </h2>

          <div className="space-y-3 md:space-y-4 text-zinc-400 text-xs md:text-sm leading-relaxed">
            <p>
              We are currently performing scheduled maintenance on our <span className="text-white font-bold">bKash Payment Gateway</span> to provide you with a more secure and seamless experience.
            </p>
            
            <div className="bg-black/40 border border-zinc-800/50 p-3 md:p-4 rounded-xl italic">
              "Our systems are being optimized for better performance and instant transaction processing."
            </div>

            <p>
              bKash payments will be enabled shortly. In the meantime, you can use our <span className="text-yellow-500 font-bold italic">Binance Gateway</span> for instant top-ups.
            </p>
          </div>

          <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-zinc-800/50 w-full">
            <p className="text-zinc-500 text-[8px] md:text-[10px] font-black uppercase tracking-widest mb-3 md:mb-4">
              Reach out to us on Telegram: <span className="text-orange-500">@AdiXO_TV</span>
            </p>
            
            <button 
              onClick={onClose}
              className="w-full bg-orange-500 hover:bg-orange-600 text-black font-black py-3 md:py-4 rounded-xl uppercase tracking-widest text-[10px] md:text-xs transition-all active:scale-95 shadow-lg shadow-orange-500/20"
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
