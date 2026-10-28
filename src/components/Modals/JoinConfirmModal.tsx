import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { X, Gamepad2, AlertCircle, ArrowRight } from 'lucide-react';

export const JoinConfirmModal: React.FC = () => {
  const { activeModal, closeModal, modalData, profile, joinTournamentAction, openModal } = useAuth();
  const [loading, setLoading] = useState(false);

  if (activeModal !== 'joinConfirm') return null;

  const { tournamentId = '', tournamentName = '', entryFee = 70 } = modalData || {};
  const bonusBalance = profile?.bonusBalance || 0;
  const walletBalance = profile?.walletBalance || 0;
  const currentBalance = bonusBalance + walletBalance;
  const balanceAfter = currentBalance - entryFee;
  const hasSufficientBalance = currentBalance >= entryFee;

  const bonusUsed = Math.min(bonusBalance, entryFee);
  const walletUsed = Math.max(0, entryFee - bonusUsed);

  const handleConfirm = async () => {
    if (!hasSufficientBalance) {
      closeModal();
      openModal('deposit');
      return;
    }

    setLoading(true);
    await joinTournamentAction(tournamentId, entryFee, tournamentName);
    setLoading(false);
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
      onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
    >
      <div className="w-full sm:max-w-md bg-[#0F1220] border-t sm:border border-[#F5A623]/30 sm:rounded-2xl rounded-t-2xl p-6 shadow-2xl relative">
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-[#7A84A8] hover:text-white p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-4">
          <div>
            <h2 className="font-heading font-black text-2xl sm:text-3xl uppercase text-[#EEF0FF]">
              Confirm Tournament Entry
            </h2>
            <p className="text-xs text-[#7A84A8] mt-0.5">
              Review tournament details and wallet balance deduction.
            </p>
          </div>

          <div className="bg-[#161A2E] border border-[#252B47] rounded-xl p-4 space-y-2.5 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-[#252B47]">
              <span className="text-[#7A84A8]">Tournament:</span>
              <span className="font-heading font-bold text-sm text-[#EEF0FF] truncate max-w-[200px]">
                {tournamentName}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[#7A84A8]">Entry Fee:</span>
              <span className="font-heading font-black text-sm text-[#E74C3C]">-Rs {entryFee}</span>
            </div>

            {hasSufficientBalance && bonusUsed > 0 && (
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-[#7A84A8] pl-2">↳ From Bonus Wallet</span>
                <span className="font-tech text-[#2ECC71]">Rs {bonusUsed}</span>
              </div>
            )}
            {hasSufficientBalance && walletUsed > 0 && (
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-[#7A84A8] pl-2">↳ From Wallet Balance</span>
                <span className="font-tech text-[#F5A623]">Rs {walletUsed}</span>
              </div>
            )}

            <div className="flex justify-between items-center">
              <span className="text-[#7A84A8]">Total Available (Bonus + Wallet):</span>
              <span className="font-heading font-black text-sm text-[#F5A623]">
                Rs {currentBalance.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-[#252B47]">
              <span className="text-[#7A84A8]">Balance After Join:</span>
              <span className={`font-heading font-black text-sm ${balanceAfter >= 0 ? 'text-[#2ECC71]' : 'text-[#E74C3C]'}`}>
                Rs {balanceAfter.toLocaleString()}
              </span>
            </div>
          </div>

          {!hasSufficientBalance ? (
            <div className="p-3 bg-[#E74C3C]/10 border border-[#E74C3C]/30 rounded-xl text-xs text-[#E74C3C] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Insufficient balance! Please deposit Rs {entryFee - currentBalance} to join this match.</span>
            </div>
          ) : (
            <div className="p-3 bg-[#F5A623]/10 border border-[#F5A623]/30 rounded-xl text-xs text-[#7A84A8]">
              📱 Room ID &amp; Password will be sent to WhatsApp (<strong>{profile?.whatsapp}</strong>) <strong>15 minutes</strong> before match start.
            </div>
          )}

          <div className="pt-2">
            {!hasSufficientBalance ? (
              <button
                onClick={() => { closeModal(); openModal('deposit'); }}
                className="w-full py-3.5 bg-gradient-to-r from-[#F5A623] to-[#D4891C] text-black font-heading font-black text-base uppercase tracking-wider rounded-xl shadow-lg shadow-[#F5A623]/25 hover:brightness-110 flex items-center justify-center gap-2"
              >
                <span>DEPOSIT FUNDS NOW</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                disabled={loading}
                onClick={handleConfirm}
                className="w-full py-3.5 bg-gradient-to-r from-[#F5A623] to-[#D4891C] text-black font-heading font-black text-base uppercase tracking-wider rounded-xl shadow-lg shadow-[#F5A623]/25 hover:brightness-110 active:scale-98 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Gamepad2 className="w-5 h-5" />
                <span>{loading ? '⏳ PROCESSING ENTRY...' : '🎮 CONFIRM & JOIN TOURNAMENT'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
