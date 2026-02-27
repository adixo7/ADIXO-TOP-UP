import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAiChat, setShowAiChat] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([
    { role: 'ai', text: 'Hello! I am ADIXO AI SUPPORT. How can I help you today?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;
    
    const userMsg = inputValue.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Check for API key in environment or fallback to simulation
      const apiKey = (window as any).GEMINI_API_KEY || "";
      
      const systemInstruction = `You are the official AI customer support assistant for ADIXO TopUp, a gaming currency selling website. Your job is to help customers with all types of problems related to game top-ups, payments, delivery, refunds, wrong Player ID, order status, safety concerns, reseller inquiries, and technical issues.

Always give clear step-by-step instructions.
Always reassure customers about account safety.
Never ask for passwords.
If a user makes a mistake (wrong ID, wrong payment, duplicate payment), guide them calmly.
If payment is delayed, explain possible reasons and suggest contacting support.
If refund is requested, explain policy clearly.
If something is outside website services, politely redirect.

Your goal is to reduce customer confusion and build trust.`;

      if (apiKey) {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ 
          model: "gemini-1.5-flash",
          systemInstruction: systemInstruction,
        });
        
        const chat = model.startChat({
          history: messages.slice(1).map(m => ({
            role: m.role === 'user' ? 'user' : 'model',
            parts: [{ text: m.text }],
          })),
          generationConfig: {
            maxOutputTokens: 500,
          },
        });

        const result = await chat.sendMessage(userMsg);
        const response = await result.response;
        const text = response.text();
        setMessages(prev => [...prev, { role: 'ai', text: text }]);
      } else {
        // Fallback to enhanced simulation if no API key is provided
        setTimeout(() => {
          let aiResponse = "I am the official ADIXO AI assistant. How can I help you with your top-up, payment, or delivery today?";
          const input = userMsg.toLowerCase();
          
          if (input.includes('payment') || input.includes('bkash') || input.includes('nagad') || input.includes('binance')) {
            aiResponse = "We support bKash, Nagad, Rocket, and Binance. To pay: 1. Select your game and package. 2. Enter Player ID. 3. Choose payment method. 4. Complete the transaction in the gateway. Your account safety is our priority!";
          } else if (input.includes('refund')) {
            aiResponse = "Refunds are processed if the top-up hasn't been delivered yet. If you made a mistake, please contact our support team on Telegram (@AdiXO_TV) with your Order ID for assistance.";
          } else if (input.includes('wrong id') || input.includes('wrong player id')) {
            aiResponse = "Don't worry! If you entered the wrong Player ID, please contact our official support on Telegram (@AdiXO_TV) immediately with your Order ID and the correct Player ID.";
          } else if (input.includes('delay') || input.includes('not received')) {
            aiResponse = "Orders usually take 5-30 minutes. If it's delayed, it might be due to server load or verification. Please check your order status in 'History' or contact support if it's been over an hour.";
          } else if (input.includes('safe') || input.includes('security')) {
            aiResponse = "Yes, ADIXO TopUp is 100% safe. We only use official top-up methods. We will NEVER ask for your password. Only your Player ID is required.";
          } else if (input.includes('reseller')) {
            aiResponse = "We welcome resellers! For bulk pricing and partnership inquiries, please contact our Official Support ID on Telegram (@AdiXO_TV).";
          }
          
          setMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
          setIsLoading(false);
        }, 1000);
        return;
      }
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'ai', text: "I'm having trouble connecting to my brain right now. Please try again or contact our Telegram support!" }]);
    } finally {
      setIsLoading(false);
    }
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
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-zinc-900 text-zinc-300 border border-zinc-800 p-3 rounded-2xl rounded-tl-none flex gap-1">
                  <span className="w-1.5 h-1.5 bg-zinc-600 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-zinc-600 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-zinc-600 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <div className="p-4 bg-zinc-900 border-t border-zinc-800 flex gap-2">
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={isLoading ? "AI IS THINKING..." : "TYPE YOUR QUERY..."}
              disabled={isLoading}
              className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-[10px] font-black text-white placeholder:text-zinc-700 focus:outline-none focus:border-orange-500/50 uppercase disabled:opacity-50"
            />
            <button 
              onClick={handleSendMessage}
              disabled={isLoading}
              className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center hover:bg-orange-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i className={`fas ${isLoading ? 'fa-spinner fa-spin' : 'fa-paper-plane'} text-white text-xs`}></i>
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