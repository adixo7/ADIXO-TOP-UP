import React, { useState, useRef, useEffect } from 'react';
import { User } from '../types';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  user: User | null;
  onLogout: () => void;
  onOpenAuth: (mode?: 'login' | 'register') => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  activeTab, 
  onTabChange, 
  user, 
  onLogout, 
  onOpenAuth,
  searchTerm,
  onSearchChange
}) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close dropdown and search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        // Only close if search term is empty
        if (!searchTerm) setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [searchTerm]);

  const handleMenuAction = (tab: string) => {
    onTabChange(tab);
    setIsProfileOpen(false);
  };

  const handleLogoutAction = () => {
    setIsProfileOpen(false);
    onLogout();
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-card border-b border-zinc-800/50 px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 md:gap-3 cursor-pointer group" onClick={() => onTabChange('home')}>
          <div className="w-8 h-8 md:w-10 md:h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-600/40 group-hover:scale-105 transition-transform">
            <i className="fas fa-bolt text-white text-base md:text-xl"></i>
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-0.5 md:gap-3">
            <span className="text-lg md:text-2xl font-black tracking-tighter text-white uppercase italic logo-font leading-none">
              ADIXO <span className="text-indigo-500">TOPUP</span>
            </span>
            
            {/* Refined Live Indicator Badge - Matching Screenshot */}
            <div className="flex items-center gap-1.5 bg-black/60 border border-indigo-500 px-2 py-0.5 md:py-1 rounded-[4px] shadow-[0_0_10px_rgba(79,70,229,0.3)] w-fit transition-all hover:border-indigo-400">
              <div className="flex items-center justify-center">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.8)]"></span>
                </span>
              </div>
              <span className="text-green-500 text-[8px] md:text-[9px] font-black uppercase tracking-[0.15em] leading-none gaming-font">Live</span>
            </div>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-zinc-400 font-bold uppercase tracking-widest text-xs">
          <button 
            onClick={() => onTabChange('home')}
            className={`hover:text-white transition-all py-1 ${activeTab === 'home' ? 'text-white border-b-2 border-indigo-500' : ''}`}
          >
            Home
          </button>
          <button 
            onClick={() => onTabChange('games')}
            className={`hover:text-white transition-all py-1 ${activeTab === 'games' ? 'text-white border-b-2 border-indigo-500' : ''}`}
          >
            Games
          </button>
          <a 
            href="https://t.me/AdiXO_TV"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-all py-1 flex items-center gap-2"
          >
            Support
            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse"></span>
          </a>
        </nav>

        <div className="flex items-center gap-3 md:gap-4">
          <div className="relative flex items-center" ref={searchRef}>
            {isSearchOpen ? (
              <div className="flex items-center bg-zinc-950 border border-indigo-500/50 rounded-xl overflow-hidden animate-in slide-in-from-right-4 duration-300">
                <input 
                  autoFocus
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="bg-transparent text-white px-3 py-1.5 text-[10px] md:text-xs font-bold focus:outline-none w-24 md:w-48"
                />
                <button 
                  onClick={() => { onSearchChange(''); setIsSearchOpen(false); }}
                  className="px-2 py-1.5 text-zinc-500 hover:text-white"
                >
                  <i className="fas fa-times text-[10px]"></i>
                </button>
              </div>
            ) : (
              <button 
                onClick={() => { setIsSearchOpen(true); onTabChange('games'); }}
                className="p-2 md:p-2.5 text-zinc-400 hover:text-white transition-colors border border-zinc-800 rounded-lg md:rounded-xl bg-zinc-900/50"
              >
                <i className="fas fa-search text-sm md:text-base"></i>
              </button>
            )}
          </div>
          
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <div 
                className="flex items-center gap-2 md:gap-3 pl-3 md:pl-4 border-l border-zinc-800/50 cursor-pointer group"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                <div className="hidden lg:block text-right">
                  <p className="text-white text-xs font-black uppercase italic tracking-tighter truncate max-w-[120px]">{user.name}</p>
                  <p className="text-[9px] text-indigo-500 font-bold uppercase tracking-widest">Elite Agent</p>
                </div>
                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full border-2 overflow-hidden shadow-lg transition-all ${isProfileOpen ? 'border-white ring-4 ring-indigo-500/30' : 'border-indigo-500 shadow-indigo-500/20'}`}>
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                </div>
              </div>

              {isProfileOpen && (
                <div className="absolute right-0 mt-4 w-64 md:w-72 bg-black rounded-2xl border border-zinc-800/80 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-[100]">
                  <div className="p-4 md:p-5 border-b border-zinc-800/50 bg-zinc-900/40">
                    <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-1">Authenticated via Grid</p>
                    <p className="text-white font-bold text-sm truncate">{user.email}</p>
                  </div>
                  <div className="p-2">
                    <button 
                      onClick={() => handleMenuAction('profile')}
                      className="w-full flex items-center gap-3 px-4 py-3 text-zinc-400 hover:text-white hover:bg-zinc-800/50 rounded-xl transition-all group"
                    >
                      <i className="fas fa-user-shield text-indigo-500 group-hover:scale-110 transition-transform w-5 text-center"></i>
                      <span className="text-xs font-bold uppercase tracking-wider">Profile Protocol</span>
                    </button>
                    <button 
                      onClick={() => handleMenuAction('history')}
                      className="w-full flex items-center gap-3 px-4 py-3 text-zinc-400 hover:text-white hover:bg-zinc-800/50 rounded-xl transition-all group"
                    >
                      <i className="fas fa-history text-indigo-500 group-hover:rotate-[-15deg] transition-transform w-5 text-center"></i>
                      <span className="text-xs font-bold uppercase tracking-wider">Mission Log</span>
                    </button>
                    <button 
                      onClick={() => handleMenuAction('history')}
                      className="w-full flex items-center gap-3 px-4 py-3 text-zinc-400 hover:text-white hover:bg-zinc-800/50 rounded-xl transition-all group"
                    >
                      <i className="fas fa-receipt text-indigo-500 group-hover:scale-110 transition-transform w-5 text-center"></i>
                      <span className="text-xs font-bold uppercase tracking-wider">Transactions</span>
                    </button>
                  </div>
                  <div className="p-2 bg-zinc-950 border-t border-zinc-800/50">
                    <button 
                      onClick={handleLogoutAction}
                      className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-all group"
                    >
                      <div className="w-5 flex justify-center">
                        <i className="fas fa-power-off group-hover:rotate-90 transition-transform"></i>
                      </div>
                      <span className="text-xs font-black uppercase tracking-widest">LOG OUT</span>
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
              Login
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full flex flex-col">
        <div className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-6 py-6 md:py-8">
          {children}
        </div>
        
        {/* Footer */}
        <Footer />
      </main>

      {/* Mobile Footer Nav */}
      <footer className="md:hidden sticky bottom-0 z-50 glass-card border-t border-zinc-800/50 px-6 py-3 flex justify-around">
        <button onClick={() => onTabChange('home')} className={`flex flex-col items-center gap-1 ${activeTab === 'home' ? 'text-indigo-500' : 'text-zinc-500'}`}>
          <i className="fas fa-home"></i>
          <span className="text-[10px] font-black uppercase tracking-tighter">Home</span>
        </button>
        <button onClick={() => onTabChange('games')} className={`flex flex-col items-center gap-1 ${activeTab === 'games' ? 'text-indigo-500' : 'text-zinc-500'}`}>
          <i className="fas fa-gamepad"></i>
          <span className="text-[10px] font-black uppercase tracking-tighter">Games</span>
        </button>
        <a href="https://t.me/AdiXO_TV" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1 text-zinc-500">
          <i className="fas fa-headset"></i>
          <span className="text-[10px] font-black uppercase tracking-tighter">Support</span>
        </a>
        <button onClick={user ? () => setIsProfileOpen(true) : () => onOpenAuth('login')} className={`flex flex-col items-center gap-1 ${user ? 'text-indigo-500' : 'text-zinc-500'}`}>
          <i className={user ? 'fas fa-user' : 'fas fa-sign-in-alt'}></i>
          <span className="text-[10px] font-black uppercase tracking-tighter">{user ? 'Account' : 'Login'}</span>
        </button>
      </footer>
    </div>
  );
};

export default Layout;