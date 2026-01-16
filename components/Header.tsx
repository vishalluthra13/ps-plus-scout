
import React from 'react';

interface HeaderProps {
  date: string;
  onRefresh: () => void;
  isLoading: boolean;
}

const Header: React.FC<HeaderProps> = ({ date, onRefresh, isLoading }) => {
  return (
    <header className="sticky top-0 z-50 bg-[#00040f]/90 backdrop-blur-lg border-b border-white/5 px-4 py-3">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-6h2v6zm0-8h-2V7h2v2zm4 8h-2v-6h2v6zm0-8h-2V7h2v2z"/>
            </svg>
          </div>
          <h1 className="text-lg font-black text-white tracking-tighter uppercase">Scout</h1>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[10px] font-bold text-slate-500 bg-white/5 px-2 py-1 rounded uppercase">India</span>
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className={`p-2 rounded-full transition-all ${
              isLoading ? 'opacity-50' : 'hover:bg-white/10 active:scale-90'
            }`}
          >
            <svg className={`w-5 h-5 text-blue-500 ${isLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
