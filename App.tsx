
import React, { useState, useEffect, useRef } from 'react';
import { GAMES, PAYMENT_METHODS } from './data';
import { Game, Package, Transaction, User, PaymentMethod } from './types';
import Layout from './components/Layout';
import HomeBanner from './components/HomeBanner';
import AnnouncementBanner from './components/AnnouncementBanner';
import GameCard from './components/GameCard';
import Auth from './components/Auth';
import PaymentGateway from './components/PaymentGateway';
import GuideBot from './components/GuideBot';
import Features from './components/Features';
import BonusOfferPopup from './components/BonusOfferPopup';
import DisclaimerPopup from './components/DisclaimerPopup';
import ServerIssuePopup from './components/ServerIssuePopup';
import MaintenancePopup from './components/MaintenancePopup';
import Confetti from './components/Confetti';
import LanguagePopup from './components/LanguagePopup';
import { useLanguage } from './LanguageContext';


const FF_PANEL_TIERS: Record<string, { days: number; price: number }[]> = {
  'ff-brmod-android': [
    { days: 1, price: 150 },
    { days: 7, price: 500 },
    { days: 15, price: 900 },
    { days: 30, price: 1400 },
  ],
  'ff-brmod-pc': [
    { days: 1, price: 150 },
    { days: 10, price: 800 },
    { days: 30, price: 1550 },
  ],
  'ff-snake-carrom': [
    { days: 3, price: 500 },
    { days: 10, price: 800 },
    { days: 30, price: 1800 },
  ],
  'ff-drip-apkmod': [
    { days: 1, price: 180 },
    { days: 3, price: 450 },
    { days: 7, price: 800 },
    { days: 15, price: 1000 },
    { days: 30, price: 1600 },
  ],
  'ff-hg-cheat': [
    { days: 1, price: 200 },
    { days: 10, price: 600 },
    { days: 30, price: 1500 },
  ],
  'ff-lkteam': [
    { days: 1, price: 160 },
    { days: 10, price: 400 },
    { days: 30, price: 900 },
  ],
  'ff-drip-root': [
    { days: 1, price: 150 },
    { days: 7, price: 650 },
    { days: 30, price: 1550 },
  ],
  'ff-8bp-ezteam': [
    { days: 1, price: 180 },
    { days: 7, price: 4400 },
    { days: 30, price: 900 },
  ],
  'ff-psh4x': [
    { days: 0, price: 600 },
  ],
  'ff-patoteam': [
    { days: 1, price: 300 },
    { days: 3, price: 500 },
    { days: 7, price: 800 },
    { days: 15, price: 1300 },
    { days: 30, price: 2000 },
  ],
  'ff-fluorite-ios': [
    { days: 1, price: 900 },
    { days: 7, price: 2500 },
    { days: 15, price: 3500 },
    { days: 30, price: 5000 },
  ],
  'ff-esign': [
    { days: 15, price: 600 },
    { days: 30, price: 1000 },
    { days: 60, price: 1750 },
  ],
  'ff-akloader': [
    { days: 7, price: 2000 },
    { days: 15, price: 3500 },
    { days: 30, price: 5000 },
  ],
  'ff-prime-apkmod': [
    { days: 3, price: 250 },
    { days: 7, price: 500 },
    { days: 10, price: 700 },
    { days: 15, price: 1000 },
    { days: 30, price: 1750 },
  ],
  'ff-gbox': [
    { days: 30, price: 2000 },
    { days: 60, price: 3800 },
  ],
  'ff-haxxcker': [
    { days: 10, price: 1200 },
    { days: 15, price: 2000 },
    { days: 30, price: 3850 },
  ],
  'ff-drip-pc-exe': [
    { days: 1, price: 280 },
    { days: 7, price: 800 },
    { days: 15, price: 1450 },
    { days: 30, price: 2700 },
  ],
};

const App: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('home');
  const [user, setUser] = useState<User | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'register' | null>(null);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [selectedServer, setSelectedServer] = useState<string | null>(null);
  const [serverDropdownOpen, setServerDropdownOpen] = useState(false);
  const [ffPanelPopupPkg, setFfPanelPopupPkg] = useState<Package | null>(null);
  const [ffPanelTierIdx, setFfPanelTierIdx] = useState<number>(0);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(null);
  const [isGatewayOpen, setIsGatewayOpen] = useState(false);
  const [showBonusOffer, setShowBonusOffer] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [showServerIssue, setShowServerIssue] = useState(false);
  const [playerId, setPlayerId] = useState('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [orderTrackId, setOrderTrackId] = useState('');
  const [showMaintenance, setShowMaintenance] = useState(false);
  const [maintenanceMethod, setMaintenanceMethod] = useState<string>('bKash');
  const paymentSectionRef = useRef<HTMLDivElement>(null);
  
  // Profile specific states
  const handlePaymentSelect = (method: PaymentMethod) => {
    if (method.id === 'bkash' || method.id === 'nagad' || method.id === 'rocket') {
      setMaintenanceMethod(method.name);
      setShowMaintenance(true);
      return;
    }
    setSelectedPayment(method);
  };

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [updateMsg, setUpdateMsg] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [isRamadanCouponApplied, setIsRamadanCouponApplied] = useState(false);
  const [isRamadanasApplied, setIsRamadanasApplied] = useState(false);
  const [isPsdis7Applied, setIsPsdis7Applied] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [stockOutToast, setStockOutToast] = useState<string | null>(null);
  const [showLangPopup, setShowLangPopup] = useState(false);
  const [announcement, setAnnouncement] = useState<string | null>(null);
  const [activeBanner, setActiveBanner] = useState(0);
  const [botMaintenance, setBotMaintenance] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);


  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab, selectedGame]);

  // Fetch site-control state on mount and every 30s
  useEffect(() => {
    const fetchSiteControl = async () => {
      try {
        const res = await fetch('/api/site-control');
        if (res.ok) {
          const data = await res.json();
          setAnnouncement(data.announcement || null);
          setActiveBanner(data.activeBanner ?? 0);
          setBotMaintenance(!!data.maintenance);
        }
      } catch {}
    };
    fetchSiteControl();
    const interval = setInterval(fetchSiteControl, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      // If we are deep in a game selection or similar, and user hits back, 
      // we want to reset to home and scroll to top.
      if (selectedGame || activeTab !== 'home') {
        setSelectedGame(null);
        setSelectedPackage(null);
        setSelectedServer(null);
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

  // Auth & Popup Initialization
  useEffect(() => {
    const savedUser = localStorage.getItem('adixo_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    const disclaimerShown = sessionStorage.getItem('adixo_disclaimer_shown');
    if (!disclaimerShown) {
      setShowDisclaimer(true);
      sessionStorage.setItem('adixo_disclaimer_shown', 'true');
    }

  }, []);

  const handleCloseBonusOffer = () => {
    setShowBonusOffer(false);
  };

  const handleDisclaimerClose = () => {
    setShowDisclaimer(false);
    const serverIssueShown = sessionStorage.getItem('adixo_server_issue_shown');
    if (!serverIssueShown) {
      setShowServerIssue(true);
      sessionStorage.setItem('adixo_server_issue_shown', 'true');
    }
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

    const updated = userTransactions;

    setTransactions(updated);
    
    // Always sync back to local storage if changed
    if (JSON.stringify(updated) !== saved) {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    }

    return () => {};
  }, [user?.id]); // Use user.id as dependency for more stable effect

  const handleUpdateOrderStatus = (trxId: string, status: 'completed' | 'failed') => {
    setTransactions(prev => {
      const updated = prev.map(t => t.id === trxId ? { ...t, status } : t);
      setUser(currentUser => {
        if (currentUser) {
          localStorage.setItem(`adixo_transactions_${currentUser.id}`, JSON.stringify(updated));
        }
        return currentUser;
      });
      return updated;
    });
  };



  // Poll backend every 8s for status changes on processing orders
  useEffect(() => {
    if (!user || transactions.length === 0) return;
    const processing = transactions.filter(t => t.status === 'processing');
    if (processing.length === 0) return;

    const interval = setInterval(async () => {
      for (const trx of processing) {
        try {
          const res = await fetch(`/api/order/${trx.id}`);
          const data = await res.json();
          if (data.status === 'completed' || data.status === 'failed') {
            handleUpdateOrderStatus(trx.id, data.status);
          }
        } catch {}
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [user?.id, transactions.map(t => `${t.id}:${t.status}`).join(',')]);


  const handleLogin = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem('adixo_user', JSON.stringify(newUser));
    setAuthMode(null);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('adixo_user');
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
        let users;
        try {
          users = JSON.parse(usersJson);
        } catch (e) {
          setUpdateMsg({ type: 'error', text: 'Account grid corruption. Try again later.' });
          setIsUpdatingPassword(false);
          return;
        }
        
        const emailKey = user.email.toLowerCase().trim();
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
    if (!selectedPackage) {
      setOrderError("Please select a package first.");
      return;
    }
    if (!playerId.trim()) {
      setOrderError(selectedGame?.id === 'pc-games' ? "Please enter your Email or WhatsApp number." : "Please enter your Player ID.");
      return;
    }
    if (selectedGame?.id === 'ff-likes' && !selectedServer) {
      setOrderError("Please select your server.");
      return;
    }
    if (!selectedPayment) {
      setOrderError("Please select a payment method.");
      return;
    }
    setOrderError(null);
    setIsGatewayOpen(true);
  };

  const handlePaymentComplete = async (trxId: string) => {
    if (!selectedGame || !selectedPackage || !selectedPayment || !user) return;

    const orderId = `AX-${Math.random().toString(36).substr(2, 7).toUpperCase()}`;
    const now = Date.now();
    const orderTime = new Date(now).toLocaleString('en-US', { 
      year: 'numeric', month: 'short', day: 'numeric', 
      hour: '2-digit', minute: '2-digit', second: '2-digit' 
    });

    const exchangeRate = 126;
    const displayPrice = selectedPayment.id === 'binance'
      ? (selectedPackage.currency === 'USD' ? selectedPackage.price : selectedPackage.price / exchangeRate)
      : (selectedPackage.currency === 'BDT' ? selectedPackage.price : selectedPackage.price * exchangeRate);
    const displayCurrency = selectedPayment.id === 'binance' ? 'USD' : 'BDT';

    const packageName = `${selectedPackage.amount} ${selectedPackage.unit}${selectedGame.id === 'ff-likes' && selectedServer ? ` — Server: ${selectedServer}` : ''}`;

    const newTransaction: Transaction = {
      id: orderId,
      gameId: selectedGame.id,
      gameName: selectedGame.name,
      playerId: playerId,
      amount: selectedPackage.amount,
      unit: selectedPackage.unit,
      price: displayPrice,
      currency: displayCurrency,
      paymentMethod: selectedPayment.name,
      date: orderTime,
      timestamp: now,
      status: 'processing'
    };

    const storageKey = `adixo_transactions_${user.id}`;
    setTransactions(prev => {
      const updated = [newTransaction, ...prev];
      localStorage.setItem(storageKey, JSON.stringify(updated));
      return updated;
    });

    // Send order to backend → triggers Telegram notification
    try {
      await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: orderId,
          gameId: selectedGame.id,
          gameName: selectedGame.name,
          playerId: playerId,
          packageName,
          price: displayPrice,
          currency: displayCurrency,
          paymentMethod: selectedPayment.name,
          trxId,
          date: orderTime,
          userName: user.name,
          userEmail: user.email,
          userId: user.id,
        }),
      });
    } catch (err) {
      console.error('Order notification error:', err);
    }

    setSelectedGame(null);
    setSelectedPackage(null);
    setSelectedServer(null);
    setSelectedPayment(null);
    setIsGatewayOpen(false);
    setActiveTab('history');
  };

  const filteredGames = GAMES.filter(game => 
    game.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    game.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const searchedPackages = GAMES.flatMap(game => 
    game.packages.map(pkg => ({ ...pkg, gameName: game.name, gameId: game.id, gameImage: game.image }))
  ).filter(pkg => 
    pkg.unit.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (pkg.description || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRedeemCoupon = (code: string) => {
    if (!user) {
      return { success: false, message: 'YOU MUST SIGN IN TO REDEEM A COUPON' };
    }
    const upperCode = code.toUpperCase();
    if (upperCode === 'ASMYSTERY7' || upperCode === 'CGRAMADAN15' || upperCode === 'RAMADANAS' || upperCode === 'PSDIS7') {
      return { success: false, message: 'THIS COUPON CODE HAS EXPIRED' };
    } else if (false && upperCode === 'PSDIS7') {
      if (selectedGame?.id !== 'ff') {
        return { success: false, message: 'THIS COUPON IS ONLY VALID FOR FREE FIRE MEMBERSHIPS' };
      }
      setIsPsdis7Applied(true);
      setShowConfetti(true);
      return { success: true, message: 'COUPON APPLIED! WEEKLY ৳145 & MONTHLY ৳725' };
    } else {
      return { success: false, message: 'COUPON INVALID OR REDEEMED PREVIOUSLY' };
    }
  };

  const groupedPackages: Record<string, Package[]> = (selectedGame?.packages || []).reduce((acc: Record<string, Package[]>, pkg) => {
    const cat = pkg.category || 'GENERAL';
    if (!acc[cat]) acc[cat] = [];
    
    // Apply coupon discount if applicable
    let finalPkg = { ...pkg };
    if (isCouponApplied && cat === 'MYSTERY BOX') {
      finalPkg.oldPrice = pkg.price;
      finalPkg.price = Number((pkg.price * 0.9).toFixed(2));
    }

    // Apply RAMADANAS coupon: 10% off MYSTERY BOX, GLORY PACKAGE, HIRE BOTS, round up decimals
    if (isRamadanasApplied && (cat === 'GLORY PACKAGE' || cat === 'MYSTERY BOX' || cat === 'HIRE BOTS')) {
      finalPkg.oldPrice = pkg.price;
      finalPkg.price = Math.ceil(pkg.price * 0.9);
    }

    // Apply PSDIS7 coupon: FF Weekly Membership → 145, Monthly Membership → 725
    if (isPsdis7Applied && selectedGame?.id === 'ff' && cat === 'MEMBERSHIP') {
      const psdis7Prices: Record<string, number> = {
        'ff-weekly-mem': 145,
        'ff-monthly-mem': 725,
      };
      if (psdis7Prices[pkg.id] !== undefined) {
        finalPkg.oldPrice = pkg.price;
        finalPkg.price = psdis7Prices[pkg.id];
      }
    }

    // Apply Ramadan coupon for Blood Strike
    if (isRamadanCouponApplied && selectedGame?.id === 'bs') {
      const ramadanPrices: Record<string, number> = {
        'bs-51': 43,
        'bs-105': 93,
        'bs-320': 275,
        'bs-540': 462,
        'bs-1100': 925,
        'bs-2260': 1835,
        'bs-5800': 4580,
        'bs-lup': 230,
        'bs-spe': 390,
        'bs-spp': 930,
        'bs-uslc': 58,
        'bs-lbw': 125
      };

      if (ramadanPrices[pkg.id]) {
        finalPkg.oldPrice = pkg.price;
        finalPkg.price = ramadanPrices[pkg.id];
      }
    }
    
    acc[cat].push(finalPkg);
    return acc;
  }, {} as Record<string, Package[]>);

  const categorySortOrder = ['MYSTERY BOX', 'GUILD LEVEL UP', 'GLORY PACKAGE', 'HIRE BOTS', 'DIAMOND TOPUP', 'MEMBERSHIP', 'LEVEL UP PASS', 'GENERAL'];
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
      onOpenLangPopup={() => setShowLangPopup(true)}
    >
      {announcement && <AnnouncementBanner message={announcement} />}
      {botMaintenance && (
        <div className="fixed inset-0 z-[999] bg-black/95 flex flex-col items-center justify-center gap-6 px-6 text-center">
          <div className="w-16 h-16 rounded-full bg-orange-600/20 border border-orange-600/40 flex items-center justify-center mb-2">
            <i className="fas fa-tools text-orange-500 text-2xl"></i>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">Under Maintenance</h1>
          <p className="text-zinc-400 text-sm max-w-xs">ADIXO Store is currently under maintenance. We'll be back shortly!</p>
          <a href="https://t.me/adixoglory" target="_blank" rel="noopener noreferrer" className="mt-2 px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white font-black text-sm rounded-xl transition-colors">
            <i className="fab fa-telegram mr-2"></i>Check Telegram for Updates
          </a>
        </div>
      )}
      {showMaintenance && <MaintenancePopup onClose={() => setShowMaintenance(false)} methodName={maintenanceMethod} />}
      {showDisclaimer && <DisclaimerPopup onClose={handleDisclaimerClose} />}
      {showServerIssue && <ServerIssuePopup onAgree={() => setShowServerIssue(false)} onAvoid={() => setShowServerIssue(false)} />}
      {showLangPopup && <LanguagePopup onClose={() => { setShowLangPopup(false); sessionStorage.setItem('adixo_lang_shown', '1'); }} />}
      <Confetti active={showConfetti} onDone={() => setShowConfetti(false)} />

      {activeTab === 'home' && (
        <div className="space-y-12 animate-in fade-in duration-700 relative z-10">

          {/* Slideshow Banner */}
          <HomeBanner initialSlide={activeBanner} />

          <section>
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h2 className="text-lg md:text-xl font-black text-white uppercase italic tracking-tighter flex items-center gap-2 md:gap-3">
                <span className="w-1 h-4 md:h-5 bg-orange-600 rounded-full"></span> 
                {t('home.topup')}
              </h2>
            </div>
            {filteredGames.length > 0 ? (
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2 md:gap-3">
                {filteredGames.filter(g => g.id !== 'pc-games' && g.id !== 'ai-bots' && g.id !== 'event-bypass' && g.id !== 'ff-panel' && g.id !== 'level-up' && g.id !== 'ff-likes' && g.id !== 'buy-guild').map(game => (
                  <GameCard key={game.id} game={game} onClick={(g) => { setSelectedGame(g); setActiveTab('games'); }} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 md:py-16 bg-zinc-900/20 border border-dashed border-zinc-800 rounded-2xl md:rounded-3xl">
                <i className="fas fa-search-minus text-zinc-700 text-2xl md:text-3xl mb-3 md:mb-4"></i>
                <p className="text-zinc-500 font-bold uppercase tracking-widest text-[8px] md:text-[10px]">{t('home.noMatches')}</p>
              </div>
            )}
          </section>

          <section className="relative">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h2 className="text-lg md:text-xl font-black text-white uppercase italic tracking-tighter flex items-center gap-2 md:gap-3">
                <span className="w-1 h-4 md:h-5 bg-orange-600 rounded-full"></span> 
                {t('home.tools')}
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              {/* Glory Bots card */}
              {(() => {
                const game = GAMES.find(g => g.id === 'ai-bots');
                const proBot = game?.packages.find(p => p.id === 'pro-bots');
                if (!proBot) return null;
                return (
                  <div 
                    key={proBot.id} 
                    className="group cursor-pointer bg-zinc-900 rounded-xl md:rounded-2xl overflow-hidden border border-orange-500/30 transition-all duration-500 shadow-2xl hover:-translate-y-2 hover:shadow-[0_20px_40px_-10px_rgba(249,115,22,0.3)] relative"
                    onClick={() => { setSelectedGame(game || null); setActiveTab('games'); }}
                  >
                    <div className="aspect-video overflow-hidden bg-zinc-950 relative">
                      <img 
                        src={'/images/glory-bots-cover.png'} 
                        alt={proBot.unit} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60 group-hover:opacity-100" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0e] via-[#0c0c0e]/40 to-transparent"></div>
                      <div className="absolute bottom-2 md:bottom-4 left-2 md:left-4 right-2 md:right-4">
                        <div className="flex items-center gap-1 md:gap-2 mb-0.5 md:mb-1">
                          <i className="fas fa-robot text-orange-500 text-[8px] md:text-[10px]"></i>
                          <p className="text-orange-500 text-[6px] md:text-[8px] font-black uppercase tracking-[0.3em]">{t('home.advancedAI')}</p>
                        </div>
                        <h3 className="text-white text-[10px] sm:text-xs md:text-base font-black uppercase italic tracking-tighter leading-tight group-hover:text-orange-400 transition-colors mb-0.5">
                          {proBot.unit}
                        </h3>
                        <p className="text-zinc-400 text-[5px] md:text-[7px] font-bold uppercase tracking-wide line-clamp-1">
                          {t('home.guildBotsDesc')}
                        </p>
                      </div>
                    </div>
                    <div className="p-2 md:p-3 bg-[#0c0c0e] border-t border-orange-500/10 flex items-center justify-between">
                      <span className="text-orange-500 font-black text-xs md:text-sm italic uppercase">{t('home.safe')}</span>
                      <div className="flex items-center gap-1.5 md:gap-2 bg-orange-600/10 px-2 py-1 md:px-3 md:py-1.5 rounded-lg group-hover:bg-orange-600 transition-all duration-300">
                        <span className="text-white font-black text-[8px] md:text-[10px] uppercase tracking-widest">{t('home.viewAll')}</span>
                        <i className="fas fa-arrow-right text-[8px] md:text-[10px] text-orange-500 group-hover:text-white group-hover:translate-x-1 transition-all"></i>
                      </div>
                    </div>
                  </div>
                );
              })()}
              {/* Event Bypass card */}
              {(() => {
                const ebGame = GAMES.find(g => g.id === 'event-bypass');
                if (!ebGame) return null;
                return (
                  <div
                    className="group cursor-pointer bg-zinc-900 rounded-xl md:rounded-2xl overflow-hidden border border-blue-500/30 transition-all duration-500 shadow-2xl hover:-translate-y-2 hover:shadow-[0_20px_40px_-10px_rgba(59,130,246,0.3)] relative"
                    onClick={() => { setSelectedGame(ebGame); setActiveTab('games'); }}
                  >
                    <div className="aspect-video overflow-hidden bg-zinc-950 relative">
                      <img
                        src="/images/event-bypass-cover.png"
                        alt="Event Bypass"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60 group-hover:opacity-100"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0e] via-[#0c0c0e]/40 to-transparent"></div>
                      <div className="absolute bottom-2 md:bottom-4 left-2 md:left-4 right-2 md:right-4">
                        <div className="flex items-center gap-1 md:gap-2 mb-0.5 md:mb-1">
                          <i className="fas fa-bolt text-blue-400 text-[8px] md:text-[10px]"></i>
                          <p className="text-blue-400 text-[6px] md:text-[8px] font-black uppercase tracking-[0.3em]">{t('home.eventService')}</p>
                        </div>
                        <h3 className="text-white text-[10px] sm:text-xs md:text-base font-black uppercase italic tracking-tighter leading-tight group-hover:text-blue-400 transition-colors mb-0.5">
                          EVENT BYPASS
                        </h3>
                        <p className="text-zinc-400 text-[5px] md:text-[7px] font-bold uppercase tracking-wide line-clamp-1">
                          {t('home.eventDesc')}
                        </p>
                      </div>
                    </div>
                    <div className="p-2 md:p-3 bg-[#0c0c0e] border-t border-blue-500/10 flex items-center justify-between">
                      <span className="text-blue-400 font-black text-xs md:text-sm italic uppercase">{t('home.active')}</span>
                      <div className="flex items-center gap-1.5 md:gap-2 bg-blue-600/10 px-2 py-1 md:px-3 md:py-1.5 rounded-lg group-hover:bg-blue-600 transition-all duration-300">
                        <span className="text-white font-black text-[8px] md:text-[10px] uppercase tracking-widest">{t('home.viewAll')}</span>
                        <i className="fas fa-arrow-right text-[8px] md:text-[10px] text-blue-400 group-hover:text-white group-hover:translate-x-1 transition-all"></i>
                      </div>
                    </div>
                  </div>
                );
              })()}
              {/* FF Panel card */}
              {(() => {
                const ffGame = GAMES.find(g => g.id === 'ff-panel');
                if (!ffGame) return null;
                return (
                  <div
                    className="group cursor-pointer bg-zinc-900 rounded-xl md:rounded-2xl overflow-hidden border border-emerald-500/30 transition-all duration-500 shadow-2xl hover:-translate-y-2 hover:shadow-[0_20px_40px_-10px_rgba(16,185,129,0.3)] relative"
                    onClick={() => { setSelectedGame(ffGame); setActiveTab('games'); }}
                  >
                    <div className="aspect-video overflow-hidden bg-zinc-950 relative">
                      <img
                        src="/images/ff-panel-cover.avif"
                        alt="FF Panel"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-70 group-hover:opacity-100"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0e] via-[#0c0c0e]/40 to-transparent"></div>
                      <div className="absolute bottom-2 md:bottom-4 left-2 md:left-4 right-2 md:right-4">
                        <div className="flex items-center gap-1 md:gap-2 mb-0.5 md:mb-1">
                          <i className="fas fa-terminal text-emerald-400 text-[8px] md:text-[10px]"></i>
                          <p className="text-emerald-400 text-[6px] md:text-[8px] font-black uppercase tracking-[0.3em]">{t('home.panelService')}</p>
                        </div>
                        <h3 className="text-white text-[10px] sm:text-xs md:text-base font-black uppercase italic tracking-tighter leading-tight group-hover:text-emerald-400 transition-colors mb-0.5">
                          FF PANEL
                        </h3>
                        <p className="text-zinc-400 text-[5px] md:text-[7px] font-bold uppercase tracking-wide line-clamp-1">
                          {t('home.panelDesc')}
                        </p>
                      </div>
                    </div>
                    <div className="p-2 md:p-3 bg-[#0c0c0e] border-t border-emerald-500/10 flex items-center justify-between">
                      <span className="text-emerald-400 font-black text-xs md:text-sm italic uppercase">{t('home.protected')}</span>
                      <div className="flex items-center gap-1.5 md:gap-2 bg-emerald-600/10 px-2 py-1 md:px-3 md:py-1.5 rounded-lg group-hover:bg-emerald-600 transition-all duration-300">
                        <span className="text-white font-black text-[8px] md:text-[10px] uppercase tracking-widest">{t('home.viewAll')}</span>
                        <i className="fas fa-arrow-right text-[8px] md:text-[10px] text-emerald-400 group-hover:text-white group-hover:translate-x-1 transition-all"></i>
                      </div>
                    </div>
                  </div>
                );
              })()}
              {/* Buy Guild card */}
              {(() => {
                const bgGame = GAMES.find(g => g.id === 'buy-guild');
                if (!bgGame) return null;
                return (
                  <div
                    className="group cursor-pointer bg-zinc-900 rounded-xl md:rounded-2xl overflow-hidden border border-amber-500/30 transition-all duration-500 shadow-2xl hover:-translate-y-2 hover:shadow-[0_20px_40px_-10px_rgba(245,158,11,0.35)] relative"
                    onClick={() => { setSelectedGame(bgGame); setActiveTab('games'); }}
                  >
                    <div className="aspect-video overflow-hidden bg-zinc-950 relative">
                      <img
                        src="/images/buy-guild-cover.png"
                        alt="Buy Guild"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-70 group-hover:opacity-100"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0e] via-[#0c0c0e]/40 to-transparent"></div>
                      <div className="absolute bottom-2 md:bottom-4 left-2 md:left-4 right-2 md:right-4">
                        <div className="flex items-center gap-1 md:gap-2 mb-0.5 md:mb-1">
                          <i className="fas fa-shield text-amber-400 text-[8px] md:text-[10px]"></i>
                          <p className="text-amber-400 text-[6px] md:text-[8px] font-black uppercase tracking-[0.3em]">GUILD SHOP</p>
                        </div>
                        <h3 className="text-white text-[10px] sm:text-xs md:text-base font-black uppercase italic tracking-tighter leading-tight group-hover:text-amber-400 transition-colors mb-0.5">
                          BUY GUILD
                        </h3>
                        <p className="text-zinc-400 text-[5px] md:text-[7px] font-bold uppercase tracking-wide line-clamp-1">
                          Pre-leveled, high-glory guilds
                        </p>
                      </div>
                    </div>
                    <div className="p-2 md:p-3 bg-[#0c0c0e] border-t border-amber-500/10 flex items-center justify-between">
                      <span className="text-amber-400 font-black text-xs md:text-sm italic uppercase">{t('home.safe')}</span>
                      <div className="flex items-center gap-1.5 md:gap-2 bg-amber-600/10 px-2 py-1 md:px-3 md:py-1.5 rounded-lg group-hover:bg-amber-600 transition-all duration-300">
                        <span className="text-white font-black text-[8px] md:text-[10px] uppercase tracking-widest">{t('home.viewAll')}</span>
                        <i className="fas fa-arrow-right text-[8px] md:text-[10px] text-amber-400 group-hover:text-white group-hover:translate-x-1 transition-all"></i>
                      </div>
                    </div>
                  </div>
                );
              })()}
              {/* Level Up card */}
              {(() => {
                const luGame = GAMES.find(g => g.id === 'level-up');
                if (!luGame) return null;
                return (
                  <div
                    className="group cursor-pointer bg-zinc-900 rounded-xl md:rounded-2xl overflow-hidden border border-violet-500/30 transition-all duration-500 shadow-2xl hover:-translate-y-2 hover:shadow-[0_20px_40px_-10px_rgba(139,92,246,0.35)] relative"
                    onClick={() => { setSelectedGame(luGame); setActiveTab('games'); }}
                  >
                    <div className="aspect-video overflow-hidden bg-zinc-950 relative flex items-center justify-center">
                      <img src="/level-up-bg.png" alt="Level Up" className="absolute inset-0 w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/30"></div>
                      {/* UPTO 50% OFF badge */}
                      <div className="absolute top-2 right-2 z-10 flex flex-col items-center justify-center rounded-xl px-2 py-1.5 md:px-2.5 md:py-2"
                        style={{
                          background: 'linear-gradient(135deg,#dc2626 0%,#ea580c 100%)',
                          boxShadow: '0 0 16px rgba(220,38,38,0.7), inset 0 1px 0 rgba(255,255,255,0.2)',
                          border: '1px solid rgba(255,255,255,0.15)',
                        }}>
                        <span className="text-yellow-300 font-black text-[10px] md:text-xs leading-none tracking-widest uppercase" style={{ textShadow: '0 0 8px rgba(253,224,71,0.8)' }}>
                          UPTO
                        </span>
                        <span className="text-white font-black text-sm md:text-base leading-none" style={{ textShadow: '0 0 10px rgba(255,255,255,0.5)' }}>
                          50%
                        </span>
                        <span className="text-yellow-300 font-black text-[9px] md:text-[10px] leading-none tracking-widest uppercase" style={{ textShadow: '0 0 8px rgba(253,224,71,0.8)' }}>
                          OFF
                        </span>
                      </div>
                      <div className="absolute top-3 right-3 flex gap-0.5 opacity-40 group-hover:opacity-70 transition-opacity">
                        {[1,2,3,4,5].map(i => (
                          <div key={i} className="w-0.5 bg-violet-400 rounded-full transition-all duration-300" style={{ height: `${8 + i * 4}px` }}></div>
                        ))}
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0e] via-transparent to-transparent"></div>
                      <div className="absolute bottom-2 md:bottom-4 left-2 md:left-4 right-2 md:right-4">
                        <div className="flex items-center gap-1 md:gap-2 mb-0.5 md:mb-1">
                          <i className="fas fa-chart-line text-violet-400 text-[8px] md:text-[10px]"></i>
                          <p className="text-violet-400 text-[6px] md:text-[8px] font-black uppercase tracking-[0.3em]">{t('home.rankBoost')}</p>
                        </div>
                        <h3 className="text-white text-[10px] sm:text-xs md:text-base font-black uppercase italic tracking-tighter leading-tight group-hover:text-violet-400 transition-colors mb-0.5">
                          LEVEL UP
                        </h3>
                        <p className="text-zinc-400 text-[5px] md:text-[7px] font-bold uppercase tracking-wide line-clamp-1">
                          {t('home.levelUpDesc')}
                        </p>
                      </div>
                    </div>
                    <div className="p-2 md:p-3 bg-[#0c0c0e] border-t border-violet-500/10 flex items-center justify-between">
                      <span className="text-violet-400 font-black text-xs md:text-sm italic uppercase">{t('home.premium')}</span>
                      <div className="flex items-center gap-1.5 md:gap-2 bg-violet-600/10 px-2 py-1 md:px-3 md:py-1.5 rounded-lg group-hover:bg-violet-600 transition-all duration-300">
                        <span className="text-white font-black text-[8px] md:text-[10px] uppercase tracking-widest">{t('home.viewAll')}</span>
                        <i className="fas fa-arrow-right text-[8px] md:text-[10px] text-violet-400 group-hover:text-white group-hover:translate-x-1 transition-all"></i>
                      </div>
                    </div>
                  </div>
                );
              })()}
              {/* FF Likes card */}
              {(() => {
                const flGame = GAMES.find(g => g.id === 'ff-likes');
                if (!flGame) return null;
                return (
                  <div
                    className="group cursor-pointer bg-zinc-900 rounded-xl md:rounded-2xl overflow-hidden border border-pink-500/30 transition-all duration-500 shadow-2xl hover:-translate-y-2 hover:shadow-[0_20px_40px_-10px_rgba(236,72,153,0.3)] relative"
                    onClick={() => { setSelectedGame(flGame); setActiveTab('games'); }}
                  >
                    <div className="aspect-video overflow-hidden bg-zinc-950 relative">
                      <img
                        src="/images/free-fire.webp"
                        alt="FF Likes"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-50 group-hover:opacity-80"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0e] via-[#0c0c0e]/40 to-transparent"></div>
                      <div className="absolute inset-0 bg-gradient-to-br from-pink-900/30 to-transparent"></div>
                      <div className="absolute top-2 right-2 z-10 flex items-center gap-1 bg-pink-600/80 backdrop-blur-sm px-2 py-1 rounded-lg border border-pink-400/30">
                        <i className="fas fa-heart text-white text-[8px] md:text-[10px]"></i>
                        <span className="text-white font-black text-[8px] md:text-[10px] uppercase tracking-widest">LIKES</span>
                      </div>
                      <div className="absolute bottom-2 md:bottom-4 left-2 md:left-4 right-2 md:right-4">
                        <div className="flex items-center gap-1 md:gap-2 mb-0.5 md:mb-1">
                          <i className="fas fa-heart text-pink-400 text-[8px] md:text-[10px]"></i>
                          <p className="text-pink-400 text-[6px] md:text-[8px] font-black uppercase tracking-[0.3em]">PROFILE BOOST</p>
                        </div>
                        <h3 className="text-white text-[10px] sm:text-xs md:text-base font-black uppercase italic tracking-tighter leading-tight group-hover:text-pink-400 transition-colors mb-0.5">
                          FF LIKES
                        </h3>
                        <p className="text-zinc-400 text-[5px] md:text-[7px] font-bold uppercase tracking-wide line-clamp-1">
                          220 LIKES/DAY · DAILY DELIVERY
                        </p>
                      </div>
                    </div>
                    <div className="p-2 md:p-3 bg-[#0c0c0e] border-t border-pink-500/10 flex items-center justify-between">
                      <span className="text-pink-400 font-black text-xs md:text-sm italic uppercase">BOOST</span>
                      <div className="flex items-center gap-1.5 md:gap-2 bg-pink-600/10 px-2 py-1 md:px-3 md:py-1.5 rounded-lg group-hover:bg-pink-600 transition-all duration-300">
                        <span className="text-white font-black text-[8px] md:text-[10px] uppercase tracking-widest">{t('home.viewAll')}</span>
                        <i className="fas fa-arrow-right text-[8px] md:text-[10px] text-pink-400 group-hover:text-white group-hover:translate-x-1 transition-all"></i>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h2 className="text-lg md:text-xl font-black text-white uppercase italic tracking-tighter flex items-center gap-2 md:gap-3">
                <span className="w-1 h-4 md:h-5 bg-orange-600 rounded-full"></span> 
                {t('home.pcGames')}
              </h2>
              <button 
                onClick={() => {
                  setSelectedGame(GAMES.find(g => g.id === 'pc-games') || null);
                  setActiveTab('games');
                }}
                className="text-orange-500 text-[8px] font-black uppercase tracking-widest hover:underline flex items-center gap-1.5 md:gap-2"
              >
                {t('home.viewAll')} <i className="fas fa-chevron-right text-[5px] md:text-[6px]"></i>
              </button>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-3">
              {GAMES.find(g => g.id === 'pc-games')?.packages
                .filter(pkg => {
                  const name = pkg.unit.toLowerCase();
                  return name.includes('grand theft auto 5') || 
                         name.includes('forza horizon 5') || 
                         name.includes('rdr 2') || 
                         name.includes('spider-man 2') || 
                         name.includes('fc™ 26') || 
                         name.includes('cyberpunk 2077');
                })
                .slice(0, 6)
                .map((pkg, idx) => {
                  const allPkgs = GAMES.find(g => g.id === 'pc-games')?.packages || [];
                  const baseIdx = allPkgs.findIndex(p => p.id === pkg.id);
                  
                  let imageSrc = pkg.image || `/images/pc-game-${baseIdx + 1}.png`;
                  
                  return (
                    <div 
                      key={pkg.id} 
                      className="game-card group cursor-pointer bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800 transition-all duration-300 shadow-sm" 
                      onClick={() => { setSelectedGame(GAMES.find(g => g.id === 'pc-games') || null); setSelectedPackage(pkg); setActiveTab('games'); }}
                    >
                      <div className="aspect-[3/4] overflow-hidden relative">
                        <div className="absolute top-1 right-1 z-20 bg-red-600 text-white text-[4px] md:text-[5px] font-black px-1 py-0.5 rounded-full uppercase tracking-tighter border border-red-500/50">
                          30% OFF
                        </div>
                        <img src={imageSrc} alt={pkg.unit} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                        <div className="absolute bottom-1.5 left-1.5 right-1.5">
                          <p className="text-orange-400 text-[5px] md:text-[7px] font-black uppercase tracking-widest mb-0.5">PC GAMES</p>
                          <h3 className="text-white text-[8px] md:text-[10px] font-black uppercase italic tracking-tighter leading-none truncate group-hover:text-orange-300 transition-colors">
                            {pkg.unit}
                          </h3>
                        </div>
                      </div>
                      <div className="p-1.5 flex items-center justify-between bg-zinc-900">
                        <div className="flex items-center gap-1">
                          <span className="text-orange-500 font-black text-[8px] md:text-[10px] italic">৳{pkg.price}</span>
                          {pkg.oldPrice && <span className="text-zinc-500 text-[6px] md:text-[7px] line-through">৳{pkg.oldPrice}</span>}
                        </div>
                        <i className="fas fa-chevron-right text-[6px] text-zinc-600 group-hover:text-orange-500 transition-colors"></i>
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
                  setSelectedServer(null);
                  setSelectedPayment(null);
                  setActiveTab('home');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="mb-8 text-zinc-500 hover:text-white flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors"
              >
                <i className="fas fa-arrow-left"></i> {t('games.back')}
              </button>
              
              <div className="grid lg:grid-cols-3 gap-12">
                <div className="lg:col-span-1 space-y-8">
                    <div className="bg-zinc-900 rounded-xl md:rounded-[2rem] p-4 md:p-6 border border-zinc-800 shadow-xl overflow-hidden relative">
                    {selectedGame.banner && <img src={selectedGame.banner} alt={selectedGame.name} className="absolute top-0 left-0 w-full h-full object-cover opacity-20 grayscale" />}
                    <div className="relative pt-4 md:pt-8">
                      <div className="flex items-center gap-3 md:block">
                        <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl overflow-hidden border-2 border-orange-500 md:mb-4 shadow-xl shadow-orange-500/20 bg-zinc-950 flex-shrink-0">
                          <img 
                             src={selectedGame.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedGame.name)}&background=18181b&color=f97316&bold=true`} 
                             alt={selectedGame.name} 
                             className="w-full h-full object-cover" 
                             onError={(e) => {
                               (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedGame.name)}&background=18181b&color=f97316&bold=true`;
                             }}
                          />
                        </div>
                        <div>
                          <h2 className="text-lg md:text-2xl font-black text-white uppercase italic tracking-tighter mb-0.5 md:mb-1">{selectedGame.name}</h2>
                          <p className="text-orange-400 text-[10px] font-bold tracking-wide">{selectedGame.description}</p>
                        </div>
                      </div>
                      <p className="hidden md:block text-zinc-400 text-xs leading-relaxed mt-4">{selectedGame.category}</p>
                    </div>
                  </div>

                  <div className="space-y-4 px-2">
                    <h3 className="text-xl font-bold text-white">
                      {selectedGame.id === 'pc-games' || selectedGame.id === 'ff-panel' ? t('game.emailWhatsapp') : selectedGame.id === 'ai-bots' ? t('game.guildId') : t('game.playerId')}
                    </h3>
                    <div className="relative group">
                      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-orange-500 transition-colors">
                        <i className={`fas ${selectedGame.id === 'pc-games' || selectedGame.id === 'ff-panel' ? 'fa-envelope' : selectedGame.id === 'ai-bots' ? 'fa-users' : 'fa-gamepad'} text-xl`}></i>
                      </div>
                      <input 
                        type="text" 
                        value={playerId}
                        onChange={(e) => setPlayerId(e.target.value)}
                        placeholder={selectedGame.id === 'pc-games' || selectedGame.id === 'ff-panel' ? t('game.enterEmail') : selectedGame.id === 'ai-bots' ? t('game.enterGuildId') : selectedGame.idPlaceholder}
                        className="w-full bg-[#0d0d0f] border border-zinc-800/60 rounded-xl pl-14 pr-5 py-5 text-white font-medium focus:outline-none focus:border-orange-500 transition-all shadow-sm"
                      />
                    </div>
                    

                    {(selectedGame.id === 'pc-games' || selectedGame.id === 'ff-panel') && (
                      <p className="text-orange-500/80 text-[10px] font-medium italic mt-2 px-1">
                        {selectedGame.id === 'ff-panel' ? t('game.panelNote') : t('game.pcNote')}
                      </p>
                    )}
                  </div>
                </div>

                <div className="lg:col-span-2 space-y-10">
                  {selectedGame.id === 'level-up' ? (
                  <div className="space-y-2.5">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{background:'linear-gradient(135deg,rgba(139,92,246,0.25),rgba(99,102,241,0.1))',border:'1px solid rgba(139,92,246,0.35)'}}>
                        <i className="fas fa-arrow-up text-violet-400 text-xs"></i>
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-white uppercase tracking-widest">{t('levelup.header')}</h3>
                        <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">{t('levelup.subtitle')}</p>
                      </div>
                    </div>

                    {selectedGame.packages.map((pkg, idx) => {
                      const isSelected = selectedPackage?.id === pkg.id;
                      const tiers = [
                        {
                          label: 'STARTER', icon: 'fa-seedling', discount: 15,
                          labelColor: '#7dd3fc', priceColor: '#7dd3fc',
                          border: isSelected ? 'rgba(56,189,248,0.7)' : 'rgba(56,189,248,0.2)',
                          bg: 'linear-gradient(120deg,rgba(12,20,40,0.95) 0%,rgba(7,30,55,0.9) 100%)',
                          blob1: 'rgba(56,189,248,0.12)', blob2: 'rgba(14,165,233,0.07)',
                          glow: isSelected ? '0 0 22px rgba(56,189,248,0.3)' : '0 2px 12px rgba(0,0,0,0.5)',
                          badge: { bg: '#0c1a2e', text: '#7dd3fc', border: 'rgba(56,189,248,0.3)' },
                          stars: false, pulse: false,
                        },
                        {
                          label: 'BRONZE', icon: 'fa-medal', discount: 20,
                          labelColor: '#fb923c', priceColor: '#fdba74',
                          border: isSelected ? 'rgba(251,146,60,0.8)' : 'rgba(251,146,60,0.25)',
                          bg: 'linear-gradient(120deg,rgba(25,12,5,0.97) 0%,rgba(40,18,6,0.93) 100%)',
                          blob1: 'rgba(251,146,60,0.14)', blob2: 'rgba(234,88,12,0.08)',
                          glow: isSelected ? '0 0 24px rgba(251,146,60,0.35)' : '0 2px 12px rgba(0,0,0,0.5)',
                          badge: { bg: '#1e0e04', text: '#fb923c', border: 'rgba(251,146,60,0.3)' },
                          stars: false, pulse: false,
                        },
                        {
                          label: 'SILVER', icon: 'fa-shield-alt', discount: 25,
                          labelColor: '#e2e8f0', priceColor: '#f1f5f9',
                          border: isSelected ? 'rgba(226,232,240,0.7)' : 'rgba(226,232,240,0.2)',
                          bg: 'linear-gradient(120deg,rgba(15,20,28,0.97) 0%,rgba(22,28,40,0.93) 100%)',
                          blob1: 'rgba(200,210,230,0.1)', blob2: 'rgba(148,163,184,0.07)',
                          glow: isSelected ? '0 0 26px rgba(226,232,240,0.25)' : '0 2px 12px rgba(0,0,0,0.5)',
                          badge: { bg: '#111827', text: '#cbd5e1', border: 'rgba(203,213,225,0.3)' },
                          stars: false, pulse: false,
                        },
                        {
                          label: 'GOLD', icon: 'fa-crown', discount: 28,
                          labelColor: '#fbbf24', priceColor: '#fde68a',
                          border: isSelected ? 'rgba(251,191,36,0.85)' : 'rgba(251,191,36,0.3)',
                          bg: 'linear-gradient(120deg,rgba(24,16,0,0.97) 0%,rgba(40,25,0,0.93) 100%)',
                          blob1: 'rgba(251,191,36,0.18)', blob2: 'rgba(245,158,11,0.1)',
                          glow: isSelected ? '0 0 30px rgba(251,191,36,0.4)' : '0 2px 12px rgba(0,0,0,0.5)',
                          badge: { bg: '#1c1100', text: '#fbbf24', border: 'rgba(251,191,36,0.4)' },
                          stars: false, pulse: false,
                        },
                        {
                          label: 'PLATINUM', icon: 'fa-gem', discount: 30,
                          labelColor: '#22d3ee', priceColor: '#67e8f9',
                          border: isSelected ? 'rgba(34,211,238,0.8)' : 'rgba(34,211,238,0.3)',
                          bg: 'linear-gradient(120deg,rgba(0,18,28,0.97) 0%,rgba(0,30,45,0.95) 100%)',
                          blob1: 'rgba(34,211,238,0.18)', blob2: 'rgba(6,182,212,0.1)',
                          glow: isSelected ? '0 0 35px rgba(34,211,238,0.45)' : '0 2px 14px rgba(0,0,0,0.6)',
                          badge: { bg: '#001620', text: '#22d3ee', border: 'rgba(34,211,238,0.4)' },
                          stars: true, pulse: false,
                        },
                        {
                          label: 'DIAMOND', icon: 'fa-star', discount: 35,
                          labelColor: '#a78bfa', priceColor: '#c4b5fd',
                          border: isSelected ? 'rgba(167,139,250,0.9)' : 'rgba(167,139,250,0.35)',
                          bg: 'linear-gradient(120deg,rgba(10,5,30,0.98) 0%,rgba(20,8,50,0.96) 100%)',
                          blob1: 'rgba(139,92,246,0.22)', blob2: 'rgba(99,102,241,0.14)',
                          glow: isSelected ? '0 0 40px rgba(139,92,246,0.55)' : '0 2px 16px rgba(0,0,0,0.6)',
                          badge: { bg: '#0d0520', text: '#a78bfa', border: 'rgba(167,139,250,0.45)' },
                          stars: true, pulse: false,
                        },
                        {
                          label: 'LEGEND', icon: 'fa-fire', discount: 40,
                          labelColor: '#f87171', priceColor: '#fca5a5',
                          border: isSelected ? 'rgba(248,113,113,0.95)' : 'rgba(248,113,113,0.4)',
                          bg: 'linear-gradient(120deg,rgba(25,5,5,0.98) 0%,rgba(45,5,5,0.97) 100%)',
                          blob1: 'rgba(248,113,113,0.25)', blob2: 'rgba(239,68,68,0.15)',
                          glow: isSelected ? '0 0 50px rgba(248,113,113,0.6)' : '0 2px 18px rgba(0,0,0,0.7)',
                          badge: { bg: '#1a0505', text: '#f87171', border: 'rgba(248,113,113,0.5)' },
                          stars: true, pulse: false,
                        },
                        {
                          label: 'SUPREME', icon: 'fa-infinity', discount: 50,
                          labelColor: '#fde047', priceColor: '#fef08a',
                          border: isSelected ? 'rgba(253,224,71,1)' : 'rgba(253,224,71,0.45)',
                          bg: 'linear-gradient(120deg,rgba(20,15,0,0.99) 0%,rgba(35,25,0,0.98) 100%)',
                          blob1: 'rgba(253,224,71,0.28)', blob2: 'rgba(234,179,8,0.18)',
                          glow: isSelected ? '0 0 60px rgba(253,224,71,0.7)' : '0 2px 20px rgba(0,0,0,0.8)',
                          badge: { bg: '#1a1200', text: '#fde047', border: 'rgba(253,224,71,0.6)' },
                          stars: true, pulse: true,
                        },
                      ];
                      const t = tiers[idx] || tiers[0];
                      const parts = pkg.unit.replace('Level ', '').split(' → ');
                      const fromLvl = parts[0];
                      const toLvl = parts[1];
                      return (
                        <button
                          key={pkg.id}
                          onClick={() => setSelectedPackage(pkg)}
                          className="w-full text-left group relative overflow-hidden rounded-2xl transition-all duration-400"
                          style={{
                            background: t.bg,
                            border: `1px solid ${t.border}`,
                            boxShadow: t.glow,
                            transition: 'all 0.35s ease',
                          }}
                        >
                          {/* Ambient blob 1 */}
                          <div className="absolute pointer-events-none" style={{
                            top: '-20%', left: '-5%', width: '55%', height: '160%',
                            background: `radial-gradient(ellipse, ${t.blob1} 0%, transparent 70%)`,
                          }} />
                          {/* Ambient blob 2 */}
                          <div className="absolute pointer-events-none" style={{
                            bottom: '-30%', right: '10%', width: '45%', height: '140%',
                            background: `radial-gradient(ellipse, ${t.blob2} 0%, transparent 70%)`,
                          }} />
                          {/* Star particles for premium tiers */}
                          {t.stars && (
                            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                              {[{x:'15%',y:'25%',s:'1.5px'},{x:'35%',y:'70%',s:'1px'},{x:'60%',y:'20%',s:'2px'},{x:'80%',y:'60%',s:'1px'},{x:'90%',y:'30%',s:'1.5px'}].map((p,i) => (
                                <div key={i} className={t.pulse ? 'animate-ping' : 'animate-pulse'} style={{
                                  position:'absolute', left:p.x, top:p.y,
                                  width:p.s, height:p.s, borderRadius:'50%',
                                  background: t.labelColor, opacity: 0.5,
                                  animationDelay: `${i * 0.4}s`, animationDuration: '2.5s',
                                }} />
                              ))}
                            </div>
                          )}
                          {/* Shine line on hover */}
                          <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                            style={{ background: `linear-gradient(105deg, transparent 35%, ${t.blob1} 50%, transparent 65%)` }} />

                          {/* TOP badge */}
                          {pkg.isPopular && (
                            <div className="absolute top-0 right-0 z-20 text-[7px] font-black px-2.5 py-1 rounded-bl-xl uppercase tracking-widest"
                              style={{ background: t.labelColor, color: '#000' }}>
                              ★ TOP
                            </div>
                          )}

                          <div className="relative z-10 flex items-center px-4 py-3">
                            {/* Tier badge */}
                            <div className="flex-shrink-0 w-10 h-10 rounded-xl flex flex-col items-center justify-center mr-4 transition-transform duration-300 group-hover:scale-110"
                              style={{ background: t.badge.bg, border: `1px solid ${t.badge.border}` }}>
                              <i className={`fas ${t.icon} text-sm`} style={{ color: t.labelColor }}></i>
                            </div>

                            {/* Label + levels */}
                            <div className="flex-1 min-w-0">
                              <p className="text-[8px] font-black uppercase tracking-[0.25em] mb-0.5" style={{ color: t.labelColor }}>{t.label}</p>
                              <div className="flex items-center gap-1.5">
                                <span className="text-white font-black text-[11px]">Lv. {fromLvl}</span>
                                <svg width="16" height="8" viewBox="0 0 16 8" className="opacity-50"><path d="M0 4h12M9 1l3 3-3 3" stroke={t.labelColor} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                <span className="font-black text-[11px]" style={{ color: t.labelColor }}>Lv. {toLvl}</span>
                              </div>
                            </div>

                            {/* Price */}
                            <div className="flex items-center gap-3 flex-shrink-0">
                              <div className="text-right">
                                {/* Discount badge + original price */}
                                <div className="flex items-center gap-1.5 justify-end mb-0.5">
                                  <span className="text-[8px] font-black px-1.5 py-0.5 rounded-md"
                                    style={{ background: 'rgba(34,197,94,0.15)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.3)' }}>
                                    -{t.discount}%
                                  </span>
                                  <span className="text-[10px] text-zinc-600 line-through font-bold">
                                    ৳{pkg.price.toLocaleString()}
                                  </span>
                                </div>
                                {/* Discounted price */}
                                <span className="font-black text-lg leading-none" style={{ color: t.priceColor, textShadow: `0 0 14px ${t.blob1}` }}>
                                  ৳{Math.round(pkg.price * (1 - t.discount / 100)).toLocaleString()}
                                </span>
                              </div>
                              {/* Selector circle */}
                              <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300"
                                style={{
                                  border: `1.5px solid ${isSelected ? t.labelColor : 'rgba(255,255,255,0.15)'}`,
                                  background: isSelected ? t.labelColor : 'transparent',
                                }}>
                                {isSelected && <i className="fas fa-check text-black text-[7px]"></i>}
                              </div>
                            </div>
                          </div>

                          {/* Bottom glow strip */}
                          <div className="h-[1.5px] w-full transition-all duration-500"
                            style={{ background: isSelected ? `linear-gradient(90deg, transparent, ${t.labelColor}, transparent)` : 'transparent' }} />
                        </button>
                      );
                    })}

                    {/* Footer note */}
                    <div className="mt-3 px-4 py-3 rounded-xl flex items-center gap-2.5"
                      style={{ background: 'rgba(139,92,246,0.05)', border: '1px solid rgba(139,92,246,0.12)' }}>
                      <i className="fas fa-shield-alt text-violet-400 text-[10px] flex-shrink-0"></i>
                      <p className="text-zinc-500 text-[9px] font-bold uppercase tracking-wide leading-relaxed">
                        100% safe · access token process · delivery within 24–72 hrs · support @AdiXO_TV
                      </p>
                    </div>
                  </div>
                  ) : selectedGame.id === 'ff-panel' ? (
                    <div className="space-y-2">
                      {selectedGame.packages.map(pkg => (
                        <button
                          key={pkg.id}
                          onClick={() => { setFfPanelPopupPkg(pkg); setFfPanelTierIdx(0); }}
                          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all duration-200 text-left group ${
                            selectedPackage?.id === pkg.id
                              ? 'bg-orange-500/10 border-orange-500 text-white'
                              : 'bg-zinc-900/60 border-zinc-800/60 hover:border-emerald-500/50 hover:bg-zinc-900'
                          }`}
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <i className={`fas fa-terminal text-[10px] flex-shrink-0 ${selectedPackage?.id === pkg.id ? 'text-orange-500' : 'text-emerald-500/60 group-hover:text-emerald-400'}`}></i>
                            <span className={`text-[11px] font-black uppercase tracking-wide ${selectedPackage?.id === pkg.id ? 'text-white' : 'text-zinc-300 group-hover:text-white'}`}>{pkg.unit}</span>
                          </div>
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 transition-all ${selectedPackage?.id === pkg.id ? 'border-orange-500 bg-orange-500' : 'border-zinc-700 group-hover:border-emerald-500'}`}>
                            {selectedPackage?.id === pkg.id && <i className="fas fa-check text-black text-[6px]"></i>}
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : selectedGame.id === 'ai-bots' ? (
                    <div className="space-y-12">
                      {sortedCategoryKeys.map(category => (
                        <div key={category} className="space-y-6">
                          <h3 className="text-sm font-black text-orange-500 uppercase tracking-[0.3em] flex items-center gap-3">
                            <span className="w-8 h-[1px] bg-orange-500/30"></span>
                            {category}
                            <span className="w-8 h-[1px] bg-orange-500/30"></span>
                          </h3>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {groupedPackages[category].map((pkg) => {
                              const isMystery = category === 'MYSTERY BOX';
                              const isGuildLevelUp = category === 'GUILD LEVEL UP';
                              const isGloryPackage = category === 'GLORY PACKAGE';
                              const isBonus = !!pkg.isBonus;
                              const isHireBots = category === 'HIRE BOTS';
                              const isMysteryBasicStockOut = pkg.id === 'mystery-basic';
                              const isGloryOffer = (isMystery || isGuildLevelUp || isGloryPackage) && !isMysteryBasicStockOut && !isBonus;
                              const mysteryTheme = pkg.id === 'mystery-basic' ? { border: 'border-sky-500/30', hover: 'hover:border-sky-500/60', icon: 'text-sky-400', iconBg: 'border-sky-500/50', glow: 'shadow-[0_0_20px_rgba(14,165,233,0.15)]' } :
                                                   pkg.id === 'mystery-epic' ? { border: 'border-red-500/30', hover: 'hover:border-red-500/60', icon: 'text-red-400', iconBg: 'border-red-500/50', glow: 'shadow-[0_0_20px_rgba(239,68,68,0.15)]' } :
                                                   pkg.id === 'mystery-super' ? { border: 'border-purple-500/30', hover: 'hover:border-purple-500/60', icon: 'text-purple-400', iconBg: 'border-purple-500/50', glow: 'shadow-[0_0_20px_rgba(168,85,247,0.15)]' } :
                                                   isBonus ? { border: 'border-amber-400/50', hover: 'hover:border-amber-400/80', icon: 'text-amber-400', iconBg: 'border-amber-400/50', glow: 'shadow-[0_0_28px_rgba(251,191,36,0.25)]' } :
                                                   isGuildLevelUp ? { border: 'border-emerald-500/30', hover: 'hover:border-emerald-500/60', icon: 'text-emerald-400', iconBg: 'border-emerald-500/40', glow: '' } :
                                                   isHireBots ? { border: 'border-orange-500/40', hover: 'hover:border-orange-400/70', icon: 'text-orange-400', iconBg: 'border-orange-500/40', glow: 'shadow-[0_0_24px_rgba(249,115,22,0.2)]' } :
                                                   { border: 'border-zinc-800/50', hover: 'hover:border-orange-500/50', icon: 'text-orange-500', iconBg: 'border-zinc-800', glow: '' };

                              return (
                                <div 
                                  key={pkg.id} 
                                  className={`relative group rounded-xl overflow-hidden border transition-all duration-500 ${
                                    isMysteryBasicStockOut ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
                                  } ${
                                    isBonus ? 'bg-gradient-to-br from-amber-950/40 via-zinc-900/80 to-zinc-900' : isHireBots ? 'bg-gradient-to-br from-orange-950/30 via-zinc-900/80 to-zinc-900' : 'bg-zinc-900/40'
                                  } ${mysteryTheme.border} ${!isMysteryBasicStockOut ? mysteryTheme.hover : ''} ${selectedPackage?.id === pkg.id ? 'ring-2 ring-orange-500 bg-zinc-900/80 scale-[1.02]' : ''} ${isMystery ? mysteryTheme.glow : ''} ${isBonus ? mysteryTheme.glow : ''} ${isHireBots ? mysteryTheme.glow : ''}`}
                                  onClick={() => {
                                    if (isMysteryBasicStockOut) {
                                      setStockOutToast('BASIC MYSTERY');
                                      setTimeout(() => setStockOutToast(null), 6000);
                                    } else {
                                      setSelectedPackage(pkg);
                                    }
                                  }}
                                >
                                  {isMysteryBasicStockOut && (
                                    <div className="absolute top-0 left-0 bg-red-600 text-white text-[7px] font-black px-2 py-0.5 rounded-br-lg uppercase tracking-widest z-10 flex items-center gap-1">
                                      <i className="fas fa-ban text-[6px]"></i> {t('product.stockOut')}
                                    </div>
                                  )}
                                  {pkg.isPopular && !isMysteryBasicStockOut && (
                                    <div className="absolute top-0 right-0 bg-orange-500 text-black text-[7px] font-black px-2 py-0.5 rounded-bl-lg uppercase tracking-widest z-10">
                                      {t('product.best')}
                                    </div>
                                  )}

                                  {/* Gift ribbon for bonus package */}
                                  {isBonus && (
                                    <>
                                      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-amber-500 via-yellow-300 to-amber-500 z-10"></div>
                                      <div className="absolute top-0 left-0 bg-amber-400 text-black text-[6px] font-black px-2 py-0.5 rounded-br-lg uppercase tracking-widest z-10">
                                        {t('product.bonus')}
                                      </div>
                                    </>
                                  )}

                                  {/* 100% BONUS floating pill for all eligible packages */}
                                  {(isHireBots || isGloryOffer) && (
                                    <div className="absolute top-2 left-2 z-20 flex items-center gap-0.5 px-2 py-[3px] rounded-full text-white text-[6px] font-black uppercase tracking-widest whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #7c3aed, #db2777)', boxShadow: '0 0 10px rgba(168,85,247,0.5)' }}>
                                      <i className="fas fa-star text-[5px] text-yellow-300"></i>
                                      100% BONUS
                                      <i className="fas fa-star text-[5px] text-yellow-300"></i>
                                    </div>
                                  )}
                                  
                                  <div className="p-2.5 flex flex-col items-center text-center">
                                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2 border transition-all duration-500 group-hover:scale-110 ${
                                      isBonus ? 'bg-amber-950/60' : 'bg-zinc-950/80'
                                    } ${mysteryTheme.iconBg} ${isMystery ? 'group-hover:rotate-12 shadow-inner' : ''} ${isBonus ? 'group-hover:rotate-6 group-hover:scale-110' : ''}`}>
                                      <i className={`fas ${
                                        isBonus ? 'fa-gift' :
                                        isGuildLevelUp ? 'fa-arrow-up' :
                                        category === 'FF PANEL' ? 'fa-terminal' :
                                        pkg.id.includes('regional') ? (pkg.id.includes('elite') ? 'fa-globe' : pkg.id.includes('master') ? 'fa-trophy' : 'fa-shield-alt') :
                                        isMystery ? 'fa-box-open' : 'fa-robot'
                                      } text-sm ${mysteryTheme.icon} ${isMystery ? 'animate-pulse' : ''} ${isBonus ? 'animate-bounce' : ''}`}></i>
                                    </div>
                                    
                                    <h3 className={`text-[9px] font-black uppercase tracking-tight mb-0.5 ${isMystery ? 'tracking-[0.1em]' : ''} ${isBonus ? 'text-amber-300' : 'text-white'}`}>{pkg.unit}</h3>
                                    <p className="text-zinc-500 text-[7px] font-bold uppercase tracking-widest mb-2 line-clamp-1">{pkg.description}</p>
                                    
                                    <div className="flex items-baseline gap-1 mb-2">
                                      <span className={`text-base font-black ${isBonus ? 'text-amber-300' : 'text-white'}`}>{pkg.price}</span>
                                      <span className="text-orange-500 font-black text-[10px] italic">{pkg.currency === 'USD' ? '$' : '৳'}</span>
                                      {pkg.oldPrice && <span className="text-zinc-500 text-[8px] line-through decoration-red-500/50 italic ml-1">
                                        {pkg.currency === 'USD' ? '$' : '৳'}{pkg.oldPrice}
                                      </span>}
                                    </div>
                                    

                                    <div className="space-y-1 w-full mb-2">
                                      {category === 'FF PANEL' ? (
                                        <>
                                          <div className="flex items-center gap-1.5 text-[8px] font-bold text-zinc-500 uppercase">
                                            <i className="fas fa-check text-green-500/70 text-[6px]"></i>
                                            <span>Instant Delivery</span>
                                          </div>
                                          <div className="flex items-center gap-1.5 text-[8px] font-bold text-zinc-500 uppercase">
                                            <i className="fas fa-check text-green-500/70 text-[6px]"></i>
                                            <span>Panel Access</span>
                                          </div>
                                        </>
                                      ) : isGuildLevelUp ? (
                                        <>
                                          <div className="flex items-center gap-1.5 text-[8px] font-bold text-zinc-500 uppercase">
                                            <i className={`fas fa-check ${mysteryTheme.icon} text-[6px]`}></i>
                                            <span>Guild Level {pkg.amount} Boost</span>
                                          </div>
                                          {isBonus && (
                                            <div className="flex items-center gap-1.5 text-[8px] font-bold text-amber-500/80 uppercase">
                                              <i className="fas fa-gift text-amber-400 text-[6px]"></i>
                                              <span>4 Week Glory Bonus</span>
                                            </div>
                                          )}
                                        </>
                                      ) : pkg.id.includes('regional') ? (
                                        <>
                                          <div className="flex items-center gap-1.5 text-[8px] font-bold text-zinc-500 uppercase">
                                            <i className="fas fa-check text-green-500/70 text-[6px]"></i>
                                            <span>{pkg.id.includes('grandmaster') ? 'Lvl 7 Boost' : 'Lvl 6 Boost'}</span>
                                          </div>
                                          <div className="flex items-center gap-1.5 text-[8px] font-bold text-zinc-500 uppercase">
                                            <i className="fas fa-check text-green-500/70 text-[6px]"></i>
                                            <span>Top {pkg.id.includes('elite') ? '100' : pkg.id.includes('master') ? '50' : '30'} Rank</span>
                                          </div>
                                        </>
                                      ) : (
                                        <>
                                          <div className="flex items-center gap-1.5 text-[8px] font-bold text-zinc-500 uppercase">
                                            <i className={`fas fa-check ${isMystery ? mysteryTheme.icon : 'text-green-500/70'} text-[6px]`}></i>
                                            <span>{pkg.amount} Bots</span>
                                          </div>
                                          <div className="flex items-center gap-1.5 text-[8px] font-bold text-zinc-500 uppercase">
                                            <i className={`fas fa-check ${isMystery ? mysteryTheme.icon : 'text-green-500/70'} text-[6px]`}></i>
                                            <span>{
                                              pkg.id === 'mystery-basic' ? '50k - 370k glory' :
                                              pkg.id === 'mystery-epic' ? '350k - 1.2M glory' :
                                              pkg.id === 'mystery-super' ? '1.2M - 3.4M glory' :
                                              '7 Days'
                                            }</span>
                                          </div>
                                        </>
                                      )}
                                      <div className="flex items-center gap-1.5 text-[8px] font-bold text-zinc-500 uppercase">
                                        <i className={`fas fa-check ${isMystery ? mysteryTheme.icon : isBonus ? 'text-amber-400' : 'text-green-500/70'} text-[6px]`}></i>
                                        <span>100% Safe</span>
                                      </div>
                                    </div>
                                    
                                    <div className={`w-full py-1.5 rounded-lg font-black uppercase tracking-widest text-[7px] transition-all duration-300 ${
                                      isMysteryBasicStockOut
                                        ? 'bg-red-950/50 text-red-500 cursor-not-allowed'
                                        : selectedPackage?.id === pkg.id
                                        ? 'bg-orange-500 text-black shadow-lg shadow-orange-500/40'
                                        : isBonus
                                        ? 'bg-amber-900/40 text-amber-400 group-hover:bg-amber-500/20 group-hover:text-amber-300'
                                        : 'bg-zinc-800/50 text-zinc-400 group-hover:bg-zinc-800 group-hover:text-white'
                                    }`}>
                                      {isMysteryBasicStockOut ? <><i className="fas fa-ban text-[6px] mr-1"></i>STOCK OUT</> : selectedPackage?.id === pkg.id ? 'READY TO ORDER' : isBonus ? 'CLAIM GIFT' : 'SELECT BOX'}
                                    </div>
                                  </div>

                                  {/* Special Mystery Box Overlay Effects */}
                                  {isMystery && (
                                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none bg-gradient-to-br ${
                                      pkg.id === 'mystery-basic' ? 'from-sky-500 to-transparent' :
                                      pkg.id === 'mystery-epic' ? 'from-red-500 to-transparent' :
                                      'from-purple-500 to-transparent'
                                    }`}></div>
                                  )}
                                  {/* Gift shimmer effect */}
                                  {isBonus && (
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none bg-gradient-to-br from-amber-400 to-transparent"></div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : selectedGame.id === 'buy-guild' ? (
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{background:'linear-gradient(135deg,rgba(245,158,11,0.25),rgba(217,119,6,0.1))',border:'1px solid rgba(245,158,11,0.35)'}}>
                          <i className="fas fa-shield text-amber-400 text-xs"></i>
                        </div>
                        <div>
                          <h3 className="text-sm font-black text-white uppercase tracking-widest">Available Guild</h3>
                          <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Verified · Instant Ownership Transfer</p>
                        </div>
                      </div>

                      {selectedGame.packages.map(pkg => {
                        const isSelected = selectedPackage?.id === pkg.id;
                        return (
                          <div
                            key={pkg.id}
                            className="relative rounded-2xl md:rounded-[1.75rem] overflow-hidden border shadow-2xl"
                            style={{
                              borderColor: isSelected ? 'rgba(245,158,11,0.7)' : 'rgba(245,158,11,0.25)',
                              background: 'linear-gradient(135deg, rgba(24,20,10,0.98) 0%, rgba(10,10,12,0.98) 60%)',
                              boxShadow: isSelected ? '0 0 40px rgba(245,158,11,0.15)' : '0 10px 40px -10px rgba(0,0,0,0.6)'
                            }}
                          >
                            {pkg.isPopular && (
                              <div className="absolute top-4 right-4 z-20 flex items-center gap-1 px-3 py-1 rounded-full text-black text-[8px] font-black uppercase tracking-widest" style={{ background: 'linear-gradient(135deg,#fbbf24,#f59e0b)', boxShadow: '0 0 15px rgba(245,158,11,0.5)' }}>
                                <i className="fas fa-star text-[7px]"></i> PREMIUM
                              </div>
                            )}
                            <div className="grid sm:grid-cols-5 gap-0">
                              <div className="relative sm:col-span-3 aspect-video overflow-hidden bg-black">
                                <img
                                  src={pkg.image || selectedGame.image}
                                  alt={pkg.unit}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent sm:bg-gradient-to-r sm:from-transparent sm:via-transparent sm:to-black/10"></div>
                              </div>

                              <div className="sm:col-span-2 p-3.5 md:p-4 flex flex-col justify-center gap-2.5">
                                <div>
                                  <p className="text-amber-400 text-[8px] font-black uppercase tracking-[0.25em] mb-1 flex items-center gap-1">
                                    <i className="fas fa-check-circle"></i> 100% Safe Transfer
                                  </p>
                                </div>

                                <div className="space-y-1.5 text-sm font-bold">
                                  <div className="flex items-center gap-2 text-zinc-300">
                                    <span className="text-zinc-500 uppercase tracking-wide text-xs">Level</span>
                                    <span className="text-zinc-600">:</span>
                                    <span className="text-white font-black">7</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-zinc-300">
                                    <span className="text-zinc-500 uppercase tracking-wide text-xs">Player Space</span>
                                    <span className="text-zinc-600">:</span>
                                    <span className="text-white font-black">50</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-zinc-300">
                                    <span className="text-zinc-500 uppercase tracking-wide text-xs">Server</span>
                                    <span className="text-zinc-600">:</span>
                                    <span className="text-white font-black">BD</span>
                                  </div>
                                </div>

                                <div className="pt-3 border-t border-amber-500/10 flex items-center justify-between gap-3">
                                  <div className="flex items-end gap-1.5">
                                    <span className="text-amber-400 text-base font-black italic">৳</span>
                                    <span className="text-3xl font-black text-white italic leading-none tracking-tight">
                                      {pkg.price.toLocaleString()}
                                    </span>
                                    <span className="text-zinc-500 text-[8px] font-black uppercase tracking-widest mb-1">/ guild</span>
                                  </div>
                                  <button
                                    onClick={() => setSelectedPackage(pkg)}
                                    className={`shrink-0 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg font-black uppercase italic tracking-widest text-[10px] transition-all duration-300 ${
                                      isSelected
                                        ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/30'
                                        : 'bg-amber-500 text-black shadow-[0_4px_0_0_rgba(0,0,0,0.35)] hover:bg-amber-400 hover:-translate-y-0.5 active:translate-y-0 active:shadow-none'
                                    }`}
                                  >
                                    {isSelected ? <><i className="fas fa-check"></i>Selected</> : <><i className="fas fa-bolt"></i>Buy Now</>}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : selectedGame.id === 'pc-games' ? (
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
                  ) : selectedGame.id === 'ff-likes' ? (
                    <div className="space-y-3">
                      <div className="flex flex-col gap-3">
                        {selectedGame.packages.map((pkg, idx) => {
                          const isSelected = selectedPackage?.id === pkg.id;
                          const daysMatch = pkg.unit.match(/\((\d+) Days\)/);
                          const days = daysMatch ? daysMatch[1] : '?';
                          const totalLikes = pkg.amount.toLocaleString();
                          type LikesTheme = { bg: string; border: string; borderSel: string; glow: string; glowSel: string; shimmer: string; topLine: string; glowBlob: string; accent: string; iconBg: string; iconBorder: string; badge: string; tierLabel: string; checkSel: string };
                          const themes: LikesTheme[] = [
                            {
                              bg: 'from-blue-950/70 to-zinc-900',
                              border: 'border-blue-500/40',
                              borderSel: 'border-blue-400',
                              glow: 'hover:shadow-[0_0_16px_rgba(59,130,246,0.25)]',
                              glowSel: 'shadow-[0_0_20px_rgba(59,130,246,0.4)]',
                              shimmer: 'from-blue-400/5 via-transparent to-blue-400/5',
                              topLine: 'from-blue-600/70 via-blue-400/80 to-blue-600/70',
                              glowBlob: 'bg-blue-500/15',
                              accent: 'text-blue-400',
                              iconBg: 'bg-blue-900/50',
                              iconBorder: 'border-blue-500/50',
                              badge: 'from-blue-500 to-cyan-500',
                              tierLabel: 'STARTER',
                              checkSel: 'border-blue-400 bg-blue-400',
                            },
                            {
                              bg: 'from-violet-950/80 to-zinc-900',
                              border: 'border-violet-400/50',
                              borderSel: 'border-violet-300',
                              glow: 'hover:shadow-[0_0_20px_rgba(139,92,246,0.35)]',
                              glowSel: 'shadow-[0_0_28px_rgba(139,92,246,0.55)]',
                              shimmer: 'from-violet-400/8 via-transparent to-fuchsia-400/8',
                              topLine: 'from-violet-500 via-fuchsia-400/80 to-violet-500',
                              glowBlob: 'bg-violet-500/20',
                              accent: 'text-violet-300',
                              iconBg: 'bg-violet-900/60',
                              iconBorder: 'border-violet-400/60',
                              badge: 'from-violet-500 to-fuchsia-500',
                              tierLabel: 'PREMIUM',
                              checkSel: 'border-violet-400 bg-violet-400',
                            },
                            {
                              bg: 'from-cyan-950/80 to-zinc-900',
                              border: 'border-cyan-400/45',
                              borderSel: 'border-cyan-300',
                              glow: 'hover:shadow-[0_0_18px_rgba(6,182,212,0.3)]',
                              glowSel: 'shadow-[0_0_26px_rgba(6,182,212,0.5)]',
                              shimmer: 'from-cyan-400/6 via-transparent to-teal-400/6',
                              topLine: 'from-cyan-500 via-teal-400/80 to-cyan-500',
                              glowBlob: 'bg-cyan-500/18',
                              accent: 'text-cyan-300',
                              iconBg: 'bg-cyan-900/55',
                              iconBorder: 'border-cyan-400/55',
                              badge: 'from-cyan-500 to-teal-400',
                              tierLabel: 'ADVANCED',
                              checkSel: 'border-cyan-400 bg-cyan-400',
                            },
                            {
                              bg: 'from-emerald-950/80 to-zinc-900',
                              border: 'border-emerald-400/45',
                              borderSel: 'border-emerald-300',
                              glow: 'hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]',
                              glowSel: 'shadow-[0_0_28px_rgba(16,185,129,0.5)]',
                              shimmer: 'from-emerald-400/6 via-transparent to-green-400/6',
                              topLine: 'from-emerald-500 via-green-400/80 to-emerald-500',
                              glowBlob: 'bg-emerald-500/18',
                              accent: 'text-emerald-300',
                              iconBg: 'bg-emerald-900/55',
                              iconBorder: 'border-emerald-400/55',
                              badge: 'from-emerald-500 to-green-400',
                              tierLabel: 'ELITE',
                              checkSel: 'border-emerald-400 bg-emerald-400',
                            },
                            {
                              bg: 'from-orange-950/80 to-zinc-900',
                              border: 'border-orange-400/50',
                              borderSel: 'border-orange-300',
                              glow: 'hover:shadow-[0_0_22px_rgba(249,115,22,0.32)]',
                              glowSel: 'shadow-[0_0_30px_rgba(249,115,22,0.52)]',
                              shimmer: 'from-orange-400/7 via-transparent to-amber-400/7',
                              topLine: 'from-orange-500 via-amber-400/80 to-orange-500',
                              glowBlob: 'bg-orange-500/20',
                              accent: 'text-orange-300',
                              iconBg: 'bg-orange-900/55',
                              iconBorder: 'border-orange-400/55',
                              badge: 'from-orange-500 to-amber-400',
                              tierLabel: 'ULTRA',
                              checkSel: 'border-orange-400 bg-orange-400',
                            },
                            {
                              bg: 'from-yellow-950/80 to-zinc-900',
                              border: 'border-yellow-400/55',
                              borderSel: 'border-yellow-300',
                              glow: 'hover:shadow-[0_0_24px_rgba(234,179,8,0.35)]',
                              glowSel: 'shadow-[0_0_36px_rgba(234,179,8,0.6)]',
                              shimmer: 'from-yellow-400/8 via-transparent to-amber-300/8',
                              topLine: 'from-yellow-400 via-amber-300/90 to-yellow-400',
                              glowBlob: 'bg-yellow-400/22',
                              accent: 'text-yellow-300',
                              iconBg: 'bg-yellow-900/55',
                              iconBorder: 'border-yellow-400/60',
                              badge: 'from-yellow-400 to-amber-300',
                              tierLabel: '👑 LEGENDARY',
                              checkSel: 'border-yellow-400 bg-yellow-400',
                            },
                          ];
                          const theme = themes[idx] || themes[0];
                          return (
                            <button
                              key={pkg.id}
                              onClick={() => setSelectedPackage(pkg)}
                              className={`group relative bg-gradient-to-br ${theme.bg} border rounded-xl px-4 py-3 transition-all duration-300 text-left overflow-hidden ${
                                isSelected
                                  ? `${theme.borderSel} ${theme.glowSel} scale-[1.01]`
                                  : `${theme.border} hover:scale-[1.005] ${theme.glow}`
                              }`}
                            >
                              <span className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${theme.topLine} rounded-t-xl`}></span>
                              <span className={`absolute -top-4 -right-4 w-16 h-16 ${theme.glowBlob} rounded-full blur-xl pointer-events-none`}></span>
                              <span className="pointer-events-none absolute inset-0 rounded-xl overflow-hidden">
                                <span className={`absolute inset-0 animate-pulse bg-gradient-to-br ${theme.shimmer}`}></span>
                              </span>

                              {/* Tier badge (top-left) */}
                              <div className={`absolute top-2 left-2 bg-gradient-to-r ${theme.badge} text-white text-[6px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-widest z-10`}>
                                {theme.tierLabel}
                              </div>

                              {/* HOT badge (top-right) */}
                              {pkg.isPopular && (
                                <div className="absolute top-2 right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-[6px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-widest z-10 flex items-center gap-0.5">
                                  <i className="fas fa-fire text-[5px]"></i> HOT
                                </div>
                              )}

                              <div className="flex items-center gap-4 relative z-10 mt-4">
                                {/* Left: duration */}
                                <div className="flex flex-col items-center justify-center shrink-0 w-16">
                                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center border ${theme.iconBg} ${theme.iconBorder} mb-1.5`}>
                                    <i className={`fas fa-heart ${theme.accent} text-[10px]`}></i>
                                  </div>
                                  <p className={`text-3xl font-black ${theme.accent} leading-none`}>{days}</p>
                                  <p className="text-[7px] font-bold text-zinc-400 uppercase tracking-wider mt-0.5">DAYS</p>
                                </div>

                                {/* Vertical divider */}
                                <div className="w-px self-stretch bg-white/10"></div>

                                {/* Right: details */}
                                <div className="flex-1 flex flex-col gap-1 min-w-0">
                                  <p className={`text-[8px] font-black uppercase tracking-widest ${theme.accent} mb-0.5`}>LIKES BOOST</p>
                                  <div className="flex items-center gap-1.5">
                                    <i className={`fas fa-heart ${theme.accent} text-[7px]`}></i>
                                    <p className="text-[9px] font-black text-white">Upto 220 <span className="text-zinc-400 font-semibold">Likes / Day</span></p>
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <i className={`fas fa-calendar-alt ${theme.accent} text-[7px]`}></i>
                                    <p className="text-[9px] font-black text-white">{days} <span className="text-zinc-400 font-semibold">Days</span></p>
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <i className={`fas fa-star ${theme.accent} text-[7px]`}></i>
                                    <p className={`text-[9px] font-black ${theme.accent}`}>Upto {totalLikes} <span className="text-zinc-400 font-semibold">Total Likes</span></p>
                                  </div>
                                </div>

                                {/* Price + selector */}
                                <div className="flex flex-col items-end gap-2 shrink-0">
                                  <p className="text-white font-black text-base leading-none">৳{pkg.price}</p>
                                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? theme.checkSel : `border-zinc-600 group-hover:${theme.iconBorder}`}`}>
                                    {isSelected && <i className="fas fa-check text-white text-[6px]"></i>}
                                  </div>
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {/* Server dropdown — FF LIKES */}
                      {selectedGame.id === 'ff-likes' && (() => {
                        const servers = [
                          { name: 'India',         code: 'in' },
                          { name: 'Indonesia',     code: 'id' },
                          { name: 'Vietnam',       code: 'vn' },
                          { name: 'Thailand',      code: 'th' },
                          { name: 'Bangladesh',    code: 'bd' },
                          { name: 'Pakistan',      code: 'pk' },
                          { name: 'Taiwan',        code: 'tw' },
                          { name: 'Europe',        code: 'eu' },
                          { name: 'Russia',        code: 'ru' },
                          { name: 'North America', code: 'us' },
                          { name: 'South America', code: 'br' },
                          { name: 'Middle East',   code: 'sa' },
                        ];
                        const selected = servers.find(s => s.name === selectedServer);
                        return (
                          <div className="mt-4">
                            {/* Trigger bar */}
                            <button
                              onClick={() => setServerDropdownOpen(o => !o)}
                              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all duration-200 ${
                                selectedServer
                                  ? 'border-pink-400 bg-pink-500/10'
                                  : 'border-zinc-700 bg-zinc-900/60 hover:border-pink-500/40'
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                <i className="fas fa-globe text-pink-400 text-[11px]"></i>
                                {selected ? (
                                  <span className="flex items-center gap-2 text-[11px] font-black uppercase tracking-wide text-pink-300">
                                    <img src={`https://flagcdn.com/20x15/${selected.code}.png`} alt={selected.name} className="w-5 h-auto rounded-sm" />
                                    {selected.name}
                                  </span>
                                ) : (
                                  <span className="text-[11px] font-black uppercase tracking-wide text-zinc-400">
                                    Select Server
                                  </span>
                                )}
                              </div>
                              <i className={`fas fa-chevron-down text-zinc-500 text-[10px] transition-transform duration-200 ${serverDropdownOpen ? 'rotate-180' : ''}`}></i>
                            </button>

                            {/* Dropdown list */}
                            {serverDropdownOpen && (
                              <div className="mt-1.5 border border-zinc-700 rounded-xl overflow-hidden bg-[#0d0d0f] shadow-xl animate-in fade-in slide-in-from-top-2 duration-150">
                                {servers.map((server, i) => {
                                  const isSel = selectedServer === server.name;
                                  return (
                                    <button
                                      key={server.name}
                                      onClick={() => { setSelectedServer(server.name); setServerDropdownOpen(false); }}
                                      className={`w-full flex items-center gap-3 px-4 py-2.5 transition-all text-left ${
                                        isSel
                                          ? 'bg-pink-500/15 text-pink-300'
                                          : 'hover:bg-zinc-800/60 text-zinc-300'
                                      } ${i !== 0 ? 'border-t border-zinc-800/60' : ''}`}
                                    >
                                      <img src={`https://flagcdn.com/20x15/${server.code}.png`} alt={server.name} className="w-5 h-auto rounded-sm shrink-0" />
                                      <span className="text-[10px] font-black uppercase tracking-wide flex-1">{server.name}</span>
                                      {isSel && <i className="fas fa-check text-pink-400 text-[9px]"></i>}
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  ) : selectedGame.id === 'event-bypass' ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {selectedGame.packages.map(pkg => {
                          const days = pkg.amount;
                          const isSelected = selectedPackage?.id === pkg.id;
                          type EbTheme = { gradient: string; border: string; glow: string; accent: string; accentHex: string; badgeBg: string; badge?: string; name: string; chance: string; iconBg: string; shimmer: boolean; topLine: boolean; topLineColor: string; sparkle: boolean; stockOut?: boolean };
                          const themes: Record<number, EbTheme> = {
                            5:  { gradient: 'from-cyan-950/60 to-zinc-900', border: 'border-cyan-800/50', glow: 'shadow-[0_0_20px_rgba(6,182,212,0.25)]', accent: 'text-cyan-400', accentHex: 'rgba(6,182,212,0.12)', badgeBg: 'bg-cyan-600', badge: '', name: 'BASIC', chance: '60%', iconBg: 'bg-cyan-900/50 border-cyan-600/50', shimmer: false, topLine: false, topLineColor: '', sparkle: false, stockOut: true },
                            14: { gradient: 'from-blue-950/70 to-zinc-900', border: 'border-blue-500/70', glow: 'shadow-[0_0_28px_rgba(59,130,246,0.35)]', accent: 'text-blue-400', accentHex: 'rgba(59,130,246,0.12)', badgeBg: 'bg-blue-500', badge: 'HOT', name: 'HYPER', chance: '75%', iconBg: 'bg-blue-900/60 border-blue-500/50', shimmer: false, topLine: true, topLineColor: 'from-blue-600/70 via-blue-400/50 to-blue-600/70', sparkle: false, stockOut: false },
                            30: { gradient: 'from-violet-950/80 to-zinc-900', border: 'border-violet-400/80', glow: 'shadow-[0_0_32px_rgba(139,92,246,0.45)]', accent: 'text-violet-300', accentHex: 'rgba(139,92,246,0.12)', badgeBg: 'bg-violet-600', badge: '', name: 'PREMIUM', chance: '90%', iconBg: 'bg-violet-900/70 border-violet-400/60', shimmer: true, topLine: true, topLineColor: 'from-violet-500 via-fuchsia-400/70 to-violet-500', sparkle: false },
                            60: { gradient: 'from-purple-950/90 via-fuchsia-950/60 to-zinc-900', border: 'border-fuchsia-400', glow: 'shadow-[0_0_40px_rgba(217,70,239,0.5)]', accent: 'text-fuchsia-300', accentHex: 'rgba(217,70,239,0.1)', badgeBg: 'bg-gradient-to-r from-fuchsia-500 to-purple-500', badge: 'BEST', name: 'SUPER', chance: '96%', iconBg: 'bg-fuchsia-900/70 border-fuchsia-400/60', shimmer: true, topLine: true, topLineColor: 'from-fuchsia-500 via-yellow-300/70 to-fuchsia-500', sparkle: true },
                          };
                          const theme = themes[days] || themes[5];
                          const isStockOut = theme.stockOut === true;
                          return (
                            <button
                              key={pkg.id}
                              onClick={() => {
                                if (isStockOut) {
                                  setStockOutToast(theme.name);
                                  setTimeout(() => setStockOutToast(null), 6000);
                                } else {
                                  setSelectedPackage(pkg);
                                }
                              }}
                              className={`group relative bg-gradient-to-br ${theme.gradient} border ${theme.border} rounded-2xl p-5 transition-all duration-300 text-left overflow-hidden ${
                                isStockOut ? 'cursor-not-allowed opacity-60' : isSelected ? `${theme.glow} scale-[1.02]` : `hover:scale-[1.01] hover:${theme.glow}`
                              }`}
                            >
                              {/* Top shimmer line */}
                              {theme.topLine && (
                                <span className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${theme.topLineColor} rounded-t-2xl`}></span>
                              )}

                              {/* Pulsing shimmer overlay for PREMIUM + SUPER */}
                              {theme.shimmer && (
                                <span className="pointer-events-none absolute inset-0 rounded-2xl overflow-hidden">
                                  <span className="absolute inset-0 animate-pulse bg-gradient-to-br from-white/[0.04] via-transparent to-white/[0.04]"></span>
                                </span>
                              )}

                              {/* Sparkle corner glows for SUPER */}
                              {theme.sparkle && (
                                <>
                                  <span className="absolute -top-5 -left-5 w-20 h-20 bg-fuchsia-500/25 rounded-full blur-2xl pointer-events-none"></span>
                                  <span className="absolute -bottom-5 -right-5 w-20 h-20 bg-purple-500/25 rounded-full blur-2xl pointer-events-none"></span>
                                </>
                              )}

                              {/* Stock Out tag */}
                              {isStockOut && (
                                <span className="absolute top-3 right-3 z-10 bg-red-600/90 text-white text-[7px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest flex items-center gap-1">
                                  <i className="fas fa-ban text-[6px]"></i> {t('product.stockOut')}
                                </span>
                              )}

                              {/* Badge */}
                              {theme.badge && !isStockOut && (
                                <div className={`absolute top-3 right-3 ${theme.badgeBg} text-white text-[7px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest z-10`}>
                                  {theme.badge}
                                </div>
                              )}

                              {isSelected && (
                                <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{background: theme.accentHex}}></div>
                              )}

                              <div className="flex flex-col gap-3 relative z-10">
                                {/* Icon + Name */}
                                <div className="flex items-center gap-2">
                                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 ${theme.iconBg}`}>
                                    <i className={`fas fa-lock-open ${theme.accent} text-base`}></i>
                                  </div>
                                  <p className={`text-xs font-black uppercase tracking-widest ${theme.accent}`}>{theme.name}</p>
                                </div>

                                {/* Amount */}
                                <div>
                                  <p className={`text-3xl font-black ${theme.accent} leading-none`}>{days}</p>
                                  <p className="text-[10px] font-bold text-zinc-400 mt-0.5 uppercase tracking-wider">{t('product.eventBypass')}</p>
                                </div>

                                {/* Divider */}
                                <div className="h-px bg-white/10 w-full"></div>

                                {/* Unlock chance */}
                                <div className="flex items-center gap-1.5">
                                  <i className={`fas fa-unlock text-[9px] ${theme.accent}`}></i>
                                  <p className={`text-[9px] font-black uppercase tracking-[0.15em] ${theme.accent}`}>{theme.chance} {t('product.unlockChance')}</p>
                                </div>

                                {/* Price + BONUS tag + select circle */}
                                <div className="flex items-center justify-between pt-1 gap-2">
                                  <div>
                                    <p className="text-white font-black text-lg leading-none">৳{pkg.price}</p>
                                    <p className="text-zinc-500 text-[8px] font-bold uppercase tracking-widest mt-0.5">{t('product.bdt')}</p>
                                  </div>
                                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${isSelected ? 'border-white bg-white' : 'border-zinc-600 group-hover:border-white/50'}`}>
                                    {isSelected && <i className="fas fa-check text-black text-[7px]"></i>}
                                  </div>
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
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
                            {groupedPackages[category].map(pkg => {
                              const isWeeklyDeal = isPsdis7Applied && pkg.id === 'ff-weekly-mem';
                              const isMonthlyDeal = isPsdis7Applied && pkg.id === 'ff-monthly-mem';
                              const isCouponDeal = isWeeklyDeal || isMonthlyDeal;
                              return (
                              <button 
                                key={pkg.id}
                                onClick={() => setSelectedPackage(pkg)}
                                className={`group relative bg-[#0d0d0f] border px-4 py-3 rounded-xl transition-all text-left flex justify-between items-center overflow-hidden ${
                                  selectedPackage?.id === pkg.id
                                  ? 'border-orange-500 bg-orange-500/10 shadow-[0_0_15px_rgba(249,115,22,0.1)]'
                                  : isMonthlyDeal
                                  ? 'border-amber-400/80 bg-gradient-to-br from-amber-950/40 to-[#0d0d0f] shadow-[0_0_24px_rgba(251,191,36,0.3)]'
                                  : isWeeklyDeal
                                  ? 'border-emerald-400/70 bg-emerald-500/5 shadow-[0_0_18px_rgba(52,211,153,0.25)]'
                                  : 'border-zinc-800/80 hover:border-orange-500/40 hover:bg-zinc-900/50 shadow-sm'
                                }`}
                              >
                                {/* Top gold shimmer line for monthly */}
                                {isMonthlyDeal && selectedPackage?.id !== pkg.id && (
                                  <>
                                    <span className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-500/80 via-yellow-300/60 to-amber-500/80 rounded-t-xl"></span>
                                    <span className="pointer-events-none absolute inset-0 rounded-xl overflow-hidden">
                                      <span className="absolute inset-0 animate-pulse bg-gradient-to-br from-amber-400/10 via-transparent to-yellow-500/5"></span>
                                    </span>
                                  </>
                                )}

                                {/* Animated shimmer for weekly */}
                                {isWeeklyDeal && selectedPackage?.id !== pkg.id && (
                                  <span className="pointer-events-none absolute inset-0 rounded-xl overflow-hidden">
                                    <span className="absolute inset-0 animate-pulse bg-gradient-to-r from-emerald-500/10 via-transparent to-emerald-500/10"></span>
                                  </span>
                                )}

                                {/* Monthly PREMIUM badge */}
                                {isMonthlyDeal && (
                                  <span className="absolute top-0 right-0 bg-gradient-to-r from-amber-500 to-yellow-400 text-black text-[6px] font-black px-2 py-0.5 rounded-bl-lg uppercase tracking-widest z-10 flex items-center gap-1">
                                    <i className="fas fa-crown text-[5px]"></i> {t('product.premiumBadge')}
                                  </span>
                                )}

                                {/* Weekly DEAL badge */}
                                {isWeeklyDeal && (
                                  <span className="absolute top-0 right-0 bg-emerald-500 text-black text-[6px] font-black px-2 py-0.5 rounded-bl-lg uppercase tracking-widest z-10 flex items-center gap-1">
                                    <i className="fas fa-tag text-[5px]"></i> {t('product.deal')}
                                  </span>
                                )}

                                <div className="flex flex-col relative z-10">
                                  <span className={`text-[11px] md:text-sm font-black italic tracking-tight leading-none mb-1 transition-colors ${
                                    selectedPackage?.id === pkg.id ? 'text-white'
                                    : isMonthlyDeal ? 'text-amber-100'
                                    : isWeeklyDeal ? 'text-emerald-100'
                                    : 'text-zinc-200 group-hover:text-white'
                                  }`}>
                                    {pkg.amount > 1 ? pkg.amount : ''} {pkg.unit}
                                  </span>
                                  {pkg.isPopular && (
                                    <span className="text-[6px] bg-orange-600 text-white px-1 py-0.5 rounded-sm font-black uppercase tracking-[0.1em] w-fit shadow-lg shadow-orange-600/20">
                                      {t('product.hotItem')}
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 shrink-0 relative z-10">
                                  <span className={`text-sm md:text-lg font-black italic tracking-tighter transition-colors ${
                                    selectedPackage?.id === pkg.id ? 'text-white'
                                    : isMonthlyDeal ? 'text-amber-400'
                                    : isWeeklyDeal ? 'text-emerald-400'
                                    : 'text-orange-500 group-hover:text-orange-400'
                                  }`}>
                                    ৳{pkg.price}
                                  </span>
                                  {pkg.oldPrice && (
                                    <span className="text-[11px] line-through decoration-red-500 font-bold text-red-400">
                                      ৳{pkg.oldPrice}
                                    </span>
                                  )}
                                </div>
                                
                                {/* Decorative element background */}
                                <div className={`absolute -right-2 -bottom-2 transition-all duration-500 ${
                                  selectedPackage?.id === pkg.id ? 'text-white/5 scale-110'
                                  : isMonthlyDeal ? 'text-amber-400/15 scale-125'
                                  : isWeeklyDeal ? 'text-emerald-500/10 scale-110'
                                  : 'text-zinc-800/10 group-hover:text-orange-500/5 group-hover:scale-105'
                                }`}>
                                   <i className={`fas ${isMonthlyDeal ? 'fa-crown' : 'fa-gem'} text-3xl md:text-4xl rotate-12`}></i>
                                </div>
                              </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {selectedPackage && (
                    <div ref={paymentSectionRef} className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">

                      {/* Universal Product Detail Box */}
                      <div className="relative rounded-[1.5rem] overflow-hidden border border-orange-500/25 shadow-2xl shadow-orange-500/5 bg-[#0b0b0d]">
                        {/* Top accent line */}
                        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-orange-500/80 via-orange-400/40 to-transparent"></div>

                        {/* Banner strip */}
                        {selectedGame?.banner && (
                          <div className="absolute top-0 left-0 right-0 h-20 overflow-hidden">
                            <img src={selectedGame.banner} alt="" className="w-full h-full object-cover opacity-10 blur-sm scale-105" />
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0b0b0d]"></div>
                          </div>
                        )}

                        <div className="relative p-4">
                          {/* Header row */}
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-2xl overflow-hidden border border-orange-500/30 shrink-0 shadow-lg shadow-orange-500/10 bg-zinc-900">
                              <img
                                src={selectedGame?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedGame?.name || '')}&background=18181b&color=f97316&bold=true`}
                                alt={selectedGame?.name}
                                className="w-full h-full object-cover"
                                onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedGame?.name || '')}&background=18181b&color=f97316&bold=true`; }}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-0.5">
                                <span className="text-[8px] font-black uppercase tracking-widest text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded-full">
                                  <i className="fas fa-gamepad mr-1"></i>{selectedGame?.category}
                                </span>
                                <span className="text-[8px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                                  <i className="fas fa-check-circle mr-1"></i>Selected
                                </span>
                              </div>
                              <h3 className="text-sm font-black text-white uppercase italic tracking-tight leading-tight truncate">
                                {selectedGame?.name}
                              </h3>
                            </div>
                          </div>

                          {/* Package detail */}
                          <div className="bg-black/40 rounded-xl p-3 mb-3 border border-zinc-800/50">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-[8px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-1">{t('product.package')}</p>
                                <p className="text-white font-black text-base uppercase italic leading-tight">
                                  {selectedPackage.amount} {selectedPackage.unit}
                                </p>
                                {selectedPackage.description && (
                                  <p className="text-zinc-500 text-[9px] font-bold mt-0.5">{selectedPackage.description}</p>
                                )}
                              </div>
                              <div className="text-right shrink-0">
                                <p className="text-[8px] font-black uppercase tracking-widest text-zinc-600 mb-0.5">{t('product.total')}</p>
                                <p className="text-2xl font-black text-orange-400 italic leading-none">
                                  {selectedPackage.currency === 'USD' ? '$' : '৳'}{selectedPackage.price.toLocaleString()}
                                </p>
                                <p className="text-[8px] font-black text-zinc-600 uppercase tracking-wider mt-0.5">{selectedPackage.currency}</p>
                              </div>
                            </div>
                          </div>

                          {/* Player ID row (if entered) */}
                          {playerId.trim() && (
                            <div className="flex items-center gap-2 bg-zinc-900/60 rounded-xl px-3 py-2 mb-3 border border-zinc-800/40">
                              <i className="fas fa-user text-orange-400 text-[10px] shrink-0"></i>
                              <div className="flex-1 min-w-0">
                                <span className="text-[7px] font-black uppercase tracking-widest text-zinc-600 block">{t('product.playerId')}</span>
                                <span className="text-zinc-300 font-mono text-[10px] truncate block">{playerId}</span>
                              </div>
                            </div>
                          )}

                          {/* Trust badges */}
                          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-zinc-800/50">
                            <div className="flex flex-col items-center gap-1 text-center">
                              <i className="fas fa-bolt text-orange-400 text-[10px]"></i>
                              <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">{t('product.instant')}</span>
                              <span className="text-[7px] font-bold text-zinc-600 uppercase">{t('product.delivery')}</span>
                            </div>
                            <div className="flex flex-col items-center gap-1 text-center border-x border-zinc-800/50">
                              <i className="fas fa-shield-alt text-orange-400 text-[10px]"></i>
                              <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">{t('product.safe')}</span>
                              <span className="text-[7px] font-bold text-zinc-600 uppercase">{t('product.safeLabel')}</span>
                            </div>
                            <div className="flex flex-col items-center gap-1 text-center">
                              <i className="fas fa-headset text-orange-400 text-[10px]"></i>
                              <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">{t('product.support')}</span>
                              <span className="text-[7px] font-bold text-zinc-600 uppercase">{t('product.supportLabel')}</span>
                            </div>
                          </div>
                        </div>
                      </div>


                    <div className="bg-[#0b0b0d] border border-zinc-800/60 p-4 rounded-[1.5rem] shadow-sm">
                      <h3 className="text-xs font-bold text-white mb-4 uppercase tracking-tight">{t('game.paymentMethod')}</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {PAYMENT_METHODS.map(method => (
                          <button 
                            key={method.id}
                            onClick={() => handlePaymentSelect(method)}
                            className={`flex items-center gap-3 p-3 rounded-xl transition-all border ${
                              selectedPayment?.id === method.id 
                              ? 'border-orange-500 bg-orange-500/5' 
                              : 'bg-zinc-900/40 border-zinc-800'
                            }`}
                          >
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${selectedPayment?.id === method.id ? 'border-orange-500' : 'border-zinc-700'}`}>
                              {selectedPayment?.id === method.id && <div className="w-2 rounded-full bg-orange-500 aspect-square"></div>}
                            </div>
                            <img src={method.logo} alt={method.name} className="w-7 h-7 rounded-lg object-cover shrink-0" />
                            <div className="flex flex-col">
                              <span className="font-black uppercase italic tracking-tighter text-[10px] text-white truncate">{method.name}</span>
                              {method.id === 'bkash' && (
                                <span className="text-red-500 font-black uppercase text-[7px] tracking-widest leading-none mt-0.5">{t('game.disabled')}</span>
                              )}
                              {(method.id === 'nagad' || method.id === 'rocket') && (
                                <span className="text-orange-400 font-black uppercase text-[7px] tracking-widest leading-none mt-0.5">{t('game.support')}</span>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>

                      <div className="mt-6 pt-4 border-t border-zinc-800/50 space-y-3">
                        {/* Required fields checklist */}
                        {(() => {
                          const isFFLikes = selectedGame?.id === 'ff-likes';
                          const checks = [
                            { label: selectedGame?.id === 'pc-games' ? 'Email / WhatsApp entered' : 'Player ID entered', done: !!playerId.trim() },
                            ...(isFFLikes ? [{ label: 'Server selected', done: !!selectedServer }] : []),
                            { label: 'Payment method selected', done: !!selectedPayment },
                          ];
                          const allDone = checks.every(c => c.done);
                          if (allDone) return null;
                          return (
                            <div className="bg-zinc-900/60 border border-zinc-800/60 rounded-xl px-3 py-2.5 space-y-1.5">
                              {checks.map((c, i) => (
                                <div key={i} className="flex items-center gap-2">
                                  <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 ${c.done ? 'bg-emerald-500' : 'bg-zinc-700'}`}>
                                    {c.done
                                      ? <i className="fas fa-check text-white text-[6px]"></i>
                                      : <i className="fas fa-times text-zinc-500 text-[6px]"></i>
                                    }
                                  </div>
                                  <span className={`text-[9px] font-bold uppercase tracking-wide ${c.done ? 'text-emerald-400' : 'text-zinc-500'}`}>{c.label}</span>
                                </div>
                              ))}
                            </div>
                          );
                        })()}

                        {/* Inline error message */}
                        {orderError && (
                          <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-xl px-3 py-2">
                            <i className="fas fa-exclamation-circle text-red-400 text-[10px] shrink-0"></i>
                            <span className="text-[9px] font-bold text-red-400 uppercase tracking-wide">{orderError}</span>
                          </div>
                        )}

                        {/* Confirm button — disabled until all fields are filled */}
                        {(() => {
                          const isFFLikes = selectedGame?.id === 'ff-likes';
                          const canProceed = !!playerId.trim() && !!selectedPayment && (!isFFLikes || !!selectedServer);
                          return (
                            <button
                              onClick={handleConfirmOrder}
                              disabled={!canProceed}
                              className={`w-full py-3.5 rounded-xl font-black uppercase italic tracking-widest transition-all text-[10px] ${
                                canProceed
                                  ? 'bg-orange-600 text-white shadow-xl hover:bg-orange-700 active:scale-95 cursor-pointer'
                                  : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                              }`}
                            >
                              {canProceed
                                ? `${t('game.confirmPay')} ${selectedPackage.currency === 'USD' ? '$' : '৳'}${selectedPackage.price}`
                                : 'Fill All Required Fields'
                              }
                            </button>
                          );
                        })()}
                      </div>
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
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20 px-4">
          <h2 className="text-2xl md:text-3xl font-black text-white uppercase italic tracking-tighter flex items-center gap-3">
            <span className="w-1 h-6 bg-orange-600 rounded-full"></span>
            {t('history.title')}
          </h2>
          {user && transactions.length > 0 ? (
            <div className="space-y-4">
              {transactions.map(trx => (
                <div key={trx.id} className="relative bg-[#0c0c0e] border border-zinc-800/50 p-4 md:p-6 rounded-2xl flex flex-col gap-4 group hover:border-orange-500/30 transition-all duration-300">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-black uppercase italic tracking-tight text-base md:text-lg truncate leading-tight mb-1">
                        {trx.gameName} - {trx.amount} {trx.unit}
                      </h3>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                        {trx.date} • {trx.paymentMethod}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-2xl font-black text-white italic tracking-tighter leading-none mb-2">৳{trx.price}</p>
                      <div className={`inline-flex px-3 py-1 rounded-lg border text-[8px] font-black uppercase tracking-widest ${trx.status === 'processing' ? 'text-amber-500 border-amber-500/20 bg-amber-500/5' : trx.status === 'failed' ? 'text-red-500 border-red-500/20 bg-red-500/5' : 'text-green-500 border-green-500/20 bg-green-500/5'}`}>
                        {trx.status === 'processing' ? t('history.processing') : trx.status === 'failed' ? 'CANCELLED' : t('history.completed')}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-black/40 px-4 py-2.5 rounded-xl border border-zinc-800/30 flex flex-col md:flex-row md:items-center md:justify-between gap-1">
                      <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest shrink-0">{t('history.orderId')}</span>
                      <span className="text-zinc-400 font-mono text-[10px] truncate">{trx.id}</span>
                    </div>
                    <div className="bg-black/40 px-4 py-2.5 rounded-xl border border-zinc-800/30 flex flex-col md:flex-row md:items-center md:justify-between gap-1">
                      <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest shrink-0">{t('history.playerId')}</span>
                      <span className="text-orange-400/80 font-mono text-[10px] truncate">{trx.playerId}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-40 bg-zinc-900/20 border border-dashed border-zinc-800 rounded-[3rem]">
              <i className="fas fa-history text-zinc-800 text-6xl mb-8 opacity-20"></i>
              <p className="text-zinc-600 text-sm font-black uppercase tracking-[0.4em]">{t('history.noOrders')}</p>
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
              {t('profile.logout')}
            </button>

            <div className="w-full max-w-2xl space-y-10">
              <div className="space-y-6">
                <h3 className="text-xl font-black text-white uppercase italic tracking-tighter flex items-center gap-3">
                  <span className="w-1 h-5 bg-orange-600 rounded-full"></span> {t('profile.accountData')}
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
                  <span className="w-1 h-5 bg-amber-500 rounded-full"></span> {t('profile.security')}
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

      {/* FF Panel Duration Popup */}
      {ffPanelPopupPkg && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" onClick={() => setFfPanelPopupPkg(null)}>
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md"></div>
          <div className="relative w-full max-w-sm" onClick={e => e.stopPropagation()}>
            {/* Card */}
            <div className="bg-[#111114] border border-white/5 rounded-3xl overflow-hidden shadow-2xl shadow-black/60">

              {/* Top accent stripe */}
              <div className="h-[3px] w-full bg-gradient-to-r from-emerald-500 via-orange-500 to-emerald-500"></div>

              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-terminal text-emerald-400 text-xs"></i>
                    </div>
                    <div>
                      <p className="text-emerald-400 text-[8px] font-black uppercase tracking-[0.3em]">FF Panel</p>
                      <h3 className="text-white font-black uppercase text-[11px] leading-tight mt-0.5">{ffPanelPopupPkg.unit}</h3>
                    </div>
                  </div>
                  <button onClick={() => setFfPanelPopupPkg(null)} className="w-7 h-7 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center transition-colors">
                    <i className="fas fa-times text-zinc-400 text-[10px]"></i>
                  </button>
                </div>

                {/* Tier options */}
                {FF_PANEL_TIERS[ffPanelPopupPkg.id] ? (
                  <>
                    <p className="text-zinc-600 text-[8px] font-black uppercase tracking-[0.25em] mb-3">Choose a plan</p>
                    <div className="space-y-2 mb-5">
                      {FF_PANEL_TIERS[ffPanelPopupPkg.id].map((tier, idx) => (
                        <button
                          key={idx}
                          onClick={() => setFfPanelTierIdx(idx)}
                          className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl border transition-all duration-200 group ${
                            ffPanelTierIdx === idx
                              ? 'border-orange-500/60 bg-gradient-to-r from-orange-500/10 to-transparent'
                              : 'border-white/5 bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.04]'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${ffPanelTierIdx === idx ? 'border-orange-500 bg-orange-500' : 'border-zinc-700'}`}>
                              {ffPanelTierIdx === idx && <div className="w-1.5 h-1.5 rounded-full bg-black"></div>}
                            </div>
                            <div className="text-left">
                              <span className={`text-sm font-black ${ffPanelTierIdx === idx ? 'text-white' : 'text-zinc-300'}`}>
                                {tier.days === 0 ? 'Permanent' : `${tier.days} ${tier.days === 1 ? 'Day' : 'Days'}`}
                              </span>
                            </div>
                          </div>
                          <span className={`text-sm font-black tabular-nums ${ffPanelTierIdx === idx ? 'text-orange-400' : 'text-zinc-500'}`}>
                            ৳{tier.price.toLocaleString()}
                          </span>
                        </button>
                      ))}
                    </div>

                    {/* Summary bar */}
                    <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/5 mb-4">
                      <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Total</span>
                      <span className="text-white text-sm font-black">৳{FF_PANEL_TIERS[ffPanelPopupPkg.id][ffPanelTierIdx].price.toLocaleString()}</span>
                    </div>

                    <button
                      onClick={() => {
                        const tier = FF_PANEL_TIERS[ffPanelPopupPkg.id][ffPanelTierIdx];
                        setSelectedPackage({ ...ffPanelPopupPkg, price: tier.price, unit: `${ffPanelPopupPkg.unit} (${tier.days === 0 ? 'Permanent' : `${tier.days} Day${tier.days > 1 ? 's' : ''}`})` });
                        setFfPanelPopupPkg(null);
                        setTimeout(() => {
                          paymentSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }, 150);
                      }}
                      className="w-full py-3.5 rounded-2xl bg-orange-500 hover:bg-orange-400 active:scale-[0.98] text-black font-black uppercase tracking-widest text-[10px] transition-all shadow-lg shadow-orange-500/25"
                    >
                      <i className="fas fa-check mr-2"></i>Confirm Selection
                    </button>
                  </>
                ) : (
                  <div className="text-center py-6">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                      <i className="fas fa-headset text-emerald-400 text-lg"></i>
                    </div>
                    <p className="text-white text-sm font-black mb-1">Contact for Pricing</p>
                    <p className="text-zinc-500 text-[10px] mb-3">Pricing for this panel varies — reach us on</p>
                    <p className="text-emerald-400 text-[11px] font-black tracking-wide">@adixoglory</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stock Out Modal */}
      {stockOutToast && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center p-6 backdrop-blur-sm bg-black/60"
          onClick={() => setStockOutToast(null)}
        >
          <div
            className="bg-zinc-900 border border-red-500/50 rounded-2xl p-6 shadow-2xl shadow-red-900/30 w-full max-w-[300px] text-center"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-red-600/20 border border-red-500/40 flex items-center justify-center mx-auto mb-3">
              <i className="fas fa-ban text-red-400 text-lg"></i>
            </div>
            <p className="text-white text-sm font-black uppercase tracking-wide mb-1">{stockOutToast} — {t('product.outOfStock')}</p>
            <p className="text-zinc-400 text-[10px] leading-relaxed mb-4">{t('product.stockOutMsg')}</p>
            <a
              href="https://t.me/AdiXO_TV"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-sky-600/20 hover:bg-sky-600/30 border border-sky-500/40 text-sky-400 text-[10px] font-black uppercase tracking-widest py-2 rounded-lg transition-colors mb-3"
            >
              <i className="fab fa-telegram text-xs"></i> Contact @AdiXO_TV
            </a>
            <button
              onClick={() => setStockOutToast(null)}
              className="w-full text-zinc-500 hover:text-zinc-300 text-[9px] font-bold uppercase tracking-widest transition-colors"
            >
              {t('product.stockOutClose')}
            </button>
          </div>
        </div>
      )}


      <GuideBot />
    </Layout>
  );
};

export default App;
