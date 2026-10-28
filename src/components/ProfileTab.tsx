import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Wallet, 
  Trophy, 
  Gamepad2, 
  Skull, 
  Edit3, 
  Phone, 
  CreditCard, 
  Mail, 
  LogOut,
  Sparkles,
  Flame
} from 'lucide-react';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { levelProgress } from '../leaderboard';

export const ProfileTab: React.FC = () => {
  const { profile, currentUser, openModal, setActiveTab, logout } = useAuth();
  const [xp, setXp] = useState<number | null>(null);

  useEffect(() => {
    if (!currentUser) return;
    let cancelled = false;
    (async () => {
      try {
        const snap = await getDoc(doc(db, 'leaderboard', currentUser.uid));
        if (!cancelled) setXp(snap.exists() ? (snap.data().xp || 0) : 0);
      } catch {
        if (!cancelled) setXp(0);
      }
    })();
    return () => { cancelled = true; };
  }, [currentUser]);

  if (!profile || !currentUser) {
    return (
      <div className="bg-[#161A2E] border border-[#252B47] rounded-2xl p-10 text-center max-w-md mx-auto space-y-4">
        <div className="w-16 h-16 mx-auto rounded-full bg-[#F5A623]/10 border border-[#F5A623]/30 flex items-center justify-center text-3xl">
          👑
        </div>
        <h2 className="font-heading font-black text-2xl uppercase text-[#EEF0FF]">
          Login Required
        </h2>
        <p className="text-xs text-[#7A84A8] leading-relaxed">
          Please login to view your player statistics, manage your wallet balance, and track tournament registrations.
        </p>
        <button
          onClick={() => openModal('login')}
          className="w-full py-3 bg-gradient-to-r from-[#F5A623] to-[#D4891C] text-black font-heading font-black text-base uppercase tracking-wider rounded-xl shadow-lg shadow-[#F5A623]/25 hover:brightness-110"
        >
          Login with Google
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Player Header Card */}
      <div className="bg-gradient-to-br from-[#161A2E] via-[#1E2340] to-[#0F1220] border border-[#F5A623]/30 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          {/* Avatar */}
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#F5A623] to-[#D4891C] p-1 flex items-center justify-center shadow-lg shadow-[#F5A623]/25">
              {profile.photo ? (
                <img
                  src={profile.photo}
                  alt={profile.name}
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <div className="w-full h-full bg-[#0F1220] rounded-xl flex items-center justify-center text-3xl font-black text-[#F5A623]">
                  {profile.name.charAt(0) || 'P'}
                </div>
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#2ECC71] border-2 border-[#161A2E]" />
          </div>

          {/* Details */}
          <div className="flex-1 text-center sm:text-left space-y-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h1 className="font-heading font-black text-2xl sm:text-3xl text-[#EEF0FF] uppercase">
                {profile.name}
              </h1>
              <span className="inline-flex items-center gap-1 bg-[#F5A623]/15 text-[#F5A623] border border-[#F5A623]/30 text-[10px] font-tech font-bold uppercase px-2.5 py-0.5 rounded-full self-center sm:self-auto">
                <Sparkles className="w-3 h-3" /> Clutch Pro Player
              </span>
              {xp !== null && (
                <span className="inline-flex items-center gap-1 bg-[#4A9EFF]/15 text-[#4A9EFF] border border-[#4A9EFF]/30 text-[10px] font-tech font-bold uppercase px-2.5 py-0.5 rounded-full self-center sm:self-auto">
                  <Flame className="w-3 h-3" /> Level {levelProgress(xp).level}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-1 gap-x-4 text-xs text-[#7A84A8] pt-2">
              <div className="flex items-center justify-center sm:justify-start gap-1.5">
                <span className="text-[#EEF0FF] font-tech font-bold">Game UID:</span>
                <span className="text-[#F5A623] font-mono font-bold">{profile.gameUID}</span>
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#2ECC71]" />
                <span>{profile.whatsapp}</span>
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-[#4A9EFF]" />
                <span>{profile.paymentMethod}: {profile.paymentAccount}</span>
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#7A84A8]" />
                <span className="truncate max-w-[180px]">{profile.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-6 border-t border-[#252B47]">
          <button
            onClick={() => setActiveTab('wallet')}
            className="flex items-center justify-center gap-2 bg-[#F5A623] text-black font-heading font-black text-sm uppercase tracking-wider py-3 rounded-xl hover:brightness-110 shadow-md shadow-[#F5A623]/20"
          >
            <Wallet className="w-4 h-4" />
            <span>Wallet (Rs {(profile.walletBalance || 0).toLocaleString()})</span>
          </button>

          <button
            onClick={() => openModal('editProfile')}
            className="flex items-center justify-center gap-2 bg-[#1E2340] border border-[#252B47] text-[#EEF0FF] font-heading font-bold text-sm uppercase tracking-wider py-3 rounded-xl hover:bg-[#252B47] hover:border-[#7A84A8]"
          >
            <Edit3 className="w-4 h-4 text-[#F5A623]" />
            <span>Edit Profile</span>
          </button>

          <button
            onClick={logout}
            className="flex items-center justify-center gap-2 bg-[#1E2340] border border-[#E74C3C]/30 text-[#E74C3C] font-heading font-bold text-sm uppercase tracking-wider py-3 rounded-xl hover:bg-[#E74C3C]/10"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Level / XP Progress */}
      {xp !== null && (() => {
        const lp = levelProgress(xp);
        return (
          <div className="bg-[#161A2E] border border-[#252B47] rounded-2xl p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 font-heading font-black text-lg text-[#EEF0FF] uppercase">
                <Flame className="w-5 h-5 text-[#4A9EFF]" />
                Level {lp.level}
              </div>
              <div className="text-xs text-[#7A84A8] font-tech">
                {xp.toLocaleString()} XP
                {lp.xpNeeded > 0 && ` · ${lp.xpNeeded.toLocaleString()} XP to Level ${lp.level + 1}`}
              </div>
            </div>
            <div className="w-full h-2.5 bg-[#0F1220] rounded-full overflow-hidden border border-[#252B47]">
              <div
                className="h-full bg-gradient-to-r from-[#4A9EFF] to-[#2ECC71] rounded-full transition-all"
                style={{ width: `${Math.round(lp.progress * 100)}%` }}
              />
            </div>
          </div>
        );
      })()}

      {/* Lifetime Gaming Stats */}
      <div>
        <h2 className="font-heading font-black text-xl uppercase tracking-wider mb-3 text-[#EEF0FF]">
          📊 Lifetime Esports Record
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-[#161A2E] border border-[#252B47] rounded-xl p-4 text-center">
            <div className="w-10 h-10 mx-auto rounded-lg bg-[#2ECC71]/10 text-[#2ECC71] flex items-center justify-center mb-2">
              <Trophy className="w-5 h-5" />
            </div>
            <div className="font-heading font-black text-2xl text-[#2ECC71]">
              Rs {(profile.totalEarnings || 0).toLocaleString()}
            </div>
            <div className="text-xs text-[#7A84A8]">Total Earnings</div>
          </div>

          <div className="bg-[#161A2E] border border-[#252B47] rounded-xl p-4 text-center">
            <div className="w-10 h-10 mx-auto rounded-lg bg-[#F5A623]/10 text-[#F5A623] flex items-center justify-center mb-2">
              👑
            </div>
            <div className="font-heading font-black text-2xl text-[#F5A623]">
              {profile.tournamentsWon || 0}
            </div>
            <div className="text-xs text-[#7A84A8]">Tournaments Won</div>
          </div>

          <div className="bg-[#161A2E] border border-[#252B47] rounded-xl p-4 text-center">
            <div className="w-10 h-10 mx-auto rounded-lg bg-[#4A9EFF]/10 text-[#4A9EFF] flex items-center justify-center mb-2">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <div className="font-heading font-black text-2xl text-[#4A9EFF]">
              {profile.tournamentsPlayed || 0}
            </div>
            <div className="text-xs text-[#7A84A8]">Matches Played</div>
          </div>

          <div className="bg-[#161A2E] border border-[#252B47] rounded-xl p-4 text-center">
            <div className="w-10 h-10 mx-auto rounded-lg bg-[#E74C3C]/10 text-[#E74C3C] flex items-center justify-center mb-2">
              <Skull className="w-5 h-5" />
            </div>
            <div className="font-heading font-black text-2xl text-[#E74C3C]">
              {profile.totalKills || 0}
            </div>
            <div className="text-xs text-[#7A84A8]">Total Kills</div>
          </div>
        </div>
      </div>
    </div>
  );
};
