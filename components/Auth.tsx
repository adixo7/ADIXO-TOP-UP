import React, { useState } from 'react';
import { User } from '../types';

interface AuthProps {
  onLogin: (user: User) => void;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

const Auth: React.FC<AuthProps> = ({ onLogin, onClose, initialMode = 'login' }) => {
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * DATABASE SIMULATION PROTOCOL
   * In a production environment, this would call a secure backend API.
   * For this mission, we use a global 'adixo_db_users' grid in localStorage.
   */
  const getStoredUsers = () => {
    const usersJson = localStorage.getItem('adixo_db_users');
    return usersJson ? JSON.parse(usersJson) : {};
  };

  const saveUserToGrid = (email: string, userData: any) => {
    const users = getStoredUsers();
    users[email.toLowerCase().trim()] = userData;
    localStorage.setItem('adixo_db_users', JSON.stringify(users));
  };

  const checkEmailExists = (email: string) => {
    const users = getStoredUsers();
    return !!users[email.toLowerCase().trim()];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const normalizedEmail = email.toLowerCase().trim();
    const users = getStoredUsers();

    // Artificial latency for "Neural Authentication" feel
    setTimeout(() => {
      if (isLogin) {
        // LOGIN PROTOCOL
        const existingUser = users[normalizedEmail];
        
        if (!existingUser) {
          setError("GRID ERROR: Account not found. Please register first.");
          setIsLoading(false);
          return;
        }
        
        if (existingUser.password !== password) {
          setError("SECURITY BREACH: Invalid password code."); 
          setIsLoading(false);
          return;
        }
        
        // Success: Login
        onLogin({
          id: existingUser.id,
          name: existingUser.name,
          email: normalizedEmail,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(existingUser.name)}&background=f97316&color=fff&bold=true`,
          registeredDate: existingUser.registeredDate || 'Mission Legacy'
        });
      } else {
        // REGISTER PROTOCOL
        
        // CRITICAL: Ensure unique email (1 Gmail = 1 Account)
        if (checkEmailExists(normalizedEmail)) {
          setError("DUPLICATE DETECTED: An account is already linked to this Gmail.");
          setIsLoading(false);
          return;
        }
        
        const registeredDate = new Date().toLocaleDateString('en-US', { 
          year: 'numeric', month: 'long', day: 'numeric' 
        });

        // Generate a stable 8-digit numeric Agent ID
        const numericId = Math.floor(10000000 + Math.random() * 90000000).toString();

        // Save entry to the global database
        const newUser = { 
          id: numericId,
          name, 
          email: normalizedEmail, 
          password, 
          registeredDate 
        };
        
        saveUserToGrid(normalizedEmail, newUser);
        
        // Success: Initialize Session
        onLogin({
          id: numericId,
          name: name,
          email: normalizedEmail,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=f97316&color=fff&bold=true`,
          registeredDate: registeredDate
        });
      }
      setIsLoading(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-[#0c0c0e] border border-zinc-800 p-6 rounded-[2rem] max-w-[320px] w-full relative shadow-[0_0_50px_-12px_rgba(249,115,22,0.5)] scale-90 sm:scale-100">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-zinc-600 hover:text-white transition-colors p-2"
        >
          <i className="fas fa-times text-lg"></i>
        </button>
        
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-orange-600 rounded-[1.25rem] flex items-center justify-center mx-auto mb-4 shadow-xl shadow-orange-600/30 transform group-hover:rotate-12 transition-transform">
            <i className={`fas ${isLogin ? 'fa-fingerprint' : 'fa-id-card'} text-white text-2xl`}></i>
          </div>
          <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-1">
            {isLogin ? 'LOG IN' : 'SIGN UP'}
          </h2>
          <p className="text-orange-500 text-[8px] font-black uppercase tracking-[0.3em] animate-pulse">
            Neural Authentication v3.1
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
            <i className="fas fa-shield-virus text-red-500 mt-0.5 text-xs"></i>
            <p className="text-[9px] font-black text-red-500 uppercase tracking-widest leading-tight">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-1">Agent Name</label>
              <input 
                type="text" 
                value={name}
                disabled={isLoading}
                onChange={(e) => { setName(e.target.value); setError(null); }}
                placeholder="Ex: Ghost Striker"
                className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-all font-bold text-xs shadow-inner"
                required={!isLogin}
              />
            </div>
          )}
          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-1">Gmail / Email</label>
            <input 
              type="email" 
              value={email}
              disabled={isLoading}
              onChange={(e) => { setEmail(e.target.value); setError(null); }}
              placeholder="agent@gmail.com"
              className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-all font-bold text-xs shadow-inner"
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-1">Security Code</label>
            <input 
              type="password" 
              value={password}
              disabled={isLoading}
              onChange={(e) => { setPassword(e.target.value); setError(null); }}
              placeholder="••••••••"
              className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-all font-bold text-xs shadow-inner"
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-black py-4 rounded-xl uppercase tracking-[0.2em] text-[10px] transition-all shadow-xl shadow-orange-600/20 active:scale-95 mt-2 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <i className="fas fa-spinner fa-spin text-xs"></i>
                Verifying...
              </>
            ) : (
              isLogin ? 'Initialize Session' : 'Create Account'
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-zinc-800/50 text-center">
          <p className="text-zinc-500 text-[9px] font-black uppercase tracking-widest">
            {isLogin ? "No identity found?" : "Already registered?"}
            <button 
              onClick={() => { setIsLogin(!isLogin); setError(null); }} 
              disabled={isLoading}
              className="text-orange-500 ml-2 hover:text-orange-400 font-black"
            >
              {isLogin ? 'Register' : 'Access Session'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;