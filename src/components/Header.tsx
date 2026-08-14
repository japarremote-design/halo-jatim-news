import React, { useState } from 'react';
import { Share2, Search, Menu, X, User as UserIcon, PlusCircle, LogOut, BookmarkCheck, Newspaper, Megaphone, Tag } from 'lucide-react';
import { CategoryType, UserProfile } from '../types';
import { isAdmin } from '../lib/admin';

interface HeaderProps {
  selectedCategory: CategoryType | 'Semua';
  onSelectCategory: (category: CategoryType | 'Semua') => void;
  onOpenSearch: () => void;
  onOpenAuth: () => void;
  onOpenArticleEditor: () => void;
  onOpenAdManager: () => void;
  onOpenCategoryManager: () => void;
  categories: CategoryType[];
  onGoHome: () => void;
  onOpenBookmarks: () => void;
  user: UserProfile | null;
  onSignOut: () => void;
  bookmarkCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  selectedCategory,
  onSelectCategory,
  onOpenSearch,
  onOpenAuth,
  onOpenArticleEditor,
  onOpenAdManager,
  onOpenCategoryManager,
  categories,
  onGoHome,
  onOpenBookmarks,
  user,
  onSignOut,
  bookmarkCount
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const userIsAdmin = isAdmin(user?.email);

  const handleShareSite = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'HALOJATIMNEWS - Informasi Jawa Timur Terkini',
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share canceled or error:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Tautan portal berhasil disalin ke papan klip!');
    }
  };

  return (
    <header className="bg-[#001e40] text-white font-sans sticky top-0 z-50 border-b-4 border-[#fe8028] shadow-md">
      <div className="flex justify-between items-center h-20 px-4 md:px-6 max-w-7xl mx-auto">
        {/* Logo & Brand */}
        <div 
          className="flex items-center gap-3 cursor-pointer select-none flex-shrink-0"
          onClick={() => {
            onSelectCategory('Semua');
            onGoHome();
          }}
        >
          <div className="relative flex items-center justify-center flex-shrink-0 group">
            <div className="absolute w-10 h-10 rounded-full bg-white/25 blur-md group-hover:bg-white/35 transition-colors"></div>
            <img 
              src="/logo-header-white.png" 
              alt="HALOJATIMNEWS Logo" 
              className="relative h-11 w-11 object-contain group-hover:scale-105 transition-transform" 
            />
          </div>
          <div className="hidden sm:block">
            <span className="font-extrabold text-xl md:text-2xl uppercase tracking-tighter text-white block leading-none">
              HALOJATIMNEWS<span className="text-[#fe8028]">.COM</span>
            </span>
            <span className="text-[10px] text-gray-300 font-medium tracking-widest block mt-1">
              INFORMASI JAWA TIMUR TERKINI
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Create Article Button (admin only) */}
          {userIsAdmin && (
            <button
              onClick={onOpenArticleEditor}
              className="hidden sm:flex items-center gap-1.5 bg-[#fe8028] hover:bg-[#e06d19] text-white px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
              title="Tambah Berita Baru"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Tulis Berita</span>
            </button>
          )}

          {/* Manage Ads Button (admin only) */}
          {userIsAdmin && (
            <button
              onClick={onOpenAdManager}
              className="hidden lg:flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
              title="Kelola Iklan"
            >
              <Megaphone className="w-4 h-4" />
              <span>Iklan</span>
            </button>
          )}

          {/* Manage Categories Button (admin only) */}
          {userIsAdmin && (
            <button
              onClick={onOpenCategoryManager}
              className="hidden lg:flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
              title="Kelola Kategori"
            >
              <Tag className="w-4 h-4" />
              <span>Kategori</span>
            </button>
          )}

          {/* Share */}
          <button
            onClick={handleShareSite}
            className="p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer text-white/90 hover:text-white"
            title="Bagikan Situs"
          >
            <Share2 className="w-5 h-5" />
          </button>

          {/* Search */}
          <button
            onClick={onOpenSearch}
            className="p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer text-white/90 hover:text-white"
            title="Cari Berita"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Auth & User Menu */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1 bg-white/10 hover:bg-white/20 rounded-full cursor-pointer transition-all border border-white/20"
              >
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || 'User'} className="w-7 h-7 rounded-full object-cover" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-[#fe8028] text-white flex items-center justify-center text-xs font-bold">
                    {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
                  </div>
                )}
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white text-gray-800 rounded-lg shadow-xl border border-gray-200 py-2 z-50 text-sm animate-fadeIn">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="font-bold truncate">{user.displayName || 'Pengguna'}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email || 'Google Auth User'}</p>
                  </div>

                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      onOpenBookmarks();
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center justify-between text-gray-700"
                  >
                    <span className="flex items-center gap-2">
                      <BookmarkCheck className="w-4 h-4 text-[#fe8028]" />
                      Berita Tersimpan
                    </span>
                    <span className="bg-[#fe8028]/10 text-[#fe8028] font-bold text-xs px-2 py-0.5 rounded-full">
                      {bookmarkCount}
                    </span>
                  </button>

                  {userIsAdmin && (
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onOpenArticleEditor();
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-gray-700 sm:hidden"
                    >
                      <PlusCircle className="w-4 h-4 text-emerald-600" />
                      Tulis Berita Baru
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      onSignOut();
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 flex items-center gap-2 border-t border-gray-100 mt-1"
                  >
                    <LogOut className="w-4 h-4" />
                    Keluar (Sign Out)
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/30 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <UserIcon className="w-4 h-4 text-[#fe8028]" />
              <span>Masuk Google</span>
            </button>
          )}

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-white hover:bg-white/10 rounded-full cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Category Nav Row - full width, wraps to a new line instead of overlapping/scrolling */}
      <nav className="hidden lg:flex flex-wrap gap-x-6 gap-y-2 items-center px-4 md:px-6 py-2.5 border-t border-white/10 max-w-7xl mx-auto">
        <button
          onClick={() => {
            onSelectCategory('Semua');
            onGoHome();
          }}
          className={`text-sm font-semibold transition-colors duration-200 cursor-pointer active:scale-95 ${
            selectedCategory === 'Semua'
              ? 'text-[#fe8028] border-b-2 border-[#fe8028] pb-0.5'
              : 'text-white/80 hover:text-white hover:text-[#ffb68d]'
          }`}
        >
          Beranda
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              onSelectCategory(cat);
              onGoHome();
            }}
            className={`text-sm font-semibold transition-colors duration-200 cursor-pointer active:scale-95 ${
              selectedCategory === cat
                ? 'text-[#fe8028] border-b-2 border-[#fe8028] pb-0.5'
                : 'text-white/80 hover:text-white hover:text-[#ffb68d]'
            }`}
          >
            {cat}
          </button>
        ))}
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#001e40] border-t border-white/10 px-4 py-4 space-y-3">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-white/10">
            <button
              onClick={() => {
                onSelectCategory('Semua');
                onGoHome();
                setMobileMenuOpen(false);
              }}
              className={`p-2 rounded text-left text-sm font-semibold ${
                selectedCategory === 'Semua' ? 'bg-[#fe8028] text-white' : 'text-white/80 hover:bg-white/10'
              }`}
            >
              Semua Berita
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  onSelectCategory(cat);
                  onGoHome();
                  setMobileMenuOpen(false);
                }}
                className={`p-2 rounded text-left text-sm font-semibold ${
                  selectedCategory === cat ? 'bg-[#fe8028] text-white' : 'text-white/80 hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {userIsAdmin && (
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => {
                  onOpenArticleEditor();
                  setMobileMenuOpen(false);
                }}
                className="w-full bg-[#fe8028] text-white py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                Tulis Berita Baru
              </button>
            </div>
          )}

          {userIsAdmin && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onOpenAdManager();
                  setMobileMenuOpen(false);
                }}
                className="w-full bg-white/10 text-white py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-2"
              >
                <Megaphone className="w-4 h-4" />
                Kelola Iklan
              </button>
            </div>
          )}

          {userIsAdmin && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onOpenCategoryManager();
                  setMobileMenuOpen(false);
                }}
                className="w-full bg-white/10 text-white py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-2"
              >
                <Tag className="w-4 h-4" />
                Kelola Kategori
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
