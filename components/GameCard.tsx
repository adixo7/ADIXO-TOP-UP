import React from 'react';
import { Game } from '../types';

interface GameCardProps {
  game: Game;
  onClick: (game: Game) => void;
}

const GameCard: React.FC<GameCardProps> = ({ game, onClick }) => {
  return (
    <div 
      onClick={() => onClick(game)}
      className="game-card group cursor-pointer bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800 transition-all duration-300 shadow-md hover:-translate-y-1 hover:shadow-[0_10px_25px_-5px_rgba(249,115,22,0.3)]"
    >
      <div className="aspect-square overflow-hidden relative">
        <img 
          src={game.image} 
          alt={game.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(game.name)}&background=18181b&color=f97316&bold=true`;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        {game.id === 'pc-games' && (
          <div className="absolute top-1.5 right-1.5 z-20 bg-red-600 text-white text-[5px] font-black px-1 py-0.5 rounded-full uppercase tracking-tighter border border-red-500/50">
            30% OFF
          </div>
        )}
        <div className="absolute bottom-2 left-2 right-2">
          <p className="text-orange-400 text-[6px] md:text-[8px] font-black uppercase tracking-widest mb-1">{game.category}</p>
          <h3 className="text-white text-[9px] md:text-[11px] font-black uppercase italic tracking-tighter leading-none truncate group-hover:text-orange-300 transition-colors">
            {game.name}
          </h3>
        </div>
      </div>
      <div className="p-2 flex items-center justify-between bg-zinc-900">
        <span className="text-orange-500 font-black text-[10px] md:text-xs italic uppercase">Top-Up</span>
        <i className="fas fa-chevron-right text-[8px] text-zinc-600 group-hover:text-orange-500 transition-colors"></i>
      </div>
    </div>
  );
};

export default GameCard;