import React from 'react';
import { Share2, Mail, ExternalLink } from 'lucide-react';
import { CategoryType } from '../types';

interface FooterProps {
  onSelectCategory: (category: CategoryType | 'Semua') => void;
  onGoHome: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectCategory, onGoHome }) => {
  return (
    <footer className="bg-[#1e1e1e] text-gray-300 font-sans w-full mt-16 border-t border-gray-800">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 md:px-6 py-10 max-w-7xl mx-auto text-xs md:text-sm">
        {/* Brand & Description */}
        <div className="flex flex-col gap-3">
          <span className="font-black text-xl text-white tracking-tight font-display uppercase">
            HALOJATIMNEWS
          </span>
          <p className="text-gray-400 leading-relaxed">
            Portal Informasi Jawa Timur Terkini, menyajikan berita aktual, tajam, terpercaya, dan real-time dari seluruh pelosok kabupaten dan kota di Jawa Timur.
          </p>
          <p className="mt-auto text-gray-500 font-mono text-[11px] pt-4">
            © 2026 HALOJATIMNEWS.COM. All Rights Reserved.
            <br />
            Powered by{' '}
            <a
              href="https://qfazdigital.my.id/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-[#fe8028] underline underline-offset-2 transition-colors"
            >
              QFAZ Digital
            </a>
          </p>
        </div>

        {/* Category Links */}
        <div className="flex flex-col gap-2">
          <h4 className="font-bold text-white text-sm mb-2 uppercase tracking-wider font-display">
            Kategori Berita
          </h4>
          <div className="grid grid-cols-2 gap-2 text-gray-400">
            {['Madura', 'Jawa Timur', 'Politik', 'Desa', 'Keislaman', 'Hukum'].map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  onSelectCategory(cat as CategoryType);
                  onGoHome();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="text-left hover:text-[#fe8028] transition-colors flex items-center gap-1 cursor-pointer"
              >
                <ExternalLink className="w-3 h-3 text-gray-600" />
                <span>{cat}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Quick Links & Contact */}
        <div className="flex flex-col gap-3">
          <h4 className="font-bold text-white text-sm mb-1 uppercase tracking-wider font-display">
            Ikuti Kami & Kebijakan
          </h4>
          <div className="flex gap-3 mb-2">
            <button className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#fe8028] transition-colors text-white cursor-pointer">
              <Share2 className="w-4 h-4" />
            </button>
            <button className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#fe8028] transition-colors text-white cursor-pointer">
              <Mail className="w-4 h-4" />
            </button>
          </div>
          <div className="flex flex-wrap gap-4 text-gray-400 text-xs">
            <a href="#" className="hover:text-white transition-colors underline-offset-4 hover:underline">Sitemap</a>
            <a href="#" className="hover:text-white transition-colors underline-offset-4 hover:underline">About Us</a>
            <a href="#" className="hover:text-white transition-colors underline-offset-4 hover:underline">Contact Info</a>
            <a href="#" className="hover:text-white transition-colors underline-offset-4 hover:underline">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors underline-offset-4 hover:underline">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
