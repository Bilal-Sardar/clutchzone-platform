import React from 'react';
import { useAuth } from '../context/AuthContext';
import czLogo from '../assets/images/clutchzone_logo_1787204355803.jpg';
import { Wallet, LogIn, User, LogOut, MessageSquareText } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { profile, activeTab, setActiveTab, openModal, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0F1220]/95 backdrop-blur-md border-b border-[#F5A623]/20 shadow-lg">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
        {/* Brand */}
        <div 
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-[#F5A623]/40 shadow-md shadow-[#F5A623]/20 group-hover:scale-105 group-hover:border-[#F5A623] transition-all bg-[#161A2E] shrink-0">
            <img
              src={czLogo}
              alt="ClutchZone Tournament Logo"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="font-heading font-black text-2xl tracking-wider uppercase leading-none">
              CLUTCH <span className="text-[#F5A623]">ZONE</span>
            </div>
            <div className="text-[10px] font-tech font-bold uppercase tracking-widest text-[#7A84A8] leading-none mt-1">
              CZT Free Fire Esports
            </div>
          </div>
        </div>

        {/* Desktop / Tablet Nav Links */}
        <nav className="hidden md:flex items-center gap-1.5 bg-[#161A2E]/80 border border-[#252B47] px-2 py-1 rounded-full text-xs font-tech font-bold uppercase tracking-wider">
          <button
            onClick={() => setActiveTab('home')}
            className={`px-3.5 py-1.5 rounded-full transition-colors ${
              activeTab === 'home'
                ? 'bg-[#F5A623] text-black shadow-sm'
                : 'text-[#7A84A8] hover:text-[#EEF0FF]'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => setActiveTab('tournaments')}
            className={`px-3.5 py-1.5 rounded-full transition-colors ${
              activeTab === 'tournaments'
                ? 'bg-[#F5A623] text-black shadow-sm'
                : 'text-[#7A84A8] hover:text-[#EEF0FF]'
            }`}
          >
            Tournaments
          </button>
          <button
            onClick={() => setActiveTab('wallet')}
            className={`px-3.5 py-1.5 rounded-full transition-colors ${
              activeTab === 'wallet'
                ? 'bg-[#F5A623] text-black shadow-sm'
                : 'text-[#7A84A8] hover:text-[#EEF0FF]'
            }`}
          >
            Wallet
          </button>
          <button
            onClick={() => setActiveTab('results')}
            className={`px-3.5 py-1.5 rounded-full transition-colors ${
              activeTab === 'results'
                ? 'bg-[#F5A623] text-black shadow-sm'
                : 'text-[#7A84A8] hover:text-[#EEF0FF]'
            }`}
          >
            Results
          </button>
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`px-3.5 py-1.5 rounded-full transition-colors ${
              activeTab === 'leaderboard'
                ? 'bg-[#F5A623] text-black shadow-sm'
                : 'text-[#7A84A8] hover:text-[#EEF0FF]'
            }`}
          >
            Leaderboard
          </button>
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Quick WhatsApp Help */}
          <button
            onClick={() => openModal('support')}
            title="Customer Support"
            className="w-8 h-8 rounded-lg bg-[#1E2340] border border-[#252B47] text-[#2ECC71] hover:text-white hover:bg-[#252B47] flex items-center justify-center transition-colors"
          >
            <MessageSquareText className="w-4 h-4" />
          </button>

          {profile ? (
            <div className="flex items-center gap-2">
              {/* Wallet Quick Balance Button */}
              <button
                onClick={() => setActiveTab('wallet')}
                className="flex items-center gap-1.5 bg-[#161A2E] border border-[#F5A623]/30 px-3 py-1.5 rounded-lg text-xs font-tech font-bold hover:border-[#F5A623] transition-colors"
              >
                <Wallet className="w-3.5 h-3.5 text-[#F5A623]" />
                <span className="text-[#F5A623]">Rs {(profile.walletBalance || 0).toLocaleString()}</span>
              </button>

              {/* Profile Pill */}
              <button
                onClick={() => setActiveTab('profile')}
                className="hidden sm:flex items-center gap-1.5 bg-[#1E2340] border border-[#252B47] px-3 py-1.5 rounded-lg text-xs font-medium text-[#EEF0FF] hover:border-[#7A84A8] transition-colors"
              >
                <User className="w-3.5 h-3.5 text-[#7A84A8]" />
                <span className="max-w-[100px] truncate">{profile.name}</span>
              </button>

              <button
                onClick={logout}
                title="Logout"
                className="p-1.5 rounded-lg bg-[#1E2340] border border-[#252B47] text-[#7A84A8] hover:text-[#E74C3C] hover:bg-[#252B47] transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => openModal('login')}
              className="flex items-center gap-1.5 bg-gradient-to-r from-[#F5A623] to-[#D4891C] text-black font-heading font-black text-sm uppercase tracking-wider px-4 py-1.5 rounded-lg shadow-md shadow-[#F5A623]/25 hover:brightness-110 active:scale-95 transition-all"
            >
              <LogIn className="w-4 h-4" />
              <span>Login</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
