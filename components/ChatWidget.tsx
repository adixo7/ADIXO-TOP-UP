import React, { useState } from 'react';

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAiChat, setShowAiChat] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([
    { role: 'ai', text: 'Hello! I am ADIXO AI SUPPORT. How can I help you today?' }
  ]);
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    const userMsg = inputValue.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInputValue('');

    // Simple AI Response simulation
    setTimeout(() => {
      let aiResponse = "I'm here to help! For payments, you can use bKash, Rocket, Nagad, or Binance. To redeem a code, use the 'Redeem' option in the menu.";
      if (userMsg.toLowerCase().includes('payment')) {
        aiResponse = "We support multiple payment methods including bKash, Nagad, Rocket, and Binance. Select a package and follow the instructions to complete your payment.";
      } else if (userMsg.toLowerCase().includes('redeem')) {
        aiResponse = "You can redeem your gift cards or coupons in the 'COUPON REDEEM' section of the website. Just enter your code and click REDEEM.";
      }
      setMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
    }, 1000);
  };

  const supportOptions = [
    {
      name: 'ADIXO AI SUPPORT',
      action: () => setShowAiChat(true),
      icon: 'fa-robot',
      description: 'Active 24/7 for all your queries'
    },
    {
      name: 'Telegram Official Group',
      url: 'https://t.me/adixoglory',
      icon: 'fa-users',
      description: 'Join our community for updates'
    },
    {
      name: 'Official Support ID',
      url: 'https://t.me/AdiXO_TV',
      icon: 'fa-headset',
      description: 'Direct contact with @AdiXO TV'
    }
  ];

  return (
    <div className="fixed bottom-24 md:bottom-6 right-6 z-[200] flex flex-col items-end">
      {isOpen && !showAiChat && (
        <div className="w-80 md:w-96 bg-zinc-950 border border-zinc-800 rounded-3xl shadow-[0_0_50px_-12px_rgba(0,0,0,0.8)] flex flex-col mb-4 overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="p-4 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-orange-600 flex items-center justify-center shadow-[0_0_15px_rgba(249,115,22,0.5)]">
                <i className="fas fa-headset text-white"></i>
              </div>
              <div>
                <p className="font-black text-white text-xs uppercase tracking-widest italic">Adixo Support</p>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Online</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-zinc-500 hover:text-white transition-colors"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
          
          {/* Options Area */}
          <div className="p-4 space-y-3 bg-zinc-950">
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-2 px-1">Choose a channel:</p>
            {supportOptions.map((option, i) => (
              option.action ? (
                <button 
                  key={i}
                  onClick={option.action}
                  className="w-full flex items-center gap-4 p-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl hover:border-orange-500/50 hover:bg-orange-500/5 transition-all group text-left"
                >
                  <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center group-hover:bg-orange-600 transition-colors">
                    <i className={`fas ${option.icon} text-white text-sm`}></i>
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-xs font-black uppercase tracking-tight group-hover:text-orange-500 transition-colors">{option.name}</p>
                    <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mt-0.5">{option.description}</p>
                  </div>
                  <i className="fas fa-chevron-right text-[10px] text-zinc-700 group-hover:text-orange-500"></i>
                </button>
              ) : (
                <a 
                  key={i}
                  href={option.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl hover:border-orange-500/50 hover:bg-orange-500/5 transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center group-hover:bg-orange-600 transition-colors">
                    <i className={`fas ${option.icon} text-white text-sm`}></i>
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-xs font-black uppercase tracking-tight group-hover:text-orange-500 transition-colors">{option.name}</p>
                    <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mt-0.5">{option.description}</p>
                  </div>
                  <i className="fas fa-external-link-alt text-[10px] text-zinc-700 group-hover:text-orange-500"></i>
                </a>
              )
            ))}
          </div>

          <div className="p-4 bg-zinc-900/30 border-t border-zinc-800">
            <p className="text-[8px] text-zinc-600 font-bold uppercase tracking-[0.2em] text-center">
              Available 24/7 for your mission
            </p>
          </div>
        </div>
      )}

      {showAiChat && (
        <div className="w-80 md:w-96 h-[500px] bg-zinc-950 border border-zinc-800 rounded-3xl shadow-[0_0_50px_-12px_rgba(0,0,0,0.8)] flex flex-col mb-4 overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          {/* AI Chat Header */}
          <div className="p-4 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-orange-600 flex items-center justify-center shadow-[0_0_15px_rgba(249,115,22,0.5)]">
                <i className="fas fa-robot text-white"></i>
              </div>
              <div>
                <p className="font-black text-white text-xs uppercase tracking-widest italic">ADIXO AI BOT</p>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Active 24/7</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setShowAiChat(false)}
              className="text-zinc-500 hover:text-white transition-colors"
            >
              <i className="fas fa-arrow-left"></i>
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-950/50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-[11px] font-bold uppercase tracking-tight ${
                  msg.role === 'user' 
                    ? 'bg-orange-600 text-white rounded-tr-none' 
                    : 'bg-zinc-900 text-zinc-300 border border-zinc-800 rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="p-4 bg-zinc-900 border-t border-zinc-800 flex gap-2">
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="TYPE YOUR QUERY..."
              className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-[10px] font-black text-white placeholder:text-zinc-700 focus:outline-none focus:border-orange-500/50 uppercase"
            />
            <button 
              onClick={handleSendMessage}
              className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center hover:bg-orange-500 transition-colors"
            >
              <i className="fas fa-paper-plane text-white text-xs"></i>
            </button>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full shadow-[0_0_30px_-5px_rgba(249,115,22,0.5)] flex items-center justify-center transition-all duration-300 active:scale-95 group ${
          isOpen ? 'bg-zinc-800 rotate-90' : 'bg-orange-600 hover:bg-orange-500'
        }`}
      >
        <i className={`fas ${isOpen ? 'fa-times' : 'fa-headset'} text-white text-xl group-hover:scale-110 transition-transform`}></i>
        {!isOpen && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-orange-500 border-2 border-zinc-950"></span>
          </span>
        )}
      </button>
    </div>
  );
};

export default ChatWidget;