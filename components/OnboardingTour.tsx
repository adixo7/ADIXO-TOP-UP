import React, { useState } from 'react';
import { useLanguage } from '../LanguageContext';

const STEP_KEYS = [
  { icon: 'fa-gamepad', color: 'from-orange-500 to-red-600', glow: 'rgba(249,115,22,0.3)', key: 'step0' },
  { icon: 'fa-magnifying-glass', color: 'from-blue-500 to-cyan-600', glow: 'rgba(59,130,246,0.3)', key: 'step1' },
  { icon: 'fa-box-open', color: 'from-violet-500 to-purple-700', glow: 'rgba(139,92,246,0.3)', key: 'step2' },
  { icon: 'fa-credit-card', color: 'from-emerald-500 to-teal-600', glow: 'rgba(16,185,129,0.3)', key: 'step3' },
  { icon: 'fa-bolt', color: 'from-amber-500 to-yellow-500', glow: 'rgba(245,158,11,0.3)', key: 'step4' },
];

const LS_KEY = 'adixo_onboarding_done';

interface OnboardingTourProps {
  onDone: () => void;
}

const OnboardingTour: React.FC<OnboardingTourProps> = ({ onDone }) => {
  const [step, setStep] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const { t } = useLanguage();

  const advance = () => {
    if (step < STEP_KEYS.length - 1) {
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

  const s = STEP_KEYS[step];

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
          {t('onboard.skip')}
        </button>

        {/* Icon */}
        <div className="flex justify-center pt-10 pb-5">
          <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${s.color} flex items-center justify-center shadow-2xl`} style={{ boxShadow: `0 0 40px ${s.glow}` }}>
            <i className={`fas ${s.icon} text-white text-4xl`}></i>
          </div>
        </div>

        {/* Text */}
        <div className="px-7 pb-2 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-500 mb-1">{t(`onboard.${s.key}.subtitle`)}</p>
          <h2 className="text-white text-2xl font-black uppercase italic tracking-tight mb-3">{t(`onboard.${s.key}.title`)}</h2>
          <p className="text-zinc-400 text-[13px] leading-relaxed">{t(`onboard.${s.key}.desc`)}</p>
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 py-5">
          {STEP_KEYS.map((_, i) => (
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
            {step < STEP_KEYS.length - 1 ? t('onboard.next') : t('onboard.start')}
          </button>
        </div>
      </div>
    </div>
  );
};

export { LS_KEY };
export default OnboardingTour;
