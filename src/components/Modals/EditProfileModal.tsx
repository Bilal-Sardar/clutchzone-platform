import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { PaymentMethod } from '../../types';
import { X, Lock, Save } from 'lucide-react';

export const EditProfileModal: React.FC = () => {
  const { activeModal, closeModal, profile, updateProfileData, showToast } = useAuth();

  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('JazzCash');
  const [paymentAccount, setPaymentAccount] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setWhatsapp(profile.whatsapp || '');
      setPaymentMethod(profile.paymentMethod || 'JazzCash');
      setPaymentAccount(profile.paymentAccount || '');
    }
  }, [profile, activeModal]);

  if (activeModal !== 'editProfile') return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = name.trim();
    const trimmedWhatsapp = whatsapp.trim();
    const trimmedAccount = paymentAccount.trim();

    if (!trimmedName || !trimmedWhatsapp || !trimmedAccount) {
      showToast('❌ Please fill all required fields!', 'error');
      return;
    }

    if (trimmedName.length < 2 || trimmedName.length > 20) {
      showToast('❌ Name must be 2 to 20 characters!', 'error');
      return;
    }

    if (!/^(\+92|0)3[0-9]{9}$/.test(trimmedWhatsapp)) {
      showToast('❌ Invalid WhatsApp number! e.g. 03001234567', 'error');
      return;
    }

    if (!/^(\+92|0)3[0-9]{9}$/.test(trimmedAccount)) {
      showToast('❌ Invalid payment account number! e.g. 03001234567', 'error');
      return;
    }

    setLoading(true);
    await updateProfileData({
      name: trimmedName,
      whatsapp: trimmedWhatsapp,
      paymentMethod,
      paymentAccount: trimmedAccount
    });
    setLoading(false);
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
      onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
    >
      <div className="w-full sm:max-w-md bg-[#0F1220] border-t sm:border border-[#F5A623]/30 sm:rounded-2xl rounded-t-2xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-[#7A84A8] hover:text-white p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-4">
          <div>
            <h2 className="font-heading font-black text-2xl uppercase text-[#EEF0FF]">
              ✏️ Edit Player Profile
            </h2>
            <p className="text-xs text-[#7A84A8] mt-0.5">
              Update your in-game name and mobile payout details.
            </p>
          </div>

          {/* Locked Information Banner */}
          <div className="p-3 bg-[#161A2E] border border-[#252B47] rounded-xl text-xs space-y-1">
            <div className="flex items-center gap-1.5 text-[#F5A623] font-tech font-bold uppercase">
              <Lock className="w-3.5 h-3.5" /> Immutable Security Fields
            </div>
            <div className="text-[#7A84A8] flex justify-between">
              <span>Game UID:</span>
              <span className="font-mono font-bold text-[#EEF0FF]">{profile?.gameUID}</span>
            </div>
            <div className="text-[#7A84A8] flex justify-between">
              <span>Email:</span>
              <span className="text-[#EEF0FF] truncate max-w-[200px]">{profile?.email}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-tech font-bold uppercase text-[#7A84A8] mb-1">
                In-Game Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={20}
                className="w-full bg-[#161A2E] border border-[#252B47] text-sm text-[#EEF0FF] px-3.5 py-2.5 rounded-xl focus:border-[#F5A623] focus:outline-none transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-tech font-bold uppercase text-[#7A84A8] mb-1">
                WhatsApp Number
              </label>
              <input
                type="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full bg-[#161A2E] border border-[#252B47] text-sm text-[#EEF0FF] px-3.5 py-2.5 rounded-xl focus:border-[#F5A623] focus:outline-none transition-colors"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
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
                  Account Mobile No.
                </label>
                <input
                  type="tel"
                  value={paymentAccount}
                  onChange={(e) => setPaymentAccount(e.target.value)}
                  className="w-full bg-[#161A2E] border border-[#252B47] text-sm text-[#EEF0FF] px-3.5 py-2.5 rounded-xl focus:border-[#F5A623] focus:outline-none transition-colors"
                  required
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-[#F5A623] to-[#D4891C] text-black font-heading font-black text-base uppercase tracking-wider rounded-xl shadow-lg shadow-[#F5A623]/25 hover:brightness-110 active:scale-98 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>{loading ? '⏳ SAVING...' : '💾 SAVE CHANGES'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
