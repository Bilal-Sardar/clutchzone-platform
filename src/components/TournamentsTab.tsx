import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Flame, 
  Search, 
  Trophy, 
  Users, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  Lock, 
  Skull,
  Filter
} from 'lucide-react';
import { Tournament } from '../types';

export const TournamentsTab: React.FC = () => {
  const { tournaments, profile, openModal } = useAuth();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'open' | 'registered' | 'squad'>('all');

  const activeTournamentsList = profile?.activeTournaments || [];

  const filteredTournaments = tournaments.filter(t => {
    const matchesSearch = 
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      (t.mode && t.mode.toLowerCase().includes(search.toLowerCase())) ||
      (t.map && t.map.toLowerCase().includes(search.toLowerCase()));

    const isRegistered = activeTournamentsList.includes(t.id);

    if (!matchesSearch) return false;
    if (filter === 'open') return t.status === 'open' && (t.joinedCount || 0) < (t.maxPlayers || 50);
    if (filter === 'registered') return isRegistered;
    if (filter === 'squad') return (t.mode || '').toLowerCase().includes('squad');
    return true;
  });

  const handleJoinClick = (t: Tournament) => {
    if (!profile) {
      openModal('login');
      return;
    }

    if (activeTournamentsList.includes(t.id)) {
      return;
    }

    openModal('joinConfirm', {
      tournamentId: t.id,
      tournamentName: t.name,
      entryFee: t.entryFee,
      joinedCount: t.joinedCount,
      maxPlayers: t.maxPlayers
    });
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-black text-3xl sm:text-4xl uppercase tracking-wider text-[#EEF0FF] flex items-center gap-2">
            <Flame className="w-8 h-8 text-[#F5A623]" />
            <span>Active Tournaments</span>
          </h1>
          <p className="text-xs text-[#7A84A8]">
            Join verified matches, secure your spot, and win cash prizes per kill.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-[#7A84A8] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search mode, map, title..."
            className="w-full bg-[#161A2E] border border-[#252B47] text-sm text-[#EEF0FF] pl-9 pr-3 py-2 rounded-xl focus:border-[#F5A623] focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-tech font-bold uppercase tracking-wider scrollbar-none">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
            filter === 'all'
              ? 'bg-[#F5A623] text-black font-black shadow-md shadow-[#F5A623]/20'
              : 'bg-[#161A2E] text-[#7A84A8] border border-[#252B47] hover:text-[#EEF0FF]'
          }`}
        >
          All Tournaments ({tournaments.length})
        </button>

        <button
          onClick={() => setFilter('open')}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
            filter === 'open'
              ? 'bg-[#2ECC71] text-black font-black shadow-md shadow-[#2ECC71]/20'
              : 'bg-[#161A2E] text-[#7A84A8] border border-[#252B47] hover:text-[#EEF0FF]'
          }`}
        >
          Open Slots
        </button>

        <button
          onClick={() => setFilter('squad')}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
            filter === 'squad'
              ? 'bg-[#4A9EFF] text-black font-black shadow-md shadow-[#4A9EFF]/20'
              : 'bg-[#161A2E] text-[#7A84A8] border border-[#252B47] hover:text-[#EEF0FF]'
          }`}
        >
          Squad / Clash
        </button>

        {profile && (
          <button
            onClick={() => setFilter('registered')}
            className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
              filter === 'registered'
                ? 'bg-[#F5A623] text-black font-black shadow-md shadow-[#F5A623]/20'
                : 'bg-[#161A2E] text-[#7A84A8] border border-[#252B47] hover:text-[#EEF0FF]'
            }`}
          >
            My Joined Matches ({activeTournamentsList.length})
          </button>
        )}
      </div>

      {/* Tournaments Grid */}
      {filteredTournaments.length === 0 ? (
        <div className="bg-[#161A2E] border border-[#252B47] rounded-2xl p-12 text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#1E2340] flex items-center justify-center text-3xl mb-4">
            🏆
          </div>
          <h3 className="font-heading font-bold text-xl uppercase text-[#EEF0FF] mb-1">
            No Tournaments Found
          </h3>
          <p className="text-xs text-[#7A84A8] max-w-sm mx-auto mb-4">
            No matches matching your search criteria. Try selecting another filter or check back later!
          </p>
          <button
            onClick={() => { setSearch(''); setFilter('all'); }}
            className="bg-[#1E2340] border border-[#252B47] text-[#F5A623] font-tech font-bold uppercase text-xs px-4 py-2 rounded-xl hover:bg-[#252B47]"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTournaments.map((t) => {
            const joined = t.joinedCount || 0;
            const max = t.maxPlayers || 50;
            const pct = Math.min(100, Math.round((joined / max) * 100));
            const isFull = joined >= max || t.status === 'full';
            const isClosed = t.status === 'closed';
            const isJoined = activeTournamentsList.includes(t.id);

            const prizes = (t.prizes && t.prizes.length > 0)
              ? t.prizes
              : [t.prize1 || 600, t.prize2 || 400, t.prize3 || 200];
            const totalPrize = prizes.reduce((acc, p) => acc + (p || 0), 0);
            const killBonus = t.killPrize !== undefined ? t.killPrize : 20;

            return (
              <div
                key={t.id}
                className={`relative rounded-2xl p-5 transition-all border ${
                  isJoined
                    ? 'bg-[#161A2E] border-[#2ECC71]/40 shadow-lg shadow-[#2ECC71]/10'
                    : 'bg-[#161A2E] border-[#252B47] hover:border-[#F5A623]/40'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <h2 className="font-heading font-black text-2xl uppercase text-[#EEF0FF] leading-tight">
                      {t.name}
                    </h2>
                    <div className="flex items-center gap-2 mt-1">
                      {t.mode && (
                        <span className="text-[11px] font-tech font-bold uppercase text-[#7A84A8] bg-[#0F1220] px-2 py-0.5 rounded border border-[#252B47]">
                          {t.mode}
                        </span>
                      )}
                      {t.map && (
                        <span className="text-[11px] text-[#7A84A8] flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#4A9EFF]" />
                          {t.map}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div>
                    {isJoined ? (
                      <span className="inline-flex items-center gap-1 bg-[#2ECC71]/15 text-[#2ECC71] border border-[#2ECC71]/30 text-[10px] font-tech font-black uppercase px-2.5 py-1 rounded-full">
                        <CheckCircle2 className="w-3 h-3" /> Registered
                      </span>
                    ) : isFull ? (
                      <span className="inline-flex items-center gap-1 bg-[#E74C3C]/15 text-[#E74C3C] border border-[#E74C3C]/30 text-[10px] font-tech font-black uppercase px-2.5 py-1 rounded-full">
                        Full Lobbies
                      </span>
                    ) : isClosed ? (
                      <span className="inline-flex items-center gap-1 bg-[#7A84A8]/15 text-[#7A84A8] border border-[#7A84A8]/30 text-[10px] font-tech font-black uppercase px-2.5 py-1 rounded-full">
                        <Lock className="w-3 h-3" /> Closed
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-[#2ECC71]/15 text-[#2ECC71] border border-[#2ECC71]/30 text-[10px] font-tech font-black uppercase px-2.5 py-1 rounded-full animate-pulse">
                        ● Open Slots
                      </span>
                    )}
                  </div>
                </div>

                {/* Match Info Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-[#0F1220] border border-[#252B47] rounded-xl p-3 mb-3 text-xs">
                  <div>
                    <span className="text-[#7A84A8] block text-[10px] uppercase font-tech">Entry Fee</span>
                    <span className="font-heading font-black text-base text-[#F5A623]">Rs {t.entryFee}</span>
                  </div>
                  <div>
                    <span className="text-[#7A84A8] block text-[10px] uppercase font-tech">Time</span>
                    <span className="font-heading font-bold text-xs text-[#EEF0FF] truncate block">
                      {t.time}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#7A84A8] block text-[10px] uppercase font-tech">Kill Bonus</span>
                    <span className="font-heading font-black text-sm text-[#2ECC71]">Rs {killBonus}/kill</span>
                  </div>
                  <div>
                    <span className="text-[#7A84A8] block text-[10px] uppercase font-tech">Slots</span>
                    <span className="font-heading font-bold text-xs text-[#EEF0FF]">
                      {joined} / {max}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1 mb-4">
                  <div className="flex justify-between text-[11px] text-[#7A84A8]">
                    <span>Lobby Fill Status</span>
                    <span className="font-tech font-bold text-[#EEF0FF]">{pct}% Filled</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#0F1220] rounded-full overflow-hidden border border-[#252B47]">
                    <div
                      className={`h-full transition-all duration-500 rounded-full ${
                        pct >= 90 ? 'bg-[#E74C3C]' : 'bg-gradient-to-r from-[#F5A623] to-[#D4891C]'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                {/* Prize Breakdown Banner */}
                <div className="bg-[#F5A623]/10 border border-[#F5A623]/25 rounded-xl p-3 flex items-center justify-between gap-2 mb-4">
                  <div>
                    <div className="text-[10px] font-tech uppercase text-[#7A84A8]">Guaranteed Pool</div>
                    <div className="font-heading font-black text-xl text-[#F5A623]">
                      Rs {totalPrize.toLocaleString()}+
                    </div>
                  </div>
                  <div className="text-right text-[11px] text-[#EEF0FF] space-y-0.5">
                    <div className="flex flex-wrap justify-end gap-x-1.5">
                      {prizes.map((amt, i) => {
                        const medals = ['🥇', '🥈', '🥉'];
                        const icon = medals[i] || `${i + 1}️⃣`;
                        return (
                          <span key={i}>
                            {icon} Rs {amt}{i < prizes.length - 1 ? ' |' : ''}
                          </span>
                        );
                      })}
                    </div>
                    {killBonus > 0 && (
                      <div className="text-[#7A84A8]">💀 Rs {killBonus}/kill</div>
                    )}
                  </div>
                </div>
                
                {/* Action CTA */}
                {isJoined ? (
                  <div className="w-full py-3 bg-[#2ECC71]/15 border border-[#2ECC71]/40 rounded-xl text-center">
                    <div className="font-heading font-black text-base uppercase text-[#2ECC71] flex items-center justify-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>You Are Registered in This Match</span>
                    </div>
                    <p className="text-[11px] text-[#7A84A8] mt-0.5">
                      Room ID &amp; Password will be sent to your WhatsApp 15m before start.
                    </p>
                  </div>
                ) : (
                  <button
                    disabled={isFull || isClosed}
                    onClick={() => handleJoinClick(t)}
                    className={`w-full py-3 px-4 rounded-xl font-heading font-black text-base uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                      isFull || isClosed
                        ? 'bg-[#1E2340] text-[#7A84A8] cursor-not-allowed border border-[#252B47]'
                        : 'bg-gradient-to-r from-[#F5A623] to-[#D4891C] text-black shadow-lg shadow-[#F5A623]/25 hover:brightness-110 active:scale-98'
                    }`}
                  >
                    {isFull ? (
                      <span>❌ Lobby is Full</span>
                    ) : isClosed ? (
                      <span>🔒 Match Closed</span>
                    ) : (
                      <span>🎮 JOIN MATCH — Rs {t.entryFee} Entry</span>
                    )}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
