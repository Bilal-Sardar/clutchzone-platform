import React, { useEffect, useState } from 'react';
import { Trophy, Flame, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { getDailyKey, getWeekKey, computeLevel } from '../leaderboard';

type Period = 'daily' | 'weekly';

interface RankedEntry {
  uid: string;
  name: string;
  xp: number;
  level: number;
}

const DAILY_LIMIT = 10;
const WEEKLY_LIMIT = 50;

export const LeaderboardTab: React.FC = () => {
  const { currentUser } = useAuth();
  const [period, setPeriod] = useState<Period>('daily');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [ranked, setRanked] = useState<RankedEntry[]>([]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(false);
      try {
        const snap = await getDocs(collection(db, 'leaderboard'));
        const todayKey = getDailyKey();
        const weekKey = getWeekKey();

        const entries: RankedEntry[] = snap.docs.map(d => {
          const data: any = d.data();
          const dailyXp = data.dailyDate === todayKey ? (data.dailyXP || 0) : 0;
          const weeklyXp = data.weeklyWeekKey === weekKey ? (data.weeklyXP || 0) : 0;
          return {
            uid: d.id,
            name: data.name || 'Player',
            xp: period === 'daily' ? dailyXp : weeklyXp,
            level: data.level || computeLevel(data.xp || 0)
          };
        });

        entries.sort((a, b) => b.xp - a.xp);

        if (!cancelled) setRanked(entries);
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period]);

  const limit = period === 'daily' ? DAILY_LIMIT : WEEKLY_LIMIT;
  const top = ranked.slice(0, limit);
  const myIndex = currentUser ? ranked.findIndex(r => r.uid === currentUser.uid) : -1;
  const myEntry = myIndex >= 0 ? ranked[myIndex] : null;
  const myRank = myIndex >= 0 ? myIndex + 1 : null;
  const amInTop = myIndex >= 0 && myIndex < limit;

  const medal = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return null;
  };

  const renderRow = (entry: RankedEntry, rank: number, highlight: boolean) => (
    <div
      key={entry.uid}
      className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl border ${
        highlight
          ? 'bg-[#F5A623]/10 border-[#F5A623]/40'
          : 'bg-[#161A2E] border-[#252B47]'
      }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <span className="w-8 shrink-0 text-center font-heading font-black text-[#7A84A8]">
          {medal(rank) || `#${rank}`}
        </span>
        <div className="min-w-0">
          <div className="font-tech font-bold text-[#EEF0FF] truncate">
            {entry.name} {highlight && <span className="text-[#F5A623]">(You)</span>}
          </div>
          <div className="text-[10px] uppercase text-[#7A84A8] font-tech tracking-wider">
            Level {entry.level}
          </div>
        </div>
      </div>
      <div className="shrink-0 flex items-center gap-1 text-[#F5A623] font-heading font-black">
        <Flame className="w-4 h-4" />
        {entry.xp.toLocaleString()} XP
      </div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-5">
      <div className="flex items-center gap-2">
        <Trophy className="w-6 h-6 text-[#F5A623]" />
        <h1 className="font-heading font-black text-2xl text-[#EEF0FF] uppercase">Leaderboard</h1>
      </div>

      {/* Period toggle */}
      <div className="flex gap-2 bg-[#161A2E] border border-[#252B47] rounded-full p-1 w-fit">
        {(['daily', 'weekly'] as Period[]).map(p => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-4 py-1.5 rounded-full text-xs font-tech font-bold uppercase tracking-wider transition-colors ${
              period === p ? 'bg-[#F5A623] text-black' : 'text-[#7A84A8] hover:text-[#EEF0FF]'
            }`}
          >
            {p === 'daily' ? `Daily Top ${DAILY_LIMIT}` : `Weekly Top ${WEEKLY_LIMIT}`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-[#7A84A8]">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      ) : error ? (
        <div className="text-center py-16 text-[#7A84A8] font-tech">
          Couldn't load the leaderboard. Please try again.
        </div>
      ) : top.length === 0 ? (
        <div className="text-center py-16 text-[#7A84A8] font-tech">
          No one has earned XP {period === 'daily' ? 'today' : 'this week'} yet — be the first!
        </div>
      ) : (
        <div className="space-y-2">
          {top.map((entry, idx) => renderRow(entry, idx + 1, entry.uid === currentUser?.uid))}

          {myEntry && myRank && !amInTop && (
            <>
              <div className="text-center text-[#7A84A8] font-heading tracking-widest">...</div>
              {renderRow(myEntry, myRank, true)}
            </>
          )}
        </div>
      )}
    </div>
  );
};
