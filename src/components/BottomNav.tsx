import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Home, Swords, Wallet, Trophy, Flame, User } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, profile } = useAuth();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0F1220]/95 backdrop-blur-xl border-t border-[#F5A623]/20 pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around h-15 px-2">
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
            activeTab === 'home'
              ? 'text-[#F5A623] scale-105 font-bold'
              : 'text-[#7A84A8] hover:text-[#EEF0FF]'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] uppercase font-tech tracking-wider">Home</span>
        </button>

        <button
          onClick={() => setActiveTab('tournaments')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
            activeTab === 'tournaments'
              ? 'text-[#F5A623] scale-105 font-bold'
              : 'text-[#7A84A8] hover:text-[#EEF0FF]'
          }`}
        >
          <Swords className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] uppercase font-tech tracking-wider">Matches</span>
        </button>

        <button
          onClick={() => setActiveTab('wallet')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
            activeTab === 'wallet'
              ? 'text-[#F5A623] scale-105 font-bold'
              : 'text-[#7A84A8] hover:text-[#EEF0FF]'
          }`}
        >
          <div className="relative">
            <Wallet className="w-5 h-5 mb-0.5" />
            {profile && (profile.walletBalance || 0) > 0 && (
              <span className="absolute -top-1 -right-2 w-2 h-2 rounded-full bg-[#2ECC71]" />
            )}
          </div>
          <span className="text-[10px] uppercase font-tech tracking-wider">Wallet</span>
        </button>

        <button
          onClick={() => setActiveTab('results')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
            activeTab === 'results'
              ? 'text-[#F5A623] scale-105 font-bold'
              : 'text-[#7A84A8] hover:text-[#EEF0FF]'
          }`}
        >
          <Trophy className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] uppercase font-tech tracking-wider">Results</span>
        </button>

        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
            activeTab === 'leaderboard'
              ? 'text-[#F5A623] scale-105 font-bold'
              : 'text-[#7A84A8] hover:text-[#EEF0FF]'
          }`}
        >
          <Flame className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] uppercase font-tech tracking-wider">Rank</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
            activeTab === 'profile'
              ? 'text-[#F5A623] scale-105 font-bold'
              : 'text-[#7A84A8] hover:text-[#EEF0FF]'
          }`}
        >
          <User className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] uppercase font-tech tracking-wider">Profile</span>
        </button>
      </div>
    </div>
  );
};
