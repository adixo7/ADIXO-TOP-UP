import React from 'react';
import { Game, Package, PaymentMethod } from '../types';

interface Gta6DetailsProps {
  game: Game;
  pkg: Package;
  playerId: string;
  selectedPayment: PaymentMethod | null;
  paymentMethods: PaymentMethod[];
  orderError: string | null;
  onBack: () => void;
  onPlayerIdChange: (value: string) => void;
  onPaymentSelect: (method: PaymentMethod) => void;
  onConfirmOrder: () => void;
}

const REQUIREMENTS = [
  {
    label: 'Estimated minimum configuration',
    subtitle: '1080p entry-level setup',
    icon: 'fa-gauge-low',
    accent: 'text-sky-400',
    border: 'border-sky-500/25',
    rows: [
      ['OS', 'Windows 11 64-bit'],
      ['Processor', 'Intel Core i5-12400F / AMD Ryzen 5 5600'],
      ['Graphics', 'RTX 3060 / RX 6700 XT'],
      ['Memory', '16GB RAM'],
      ['Storage', 'NVMe SSD with 150 to 200GB available'],
    ],
  },
  {
    label: 'Recommended configuration',
    subtitle: '1080p with comfortable smoothness',
    icon: 'fa-display',
    accent: 'text-orange-400',
    border: 'border-orange-500/30',
    rows: [
      ['Processor', 'Intel Core i5-13400F / AMD Ryzen 5 7500F'],
      ['Graphics', 'RTX 5060 / RX 9060 XT'],
      ['Memory', 'Minimum 16GB, 32GB for a more comfortable experience'],
      ['Storage', '1TB NVMe SSD'],
    ],
  },
  {
    label: 'Ideal configuration',
    subtitle: '1440p — the best balance for many PC gamers',
    icon: 'fa-crown',
    accent: 'text-amber-300',
    border: 'border-amber-400/35',
    rows: [
      ['Processor', 'Intel Core i5-14600KF / AMD Ryzen 5 7500F'],
      ['Graphics', 'RTX 5070 / RX 9070'],
      ['Memory', '32GB DDR5'],
      ['Storage', '1 to 2TB NVMe SSD'],
    ],
  },
];

const Gta6Details: React.FC<Gta6DetailsProps> = ({
  game,
  pkg,
  playerId,
  selectedPayment,
  paymentMethods,
  orderError,
  onBack,
  onPlayerIdChange,
  onPaymentSelect,
  onConfirmOrder,
}) => (
  <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 px-1">
    <button
      onClick={onBack}
      className="text-zinc-500 hover:text-white flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors"
    >
      <i className="fas fa-arrow-left"></i> Back to PC games
    </button>

    <section className="relative overflow-hidden rounded-2xl md:rounded-[2rem] border border-orange-500/25 bg-zinc-950 shadow-2xl shadow-orange-950/20">
      <img
        src={game.banner}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover scale-105 opacity-25"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/30"></div>
      <div className="relative grid lg:grid-cols-[1fr_auto] gap-8 items-end p-6 md:p-10 min-h-[280px]">
        <div className="max-w-2xl">
          <p className="text-orange-400 text-[9px] font-black uppercase tracking-[0.3em] mb-3">PC Games • System Guide</p>
          <h1 className="text-3xl md:text-6xl font-black text-white uppercase italic tracking-tighter leading-none">
            Grand Theft Auto VI
          </h1>
          <p className="text-zinc-300 text-sm md:text-base mt-4 max-w-xl leading-relaxed">
            Check the estimated PC requirements before ordering the Premium Edition.
            Choose the setup that matches how you want to play.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-black/60 border border-white/10 rounded-2xl p-3 backdrop-blur-sm">
          <img src={pkg.image || game.image} alt="" className="w-16 h-16 rounded-xl object-cover" />
          <div>
            <p className="text-orange-400 text-[8px] font-black uppercase tracking-widest">Premium Edition</p>
            <p className="text-white font-black text-lg gaming-font">৳{pkg.price.toLocaleString()}</p>
            <p className="text-zinc-500 text-[8px] uppercase tracking-widest">One-time billing</p>
          </div>
        </div>
      </div>
    </section>

    <div className="grid lg:grid-cols-[1.35fr_0.65fr] gap-8 items-start">
      <section className="space-y-4">
        <div>
          <p className="text-orange-500 text-[9px] font-black uppercase tracking-[0.25em]">Hardware requirements</p>
          <h2 className="text-2xl md:text-3xl font-black text-white uppercase italic tracking-tighter mt-1">
            Pick your performance target
          </h2>
        </div>
        <div className="space-y-4">
          {REQUIREMENTS.map((tier) => (
            <article key={tier.label} className={`bg-zinc-950/80 rounded-2xl border ${tier.border} p-5 md:p-6`}>
              <div className="flex items-start gap-3 mb-5">
                <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center ${tier.accent}`}>
                  <i className={`fas ${tier.icon}`}></i>
                </div>
                <div>
                  <h3 className="text-white font-black uppercase italic tracking-tight">{tier.label}</h3>
                  <p className="text-zinc-500 text-[9px] uppercase tracking-widest mt-1">{tier.subtitle}</p>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-x-6 gap-y-3">
                {tier.rows.map(([label, value]) => (
                  <div key={label} className="border-t border-white/5 pt-2.5">
                    <p className="text-zinc-600 text-[8px] font-black uppercase tracking-widest">{label}</p>
                    <p className="text-zinc-200 text-xs leading-relaxed mt-1">{value}</p>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <aside className="lg:sticky lg:top-6 bg-[#0b0b0d] border border-orange-500/30 rounded-2xl p-5 md:p-6 shadow-xl shadow-black/30">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center">
            <i className="fas fa-file-invoice-dollar text-orange-400"></i>
          </div>
          <div>
            <p className="text-orange-400 text-[8px] font-black uppercase tracking-[0.2em]">Billing & delivery</p>
            <h2 className="text-white text-lg font-black uppercase italic tracking-tight">Secure your copy</h2>
          </div>
        </div>

        <div className="rounded-xl bg-zinc-900/70 border border-zinc-800 p-4 mb-5">
          <p className="text-zinc-500 text-[8px] font-black uppercase tracking-widest">Grand Theft Auto VI | Premium Edition</p>
          <div className="flex items-end justify-between gap-3 mt-2">
            <span className="text-zinc-400 text-[10px]">One-time payment</span>
            <span className="text-amber-300 text-2xl font-black gaming-font">৳{pkg.price.toLocaleString()}</span>
          </div>
        </div>

        <label className="block text-zinc-300 text-[9px] font-black uppercase tracking-widest mb-2">
          Email or WhatsApp for delivery
        </label>
        <input
          type="text"
          value={playerId}
          onChange={(e) => onPlayerIdChange(e.target.value)}
          placeholder="Enter your email or WhatsApp number"
          className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors"
        />
        <p className="text-zinc-600 text-[9px] leading-relaxed mt-2">
          Your PC game account details will be delivered through the contact you provide.
        </p>

        <div className="mt-6">
          <p className="text-zinc-300 text-[9px] font-black uppercase tracking-widest mb-3">Payment method</p>
          <div className="grid grid-cols-2 gap-2">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => onPaymentSelect(method)}
                className={`flex items-center gap-2 p-2.5 rounded-xl border transition-all ${
                  selectedPayment?.id === method.id
                    ? 'border-orange-500 bg-orange-500/10'
                    : 'border-zinc-800 bg-zinc-900/40 hover:border-zinc-700'
                }`}
              >
                <img src={method.logo} alt="" className="w-6 h-6 rounded-md object-cover" />
                <span className="text-white text-[9px] font-black uppercase italic truncate">{method.name}</span>
              </button>
            ))}
          </div>
        </div>

        {orderError && (
          <div className="mt-4 flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-xl px-3 py-2">
            <i className="fas fa-exclamation-circle text-red-400 text-[10px]"></i>
            <span className="text-[9px] font-bold text-red-400 uppercase tracking-wide">{orderError}</span>
          </div>
        )}

        <button
          onClick={onConfirmOrder}
          className="w-full mt-5 py-4 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-black uppercase italic tracking-widest text-[10px] transition-all active:scale-[0.98]"
        >
          Continue to secure checkout
        </button>
        <div className="flex items-center justify-center gap-2 mt-4 text-zinc-600 text-[8px] font-black uppercase tracking-widest">
          <i className="fas fa-shield-alt text-emerald-500"></i> Safe checkout
          <span>•</span>
          <i className="fas fa-bolt text-orange-500"></i> Digital delivery
        </div>
      </aside>
    </div>
  </div>
);

export default Gta6Details;