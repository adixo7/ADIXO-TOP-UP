
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
  const [step, setStep] = useState(1);
  const [isVerifying, setIsVerifying] = useState(false);

  // Dynamic credentials based on method
  const merchantNumber = method.id === 'bkash' ? "01884-699655" : "1118923099";
  const idLabel = method.id === 'bkash' ? "Merchant Number" : "Binance Pay ID";

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (trxId.length < 8) return;
    
    setIsVerifying(true);
    // Simulate verification
    setTimeout(() => {
      onComplete(trxId);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-6 bg-black/95 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="w-full max-w-4xl bg-zinc-900 border border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-[0_0_80px_-15px_rgba(79,70,229,0.4)] flex flex-col md:flex-row h-full max-h-[800px]">
        
        {/* Sidebar Info */}
        <div className="w-full md:w-1/4 bg-zinc-950 p-8 border-b md:border-b-0 md:border-r border-zinc-800 flex flex-col justify-between">
          <div>
            <div className="w-16 h-16 bg-white rounded-2xl p-2 mb-6 shadow-xl">
              <img src={method.logo} alt={method.name} className="w-full h-full object-contain" />
            </div>
            <h2 className="text-xl font-black text-white uppercase italic tracking-tighter mb-2">{method.name} Gateway</h2>
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest leading-relaxed">Official ADIXO Secure Payment Node</p>
          </div>
          
          <div className="mt-8 space-y-4">
            <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800/50">
              <p className="text-zinc-500 text-[9px] font-black uppercase tracking-widest mb-1">Total Due</p>
              <p className="text-2xl font-black text-indigo-500">৳{pkg.price.toFixed(0)}</p>
            </div>
            <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800/50">
              <p className="text-zinc-500 text-[9px] font-black uppercase tracking-widest mb-1">Target ID</p>
              <p className="text-sm font-mono text-white truncate">{playerId}</p>
            </div>
          </div>
        </div>

        {/* Main Interface */}
        <div className="flex-1 p-8 md:p-12 overflow-y-auto">
          <div className="flex justify-between items-center mb-10">
            <div className="flex gap-2">
              <div className={`w-2 h-2 rounded-full ${step >= 1 ? 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,1)]' : 'bg-zinc-800'}`}></div>
              <div className={`w-2 h-2 rounded-full ${step >= 2 ? 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,1)]' : 'bg-zinc-800'}`}></div>
            </div>
            <button onClick={onCancel} className="text-zinc-500 hover:text-white transition-colors">
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>

          {step === 1 ? (
            <div className="animate-in slide-in-from-right-8 duration-300">
              <div className="flex flex-col gap-10">
                <div className="flex-1">
                  <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-6">Payment Instructions</h3>
                  <ul className="space-y-6">
                    <li className="flex gap-4">
                      <span className="w-6 h-6 rounded-full bg-zinc-800 text-zinc-400 flex items-center justify-center text-[10px] font-black shrink-0">01</span>
                      <p className="text-zinc-400 text-sm leading-relaxed">
                        Open your <strong className="text-white">{method.name}</strong> app and go to <strong className="text-white">{method.id === 'bkash' ? "Send Money" : "Pay"}</strong>.
                      </p>
                    </li>
                    <li className="flex gap-4">
                      <span className="w-6 h-6 rounded-full bg-zinc-800 text-zinc-400 flex items-center justify-center text-[10px] font-black shrink-0">02</span>
                      <p className="text-zinc-400 text-sm leading-relaxed">
                        Enter {idLabel}: <strong className="text-indigo-400 font-mono text-lg select-all">{merchantNumber}</strong>
                      </p>
                    </li>
                    <li className="flex gap-4">
                      <span className="w-6 h-6 rounded-full bg-zinc-800 text-zinc-400 flex items-center justify-center text-[10px] font-black shrink-0">03</span>
                      <p className="text-zinc-400 text-sm leading-relaxed">
                        Enter Amount: <strong className="text-white">৳{pkg.price.toFixed(0)}</strong> {method.id === 'binance' && "(or USDT equivalent)"} and complete the transaction.
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
              
              <button 
                onClick={() => setStep(2)}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-5 rounded-2xl uppercase tracking-[0.2em] text-xs transition-all shadow-xl shadow-indigo-600/20 mt-12 group"
              >
                I've Sent the Money <i className="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
              </button>
            </div>
          ) : (
            <div className="animate-in slide-in-from-right-8 duration-300">
              <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-4">Verify Transaction</h3>
              <p className="text-zinc-500 text-xs mb-8">Enter the Transaction ID (TrxID) provided by {method.name} to confirm your order.</p>
              
              <form onSubmit={handleVerify} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Transaction ID (TrxID)</label>
                  <input 
                    type="text" 
                    required
                    value={trxId}
                    onChange={(e) => setTrxId(e.target.value.toUpperCase())}
                    placeholder="E.G. 8H3KJ298X"
                    className="w-full bg-zinc-950 border-2 border-zinc-800 rounded-2xl py-5 px-6 text-white text-xl font-mono focus:outline-none focus:border-indigo-600 focus:bg-zinc-900 transition-all placeholder:text-zinc-800"
                  />
                </div>

                <div className="bg-indigo-500/5 border border-indigo-500/10 p-4 rounded-xl">
                  <div className="flex items-center gap-3 text-indigo-400 text-[10px] font-black uppercase tracking-widest">
                    <i className="fas fa-info-circle"></i>
                    <span>Injection Queue Active</span>
                  </div>
                  <p className="text-zinc-500 text-[10px] mt-1">Verification typically takes 30-60 seconds after submission.</p>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-black py-5 rounded-2xl uppercase tracking-[0.2em] text-[10px] transition-all"
                  >
                    Back
                  </button>
                  <button 
                    type="submit"
                    disabled={trxId.length < 8 || isVerifying}
                    className="flex-[2] bg-indigo-600 hover:bg-indigo-700 text-white font-black py-5 rounded-2xl uppercase tracking-[0.2em] text-[10px] transition-all shadow-xl shadow-indigo-600/20 disabled:opacity-50 flex items-center justify-center gap-3"
                  >
                    {isVerifying ? (
                      <>
                        <i className="fas fa-circle-notch animate-spin"></i>
                        Verifying...
                      </>
                    ) : (
                      <>
                        Complete Order
                        <i className="fas fa-check-double text-[10px]"></i>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentGateway;
