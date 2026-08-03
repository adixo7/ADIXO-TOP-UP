import React, { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const TypingDots: React.FC = () => (
  <div className="flex items-center gap-1 px-1 py-0.5">
    {[0, 1, 2].map(i => (
      <span
        key={i}
        className="w-1.5 h-1.5 rounded-full bg-orange-400"
        style={{
          animation: 'adixo-bounce 1.2s infinite',
          animationDelay: `${i * 0.2}s`,
        }}
      />
    ))}
    <style>{`
      @keyframes adixo-bounce {
        0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
        30% { transform: translateY(-4px); opacity: 1; }
      }
    `}</style>
  </div>
);

// Simple markdown-like renderer: bold **text**, line breaks, bullet lists
const renderContent = (text: string): React.ReactNode[] => {
  return text.split('\n').map((line, i) => {
    // Bullet point
    const isBullet = /^[-•*]\s/.test(line);
    const content = line.replace(/^[-•*]\s/, '');
    // Bold
    const parts = content.split(/\*\*(.*?)\*\*/g).map((part, j) =>
      j % 2 === 1 ? <strong key={j} className="text-orange-400 font-bold">{part}</strong> : part
    );
    return (
      <React.Fragment key={i}>
        {isBullet ? (
          <div className="flex gap-1.5 mt-0.5">
            <span className="text-orange-500 mt-0.5 text-xs">•</span>
            <span>{parts}</span>
          </div>
        ) : (
          <div className={i > 0 && line === '' ? 'h-2' : ''}>{parts}</div>
        )}
      </React.Fragment>
    );
  });
};

const WELCOME_MESSAGE: Message = {
  role: 'assistant',
  content: `আমি ADIXO AI! 🎮 আমি এই ওয়েবসাইটের সব কিছু জানি — সব গেমের দাম, পেমেন্ট পদ্ধতি, অর্ডার প্রক্রিয়া সহ সব।

I'm ADIXO AI! Ask me anything about our services — game top-ups, prices, how to order, AI bots, PC games, and more. I speak both **Bangla** and **English** 🇧🇩`,
};

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMessage: Message = { role: 'user', content: text };
    const history = messages.filter(m => m !== WELCOME_MESSAGE);

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: [...history, userMessage].slice(-20),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Unknown error');

      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    // Auto-resize textarea
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
  };

  return (
    <div className="fixed bottom-24 md:bottom-6 right-4 md:right-6 z-[200] flex flex-col items-end">
      {isOpen && (
        <div
          className="w-[340px] md:w-[400px] bg-zinc-950 border border-zinc-800 rounded-3xl shadow-[0_0_60px_-10px_rgba(0,0,0,0.9)] flex flex-col mb-4 overflow-hidden"
          style={{ height: 'min(520px, calc(100vh - 140px))', animation: 'chatSlideIn 0.25s cubic-bezier(0.16,1,0.3,1)' }}
        >
          <style>{`
            @keyframes chatSlideIn {
              from { opacity: 0; transform: translateY(16px) scale(0.97); }
              to   { opacity: 1; transform: translateY(0) scale(1); }
            }
          `}</style>

          {/* Header */}
          <div className="flex-shrink-0 p-3.5 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center shadow-[0_0_15px_rgba(249,115,22,0.4)]">
                <i className="fas fa-robot text-white text-sm"></i>
              </div>
              <div>
                <p className="font-black text-white text-xs uppercase tracking-widest italic leading-none">ADIXO AI</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest">Online · Ask anything</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setMessages([WELCOME_MESSAGE]);
                  setError(null);
                }}
                title="Clear chat"
                className="text-zinc-600 hover:text-zinc-300 transition-colors p-1"
              >
                <i className="fas fa-rotate-right text-xs"></i>
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-zinc-500 hover:text-white transition-colors p-1"
              >
                <i className="fas fa-times text-sm"></i>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3.5 py-3 space-y-3 scrollbar-none" style={{ scrollbarWidth: 'none' }}>
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center mt-0.5">
                    <i className="fas fa-robot text-white" style={{ fontSize: '9px' }}></i>
                  </div>
                )}
                <div
                  className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-[12.5px] leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-orange-600 text-white rounded-tr-sm'
                      : 'bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-tl-sm'
                  }`}
                >
                  {renderContent(msg.content)}
                </div>
                {msg.role === 'user' && (
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-zinc-700 flex items-center justify-center mt-0.5">
                    <i className="fas fa-user text-zinc-300" style={{ fontSize: '9px' }}></i>
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2 justify-start">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center mt-0.5">
                  <i className="fas fa-robot text-white" style={{ fontSize: '9px' }}></i>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl rounded-tl-sm px-3.5 py-2.5">
                  <TypingDots />
                </div>
              </div>
            )}

            {error && (
              <div className="flex gap-2 justify-start">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-700 flex items-center justify-center mt-0.5">
                  <i className="fas fa-exclamation text-white" style={{ fontSize: '9px' }}></i>
                </div>
                <div className="max-w-[82%] bg-red-950/50 border border-red-800/50 rounded-2xl rounded-tl-sm px-3.5 py-2.5 text-[12px] text-red-300">
                  {error}
                  <div className="mt-1.5">
                    <a href="https://t.me/AdiXO_TV" target="_blank" rel="noopener noreferrer" className="text-orange-400 underline text-[11px]">Contact @AdiXO_TV on Telegram</a>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick suggestions (shown only at start) */}
          {messages.length === 1 && (
            <div className="flex-shrink-0 px-3.5 pb-2 flex gap-1.5 overflow-x-auto scrollbar-none" style={{ scrollbarWidth: 'none' }}>
              {[
                'Free Fire দাম কত?',
                'How to order?',
                'Payment methods',
                'AI Bots কি?',
              ].map(q => (
                <button
                  key={q}
                  onClick={() => { setInput(q); setTimeout(() => inputRef.current?.focus(), 50); }}
                  className="flex-shrink-0 text-[10px] font-bold px-2.5 py-1.5 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-300 hover:border-orange-500/60 hover:text-orange-400 transition-colors uppercase tracking-wide"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="flex-shrink-0 p-3 bg-zinc-900/50 border-t border-zinc-800">
            <div className="flex items-end gap-2 bg-zinc-900 border border-zinc-700 rounded-2xl px-3 py-2 focus-within:border-orange-500/60 transition-colors">
              <textarea
                ref={inputRef}
                value={input}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                placeholder="Ask in Bangla or English…"
                rows={1}
                disabled={isLoading}
                className="flex-1 bg-transparent text-white text-[12.5px] placeholder-zinc-600 resize-none outline-none leading-relaxed disabled:opacity-50"
                style={{ minHeight: '22px', maxHeight: '120px' }}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                className="flex-shrink-0 w-7 h-7 rounded-xl bg-orange-600 hover:bg-orange-500 disabled:bg-zinc-700 disabled:opacity-40 flex items-center justify-center transition-all active:scale-90"
              >
                <i className="fas fa-paper-plane text-white" style={{ fontSize: '11px' }}></i>
              </button>
            </div>
            <p className="text-[9px] text-zinc-700 text-center mt-1.5 font-medium uppercase tracking-wider">
              Powered by Gemini AI · ADIXO
            </p>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full shadow-[0_0_30px_-5px_rgba(249,115,22,0.5)] flex items-center justify-center transition-all duration-300 active:scale-95 group ${
          isOpen ? 'bg-zinc-800' : 'bg-orange-600 hover:bg-orange-500'
        }`}
      >
        <i className={`fas ${isOpen ? 'fa-times' : 'fa-robot'} text-white text-xl group-hover:scale-110 transition-transform`}></i>
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
