
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Simulated "Database" using localStorage
    const storedUsersKey = 'adixo_db_users';
    const usersJson = localStorage.getItem(storedUsersKey);
    const users = usersJson ? JSON.parse(usersJson) : {};

    if (isLogin) {
      // LOGIN PROTOCOL
      const normalizedEmail = email.toLowerCase().trim();
      const existingUser = users[normalizedEmail];
      
      if (!existingUser) {
        setError("Account not found. Please register first.");
        return;
      }
      
      if (existingUser.password !== password) {
        setError("Password wrong. Try again."); 
        return;
      }
      
      // Success: Login
      onLogin({
        id: existingUser.id,
        name: existingUser.name,
        email: email,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(existingUser.name)}&background=6366f1&color=fff&bold=true`,
        registeredDate: existingUser.registeredDate || 'Mission Legacy'
      });
    } else {
      // REGISTER PROTOCOL
      const normalizedEmail = email.toLowerCase().trim();
      if (users[normalizedEmail]) {
        setError("Email already registered in the grid.");
        return;
      }
      
      const registeredDate = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', month: 'long', day: 'numeric' 
      });

      // Generate a stable 8-digit numeric ID
      const numericId = Math.floor(10000000 + Math.random() * 90000000).toString();

      // Save all information to the "database"
      const newUser = { 
        id: numericId,
        name, 
        email: normalizedEmail, 
        password, 
        registeredDate 
      };
      
      users[normalizedEmail] = newUser;
      localStorage.setItem(storedUsersKey, JSON.stringify(users));
      
      // Success: Auto login after registration
      onLogin({
        id: numericId,
        name: name,
        email: email,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff&bold=true`,
        registeredDate: registeredDate
      });
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl max-w-sm w-full relative shadow-2xl">
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors"
        >
          <i className="fas fa-times text-xl"></i>
        </button>
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-600/20">
            <i className={`fas ${isLogin ? 'fa-lock' : 'fa-user-plus'} text-white text-2xl`}></i>
          </div>
          <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">
            {isLogin ? 'Login' : 'Register'}
          </h2>
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-1">
            Access the Adixo TopUp Grid
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <i className="fas fa-circle-exclamation text-red-500"></i>
            <p className="text-[10px] font-black text-red-500 uppercase tracking-widest leading-none">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-1">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Full Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => { setName(e.target.value); setError(null); }}
                placeholder="Enter your name"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors font-bold text-sm"
                required={!isLogin}
              />
            </div>
          )}
          <div className="space-y-1">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(null); }}
              placeholder="agent@gmail.com"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors font-bold text-sm"
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(null); }}
              placeholder="••••••••"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors font-bold text-sm"
              required
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-xl uppercase tracking-[0.2em] text-xs transition-all shadow-lg shadow-indigo-600/20 active:scale-95 mt-4"
          >
            {isLogin ? 'Initialize Session' : 'Create Account'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-zinc-800/50 text-center">
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">
            {isLogin ? "No account found?" : "Already registered?"}
            <button 
              onClick={() => { setIsLogin(!isLogin); setError(null); }} 
              className="text-indigo-500 ml-2 hover:text-indigo-400"
            >
              {isLogin ? 'Register Here' : 'Login Here'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
