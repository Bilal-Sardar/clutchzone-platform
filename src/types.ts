export type PaymentMethod = 'JazzCash' | 'EasyPaisa';

export interface LeaderboardEntry {
  name: string;
  xp: number;
  level: number;
  dailyXP?: number;
  dailyDate?: string;      // "2026-09-19" (PKT calendar date) — dailyXP is only valid for today if this matches
  weeklyXP?: number;
  weeklyWeekKey?: string;  // "2026-W38" (ISO week, PKT) — weeklyXP is only valid for this week if this matches
}

export interface PlayerProfile {
  name: string;
  whatsapp: string;
  gameUID: string;
  paymentMethod: PaymentMethod;
  paymentAccount: string;
  email: string;
  photo?: string;
  walletBalance: number;
  totalEarnings: number;
  tournamentsPlayed: number;
  tournamentsWon: number;
  totalKills: number;
  activeTournaments?: string[];
  createdAt?: string | { toDate?: () => Date; seconds?: number };
  fcmToken?: string;

  // Referral system
  referralCode?: string;              // this player's own unique code (to share)
  referredBy?: string | null;         // Firebase UID of the player who referred them
  referredByCode?: string | null;     // the code they entered at signup (for display)
  referredPlayers?: string[];         // names of players this player has referred
  firstTournamentJoined?: boolean;    // has this player joined their first paid tournament
  bonusBalance?: number;              // non-withdrawable balance, tournament entry only
}

export interface Tournament {
  id: string;
  name: string;
  mode?: string; // Solo, Duo, Squad, Clash Squad
  map?: string; // Bermuda, Purgatory, Kalahari, Alpine
  entryFee: number;
  joinedCount: number;
  maxPlayers: number;
  time: string; // e.g. "8:00 PM Tonight"
  status: 'open' | 'full' | 'closed' | 'upcoming';
  prizes?: number[];
  prize1?: number;
  prize2?: number;
  prize3?: number;
  killPrize?: number;
  killEnabled?: boolean;
  roomId?: string;
  roomPassword?: string;
  isRegistered?: boolean;
}

export interface Transaction {
  id?: string;
  type: 'deposit' | 'withdrawal' | 'withdrawal_pending' | 'withdrawal_rejected' | 'entry_fee' | 'prize' | 'kill_prize' | 'admin_update' | 'referral_bonus';
  tournamentId?: string;
  description: string;
  amount: number;
  note?: string;
  createdAt?: string | { toDate?: () => Date; seconds?: number };
  timestamp?: { toDate?: () => Date; seconds?: number };
}

export interface Winner {
  position: number;
  name: string;
  uid: string;
  prize: number;
  kills?: number;
}

export interface MatchResult {
  id: string;
  tournamentName: string;
  completedAt: string | { toDate?: () => Date; seconds?: number };
  winners: Winner[];
  topKiller?: {
    name: string;
    kills: number;
  };
  totalPlayers?: number;
  totalPrize?: number;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  emoji?: string;
  type?: 'update' | 'poll' | 'announcement';
  pinned?: boolean;
  options?: string[];
  votes?: number[];
  voterUIDs?: string[];
  createdAt?: string | { toDate?: () => Date; seconds?: number };
}

export interface SupportRequest {
  name: string;
  whatsapp: string;
  issueType: 'deposit' | 'withdrawal' | 'tournament' | 'account' | 'other';
  message: string;
  status: 'pending' | 'resolved';
  createdAt: string;
}
