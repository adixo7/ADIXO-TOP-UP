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
    <section className="py-8 md:py-16 animate-in fade-in duration-1000">
      <div className="max-w-4xl mx-auto px-4 mb-8 md:mb-16">
        <div className="bg-[#0c0c0e] border border-zinc-800/50 rounded-2xl overflow-hidden flex flex-col md:flex-row min-h-[300px]">
          {/* Left Side: Support Info */}
          <div className="flex-1 p-6 md:p-10 flex flex-col justify-between border-b md:border-b-0 md:border-r border-zinc-800/50">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 mb-6">
                <i className="far fa-comment-dots text-orange-500 text-[10px]"></i>
                <span className="text-orange-500 text-[9px] font-bold tracking-widest uppercase">24/7 Live Support</span>
              </div>
              
              <h2 className="text-white text-3xl md:text-4xl font-black italic uppercase tracking-tighter leading-none mb-4">
                Need Help<br />With<br />
                <span className="text-orange-500">Your Order?</span>
              </h2>
              
              <p className="text-zinc-400 text-xs md:text-sm leading-relaxed mb-6 max-w-xs">
                Our dedicated support team is ready to assist you. Contact our head administrator directly on Telegram for instant resolution of any queries.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                <i className="fab fa-telegram-plane text-orange-500 text-lg"></i>
              </div>
              <div>
                <p className="text-zinc-500 text-[9px] font-bold uppercase tracking-widest">Telegram Username</p>
                <p className="text-white text-sm font-bold italic">@AdiXO_TV</p>
              </div>
            </div>
          </div>

          {/* Right Side: Profile Card */}
          <div className="flex-1 p-6 md:p-10 flex flex-col items-center justify-center text-center bg-zinc-900/20">
            <div className="relative mb-6">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-zinc-800 p-1.5 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <img 
                  src="/images/support-avatar.jpg" 
                  alt="Support Admin" 
                  className="w-full h-full rounded-full object-cover grayscale hover:grayscale-0 transition-all duration-700 scale-110"
                />
              </div>
              <div className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 rounded-full border-4 border-[#0c0c0e] shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
            </div>

            <h3 className="text-white text-xl font-black italic uppercase tracking-tight mb-0.5">Adixo Support</h3>
            <p className="text-orange-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-8">Head Administrator</p>

            <a 
              href="https://t.me/AdiXO_TV" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full bg-orange-500 hover:bg-orange-600 text-black font-black italic uppercase tracking-wider py-4 px-6 rounded-xl flex items-center justify-center gap-2.5 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-orange-500/20 text-sm"
            >
              Message on Telegram
              <i className="fas fa-external-link-alt text-xs"></i>
            </a>
            
            <p className="mt-4 text-zinc-500 text-[9px] font-bold uppercase tracking-widest">Typical response time: &lt; 5 mins</p>
          </div>
        </div>
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
    </section>
  );
};

export default Features;