import React, { useState, useRef, useEffect } from 'react';
import { User } from '../types';
import Footer from './Footer';
import { useLanguage } from '../LanguageContext';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  user: User | null;
  onLogout: () => void;
  onOpenAuth: (mode?: 'login' | 'register') => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onOpenLangPopup: () => void;
}

const NOTIFICATIONS = [
  {
    id: 'notif-levelup-sale-1',
    type: 'offer',
    icon: 'fa-arrow-up',
    color: '#a855f7',
    title: 'Level Up — Upto 50% OFF! 🔥',
    body: 'All Level Up packages are now discounted! Starter 15% off up to Supreme 50% off. Limited time deal.',
    ts: '2026-05-19T06:00:00Z',
  },
  {
    id: 'notif-glory-issue-1',
    type: 'notice',
    icon: 'fa-triangle-exclamation',
    color: '#facc15',
    title: 'LOW GLORY ISSUE ⚠️',
    body: 'Currently our server is under maintenance. For which you might experience low Glory up to 20%. Our team is working on the issue so be patient.',
    ts: '2026-05-16T09:00:00Z',
  },
  {
    id: 'notif-stock-1',
    type: 'notice',
    icon: 'fa-ban',
    color: '#ef4444',
    title: 'Stock Update',
    body: 'Basic Mystery Box & Basic/Hyper Event Bypass are currently out of stock. Epic & Super boxes available.',
    ts: '2026-05-15T04:00:00Z',
  },
  {
    id: 'notif-support-1',
    type: 'info',
    icon: 'fa-headset',
    color: '#38bdf8',
    title: 'Support Available 24/7',
    body: 'Reach us anytime via @adixoglory (group) or @AdiXO_TV (direct support) on Telegram.',
    ts: '2026-05-10T10:00:00Z',
  },
];

function formatBDTime(isoString: string): string {
  const BD_OFFSET_MS = 6 * 60 * 60 * 1000; // UTC+6
  const notifBD = new Date(new Date(isoString).getTime() + BD_OFFSET_MS);
  const day = notifBD.getUTCDate();
  const month = notifBD.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' });
  return `${day} ${month}`;
}

const STORAGE_KEY = 'adixo_read_notifs';

function getReadIds(): string[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
}
function markAllRead() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(NOTIFICATIONS.map(n => n.id)));
}

const Layout: React.FC<LayoutProps> = ({
  children,
  activeTab,
  onTabChange,
  user,
  onLogout,
  onOpenAuth,
  searchTerm,
  onSearchChange,
  onOpenLangPopup,
}) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isBellOpen, setIsBellOpen] = useState(false);
  const [readIds, setReadIds] = useState<string[]>(getReadIds);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const bellRef = useRef<HTMLDivElement>(null);
  const { t, lang } = useLanguage();

  const hasUnread = NOTIFICATIONS.some(n => !readIds.includes(n.id));

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        if (!searchTerm) setIsSearchOpen(false);
      }
      if (bellRef.current && !bellRef.current.contains(event.target as Node)) {
        setIsBellOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [searchTerm]);

  const handleBellOpen = () => {
    setIsBellOpen(o => {
      if (!o) {
        // mark all read when opening
        markAllRead();
        setReadIds(NOTIFICATIONS.map(n => n.id));
      }
      return !o;
    });
    setIsProfileOpen(false);
  };

  const handleMenuAction = (tab: string) => {
    onTabChange(tab);
    setIsProfileOpen(false);
  };

  const handleLogoutAction = () => {
    setIsProfileOpen(false);
    onLogout();
  };

  const handleChangeLang = () => {
    setIsProfileOpen(false);
    onOpenLangPopup();
  };

  const BellButton = (
    <div className="relative" ref={bellRef}>
      {/* Bell trigger */}
      <button
        onClick={handleBellOpen}
        className="relative p-2 md:p-2.5 transition-all border rounded-lg md:rounded-xl bg-zinc-900/60 hover:bg-zinc-800/80"
        style={{
          borderColor: isBellOpen ? 'rgba(249,115,22,0.5)' : 'rgba(63,63,70,0.8)',
          boxShadow: isBellOpen ? '0 0 14px rgba(249,115,22,0.2)' : 'none',
        }}
        title="Notifications"
      >
        <i className={`fas fa-bell text-sm md:text-base transition-colors ${isBellOpen || hasUnread ? 'text-orange-400' : 'text-zinc-400'}`}
          style={{ filter: hasUnread ? 'drop-shadow(0 0 4px rgba(249,115,22,0.7))' : 'none' }}
        ></i>
        {hasUnread && (
          <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full border border-black"
            style={{ boxShadow: '0 0 8px rgba(239,68,68,0.9)' }} />
        )}
      </button>

      {isBellOpen && (
        <div
          className="absolute right-0 mt-3 w-80 md:w-96 rounded-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-[100]"
          style={{
            background: 'linear-gradient(160deg, #0f0f0f 0%, #0a0a0a 100%)',
            border: '1px solid rgba(249,115,22,0.2)',
            boxShadow: '0 25px 60px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.03), inset 0 1px 0 rgba(255,255,255,0.05)',
          }}
        >
          {/* Glow accent top */}
          <div className="absolute top-0 left-0 right-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(249,115,22,0.6), transparent)' }} />

          {/* Header */}
          <div className="px-5 py-4 flex items-center justify-between"
            style={{ background: 'linear-gradient(135deg, rgba(249,115,22,0.08) 0%, rgba(0,0,0,0) 60%)' }}>
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: 'rgba(249,115,22,0.15)', border: '1px solid rgba(249,115,22,0.3)' }}>
                <i className="fas fa-bell text-orange-400 text-[11px]"
                  style={{ filter: 'drop-shadow(0 0 4px rgba(249,115,22,0.8))' }}></i>
              </div>
              <div>
                <p className="text-white font-black text-xs uppercase tracking-widest leading-none">Notifications</p>
                <p className="text-orange-500/70 text-[8px] font-bold uppercase tracking-widest mt-0.5">ADIXO STORE</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-md"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"
                style={{ boxShadow: '0 0 5px rgba(74,222,128,0.8)' }}></span>
              <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">{NOTIFICATIONS.length} active</span>
            </div>
          </div>

          {/* Divider */}
          <div className="mx-4 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(249,115,22,0.2), transparent)' }} />

          {/* Notifications list — overscroll-contain stops page scroll leaking */}
          <div className="overflow-y-auto max-h-64 overscroll-contain" style={{ scrollbarWidth: 'none' }}>
            {NOTIFICATIONS.map((n, i) => (
              <div key={n.id}
                className="mx-3 my-2 rounded-xl px-3 py-3 flex gap-3 transition-all cursor-default group"
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.04)',
                }
                }
                onMouseEnter={e => (e.currentTarget.style.background = `${n.color}0a`)}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
              >
                {/* Icon */}
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: `${n.color}15`,
                    border: `1px solid ${n.color}35`,
                    boxShadow: `0 0 12px ${n.color}15`,
                  }}>
                  <i className={`fas ${n.icon} text-sm`}
                    style={{ color: n.color, filter: `drop-shadow(0 0 4px ${n.color}80)` }}></i>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="text-white font-black text-[11px] leading-tight">{n.title}</p>
                    <span className="text-[8px] font-bold flex-shrink-0 px-1.5 py-0.5 rounded-md"
                      style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(161,161,170,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}>
                      {formatBDTime(n.ts)}
                    </span>
                  </div>
                  <p className="text-zinc-500 text-[10px] leading-relaxed">{n.body}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="mx-4 mt-1 mb-3 rounded-xl px-4 py-2.5 flex items-center justify-between"
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.04)',
            }}>
            <a href="https://t.me/adixoglory" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 transition-opacity hover:opacity-80 group">
              <div className="w-5 h-5 rounded-md flex items-center justify-center"
                style={{ background: 'rgba(56,189,248,0.15)', border: '1px solid rgba(56,189,248,0.25)' }}>
                <i className="fab fa-telegram text-sky-400 text-[9px]"></i>
              </div>
              <span className="text-[9px] font-black text-sky-400 uppercase tracking-widest">@adixoglory</span>
            </a>
            <div className="w-px h-4 bg-zinc-800"></div>
            <a href="https://t.me/AdiXO_TV" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 transition-opacity hover:opacity-80 group">
              <div className="w-5 h-5 rounded-md flex items-center justify-center"
                style={{ background: 'rgba(249,115,22,0.15)', border: '1px solid rgba(249,115,22,0.25)' }}>
                <i className="fas fa-headset text-orange-400 text-[9px]"></i>
              </div>
              <span className="text-[9px] font-black text-orange-400 uppercase tracking-widest">@AdiXO_TV</span>
            </a>
          </div>

          {/* Bottom glow accent */}
          <div className="absolute bottom-0 left-0 right-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(249,115,22,0.3), transparent)' }} />
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#050505] relative">
      {/* Dynamic Gaming Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(249,115,22,0.05),_transparent_70%)] animate-pulse"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,_rgba(255,255,255,0.02)_1px,_transparent_1px),_linear-gradient(to_bottom,_rgba(255,255,255,0.02)_1px,_transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,_black,_transparent_80%)]"></div>
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-600/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-600/5 blur-[120px] rounded-full"></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-50 glass-card border-b border-zinc-800/50 px-4 md:px-6 py-3 md:py-4 flex items-center justify-between backdrop-blur-md bg-black/40">
          <div className="flex items-center gap-2 md:gap-3 cursor-pointer group" onClick={() => onTabChange('home')}>
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center overflow-hidden shadow-lg shadow-orange-600/20 group-hover:scale-105 transition-transform">
              <img src="/adixo-logo.png" alt="ADIXO STORE" className="w-full h-full object-cover" />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-lg md:text-2xl font-black tracking-tighter text-white uppercase italic logo-font leading-none">
                ADIXO <span className="text-orange-500">STORE</span>
              </span>
              <div className="flex items-center gap-1.5 bg-black/60 border border-orange-500 px-2 py-1 rounded-[4px] shadow-[0_0_10px_rgba(249,115,22,0.3)] w-fit transition-all hover:border-orange-400">
                <div className="flex items-center justify-center">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.8)]"></span>
                  </span>
                </div>
                <span className="text-green-500 text-[8px] md:text-[9px] font-black uppercase tracking-[0.15em] leading-none gaming-font">{t('nav.liveIndicator')}</span>
              </div>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-zinc-400 font-bold uppercase tracking-widest text-xs">
            <button onClick={() => onTabChange('home')} className={`hover:text-white transition-all py-1 ${activeTab === 'home' ? 'text-white border-b-2 border-orange-500' : ''}`}>
              {t('nav.home')}
            </button>
            <button onClick={() => onTabChange('games')} className={`hover:text-white transition-all py-1 ${activeTab === 'games' ? 'text-white border-b-2 border-orange-500' : ''}`}>
              {t('nav.games')}
            </button>
            <a href="https://t.me/AdiXO_TV" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-all py-1 flex items-center gap-2">
              {t('nav.support')}
              <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse"></span>
            </a>
          </nav>

          <div className="flex items-center gap-2 md:gap-3">
            {/* Search */}
            <div className="relative hidden md:flex items-center" ref={searchRef}>
              {isSearchOpen ? (
                <div className="flex items-center bg-zinc-950 border border-orange-500/50 rounded-xl overflow-hidden animate-in slide-in-from-right-4 duration-300">
                  <input
                    autoFocus
                    type="text"
                    placeholder={t('common.search')}
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="bg-transparent text-white px-3 py-1.5 text-[10px] md:text-xs font-bold focus:outline-none w-24 md:w-48"
                  />
                  <button onClick={() => { onSearchChange(''); setIsSearchOpen(false); }} className="px-2 py-1.5 text-zinc-500 hover:text-white">
                    <i className="fas fa-times text-[10px]"></i>
                  </button>
                </div>
              ) : (
                <button onClick={() => { setIsSearchOpen(true); onTabChange('games'); }} className="p-2 md:p-2.5 text-zinc-400 hover:text-white transition-colors border border-zinc-800 rounded-lg md:rounded-xl bg-zinc-900/50">
                  <i className="fas fa-search text-sm md:text-base"></i>
                </button>
              )}
            </div>

            {/* Bell — always visible */}
            {BellButton}

            {user ? (
              <div className="relative" ref={dropdownRef}>
                <div className="flex items-center gap-2 md:gap-3 pl-3 md:pl-4 border-l border-zinc-800/50 cursor-pointer group" onClick={() => setIsProfileOpen(!isProfileOpen)}>
                  <div className="hidden lg:block text-right">
                    <p className="text-white text-xs font-black uppercase italic tracking-tighter truncate max-w-[120px]">{user.name}</p>
                    <p className="text-[9px] text-orange-500 font-bold uppercase tracking-widest">{t('nav.eliteAgent')}</p>
                  </div>
                  <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full border-2 overflow-hidden shadow-lg transition-all ${isProfileOpen ? 'border-white ring-4 ring-orange-500/30' : 'border-orange-500 shadow-orange-500/20'}`}>
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                  </div>
                </div>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-4 w-64 md:w-72 bg-black rounded-2xl border border-zinc-800/80 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-[100]">
                    <div className="p-4 md:p-5 border-b border-zinc-800/50 bg-zinc-900/40">
                      <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-1">{t('nav.authenticatedVia')}</p>
                      <p className="text-white font-bold text-sm truncate">{user.email}</p>
                    </div>
                    <div className="p-2">
                      <button onClick={() => handleMenuAction('profile')} className="w-full flex items-center gap-3 px-4 py-3 text-zinc-400 hover:text-white hover:bg-zinc-800/50 rounded-xl transition-all group">
                        <i className="fas fa-user-shield text-orange-500 group-hover:scale-110 transition-transform w-5 text-center"></i>
                        <span className="text-xs font-bold uppercase tracking-wider">{t('nav.profile')}</span>
                      </button>
                      <button onClick={() => handleMenuAction('history')} className="w-full flex items-center gap-3 px-4 py-3 text-zinc-400 hover:text-white hover:bg-zinc-800/50 rounded-xl transition-all group">
                        <i className="fas fa-history text-orange-500 group-hover:rotate-[-15deg] transition-transform w-5 text-center"></i>
                        <span className="text-xs font-bold uppercase tracking-wider">{t('nav.orderHistory')}</span>
                      </button>
                      <button onClick={handleChangeLang} className="w-full flex items-center gap-3 px-4 py-3 text-zinc-400 hover:text-white hover:bg-zinc-800/50 rounded-xl transition-all group">
                        <i className="fas fa-globe text-orange-500 group-hover:scale-110 transition-transform w-5 text-center"></i>
                        <span className="text-xs font-bold uppercase tracking-wider">{t('lang.change')}</span>
                        <span className="ml-auto text-[9px] font-black uppercase tracking-widest text-zinc-600 border border-zinc-800 px-1.5 py-0.5 rounded">
                          {lang === 'en' ? 'EN' : 'বাং'}
                        </span>
                      </button>
                    </div>
                    <div className="p-2 bg-zinc-950 border-t border-zinc-800/50">
                      <button onClick={handleLogoutAction} className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-all group">
                        <div className="w-5 flex justify-center">
                          <i className="fas fa-power-off group-hover:rotate-90 transition-transform"></i>
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest">{t('nav.logout')}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => onOpenAuth('login')}
                className="bg-zinc-800 border border-zinc-700 text-white px-4 md:px-5 py-2 md:py-2.5 rounded-lg md:rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest hover:bg-zinc-700 transition-all active:scale-95 shadow-lg shadow-black/20"
              >
                {t('nav.login')}
              </button>
            )}
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 w-full flex flex-col">
          <div className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-6 py-6 md:py-8">
            {children}
          </div>
          <Footer />
        </main>

        {/* Mobile Footer Nav */}
        <footer className="md:hidden sticky bottom-0 z-50 glass-card border-t border-zinc-800/50 px-6 py-3 flex justify-around backdrop-blur-md bg-black/40">
          <button onClick={() => onTabChange('home')} className={`flex flex-col items-center gap-1 ${activeTab === 'home' ? 'text-orange-500' : 'text-zinc-500'}`}>
            <i className="fas fa-home"></i>
            <span className="text-[10px] font-black uppercase tracking-tighter">{t('nav.home')}</span>
          </button>
          <button onClick={() => onTabChange('games')} className={`flex flex-col items-center gap-1 ${activeTab === 'games' ? 'text-orange-500' : 'text-zinc-500'}`}>
            <i className="fas fa-gamepad"></i>
            <span className="text-[10px] font-black uppercase tracking-tighter">{t('nav.games')}</span>
          </button>
          <a href="https://t.me/AdiXO_TV" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1 text-zinc-500">
            <i className="fas fa-headset"></i>
            <span className="text-[10px] font-black uppercase tracking-tighter">{t('nav.support')}</span>
          </a>
          <button onClick={user ? () => setIsProfileOpen(true) : () => onOpenAuth('login')} className={`flex flex-col items-center gap-1 ${user ? 'text-orange-500' : 'text-zinc-500'}`}>
            <i className={user ? 'fas fa-user' : 'fas fa-sign-in-alt'}></i>
            <span className="text-[10px] font-black uppercase tracking-tighter">{user ? t('nav.account') : t('nav.login')}</span>
          </button>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
