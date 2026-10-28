import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Wallet, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Trophy, 
  History, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Skull,
  Gift,
  Users,
  Copy,
  MessageCircle
} from 'lucide-react';
import { formatTimestamp, db } from '../firebase';
import { collection, query, where, documentId, getDocs } from 'firebase/firestore';

export const WalletTab: React.FC = () => {
  const { profile, transactions, openModal, showToast } = useAuth();
  const [txFilter, setTxFilter] = useState<'all' | 'deposits' | 'prizes' | 'withdrawals' | 'referrals'>('all');

  const balance = profile?.walletBalance || 0;
  const bonusBalance = profile?.bonusBalance || 0;
  const referredPlayers = profile?.referredPlayers || [];

  // referredPlayers stores each referred player's Firebase UID, not their
  // display name (see AuthContext: arrayUnion(currentUser.uid)). Previously
  // this tab rendered the raw UIDs directly as if they were names. Resolve
  // them to real in-game names here, falling back to a shortened UID if a
  // lookup fails or is still loading.
  const [referredNames, setReferredNames] = useState<Record<string, string>>({});

  useEffect(() => {
    const uidsToResolve = referredPlayers.filter(uid => !(uid in referredNames));
    if (uidsToResolve.length === 0) return;

    let cancelled = false;

    (async () => {
      // Firestore 'in' queries support at most 10 values per query.
      const chunks: string[][] = [];
      for (let i = 0; i < uidsToResolve.length; i += 10) {
        chunks.push(uidsToResolve.slice(i, i + 10));
      }

      const resolved: Record<string, string> = {};
      for (const chunk of chunks) {
        try {
          const q = query(collection(db, 'players'), where(documentId(), 'in', chunk));
          const snap = await getDocs(q);
          snap.forEach(d => {
            resolved[d.id] = d.data().name || `Player ${d.id.slice(0, 6)}`;
          });
        } catch {
          // If a chunk fails to resolve, leave those UIDs unresolved —
          // the render fallback below will show a shortened UID instead.
        }
      }

      if (!cancelled && Object.keys(resolved).length > 0) {
        setReferredNames(prev => ({ ...prev, ...resolved }));
      }
    })();

    return () => { cancelled = true; };
  }, [referredPlayers, referredNames]);

  const referralMessage = profile?.referralCode
    ? `Hello, mein free fire tournaments khel kr paisy kama rha hon\nap bhi join karo: https://clutchzone.fun\nsignup krty hoe mera referral code use krny pr apko 20rs milein gy\nreferral code: ${profile.referralCode}`
    : '';

  const handleCopyReferral = async () => {
    if (!referralMessage) return;
    try {
      await navigator.clipboard.writeText(referralMessage);
      showToast('✅ Referral message copied!', 'success');
    } catch {
      showToast('❌ Could not copy — please try again.', 'error');
    }
  };

  const handleShareReferralWhatsApp = () => {
    if (!referralMessage) return;
    window.open(`https://wa.me/?text=${encodeURIComponent(referralMessage)}`, '_blank');
  };

  // Calculate totals from transactions
  let totalDeposited = 0;
  let totalWithdrawn = 0;
  let totalWon = 0;
  let totalKillsPrize = 0;

  transactions.forEach((tx) => {
    if (tx.type === 'deposit') totalDeposited += tx.amount;
    if (tx.type === 'withdrawal') totalWithdrawn += Math.abs(tx.amount);
    if (tx.type === 'prize') totalWon += tx.amount;
    if (tx.type === 'kill_prize') totalKillsPrize += tx.amount;
  });

  const filteredTransactions = transactions
    .filter((tx) => {
    if (txFilter === 'deposits') return tx.type === 'deposit';
    if (txFilter === 'prizes') return tx.type === 'prize' || tx.type === 'kill_prize';
    if (txFilter === 'withdrawals') return tx.type.startsWith('withdrawal');
    if (txFilter === 'referrals') return tx.type === 'referral_bonus';
    return true;
        })
  .sort((a, b) => {
    const getTime = (t: any) => {
      const val = t.createdAt || t.timestamp;
      if (!val) return 0;
      if (typeof val.toMillis === 'function') return val.toMillis(); // Firestore Timestamp
      if (val instanceof Date) return val.getTime();
      if (typeof val === 'number') return val;
      return new Date(val).getTime();
    };
    return getTime(b) - getTime(a); // latest first
  });

  return (
    <div className="space-y-6 pb-8">
      {/* Wallet Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#161A2E] via-[#1E2340] to-[#0F1220] border border-[#F5A623]/30 p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none text-8xl font-heading">
          💳
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs uppercase font-tech font-bold tracking-wider text-[#7A84A8] flex items-center gap-1.5">
              <Wallet className="w-4 h-4 text-[#F5A623]" /> Available Wallet Balance
            </span>
            {profile && (
              <span className="text-[11px] text-[#2ECC71] font-tech font-bold bg-[#2ECC71]/10 px-2.5 py-0.5 rounded-full border border-[#2ECC71]/20">
                Verified Account
              </span>
            )}
          </div>

          <div className="font-heading font-black text-5xl sm:text-6xl text-[#F5A623] tracking-tight mb-6 text-gold-shadow">
            Rs {balance.toLocaleString()}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md">
            <button
              onClick={() => openModal('deposit')}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#F5A623] to-[#D4891C] text-black font-heading font-black text-lg uppercase tracking-wider py-3.5 px-6 rounded-xl shadow-lg shadow-[#F5A623]/25 hover:brightness-110 active:scale-98 transition-all"
            >
              <ArrowDownLeft className="w-5 h-5 stroke-[2.5]" />
              <span>Deposit Funds</span>
            </button>

            <button
              onClick={() => openModal('withdraw')}
              className="flex items-center justify-center gap-2 bg-[#161A2E] border-2 border-[#F5A623] text-[#F5A623] font-heading font-black text-lg uppercase tracking-wider py-3.5 px-6 rounded-xl hover:bg-[#F5A623]/10 active:scale-98 transition-all"
            >
              <ArrowUpRight className="w-5 h-5 stroke-[2.5]" />
              <span>Withdraw Cash</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bonus Wallet Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#161A2E] via-[#1A2A22] to-[#0F1220] border border-[#2ECC71]/30 p-5 sm:p-6 shadow-xl">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-xs uppercase font-tech font-bold tracking-wider text-[#7A84A8] flex items-center gap-1.5">
            <Gift className="w-4 h-4 text-[#2ECC71]" /> Bonus Wallet
          </span>
          <span className="text-[10px] text-[#7A84A8] font-tech uppercase tracking-wide">
            Non-withdrawable · Tournament entry only
          </span>
        </div>

        <div className="font-heading font-black text-3xl sm:text-4xl text-[#2ECC71] tracking-tight mb-3">
          Rs {bonusBalance.toLocaleString()}
        </div>

        {profile?.referralCode && (
          <div className="mb-3">
            <div className="text-[11px] text-[#7A84A8] font-tech mb-2">
              Your referral code: <span className="text-[#EEF0FF] font-bold">{profile.referralCode}</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleCopyReferral}
                className="flex items-center justify-center gap-1.5 text-[11px] font-tech font-bold uppercase bg-[#0F1220] border border-[#252B47] text-[#EEF0FF] px-3 py-2 rounded-lg hover:border-[#2ECC71] transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
                Copy Message
              </button>
              <button
                onClick={handleShareReferralWhatsApp}
                className="flex items-center justify-center gap-1.5 text-[11px] font-tech font-bold uppercase bg-[#2ECC71]/10 border border-[#2ECC71]/40 text-[#2ECC71] px-3 py-2 rounded-lg hover:bg-[#2ECC71]/20 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                Share on WhatsApp
              </button>
            </div>
          </div>
        )}

        <div className="flex items-start gap-2 pt-3 border-t border-[#252B47]">
          <Users className="w-4 h-4 text-[#7A84A8] mt-0.5 shrink-0" />
          <div>
            <span className="text-[11px] text-[#7A84A8] font-tech uppercase block mb-1.5">
              Players You Referred {referredPlayers.length > 0 && `(${referredPlayers.length})`}
            </span>
            {referredPlayers.length === 0 ? (
              <span className="text-xs text-[#7A84A8]">None yet — share your code to start earning</span>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {referredPlayers.map((uid, i) => (
                  <span
                    key={uid || i}
                    className="text-[11px] bg-[#0F1220] border border-[#252B47] text-[#EEF0FF] px-2.5 py-1 rounded-full"
                  >
                    {referredNames[uid] || `Player ${uid.slice(0, 6)}…`}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Wallet Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#161A2E] border border-[#252B47] rounded-xl p-4">
          <span className="text-[11px] text-[#7A84A8] font-tech uppercase block mb-1">Total Deposited</span>
          <span className="font-heading font-black text-xl sm:text-2xl text-[#2ECC71]">
            Rs {totalDeposited.toLocaleString()}
          </span>
        </div>

        <div className="bg-[#161A2E] border border-[#252B47] rounded-xl p-4">
          <span className="text-[11px] text-[#7A84A8] font-tech uppercase block mb-1">Total Withdrawn</span>
          <span className="font-heading font-black text-xl sm:text-2xl text-[#E74C3C]">
            Rs {totalWithdrawn.toLocaleString()}
          </span>
        </div>

        <div className="bg-[#161A2E] border border-[#252B47] rounded-xl p-4">
          <span className="text-[11px] text-[#7A84A8] font-tech uppercase block mb-1">Tournament Prizes</span>
          <span className="font-heading font-black text-xl sm:text-2xl text-[#F5A623]">
            Rs {totalWon.toLocaleString()}
          </span>
        </div>

        <div className="bg-[#161A2E] border border-[#252B47] rounded-xl p-4">
          <span className="text-[11px] text-[#7A84A8] font-tech uppercase block mb-1">Kill Rewards</span>
          <span className="font-heading font-black text-xl sm:text-2xl text-[#4A9EFF]">
            Rs {totalKillsPrize.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Transaction History Section */}
      <div className="bg-[#161A2E] border border-[#252B47] rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-[#F5A623]" />
            <h2 className="font-heading font-black text-xl uppercase tracking-wider text-[#EEF0FF]">
              Transaction History
            </h2>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-tech uppercase">
            <button
              onClick={() => setTxFilter('all')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                txFilter === 'all'
                  ? 'bg-[#F5A623] text-black font-bold'
                  : 'bg-[#0F1220] text-[#7A84A8] hover:text-[#EEF0FF]'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setTxFilter('deposits')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                txFilter === 'deposits'
                  ? 'bg-[#2ECC71] text-black font-bold'
                  : 'bg-[#0F1220] text-[#7A84A8] hover:text-[#EEF0FF]'
              }`}
            >
              Deposits
            </button>
            <button
              onClick={() => setTxFilter('prizes')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                txFilter === 'prizes'
                  ? 'bg-[#F5A623] text-black font-bold'
                  : 'bg-[#0F1220] text-[#7A84A8] hover:text-[#EEF0FF]'
              }`}
            >
              Prizes
            </button>
            <button
              onClick={() => setTxFilter('withdrawals')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                txFilter === 'withdrawals'
                  ? 'bg-[#E74C3C] text-black font-bold'
                  : 'bg-[#0F1220] text-[#7A84A8] hover:text-[#EEF0FF]'
              }`}
            >
              Withdrawals
            </button>
            <button
              onClick={() => setTxFilter('referrals')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                txFilter === 'referrals'
                  ? 'bg-[#2ECC71] text-black font-bold'
                  : 'bg-[#0F1220] text-[#7A84A8] hover:text-[#EEF0FF]'
              }`}
            >
              Refer Bonus
            </button>
          </div>
        </div>

        {filteredTransactions.length === 0 ? (
          <div className="py-12 text-center text-[#7A84A8]">
            <div className="text-4xl mb-3">💸</div>
            <p className="text-sm font-medium text-[#EEF0FF] mb-1">No transactions recorded</p>
            <p className="text-xs max-w-xs mx-auto">
              Deposit funds to join tournaments and win cash per kill.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#252B47]">
            {filteredTransactions.map((tx, idx) => {
              const isPositive = tx.amount > 0;
              const isPending = tx.type === 'withdrawal_pending';
              const isRejected = tx.type === 'withdrawal_rejected';

              return (
                <div key={tx.id || idx} className="py-3.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        tx.type === 'deposit'
                          ? 'bg-[#2ECC71]/15 text-[#2ECC71]'
                          : tx.type === 'prize' || tx.type === 'kill_prize'
                          ? 'bg-[#F5A623]/15 text-[#F5A623]'
                          : tx.type === 'entry_fee'
                          ? 'bg-[#4A9EFF]/15 text-[#4A9EFF]'
                          : tx.type === 'referral_bonus'
                          ? 'bg-[#2ECC71]/15 text-[#2ECC71]'
                          : 'bg-[#E74C3C]/15 text-[#E74C3C]'
                      }`}
                    >
                      {tx.type === 'deposit' && <ArrowDownLeft className="w-5 h-5" />}
                      {tx.type === 'prize' && <Trophy className="w-5 h-5" />}
                      {tx.type === 'kill_prize' && <Skull className="w-5 h-5" />}
                      {tx.type === 'entry_fee' && <Trophy className="w-5 h-5" />}
                      {tx.type === 'referral_bonus' && <Gift className="w-5 h-5" />}
                      {tx.type.startsWith('withdrawal') && <ArrowUpRight className="w-5 h-5" />}
                    </div>

                    <div>
                      <div className="text-xs sm:text-sm font-bold text-[#EEF0FF] leading-snug">
                        {tx.description}
                      </div>
                      <div className="text-[11px] text-[#7A84A8]">
                        {formatTimestamp(tx.createdAt || tx.timestamp)}
                      </div>
                      {tx.note && (
                        <div className="text-[10px] text-[#7A84A8] mt-0.5">
                          {tx.note}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <div
                      className={`font-heading font-black text-base sm:text-lg ${
                        isPending
                          ? 'text-[#F5A623]'
                          : isRejected
                          ? 'text-[#7A84A8] line-through'
                          : isPositive
                          ? 'text-[#2ECC71]'
                          : 'text-[#E74C3C]'
                      }`}
                    >
                      {isPositive ? '+' : ''}Rs {Math.abs(tx.amount).toLocaleString()}
                      {tx.type === 'referral_bonus' && (
                        <span className="text-[10px] font-normal text-[#7A84A8]"> (bonus)</span>
                      )}
                    </div>

                    <div className="text-[10px] font-tech uppercase font-bold mt-0.5">
                      {isPending && (
                        <span className="text-[#F5A623] flex items-center justify-end gap-1">
                          <Clock className="w-3 h-3" /> Pending Review
                        </span>
                      )}
                      {isRejected && (
                        <span className="text-[#E74C3C] flex items-center justify-end gap-1">
                          <XCircle className="w-3 h-3" /> Rejected
                        </span>
                      )}
                      {!isPending && !isRejected && (
                        <span className="text-[#2ECC71] flex items-center justify-end gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Processed
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
