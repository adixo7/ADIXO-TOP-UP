import React, { useState, useEffect, useRef } from 'react';
import { GAMES, PAYMENT_METHODS } from './data';
import { Game, Package, Transaction, User, PaymentMethod } from './types';
import Layout from './components/Layout';
import GameCard from './components/GameCard';
import Auth from './components/Auth';
import PaymentGateway from './components/PaymentGateway';
import ChatWidget from './components/ChatWidget';
import Features from './components/Features';

const FIVE_MINUTES = 5 * 60 * 1000;

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [user, setUser] = useState<User | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'register' | null>(null);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(null);
  const [isGatewayOpen, setIsGatewayOpen] = useState(false);
  const [playerId, setPlayerId] = useState('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [orderTrackId, setOrderTrackId] = useState('');
  
  const timerRefs = useRef<{ [key: string]: any }>({});

  // Auth Initialization
  useEffect(() => {
    const savedUser = localStorage.getItem('adixo_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Transaction Management (Persistence Logic)
  useEffect(() => {
    if (!user) {
      setTransactions([]);
      return;
    }

    const storageKey = `adixo_transactions_${user.id}`;
    const saved = localStorage.getItem(storageKey);
    let userTransactions: Transaction[] = [];
    
    if (saved) {
      try {
        userTransactions = JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse transactions", e);
      }
    }

    const now = Date.now();
    const updated = userTransactions.map(trx => {
      if (trx.status === 'processing' && (now - trx.timestamp >= FIVE_MINUTES)) {
        return { ...trx, status: 'completed' as const };
      }
      return trx;
    });

    setTransactions(updated);
    
    // Always sync back to local storage if changed
    if (JSON.stringify(updated) !== saved) {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    }

    // Initialize timers for processing items
    updated.forEach(trx => {
      if (trx.status === 'processing') {
        const remaining = FIVE_MINUTES - (now - trx.timestamp);
        if (remaining > 0) {
          if (timerRefs.current[trx.id]) clearTimeout(timerRefs.current[trx.id] as any);
          timerRefs.current[trx.id] = setTimeout(() => {
            handleCompleteItem(trx.id);
          }, remaining);
        }
      }
    });

    return () => {
      Object.values(timerRefs.current).forEach(t => clearTimeout(t as any));
    };
  }, [user]);

  const handleCompleteItem = (trxId: string) => {
    setUser(currentUser => {
      if (!currentUser) return null;
      const storageKey = `adixo_transactions_${currentUser.id}`;
      
      setTransactions(prev => {
        const updated = prev.map(t => t.id === trxId ? { ...t, status: 'completed' as const } : t);
        localStorage.setItem(storageKey, JSON.stringify(updated));
        return updated;
      });
      return currentUser;
    });
  };

  const handleLogin = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem('adixo_user', JSON.stringify(newUser));
    setAuthMode(null);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('adixo_user');
    Object.values(timerRefs.current).forEach(t => clearTimeout(t as any));
    timerRefs.current = {};
    setTransactions([]);
  };

  const handlePackageSelect = (game: Game, pkg: Package) => {
    if (!user) {
      setAuthMode('login');
      return;
    }
    setSelectedGame(game);
    setSelectedPackage(pkg);
  };

  const handleConfirmOrder = () => {
    if (!playerId.trim()) {
      alert("Please enter your Player ID first!");
      return;
    }
    if (!selectedPayment) {
      alert("Please select a payment method!");
      return;
    }
    setIsGatewayOpen(true);
  };

  const handlePaymentComplete = (trxId: string) => {
    if (!selectedGame || !selectedPackage || !selectedPayment || !user) return;

    const orderId = `AX-${Math.random().toString(36).substr(2, 7).toUpperCase()}`;
    const now = Date.now();
    const orderTime = new Date(now).toLocaleString('en-US', { 
      year: 'numeric', month: 'short', day: 'numeric', 
      hour: '2-digit', minute: '2-digit', second: '2-digit' 
    });

    const newTransaction: Transaction = {
      id: orderId,
      gameId: selectedGame.id,
      gameName: selectedGame.name,
      playerId: playerId,
      amount: selectedPackage.amount,
      unit: selectedPackage.unit,
      price: selectedPackage.price,
      paymentMethod: selectedPayment.name,
      date: orderTime,
      timestamp: now,
      status: 'processing'
    };

    const storageKey = `adixo_transactions_${user.id}`;
    const updated = [newTransaction, ...transactions];
    setTransactions(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
    
    timerRefs.current[orderId] = setTimeout(() => {
      handleCompleteItem(orderId);
    }, FIVE_MINUTES);

    // Redirect to Telegram
    const packageName = `${selectedPackage.amount} ${selectedPackage.unit}`;
    const message = `✨ NEW TOP-UP ORDER ✨\n` +
      `--------------------------\n` +
      `📦 Order ID: ${orderId}\n` +
      `🎮 Game: ${selectedGame.name}\n` +
      `👤 Player ID: ${playerId}\n` +
      `💎 Package: ${packageName}\n` +
      `💳 Method: ${selectedPayment.name}\n` +
      `🔑 TrxID: ${trxId}\n` +
      `⏰ Time: ${orderTime}\n` +
      `--------------------------\n` +
      `Order is PROCESSING. Confirm injection!`;

    const telegramUrl = `https://t.me/AdiXO_TV?text=${encodeURIComponent(message)}`;

    setSelectedGame(null);
    setSelectedPackage(null);
    setSelectedPayment(null);
    setIsGatewayOpen(false);
    setActiveTab('history');
    
    window.open(telegramUrl, '_blank');
  };

  const filteredGames = GAMES.filter(game => 
    game.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    game.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const trackedTransactions = transactions.filter(t => 
    !orderTrackId || t.id.toLowerCase().includes(orderTrackId.toLowerCase()) || t.playerId.toLowerCase().includes(orderTrackId.toLowerCase())
  );

  // Group packages by category
  const groupedPackages: Record<string, Package[]> = (selectedGame?.packages || []).reduce((acc: Record<string, Package[]>, pkg) => {
    const cat = pkg.category || 'GENERAL';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(pkg);
    return acc;
  }, {} as Record<string, Package[]>);

  // Explicitly sort categories based on user request: DIAMOND TOPUP, then MEMBERSHIP, then LEVEL UP PASS
  const categorySortOrder = ['DIAMOND TOPUP', 'MEMBERSHIP', 'LEVEL UP PASS', 'GENERAL'];
  const sortedCategoryKeys = Object.keys(groupedPackages).sort((a, b) => {
    const indexA = categorySortOrder.indexOf(a);
    const indexB = categorySortOrder.indexOf(b);
    if (indexA === -1 && indexB === -1) return a.localeCompare(b);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  return (
    <Layout 
      activeTab={activeTab} 
      onTabChange={setActiveTab} 
      user={user} 
      onLogout={handleLogout}
      onOpenAuth={(mode) => setAuthMode(mode || 'login')}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
    >
      {activeTab === 'home' && (
        <div className="space-y-12 animate-in fade-in duration-700">
          {!searchTerm && (
            <section className="relative h-[480px] md:h-[520px] rounded-[2.5rem] overflow-hidden group shadow-2xl border border-zinc-800">
              <img 
                src="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&h=600&fit=crop&q=80" 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-40 grayscale-[20%]"
                alt="Hero"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent flex flex-col justify-center px-8 md:px-16">
                <span className="text-indigo-500 font-black uppercase tracking-[0.4em] mb-4 text-[11px] md:text-sm animate-pulse">Neural Link Established</span>
                <h1 className="text-6xl md:text-8xl font-black text-white uppercase italic tracking-tighter leading-[0.9] mb-6">
                  LEVEL UP <br />YOUR <br /><span className="text-indigo-600">ARSENAL</span>
                </h1>
                <p className="text-zinc-400 max-w-sm md:max-w-md text-sm md:text-base font-medium leading-relaxed mb-10">
                  Instant delivery for Free Fire, PUBG Mobile, and more. Secure the meta items before the competition does.
                </p>
                <div className="flex flex-row gap-3 md:gap-6">
                  <button 
                    onClick={() => setActiveTab('games')}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-black px-6 md:px-12 py-4 md:py-5 rounded-2xl uppercase tracking-[0.15em] text-[10px] md:text-xs transition-all shadow-2xl shadow-indigo-600/40 active:scale-95"
                  >
                    Browse Armory
                  </button>
                  <button 
                    onClick={user ? () => setActiveTab('history') : () => setAuthMode('register')}
                    className="bg-transparent border-2 border-zinc-700 text-white font-black px-6 md:px-12 py-4 md:py-5 rounded-2xl uppercase tracking-[0.15em] text-[10px] md:text-xs transition-all hover:bg-zinc-800/40 active:scale-95"
                  >
                    {user ? 'Mission Log' : 'Sign Up'}
                  </button>
                </div>
              </div>
            </section>
          )}

          {user && transactions.length > 0 && !searchTerm && (
            <section className="bg-indigo-600/5 border border-indigo-500/20 rounded-[2.5rem] p-8 animate-in slide-in-from-left-4 duration-500">
               <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-black text-white uppercase italic tracking-tighter flex items-center gap-3">
                    <span className="w-1 h-5 bg-indigo-600 rounded-full"></span> 
                    Recent Activity
                  </h2>
                  <button onClick={() => setActiveTab('history')} className="text-indigo-500 text-[9px] font-black uppercase tracking-widest hover:underline">Full Mission Log</button>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 {transactions.slice(0, 3).map(trx => (
                   <div key={trx.id} className="bg-zinc-900 border border-zinc-800/50 p-4 rounded-2xl flex items-center gap-4 group">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${trx.status === 'processing' ? 'bg-amber-500/10 text-amber-500' : 'bg-green-500/10 text-green-500'}`}>
                        <i className={`fas ${trx.status === 'processing' ? 'fa-sync fa-spin' : 'fa-check-circle'} text-sm`}></i>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-xs font-black uppercase tracking-tight truncate">{trx.gameName}</p>
                        <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest truncate">{trx.amount} {trx.unit}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-indigo-500 text-[10px] font-black italic">৳{trx.price}</p>
                      </div>
                   </div>
                 ))}
               </div>
            </section>
          )}

          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter flex items-center gap-3">
                <span className="w-1.5 h-6 bg-indigo-600 rounded-full"></span> 
                {searchTerm ? `Search Results for "${searchTerm}"` : 'TRENDING NOW'}
              </h2>
              {!searchTerm && (
                <button onClick={() => setActiveTab('games')} className="text-zinc-500 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors">SEE ALL GAMES</button>
              )}
            </div>
            {filteredGames.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-8 xl:grid-cols-10 gap-3 md:gap-4 lg:gap-6">
                {(searchTerm ? filteredGames : filteredGames.slice(0, 10)).map(game => (
                  <GameCard key={game.id} game={game} onClick={(g) => { setSelectedGame(g); setActiveTab('games'); }} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-zinc-900/20 border border-dashed border-zinc-800 rounded-3xl">
                <i className="fas fa-search-minus text-zinc-700 text-4xl mb-4"></i>
                <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">No games found matches your search.</p>
              </div>
            )}
          </section>

          {!searchTerm && <Features />}
        </div>
      )}

      {activeTab === 'games' && (
        <div className="space-y-12">
          {selectedGame ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
              <button 
                onClick={() => { setSelectedGame(null); setSelectedPackage(null); setSelectedPayment(null); }}
                className="mb-8 text-zinc-500 hover:text-white flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors"
              >
                <i className="fas fa-arrow-left"></i> Back to Catalog
              </button>
              
              <div className="grid lg:grid-cols-3 gap-12">
                <div className="lg:col-span-1 space-y-8">
                  <div className="bg-zinc-900 rounded-[2rem] p-8 border border-zinc-800 shadow-xl overflow-hidden relative">
                    <img src={selectedGame.banner} alt={selectedGame.name} className="absolute top-0 left-0 w-full h-32 object-cover opacity-20 grayscale" />
                    <div className="relative pt-12">
                      <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-indigo-500 mb-6 shadow-xl shadow-indigo-500/20 bg-zinc-950">
                        <img src={selectedGame.image} alt={selectedGame.name} className="w-full h-full object-cover" />
                      </div>
                      <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-2">{selectedGame.name}</h2>
                      <p className="text-indigo-400 text-xs font-bold uppercase tracking-widest mb-6">{selectedGame.category}</p>
                      <p className="text-zinc-400 text-sm leading-relaxed mb-8">{selectedGame.description}</p>
                    </div>
                  </div>

                  {/* Updated Player ID section to match requested design */}
                  <div className="space-y-4 px-2">
                    <h3 className="text-xl font-bold text-white">Player ID / Username</h3>
                    <div className="relative group">
                      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-indigo-500 transition-colors">
                        <i className="fas fa-gamepad text-xl"></i>
                      </div>
                      <input 
                        type="text" 
                        value={playerId}
                        onChange={(e) => setPlayerId(e.target.value)}
                        placeholder="Enter your Game ID"
                        className="w-full bg-[#0d0d0f] border border-zinc-800/60 rounded-xl pl-14 pr-5 py-5 text-white font-medium focus:outline-none focus:border-indigo-500 transition-all shadow-sm"
                      />
                    </div>
                    <p className="text-zinc-500 text-sm font-medium">
                      Make sure to enter your correct Player ID to receive items instantly.
                    </p>
                  </div>
                </div>

                <div className="lg:col-span-2 space-y-10">
                  <div className="space-y-8">
                    {/* Replaced 'Resource Allocation' with the styled 'PACKAGES' box from screenshot */}
                    <div className="mb-8 w-fit">
                      <div className="border border-zinc-800 px-5 py-3 rounded-lg relative overflow-hidden bg-zinc-900/20 group">
                         <div className="absolute top-0 left-0 w-1 h-full bg-indigo-600/50"></div>
                         <h3 className="text-[10px] font-black text-zinc-300 uppercase tracking-[0.3em] flex items-center gap-2">
                           <span className="w-3 h-[1px] bg-zinc-700"></span> PACKAGES
                         </h3>
                      </div>
                    </div>
                    
                    {sortedCategoryKeys.map((category) => {
                      const pkgs = groupedPackages[category];
                      return (
                        <div key={category} className="space-y-4">
                          <div className="flex items-center gap-4">
                            <div className="bg-black/60 px-3 py-1.5 rounded-lg border border-indigo-500/20 shadow-[0_0_15px_rgba(79,70,229,0.05)]">
                              <h4 className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.25em] italic">
                                {category}
                              </h4>
                            </div>
                            <div className="flex-1 h-[1px] bg-gradient-to-r from-indigo-500/20 via-zinc-800 to-transparent"></div>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-2 gap-2 md:gap-3.5">
                            {pkgs.map(pkg => (
                              <button 
                                key={pkg.id}
                                onClick={() => handlePackageSelect(selectedGame, pkg)}
                                className={`group relative bg-[#0d0d0f] border p-2.5 md:p-4 rounded-xl transition-all text-left flex justify-between items-center shadow-sm ${
                                  selectedPackage?.id === pkg.id 
                                  ? 'border-indigo-500 bg-indigo-500/5 ring-1 ring-indigo-500/30' 
                                  : 'border-zinc-800/60 hover:border-indigo-500/30 hover:bg-[#121216]'
                                }`}
                              >
                                <div className="flex flex-col gap-0">
                                  <p className="text-xs md:text-base font-black text-white italic tracking-tighter group-hover:text-indigo-400 transition-colors truncate max-w-[80px] md:max-w-none">
                                    {pkg.amount > 1 ? pkg.amount : ''} {pkg.unit}
                                  </p>
                                  {pkg.bonus && (
                                    <p className="text-green-500 text-[6px] md:text-[8px] font-black uppercase tracking-widest">+{pkg.bonus} Bonus</p>
                                  )}
                                </div>
                                <div className="text-right shrink-0">
                                  <p className="text-[6px] md:text-[7px] font-black text-zinc-500 uppercase tracking-widest mb-0.5 opacity-50">Price</p>
                                  <p className="text-xs md:text-lg font-black text-white italic tracking-tighter flex items-center justify-end leading-none">
                                    <span className="text-zinc-600 text-[8px] md:text-xs mr-0.5 font-bold">৳</span>
                                    {pkg.price}
                                  </p>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Order Summary Block - Refined to be smaller and more compact */}
                  <div className="bg-[#0b0b0d] border border-zinc-800/60 p-5 md:p-6 rounded-2xl shadow-sm animate-in fade-in duration-500 max-w-2xl mx-auto md:mx-0">
                    <h3 className="text-lg font-bold text-white mb-5 uppercase tracking-tight">Order Summary</h3>
                    
                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between items-center border-b border-zinc-800/50 pb-3">
                        <span className="text-zinc-500 text-[11px] font-black uppercase tracking-widest">Product:</span>
                        <span className="text-white text-xs font-black uppercase italic tracking-tighter">{selectedGame.name}</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-zinc-800/50 pb-3">
                        <span className="text-zinc-500 text-[11px] font-black uppercase tracking-widest">Item:</span>
                        <span className="text-white text-xs font-black uppercase italic tracking-tighter">
                          {selectedPackage ? `${selectedPackage.amount} ${selectedPackage.unit}` : '-'}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-end mb-6">
                      <span className="text-xl font-black text-white uppercase italic tracking-tighter">Total:</span>
                      <span className="text-2xl font-black text-[#00a3e0] italic tracking-tighter leading-none">
                        ৳{selectedPackage ? selectedPackage.price : '0.00'}
                      </span>
                    </div>

                    <div className="bg-[#001c2b]/30 border border-[#00a3e0]/10 rounded-lg p-3 flex items-center justify-center gap-2.5">
                      <i className="fas fa-shield-halved text-[#00a3e0] text-[10px]"></i>
                      <span className="text-[#00a3e0] text-[9px] font-black uppercase tracking-widest">Secure 256-bit SSL Encrypted Payment</span>
                    </div>
                  </div>

                  {/* Payment Method Selection - Redesigned to match the radio button screenshot style */}
                  <div className="bg-[#0b0b0d] border border-zinc-800/60 p-6 md:p-8 rounded-[2rem] shadow-sm animate-in fade-in duration-500 max-w-2xl mx-auto md:mx-0">
                    <div className="flex items-center gap-4 mb-8">
                      <h3 className="text-xl font-bold text-white uppercase tracking-tight">Payment Method</h3>
                    </div>

                    <div className="flex flex-col gap-4">
                      {PAYMENT_METHODS.map(method => (
                        <button 
                          key={method.id}
                          onClick={() => setSelectedPayment(method)}
                          className={`flex items-center gap-5 p-4 md:p-5 rounded-2xl transition-all group relative overflow-hidden border ${
                            selectedPayment?.id === method.id 
                            ? 'border-[#00a3e0] bg-[#00a3e0]/5' 
                            : 'bg-zinc-900/40 border-zinc-800 hover:border-zinc-700 hover:bg-[#121216]'
                          }`}
                        >
                          {/* Radio Button UI */}
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors shrink-0 ${
                            selectedPayment?.id === method.id ? 'border-[#00a3e0]' : 'border-zinc-700'
                          }`}>
                            {selectedPayment?.id === method.id && (
                              <div className="w-2.5 h-2.5 rounded-full bg-[#00a3e0]"></div>
                            )}
                          </div>
                          
                          <div className="flex flex-col items-start">
                            <span className={`font-black uppercase italic tracking-tighter text-lg leading-none transition-colors ${
                              selectedPayment?.id === method.id ? 'text-[#00a3e0]' : 'text-white'
                            }`}>
                              {method.name}
                            </span>
                            <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Instant Node</span>
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Action Button */}
                    <div className="mt-10 md:mt-12 pt-8 border-t border-zinc-800/50">
                      <button 
                        onClick={handleConfirmOrder}
                        disabled={!selectedPackage || !selectedPayment || !playerId.trim()}
                        className={`w-full flex items-center justify-center gap-4 py-5 md:py-6 rounded-2xl font-black uppercase italic tracking-[0.15em] transition-all text-sm group ${
                          !selectedPackage || !selectedPayment || !playerId.trim()
                          ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed border border-zinc-700 opacity-60'
                          : 'bg-zinc-900 border border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white shadow-[0_0_30px_-5px_rgba(255,255,255,0.05)] active:scale-[0.98]'
                        }`}
                      >
                        <i className="fas fa-bolt text-xs group-hover:animate-pulse"></i>
                        Confirm Order & Initialize Top-Up
                        <i className="fas fa-chevron-right text-[10px] group-hover:translate-x-1 transition-transform"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">
                {searchTerm ? `Search Results: ${searchTerm}` : 'THE ARMORY'}
              </h2>
              {filteredGames.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 xl:grid-cols-8 gap-3 md:gap-4 lg:gap-6">
                  {filteredGames.map(game => (
                    <GameCard key={game.id} game={game} onClick={setSelectedGame} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-40 bg-zinc-900/10 border border-dashed border-zinc-800 rounded-[2.5rem]">
                  <i className="fas fa-ghost text-zinc-800 text-6xl mb-6"></i>
                  <p className="text-zinc-600 text-sm font-black uppercase tracking-[0.3em]">No games detected in the database.</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === 'history' && (
        <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in duration-500 pb-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <h2 className="text-5xl font-black text-white uppercase italic tracking-tighter">MISSION LOG</h2>
            {user && (
              <div className="flex flex-col items-start md:items-end">
                <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">
                  Logged in as: <span className="text-indigo-500">{user.email}</span>
                </p>
                <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-[0.2em]">
                  Agent ID: <span className="text-zinc-400 font-mono tracking-normal">{user.id}</span>
                </p>
              </div>
            )}
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-[2rem] shadow-xl">
             <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="flex-1 w-full">
                   <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1 mb-2 block">Track Transaction (Order ID / Player ID)</label>
                   <div className="relative">
                      <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"></i>
                      <input 
                        type="text" 
                        placeholder="Search your mission logs..."
                        value={orderTrackId}
                        onChange={(e) => setOrderTrackId(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-4 pl-12 pr-4 text-white text-sm font-bold focus:outline-none focus:border-indigo-500 transition-colors"
                      />
                   </div>
                </div>
                <div className="w-full md:w-fit bg-indigo-600/10 border border-indigo-500/20 px-6 py-4 rounded-xl">
                   <p className="text-[9px] text-indigo-400 font-black uppercase tracking-widest text-center">
                     <i className="fas fa-shield-alt mr-2"></i> Persistent Grid Active
                   </p>
                </div>
             </div>
          </div>
          
          {!user ? (
            <div className="text-center py-40 bg-zinc-900/30 border border-zinc-800 rounded-[3rem] flex flex-col items-center">
              <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center mb-6">
                <i className="fas fa-user-lock text-indigo-500 text-3xl"></i>
              </div>
              <h3 className="text-xl font-black text-white uppercase italic tracking-tighter mb-4">Authentication Required</h3>
              <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest max-w-xs mx-auto mb-8">Login to view your persistent mission history across sessions. Your old history is waiting.</p>
              <button 
                onClick={() => setAuthMode('login')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-black px-10 py-4 rounded-xl uppercase tracking-widest text-[10px] transition-all shadow-xl shadow-indigo-600/20 active:scale-95"
              >
                Access History Grid
              </button>
            </div>
          ) : trackedTransactions.length > 0 ? (
            <div className="space-y-6">
              {trackedTransactions.map(trx => (
                <div key={trx.id} className="bg-[#0e0e11] border border-zinc-800/80 p-6 md:p-8 rounded-[2.5rem] flex items-center justify-between group hover:border-indigo-500/40 transition-all duration-300">
                  <div className="flex items-center gap-6 md:gap-10">
                    <div className="w-16 h-16 bg-[#09090b] rounded-2xl flex items-center justify-center border border-zinc-800 shadow-inner relative overflow-hidden">
                      {trx.status === 'processing' ? (
                        <i className="fas fa-circle-notch fa-spin text-amber-500 text-xl"></i>
                      ) : (
                        <i className="fas fa-check-double text-green-500 text-xl"></i>
                      )}
                    </div>

                    <div>
                      <h3 className="text-white font-black uppercase italic tracking-tighter text-xl md:text-2xl mb-3">
                        {trx.gameName} - {trx.amount} {trx.unit}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 md:gap-4 font-bold text-[10px] md:text-[11px] uppercase tracking-widest text-zinc-600">
                        <span className="opacity-80">{trx.date}</span>
                        <span className="w-1.5 h-1.5 bg-zinc-800 rounded-full"></span>
                        <span className="text-indigo-500/80">{trx.paymentMethod}</span>
                        <span className="w-1.5 h-1.5 bg-zinc-800 rounded-full"></span>
                        <div className="flex items-center gap-2 bg-[#09090b] px-3 py-1 rounded-md border border-zinc-800/50">
                          <span className="opacity-40">ORDER:</span>
                          <span className="text-zinc-400 font-mono tracking-normal">{trx.id}</span>
                        </div>
                        <span className="w-1.5 h-1.5 bg-zinc-800 rounded-full"></span>
                        <div className="flex items-center gap-2 bg-[#09090b] px-3 py-1 rounded-md border border-zinc-800/50">
                          <span className="opacity-40">PLAYER:</span>
                          <span className="text-indigo-400/80 font-mono tracking-normal">{trx.playerId}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-right flex flex-col items-end gap-3 min-w-[120px]">
                    <p className="text-3xl md:text-4xl font-black text-white italic tracking-tighter flex items-center">
                      <span className="text-zinc-500 text-xl md:text-2xl mr-1 leading-none">৳</span>
                      {trx.price}
                    </p>
                    <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-5 py-1.5 rounded-lg border shadow-lg italic transition-colors ${
                      trx.status === 'processing' 
                      ? 'bg-amber-500/5 text-amber-500 border-amber-500/30' 
                      : 'bg-green-500/5 text-green-500 border-green-500/30'
                    }`}>
                      {trx.status === 'processing' ? 'PROCESSING' : 'COMPLETED'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-40 bg-zinc-900/20 border border-dashed border-zinc-800 rounded-[3rem]">
              <i className="fas fa-history text-zinc-800 text-6xl mb-8 opacity-20"></i>
              <p className="text-zinc-600 text-sm font-black uppercase tracking-[0.4em]">No mission logs found matching "{orderTrackId}"</p>
            </div>
          )}

          <div className="p-8 bg-indigo-600/5 border border-indigo-500/20 rounded-[2rem] text-center">
             <p className="text-zinc-400 text-xs font-medium max-w-lg mx-auto leading-relaxed">
               <strong className="text-white block mb-2 uppercase tracking-widest text-[10px]">Security Notice:</strong>
               All transaction data is now cryptographically linked to your verified email address. If you are missing old history, ensure you have logged in with the same email used during the transaction.
             </p>
          </div>
        </div>
      )}

      {authMode && (
        <Auth initialMode={authMode} onLogin={handleLogin} onClose={() => setAuthMode(null)} />
      )}

      {isGatewayOpen && selectedPayment && selectedPackage && selectedGame && (
        <PaymentGateway 
          method={selectedPayment} 
          pkg={selectedPackage} 
          game={selectedGame}
          playerId={playerId}
          onComplete={handlePaymentComplete}
          onCancel={() => setIsGatewayOpen(false)}
        />
      )}

      <ChatWidget />
    </Layout>
  );
};

export default App;