import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import czLogo from './assets/images/clutchzone_logo_1787204355803.jpg';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/ToastContainer';

// Tab views
import { HomeTab } from './components/HomeTab';
import { TournamentsTab } from './components/TournamentsTab';
import { WalletTab } from './components/WalletTab';
import { ResultsTab } from './components/ResultsTab';
import { LeaderboardTab } from './components/LeaderboardTab';
import { ProfileTab } from './components/ProfileTab';

// Modals
import { LoginModal } from './components/Modals/LoginModal';
import { SetupProfileModal } from './components/Modals/SetupProfileModal';
import { DepositModal } from './components/Modals/DepositModal';
import { WithdrawModal } from './components/Modals/WithdrawModal';
import { WithdrawSuccessModal } from './components/Modals/WithdrawSuccessModal';
import { JoinConfirmModal } from './components/Modals/JoinConfirmModal';
import { EditProfileModal } from './components/Modals/EditProfileModal';
import { SupportModal } from './components/Modals/SupportModal';
import { TermsModal } from './components/Modals/TermsModal';

const AppContent: React.FC = () => {
  const { activeTab, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080B14] flex flex-col items-center justify-center gap-4 text-[#EEF0FF]">
        <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-[#F5A623]/60 shadow-2xl shadow-[#F5A623]/30 animate-pulse bg-[#161A2E]">
          <img
            src={czLogo}
            alt="ClutchZone Logo"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="w-8 h-8 border-3 border-[#1E2340] border-t-[#F5A623] rounded-full animate-spin mt-1" />
        <div className="font-heading font-black text-xl uppercase tracking-widest text-[#F5A623]">
          CLUTCH ZONE ESPORTS
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080B14] text-[#EEF0FF] flex flex-col relative selection:bg-[#F5A623] selection:text-black">
      {/* Background ambient lighting */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-[#F5A623]/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 pt-6">
        {activeTab === 'home' && <HomeTab />}
        {activeTab === 'tournaments' && <TournamentsTab />}
        {activeTab === 'wallet' && <WalletTab />}
        {activeTab === 'results' && <ResultsTab />}
        {activeTab === 'leaderboard' && <LeaderboardTab />}
        {activeTab === 'profile' && <ProfileTab />}
      </main>

      <Footer />
      <BottomNav />
      <ToastContainer />

      {/* Global Modals */}
      <LoginModal />
      <SetupProfileModal />
      <DepositModal />
      <WithdrawModal />
      <WithdrawSuccessModal />
      <JoinConfirmModal />
      <EditProfileModal />
      <SupportModal />
      <TermsModal />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
