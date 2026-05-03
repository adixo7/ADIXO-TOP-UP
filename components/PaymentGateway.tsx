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

const METHOD_CONFIG: Record<string, {
  primaryColor: string;
  secondaryColor: string;
  merchantLabel: string;
  merchantNumber: string;
  qrImage: string;
  currency: 'BDT' | 'USD';
  appLink?: string;
  instructions: { id: number; text: string }[];
}> = {
  bkash: {
    primaryColor: '#D12053',
    secondaryColor: 'rgba(209, 32, 83, 0.1)',
    merchantLabel: 'MERCHANT BKASH NUMBER',
    merchantNumber: '01884-699655',
    qrImage: '/images/bkash-qr.jpg',
    currency: 'BDT',
    instructions: [
      { id: 1, text: "Open bKash App" },
      { id: 2, text: "Tap 'Scan QR'" },
      { id: 3, text: "Scan bKash QR" },
      { id: 4, text: "Enter BDT Amount" },
      { id: 5, text: "Enter PIN & Send" },
      { id: 6, text: "Submit TrxID Below" },
    ],
  },
  nagad: {
    primaryColor: '#F05A28',
    secondaryColor: 'rgba(240, 90, 40, 0.1)',
    merchantLabel: 'MERCHANT NAGAD NUMBER',
    merchantNumber: '01884-699655',
    qrImage: '/images/bkash-qr.jpg',
    currency: 'BDT',
    instructions: [
      { id: 1, text: "Open Nagad App" },
      { id: 2, text: "Tap 'Scan QR'" },
      { id: 3, text: "Scan Nagad QR" },
      { id: 4, text: "Enter BDT Amount" },
      { id: 5, text: "Enter PIN & Send" },
      { id: 6, text: "Submit TrxID Below" },
    ],
  },
  rocket: {
    primaryColor: '#8B35C9',
    secondaryColor: 'rgba(139, 53, 201, 0.1)',
    merchantLabel: 'MERCHANT ROCKET NUMBER',
    merchantNumber: '01884-699655',
    qrImage: '/images/bkash-qr.jpg',
    currency: 'BDT',
    instructions: [
      { id: 1, text: "Open Rocket App" },
      { id: 2, text: "Tap 'Send Money'" },
      { id: 3, text: "Enter Number" },
      { id: 4, text: "Enter BDT Amount" },
      { id: 5, text: "Enter PIN & Send" },
      { id: 6, text: "Submit TrxID Below" },
    ],
  },
  binance: {
    primaryColor: '#F3BA2F',
    secondaryColor: 'rgba(243, 186, 47, 0.1)',
    merchantLabel: 'MERCHANT BINANCE ID',
    merchantNumber: '1118923099',
    qrImage: '/images/binance-qr.jpg',
    currency: 'USD',
    appLink: 'https://www.binance.com',
    instructions: [
      { id: 1, text: "Open Binance App" },
      { id: 2, text: "Scan Binance QR" },
      { id: 3, text: "Enter USD Amount" },
      { id: 4, text: "Confirm Payment" },
      { id: 5, text: "Get Transaction ID" },
      { id: 6, text: "Submit TrxID Below" },
    ],
  },
};

const PaymentGateway: React.FC<PaymentGatewayProps> = ({ method, pkg, game, playerId, onComplete, onCancel }) => {
  const [trxId, setTrxId] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const config = METHOD_CONFIG[method.id] ?? METHOD_CONFIG['bkash'];
  const exchangeRate = 126;

  const isBinance = config.currency === 'USD';
  const displayPrice = isBinance
    ? (pkg.currency === 'USD' ? pkg.price : pkg.price / exchangeRate)
    : (pkg.currency === 'BDT' ? pkg.price : pkg.price * exchangeRate);

  const { primaryColor, secondaryColor, merchantLabel, merchantNumber, qrImage, appLink, instructions } = config;

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

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/98 backdrop-blur-2xl animate-in fade-in duration-300">
      <div className="w-full h-full md:h-auto md:max-w-xl bg-[#09090b] md:rounded-[2rem] md:border md:border-zinc-800 shadow-2xl flex flex-col p-4 md:p-5 overflow-y-auto max-h-screen">

        {/* Header */}
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-black text-white uppercase italic tracking-tighter leading-none">
              {method.name} <span style={{ color: primaryColor }}>GATEWAY</span>
            </h2>
            <div className="flex items-center gap-1.5 bg-black/60 border border-zinc-800 px-2 py-0.5 rounded-[4px]">
              <span className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-zinc-500 text-[7px] font-black uppercase tracking-widest">SECURE</span>
            </div>
          </div>
          <button onClick={onCancel} className="w-7 h-7 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-white transition-colors">
            <i className="fas fa-times text-[10px]"></i>
          </button>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="bg-[#121214] p-2 rounded-xl border border-zinc-800/60 flex flex-col items-center text-center">
            <p className="text-zinc-500 text-[7px] font-black uppercase tracking-widest mb-0.5">TOTAL DUE</p>
            <div className="flex items-baseline gap-0.5 italic" style={{ color: primaryColor }}>
              <span className="text-xs font-black leading-none">{isBinance ? '$' : '৳'}</span>
              <span className="text-lg font-black leading-none tracking-tighter">
                {isBinance ? displayPrice.toFixed(2) : displayPrice.toFixed(0)}
              </span>
            </div>
          </div>
          <div className="bg-[#121214] p-2 rounded-xl border border-zinc-800/60 flex flex-col items-center text-center">
            <p className="text-zinc-500 text-[7px] font-black uppercase tracking-widest mb-0.5">TARGET ID</p>
            <p className="text-[10px] font-black text-white italic tracking-tighter truncate leading-none pt-0.5">{playerId}</p>
          </div>
        </div>

        {/* QR Code */}
        <div className="flex flex-col items-center mb-3 space-y-2">
          <div className="bg-white p-1.5 rounded-xl shadow-2xl border-2" style={{ borderColor: primaryColor }}>
            <img src={qrImage} alt="Payment QR" className="w-32 h-32 object-contain" />
          </div>
          <p className="text-white text-[9px] font-black uppercase tracking-widest animate-pulse">Scan to Pay</p>
        </div>

        {/* Merchant Number Card */}
        <div className="bg-[#121214] rounded-xl border-l-4 border-zinc-800 p-3 relative mb-3" style={{ borderLeftColor: primaryColor }}>
          <div className="flex justify-between items-center">
            <div>
              <span className="text-zinc-500 text-[7px] font-black uppercase tracking-widest block mb-0.5">{merchantLabel}</span>
              <span className="text-xl font-black tracking-tighter leading-none" style={{ color: primaryColor }}>
                {merchantNumber}
              </span>
            </div>
            <button
              onClick={handleCopy}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all active:scale-90 shadow-lg shrink-0"
              style={{ backgroundColor: primaryColor, color: '#000' }}
            >
              <i className={`fas ${copySuccess ? 'fa-check' : 'fa-copy'} text-xs`}></i>
            </button>
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-3">
          <h3 className="text-lg font-black text-white uppercase tracking-tighter italic leading-none">
            SECURE <span style={{ color: primaryColor }}>PAYMENT</span>
          </h3>
          <p className="text-zinc-600 text-[7px] font-bold uppercase tracking-widest mt-0.5">Follow these steps to complete mission.</p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-2 gap-1.5 mb-4">
          {instructions.map((step) => (
            <div key={step.id} className="bg-[#121214] border border-zinc-800/40 p-2 rounded-lg flex items-center gap-1.5 group">
              <div
                className="w-4 h-4 rounded-full flex items-center justify-center text-[7px] font-black shrink-0"
                style={{ backgroundColor: secondaryColor, color: primaryColor, border: `1px solid ${primaryColor}40` }}
              >
                {step.id}
              </div>
              <p className="text-zinc-400 text-[8px] font-black uppercase tracking-tight leading-tight group-hover:text-white transition-colors truncate">{step.text}</p>
            </div>
          ))}
        </div>

        {/* Verification */}
        <div className="mt-auto pt-3 border-t border-zinc-800/50 space-y-3">
          <div className="space-y-1">
            <div className="flex justify-between items-center px-1">
              <label className="text-[7px] font-black text-zinc-500 uppercase tracking-widest">TRANSACTION ID (TRXID)</label>
              {appLink && (
                <a href={appLink} target="_blank" className="text-[7px] font-black text-orange-500 uppercase tracking-widest hover:underline">Open App</a>
              )}
            </div>
            <input
              type="text"
              required
              value={trxId}
              onChange={(e) => setTrxId(e.target.value.toUpperCase())}
              placeholder="ENTER TRXID HERE"
              className="w-full bg-[#121214] border border-zinc-800 rounded-lg py-2.5 px-3 text-white text-sm font-mono focus:outline-none focus:border-orange-600 transition-all placeholder:text-zinc-900"
            />
          </div>
          <button
            onClick={handleVerify}
            disabled={trxId.length < 8 || isVerifying}
            className="w-full bg-zinc-100 hover:bg-white text-black font-black py-3 rounded-lg uppercase tracking-widest text-[9px] transition-all disabled:opacity-50 active:scale-95 shadow-xl"
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
