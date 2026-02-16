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
      className="game-card group cursor-pointer bg-zinc-900 rounded-xl md:rounded-2xl overflow-hidden border border-zinc-800 transition-all duration-300 shadow-lg shadow-black/40"
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
        <div className="absolute bottom-2 left-2 right-2 md:bottom-3 md:left-3 md:right-3 lg:bottom-4 lg:left-4 lg:right-4">
          <p className="text-orange-400 text-[6px] md:text-[8px] lg:text-[9px] font-black uppercase tracking-widest mb-0.5">{game.category}</p>
          <h3 className="text-white text-[9px] md:text-xs lg:text-sm font-black uppercase italic tracking-tighter leading-none truncate group-hover:text-orange-300 transition-colors">
            {game.name}
          </h3>
        </div>
      </div>
      <div className="p-1.5 md:p-2 lg:p-3 flex items-center justify-between border-t border-zinc-800/50 bg-zinc-900/80">
        <span className="text-zinc-500 text-[6px] md:text-[7px] lg:text-[9px] font-black uppercase tracking-[0.15em]">Instant</span>
        <div className="flex gap-0.5">
          <i className="fas fa-star text-yellow-500 text-[5px] md:text-[7px] lg:text-[8px]"></i>
          <i className="fas fa-star text-yellow-500 text-[5px] md:text-[7px] lg:text-[8px]"></i>
          <i className="fas fa-star text-yellow-500 text-[5px] md:text-[7px] lg:text-[8px]"></i>
          <i className="fas fa-star text-yellow-500 text-[5px] md:text-[7px] lg:text-[8px]"></i>
          <i className="fas fa-star text-yellow-500 text-[5px] md:text-[7px] lg:text-[8px]"></i>
        </div>
      </div>
    </div>
  );
};

export default GameCard;