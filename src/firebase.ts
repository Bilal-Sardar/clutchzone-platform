import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut as fbSignOut, 
  onAuthStateChanged,
  User 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  updateDoc, 
  serverTimestamp, 
  increment, 
  runTransaction, 
  arrayUnion 
} from 'firebase/firestore';
import { PlayerProfile, Tournament, Transaction, MatchResult, Announcement, SupportRequest } from './types';

// The user's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export const OWNER_WHATSAPP = import.meta.env.VITE_OWNER_WHATSAPP || "923XXXXXXXXX";
export const OWNER_EMAIL = import.meta.env.VITE_OWNER_EMAIL || "admin@example.com";

// Helper to safely parse dates across strings & Firestore Timestamps
export function formatTimestamp(val?: string | { toDate?: () => Date; seconds?: number }): string {
  if (!val) return 'Recently';
  try {
    let date: Date;
    if (typeof val === 'object' && typeof val.toDate === 'function') {
      date = val.toDate();
    } else if (typeof val === 'object' && typeof val.seconds === 'number') {
      date = new Date(val.seconds * 1000);
    } else if (typeof val === 'string') {
      date = new Date(val);
    } else {
      return 'Recently';
    }
    if (isNaN(date.getTime())) return 'Recently';
    return date.toLocaleDateString('en-PK', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return 'Recently';
  }
}

export function getTimeAgo(val?: string | { toDate?: () => Date; seconds?: number }): string {
  if (!val) return '';
  try {
    let time = 0;
    if (typeof val === 'object' && typeof val.toDate === 'function') {
      time = val.toDate().getTime();
    } else if (typeof val === 'object' && typeof val.seconds === 'number') {
      time = val.seconds * 1000;
    } else if (typeof val === 'string') {
      time = new Date(val).getTime();
    }
    if (!time || isNaN(time)) return 'Just now';
    const diff = Date.now() - time;
    const m = Math.floor(diff / 60000);
    if (m < 1) return 'Just now';
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    const d = Math.floor(h / 24);
    return `${d}d ago`;
  } catch {
    return '';
  }
}

// Initial mock tournament data in case Firestore is empty or cold
export const DEFAULT_TOURNAMENTS: Tournament[] = [
  {
    id: 't-clash-1',
    name: '🔥 Friday Night Flash Clash',
    mode: 'Clash Squad (4v4)',
    map: 'Bermuda',
    entryFee: 70,
    joinedCount: 38,
    maxPlayers: 48,
    time: 'Tonight @ 9:00 PM PKT',
    status: 'open',
    prizes: [600, 400, 200],
    killPrize: 20,
    killEnabled: true
  },
  {
    id: 't-solo-survival',
    name: '👑 Bermuda Solo Survival Cup',
    mode: 'Solo Battle Royale',
    map: 'Bermuda Remastered',
    entryFee: 70,
    joinedCount: 46,
    maxPlayers: 50,
    time: 'Tomorrow @ 6:00 PM PKT',
    status: 'open',
    prizes: [600, 400, 200],
    killPrize: 20,
    killEnabled: true
  },
  {
    id: 't-purgatory-duo',
    name: '💀 Purgatory Duo Showdown',
    mode: 'Duo Battle Royale',
    map: 'Purgatory',
    entryFee: 100,
    joinedCount: 24,
    maxPlayers: 48,
    time: 'Sunday @ 8:30 PM PKT',
    status: 'open',
    prizes: [1000, 600, 300],
    killPrize: 25,
    killEnabled: true
  },
  {
    id: 't-mega-grand',
    name: '🏆 Pakistan FF Championship Q1',
    mode: 'Squad (4v4)',
    map: 'All Maps',
    entryFee: 150,
    joinedCount: 48,
    maxPlayers: 48,
    time: 'Completed',
    status: 'full',
    prizes: [1500, 900, 500],
    killPrize: 30,
    killEnabled: true
  }
];

export const DEFAULT_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: '🚀 Weekend Clash Squad Series Live!',
    message: 'Registrations are open for this weekend tournament series. Guarantee your slot early. Rs 20 per kill is added to all matches!',
    emoji: '🔥',
    type: 'announcement',
    pinned: true,
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: 'ann-poll-1',
    title: '🗳️ Player Poll: Which Map for Next Sunday?',
    message: 'Vote for your favorite map for the upcoming Mega Solo Tournament on Sunday!',
    emoji: '📊',
    type: 'poll',
    pinned: false,
    options: ['Bermuda Remastered', 'Purgatory', 'Kalahari', 'Alpine'],
    votes: [42, 28, 15, 9],
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString()
  }
];

export const DEFAULT_RESULTS: MatchResult[] = [
  {
    id: 'res-1',
    tournamentName: '⚡ Sunday Night FF Blitz Showdown',
    completedAt: new Date(Date.now() - 86400000).toISOString(),
    totalPlayers: 48,
    totalPrize: 2200,
    winners: [
      { position: 1, name: '꧁༺Hamza_Sniper༻꧂', uid: '9284102941', prize: 600, kills: 9 },
      { position: 2, name: 'Ali_Headshot_King', uid: '8172940182', prize: 400, kills: 6 },
      { position: 3, name: 'Usman_Takedown', uid: '7629104820', prize: 200, kills: 4 }
    ],
    topKiller: {
      name: '꧁༺Hamza_Sniper༻꧂',
      kills: 9
    }
  },
  {
    id: 'res-2',
    tournamentName: '🔥 Thursday Squad Clash Arena',
    completedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    totalPlayers: 46,
    totalPrize: 1900,
    winners: [
      { position: 1, name: 'Zeeshan_Clutcher', uid: '8204918274', prize: 600, kills: 8 },
      { position: 2, name: 'Bilal_FF_PK', uid: '7109283746', prize: 400, kills: 5 },
      { position: 3, name: 'Shahmeer_007', uid: '9019284712', prize: 200, kills: 3 }
    ],
    topKiller: {
      name: 'Zeeshan_Clutcher',
      kills: 8
    }
  }
];

export {
  signInWithPopup,
  googleProvider,
  fbSignOut,
  onAuthStateChanged,
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  updateDoc,
  serverTimestamp,
  increment,
  runTransaction,
  arrayUnion
};
