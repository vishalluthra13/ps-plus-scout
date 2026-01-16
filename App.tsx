
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { DailyRecommendations, GameCategory } from './types';
import { getDailyRecommendations } from './services/geminiService';
import Header from './components/Header';
import CategorySection from './components/CategorySection';
import Loader from './components/Loader';

const App: React.FC = () => {
  const [data, setData] = useState<DailyRecommendations | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'Daily' | 'Single' | 'Multi' | 'Couch'>('Daily');

  const fetchDailyPicks = useCallback(async (force = false) => {
    setLoading(true);
    setError(null);
    try {
      const today = new Date().toLocaleDateString('en-IN');
      const cached = localStorage.getItem('ps_picks_v1');
      
      if (!force && cached) {
        const parsed = JSON.parse(cached) as DailyRecommendations;
        if (parsed.date === today) {
          setData(parsed);
          setLoading(false);
          return;
        }
      }

      console.log("Fetching fresh recommendations from Gemini...");
      const recommendations = await getDailyRecommendations();
      setData(recommendations);
      localStorage.setItem('ps_picks_v1', JSON.stringify(recommendations));
    } catch (err: any) {
      console.error("Fetch failed details:", err);
      // provide more useful error context
      const msg = err?.message?.includes("401") 
        ? "API Key invalid. Check Vercel settings." 
        : "Sync failed. Please try again in a few minutes.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDailyPicks();
  }, [fetchDailyPicks]);

  const scrollToSection = (tab: typeof activeTab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading && !data) return <Loader />;

  return (
    <div className="min-h-screen bg-[#00040f] text-slate-200 pb-24">
      <Header 
        date={data?.date || new Date().toLocaleDateString('en-IN')} 
        onRefresh={() => fetchDailyPicks(true)}
        isLoading={loading}
      />

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-2xl text-red-400 flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm font-medium">{error}</p>
            </div>
            <p className="text-[10px] opacity-50 ml-8">Check the browser console (F12) for technical details.</p>
          </div>
        )}

        {activeTab === 'Daily' && (
          <div className="mb-10 text-center md:text-left">
            <h1 className="text-3xl md:text-5xl font-black text-white mb-3 tracking-tight">
              Level Up Your <span className="text-blue-600 underline decoration-blue-500/30">Library</span>.
            </h1>
            <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto md:mx-0">
              Personalized picks based on your love for PlayStation cinematic hits and competitive classics.
            </p>
          </div>
        )}

        {data && (
          <div className="space-y-4">
            {(activeTab === 'Daily' || activeTab === 'Single') && (
              <CategorySection 
                title="Single Player"
                category={GameCategory.SINGLE_PLAYER}
                games={data.games}
                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
              />
            )}

            {(activeTab === 'Daily' || activeTab === 'Multi') && (
              <CategorySection 
                title="Online Multiplayer"
                category={GameCategory.MULTIPLAYER}
                games={data.games}
                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
              />
            )}

            {(activeTab === 'Daily' || activeTab === 'Couch') && (
              <CategorySection 
                title="Split-screen/Couch"
                category={GameCategory.COUCH_COOP}
                games={data.games}
                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>}
              />
            )}

            {activeTab === 'Daily' && data.sources && data.sources.length > 0 && (
              <div className="mt-12 pt-6 border-t border-white/5 opacity-60">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Live Intelligence Sources</h3>
                <div className="flex flex-wrap gap-3">
                  {data.sources.slice(0, 3).map((source, idx) => (
                    <a key={idx} href={source.web.uri} target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-500 hover:underline">{source.title}</a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#00040f]/95 backdrop-blur-xl border-t border-white/10 px-4 pb-safe pt-2">
        <div className="max-w-md mx-auto flex justify-between items-center">
          <NavButton 
            active={activeTab === 'Daily'} 
            onClick={() => scrollToSection('Daily')}
            label="Feed"
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l4 4v10a2 2 0 01-2 2z" /></svg>}
          />
          <NavButton 
            active={activeTab === 'Single'} 
            onClick={() => scrollToSection('Single')}
            label="Single"
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
          />
          <NavButton 
            active={activeTab === 'Multi'} 
            onClick={() => scrollToSection('Multi')}
            label="Online"
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857" /></svg>}
          />
          <NavButton 
            active={activeTab === 'Couch'} 
            onClick={() => scrollToSection('Couch')}
            label="Couch"
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2" /></svg>}
          />
        </div>
      </nav>
    </div>
  );
};

const NavButton = ({ active, onClick, label, icon }: { active: boolean, onClick: () => void, label: string, icon: React.ReactNode }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center gap-1 py-2 px-4 transition-all duration-200 active:scale-90 ${active ? 'text-blue-500' : 'text-slate-500'}`}
  >
    <div className={`${active ? 'scale-110' : 'scale-100'} transition-transform`}>{icon}</div>
    <span className="text-[10px] font-bold uppercase tracking-tighter">{label}</span>
  </button>
);

export default App;
