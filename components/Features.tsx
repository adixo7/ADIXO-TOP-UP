import React from 'react';

const Features: React.FC = () => {
  const featureList = [
    {
      title: "Instant Delivery",
      description: "Credits added to your account in seconds",
      icon: "fa-bolt",
      color: "text-orange-400",
      bg: "bg-orange-500/5"
    },
    {
      title: "Secure Payment",
      description: "100% secure transaction processing",
      icon: "fa-shield-halved",
      color: "text-orange-400",
      bg: "bg-orange-500/5"
    },
    {
      title: "Best Prices",
      description: "Competitive rates and discounts",
      icon: "fa-credit-card",
      color: "text-orange-400",
      bg: "bg-orange-500/5"
    }
  ];

  return (
    <section className="py-12 md:py-20 animate-in fade-in duration-1000">
      <div className="text-center mb-10 md:mb-16 px-4">
        <p className="text-zinc-400 text-sm md:text-xl max-w-3xl mx-auto leading-relaxed font-medium">
          Instant delivery for your favorite games. Secure payments, 24/7 support, and the best prices in the market.
        </p>
      </div>

      {/* Grid layout: 2 columns on mobile, 3 columns on desktop. Last item centered on mobile. */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 px-4 md:px-0">
        {featureList.map((feature, idx) => (
          <div 
            key={idx} 
            className={`
              bg-[#0c0c0e] border border-zinc-800/50 p-4 md:p-10 rounded-2xl flex flex-col items-center text-center group hover:border-orange-500/30 transition-all duration-500 hover:translate-y-[-4px]
              ${idx === 2 ? 'col-span-2 mx-auto w-[calc(50%-8px)] md:col-span-1 md:w-full' : 'w-full'}
            `}
          >
            {/* Icon container */}
            <div className={`w-12 h-12 md:w-16 md:h-16 ${feature.bg} rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-8 shadow-inner border border-white/5`}>
              <i className={`fas ${feature.icon} ${feature.color} text-base md:text-2xl`}></i>
            </div>
            
            {/* Typography */}
            <h3 className="text-white text-[10px] md:text-xl font-black uppercase italic tracking-tighter mb-2 md:mb-4 leading-tight">
              {feature.title}
            </h3>
            <p className="text-zinc-500 text-[9px] md:text-sm font-medium leading-tight max-w-[120px] md:max-w-[200px]">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-12 md:mt-24 max-w-5xl mx-auto px-4">
        <div className="bg-[#0c0c0e] border border-zinc-800/50 rounded-3xl overflow-hidden flex flex-col md:flex-row min-h-[400px]">
          {/* Left Side: Support Info */}
          <div className="flex-1 p-8 md:p-12 flex flex-col justify-between border-b md:border-b-0 md:border-r border-zinc-800/50">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 mb-8">
                <i className="far fa-comment-dots text-orange-500 text-xs"></i>
                <span className="text-orange-500 text-[10px] font-bold tracking-widest uppercase">24/7 Live Support</span>
              </div>
              
              <h2 className="text-white text-4xl md:text-5xl font-black italic uppercase tracking-tighter leading-none mb-6">
                Need Help<br />With<br />
                <span className="text-orange-500">Your Order?</span>
              </h2>
              
              <p className="text-zinc-400 text-sm md:text-base leading-relaxed mb-8 max-w-sm">
                Our dedicated support team is ready to assist you. Contact our head administrator directly on Telegram for instant resolution of any queries.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                <i className="fab fa-telegram-plane text-orange-500 text-xl"></i>
              </div>
              <div>
                <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Telegram Username</p>
                <p className="text-white font-bold italic">@AdiX0_TV</p>
              </div>
            </div>
          </div>

          {/* Right Side: Profile Card */}
          <div className="flex-1 p-8 md:p-12 flex flex-col items-center justify-center text-center bg-zinc-900/20">
            <div className="relative mb-8">
              <div className="w-48 h-48 rounded-full border-4 border-zinc-800 p-2 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <img 
                  src="/images/support-avatar.jpg" 
                  alt="Support Admin" 
                  className="w-full h-full rounded-full object-cover grayscale hover:grayscale-0 transition-all duration-700 scale-110"
                />
              </div>
              <div className="absolute bottom-4 right-4 w-6 h-6 bg-green-500 rounded-full border-4 border-[#0c0c0e] shadow-[0_0_15px_rgba(34,197,94,0.5)]"></div>
            </div>

            <h3 className="text-white text-2xl font-black italic uppercase tracking-tight mb-1">Adixo Support</h3>
            <p className="text-orange-500 text-xs font-bold uppercase tracking-[0.2em] mb-10">Head Administrator</p>

            <a 
              href="https://t.me/AdiX0_TV" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full bg-orange-500 hover:bg-orange-600 text-black font-black italic uppercase tracking-wider py-5 px-8 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-orange-500/20"
            >
              Message on Telegram
              <i className="fas fa-external-link-alt text-sm"></i>
            </a>
            
            <p className="mt-6 text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Typical response time: &lt; 5 mins</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;