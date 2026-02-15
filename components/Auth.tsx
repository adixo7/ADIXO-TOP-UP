
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create a stable ID derived from the email to ensure persistence of history
    // We use a simple base64-like encoding of the email to keep it consistent
    const stableId = btoa(email.toLowerCase()).substring(0, 12);

    const user: User = {
      id: stableId,
      name: isLogin ? email.split('@')[0] : name,
      email: email,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(isLogin ? email : name)}&background=6366f1&color=fff&bold=true`
    };
    onLogin(user);
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

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-1">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Full Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Striker Name"
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
              onChange={(e) => setEmail(e.target.value)}
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
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors font-bold text-sm"
              required
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-xl uppercase tracking-[0.2em] text-xs transition-all shadow-lg shadow-indigo-600/20 active:scale-95 mt-4"
          >
            {isLogin ? 'Initialize Session' : 'Create Protocol'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-zinc-800/50 text-center">
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">
            {isLogin ? "No account found?" : "Already registered?"}
            <button 
              onClick={() => setIsLogin(!isLogin)} 
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
