import React, { useState, useEffect, useRef } from 'react';

interface Message {
  id: string;
  from: 'bot' | 'user';
  text: string;
  chips?: TopicKey[];
  supportLinks?: boolean;
}

type TopicKey =
  | 'how_to_order'
  | 'payment_methods'
  | 'delivery_time'
  | 'available_games'
  | 'coupons'
  | 'event_bypass'
  | 'ai_bots'
  | 'ff_panel'
  | 'mystery_boxes'
  | 'safety'
  | 'support';

const TOPICS: Array<{ key: TopicKey; label: string; icon: string }> = [
  { key: 'how_to_order',     label: 'How to Order',       icon: 'fa-cart-shopping' },
  { key: 'payment_methods',  label: 'Payment Methods',    icon: 'fa-credit-card' },
  { key: 'delivery_time',    label: 'Delivery Time',      icon: 'fa-bolt' },
  { key: 'available_games',  label: 'Available Games',    icon: 'fa-gamepad' },
  { key: 'coupons',          label: 'Coupons & Deals',    icon: 'fa-tag' },
  { key: 'event_bypass',     label: 'Event Bypass',       icon: 'fa-unlock' },
  { key: 'ai_bots',          label: 'AI Bots',            icon: 'fa-robot' },
  { key: 'ff_panel',         label: 'FF Panel',           icon: 'fa-shield-halved' },
  { key: 'mystery_boxes',    label: 'Mystery Boxes',      icon: 'fa-box-open' },
  { key: 'safety',           label: 'Is it Safe?',        icon: 'fa-lock' },
  { key: 'support',          label: 'Live Support',       icon: 'fa-headset' },
];

const ANSWERS: Record<TopicKey, { text: string; chips: TopicKey[]; supportLinks?: boolean }> = {
  how_to_order: {
    text: "Placing an order is super easy! Here's how:\n\n**Step 1** — Go to the **Games** tab\n**Step 2** — Select your game (Free Fire, PUBG, MLBB...)\n**Step 3** — Choose a package\n**Step 4** — Enter your **Player ID**\n**Step 5** — Pick a payment method\n**Step 6** — Hit **Order via Telegram**!\n\nOur team gets notified instantly and starts processing right away. ⚡",
    chips: ['payment_methods', 'delivery_time', 'safety'],
  },
  payment_methods: {
    text: "We accept 4 secure payment methods:\n\n🟣 **bKash** — Bangladesh's most popular mobile wallet\n🟠 **Nagad** — Fast government-backed wallet\n🟣 **Rocket** — Dutch-Bangla mobile banking\n🟡 **Binance** — Crypto payments (USDT & more)\n\nAfter selecting a method you'll see the account number. Send payment, then share your transaction ID on Telegram — done!",
    chips: ['how_to_order', 'delivery_time', 'support'],
  },
  delivery_time: {
    text: "We're fast! Here's what to expect:\n\n⚡ **Diamond / UC Top-ups** — 5 to 30 minutes\n🎫 **Memberships** — Within 1 hour\n🖥️ **PC Games** — 30 to 60 minutes\n🤖 **AI Bots / Glory Bots** — A few hours\n🛡️ **FF Panel** — Within 30 minutes\n\nFor urgent orders contact **@AdiXO_TV** on Telegram directly.",
    chips: ['how_to_order', 'support', 'available_games'],
    supportLinks: true,
  },
  available_games: {
    text: "We support all major titles:\n\n🔥 **Free Fire** — Diamonds, Memberships, Level Up Pass\n⚔️ **PUBG Mobile** — UC, Royale Pass\n🗡️ **Mobile Legends** — Diamonds, Passes\n💥 **Blood Strike** — Golds, Strike Pass\n🎯 **Call of Duty Mobile** — COD Points\n🤖 **AI Bots** — Glory Bots, Mystery Boxes, Guild Boost\n🛡️ **FF Panel** — 17+ premium panel tools\n🔓 **Event Bypass** — 5, 14, 30, 60 day packs\n🖥️ **PC Games** — 20+ titles up to 30% off\n\nHead to the **Games** tab to explore!",
    chips: ['how_to_order', 'coupons', 'payment_methods'],
  },
  coupons: {
    text: "Yes, we have exclusive coupon deals! 🎉\n\nCurrently active:\n🏷️ **PSDIS7** — Discount on FF Weekly & Monthly Membership\n\nHow to use:\n**1.** Open Free Fire packages\n**2.** Find the Coupon section below the packages\n**3.** Type your code and hit **Redeem**\n**4.** The discounted price applies instantly + confetti! 🎊\n\nFollow **@adixoglory** on Telegram for latest deals!",
    chips: ['how_to_order', 'available_games', 'support'],
    supportLinks: true,
  },
  event_bypass: {
    text: "**Event Bypass** unlocks Free Fire event rewards without completing all event tasks manually!\n\nWe have 4 tiers:\n\n🔵 **BASIC** (5 days) — 60% unlock chance ❌ Stock Out\n🔵 **HYPER** (14 days) — 75% unlock chance ❌ Stock Out\n🟣 **PREMIUM** (30 days) — 90% unlock chance ✅ Available\n🟣 **SUPER** (60 days) — 96% unlock chance ✅ Available\n\nGo to **Games → Event Bypass** to order PREMIUM or SUPER.",
    chips: ['how_to_order', 'payment_methods', 'support'],
  },
  ai_bots: {
    text: "**AI Bots** are for Free Fire guild boosting! 🤖\n\nWe offer 4 categories:\n\n🏆 **Glory Packages** — Regional Elite, Master, Grandmaster\n👾 **Hire Bots** — 2 Bots or 4 Bots for 1 Week\n📦 **Mystery Boxes** — Random glory drops (Basic / Epic / Super)\n⬆️ **Guild Level Up** — Boost to Level 5, 6 or 7\n\nAll 100% safe! Go to **Games → AI BOTS** to explore.",
    chips: ['mystery_boxes', 'safety', 'how_to_order'],
  },
  ff_panel: {
    text: "**FF Panel** gives you access to 17+ premium tools and APK mods for Free Fire! 🛡️\n\nAvailable panels include:\n• BRMOD Android Root & Silent Aim PC\n• Drip Client Root & APK Mod\n• LKTeam Root + PC, HG Cheat, PaToTeam\n• Fluorite iOS, eSign Certificate\n• GBox Official, Haxxcker Root & more\n\nAll panels are **৳100 each** with flexible duration options.\nGo to **Games → FF PANEL** to browse all tools.",
    chips: ['how_to_order', 'payment_methods', 'support'],
  },
  mystery_boxes: {
    text: "**Mystery Boxes** are exciting random glory drops for your Free Fire AI Bots! 📦\n\nThree tiers:\n\n🎁 **Basic Box** — ৳252\n4 Bots | 50K–370K Glory | 100% Safe\n\n🎁 **Epic Box** — ৳504\n4 Bots | 350K–1.2M Glory | 100% Safe\n\n🎁 **Super Box** — ৳1008\n4 Bots | 1.2M–3.4M Glory | 100% Safe\n\nAll boxes guarantee delivery within the specified glory range!",
    chips: ['ai_bots', 'how_to_order', 'safety'],
  },
  safety: {
    text: "✅ **100% Safe & Trusted!**\n\nReasons to trust ADIXO:\n\n🛡️ **Official website** — always order from here only\n📢 **Verified** via Telegram channel @adixoglory\n🎧 **24/7 support** via @AdiXO_TV\n⚡ **Thousands** of happy customers served\n🔒 **We never ask** for your game password\n\nYour Player ID is used only to deliver your order. Stay safe!",
    chips: ['how_to_order', 'payment_methods', 'support'],
    supportLinks: true,
  },
  support: {
    text: "Our team is available **24/7** to help you! 💬\n\nReach us through:\n\n📢 **@adixoglory** — Official group for updates & announcements\n🎧 **@AdiXO_TV** — Direct support & order assistance\n\nFor order issues please have ready:\n• Your order details\n• Transaction ID / payment screenshot\n• Your Player ID",
    chips: ['how_to_order', 'payment_methods', 'safety'],
    supportLinks: true,
  },
};

const renderText = (text: string) => {
  return text.split('\n').map((line, i, arr) => {
    const parts = line.split(/\*\*(.*?)\*\*/g);
    return (
      <React.Fragment key={i}>
        {parts.map((part, j) =>
          j % 2 === 1
            ? <strong key={j} className="text-white font-black">{part}</strong>
            : part
        )}
        {i < arr.length - 1 && <br />}
      </React.Fragment>
    );
  });
};

const GuideBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showTopics, setShowTopics] = useState(false);
  const [hasNewMsg, setHasNewMsg] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen) {
      setHasNewMsg(false);
      if (messages.length === 0) {
        setTimeout(() => {
          setMessages([{
            id: '0',
            from: 'bot',
            text: "👋 Hey! I'm **ADIXO Guide** — your AI assistant for everything on this site!\n\nI can help with ordering, payments, packages, coupons, and more.\n\nWhat would you like to know?",
            chips: [],
          }]);
          setShowTopics(true);
        }, 350);
      }
    }
  }, [isOpen]);

  const handleTopicClick = (key: TopicKey, label: string) => {
    const userMsg: Message = { id: Date.now().toString(), from: 'user', text: label };
    setMessages(prev => [...prev, userMsg]);
    setShowTopics(false);
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const answer = ANSWERS[key];
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        from: 'bot',
        text: answer.text,
        chips: answer.chips,
        supportLinks: answer.supportLinks,
      }]);
    }, 900);
  };

  const handleReset = () => {
    setMessages([]);
    setShowTopics(false);
    setIsTyping(false);
    setTimeout(() => {
      setMessages([{
        id: Date.now().toString(),
        from: 'bot',
        text: "Let's start fresh! 👋 What can I help you with?",
        chips: [],
      }]);
      setShowTopics(true);
    }, 100);
  };

  return (
    <div className="fixed bottom-24 md:bottom-6 right-6 z-[200] flex flex-col items-end">
      {isOpen && (
        <div
          className="w-[22rem] md:w-[26rem] bg-zinc-950 border border-zinc-800 rounded-3xl shadow-[0_0_80px_-12px_rgba(0,0,0,0.95)] flex flex-col mb-4 overflow-hidden"
          style={{ height: '540px' }}
        >
          {/* Header */}
          <div className="shrink-0 px-4 py-3 bg-gradient-to-r from-orange-600/20 via-zinc-900 to-zinc-900 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center shadow-[0_0_14px_rgba(249,115,22,0.4)]">
                <i className="fas fa-robot text-white text-sm"></i>
              </div>
              <div>
                <p className="font-black text-white text-[11px] uppercase tracking-widest">ADIXO Guide</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="text-[9px] text-green-400 font-bold uppercase tracking-widest">AI Assistant · Online</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={handleReset} title="Reset chat" className="w-7 h-7 rounded-lg text-zinc-500 hover:text-orange-400 hover:bg-zinc-800 transition-all flex items-center justify-center">
                <i className="fas fa-rotate-left text-[10px]"></i>
              </button>
              <button onClick={() => setIsOpen(false)} className="w-7 h-7 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800 transition-all flex items-center justify-center">
                <i className="fas fa-times text-sm"></i>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map(msg => (
              <div key={msg.id} className={`flex gap-2 ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.from === 'bot' && (
                  <div className="w-6 h-6 rounded-full bg-orange-600/20 border border-orange-500/30 flex items-center justify-center shrink-0 mt-1">
                    <i className="fas fa-robot text-orange-400 text-[8px]"></i>
                  </div>
                )}
                <div className={`max-w-[82%] ${msg.from === 'user'
                  ? 'bg-orange-600 text-white rounded-2xl rounded-tr-sm px-3 py-2 text-[11px]'
                  : 'bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-2xl rounded-tl-sm px-3 py-2.5 text-[11px] leading-relaxed'
                }`}>
                  {renderText(msg.text)}

                  {/* Chips */}
                  {msg.chips && msg.chips.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2.5 pt-2 border-t border-zinc-700/50">
                      {msg.chips.map(key => {
                        const t = TOPICS.find(t => t.key === key);
                        if (!t) return null;
                        return (
                          <button
                            key={key}
                            onClick={() => handleTopicClick(key, t.label)}
                            className="bg-zinc-800 hover:bg-orange-600/20 hover:border-orange-500/40 border border-zinc-700 text-zinc-300 hover:text-white text-[9px] font-bold px-2 py-1 rounded-lg transition-all flex items-center gap-1"
                          >
                            <i className={`fas ${t.icon} text-[7px]`}></i> {t.label}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Support links */}
                  {msg.supportLinks && msg.from === 'bot' && (
                    <div className="flex gap-2 mt-2.5 pt-2 border-t border-zinc-700/50">
                      <a href="https://t.me/adixoglory" target="_blank" rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-1.5 bg-sky-900/30 hover:bg-sky-600/20 border border-sky-700/40 text-sky-400 text-[9px] font-black py-1.5 rounded-lg transition-all uppercase tracking-widest">
                        <i className="fab fa-telegram text-[9px]"></i> Group
                      </a>
                      <a href="https://t.me/AdiXO_TV" target="_blank" rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-1.5 bg-orange-900/20 hover:bg-orange-600/20 border border-orange-700/40 text-orange-400 text-[9px] font-black py-1.5 rounded-lg transition-all uppercase tracking-widest">
                        <i className="fas fa-headset text-[9px]"></i> Support
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex gap-2 justify-start">
                <div className="w-6 h-6 rounded-full bg-orange-600/20 border border-orange-500/30 flex items-center justify-center shrink-0">
                  <i className="fas fa-robot text-orange-400 text-[8px]"></i>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl rounded-tl-sm px-4 py-3">
                  <div className="flex gap-1 items-center h-3">
                    <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '160ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '320ms' }}></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick topics panel */}
          {showTopics && (
            <div className="shrink-0 p-3 bg-zinc-900/60 border-t border-zinc-800">
              <p className="text-[8px] text-zinc-500 font-black uppercase tracking-[0.2em] mb-2">Choose a topic:</p>
              <div className="flex flex-wrap gap-1.5">
                {TOPICS.map(t => (
                  <button
                    key={t.key}
                    onClick={() => handleTopicClick(t.key, t.label)}
                    className="bg-zinc-800 hover:bg-orange-600/20 hover:border-orange-500/40 border border-zinc-700 text-zinc-300 hover:text-white text-[9px] font-bold px-2 py-1 rounded-lg transition-all flex items-center gap-1"
                  >
                    <i className={`fas ${t.icon} text-[7px]`}></i> {t.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Bottom bar after topics answered */}
          {!showTopics && !isTyping && messages.length > 1 && (
            <div className="shrink-0 px-4 py-2.5 bg-zinc-900/30 border-t border-zinc-800 flex items-center justify-between">
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 text-zinc-500 hover:text-orange-400 text-[9px] font-bold uppercase tracking-widest transition-colors"
              >
                <i className="fas fa-house text-[8px]"></i> All Topics
              </button>
              <a href="https://t.me/AdiXO_TV" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sky-400 hover:text-sky-300 text-[9px] font-bold uppercase tracking-widest transition-colors">
                <i className="fab fa-telegram text-[9px]"></i> Live Support
              </a>
            </div>
          )}
        </div>
      )}

      {/* FAB button */}
      <button
        onClick={() => setIsOpen(o => !o)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-[0_0_35px_-5px_rgba(249,115,22,0.55)] transition-all duration-300 active:scale-95 group ${
          isOpen
            ? 'bg-zinc-800 rotate-[360deg]'
            : 'bg-gradient-to-br from-orange-500 to-orange-700 hover:from-orange-400 hover:to-orange-600'
        }`}
        style={{ transition: 'background 0.3s, transform 0.3s' }}
      >
        <i className={`fas ${isOpen ? 'fa-times' : 'fa-robot'} text-white text-xl group-hover:scale-110 transition-transform`}></i>
        {!isOpen && hasNewMsg && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-orange-500 border-2 border-zinc-950"></span>
          </span>
        )}
      </button>
    </div>
  );
};

export default GuideBot;
