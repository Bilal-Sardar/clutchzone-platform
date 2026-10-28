import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import {
  auth,
  db,
  googleProvider,
  signInWithPopup,
  fbSignOut,
  onAuthStateChanged,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  addDoc,
  query,
  where,
  runTransaction,
  increment,
  arrayUnion,
  serverTimestamp,
  OWNER_WHATSAPP,
  DEFAULT_TOURNAMENTS,
  DEFAULT_ANNOUNCEMENTS,
  DEFAULT_RESULTS
} from '../firebase';
import { PlayerProfile, Tournament, Transaction, MatchResult, Announcement, SupportRequest, PaymentMethod } from '../types';
import { getModeXp, applyXpGain } from '../leaderboard';
import confetti from 'canvas-confetti';

interface ToastInfo {
  id: string;
  message: string;
  type?: 'success' | 'error' | 'info';
}

interface AuthContextType {
  currentUser: User | null;
  profile: PlayerProfile | null;
  loading: boolean;
  activeTab: 'home' | 'tournaments' | 'wallet' | 'results' | 'leaderboard' | 'profile';
  setActiveTab: (tab: 'home' | 'tournaments' | 'wallet' | 'results' | 'leaderboard' | 'profile') => void;
  tournaments: Tournament[];
  announcements: Announcement[];
  matchResults: MatchResult[];
  transactions: Transaction[];
  toasts: ToastInfo[];
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  
  // Modals state
  activeModal: string | null;
  openModal: (modalName: string, data?: any) => void;
  closeModal: () => void;
  modalData: any;

  // Actions
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  submitProfileSetup: (data: {
    name: string;
    whatsapp: string;
    gameUID: string;
    paymentMethod: PaymentMethod;
    paymentAccount: string;
    referralCode?: string;
  }) => Promise<boolean>;
  updateProfileData: (data: {
    name: string;
    whatsapp: string;
    paymentMethod: PaymentMethod;
    paymentAccount: string;
  }) => Promise<boolean>;
  joinTournamentAction: (tournamentId: string, entryFee: number, tournamentName: string) => Promise<boolean>;
  submitWithdrawalAction: (amount: number, method: PaymentMethod, account: string) => Promise<boolean>;
  votePollAction: (announcementId: string, optionIndex: number) => Promise<void>;
  submitSupportAction: (req: SupportRequest) => Promise<boolean>;
  refreshAllData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'home' | 'tournaments' | 'wallet' | 'results' | 'leaderboard' | 'profile'>('home');
  
  const [tournaments, setTournaments] = useState<Tournament[]>(DEFAULT_TOURNAMENTS);
  const [announcements, setAnnouncements] = useState<Announcement[]>(DEFAULT_ANNOUNCEMENTS);
  const [matchResults, setMatchResults] = useState<MatchResult[]>(DEFAULT_RESULTS);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [modalData, setModalData] = useState<any>(null);
  const [toasts, setToasts] = useState<ToastInfo[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  };

  const openModal = (modalName: string, data?: any) => {
    setModalData(data || null);
    setActiveModal(modalName);
  };

  const closeModal = () => {
    setActiveModal(null);
    setModalData(null);
  };

  // Fetch Firestore tournaments
  const fetchTournaments = async () => {
    try {
      const snap = await getDocs(collection(db, 'tournaments'));
      if (!snap.empty) {
        const list: Tournament[] = [];
        snap.forEach(docSnap => {
          list.push({ id: docSnap.id, ...(docSnap.data() as any) });
        });
        setTournaments(list);
      }
    } catch {
      // Keep default tournaments on error/offline
    }
  };

  // Fetch announcements
  const fetchAnnouncements = async () => {
    try {
      const snap = await getDocs(collection(db, 'announcements'));
      if (!snap.empty) {
        const list: Announcement[] = [];
        snap.forEach(docSnap => {
          list.push({ id: docSnap.id, ...(docSnap.data() as any) });
        });
        list.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
        setAnnouncements(list);
      }
    } catch {
      // Keep fallback
    }
  };

  // Fetch match results
  const fetchMatchResults = async () => {
    try {
      const snap = await getDocs(query(collection(db, 'matchResults')));
      if (!snap.empty) {
        const list: MatchResult[] = [];
        snap.forEach(docSnap => {
          list.push({ id: docSnap.id, ...(docSnap.data() as any) });
        });
        setMatchResults(list);
      }
    } catch {
      // Keep fallback
    }
  };

  // Fetch transactions for user
  const fetchTransactions = async (uid: string) => {
    try {
      const snap = await getDocs(collection(db, 'players', uid, 'transactions'));
      if (!snap.empty) {
        const list: Transaction[] = [];
        snap.forEach(docSnap => {
          list.push({ id: docSnap.id, ...(docSnap.data() as any) });
        });
        setTransactions(list);
      }
    } catch {
      // Keep fallback
    }
  };

  const refreshAllData = async () => {
    await Promise.all([
      fetchTournaments(),
      fetchAnnouncements(),
      fetchMatchResults(),
      currentUser ? fetchTransactions(currentUser.uid) : Promise.resolve()
    ]);
  };

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const docRef = doc(db, 'players', user.uid);
          const snap = await getDoc(docRef);
          if (snap.exists()) {
            const existingProfile = snap.data() as PlayerProfile;

            // Enforce admin bans right at login — the admin panel only flips a
            // status field in Firestore, so the site itself must check it and
            // refuse to let a banned player use the account.
            if ((existingProfile as any).status === 'banned') {
              showToast('🚫 Your account has been suspended. Contact support on WhatsApp for help.', 'error');
              await fbSignOut(auth);
              setCurrentUser(null);
              setProfile(null);
              setTransactions([]);
              setLoading(false);
              return;
            }

            if (!existingProfile.referralCode) {
              // Old player from before the referral system existed — generate their code now.
              try {
                const code = await generateUniqueReferralCode(existingProfile.name || 'CLTZ');
                await updateDoc(docRef, {
                  referralCode: code,
                  referredPlayers: existingProfile.referredPlayers || [],
                  bonusBalance: existingProfile.bonusBalance || 0,
                  firstTournamentJoined: existingProfile.firstTournamentJoined || false
                });
                existingProfile.referralCode = code;
                existingProfile.referredPlayers = existingProfile.referredPlayers || [];
                existingProfile.bonusBalance = existingProfile.bonusBalance || 0;
                existingProfile.firstTournamentJoined = existingProfile.firstTournamentJoined || false;
              } catch {
                // If this fails (e.g. offline), the player just won't see a code yet — no crash.
              }
            }
            setProfile(existingProfile);
            await fetchTransactions(user.uid);
          } else {
            // New user needs profile setup
            setProfile(null);
            openModal('setup');
          }
        } catch {
          // If Firestore is unavailable, initialize local fallback
          setProfile({
            name: user.displayName || 'ClutchPlayer',
            whatsapp: '03001234567',
            gameUID: '987654321',
            paymentMethod: 'JazzCash',
            paymentAccount: '03001234567',
            email: user.email || '',
            photo: user.photoURL || '',
            walletBalance: 250,
            totalEarnings: 850,
            tournamentsPlayed: 4,
            tournamentsWon: 1,
            totalKills: 14,
            activeTournaments: ['t-clash-1']
          });
        }
      } else {
        setProfile(null);
        setTransactions([]);
      }
      setLoading(false);
    });

    refreshAllData();

    return () => unsubscribe();
  }, []);

  // Google Login
  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      closeModal();
      showToast(`Welcome ${user.displayName || 'Gamer'}!`, 'success');
    } catch (err: any) {
      if (err.code === 'auth/popup-blocked' || err.code === 'auth/cancelled-popup-request') {
        showToast('Popup was blocked by your browser. Please allow popups to sign in.', 'error');
      } else if (err.code === 'auth/popup-closed-by-user') {
        // User intentionally closed the login popup — not an error worth alarming them with.
      } else {
        showToast(`Login failed: ${err.message || 'Unknown error'}`, 'error');
      }
    }
  };

  // Logout
  const logout = async () => {
    try {
      await fbSignOut(auth);
    } catch {
      // ignore
    }
    setCurrentUser(null);
    setProfile(null);
    setActiveTab('home');
    closeModal();
    showToast('Logged out successfully', 'info');
  };

  // Generate a unique referral code for a new player, e.g. "AHME482"
  const generateUniqueReferralCode = async (name: string): Promise<string> => {
    const base = (name.replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, 4) || 'CLTZ');
    for (let attempt = 0; attempt < 5; attempt++) {
      const candidate = base + Math.floor(100 + Math.random() * 900);
      try {
        const q = query(collection(db, 'players'), where('referralCode', '==', candidate));
        const snap = await getDocs(q);
        if (snap.empty) return candidate;
      } catch {
        // If offline/error, just return the candidate — collision risk is low
        return candidate;
      }
    }
    // Fallback: timestamp-based, virtually guaranteed unique
    return base + Date.now().toString().slice(-4);
  };

  // Submit Profile Setup
  const submitProfileSetup = async (data: {
    name: string;
    whatsapp: string;
    gameUID: string;
    paymentMethod: PaymentMethod;
    paymentAccount: string;
    referralCode?: string;
  }): Promise<boolean> => {
    if (!currentUser) {
      showToast('Please login first', 'error');
      return false;
    }

    try {
      // Check if Game UID already taken
      try {
        const uidQuery = query(collection(db, 'players'), where('gameUID', '==', data.gameUID));
        const uidSnap = await getDocs(uidQuery);
        let uidTaken = false;
        uidSnap.forEach(d => {
          if (d.id !== currentUser.uid) uidTaken = true;
        });
        if (uidTaken) {
          showToast('❌ This Game UID is already registered by another player!', 'error');
          return false;
        }
      } catch {
        // continue if offline
      }

      // Check if WhatsApp number already taken (prevents one person creating
      // multiple accounts with different emails to farm referral bonuses)
      try {
        const waQuery = query(collection(db, 'players'), where('whatsapp', '==', data.whatsapp));
        const waSnap = await getDocs(waQuery);
        let waTaken = false;
        waSnap.forEach(d => {
          if (d.id !== currentUser.uid) waTaken = true;
        });
        if (waTaken) {
          showToast('❌ This WhatsApp number is already registered on another account!', 'error');
          return false;
        }
      } catch {
        // continue if offline
      }

      // Check if player name (IGN) already taken
      try {
        const nameQuery = query(collection(db, 'players'), where('name', '==', data.name));
        const nameSnap = await getDocs(nameQuery);
        let nameTaken = false;
        nameSnap.forEach(d => {
          if (d.id !== currentUser.uid) nameTaken = true;
        });
        if (nameTaken) {
          showToast('❌ This player name is already taken. Please choose a different name!', 'error');
          return false;
        }
      } catch {
        // continue if offline
      }

      const myReferralCode = await generateUniqueReferralCode(data.name);

      // Resolve referral code entered (if any) to a referrer player
      let referrerUid: string | null = null;
      let referrerCodeUsed: string | null = null;

      if (data.referralCode) {
        try {
          const refQuery = query(collection(db, 'players'), where('referralCode', '==', data.referralCode));
          const refSnap = await getDocs(refQuery);
          if (!refSnap.empty) {
            const referrerDoc = refSnap.docs[0];
            if (referrerDoc.id !== currentUser.uid) {
              referrerUid = referrerDoc.id;
              referrerCodeUsed = data.referralCode;
            }
          } else {
            showToast('⚠️ Referral code not found — profile created without bonus.', 'info');
          }
        } catch {
          // offline — skip referral bonus silently
        }
      }

      const bonusBalance = referrerUid ? 20 : 0;

      const newProfile: PlayerProfile = {
        name: data.name,
        whatsapp: data.whatsapp,
        gameUID: data.gameUID,
        paymentMethod: data.paymentMethod,
        paymentAccount: data.paymentAccount,
        email: currentUser.email || '',
        photo: currentUser.photoURL || '',
        walletBalance: 0,
        totalEarnings: 0,
        tournamentsPlayed: 0,
        tournamentsWon: 0,
        totalKills: 0,
        activeTournaments: [],
        referralCode: myReferralCode,
        referredBy: referrerUid,
        referredByCode: referrerCodeUsed,
        referredPlayers: [],
        firstTournamentJoined: false,
        bonusBalance,
        createdAt: new Date().toISOString()
      };

      // NOTE: this write used to be wrapped in its own try/catch that
      // swallowed ANY failure (offline, permission denied, network error)
      // and fell straight through to setProfile()+success toast below —
      // meaning a player could see "Profile created!" while nothing was
      // actually saved in Firestore. A failure here must now reach the
      // outer catch instead of being treated as a silent local fallback.
      await setDoc(doc(db, 'players', currentUser.uid), {
        ...newProfile,
        createdAt: serverTimestamp()
      });

      if (referrerUid) {
        // Credit signup bonus transaction for the new player
        await addDoc(collection(db, 'players', currentUser.uid, 'transactions'), {
          type: 'referral_bonus',
          description: 'Referral Signup Bonus',
          amount: 20,
          createdAt: new Date().toISOString()
        });

        // Add this player's own doc ID to the referrer's referredPlayers list
        // (their UID never changes, even if they rename themselves later — unlike their display name)
        await updateDoc(doc(db, 'players', referrerUid), {
          referredPlayers: arrayUnion(currentUser.uid)
        });
      }

      setProfile(newProfile);
      closeModal();
      if (referrerUid) {
        showToast('🎉 Profile created! You got Rs 20 bonus for using a referral code!', 'success');
      } else {
        showToast('🎉 Profile created successfully! Welcome to ClutchZone!', 'success');
      }
      return true;
    } catch (err: any) {
      showToast(`Error creating profile: ${err.message}`, 'error');
      return false;
    }
  };

  // Update existing profile
  const updateProfileData = async (data: {
    name: string;
    whatsapp: string;
    paymentMethod: PaymentMethod;
    paymentAccount: string;
  }): Promise<boolean> => {
    if (!profile || !currentUser) return false;

    try {
      // Check if WhatsApp number is already taken by another account
      try {
        const waQuery = query(collection(db, 'players'), where('whatsapp', '==', data.whatsapp));
        const waSnap = await getDocs(waQuery);
        let waTaken = false;
        waSnap.forEach(d => {
          if (d.id !== currentUser.uid) waTaken = true;
        });
        if (waTaken) {
          showToast('❌ This WhatsApp number is already registered on another account!', 'error');
          return false;
        }
      } catch {
        // continue if offline
      }

      // Check if player name (IGN) is already taken by another account
      try {
        const nameQuery = query(collection(db, 'players'), where('name', '==', data.name));
        const nameSnap = await getDocs(nameQuery);
        let nameTaken = false;
        nameSnap.forEach(d => {
          if (d.id !== currentUser.uid) nameTaken = true;
        });
        if (nameTaken) {
          showToast('❌ This player name is already taken. Please choose a different name!', 'error');
          return false;
        }
      } catch {
        // continue if offline
      }

      // Previously wrapped in its own try/catch that swallowed any failure
      // and still reported "Profile updated successfully!" below even when
      // nothing was saved. Let a real failure bubble to the outer catch.
      await updateDoc(doc(db, 'players', currentUser.uid), {
        name: data.name,
        whatsapp: data.whatsapp,
        paymentMethod: data.paymentMethod,
        paymentAccount: data.paymentAccount
      });

      setProfile(prev => prev ? { ...prev, ...data } : null);
      closeModal();
      showToast('✅ Profile updated successfully!', 'success');
      return true;
    } catch (err: any) {
      showToast(`Update error: ${err.message}`, 'error');
      return false;
    }
  };

  // Join Tournament
  const joinTournamentAction = async (tournamentId: string, entryFee: number, tournamentName: string): Promise<boolean> => {
    if (!profile || !currentUser) {
      openModal('login');
      showToast('Please login to join tournaments', 'error');
      return false;
    }

    if ((profile as any).status === 'banned') {
      showToast('🚫 Your account has been suspended. Contact support on WhatsApp for help.', 'error');
      return false;
    }

    const bonusBal = profile.bonusBalance || 0;
    const walletBal = profile.walletBalance || 0;
    const totalAvailable = bonusBal + walletBal;

    if (totalAvailable < entryFee) {
      showToast(`❌ Insufficient balance! Entry fee is Rs ${entryFee}, your balance is Rs ${totalAvailable}. Please deposit first.`, 'error');
      openModal('deposit');
      return false;
    }

    // Bonus wallet is used first, withdrawable wallet covers the rest.
    const bonusUsed = Math.min(bonusBal, entryFee);
    const walletUsed = entryFee - bonusUsed;

    const referrerId = profile.referredBy || null;
    const referrerEligible = !!referrerId && entryFee >= 60;

    try {
      // NOTE: this used to be wrapped in its own try/catch that swallowed
      // ANY failure here (insufficient balance, already-joined, network
      // error, permission error — everything) as "offline transaction
      // simulation", then fell through to the code below that updates local
      // state and shows a success toast regardless. That meant a failed or
      // rejected join could still show "Tournament Joined!" to the player
      // while nothing was actually saved in Firestore. This is a paid
      // action — a failure here must stop the flow and reach the outer
      // catch below, never be treated as a soft/offline fallback.
      {
        const playerRef = doc(db, 'players', currentUser.uid);
        const tournRef = doc(db, 'tournaments', tournamentId);
        const referrerRef = referrerEligible ? doc(db, 'players', referrerId as string) : null;

        // Pre-generate refs for the participant record and the two
        // transaction logs so they can be written INSIDE the same atomic
        // transaction as the balance deduction below (a transaction can
        // create/update any number of documents by ref — it isn't limited
        // to the ones it read). Previously these were separate addDoc()
        // calls made AFTER the transaction had already committed — if the
        // player closed or refreshed the tab in that gap, the wallet was
        // already deducted and joinedCount/activeTournaments already
        // updated, but the participant record (and tx logs) never got
        // created, because the page's JS execution was killed before those
        // calls ran. Bundling everything into one transaction makes the
        // whole join atomic: either every part of it saves, or none of it
        // does — there is no longer a gap where closing the tab loses data.
        const participantRef = doc(collection(db, 'tournaments', tournamentId, 'participants'));
        const entryTxRef = doc(collection(db, 'players', currentUser.uid, 'transactions'));
        const referralTxRef = referrerEligible
          ? doc(collection(db, 'players', referrerId as string, 'transactions'))
          : null;
        const lbRef = doc(db, 'leaderboard', currentUser.uid);

        await runTransaction(db, async (t) => {
          const pSnap = await t.get(playerRef);
          const tSnap = await t.get(tournRef);
          const lbSnap = await t.get(lbRef);

          if (!pSnap.exists()) throw new Error('PROFILE_NOT_FOUND');

          // Re-check "already joined" against the FRESH Firestore doc, not the
          // stale React `profile` state. This is what actually stops a double
          // click / retry from charging the entry fee twice — the old check
          // above ran against local state before this transaction even started,
          // so two near-simultaneous calls both saw "not joined yet" and both
          // proceeded to deduct balance.
          const freshActiveTournaments: string[] = pSnap.data().activeTournaments || [];
          if (freshActiveTournaments.includes(tournamentId)) {
            throw new Error('ALREADY_JOINED');
          }

          const freshBonus = pSnap.data().bonusBalance || 0;
          const freshWallet = pSnap.data().walletBalance || 0;
          const freshTotal = freshBonus + freshWallet;
          if (freshTotal < entryFee) throw new Error('INSUFFICIENT_BALANCE');

          const freshBonusUsed = Math.min(freshBonus, entryFee);
          const freshWalletUsed = entryFee - freshBonusUsed;
          // Computed fresh from the transaction snapshot rather than the
          // outer (possibly stale) `profile` state, so the referrer is
          // never credited the wrong amount due to a stale local flag.
          const freshIsFirstJoin = !pSnap.data().firstTournamentJoined;
          const freshReferrerBonusAmt = freshIsFirstJoin ? 20 : 10;

          const playerUpdate: any = {
            bonusBalance: freshBonus - freshBonusUsed,
            walletBalance: freshWallet - freshWalletUsed,
            tournamentsPlayed: increment(1),
            activeTournaments: arrayUnion(tournamentId)
          };
          if (referrerEligible && freshIsFirstJoin) {
            playerUpdate.firstTournamentJoined = true;
          }
          t.update(playerRef, playerUpdate);

          if (tSnap.exists()) {
            t.update(tournRef, { joinedCount: increment(1) });
          }
          if (referrerRef) {
            t.update(referrerRef, { bonusBalance: increment(freshReferrerBonusAmt) });
          }

          // Join XP — written to the separate, public-safe `leaderboard`
          // collection (never the player's own doc, which holds
          // whatsapp/payment details). Amount depends on the tournament's
          // mode; unrecognized/missing modes simply award 0 rather than
          // failing the join.
          const joinXp = tSnap.exists() ? getModeXp(tSnap.data().mode) : 0;
          if (joinXp > 0) {
            const lbCurrent = lbSnap.exists() ? lbSnap.data() : undefined;
            const updated = applyXpGain(lbCurrent as any, joinXp);
            t.set(lbRef, { name: profile.name, ...updated }, { merge: true });
          }

          // Entry fee transaction log (own history)
          let note = '';
          if (freshBonusUsed > 0 && freshWalletUsed > 0) note = `${freshBonusUsed} bonus - ${freshWalletUsed} wallet`;
          else if (freshBonusUsed > 0) note = `${freshBonusUsed} bonus`;
          else note = `${freshWalletUsed} wallet`;

          t.set(entryTxRef, {
            type: 'entry_fee',
            tournamentId,
            description: `Entry Fee - ${tournamentName}`,
            amount: -entryFee,
            note,
            createdAt: new Date().toISOString()
          });

          // Referral bonus transaction log (goes into the REFERRER's history, not shown to joining player)
          if (referrerRef && referralTxRef) {
            t.set(referralTxRef, {
              type: 'referral_bonus',
              description: `Tournament joined by - ${profile.name}`,
              amount: freshReferrerBonusAmt,
              createdAt: new Date().toISOString()
            });
          }

          // Participant doc — firebaseUID is included specifically so
          // firestore.rules can verify that a player can only create a
          // participant record for themselves (playerUID below is the
          // in-game Free Fire UID, not the Firebase Auth UID, so it can't
          // be used for that check).
          t.set(participantRef, {
            firebaseUID: currentUser.uid,
            playerUID: profile.gameUID,
            playerName: profile.name,
            playerWhatsapp: profile.whatsapp,
            joinedAt: serverTimestamp()
          });
        });
      }

      // Update local state — only reached if the Firestore transaction and
      // all the writes above actually succeeded.
      setProfile(prev => {
        if (!prev) return null;
        return {
          ...prev,
          bonusBalance: Math.max(0, (prev.bonusBalance || 0) - bonusUsed),
          walletBalance: (prev.walletBalance || 0) - walletUsed,
          tournamentsPlayed: (prev.tournamentsPlayed || 0) + 1,
          activeTournaments: [...(prev.activeTournaments || []), tournamentId],
          firstTournamentJoined: referrerEligible ? true : prev.firstTournamentJoined
        };
      });

      setTournaments(prev =>
        prev.map(t => (t.id === tournamentId ? { ...t, joinedCount: t.joinedCount + 1 } : t))
      );

      let txNote = '';
      if (bonusUsed > 0 && walletUsed > 0) txNote = `${bonusUsed} bonus - ${walletUsed} wallet`;
      else if (bonusUsed > 0) txNote = `${bonusUsed} bonus`;
      else txNote = `${walletUsed} wallet`;

      const newTx: Transaction = {
        id: `tx-${Date.now()}`,
        type: 'entry_fee',
        tournamentId,
        description: `Entry Fee - ${tournamentName}`,
        amount: -entryFee,
        note: txNote,
        createdAt: new Date().toISOString()
      };
      setTransactions(prev => [newTx, ...prev]);

      // Confetti effect
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });

      closeModal();
      showToast(`🎮 Tournament Joined! Room ID will be sent on WhatsApp 15m before match!`, 'success');

      // Trigger WhatsApp message window to notify admin
      const msg = encodeURIComponent(
        `🎮 *New Tournament Join!*\nTournament: *${tournamentName}*\nPlayer: *${profile.name}*\nUID: *${profile.gameUID}*\nWhatsApp: *${profile.whatsapp}*\nEntry Fee: *Rs ${entryFee}*`
      );
      window.open(`https://wa.me/${OWNER_WHATSAPP}?text=${msg}`, '_blank');

      return true;
    } catch (err: any) {
      if (err.message === 'ALREADY_JOINED') {
        showToast('✅ You have already joined this tournament!', 'info');
      } else if (err.message === 'INSUFFICIENT_BALANCE') {
        showToast('❌ Insufficient balance! Please deposit first.', 'error');
        openModal('deposit');
      } else if (err.message === 'PROFILE_NOT_FOUND') {
        showToast('❌ Could not find your profile. Please try logging in again.', 'error');
      } else {
        showToast(`Join error: ${err.message}`, 'error');
      }
      return false;
    }
  };

  // Submit Withdrawal Request
  const submitWithdrawalAction = async (amount: number, method: PaymentMethod, account: string): Promise<boolean> => {
    if (!profile || !currentUser) {
      showToast('Please login first', 'error');
      return false;
    }

    if ((profile as any).status === 'banned') {
      showToast('🚫 Your account has been suspended. Contact support on WhatsApp for help.', 'error');
      return false;
    }

    if (amount < 100) {
      showToast('❌ Minimum withdrawal is Rs 100!', 'error');
      return false;
    }

    if (amount > (profile.walletBalance || 0)) {
      showToast('❌ Insufficient balance!', 'error');
      return false;
    }

    try {
      const playerRef = doc(db, 'players', currentUser.uid);

      // Pre-generate refs so the transaction log's ID can be linked onto the
      // withdrawal request as `txDocId`. This is what lets the admin panel
      // find and update THIS SAME transaction in place when the request is
      // later approved/rejected, instead of creating a second, separate
      // transaction while this original one is left stuck showing "Pending
      // Review" forever (the admin panel's own code already expects and
      // reads a txDocId field — the website just never wrote it).
      const txRef = doc(collection(db, 'players', currentUser.uid, 'transactions'));
      const withdrawalRef = doc(collection(db, 'withdrawalRequests'));

      // CRITICAL FIX: this whole block used to be wrapped in an inner
      // try/catch that swallowed EVERY failure here — including the fresh
      // INSUFFICIENT_BALANCE check below (re-verified against live Firestore
      // data, not the possibly-stale local `profile` state), and any
      // permission/network error — then fell straight through to decrement
      // the local wallet balance and show "withdrawal submitted" regardless.
      // That meant a rejected withdrawal (balance actually too low, or a
      // rules rejection) could still show success to the player while
      // nothing was saved and the admin never received the request. A
      // failure here must now stop the flow and hit the outer catch below.
      //
      // All three writes (balance deduction, transaction log, withdrawal
      // request) are also now in ONE atomic transaction — previously they
      // were 3 separate sequential calls, so closing/refreshing the tab
      // right after the balance was deducted could leave the withdrawal
      // request (and/or transaction log) never created, the same class of
      // bug already fixed for tournament joins.
      await runTransaction(db, async (t) => {
        const snap = await t.get(playerRef);
        if (!snap.exists()) throw new Error('PROFILE_NOT_FOUND');
        const freshBal = snap.data().walletBalance || 0;
        if (freshBal < amount) throw new Error('INSUFFICIENT_BALANCE');

        t.update(playerRef, { walletBalance: freshBal - amount });

        t.set(txRef, {
          type: 'withdrawal_pending',
          description: `Withdrawal Request - ${method} (Pending Approval)`,
          amount: -amount,
          createdAt: new Date().toISOString()
        });

        t.set(withdrawalRef, {
          playerFirebaseUID: currentUser.uid,
          playerUID: profile.gameUID,
          playerName: profile.name,
          playerWhatsapp: profile.whatsapp,
          paymentMethod: method,
          paymentAccount: account,
          amount,
          status: 'pending',
          txDocId: txRef.id,
          createdAt: new Date().toISOString()
        });
      });

      // Local state is only updated after every write above has actually
      // succeeded in Firestore — never before.
      setProfile(prev => (prev ? { ...prev, walletBalance: (prev.walletBalance || 0) - amount } : null));

      const newTx: Transaction = {
        id: `tx-${Date.now()}`,
        type: 'withdrawal_pending',
        description: `Withdrawal Request - ${method} (Pending Approval)`,
        amount: -amount,
        createdAt: new Date().toISOString()
      };
      setTransactions(prev => [newTx, ...prev]);

      closeModal();
      openModal('withdrawSuccess', { amount, method, account });

      // Notify owner on WhatsApp
      const waMsg = encodeURIComponent(
        `🔔 *Withdrawal Request*\nPlayer: *${profile.name}*\nUID: *${profile.gameUID}*\nAmount: *Rs ${amount}*\nMethod: *${method}*\nAccount: *${account}*`
      );
      window.open(`https://wa.me/${OWNER_WHATSAPP}?text=${waMsg}`, '_blank');

      return true;
    } catch (err: any) {
      if (err.message === 'INSUFFICIENT_BALANCE') {
        showToast('❌ Insufficient balance! Please refresh and try again.', 'error');
      } else if (err.message === 'PROFILE_NOT_FOUND') {
        showToast('❌ Could not find your profile. Please try logging in again.', 'error');
      } else {
        showToast(`Withdrawal error: ${err.message}`, 'error');
      }
      return false;
    }
  };

  // Vote Poll Action
    const votePollAction = async (announcementId: string, optionIndex: number) => {
    const storageKey = `poll_voted_${announcementId}`;
    if (localStorage.getItem(storageKey)) {
      showToast('⚠️ You have already voted on this poll!', 'info');
      return;
    }

    // Lock IMMEDIATELY (synchronously) so rapid repeated clicks during the
    // network round-trip can never slip through and add extra votes.
    localStorage.setItem(storageKey, String(optionIndex));

    try {
      try {
        const annRef = doc(db, 'announcements', announcementId);
        // Use a transaction so concurrent votes from different players never
        // overwrite each other's counts (fixes lost-vote race condition).
        // For a logged-in player we also record their UID in `voterUIDs` and
        // re-check it inside the transaction, so they can't vote twice by
        // clearing localStorage or switching device/browser. A logged-out
        // visitor is still only limited by the localStorage lock above —
        // that's an accepted, low-stakes limitation (this is a poll, not
        // money), not something worth blocking anonymous voting over.
        // NOTE: firestore.rules must allow this update (currently
        // /announcements/{doc} only allows admin writes) — tracked to be
        // fixed together with the rest of the rules changes.
        await runTransaction(db, async (t) => {
          const annSnap = await t.get(annRef);
          if (!annSnap.exists()) return;

          const data = annSnap.data();

          if (currentUser) {
            const voterUIDs: string[] = data.voterUIDs || [];
            if (voterUIDs.includes(currentUser.uid)) {
              throw new Error('ALREADY_VOTED');
            }
          }

          const curVotes: number[] = data.votes || [];
          curVotes[optionIndex] = (curVotes[optionIndex] || 0) + 1;

          t.update(
            annRef,
            currentUser
              ? { votes: curVotes, voterUIDs: arrayUnion(currentUser.uid) }
              : { votes: curVotes }
          );
        });
      } catch (innerErr) {
        // Firestore write failed (or the account already voted) — release
        // the lock so the user can retry / see the right message.
        localStorage.removeItem(storageKey);
        throw innerErr;
      }

      setAnnouncements(prev =>
        prev.map(ann => {
          if (ann.id === announcementId) {
            const votes = [...(ann.votes || ann.options?.map(() => 0) || [])];
            votes[optionIndex] = (votes[optionIndex] || 0) + 1;
            return { ...ann, votes };
          }
          return ann;
        })
      );

      showToast('✅ Vote recorded! Thank you for participating.', 'success');
    } catch (err: any) {
      if (err.message === 'ALREADY_VOTED') {
        showToast('⚠️ You have already voted on this poll from your account!', 'info');
      } else {
        showToast(`Vote error: ${err.message}`, 'error');
      }
    }
  };

  // Submit Support Ticket
  const submitSupportAction = async (req: SupportRequest): Promise<boolean> => {
    try {
      // Previously wrapped in its own try/catch that swallowed any failure
      // and still reported "ticket submitted" below — the player would then
      // wait for a WhatsApp reply to a ticket that was never actually saved.
      await addDoc(collection(db, 'supportRequests'), {
        ...req,
        status: 'pending',
        createdAt: new Date().toISOString()
      });
      closeModal();
      showToast('✅ Support ticket submitted! We will respond on WhatsApp shortly.', 'success');
      return true;
    } catch (err: any) {
      showToast(`Failed to submit support request: ${err.message}`, 'error');
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        profile,
        loading,
        activeTab,
        setActiveTab,
        tournaments,
        announcements,
        matchResults,
        transactions,
        toasts,
        showToast,
        activeModal,
        openModal,
        closeModal,
        modalData,
        loginWithGoogle,
        logout,
        submitProfileSetup,
        updateProfileData,
        joinTournamentAction,
        submitWithdrawalAction,
        votePollAction,
        submitSupportAction,
        refreshAllData
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
