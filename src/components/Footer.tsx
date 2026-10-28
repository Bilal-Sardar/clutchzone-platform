import React from 'react';
import { useAuth } from '../context/AuthContext';
import czLogo from '../assets/images/clutchzone_logo_1787204355803.jpg';
import { MessageCircle, Youtube, Facebook, Instagram } from 'lucide-react';

export const Footer: React.FC = () => {
  const { openModal } = useAuth();

  return (
    <footer className="mt-12 bg-[#0F1220] border-t border-[#F5A623]/20 py-8 px-4 pb-24 md:pb-8 text-center">
      <div className="max-w-4xl mx-auto space-y-5">
        {/* Brand */}
        <div className="flex items-center justify-center gap-2.5">
          <div className="w-7 h-7 rounded-lg overflow-hidden border border-[#F5A623]/40 bg-[#161A2E] shrink-0">
            <img
              src={czLogo}
              alt="ClutchZone Logo"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="font-heading font-black text-xl tracking-wider uppercase text-[#EEF0FF]">
            CLUTCH <span className="text-[#F5A623]">ZONE</span>
          </span>
        </div>

        {/* Social Links */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <a
            href="https://www.youtube.com/@clutchzonetournament"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FF4444]/10 text-[#FF4444] border border-[#FF4444]/30 text-xs font-tech font-bold uppercase hover:bg-[#FF4444]/20 transition-colors"
          >
            <Youtube className="w-3.5 h-3.5" />
            <span>YouTube</span>
          </a>

          <a
            href="https://www.facebook.com/profile.php?id=61593588745864"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#4A9EFF]/10 text-[#4A9EFF] border border-[#4A9EFF]/30 text-xs font-tech font-bold uppercase hover:bg-[#4A9EFF]/20 transition-colors"
          >
            <Facebook className="w-3.5 h-3.5" />
            <span>Facebook</span>
          </a>

          <a
            href="https://www.instagram.com/clutchzone.pk/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#E1306C]/10 text-[#E1306C] border border-[#E1306C]/30 text-xs font-tech font-bold uppercase hover:bg-[#E1306C]/20 transition-colors"
          >
            <Instagram className="w-3.5 h-3.5" />
            <span>Instagram</span>
          </a>

          <a
            href="https://www.tiktok.com/@clutchzone.fun"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 text-white border border-white/20 text-xs font-tech font-bold uppercase hover:bg-white/20 transition-colors"
          >
            <span>TikTok</span>
          </a>

          <a
            href="https://whatsapp.com/channel/0029VbBwzMqBlHpcBu6jO53D"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/30 text-xs font-tech font-bold uppercase hover:bg-[#25D366]/20 transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-current" />
            <span>WhatsApp Channel</span>
          </a>
        </div>

        {/* Legal & Support Links */}
        <div className="flex items-center justify-center gap-4 text-xs">
          <button
            onClick={() => openModal('terms')}
            className="text-[#F5A623] hover:underline"
          >
            📄 Terms &amp; Conditions
          </button>
          <span className="text-[#252B47]">•</span>
          <button
            onClick={() => openModal('support')}
            className="text-[#F5A623] hover:underline"
          >
            💬 Support Center
          </button>
        </div>

        {/* Copyright */}
        <div className="text-[11px] text-[#7A84A8]">
          © 2026 ClutchZone.fun — Pakistan's #1 Free Fire Esports Platform. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
