import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { PaymentMethod } from '../../types';
import { OWNER_WHATSAPP } from '../../firebase';
import { ShieldAlert, CheckCircle2, MessageCircle } from 'lucide-react';

export const SetupProfileModal: React.FC = () => {
  const { activeModal, closeModal, submitProfileSetup, showToast } = useAuth();

  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [gameUID, setGameUID] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('JazzCash');
  const [paymentAccount, setPaymentAccount] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [loading, setLoading] = useState(false);

  if (activeModal !== 'setup') return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = name.trim();
    const trimmedWhatsapp = whatsapp.trim();
    const trimmedUID = gameUID.trim();
    const trimmedAccount = paymentAccount.trim();

    if (!trimmedName || !trimmedWhatsapp || !trimmedUID || !trimmedAccount) {
      showToast('❌ Please fill in all required fields!', 'error');
      return;
    }

    if (trimmedName.length < 2 || trimmedName.length > 20) {
      showToast('❌ Name must be between 2 and 20 characters!', 'error');
      return;
    }

    if (!/^(\+92|0)3[0-9]{9}$/.test(trimmedWhatsapp)) {
      showToast('❌ Invalid WhatsApp number! Format: 03001234567', 'error');
      return;
    }

    if (!/^[0-9]{8,12}$/.test(trimmedUID)) {
      showToast('❌ Invalid Free Fire Game UID! Must be 8-12 digits.', 'error');
      return;
    }

    if (!/^(\+92|0)3[0-9]{9}$/.test(trimmedAccount)) {
      showToast('❌ Invalid payment account number! Format: 03001234567', 'error');
      return;
    }

    setLoading(true);
    await submitProfileSetup({
      name: trimmedName,
      whatsapp: trimmedWhatsapp,
      gameUID: trimmedUID,
      paymentMethod,
      paymentAccount: trimmedAccount,
      referralCode: referralCode.trim() || undefined
    });
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full sm:max-w-lg bg-[#0F1220] border-t sm:border border-[#F5A623]/30 sm:rounded-2xl rounded-t-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="space-y-4">
          <div>
            <h2 className="font-heading font-black text-2xl sm:text-3xl uppercase text-[#EEF0FF]">
              👑 Complete Your Player Profile
            </h2>
            <p className="text-xs text-[#7A84A8] mt-1">
              Required for match verification, room ID delivery, and automated cash payouts.
            </p>
          </div>

          <div className="p-3 bg-[#F5A623]/10 border border-[#F5A623]/30 rounded-xl text-xs text-[#7A84A8] flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-[#F5A623] shrink-0 mt-0.5" />
            <span>
              ⚠️ <strong>Game UID cannot be changed</strong> after registration. Please ensure it matches your in-game Free Fire profile.
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-tech font-bold uppercase text-[#7A84A8] mb-1">
                Your In-Game Name (IGN)
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. ꧁ProGamer꧂"
                maxLength={20}
                className="w-full bg-[#161A2E] border border-[#252B47] text-sm text-[#EEF0FF] px-3.5 py-2.5 rounded-xl focus:border-[#F5A623] focus:outline-none transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-tech font-bold uppercase text-[#7A84A8] mb-1">
                WhatsApp Number (For Room ID &amp; Pass)
              </label>
              <input
                type="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="03XXXXXXXXX"
                className="w-full bg-[#161A2E] border border-[#252B47] text-sm text-[#EEF0FF] px-3.5 py-2.5 rounded-xl focus:border-[#F5A623] focus:outline-none transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-tech font-bold uppercase text-[#7A84A8] mb-1">
                Free Fire Game UID (8-12 Digits)
              </label>
              <input
                type="text"
                value={gameUID}
                onChange={(e) => setGameUID(e.target.value.replace(/\D/g, ''))}
                placeholder="e.g. 1928471029"
                maxLength={12}
                className="w-full bg-[#161A2E] border border-[#252B47] text-sm text-[#EEF0FF] px-3.5 py-2.5 rounded-xl focus:border-[#F5A623] focus:outline-none transition-colors font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-tech font-bold uppercase text-[#7A84A8] mb-1">
                Referral Code <span className="normal-case text-[#7A84A8]/70">(optional)</span>
              </label>
              <input
                type="text"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                placeholder="e.g. AHME123"
                maxLength={10}
                className="w-full bg-[#161A2E] border border-[#252B47] text-sm text-[#EEF0FF] px-3.5 py-2.5 rounded-xl focus:border-[#2ECC71] focus:outline-none transition-colors font-mono uppercase"
              />
              <p className="text-[10px] text-[#2ECC71] mt-1">
                🎁 Got a friend's code? Enter it to get Rs 20 bonus instantly!
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-tech font-bold uppercase text-[#7A84A8] mb-1">
                  Payout Method
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="w-full bg-[#161A2E] border border-[#252B47] text-sm text-[#EEF0FF] px-3 py-2.5 rounded-xl focus:border-[#F5A623] focus:outline-none transition-colors"
                >
                  <option value="JazzCash">JazzCash</option>
                  <option value="EasyPaisa">EasyPaisa</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-tech font-bold uppercase text-[#7A84A8] mb-1">
                  Account Mobile Number
                </label>
                <input
                  type="tel"
                  value={paymentAccount}
                  onChange={(e) => setPaymentAccount(e.target.value)}
                  placeholder="03XXXXXXXXX"
                  className="w-full bg-[#161A2E] border border-[#252B47] text-sm text-[#EEF0FF] px-3.5 py-2.5 rounded-xl focus:border-[#F5A623] focus:outline-none transition-colors"
                  required
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-[#F5A623] to-[#D4891C] text-black font-heading font-black text-base uppercase tracking-wider rounded-xl shadow-lg shadow-[#F5A623]/25 hover:brightness-110 active:scale-98 transition-all disabled:opacity-50"
              >
                {loading ? '⏳ CREATING PROFILE...' : '✅ CREATE MY PROFILE & PLAY'}
              </button>
            </div>

            <div className="pt-1 text-center">
              <a
                href={`https://wa.me/${OWNER_WHATSAPP}?text=${encodeURIComponent('Hi, I am facing a problem while creating my profile on ClutchZone.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[11px] font-tech font-bold uppercase text-[#2ECC71] hover:text-[#4ade80] transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                Problem during profile creation? Click Customer Support
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
