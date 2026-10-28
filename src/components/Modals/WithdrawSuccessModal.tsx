import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle2, Clock } from 'lucide-react';

export const WithdrawSuccessModal: React.FC = () => {
  const { activeModal, closeModal, modalData } = useAuth();

  if (activeModal !== 'withdrawSuccess') return null;

  const { amount = 0, method = 'JazzCash', account = '' } = modalData || {};

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
      onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
    >
      <div className="w-full sm:max-w-md bg-[#0F1220] border-t sm:border border-[#2ECC71]/40 sm:rounded-2xl rounded-t-2xl p-6 shadow-2xl text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-full bg-[#2ECC71]/15 text-[#2ECC71] flex items-center justify-center text-4xl mb-2">
          <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
        </div>

        <div>
          <h2 className="font-heading font-black text-2xl sm:text-3xl uppercase text-[#2ECC71]">
            Withdrawal Submitted!
          </h2>
          <p className="text-xs text-[#7A84A8] mt-1">
            Your payout request has been queued for verification &amp; transfer.
          </p>
        </div>

        <div className="bg-[#161A2E] border border-[#252B47] rounded-xl p-4 text-xs space-y-2 text-left">
          <div className="flex justify-between">
            <span className="text-[#7A84A8]">Requested Amount:</span>
            <span className="font-heading font-black text-sm text-[#F5A623]">Rs {amount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#7A84A8]">Payment Method:</span>
            <span className="font-bold text-[#EEF0FF]">{method}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#7A84A8]">Target Account:</span>
            <span className="font-mono font-bold text-[#EEF0FF]">{account}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-[#252B47]">
            <span className="text-[#7A84A8]">Estimated Time:</span>
            <span className="text-[#2ECC71] font-bold flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Within 12 Hours
            </span>
          </div>
        </div>

        <p className="text-[11px] text-[#7A84A8] leading-relaxed">
          You will receive an automated WhatsApp confirmation message once the payment transaction is completed.
        </p>

        <button
          onClick={closeModal}
          className="w-full py-3.5 bg-gradient-to-r from-[#2ECC71] to-[#27AE60] text-black font-heading font-black text-base uppercase tracking-wider rounded-xl shadow-lg shadow-[#2ECC71]/25 hover:brightness-110 active:scale-98 transition-all"
        >
          👍 GOT IT, RETURN TO APP
        </button>
      </div>
    </div>
  );
};
