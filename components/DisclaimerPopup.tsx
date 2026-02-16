
import React from 'react';

interface DisclaimerPopupProps {
  onClose: () => void;
}

const DisclaimerPopup: React.FC<DisclaimerPopupProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-[#0f0f0c] border border-orange-500/20 p-6 rounded-[2rem] max-w-[360px] w-full relative shadow-[0_0_40px_-10px_rgba(249,115,22,0.2)]">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-zinc-600 hover:text-white transition-colors p-1"
        >
          <i className="fas fa-times text-lg"></i>
        </button>
        
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-orange-500/10 border border-orange-500/30 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-500/10">
            <i className="fas fa-handshake text-orange-500 text-2xl"></i>
          </div>
          <h2 className="text-xl font-black text-white uppercase italic tracking-tighter mb-3 gaming-font">
            ADIXO X CG AHNAF
          </h2>
          
          <div className="space-y-3 text-zinc-400 text-xs font-medium leading-relaxed">
            <p>
              It is a collaboration running between <span className="text-white font-bold uppercase italic">ADIXO</span> and <span className="text-white font-bold uppercase italic">CG AHNAF</span>.
            </p>
            <p>
              For authentic products, only order from our official website.
            </p>
            
            <div className="bg-zinc-900/50 border border-zinc-800 p-3 rounded-xl italic text-[10px]">
              "Our methods are 100% safe and based on real-player optimization techniques."
            </div>

            <div className="pt-2 space-y-2">
              <p className="text-[9px] uppercase tracking-widest text-zinc-500 font-black">Official Channels</p>
              <div className="flex flex-col gap-1.5">
                <a 
                  href="https://t.me/adixoglory" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-orange-500 font-black hover:text-orange-400 transition-colors flex items-center justify-center gap-2"
                >
                  <i className="fab fa-telegram"></i> @adixoglory
                </a>
                <p className="text-[9px] text-zinc-500 leading-none">Official updates group</p>
                
                <a 
                  href="https://t.me/AdiXO_TV" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-orange-500 font-black hover:text-orange-400 transition-colors flex items-center justify-center gap-2 mt-1"
                >
                  <i className="fas fa-headset"></i> @AdiXO_TV
                </a>
                <p className="text-[9px] text-zinc-500 leading-none">Payment issues support</p>
              </div>
            </div>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="w-full bg-orange-500 hover:bg-orange-600 text-black font-black py-3.5 rounded-xl uppercase tracking-[0.2em] text-[11px] transition-all shadow-lg shadow-orange-600/10 active:scale-95"
        >
          I UNDERSTAND
        </button>
      </div>
    </div>
  );
};

export default DisclaimerPopup;
