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
              For <span className="text-white font-bold">bKash</span> payments, please contact us directly via our Telegram. Our team will assist you and process your order promptly and securely.
            </p>

            <div className="bg-black/40 border border-zinc-800/50 p-3 md:p-4 rounded-xl">
              <p className="text-zinc-300 text-xs md:text-sm leading-relaxed" style={{ fontFamily: 'sans-serif' }}>
                বিকাশের মাধ্যমে পেমেন্ট করার জন্য অনুগ্রহ করে নিচে টেলিগ্রাম আইডিটিতে যোগাযোগ করুন।
              </p>
            </div>
          </div>

          <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-zinc-800/50 w-full space-y-3">
            <a
              href="https://t.me/AdiXO_TV"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-[#229ED9] hover:bg-[#1a8ec0] text-white font-black py-3 md:py-4 rounded-xl uppercase tracking-widest text-[10px] md:text-xs transition-all active:scale-95 shadow-lg shadow-blue-500/20"
            >
              <i className="fab fa-telegram text-sm md:text-base"></i>
              Contact @AdiXO_TV on Telegram
            </a>

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
