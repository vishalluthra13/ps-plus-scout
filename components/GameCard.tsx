
import React from 'react';
import { Game } from '../types';

interface GameCardProps {
  game: Game;
}

const GameCard: React.FC<GameCardProps> = ({ game }) => {
  return (
    <div className="group relative bg-[#0f172a] rounded-2xl overflow-hidden border border-white/5 hover:border-blue-500/50 transition-all duration-300 flex flex-col h-full shadow-2xl">
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={game.imageUrl || `https://picsum.photos/seed/${game.id}/600/338`} 
          alt={game.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          {game.platform.map(p => (
            <span key={p} className="px-2 py-0.5 bg-blue-600 text-[10px] font-black rounded text-white shadow-lg uppercase">
              {p}
            </span>
          ))}
        </div>
        <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur px-3 py-1 rounded-full flex items-center gap-1.5 border border-white/10 shadow-lg">
          <div className="w-4 h-4 text-yellow-400">
            <svg fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
          </div>
          <span className="text-sm font-bold text-white">{game.rating}</span>
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1">{game.title}</h3>
        </div>
        <p className="text-xs text-blue-400 font-bold uppercase tracking-wider mb-4">{game.genre}</p>
        
        <div className="mb-4 flex-grow">
          <p className="text-slate-400 text-sm leading-relaxed line-clamp-4">
            {game.whyPlay}
          </p>
        </div>

        <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs font-medium">{game.playtime || '40+ hours'}</span>
          </div>
          <button className="text-blue-500 hover:text-blue-400 text-sm font-bold flex items-center gap-1 group/btn">
            View on PS Store
            <svg className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameCard;
