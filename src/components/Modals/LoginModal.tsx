import React from 'react';
import { useAuth } from '../../context/AuthContext';
import czLogo from '../../assets/images/clutchzone_logo_1787204355803.jpg';
import { X, ShieldCheck } from 'lucide-react';

export const LoginModal: React.FC = () => {
  const { activeModal, closeModal, loginWithGoogle } = useAuth();

  if (activeModal !== 'login') return null;

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

        <div className="text-center space-y-3 pt-2">
          <div className="w-20 h-20 mx-auto rounded-2xl overflow-hidden border-2 border-[#F5A623]/50 shadow-xl shadow-[#F5A623]/20 bg-[#161A2E]">
            <img
              src={czLogo}
              alt="ClutchZone Tournament Logo"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>

          <h2 className="font-heading font-black text-2xl sm:text-3xl uppercase text-[#EEF0FF]">
            Welcome to Clutch Zone
          </h2>

          <p className="text-xs text-[#7A84A8] leading-relaxed max-w-xs mx-auto">
            Login with your Google account to join daily Free Fire tournaments, track match prizes, and manage your wallet.
          </p>

          <div className="space-y-3 pt-4">
            <button
              onClick={loginWithGoogle}
              className="w-full flex items-center justify-center gap-3 bg-white text-black font-heading font-black text-base uppercase tracking-wider py-3.5 px-4 rounded-xl shadow-lg hover:bg-gray-100 active:scale-98 transition-all"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>CONTINUE WITH GOOGLE</span>
            </button>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#7A84A8] pt-2">
            <ShieldCheck className="w-3.5 h-3.5 text-[#2ECC71]" />
            <span>100% Safe &amp; Secure Authentication</span>
          </div>
        </div>
      </div>
    </div>
  );
};
