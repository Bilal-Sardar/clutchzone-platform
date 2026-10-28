import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { X, ShieldCheck, Check } from 'lucide-react';

export const TermsModal: React.FC = () => {
  const { activeModal, closeModal } = useAuth();

  if (activeModal !== 'terms') return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
      onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
    >
      <div className="w-full sm:max-w-lg bg-[#0F1220] border-t sm:border border-[#F5A623]/30 sm:rounded-2xl rounded-t-2xl p-6 shadow-2xl relative max-h-[85vh] overflow-y-auto">
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-[#7A84A8] hover:text-white p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-[#F5A623]" />
            <h2 className="font-heading font-black text-2xl uppercase text-[#EEF0FF]">
              Terms &amp; Tournament Rules
            </h2>
          </div>

          <div className="text-xs text-[#7A84A8] space-y-3.5 leading-relaxed divide-y divide-[#252B47]">
            <div className="pt-2">
              <h3 className="font-heading font-bold text-sm text-[#F5A623] uppercase">1. Entry Fee &amp; Slot Confirmation</h3>
              <p>Players must deposit the required entry fee before the tournament lobby begins. Entry fees are non-refundable once the custom match room has started.</p>
            </div>
            <div className="pt-2">
              <h3 className="font-heading font-bold text-sm text-[#F5A623] uppercase">2. Prize Pool &amp; Kill Bonuses</h3>
              <p>Prizes and kill bonuses vary by tournament and mode — the guaranteed pool, kill bonus rate, and payout positions for each match are shown on the tournament card before you join. Balance is automatically credited within 1-2 hours after match completion.</p>
            </div>
            <div className="pt-2">
              <h3 className="font-heading font-bold text-sm text-[#F5A623] uppercase">3. Strict Fair Play &amp; Anti-Cheat</h3>
              <p>Hacking, third-party aimbots, script modding, or team collusion in solo tournaments will result in an immediate permanent ban and confiscation of all winnings.</p>
            </div>
            <div className="pt-2">
              <h3 className="font-heading font-bold text-sm text-[#F5A623] uppercase">4. Withdrawal Regulations</h3>
              <p>The minimum withdrawal is Rs 100. Payouts are executed via JazzCash or EasyPaisa within 1-24 hours. Bonus Wallet funds (signup bonus and referral earnings) are non-withdrawable and can only be used toward tournament entry fees — see Section 7.</p>
            </div>
            <div className="pt-2">
              <h3 className="font-heading font-bold text-sm text-[#F5A623] uppercase">5. Single Account Registration</h3>
              <p>Each player is entitled to one registered account, verified by a unique Game UID, WhatsApp number, and player name — each may be used on only one ClutchZone account. ClutchZone reserves the right to suspend duplicate or multiple accounts attempting to abuse entry fees, prizes, or the referral program.</p>
            </div>
            <div className="pt-2">
              <h3 className="font-heading font-bold text-sm text-[#F5A623] uppercase">6. Match Disputes &amp; Screen Recordings</h3>
              <p>Any kill count dispute or match recording review must be submitted to WhatsApp support within 6 hours of match completion.</p>
            </div>
            <div className="pt-2">
              <h3 className="font-heading font-bold text-sm text-[#F5A623] uppercase">7. Referral Program</h3>
              <p>New players who sign up using a valid referral code receive a Rs 20 signup bonus. The referring player earns Rs 20 when their referred player joins their first tournament with an entry fee of Rs 60 or more, and Rs 10 for every subsequent tournament (Rs 60+ entry fee) that player joins. All referral earnings are credited to the Bonus Wallet and are non-withdrawable — usable only toward tournament entry fees. Creating multiple accounts, using fake referrals, or any other attempt to abuse the referral program will result in forfeiture of the bonus and possible account suspension under Section 5.</p>
            </div>
            <div className="pt-2">
              <h3 className="font-heading font-bold text-sm text-[#F5A623] uppercase">8. Player-Side Non-Participation</h3>
              <p>If a player joins a tournament but does not participate due to a personal issue on their end (e.g. network problems, phone battery, being unavailable), they will receive a full entry fee refund the first time this occurs. Any subsequent occurrence will only be refunded at 50% of the entry fee. This policy exists to keep tournaments fair for players who show up and play.</p>
            </div>
            <div className="pt-2">
              <h3 className="font-heading font-bold text-sm text-[#F5A623] uppercase">9. Platform &amp; Game-Side Technical Issues</h3>
              <p>If a tournament is disrupted due to an issue on ClutchZone's or Free Fire's side (e.g. server timeout, connectivity failure), all joined players will either receive a full entry fee refund or a free re-entry into another tournament with the same entry fee, at ClutchZone's discretion.</p>
            </div>
            <div className="pt-2">
              <h3 className="font-heading font-bold text-sm text-[#F5A623] uppercase">10. Punctuality</h3>
              <p>Players must join the custom room on time. Our automated system sends the Room ID and Password directly to your registered WhatsApp number 20-30 minutes before match start. Tournaments will start as scheduled whether or not all registered players have joined. Players who miss the start due to being late will receive a 50% entry fee refund.</p>
            </div>
          </div>

          <div className="p-3 bg-[#F5A623]/10 border border-[#F5A623]/30 rounded-xl text-xs text-[#F5A623]">
            ⚠️ By registering on ClutchZone and entering tournaments, you agree to all fair play terms and conditions above.
          </div>

          <button
            onClick={closeModal}
            className="w-full py-3 bg-[#F5A623] text-black font-heading font-black text-base uppercase tracking-wider rounded-xl shadow-lg hover:brightness-110 flex items-center justify-center gap-2"
          >
            <Check className="w-5 h-5" />
            <span>I UNDERSTAND &amp; ACCEPT</span>
          </button>
        </div>
      </div>
    </div>
  );
};
