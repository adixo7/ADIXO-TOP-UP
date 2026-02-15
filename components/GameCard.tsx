
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
      className="game-card group cursor-pointer bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 transition-all duration-300"
    >
      <div className="aspect-square overflow-hidden relative">
        <img 
          src={game.image} 
          alt={game.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(game.name)}&background=18181b&color=6366f1&bold=true`;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
        <div className="absolute bottom-4 left-4 right-4">
          <p className="text-indigo-400 text-[10px] font-bold uppercase tracking-wider mb-1">{game.category}</p>
          <h3 className="text-white text-base font-bold leading-tight truncate">{game.name}</h3>
        </div>
      </div>
      <div className="p-3 flex items-center justify-between border-t border-zinc-800">
        <span className="text-zinc-500 text-[10px] font-medium uppercase tracking-widest">Instant</span>
        <div className="flex gap-0.5">
          <i className="fas fa-star text-yellow-500 text-[8px]"></i>
          <i className="fas fa-star text-yellow-500 text-[8px]"></i>
          <i className="fas fa-star text-yellow-500 text-[8px]"></i>
          <i className="fas fa-star text-yellow-500 text-[8px]"></i>
          <i className="fas fa-star text-yellow-500 text-[8px]"></i>
        </div>
      </div>
    </div>
  );
};

export default GameCard;
