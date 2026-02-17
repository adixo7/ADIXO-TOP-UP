
import React, { useState, useEffect, useRef } from 'react';
import { GAMES, PAYMENT_METHODS } from './data';
import { Game, Package, Transaction, User, PaymentMethod } from './types';
import Layout from './components/Layout';
import GameCard from './components/GameCard';
import Auth from './components/Auth';
import PaymentGateway from './components/PaymentGateway';
import ChatWidget from './components/ChatWidget';
import Features from './components/Features';
import DisclaimerPopup from './components/DisclaimerPopup';

const FIVE_MINUTES = 5 * 60 * 1000;

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [user, setUser] = useState<User | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'register' | null>(null);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(null);
  const [isGatewayOpen, setIsGatewayOpen] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [playerId, setPlayerId] = useState('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [orderTrackId, setOrderTrackId] = useState('');
  
  // Profile specific states
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [updateMsg, setUpdateMsg] = useState<{type: 'success' | 'error', text: string} | null>(null);

  const timerRefs = useRef<{ [key: string]: any }>({});

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab, selectedGame]);

  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      // If we are deep in a game selection or similar, and user hits back, 
      // we want to reset to home and scroll to top.
      if (selectedGame || activeTab !== 'home') {
        setSelectedGame(null);
        setSelectedPackage(null);
        setSelectedPayment(null);
        setActiveTab('home');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [selectedGame, activeTab]);

  // Push state when navigation happens to enable back button handling
  useEffect(() => {
    if (selectedGame || activeTab !== 'home') {
      window.history.pushState({ path: activeTab, game: selectedGame?.id }, '');
    }
  }, [selectedGame, activeTab]);

  // Auth & Disclaimer Initialization
  useEffect(() => {
    const savedUser = localStorage.getItem('adixo_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    // Show disclaimer if not shown in current session
    const disclaimerShown = sessionStorage.getItem('adixo_disclaimer_shown');
    if (!disclaimerShown) {
      setShowDisclaimer(true);
    }
  }, []);

  const handleCloseDisclaimer = () => {
    setShowDisclaimer(false);
    sessionStorage.setItem('adixo_disclaimer_shown', 'true');
  };

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
    setActiveTab('home');
  };

  const handleResetPassword = () => {
    if (!user || !newPassword.trim() || !oldPassword.trim()) return;
    setIsUpdatingPassword(true);
    setUpdateMsg(null);

    setTimeout(() => {
      const storedUsersKey = 'adixo_db_users';
      const usersJson = localStorage.getItem(storedUsersKey);
      if (usersJson) {
        const users = JSON.parse(usersJson);
        const emailKey = user.email.toLowerCase();
        if (users[emailKey]) {
          // Verify old password first
          if (users[emailKey].password === oldPassword) {
            users[emailKey].password = newPassword;
            localStorage.setItem(storedUsersKey, JSON.stringify(users));
            setUpdateMsg({ type: 'success', text: 'Password protocols updated successfully!' });
            setNewPassword('');
            setOldPassword('');
          } else {
            setUpdateMsg({ type: 'error', text: 'Old password incorrect. Verification failed.' });
          }
        } else {
          setUpdateMsg({ type: 'error', text: 'Account grid error. Try again later.' });
        }
      }
      setIsUpdatingPassword(false);
    }, 1500);
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
    if (!user) {
      setAuthMode('login');
      return;
    }
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

    const packageName = `${selectedPackage.amount} ${selectedPackage.unit}`;
    const messageTemplate = `✨ NEW TOP-UP ORDER ✨
--------------------------
📦 Order ID: ${orderId}
🎮 Game: ${selectedGame.name}
👤 Player ID: ${playerId}
💎 Package: ${packageName}
💳 Method: ${selectedPayment.name}
🔑 TrxID: ${trxId}
⏰ Time: ${orderTime}
--------------------------`;

    const telegramUrl = `https://t.me/AdiXO_TV?text=${encodeURIComponent(messageTemplate)}`;

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

  const groupedPackages: Record<string, Package[]> = (selectedGame?.packages || []).reduce((acc: Record<string, Package[]>, pkg) => {
    const cat = pkg.category || 'GENERAL';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(pkg);
    return acc;
  }, {} as Record<string, Package[]>);

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
      {showDisclaimer && <DisclaimerPopup onClose={handleCloseDisclaimer} />}

      {activeTab === 'home' && (
        <div className="space-y-12 animate-in fade-in duration-700 relative z-10">
          {!searchTerm && (
            <section className="relative h-[180px] md:h-[240px] rounded-[3rem] overflow-hidden group shadow-2xl border border-orange-500/20 bg-[#0c0c0e]">
              <div className="absolute inset-0 bg-orange-600/5 group-hover:bg-orange-600/10 transition-colors"></div>
              <img 
                src="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&h=600&fit=crop&q=80" 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-20 grayscale-[20%]"
                alt="Hero"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent"></div>
              <div className="absolute inset-0 flex flex-col justify-center items-center px-6 md:px-16 text-center">
                <span className="text-orange-500 font-black uppercase tracking-[0.4em] mb-3 text-[7px] md:text-[10px] animate-pulse">ADIXO OFFICIAL TOPUP</span>
                
                <p className="text-zinc-400 max-w-sm md:max-w-2xl text-[9px] md:text-[12px] font-medium leading-relaxed mb-6 mx-auto">
                  Instant delivery for Free Fire, PUBG Mobile and more with the best price in market
                </p>
                
                <div className="flex flex-row justify-center gap-3">
                  <button 
                    onClick={() => setActiveTab('games')}
                    className="bg-orange-600 hover:bg-orange-700 text-white font-black px-5 md:px-8 py-2 md:py-2.5 rounded-xl uppercase tracking-[0.15em] text-[8px] md:text-[9px] transition-all shadow-xl shadow-orange-600/30 active:scale-95"
                  >
                    BROWSE ARMORY
                  </button>
                  {!user && (
                    <button 
                      onClick={() => setAuthMode('register')}
                      className="bg-transparent border border-zinc-700 text-white font-black px-5 md:px-8 py-2 md:py-2.5 rounded-xl uppercase tracking-[0.15em] text-[8px] md:text-[9px] transition-all hover:bg-zinc-800/40 active:scale-95"
                    >
                      SIGN UP
                    </button>
                  )}
                </div>
              </div>
            </section>
          )}

          {user && transactions.length > 0 && !searchTerm && (
            <section className="bg-orange-600/5 border border-orange-500/20 rounded-[2.5rem] p-8 animate-in slide-in-from-left-4 duration-500">
               <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-black text-white uppercase italic tracking-tighter flex items-center gap-3">
                    <span className="w-1 h-5 bg-orange-600 rounded-full"></span> 
                    Recent Activity
                  </h2>
                  <button onClick={() => setActiveTab('history')} className="text-orange-500 text-[9px] font-black uppercase tracking-widest hover:underline">Full Order History</button>
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
                        <p className="text-orange-500 text-[10px] font-black italic">৳{trx.price}</p>
                      </div>
                   </div>
                 ))}
               </div>
            </section>
          )}

          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter flex items-center gap-3">
                <span className="w-1.5 h-6 bg-orange-600 rounded-full"></span> 
                TRENDING NOW
              </h2>
            </div>
            {filteredGames.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4 lg:gap-6">
                {filteredGames.filter(g => g.id !== 'pc-games').map(game => (
                  <GameCard key={game.id} game={game} onClick={(g) => { setSelectedGame(g); setActiveTab('games'); }} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-zinc-900/20 border border-dashed border-zinc-800 rounded-3xl">
                <i className="fas fa-search-minus text-zinc-700 text-4xl mb-4"></i>
                <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">No matches found.</p>
              </div>
            )}
          </section>

          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter flex items-center gap-3">
                <span className="w-1.5 h-6 bg-orange-600 rounded-full"></span> 
                TOP PC GAMES
              </h2>
              <button 
                onClick={() => {
                  setSelectedGame(GAMES.find(g => g.id === 'pc-games') || null);
                  setActiveTab('games');
                }}
                className="text-orange-500 text-[10px] font-black uppercase tracking-widest hover:underline flex items-center gap-2"
              >
                View All <i className="fas fa-chevron-right text-[8px]"></i>
              </button>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {GAMES.find(g => g.id === 'pc-games')?.packages
                .filter(pkg => {
                  const name = pkg.unit.toLowerCase();
                  return name.includes('grand theft auto 5') || 
                         name.includes('forza horizon 5') || 
                         name.includes('rdr 2') || 
                         name.includes('fc™ 26') || 
                         name.includes('cyberpunk 2077');
                })
                .slice(0, 5)
                .map((pkg, idx) => {
                  const allPkgs = GAMES.find(g => g.id === 'pc-games')?.packages || [];
                  const baseIdx = allPkgs.findIndex(p => p.id === pkg.id);
                  
                  let imageSrc = pkg.image || `/images/pc-game-${baseIdx + 1}.png`;
                  
                  return (
                    <div key={pkg.id} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-2 group hover:border-orange-500/50 transition-all cursor-pointer" onClick={() => { setSelectedGame(GAMES.find(g => g.id === 'pc-games') || null); setSelectedPackage(pkg); setActiveTab('games'); }}>
                      <div className="aspect-[3/4] rounded-lg overflow-hidden mb-2 bg-zinc-950">
                        <img src={imageSrc} alt={pkg.unit} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <h3 className="text-[8px] md:text-[9px] font-black text-white uppercase tracking-tight line-clamp-2 mb-1 leading-tight h-6 md:h-7">{pkg.unit}</h3>
                      <div className="flex items-center gap-1.5">
                        <span className="text-orange-500 font-black text-[10px] md:text-xs italic">৳{pkg.price}</span>
                        {pkg.oldPrice && <span className="text-zinc-500 text-[8px] md:text-[9px] line-through">৳{pkg.oldPrice}</span>}
                      </div>
                    </div>
                  );
                })}
            </div>
          </section>

          {!searchTerm && <Features />}
        </div>
      )}

      {activeTab === 'games' && (
        <div className="space-y-12">
          {selectedGame ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
              <button 
                onClick={() => { 
                  setSelectedGame(null); 
                  setSelectedPackage(null); 
                  setSelectedPayment(null);
                  setActiveTab('home');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="mb-8 text-zinc-500 hover:text-white flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors"
              >
                <i className="fas fa-arrow-left"></i> Back
              </button>
              
              <div className="grid lg:grid-cols-3 gap-12">
                <div className="lg:col-span-1 space-y-8">
                  <div className="bg-zinc-900 rounded-[2rem] p-8 border border-zinc-800 shadow-xl overflow-hidden relative">
                    <img src={selectedGame.banner} alt={selectedGame.name} className="absolute top-0 left-0 w-full h-32 object-cover opacity-20 grayscale" />
                    <div className="relative pt-12">
                      <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-orange-500 mb-6 shadow-xl shadow-orange-500/20 bg-zinc-950">
                        <img 
                           src={selectedGame.image} 
                           alt={selectedGame.name} 
                           className="w-full h-full object-cover" 
                           onError={(e) => {
                             (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedGame.name)}&background=18181b&color=f97316&bold=true`;
                           }}
                        />
                      </div>
                      <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-2">{selectedGame.name}</h2>
                      <p className="text-orange-400 text-xs font-bold uppercase tracking-widest mb-6">{selectedGame.category}</p>
                      <p className="text-zinc-400 text-sm leading-relaxed mb-8">{selectedGame.description}</p>
                    </div>
                  </div>

                  <div className="space-y-4 px-2">
                    <h3 className="text-xl font-bold text-white">
                      {selectedGame.id === 'pc-games' ? 'Email / Whatsapp number' : 'Player ID / Username'}
                    </h3>
                    <div className="relative group">
                      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-orange-500 transition-colors">
                        <i className={`fas ${selectedGame.id === 'pc-games' ? 'fa-envelope' : 'fa-gamepad'} text-xl`}></i>
                      </div>
                      <input 
                        type="text" 
                        value={playerId}
                        onChange={(e) => setPlayerId(e.target.value)}
                        placeholder={selectedGame.id === 'pc-games' ? 'Enter Email or Whatsapp Number' : selectedGame.idPlaceholder}
                        className="w-full bg-[#0d0d0f] border border-zinc-800/60 rounded-xl pl-14 pr-5 py-5 text-white font-medium focus:outline-none focus:border-orange-500 transition-all shadow-sm"
                      />
                    </div>
                    {selectedGame.id === 'pc-games' && (
                      <p className="text-orange-500/80 text-[10px] font-medium italic mt-2 px-1">
                        * Note: We will send your purchased game's account ID and password to this Email or WhatsApp number.
                      </p>
                    )}
                  </div>
                </div>

                <div className="lg:col-span-2 space-y-10">
                  {selectedGame.id === 'pc-games' ? (
                    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                      {selectedGame.packages.map((pkg) => {
                        const allPkgs = GAMES.find(g => g.id === 'pc-games')?.packages || [];
                        const baseIdx = allPkgs.findIndex(p => p.id === pkg.id);
                        
                        let imageSrc = pkg.image || `/images/pc-game-${baseIdx + 1}.png`;

                        return (
                          <div 
                            key={pkg.id} 
                            className={`bg-zinc-900/50 border rounded-xl p-2 group transition-all cursor-pointer relative ${
                              selectedPackage?.id === pkg.id 
                              ? 'border-orange-500 bg-orange-500/10 shadow-[0_0_15px_rgba(249,115,22,0.1)]' 
                              : 'border-zinc-800 hover:border-orange-500/50 shadow-sm'
                            }`}
                            onClick={() => setSelectedPackage(pkg)}
                          >
                            {/* 30% Discount Badge */}
                            <div className="absolute -top-1 -right-1 z-20 bg-red-600 text-white text-[7px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-tighter shadow-lg shadow-red-600/20 border border-red-500/50 animate-pulse">
                              30% OFF
                            </div>
                            <div className="aspect-[3/4] rounded-lg overflow-hidden mb-2 bg-zinc-950 relative">
                              <img src={imageSrc} alt={pkg.unit} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            </div>
                            <h3 className="text-[8px] md:text-[9px] font-black text-white uppercase tracking-tight line-clamp-2 mb-1 leading-tight h-6 md:h-7">{pkg.unit}</h3>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <span className="text-orange-500 font-black text-[10px] md:text-xs italic">৳{pkg.price}</span>
                                {pkg.oldPrice && <span className="text-zinc-500 text-[8px] md:text-[9px] line-through">৳{pkg.oldPrice}</span>}
                              </div>
                              <div className={`w-3 h-3 rounded-full border flex items-center justify-center transition-colors ${selectedPackage?.id === pkg.id ? 'border-orange-500 bg-orange-500 text-white' : 'border-zinc-700'}`}>
                                {selectedPackage?.id === pkg.id && <i className="fas fa-check text-[5px]"></i>}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="space-y-8">
                      {sortedCategoryKeys.map((category) => (
                        <div key={category} className="space-y-4">
                          <div className="flex items-center gap-4">
                            <h4 className="text-[9px] font-black text-orange-400 uppercase tracking-[0.25em] italic">
                              {category}
                            </h4>
                            <div className="flex-1 h-[1px] bg-zinc-800"></div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            {groupedPackages[category].map(pkg => (
                              <button 
                                key={pkg.id}
                                onClick={() => setSelectedPackage(pkg)}
                                className={`group relative bg-[#0d0d0f] border px-4 py-3 rounded-xl transition-all text-left flex justify-between items-center overflow-hidden ${
                                  selectedPackage?.id === pkg.id 
                                  ? 'border-orange-500 bg-orange-500/10 shadow-[0_0_15px_rgba(249,115,22,0.1)]' 
                                  : 'border-zinc-800/80 hover:border-orange-500/40 hover:bg-zinc-900/50 shadow-sm'
                                }`}
                              >
                                <div className="flex flex-col relative z-10">
                                  <span className={`text-[11px] md:text-sm font-black italic tracking-tight leading-none mb-1 transition-colors ${selectedPackage?.id === pkg.id ? 'text-white' : 'text-zinc-200 group-hover:text-white'}`}>
                                    {pkg.amount > 1 ? pkg.amount : ''} {pkg.unit}
                                  </span>
                                  {pkg.isPopular && (
                                    <span className="text-[6px] bg-orange-600 text-white px-1 py-0.5 rounded-sm font-black uppercase tracking-[0.1em] w-fit shadow-lg shadow-orange-600/20">
                                      Hot Item
                                    </span>
                                  )}
                                </div>
                                <div className="flex flex-col items-end shrink-0 relative z-10">
                                  <span className={`text-sm md:text-lg font-black italic tracking-tighter transition-colors ${selectedPackage?.id === pkg.id ? 'text-white' : 'text-orange-500 group-hover:text-orange-400'}`}>
                                    ৳{pkg.price}
                                  </span>
                                  {pkg.oldPrice && (
                                    <span className={`text-[10px] line-through ${selectedPackage?.id === pkg.id ? 'text-white/50' : 'text-zinc-500'}`}>
                                      ৳{pkg.oldPrice}
                                    </span>
                                  )}
                                </div>
                                
                                {/* Decorative element background */}
                                <div className={`absolute -right-2 -bottom-2 transition-all duration-500 ${selectedPackage?.id === pkg.id ? 'text-white/5 scale-110' : 'text-zinc-800/10 group-hover:text-orange-500/5 group-hover:scale-105'}`}>
                                   <i className="fas fa-gem text-3xl md:text-4xl rotate-12"></i>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {selectedPackage && (
                    <div className="bg-[#0b0b0d] border border-zinc-800/60 p-6 md:p-8 rounded-[2rem] shadow-sm animate-in fade-in duration-500">
                      <h3 className="text-xl font-bold text-white mb-8 uppercase tracking-tight">Payment Method</h3>
                      <div className="flex flex-col gap-4">
                        {PAYMENT_METHODS.map(method => (
                          <button 
                            key={method.id}
                            onClick={() => setSelectedPayment(method)}
                            className={`flex items-center gap-5 p-5 rounded-2xl transition-all border ${
                              selectedPayment?.id === method.id 
                              ? 'border-orange-500 bg-orange-500/5' 
                              : 'bg-zinc-900/40 border-zinc-800'
                            }`}
                          >
                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${selectedPayment?.id === method.id ? 'border-orange-500' : 'border-zinc-700'}`}>
                              {selectedPayment?.id === method.id && <div className="w-2.5 h-2.5 rounded-full bg-orange-500"></div>}
                            </div>
                            <span className="font-black uppercase italic tracking-tighter text-lg text-white">{method.name}</span>
                          </button>
                        ))}
                      </div>
                      <div className="mt-10 pt-8 border-t border-zinc-800/50">
                        <button 
                          onClick={handleConfirmOrder}
                          className="w-full py-6 rounded-2xl font-black uppercase italic tracking-widest transition-all bg-orange-600 text-white shadow-xl hover:bg-orange-700 active:scale-95"
                        >
                          Confirm & Pay ৳{selectedPackage.price}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">THE ARMORY</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {filteredGames.map(game => (
                  <GameCard key={game.id} game={game} onClick={setSelectedGame} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'history' && (
        <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in duration-500 pb-20">
          <h2 className="text-5xl font-black text-white uppercase italic tracking-tighter">ORDER HISTORY</h2>
          {user && transactions.length > 0 ? (
            <div className="space-y-6">
              {transactions.map(trx => (
                <div key={trx.id} className="relative bg-[#0e0e11] border border-zinc-800/80 p-8 rounded-[2rem] flex flex-col md:flex-row md:items-center justify-between group gap-6 overflow-hidden">
                  <div className="flex flex-1 min-w-0 flex-col">
                    <h3 className="text-white font-black uppercase italic tracking-tighter text-2xl mb-1 truncate leading-tight">
                      {trx.gameName} - {trx.amount} {trx.unit}
                    </h3>
                    <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-zinc-500 mb-6">
                      {trx.date} • {trx.paymentMethod}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="bg-[#09090b] px-4 py-2.5 rounded-xl border border-zinc-800/50">
                        <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest shrink-0">ORDER:</span>
                        <span className="text-zinc-400 font-mono text-xs ml-2">{trx.id}</span>
                      </div>
                      <div className="bg-[#09090b] px-4 py-2.5 rounded-xl border border-zinc-800/50">
                        <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest shrink-0">PLAYER:</span>
                        <span className="text-orange-400/80 font-mono text-xs ml-2">{trx.playerId}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <p className="text-4xl font-black text-white italic tracking-tighter">৳{trx.price}</p>
                    <div className={`px-5 py-2 rounded-xl border text-[9px] font-black uppercase tracking-widest ${trx.status === 'processing' ? 'text-amber-500 border-amber-500/20' : 'text-green-500 border-green-500/20'}`}>
                      {trx.status.toUpperCase()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-40 bg-zinc-900/20 border border-dashed border-zinc-800 rounded-[3rem]">
              <i className="fas fa-history text-zinc-800 text-6xl mb-8 opacity-20"></i>
              <p className="text-zinc-600 text-sm font-black uppercase tracking-[0.4em]">No orders found.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'profile' && user && (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500 pb-20">
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-[2.5rem] p-8 md:p-12 flex flex-col items-center">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-orange-600 overflow-hidden shadow-2xl mb-8">
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            </div>
            
            <button 
              onClick={handleLogout}
              className="w-fit px-12 py-4 bg-transparent border border-red-500/40 text-red-500 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] hover:bg-red-500/10 transition-all active:scale-95 mb-12 shadow-lg shadow-red-500/5"
            >
              LOG OUT
            </button>

            <div className="w-full max-w-2xl space-y-10">
              <div className="space-y-6">
                <h3 className="text-xl font-black text-white uppercase italic tracking-tighter flex items-center gap-3">
                  <span className="w-1 h-5 bg-orange-600 rounded-full"></span> ACCOUNT DATA
                </h3>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-1">GRID ID</p>
                    <div className="bg-black border border-zinc-800 px-5 py-5 rounded-2xl text-zinc-300 font-bold text-base tracking-tight">{user.id}</div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-1">GMAIL (EMAIL)</p>
                    <div className="bg-black border border-zinc-800 px-5 py-5 rounded-2xl text-zinc-300 font-bold text-base tracking-tight">{user.email}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-black text-white uppercase italic tracking-tighter flex items-center gap-3">
                  <span className="w-1 h-5 bg-amber-500 rounded-full"></span> SECURITY PROTOCOLS
                </h3>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-1">RESET PASSWORD</p>
                    <div className="space-y-4">
                      <input 
                        type="password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        placeholder="ENTER OLD CODE"
                        className="w-full bg-black border border-zinc-800 px-5 py-5 rounded-2xl text-white font-bold text-base focus:outline-none focus:border-orange-500 transition-all placeholder:text-zinc-800"
                      />
                      <input 
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="ENTER NEW CODE"
                        className="w-full bg-black border border-zinc-800 px-5 py-5 rounded-2xl text-white font-bold text-base focus:outline-none focus:border-orange-500 transition-all placeholder:text-zinc-800"
                      />
                    </div>
                  </div>
                  
                  {updateMsg && (
                    <p className={`text-[10px] font-black uppercase tracking-widest mt-2 ${updateMsg.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                      {updateMsg.text}
                    </p>
                  )}
                  
                  <button 
                    onClick={handleResetPassword}
                    disabled={isUpdatingPassword || !newPassword.trim() || !oldPassword.trim()}
                    className="w-full bg-orange-900/40 hover:bg-orange-600 border border-orange-500/30 text-white font-black py-5 rounded-2xl uppercase tracking-[0.2em] text-xs transition-all disabled:opacity-50 active:scale-95 shadow-xl shadow-orange-600/10 mt-2"
                  >
                    {isUpdatingPassword ? 'Updating Protocol...' : 'UPDATE PASSWORD'}
                  </button>
                </div>
              </div>
            </div>
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
