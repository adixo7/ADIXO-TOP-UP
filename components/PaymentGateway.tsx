import React, { useState } from 'react';
import { PaymentMethod, Package, Game } from '../types';

interface PaymentGatewayProps {
  method: PaymentMethod;
  pkg: Package;
  game: Game;
  playerId: string;
  onComplete: (trxId: string) => void;
  onCancel: () => void;
}

const PaymentGateway: React.FC<PaymentGatewayProps> = ({ method, pkg, game, playerId, onComplete, onCancel }) => {
  const [trxId, setTrxId] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const isBinance = method.id === 'binance';
  const merchantNumber = isBinance ? "1118923099" : "01884-699655";
  const primaryColor = isBinance ? '#F3BA2F' : '#D12053';
  const secondaryColor = isBinance ? 'rgba(243, 186, 47, 0.1)' : 'rgba(209, 32, 83, 0.1)';
  const idLabel = isBinance ? "MERCHANT BINANCE ID" : "MERCHANT BKASH NUMBER";

  const handleCopy = () => {
    navigator.clipboard.writeText(merchantNumber);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (trxId.length < 8) return;
    setIsVerifying(true);
    setTimeout(() => onComplete(trxId), 2000);
  };

  const instructions = isBinance ? [
    { id: 1, text: "Open Binance App" },
    { id: 2, text: "Select 'Send'" },
    { id: 3, text: "Choose 'Binance ID'" },
    { id: 4, text: `Enter: ${merchantNumber}` },
    { id: 5, text: `Enter USD Amount` },
    { id: 6, text: "Activity TrxID" }
  ] : [
    { id: 1, text: "Open bKash App" },
    { id: 2, text: "Select 'Send Money'" },
    { id: 3, text: "Enter Merchant No." },
    { id: 4, text: merchantNumber },
    { id: 5, text: `Amount: ৳${pkg.price}` },
    { id: 6, text: "Submit TrxID Below" }
  ];

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/98 backdrop-blur-2xl animate-in fade-in duration-300">
      <div className="w-full h-full md:h-auto md:max-w-xl bg-[#09090b] md:rounded-[2rem] md:border md:border-zinc-800 shadow-2xl flex flex-col p-4 md:p-6 overflow-hidden max-h-screen">
        
        {/* Header - Compact */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-black text-white uppercase italic tracking-tighter leading-none">
              {method.name} <span style={{ color: primaryColor }}>GATEWAY</span>
            </h2>
            <div className="flex items-center gap-1.5 bg-black/60 border border-zinc-800 px-2 py-0.5 rounded-[4px]">
               <span className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></span>
               <span className="text-zinc-500 text-[8px] font-black uppercase tracking-widest">SECURE</span>
            </div>
          </div>
          <button onClick={onCancel} className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-white transition-colors">
            <i className="fas fa-times text-xs"></i>
          </button>
        </div>

        {/* Info Grid - Reduced Spacing */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-[#121214] p-3 rounded-2xl border border-zinc-800/60 flex flex-col items-center text-center">
            <p className="text-zinc-500 text-[8px] font-black uppercase tracking-widest mb-1">TOTAL DUE</p>
            <div className="flex items-baseline gap-0.5 italic" style={{ color: primaryColor }}>
              <span className="text-sm font-black leading-none">{isBinance ? '$' : '৳'}</span>
              <span className="text-xl font-black leading-none tracking-tighter">{pkg.price.toFixed(0)}</span>
            </div>
          </div>
          <div className="bg-[#121214] p-3 rounded-2xl border border-zinc-800/60 flex flex-col items-center text-center">
            <p className="text-zinc-500 text-[8px] font-black uppercase tracking-widest mb-1">TARGET ID</p>
            <p className="text-xs font-black text-white italic tracking-tighter truncate leading-none pt-0.5">{playerId}</p>
          </div>
        </div>

        {/* Merchant Card - More Compact */}
        <div className="bg-[#121214] rounded-xl border-l-4 border-zinc-800 p-4 relative mb-4" style={{ borderLeftColor: primaryColor }}>
          <div className="flex justify-between items-center">
            <div>
              <span className="text-zinc-500 text-[8px] font-black uppercase tracking-widest block mb-1">{idLabel}</span>
              <span className="text-2xl font-black tracking-tighter leading-none" style={{ color: primaryColor }}>
                {merchantNumber}
              </span>
            </div>
            <button 
              onClick={handleCopy}
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-90 shadow-lg shrink-0"
              style={{ backgroundColor: primaryColor, color: '#000' }}
            >
              <i className={`fas ${copySuccess ? 'fa-check' : 'fa-copy'}`}></i>
            </button>
          </div>
        </div>

        {/* Heading Section */}
        <div className="text-center mb-4">
          <h3 className="text-xl font-black text-white uppercase tracking-tighter italic leading-none">
            SECURE <span style={{ color: primaryColor }}>PAYMENT</span>
          </h3>
          <p className="text-zinc-600 text-[8px] font-bold uppercase tracking-widest mt-1">Follow these steps to complete mission.</p>
        </div>

        {/* Grid - Tightened */}
        <div className="grid grid-cols-2 gap-2 mb-6 overflow-hidden">
          {instructions.map((step) => (
            <div key={step.id} className="bg-[#121214] border border-zinc-800/40 p-2.5 rounded-lg flex items-center gap-2 group">
              <div 
                className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-black shrink-0"
                style={{ backgroundColor: secondaryColor, color: primaryColor, border: `1px solid ${primaryColor}40` }}
              >
                {step.id}
              </div>
              <p className="text-zinc-400 text-[9px] font-black uppercase tracking-tight leading-tight group-hover:text-white transition-colors truncate">{step.text}</p>
            </div>
          ))}
        </div>

        {/* Verification - Compact form at bottom */}
        <div className="mt-auto pt-4 border-t border-zinc-800/50 space-y-4">
          <div className="space-y-1.5">
            <div className="flex justify-between items-center px-1">
              <label className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">TRANSACTION ID (TRXID)</label>
              {isBinance && (
                <a href="https://www.binance.com" target="_blank" className="text-[8px] font-black text-orange-500 uppercase tracking-widest hover:underline">Open App</a>
              )}
            </div>
            <input 
              type="text" 
              required
              value={trxId}
              onChange={(e) => setTrxId(e.target.value.toUpperCase())}
              placeholder="ENTER TRXID HERE"
              className="w-full bg-[#121214] border border-zinc-800 rounded-xl py-3 px-4 text-white text-base font-mono focus:outline-none focus:border-orange-600 transition-all placeholder:text-zinc-900"
            />
          </div>
          <button 
            onClick={handleVerify}
            disabled={trxId.length < 8 || isVerifying}
            className="w-full bg-zinc-100 hover:bg-white text-black font-black py-4 rounded-xl uppercase tracking-widest text-[10px] transition-all disabled:opacity-50 active:scale-95 shadow-xl"
          >
            {isVerifying ? (
              <span className="flex items-center justify-center gap-2">
                <i className="fas fa-spinner fa-spin"></i> VERIFYING...
              </span>
            ) : 'CONFIRM TRANSACTION'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default PaymentGateway;