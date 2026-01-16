
import React from 'react';
import { Game, GameCategory } from '../types';
import GameCard from './GameCard';

interface CategorySectionProps {
  title: string;
  category: GameCategory;
  games: Game[];
  icon: React.ReactNode;
}

const CategorySection: React.FC<CategorySectionProps> = ({ title, category, games, icon }) => {
  const filteredGames = games.filter(g => g.category === category);

  if (filteredGames.length === 0) return null;

  return (
    <section className="mb-16">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-blue-500">
          {icon}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <p className="text-slate-500 text-sm">Recommended for you today</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredGames.map(game => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </section>
  );
};

export default CategorySection;
