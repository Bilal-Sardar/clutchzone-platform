// XP, Level, and Leaderboard helpers — shared by the join flow (AuthContext)
// and the Leaderboard tab. The equivalent constants/functions are duplicated
// (kept byte-identical) in the admin panel's storage.ts, since the two are
// separate codebases — if you change XP amounts or the level curve here,
// mirror the change there too, otherwise the two sides will disagree on a
// player's level.

// XP awarded for joining a tournament, or for placing in any paid position
// (1st, 2nd, 3rd...) when prizes are distributed. Keyed by the tournament's
// exact `mode` field.
export const GAME_MODE_XP: Record<string, number> = {
  'Lone Wolf': 5,
  'Lone Wolf Duo': 10,
  'Clash Squad': 20,
  'Battle Royale Lite': 25,
  'Solo BR Classic': 30,
  'Squad BR Classic': 30
};

/**
 * Case/whitespace-insensitive lookup of GAME_MODE_XP. A tournament's `mode`
 * is normally set via a fixed dropdown so it should always match exactly,
 * but a manually-edited or legacy Firestore doc could have a stray
 * capitalization difference (e.g. "lone Wolf" instead of "Lone Wolf") —
 * without this, that would silently award 0 XP with no error anywhere.
 */
export function getModeXp(mode: string | undefined | null): number {
  if (!mode) return 0;
  const normalized = mode.trim().toLowerCase();
  const match = Object.keys(GAME_MODE_XP).find(k => k.toLowerCase() === normalized);
  return match ? GAME_MODE_XP[match] : 0;
}

export const XP_PER_KILL = 3;

/**
 * Level curve: Level 1 starts at 0 XP. Level 2 needs 15 XP, and every level
 * after that needs double the previous level's threshold (15, 30, 60, 120,
 * 240, ...).
 */
export function xpForLevel(level: number): number {
  if (level <= 1) return 0;
  return 15 * Math.pow(2, level - 2);
}

export function computeLevel(xp: number): number {
  let level = 1;
  let threshold = 15;
  while (xp >= threshold) {
    level++;
    threshold *= 2;
  }
  return level;
}

/** XP still needed to reach the next level, and this level's progress (0-1). */
export function levelProgress(xp: number): { level: number; currentLevelXp: number; nextLevelXp: number; xpIntoLevel: number; xpNeeded: number; progress: number } {
  const level = computeLevel(xp);
  const currentLevelXp = xpForLevel(level);
  const nextLevelXp = xpForLevel(level + 1);
  const xpIntoLevel = xp - currentLevelXp;
  const span = nextLevelXp - currentLevelXp;
  return {
    level,
    currentLevelXp,
    nextLevelXp,
    xpIntoLevel,
    xpNeeded: Math.max(0, nextLevelXp - xp),
    progress: span > 0 ? Math.min(1, xpIntoLevel / span) : 0
  };
}

/** Pakistan (PKT, UTC+5, no DST) "now" — used so the daily/weekly reset
 * happens at midnight in Pakistan, not at UTC midnight. */
function getPKTDate(): Date {
  return new Date(Date.now() + 5 * 60 * 60 * 1000);
}

export function getDailyKey(): string {
  return getPKTDate().toISOString().split('T')[0]; // e.g. "2026-09-19"
}

/** ISO-8601 week number (Thursday-of-the-week method), computed on the PKT calendar date. */
export function getWeekKey(): string {
  const d = getPKTDate();
  const target = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const dayNr = (target.getUTCDay() + 6) % 7; // Mon=0..Sun=6
  target.setUTCDate(target.getUTCDate() - dayNr + 3); // Thursday of this ISO week
  const firstThursday = new Date(Date.UTC(target.getUTCFullYear(), 0, 4));
  const firstDayNr = (firstThursday.getUTCDay() + 6) % 7;
  firstThursday.setUTCDate(firstThursday.getUTCDate() - firstDayNr + 3);
  const weekNum = 1 + Math.round((target.getTime() - firstThursday.getTime()) / (7 * 24 * 3600 * 1000));
  return `${target.getUTCFullYear()}-W${String(weekNum).padStart(2, '0')}`;
}

/**
 * Computes the new leaderboard field values after adding `xpGain`, correctly
 * "resetting" the daily/weekly counters if the stored date/week doesn't
 * match the current one — without needing a separate cleanup job. Call this
 * with the leaderboard doc's CURRENT data (or undefined if it doesn't exist
 * yet) and write the result back.
 */
export function applyXpGain(
  current: { xp?: number; dailyXP?: number; dailyDate?: string; weeklyXP?: number; weeklyWeekKey?: string } | undefined,
  xpGain: number
): { xp: number; level: number; dailyXP: number; dailyDate: string; weeklyXP: number; weeklyWeekKey: string } {
  const todayKey = getDailyKey();
  const weekKey = getWeekKey();

  const prevXP = current?.xp || 0;
  const prevDailyXP = current?.dailyDate === todayKey ? (current?.dailyXP || 0) : 0;
  const prevWeeklyXP = current?.weeklyWeekKey === weekKey ? (current?.weeklyXP || 0) : 0;

  const xp = prevXP + xpGain;
  return {
    xp,
    level: computeLevel(xp),
    dailyXP: prevDailyXP + xpGain,
    dailyDate: todayKey,
    weeklyXP: prevWeeklyXP + xpGain,
    weeklyWeekKey: weekKey
  };
}
