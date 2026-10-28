import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Flame, 
  Trophy, 
  Users, 
  Gamepad2, 
  DollarSign, 
  ShieldCheck, 
  Smartphone, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  ChevronDown,
  Pin
} from 'lucide-react';
import { getTimeAgo } from '../firebase';

export const HomeTab: React.FC = () => {
  const { setActiveTab, openModal, profile, announcements, votePollAction } = useAuth();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
    q: "How can I earn real money by playing Free Fire?",
    a: "Join any ClutchZone tournament — Solo, Duo, Squad, Clash Squad, or Battle Royale — with entry fees starting from Rs 50. Each tournament has its own guaranteed prize pool (shown on the tournament card before you join) and some tournaments also pay a kill bonus per elimination. Winnings go straight into your ClutchZone wallet and can be withdrawn to JazzCash or EasyPaisa once your balance reaches Rs 100."
  },
  {
    q: "What tournament modes are available?",
    a: "We regularly run Solo, Duo, Squad, and Clash Squad matches, plus Battle Royale Classic and Lite lobbies with bigger slot counts. Entry fee, kill bonus, and prize pool are different for every tournament — check the details on each tournament card before joining."
  },
  {
    q: "How do I get the Custom Room ID & Password?",
    a: "15 minutes before the match start time, our automated system sends the Room ID and Password directly to your registered WhatsApp number. You enter the room in the Free Fire app and get ready to drop in!"
  },
  {
    q: "When and how are prizes distributed?",
    a: "Prizes and kill earnings are verified by our match referee team and credited to your ClutchZone wallet within 1-2 hours after the match finishes. You can withdraw anytime 24/7 (recommended time 8AM-5PM)"
  },
  {
    q: "What payment methods are supported in Pakistan?",
    a: "We support JazzCash, EasyPaisa, and direct bank transfers. Deposits are approved within minutes, and withdrawal requests are processed safely within 24 hours."
  },
  {
    q: "How does the Referral Program work?",
    a: "Every player gets a unique referral code (find it in your Wallet, under Bonus Wallet). Share it with friends — when they sign up using your code, they instantly get Rs 20. When they join their first paid tournament (entry fee Rs 60 or more), you get Rs 20. Every time after that when they join a tournament with entry fee Rs 60+, you get Rs 10. There's no limit on how many friends you can refer!"
  },
  {
    q: "Can I withdraw my referral bonus?",
    a: "No. Referral bonuses (signup bonus and referral earnings) go into a separate Bonus Wallet and can only be used to pay tournament entry fees — they cannot be withdrawn as cash. Your regular wallet balance (deposits and tournament winnings) remains fully withdrawable as usual."
  },
  {
    q: "I'm having trouble creating my account or joining a match. Who do I contact?",
    a: "Tap the Customer Support button (available on the profile setup screen and in the app menu) to message us directly on WhatsApp, or submit a support ticket from the app. We usually respond within a few hours."
  }
];

  return (
    <div className="space-y-6 pb-8">
      {/* Hero Section with Free Fire Background Animation */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#161A2E] via-[#121629] to-[#0A0D18] border border-[#F5A623]/30 p-6 sm:p-10 text-center shadow-2xl">
        {/* Tactical Battle Grid Background Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #F5A623 1px, transparent 0), linear-gradient(to right, rgba(245,166,35,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(245,166,35,0.1) 1px, transparent 1px)`,
            backgroundSize: '32px 32px, 32px 32px, 32px 32px'
          }}
        />

        {/* Free Fire Tactical Scanline */}
        <div className="absolute inset-x-0 h-28 bg-gradient-to-b from-transparent via-[#F5A623]/10 to-transparent pointer-events-none animate-tactical-scan" />

        {/* Free Fire Safe Zone & Radar Pulse Rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[480px] h-[340px] sm:h-[480px] rounded-full border border-[#F5A623]/15 pointer-events-none animate-zone-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] sm:w-[320px] h-[220px] sm:h-[320px] rounded-full border border-dashed border-[#E74C3C]/20 pointer-events-none animate-reticle-slow" />
        
        {/* Tactical Crosshair Center Marks */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 pointer-events-none opacity-20 hidden sm:block">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-2 bg-[#F5A623]" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1px] h-2 bg-[#F5A623]" />
          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-[1px] w-2 bg-[#F5A623]" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 h-[1px] w-2 bg-[#F5A623]" />
        </div>

        {/* Free Fire Corner HUD Reticles */}
        <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-[#F5A623]/40 pointer-events-none" />
        <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-[#F5A623]/40 pointer-events-none" />
        <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-[#F5A623]/40 pointer-events-none" />
        <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-[#F5A623]/40 pointer-events-none" />

        {/* Fiery Ambient Lighting & Flame Aura */}
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-[#F5A623]/15 rounded-full blur-3xl pointer-events-none animate-flame-aura" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-[#E74C3C]/15 rounded-full blur-3xl pointer-events-none animate-flame-aura" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-28 bg-gradient-to-t from-[#F5A623]/10 via-[#E74C3C]/5 to-transparent rounded-full blur-2xl pointer-events-none animate-flame-aura" style={{ animationDelay: '1s' }} />

        {/* Free Fire Floating Rising Embers / Flame Spark Particles */}
        <div className="ember-particle bg-[#F5A623] w-1.5 h-1.5 bottom-2 left-[12%] shadow-[0_0_8px_#F5A623]" style={{ animationDuration: '4.2s', animationDelay: '0.2s' }} />
        <div className="ember-particle bg-[#FF5722] w-2 h-2 bottom-3 left-[24%] shadow-[0_0_10px_#FF5722]" style={{ animationDuration: '5.1s', animationDelay: '1.4s' }} />
        <div className="ember-particle bg-[#F5A623] w-1 h-1 bottom-1 left-[38%] shadow-[0_0_6px_#F5A623]" style={{ animationDuration: '3.8s', animationDelay: '0.7s' }} />
        <div className="ember-particle bg-[#FF9800] w-2.5 h-2.5 bottom-4 left-[52%] shadow-[0_0_12px_#FF9800]" style={{ animationDuration: '6.0s', animationDelay: '2.1s' }} />
        <div className="ember-particle bg-[#E74C3C] w-1.5 h-1.5 bottom-2 left-[68%] shadow-[0_0_8px_#E74C3C]" style={{ animationDuration: '4.7s', animationDelay: '1.0s' }} />
        <div className="ember-particle bg-[#F5A623] w-2 h-2 bottom-3 left-[82%] shadow-[0_0_10px_#F5A623]" style={{ animationDuration: '5.5s', animationDelay: '2.8s' }} />
        <div className="ember-particle bg-[#FFB300] w-1 h-1 bottom-1 left-[92%] shadow-[0_0_6px_#FFB300]" style={{ animationDuration: '3.5s', animationDelay: '0.5s' }} />
        <div className="ember-particle bg-[#FF5722] w-1.5 h-1.5 bottom-2 left-[6%] shadow-[0_0_8px_#FF5722]" style={{ animationDuration: '4.9s', animationDelay: '2.3s' }} />
        <div className="ember-particle bg-[#F5A623] w-2 h-2 bottom-4 left-[45%] shadow-[0_0_10px_#F5A623]" style={{ animationDuration: '5.8s', animationDelay: '3.2s' }} />
        <div className="ember-particle bg-[#E74C3C] w-1 h-1 bottom-1 left-[75%] shadow-[0_0_6px_#E74C3C]" style={{ animationDuration: '4.0s', animationDelay: '1.8s' }} />

        {/* Tactical HUD Header */}
        <div className="relative z-10 inline-flex items-center gap-2 bg-[#F5A623]/10 border border-[#F5A623]/30 px-4 py-1.5 rounded-full text-xs font-tech font-bold text-[#F5A623] mb-5 tracking-wide uppercase shadow-sm">
          <Flame className="w-3.5 h-3.5 text-[#F5A623] animate-pulse" />
          <span>Pakistan's #1 Free Fire Esports Platform</span>
        </div>

        <h1 className="relative z-10 font-heading font-black text-4xl sm:text-6xl uppercase tracking-tight leading-[0.95] mb-4 text-[#EEF0FF]">
          Free Fire Tournaments – <br />
          <span className="text-[#F5A623] text-gold-shadow">Earn Real Cash</span> in Pakistan
        </h1>

        <p className="relative z-10 max-w-xl mx-auto text-sm sm:text-base text-[#7A84A8] leading-relaxed mb-8">
          Compete in verified solo, duo, and clash squad tournaments. Win up to <strong className="text-[#EEF0FF]">Rs 600</strong> first prize + <strong className="text-[#2ECC71]">Rs 20 per kill</strong> in every match. Instant withdrawals to JazzCash &amp; EasyPaisa!
        </p>

        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto">
          <button
            onClick={() => setActiveTab('tournaments')}
            className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2.5 bg-gradient-to-r from-[#F5A623] to-[#D4891C] text-black font-heading font-black text-lg uppercase tracking-wider py-3.5 px-6 rounded-xl shadow-lg shadow-[#F5A623]/30 hover:brightness-110 active:scale-98 transition-all"
          >
            <Gamepad2 className="w-5 h-5" />
            <span>START PLAYING NOW</span>
          </button>

          {!profile ? (
            <button
              onClick={() => openModal('login')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#1E2340] border border-[#F5A623]/40 text-[#F5A623] font-heading font-bold text-base uppercase tracking-wider py-3.5 px-6 rounded-xl hover:bg-[#252B47] transition-colors"
            >
              <span>Player Login</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => setActiveTab('wallet')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#1E2340] border border-[#2ECC71]/40 text-[#2ECC71] font-heading font-bold text-base uppercase tracking-wider py-3.5 px-6 rounded-xl hover:bg-[#252B47] transition-colors"
            >
              <span>Wallet (Rs {(profile.walletBalance || 0).toLocaleString()})</span>
            </button>
          )}
        </div>
      </section>

      {/* Announcements & Polls */}
      {announcements.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-heading font-black text-xl uppercase tracking-wider flex items-center gap-2 text-[#EEF0FF]">
              <Flame className="w-5 h-5 text-[#F5A623]" />
              <span>Announcements &amp; Polls</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {announcements.map((ann) => {
              const userVoted = localStorage.getItem(`poll_voted_${ann.id}`);
              const totalVotes = (ann.votes || []).reduce((sum, v) => sum + (v || 0), 0);

              return (
                <div
                  key={ann.id}
                  className={`relative rounded-xl p-4 transition-all ${
                    ann.pinned
                      ? 'bg-[#161A2E] border-2 border-[#F5A623]/40 shadow-md'
                      : 'bg-[#161A2E]/80 border border-[#252B47]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{ann.emoji || '📢'}</span>
                      <div>
                        <h3 className="font-heading font-bold text-base uppercase text-[#EEF0FF] leading-snug">
                          {ann.title}
                        </h3>
                        <span className="text-[11px] text-[#7A84A8]">
                          {getTimeAgo(ann.createdAt)}
                        </span>
                      </div>
                    </div>
                    {ann.pinned && (
                      <span className="inline-flex items-center gap-1 bg-[#F5A623]/15 text-[#F5A623] text-[10px] font-tech font-bold uppercase px-2 py-0.5 rounded-full border border-[#F5A623]/30">
                        <Pin className="w-3 h-3" /> Pinned
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-[#7A84A8] leading-relaxed mb-3">
                    {ann.message}
                  </p>

                  {/* If Poll Type */}
                  {ann.type === 'poll' && ann.options && (
                    <div className="space-y-2 pt-1 border-t border-[#252B47]">
                      <div className="text-[11px] font-tech font-bold text-[#F5A623] uppercase">
                        {userVoted !== null ? '✅ Your Vote Counted' : '👆 Tap an option to vote:'}
                      </div>
                      <div className="space-y-1.5">
                        {ann.options.map((opt, optIdx) => {
                          const count = ann.votes?.[optIdx] || 0;
                          const pct = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
                          const isSelected = userVoted === String(optIdx);

                          return (
                            <button
                              key={optIdx}
                              disabled={userVoted !== null}
                              onClick={() => votePollAction(ann.id, optIdx)}
                              className={`w-full text-left relative overflow-hidden rounded-lg p-2 text-xs transition-all border ${
                                isSelected
                                  ? 'border-[#F5A623] bg-[#F5A623]/10 font-bold text-[#F5A623]'
                                  : 'border-[#252B47] bg-[#0F1220] text-[#EEF0FF] hover:border-[#7A84A8]'
                              }`}
                            >
                              {userVoted !== null && (
                                <div
                                  className="absolute top-0 bottom-0 left-0 bg-[#F5A623]/15 transition-all duration-500 pointer-events-none"
                                  style={{ width: `${pct}%` }}
                                />
                              )}
                              <div className="relative flex items-center justify-between gap-2 z-10">
                                <span>{isSelected ? '✓ ' : ''}{opt}</span>
                                {userVoted !== null && (
                                  <span className="font-tech font-bold text-[#F5A623]">
                                    {pct}% ({count})
                                  </span>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                      <div className="text-[10px] text-[#7A84A8] text-right font-tech">
                        🗳️ Total {totalVotes} votes
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Platform Live Stats */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#161A2E] border border-[#252B47] rounded-xl p-4 text-center">
          <div className="w-10 h-10 mx-auto rounded-lg bg-[#2ECC71]/10 text-[#2ECC71] flex items-center justify-center mb-2">
            <Trophy className="w-5 h-5" />
          </div>
          <div className="font-heading font-black text-2xl sm:text-3xl text-[#2ECC71]">Rs 10K+</div>
          <div className="text-xs text-[#7A84A8] font-medium">Prizes Distributed</div>
        </div>

        <div className="bg-[#161A2E] border border-[#252B47] rounded-xl p-4 text-center">
          <div className="w-10 h-10 mx-auto rounded-lg bg-[#F5A623]/10 text-[#F5A623] flex items-center justify-center mb-2">
            <Users className="w-5 h-5" />
          </div>
          <div className="font-heading font-black text-2xl sm:text-3xl text-[#F5A623]">1,000+</div>
          <div className="text-xs text-[#7A84A8] font-medium">Active Gamers</div>
        </div>

        <div className="bg-[#161A2E] border border-[#252B47] rounded-xl p-4 text-center">
          <div className="w-10 h-10 mx-auto rounded-lg bg-[#4A9EFF]/10 text-[#4A9EFF] flex items-center justify-center mb-2">
            <Gamepad2 className="w-5 h-5" />
          </div>
          <div className="font-heading font-black text-2xl sm:text-3xl text-[#4A9EFF]">30+</div>
          <div className="text-xs text-[#7A84A8] font-medium">Tournaments Hosted</div>
        </div>

        <div className="bg-[#161A2E] border border-[#252B47] rounded-xl p-4 text-center">
          <div className="w-10 h-10 mx-auto rounded-lg bg-[#E74C3C]/10 text-[#E74C3C] flex items-center justify-center mb-2">
            <DollarSign className="w-5 h-5" />
          </div>
          <div className="font-heading font-black text-2xl sm:text-3xl text-[#E74C3C]">Rs 20</div>
          <div className="text-xs text-[#7A84A8] font-medium">Per Kill Bonus</div>
        </div>
      </section>

      {/* How to Earn Money Playing Free Fire */}
      <section className="bg-[#161A2E] border border-[#252B47] rounded-2xl p-6 sm:p-8">
        <h2 className="font-heading font-black text-2xl uppercase tracking-wider mb-6 flex items-center gap-2 text-[#EEF0FF]">
          <Flame className="w-6 h-6 text-[#F5A623]" />
          <span>How to Earn Money in 4 Simple Steps</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#0F1220] border border-[#252B47] rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-lg bg-[#F5A623] text-black font-heading font-black text-lg flex items-center justify-center mb-3 shadow-md shadow-[#F5A623]/30">
                1
              </div>
              <h3 className="font-heading font-bold text-lg uppercase text-[#EEF0FF] mb-1">Create Profile</h3>
              <p className="text-xs text-[#7A84A8] leading-relaxed">
                Login with Gmail, input your Free Fire Game UID and JazzCash/EasyPaisa number.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#252B47] text-[11px] text-[#F5A623] font-tech font-bold">
              ⚡ Free 1-Minute Setup
            </div>
          </div>

          <div className="bg-[#0F1220] border border-[#252B47] rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-lg bg-[#F5A623] text-black font-heading font-black text-lg flex items-center justify-center mb-3 shadow-md shadow-[#F5A623]/30">
                2
              </div>
              <h3 className="font-heading font-bold text-lg uppercase text-[#EEF0FF] mb-1">Deposit &amp; Join</h3>
              <p className="text-xs text-[#7A84A8] leading-relaxed">
                Deposit entry fee (Rs 70) to your wallet, select an active match, and click Join.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#252B47] text-[11px] text-[#2ECC71] font-tech font-bold">
              💳 JazzCash / EasyPaisa
            </div>
          </div>

          <div className="bg-[#0F1220] border border-[#252B47] rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-lg bg-[#F5A623] text-black font-heading font-black text-lg flex items-center justify-center mb-3 shadow-md shadow-[#F5A623]/30">
                3
              </div>
              <h3 className="font-heading font-bold text-lg uppercase text-[#EEF0FF] mb-1">Get Room ID</h3>
              <p className="text-xs text-[#7A84A8] leading-relaxed">
                Receive Custom Room ID &amp; Password on WhatsApp 15 minutes before the match starts.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#252B47] text-[11px] text-[#4A9EFF] font-tech font-bold">
              📱 WhatsApp Automated Delivery
            </div>
          </div>

          <div className="bg-[#0F1220] border border-[#252B47] rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-lg bg-[#F5A623] text-black font-heading font-black text-lg flex items-center justify-center mb-3 shadow-md shadow-[#F5A623]/30">
                4
              </div>
              <h3 className="font-heading font-bold text-lg uppercase text-[#EEF0FF] mb-1">Win &amp; Withdraw</h3>
              <p className="text-xs text-[#7A84A8] leading-relaxed">
                Win rank prizes + Rs 20 per kill. Withdraw your earnings directly to your mobile wallet.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#252B47] text-[11px] text-[#2ECC71] font-tech font-bold">
              💰 Instant Payouts (Min Rs 100)
            </div>
          </div>
        </div>
      </section>

      {/* Standard Prize Structure Breakdown */}
      <section className="bg-[#161A2E] border border-[#252B47] rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="font-heading font-black text-2xl uppercase tracking-wider text-[#EEF0FF]">
              💰 Standard Tournament Prize Pool
            </h2>
            <p className="text-xs text-[#7A84A8]">Guaranteed payout matrix for standard 48-50 player lobbies</p>
          </div>
          <div className="bg-[#F5A623]/10 border border-[#F5A623]/30 px-3 py-1.5 rounded-lg text-xs font-tech font-bold text-[#F5A623] self-start sm:self-auto">
            Entry: Rs 70 Only
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-[#0F1220] border border-[#252B47] rounded-xl p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🥇</span>
              <div>
                <div className="font-heading font-bold text-base text-[#EEF0FF]">1st Place (Winner)</div>
                <div className="text-[11px] text-[#7A84A8]">Booyah Champion</div>
              </div>
            </div>
            <div className="font-heading font-black text-2xl text-[#F5A623]">Rs 600</div>
          </div>

          <div className="bg-[#0F1220] border border-[#252B47] rounded-xl p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🥈</span>
              <div>
                <div className="font-heading font-bold text-base text-[#EEF0FF]">2nd Place (Runner Up)</div>
                <div className="text-[11px] text-[#7A84A8]">Finalist</div>
              </div>
            </div>
            <div className="font-heading font-black text-2xl text-[#C0C0C0]">Rs 400</div>
          </div>

          <div className="bg-[#0F1220] border border-[#252B47] rounded-xl p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🥉</span>
              <div>
                <div className="font-heading font-bold text-base text-[#EEF0FF]">3rd Place (Top 3)</div>
                <div className="text-[11px] text-[#7A84A8]">Podium Finish</div>
              </div>
            </div>
            <div className="font-heading font-black text-2xl text-[#CD7F32]">Rs 200</div>
          </div>

          <div className="bg-[#0F1220] border border-[#2ECC71]/30 rounded-xl p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">💀</span>
              <div>
                <div className="font-heading font-bold text-base text-[#2ECC71]">Per Kill Reward</div>
                <div className="text-[11px] text-[#7A84A8]">Added for every kill you get!</div>
              </div>
            </div>
            <div className="font-heading font-black text-2xl text-[#2ECC71]">Rs 20 / Kill</div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-[#F5A623]/10 border border-[#F5A623]/30 rounded-xl text-xs text-[#7A84A8] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#F5A623] shrink-0" />
          <span>Example: If you win 1st place with 6 kills, you take home <strong>Rs 600 + Rs 120 = Rs 720</strong> directly to your wallet!</span>
        </div>
      </section>

      {/* Trust & Guarantees */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-[#161A2E] border border-[#252B47] rounded-xl p-4 flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#2ECC71]/10 text-[#2ECC71] flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-base text-[#EEF0FF] uppercase">100% Anti-Cheat</h3>
            <p className="text-xs text-[#7A84A8] leading-relaxed">
              Every room is spectated live by referee staff. Strict zero-tolerance ban for scripts or emulators.
            </p>
          </div>
        </div>

        <div className="bg-[#161A2E] border border-[#252B47] rounded-xl p-4 flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#F5A623]/10 text-[#F5A623] flex items-center justify-center shrink-0">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-base text-[#EEF0FF] uppercase">Local Payment Support</h3>
            <p className="text-xs text-[#7A84A8] leading-relaxed">
              Direct integration for JazzCash &amp; EasyPaisa accounts across all cities in Pakistan.
            </p>
          </div>
        </div>

        <div className="bg-[#161A2E] border border-[#252B47] rounded-xl p-4 flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#4A9EFF]/10 text-[#4A9EFF] flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-base text-[#EEF0FF] uppercase">Daily Matches</h3>
            <p className="text-xs text-[#7A84A8] leading-relaxed">
              Daily tournaments scheduled from 8 AM to 10 PM PKT. Solo, Duo, and Squad battles every day.
            </p>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="bg-[#161A2E] border border-[#252B47] rounded-2xl p-6">
        <h2 className="font-heading font-black text-2xl uppercase tracking-wider mb-4 flex items-center gap-2 text-[#EEF0FF]">
          <span>Frequently Asked Questions</span>
        </h2>

        <div className="space-y-2.5">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="bg-[#0F1220] border border-[#252B47] rounded-xl overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-3 text-sm font-heading font-bold uppercase text-[#EEF0FF] hover:text-[#F5A623] transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#7A84A8] transition-transform ${
                      isOpen ? 'rotate-180 text-[#F5A623]' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 text-xs text-[#7A84A8] leading-relaxed border-t border-[#252B47] pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
