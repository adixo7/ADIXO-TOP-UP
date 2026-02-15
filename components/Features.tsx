import React from 'react';

const Features: React.FC = () => {
  const featureList = [
    {
      title: "Instant Delivery",
      description: "Credits added to your account in seconds",
      icon: "fa-bolt",
      color: "text-indigo-400",
      bg: "bg-indigo-500/5"
    },
    {
      title: "Secure Payment",
      description: "100% secure transaction processing",
      icon: "fa-shield-halved",
      color: "text-indigo-400",
      bg: "bg-indigo-500/5"
    },
    {
      title: "Best Prices",
      description: "Competitive rates and discounts",
      icon: "fa-credit-card",
      color: "text-indigo-400",
      bg: "bg-indigo-500/5"
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
              bg-[#0c0c0e] border border-zinc-800/50 p-4 md:p-10 rounded-2xl flex flex-col items-center text-center group hover:border-indigo-500/30 transition-all duration-500 hover:translate-y-[-4px]
              ${idx === 2 ? 'col-span-2 mx-auto w-[calc(50%-8px)] md:col-span-1 md:w-full' : 'w-full'}
            `}
          >
            {/* Icon container - Increased size for mobile */}
            <div className={`w-12 h-12 md:w-16 md:h-16 ${feature.bg} rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-8 shadow-inner border border-white/5`}>
              <i className={`fas ${feature.icon} ${feature.color} text-base md:text-2xl`}></i>
            </div>
            
            {/* Typography - Increased sizes for mobile */}
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