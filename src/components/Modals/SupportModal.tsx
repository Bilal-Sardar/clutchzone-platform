import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { X, MessageCircle, Send, Clock } from 'lucide-react';
import { OWNER_WHATSAPP } from '../../firebase';

export const SupportModal: React.FC = () => {
  const { activeModal, closeModal, profile, submitSupportAction, showToast } = useAuth();
  const [tab, setTab] = useState<'whatsapp' | 'ticket'>('whatsapp');
  
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [issueType, setIssueType] = useState<'deposit' | 'withdrawal' | 'tournament' | 'account' | 'other'>('deposit');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setWhatsapp(profile.whatsapp || '');
    }
  }, [profile, activeModal]);

  if (activeModal !== 'support') return null;

  const handleWhatsAppChat = () => {
    const defaultMsg = encodeURIComponent(
      `Hello ClutchZone Support Team, I need assistance regarding my account / match.\nPlayer Name: ${name || 'Player'}\nGame UID: ${profile?.gameUID || 'N/A'}`
    );
    window.open(`https://wa.me/${OWNER_WHATSAPP}?text=${defaultMsg}`, '_blank');
  };

  const handleTicketSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !whatsapp.trim() || !message.trim()) {
      showToast('❌ Please fill in all fields!', 'error');
      return;
    }

    setLoading(true);
    await submitSupportAction({
      name: name.trim(),
      whatsapp: whatsapp.trim(),
      issueType,
      message: message.trim(),
      status: 'pending',
      createdAt: new Date().toISOString()
    });
    setLoading(false);
    setMessage('');
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
              💬 Customer Support &amp; Help
            </h2>
            <p className="text-xs text-[#7A84A8] mt-0.5">
              Instant match support, deposit verification, and withdrawal assistance.
            </p>
          </div>

          {/* Tabs */}
          <div className="grid grid-cols-2 gap-2 bg-[#161A2E] p-1 rounded-xl border border-[#252B47]">
            <button
              onClick={() => setTab('whatsapp')}
              className={`py-2 text-xs font-tech font-bold uppercase rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                tab === 'whatsapp'
                  ? 'bg-[#25D366] text-black shadow-sm'
                  : 'text-[#7A84A8] hover:text-[#EEF0FF]'
              }`}
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>WhatsApp Chat</span>
            </button>

            <button
              onClick={() => setTab('ticket')}
              className={`py-2 text-xs font-tech font-bold uppercase rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                tab === 'ticket'
                  ? 'bg-[#F5A623] text-black shadow-sm'
                  : 'text-[#7A84A8] hover:text-[#EEF0FF]'
              }`}
            >
              <Send className="w-4 h-4" />
              <span>Submit Ticket</span>
            </button>
          </div>

          {tab === 'whatsapp' ? (
            <div className="text-center space-y-4 py-2">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#25D366]/15 text-[#25D366] flex items-center justify-center text-3xl">
                <MessageCircle className="w-8 h-8 fill-current" />
              </div>

              <div>
                <div className="text-xs text-[#7A84A8] uppercase font-tech font-bold">Fastest 2-Minute Response</div>
                <div className="font-mono font-black text-xl text-[#EEF0FF] mt-1">+{OWNER_WHATSAPP}</div>
                <div className="text-xs text-[#2ECC71] font-tech font-bold flex items-center justify-center gap-1 mt-1">
                  <Clock className="w-3.5 h-3.5" /> Support Available 10:00 AM – 11:00 PM Daily
                </div>
              </div>

              <div className="p-3 bg-[#161A2E] border border-[#252B47] rounded-xl text-xs text-[#7A84A8] text-left space-y-1">
                <div>📌 <strong>What you can ask:</strong></div>
                <p>• Room ID or match entry issues</p>
                <p>• Deposit balance top-up confirmations</p>
                <p>• Prize payout queries</p>
              </div>

              <button
                onClick={handleWhatsAppChat}
                className="w-full py-3.5 bg-[#25D366] text-black font-heading font-black text-base uppercase tracking-wider rounded-xl shadow-lg shadow-[#25D366]/25 hover:brightness-110 flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                <span>OPEN OFFICIAL WHATSAPP CHAT</span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleTicketSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-tech font-bold uppercase text-[#7A84A8] mb-1">Your Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full bg-[#161A2E] border border-[#252B47] text-sm text-[#EEF0FF] px-3.5 py-2.5 rounded-xl focus:border-[#F5A623] focus:outline-none transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-tech font-bold uppercase text-[#7A84A8] mb-1">WhatsApp Number</label>
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
                <label className="block text-xs font-tech font-bold uppercase text-[#7A84A8] mb-1">Issue Category</label>
                <select
                  value={issueType}
                  onChange={(e) => setIssueType(e.target.value as any)}
                  className="w-full bg-[#161A2E] border border-[#252B47] text-sm text-[#EEF0FF] px-3 py-2.5 rounded-xl focus:border-[#F5A623] focus:outline-none transition-colors"
                >
                  <option value="deposit">💰 Deposit Issue</option>
                  <option value="withdrawal">🏧 Withdrawal Issue</option>
                  <option value="tournament">🏆 Tournament Match Issue</option>
                  <option value="account">👤 Account / UID Issue</option>
                  <option value="other">❓ General Inquiry</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-tech font-bold uppercase text-[#7A84A8] mb-1">Describe Issue</label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Explain your query in detail..."
                  className="w-full bg-[#161A2E] border border-[#252B47] text-sm text-[#EEF0FF] p-3 rounded-xl focus:border-[#F5A623] focus:outline-none transition-colors resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-[#F5A623] to-[#D4891C] text-black font-heading font-black text-base uppercase tracking-wider rounded-xl shadow-lg shadow-[#F5A623]/25 hover:brightness-110 active:scale-98 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>{loading ? '⏳ SENDING MESSAGE...' : 'SUBMIT SUPPORT TICKET'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
