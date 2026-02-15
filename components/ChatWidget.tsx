
import React, { useState, useRef, useEffect } from 'react';
import { getFastAdvice, getProAdvice } from '../services/geminiService';

type ModelType = 'fast' | 'pro';

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [modelType, setModelType] = useState<ModelType>('fast');
  const [messages, setMessages] = useState<{role: 'bot' | 'user', text: string, model?: ModelType}[]>([
    { role: 'bot', text: "Welcome to the Adixo Command Center. How can I assist your mission today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsLoading(true);

    let botResponse = "";
    if (modelType === 'pro') {
      botResponse = await getProAdvice(userMsg) || "Neural link failure.";
    } else {
      botResponse = await getFastAdvice(userMsg) || "Signal lost.";
    }

    setMessages(prev => [...prev, { role: 'bot', text: botResponse, model: modelType }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-24 md:bottom-6 right-6 z-[200] flex flex-col items-end">
      {isOpen && (
        <div className="w-80 md:w-96 h-[500px] bg-zinc-950 border border-zinc-800 rounded-3xl shadow-[0_0_50px_-12px_rgba(0,0,0,0.8)] flex flex-col mb-4 overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className={`p-4 flex items-center justify-between transition-colors duration-500 ${modelType === 'pro' ? 'bg-indigo-900/40 border-b border-indigo-500/30' : 'bg-zinc-900 border-b border-zinc-800'}`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${modelType === 'pro' ? 'bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]' : 'bg-zinc-800'}`}>
                <i className={`fas ${modelType === 'pro' ? 'fa-brain' : 'fa-bolt'} text-white`}></i>
              </div>
              <div>
                <p className="font-black text-white text-xs uppercase tracking-widest italic">Adixo Intelligence</p>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Active Link</span>
                </div>
              </div>
            </div>
            
            {/* Model Switcher */}
            <div className="flex bg-black/40 p-1 rounded-xl border border-zinc-800">
              <button 
                onClick={() => setModelType('fast')}
                className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${modelType === 'fast' ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                Fast
              </button>
              <button 
                onClick={() => setModelType('pro')}
                className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${modelType === 'pro' ? 'bg-indigo-600 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                Elite
              </button>
            </div>
          </div>
          
          {/* Message Area */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-950">
            {messages.map((msg, i) => (
              <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-xs leading-relaxed ${
                  msg.role === 'user' 
                  ? 'bg-zinc-800 text-white rounded-tr-none border border-zinc-700' 
                  : 'bg-indigo-500/10 text-indigo-100 rounded-tl-none border border-indigo-500/20'
                }`}>
                  {msg.text}
                </div>
                {msg.model && (
                  <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mt-1 ml-1">
                    Powered by Gemini {msg.model === 'pro' ? 'Pro' : 'Flash Lite'}
                  </span>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex flex-col items-start">
                <div className="bg-indigo-500/5 px-4 py-3 rounded-2xl rounded-tl-none border border-indigo-500/10">
                  <div className="flex gap-1.5">
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                </div>
                <span className="text-[8px] font-black text-indigo-500/50 uppercase tracking-widest mt-1 ml-1 animate-pulse">
                  {modelType === 'pro' ? 'Neural Processing...' : 'Initializing Fast Link...'}
                </span>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-zinc-900/50 border-t border-zinc-800">
            <div className="flex gap-2 bg-black/40 p-1.5 rounded-2xl border border-zinc-800 focus-within:border-indigo-500/50 transition-all">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={modelType === 'pro' ? "Ask for elite analysis..." : "Fast support request..."}
                className="flex-1 bg-transparent text-white text-xs px-3 py-2 focus:outline-none placeholder:text-zinc-600 font-medium"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-90 ${
                  isLoading || !input.trim() 
                  ? 'bg-zinc-800 text-zinc-600' 
                  : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/20'
                }`}
              >
                <i className={`fas ${isLoading ? 'fa-spinner fa-spin' : 'fa-paper-plane'} text-xs`}></i>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full shadow-[0_0_30px_-5px_rgba(99,102,241,0.5)] flex items-center justify-center transition-all duration-300 active:scale-95 group ${
          isOpen ? 'bg-zinc-800 rotate-90' : 'bg-indigo-600 hover:bg-indigo-500'
        }`}
      >
        <i className={`fas ${isOpen ? 'fa-times' : 'fa-headset'} text-white text-xl group-hover:scale-110 transition-transform`}></i>
        {!isOpen && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-indigo-500 border-2 border-zinc-950"></span>
          </span>
        )}
      </button>
    </div>
  );
};

export default ChatWidget;
