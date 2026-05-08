import React, { useState, useEffect } from 'react';

const STEPS = [
  {
    icon: 'fa-gamepad',
    color: 'from-orange-500 to-red-600',
    glow: 'rgba(249,115,22,0.3)',
    title: 'Welcome to ADIXO',
    subtitle: 'Your premium gaming top-up store',
    desc: 'Top up diamonds, UC, memberships and more for Free Fire, PUBG, Mobile Legends and many other games — at the best prices in Bangladesh.',
  },
  {
    icon: 'fa-magnifying-glass',
    color: 'from-blue-500 to-cyan-600',
    glow: 'rgba(59,130,246,0.3)',
    title: 'Browse Games',
    subtitle: 'Step 1 — Pick your game',
    desc: 'Head to the Games tab and choose from Free Fire, PUBG Mobile, Mobile Legends, Blood Strike, Call of Duty Mobile, AI Bots, FF Panel, Event Bypass, and PC Games.',
  },
  {
    icon: 'fa-box-open',
    color: 'from-violet-500 to-purple-700',
    glow: 'rgba(139,92,246,0.3)',
    title: 'Select a Package',
    subtitle: 'Step 2 — Choose what you need',
    desc: 'Pick diamonds, UC, memberships, level passes, AI bots, mystery boxes, PC games or panel tools. Enter your Player ID and you\'re almost done!',
  },
  {
    icon: 'fa-credit-card',
    color: 'from-emerald-500 to-teal-600',
    glow: 'rgba(16,185,129,0.3)',
    title: 'Pay Securely',
    subtitle: 'Step 3 — Choose payment method',
    desc: 'Pay with bKash, Nagad, Rocket or Binance. After sending payment, share your transaction ID through Telegram and our team processes your order instantly.',
  },
  {
    icon: 'fa-bolt',
    color: 'from-amber-500 to-yellow-500',
    glow: 'rgba(245,158,11,0.3)',
    title: 'Fast Delivery',
    subtitle: 'Step 4 — Delivered in minutes!',
    desc: 'Most top-ups are delivered within 5–30 minutes. For urgent orders or any help, contact our 24/7 support on Telegram @AdiXO_TV.',
  },
];

const LS_KEY = 'adixo_onboarding_done';

interface OnboardingTourProps {
  onDone: () => void;
}

const OnboardingTour: React.FC<OnboardingTourProps> = ({ onDone }) => {
  const [step, setStep] = useState(0);
  const [leaving, setLeaving] = useState(false);

  const advance = () => {
    if (step < STEPS.length - 1) {
      setLeaving(true);
      setTimeout(() => { setStep(s => s + 1); setLeaving(false); }, 200);
    } else {
      finish();
    }
  };

  const finish = () => {
    localStorage.setItem(LS_KEY, '1');
    onDone();
  };

  const s = STEPS[step];

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
      <div
        className={`relative bg-zinc-950 border border-zinc-800 rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden transition-all duration-200 ${leaving ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
      >
        {/* Glow */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(circle at 50% 0%, ${s.glow}, transparent 70%)` }}></div>

        {/* Skip */}
        <button
          onClick={finish}
          className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-300 text-[10px] font-bold uppercase tracking-widest transition-colors z-10"
        >
          Skip
        </button>

        {/* Icon */}
        <div className="flex justify-center pt-10 pb-5">
          <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${s.color} flex items-center justify-center shadow-2xl`} style={{ boxShadow: `0 0 40px ${s.glow}` }}>
            <i className={`fas ${s.icon} text-white text-4xl`}></i>
          </div>
        </div>

        {/* Text */}
        <div className="px-7 pb-2 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-500 mb-1">{s.subtitle}</p>
          <h2 className="text-white text-2xl font-black uppercase italic tracking-tight mb-3">{s.title}</h2>
          <p className="text-zinc-400 text-[13px] leading-relaxed">{s.desc}</p>
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 py-5">
          {STEPS.map((_, i) => (
            <button
              key={i}
              onClick={() => { setLeaving(true); setTimeout(() => { setStep(i); setLeaving(false); }, 200); }}
              className={`rounded-full transition-all duration-300 ${i === step ? 'w-6 h-2 bg-orange-500' : 'w-2 h-2 bg-zinc-700 hover:bg-zinc-500'}`}
            />
          ))}
        </div>

        {/* CTA */}
        <div className="px-6 pb-7">
          <button
            onClick={advance}
            className={`w-full py-3.5 rounded-2xl font-black text-sm uppercase tracking-widest text-white transition-all active:scale-95 bg-gradient-to-r ${s.color} shadow-lg`}
            style={{ boxShadow: `0 8px 25px ${s.glow}` }}
          >
            {step < STEPS.length - 1 ? 'Next →' : 'Get Started!'}
          </button>
        </div>
      </div>
    </div>
  );
};

export { LS_KEY };
export default OnboardingTour;
