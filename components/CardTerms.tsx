import React from 'react';
import { Game, Package } from '../types';

interface CardTermsProps {
  game: Game;
  pkg: Package;
  onBack: () => void;
  onContinue: () => void;
}

const CardTerms: React.FC<CardTermsProps> = ({ game, pkg, onBack, onContinue }) => {
  const brand = pkg.cardBrand === 'AMERICAN EXPRESS' ? 'AMERICAN EXPRESS' : pkg.cardBrand || 'VISA';

  return (
    <div className="mx-auto max-w-5xl animate-in fade-in slide-in-from-right-4 duration-500 pb-20">
      <button
        type="button"
        onClick={onBack}
        className="mb-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 transition-colors hover:text-white"
      >
        <i className="fas fa-arrow-left" /> Back to cards
      </button>

      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div className="rounded-[1.75rem] border border-white/10 bg-[#101827] p-4 shadow-[0_24px_70px_rgba(0,0,0,0.35)]">
          <div
            className="relative aspect-[1.586/1] overflow-hidden rounded-[1.2rem] border border-white/15 p-5"
            style={{ background: 'linear-gradient(112deg, #155e75 0%, #0c2739 44%, #080e19 100%)' }}
          >
            <span className="pointer-events-none absolute -right-20 -top-24 h-56 w-56 rounded-full bg-cyan-400/20 blur-3xl" />
            <div className="relative flex h-full flex-col justify-between">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="relative flex h-9 w-11 items-center justify-center rounded-xl border border-white/20 bg-black/20 shadow-inner">
                    <span className="relative h-5 w-7 overflow-hidden rounded-[4px] border border-amber-100/70 bg-gradient-to-br from-amber-100 via-yellow-400 to-amber-800 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.75)]">
                      <span className="absolute inset-x-0 top-1/2 border-t border-amber-900/40" />
                      <span className="absolute inset-y-0 left-1/2 border-l border-amber-900/40" />
                      <span className="absolute left-1/3 top-0 h-full border-l border-amber-900/25" />
                    </span>
                  </span>
                  <i className="fas fa-wifi rotate-90 text-[10px] text-white/65" aria-hidden="true" />
                </div>
                <div className="text-right">
                  <p className="text-[clamp(0.85rem,2.2vw,1.25rem)] font-black uppercase italic tracking-[0.04em] text-white">{brand}</p>
                  <p className="mt-1 text-[7px] font-black uppercase tracking-[0.2em] text-cyan-200">Premium card</p>
                </div>
              </div>

              <div>
                <p className="font-mono text-[clamp(0.9rem,2.2vw,1.2rem)] font-semibold tracking-[0.18em] text-white">
                  {pkg.cardNumber}
                </p>
                <div className="mt-4 grid grid-cols-[1.2fr_0.8fr] gap-3">
                  <div>
                    <p className="text-[7px] font-bold uppercase tracking-[0.2em] text-white/55">Card holder</p>
                    <p className="mt-1 text-[clamp(0.7rem,1.5vw,0.9rem)] font-black uppercase tracking-[0.1em] text-white">{pkg.cardHolder}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[7px] font-bold uppercase tracking-[0.2em] text-white/55">Expires</p>
                    <p className="mt-1 text-[clamp(0.7rem,1.5vw,0.9rem)] font-black tracking-[0.1em] text-white">{pkg.cardExpiryFull || pkg.cardExpiry}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-end justify-between gap-3 px-1">
            <div>
              <p className="text-[8px] font-black uppercase tracking-[0.2em] text-zinc-500">Selected card</p>
              <p className="mt-1 text-sm font-black uppercase italic tracking-tight text-white">{pkg.unit}</p>
            </div>
            <p className="font-mono text-xl font-black text-cyan-300">৳{pkg.price.toLocaleString()}</p>
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-orange-500/20 bg-gradient-to-br from-[#171216] via-[#0d0b0d] to-[#0b0b0d] p-5 shadow-[0_24px_70px_rgba(0,0,0,0.35)] md:p-7">
          <p className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.3em] text-orange-400">
            <i className="fas fa-file-signature" /> Card terms & service
          </p>
          <h1 className="mt-3 text-2xl font-black uppercase italic tracking-tight text-white md:text-3xl">Review before ordering</h1>
          <p className="mt-2 text-xs leading-relaxed text-zinc-500">
            Please read these conditions before continuing to the order form for your selected digital card.
          </p>

          <div className="mt-6 space-y-3">
            {[
              'The card preview is masked and the visible details are sample information for presentation.',
              'The selected card is delivered only after payment and order details are verified.',
              'Make sure the email or WhatsApp contact you provide belongs to you and is active.',
              'Do not share card details, delivery messages, or account information with anyone else.',
              'Orders may be subject to availability checks. Contact support if an item is unavailable.',
              'Purchase at your own risk. Review the selected card, price, and delivery details carefully before paying.',
              'Cards can be damaged, declined, expired, or unusable, and we do not provide any guarantee for card performance.',
              'We are not liable for card damage, account restrictions, merchant rejection, delivery issues, or any other card-related problem.',
              'All card purchases are final. No refund, replacement, chargeback, or reversal will be provided after payment.',
            ].map((term, index) => (
              <div key={term} className="flex gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-500/15 text-[9px] font-black text-orange-300">
                  {index + 1}
                </span>
                <p className="text-[10px] leading-relaxed text-zinc-300">{term}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onBack}
              className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-[9px] font-black uppercase tracking-[0.16em] text-zinc-400 transition-colors hover:border-white/30 hover:text-white"
            >
              Go back
            </button>
            <button
              type="button"
              onClick={onContinue}
              className="flex-1 rounded-xl bg-orange-600 px-4 py-3 text-[9px] font-black uppercase tracking-[0.16em] text-white shadow-[0_10px_25px_rgba(234,88,12,0.22)] transition-colors hover:bg-orange-500"
            >
              I agree — continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardTerms;