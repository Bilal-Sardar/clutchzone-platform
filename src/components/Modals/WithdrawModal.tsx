import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { PaymentMethod } from '../../types';
import { X, ArrowUpRight, ShieldCheck, Clock } from 'lucide-react';

export const WithdrawModal: React.FC = () => {
  const { activeModal, closeModal, profile, submitWithdrawalAction, showToast } = useAuth();
  
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<PaymentMethod>('JazzCash');
  const [account, setAccount] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile) {
      setMethod(profile.paymentMethod || 'JazzCash');
      setAccount(profile.paymentAccount || '');
    }
  }, [profile, activeModal]);

  if (activeModal !== 'withdraw') return null;

  const currentBalance = profile?.walletBalance || 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsedAmount = parseInt(amount, 10);
    const cleanAccount = account.trim();

    if (isNaN(parsedAmount) || parsedAmount < 100) {
      showToast('❌ Minimum withdrawal amount is Rs 100!', 'error');
      return;
    }

    if (parsedAmount > currentBalance) {
      showToast(`❌ Insufficient balance! Your balance is Rs ${currentBalance}.`, 'error');
      return;
    }

    if (!cleanAccount) {
      showToast('❌ Please enter your mobile account number!', 'error');
      return;
    }

    if (!/^(\+92|0)3[0-9]{9}$/.test(cleanAccount)) {
      showToast('❌ Invalid account number! Format: 03001234567', 'error');
      return;
    }

    setLoading(true);
    await submitWithdrawalAction(parsedAmount, method, cleanAccount);
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
            <h2 className="font-heading font-black text-2xl sm:text-3xl uppercase text-[#EEF0FF]">
              Withdraw Cash Payout
            </h2>
            <div className="flex items-center justify-between text-xs text-[#7A84A8] mt-1">
              <span>Min Withdrawal: <strong>Rs 100</strong></span>
              <span className="text-[#F5A623] font-bold">Balance: Rs {currentBalance.toLocaleString()}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Amount input */}
            <div>
              <label className="block text-xs font-tech font-bold uppercase text-[#7A84A8] mb-1">
                Withdrawal Amount (PKR)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Min Rs 100 (e.g. 500)"
                min={100}
                max={currentBalance}
                className="w-full bg-[#161A2E] border border-[#252B47] text-sm text-[#EEF0FF] px-3.5 py-2.5 rounded-xl focus:border-[#F5A623] focus:outline-none transition-colors"
                required
              />
              <div className="flex gap-2 mt-1.5">
                {currentBalance >= 100 && (
                  <button
                    type="button"
                    onClick={() => setAmount(String(Math.min(currentBalance, 200)))}
                    className="px-2.5 py-1 bg-[#1E2340] text-[11px] font-tech text-[#EEF0FF] rounded-lg border border-[#252B47]"
                  >
                    Rs 200
                  </button>
                )}
                {currentBalance >= 500 && (
                  <button
                    type="button"
                    onClick={() => setAmount('500')}
                    className="px-2.5 py-1 bg-[#1E2340] text-[11px] font-tech text-[#EEF0FF] rounded-lg border border-[#252B47]"
                  >
                    Rs 500
                  </button>
                )}
                {currentBalance >= 100 && (
                  <button
                    type="button"
                    onClick={() => setAmount(String(currentBalance))}
                    className="px-2.5 py-1 bg-[#F5A623]/20 text-[11px] font-tech text-[#F5A623] font-bold rounded-lg border border-[#F5A623]/40"
                  >
                    Withdraw All (Rs {currentBalance})
                  </button>
                )}
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="block text-xs font-tech font-bold uppercase text-[#7A84A8] mb-1.5">
                Receive Funds Via
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setMethod('JazzCash')}
                  className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                    method === 'JazzCash'
                      ? 'border-[#F5A623] bg-[#F5A623]/10 text-[#F5A623] font-bold'
                      : 'border-[#252B47] bg-[#161A2E] text-[#EEF0FF]'
                  }`}
                >
                  <span className="text-xl">📱</span>
                  <div>
                    <div className="text-xs font-heading font-black uppercase">JazzCash</div>
                    <div className="text-[10px] text-[#7A84A8]">Mobile Account</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setMethod('EasyPaisa')}
                  className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                    method === 'EasyPaisa'
                      ? 'border-[#2ECC71] bg-[#2ECC71]/10 text-[#2ECC71] font-bold'
                      : 'border-[#252B47] bg-[#161A2E] text-[#EEF0FF]'
                  }`}
                >
                  <span className="text-xl">💚</span>
                  <div>
                    <div className="text-xs font-heading font-black uppercase">EasyPaisa</div>
                    <div className="text-[10px] text-[#7A84A8]">Mobile Wallet</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Account input */}
            <div>
              <label className="block text-xs font-tech font-bold uppercase text-[#7A84A8] mb-1">
                {method} Account Number
              </label>
              <input
                type="tel"
                value={account}
                onChange={(e) => setAccount(e.target.value)}
                placeholder="03XXXXXXXXX"
                className="w-full bg-[#161A2E] border border-[#252B47] text-sm text-[#EEF0FF] px-3.5 py-2.5 rounded-xl focus:border-[#F5A623] focus:outline-none transition-colors"
                required
              />
            </div>

            <div className="p-3 bg-[#161A2E] border border-[#252B47] rounded-xl text-xs text-[#7A84A8] space-y-1">
              <div className="flex items-center gap-1 text-[#2ECC71] font-tech font-bold">
                <Clock className="w-3.5 h-3.5" /> 24-Hour Payout Guarantee
              </div>
              <p>
                Funds will be dispatched directly to your {method} account. You will receive an SMS confirmation once dispatched.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || currentBalance < 100}
              className="w-full py-3.5 bg-gradient-to-r from-[#F5A623] to-[#D4891C] text-black font-heading font-black text-base uppercase tracking-wider rounded-xl shadow-lg shadow-[#F5A623]/25 hover:brightness-110 active:scale-98 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <ArrowUpRight className="w-5 h-5 stroke-[2.5]" />
              <span>{loading ? '⏳ PROCESSING REQUEST...' : 'SUBMIT WITHDRAWAL REQUEST'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
