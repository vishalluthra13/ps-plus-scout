
import React, { useState, useEffect } from 'react';

const Loader: React.FC = () => {
  const messages = [
    "Scouting the PS Plus Extra library...",
    "Comparing with your trophies and history...",
    "Checking latest catalog updates in India...",
    "Finding highly-rated multiplayer titles...",
    "Curating the best couch co-op experiences...",
    "Verifying monthly essential games...",
    "Finalizing your daily selection..."
  ];

  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex(prev => (prev + 1) % messages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[60] bg-[#00040f] flex flex-col items-center justify-center p-6 text-center">
      <div className="relative mb-8">
        <div className="w-24 h-24 border-4 border-blue-500/20 rounded-full animate-ping absolute inset-0"></div>
        <div className="w-24 h-24 border-t-4 border-blue-600 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
           <svg className="w-10 h-10 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
             <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-6h2v6zm0-8h-2V7h2v2zm4 8h-2v-6h2v6zm0-8h-2V7h2v2z"/>
           </svg>
        </div>
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">Analyzing the PlayStation Store</h2>
      <p className="text-blue-400 font-medium animate-pulse">{messages[msgIndex]}</p>
      
      <div className="mt-12 max-w-sm w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
        <div className="bg-blue-600 h-full animate-[loading_10s_ease-in-out_infinite]" style={{ width: '100%' }}></div>
      </div>
      
      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default Loader;
