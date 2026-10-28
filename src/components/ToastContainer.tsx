import React from 'react';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';
export const ToastContainer: React.FC = () => {
  const { toasts } = useAuth();
  if (toasts.length === 0) return null;
  return (
    <div className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center gap-2 pointer-events-none w-full max-w-sm px-4">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto w-full bg-[#161A2E]/95 backdrop-blur-md border border-[#F5A623]/40 text-[#EEF0FF] px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs font-tech font-bold uppercase animate-in slide-in-from-bottom-4 duration-200"
        >
          {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-[#2ECC71] shrink-0" />}
          {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-[#E74C3C] shrink-0" />}
          {toast.type === 'info' && <Info className="w-4 h-4 text-[#4A9EFF] shrink-0" />}
          <span className="flex-1 leading-snug">{toast.message}</span>
        </div>
      ))}
    </div>
  );
};
