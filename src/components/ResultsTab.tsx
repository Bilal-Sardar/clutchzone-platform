import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Trophy, Skull, Users, Calendar, CheckCircle2 } from 'lucide-react';
import { formatTimestamp } from '../firebase';

export const ResultsTab: React.FC = () => {
  const { matchResults } = useAuth();

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div>
        <h1 className="font-heading font-black text-3xl sm:text-4xl uppercase tracking-wider text-[#EEF0FF] flex items-center gap-2">
          <Trophy className="w-8 h-8 text-[#F5A623]" />
          <span>Match Results &amp; Winners</span>
        </h1>
        <p className="text-xs text-[#7A84A8]">
          Verified standings, prize disbursements, and top fraggers for completed tournaments.
        </p>
      </div>

      {matchResults.length === 0 ? (
        <div className="bg-[#161A2E] border border-[#252B47] rounded-2xl p-12 text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#1E2340] flex items-center justify-center text-3xl mb-4">
            🏆
          </div>
          <h3 className="font-heading font-bold text-xl uppercase text-[#EEF0FF] mb-1">
            No Match Results Yet
          </h3>
          <p className="text-xs text-[#7A84A8] max-w-sm mx-auto">
            Results will appear here as soon as current ongoing tournaments finish and referees verify standings.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {matchResults.map((result) => {
            const winners = result.winners || [];
            const w1 = winners.find((w) => w.position === 1);
            const w2 = winners.find((w) => w.position === 2);
            const w3 = winners.find((w) => w.position === 3);

            return (
              <div
                key={result.id}
                className="bg-[#161A2E] border border-[#252B47] rounded-2xl p-5 sm:p-6 space-y-4 hover:border-[#F5A623]/40 transition-colors"
              >
                {/* Match Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#252B47]">
                  <div>
                    <h2 className="font-heading font-black text-2xl uppercase text-[#EEF0FF]">
                      {result.tournamentName}
                    </h2>
                    <div className="flex items-center gap-2 text-xs text-[#7A84A8] mt-0.5">
                      <Calendar className="w-3.5 h-3.5 text-[#4A9EFF]" />
                      <span>{formatTimestamp(result.completedAt)}</span>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1.5 bg-[#2ECC71]/15 text-[#2ECC71] border border-[#2ECC71]/30 text-xs font-tech font-bold uppercase px-3 py-1 rounded-full self-start sm:self-auto">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified &amp; Paid
                  </span>
                </div>

                {/* Podium Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* 1st Place */}
                  {w1 && (
                    <div className="bg-[#0F1220] border-2 border-[#F5A623]/50 rounded-xl p-3.5 text-center relative overflow-hidden shadow-md">
                      <div className="text-3xl mb-1">🥇</div>
                      <div className="text-[10px] font-tech uppercase text-[#F5A623] font-black tracking-wider">
                        1st Place Champion
                      </div>
                      <div className="font-heading font-black text-lg text-[#EEF0FF] truncate mt-1">
                        {w1.name}
                      </div>
                      <div className="text-[11px] text-[#7A84A8]">UID: {w1.uid}</div>
                      <div className="font-heading font-black text-xl text-[#F5A623] mt-2">
                        Rs {(w1.prize || 0).toLocaleString()}
                      </div>
                      {w1.kills !== undefined && (
                        <div className="text-[11px] text-[#2ECC71] font-tech font-bold mt-0.5">
                          💀 {w1.kills} Kills
                        </div>
                      )}
                    </div>
                  )}

                  {/* 2nd Place */}
                  {w2 && (
                    <div className="bg-[#0F1220] border border-[#C0C0C0]/30 rounded-xl p-3.5 text-center">
                      <div className="text-3xl mb-1">🥈</div>
                      <div className="text-[10px] font-tech uppercase text-[#C0C0C0] font-black tracking-wider">
                        2nd Place Runner-Up
                      </div>
                      <div className="font-heading font-black text-lg text-[#EEF0FF] truncate mt-1">
                        {w2.name}
                      </div>
                      <div className="text-[11px] text-[#7A84A8]">UID: {w2.uid}</div>
                      <div className="font-heading font-black text-xl text-[#C0C0C0] mt-2">
                        Rs {(w2.prize || 0).toLocaleString()}
                      </div>
                      {w2.kills !== undefined && (
                        <div className="text-[11px] text-[#2ECC71] font-tech font-bold mt-0.5">
                          💀 {w2.kills} Kills
                        </div>
                      )}
                    </div>
                  )}

                  {/* 3rd Place */}
                  {w3 && (
                    <div className="bg-[#0F1220] border border-[#CD7F32]/30 rounded-xl p-3.5 text-center">
                      <div className="text-3xl mb-1">🥉</div>
                      <div className="text-[10px] font-tech uppercase text-[#CD7F32] font-black tracking-wider">
                        3rd Place
                      </div>
                      <div className="font-heading font-black text-lg text-[#EEF0FF] truncate mt-1">
                        {w3.name}
                      </div>
                      <div className="text-[11px] text-[#7A84A8]">UID: {w3.uid}</div>
                      <div className="font-heading font-black text-xl text-[#CD7F32] mt-2">
                        Rs {(w3.prize || 0).toLocaleString()}
                      </div>
                      {w3.kills !== undefined && (
                        <div className="text-[11px] text-[#2ECC71] font-tech font-bold mt-0.5">
                          💀 {w3.kills} Kills
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Top Fragger Banner */}
                {result.topKiller && (
                  <div className="bg-[#E74C3C]/10 border border-[#E74C3C]/25 rounded-xl p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Skull className="w-4 h-4 text-[#E74C3C]" />
                      <span className="text-xs font-tech font-bold uppercase text-[#EEF0FF]">
                        Top Fragger (Most Kills)
                      </span>
                    </div>
                    <div className="font-heading font-bold text-sm text-[#E74C3C]">
                      {result.topKiller.name} — {result.topKiller.kills} Kills
                    </div>
                  </div>
                )}

                {/* Footer details */}
                <div className="flex items-center justify-between text-xs text-[#7A84A8] pt-2">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    {result.totalPlayers || 48} Players Competed
                  </span>
                  <span className="font-tech font-bold text-[#F5A623]">
                    Total Prize Pool: Rs {(result.totalPrize || 1200).toLocaleString()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
