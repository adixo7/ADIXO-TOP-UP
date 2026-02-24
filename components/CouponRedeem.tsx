import React from 'react';

interface CouponRedeemProps {
  onRedeem: (code: string) => void;
}

const CouponRedeem: React.FC<CouponRedeemProps> = ({ onRedeem }) => {
  const [couponCode, setCouponCode] = React.useState('');

  return (
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-600/50 to-red-600/50 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
      <div className="relative bg-[#0c0c0e] border border-orange-500/20 rounded-2xl p-4 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-4 bg-orange-600 rounded-full"></div>
            <h3 className="text-white text-[10px] font-black uppercase tracking-widest italic">Coupon Redeem</h3>
          </div>
          <i className="fas fa-ticket-alt text-orange-500 text-xs"></i>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            placeholder="ENTER COUPON CODE"
            className="flex-1 bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-2.5 text-white text-[10px] font-bold tracking-widest focus:outline-none focus:border-orange-500/50 transition-colors placeholder:text-zinc-700 uppercase"
          />
          <button
            onClick={() => onRedeem(couponCode)}
            className="bg-orange-600 hover:bg-orange-500 text-white px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-orange-600/20"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default CouponRedeem;