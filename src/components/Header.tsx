import React, { useState } from 'react';
import { User, Heart, QrCode, Menu, X, Search, Moon, Sun } from 'lucide-react';

interface HeaderProps {
  onOpenJoinModal: () => void;
  onOpenDonateModal: () => void;
  onOpenVerifyModal: () => void;
  onOpenMemberLogin: () => void;
  onOpenSearchModal?: () => void;
  currentLang: 'en' | 'ta';
  onToggleLang: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  loggedInMemberName?: string;
  onLogoutMember?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenJoinModal,
  onOpenDonateModal,
  onOpenVerifyModal,
  onOpenMemberLogin,
  onOpenSearchModal,
  currentLang,
  onToggleLang,
  theme,
  onToggleTheme,
  activeTab,
  setActiveTab,
  loggedInMemberName,
  onLogoutMember
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', labelEn: 'Home', labelTa: 'முகப்பு' },
    { id: 'about', labelEn: 'About', labelTa: 'எங்களைப் பற்றி' },
    { id: 'membership', labelEn: 'Membership', labelTa: 'உறுப்பினர்' },
    { id: 'pasarai', labelEn: 'Wings', labelTa: 'பாசறைகள்' },
    { id: 'events', labelEn: 'Events', labelTa: 'நிகழ்ச்சிகள்' },
    { id: 'news', labelEn: 'News', labelTa: 'செய்திகள்' },
    { id: 'gallery', labelEn: 'Gallery', labelTa: 'புகைப்படங்கள்' },
    { id: 'contact', labelEn: 'Contact', labelTa: 'தொடர்பு' },
  ];

  const isDark = theme === 'dark';

  return (
    <header className={`sticky top-0 z-40 transition-colors duration-300 ${
      isDark ? 'bg-[#181B20] text-white border-b border-slate-800' : 'bg-white text-slate-800 border-b border-slate-200/80 shadow-sm'
    }`}>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo & Title */}
          <div 
            onClick={() => { setActiveTab('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
            className="flex items-center gap-3 cursor-pointer group shrink-0"
          >
            {/* Round Temple Emblem Logo */}
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#8B1E26] to-[#600D13] p-0.5 shadow-md group-hover:scale-105 transition-transform duration-200">
              <div className={`w-full h-full rounded-full flex items-center justify-center border border-white/30 ${
                isDark ? 'bg-[#181B20]' : 'bg-[#FDF2F2]'
              }`}>
                <span className="text-xl">🏛️</span>
              </div>
            </div>

            <div>
              <h1 className="font-extrabold text-lg sm:text-xl tracking-tight text-[#8B1E26] dark:text-red-400 font-heading leading-tight group-hover:text-[#72151C] transition-colors">
                TAMIL SANGAM
              </h1>
              <p className="text-[10px] font-bold tracking-widest text-slate-500 dark:text-gray-400 uppercase -mt-0.5">
                TAMIL NADU
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'membership') {
                    onOpenJoinModal();
                  } else {
                    setActiveTab(item.id);
                    const elem = document.getElementById(item.id);
                    if (elem) elem.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className={`text-sm font-medium transition-colors py-1 cursor-pointer relative ${
                  activeTab === item.id
                    ? 'text-[#8B1E26] dark:text-red-400 font-bold border-b-2 border-[#8B1E26] dark:border-red-400'
                    : isDark 
                      ? 'text-gray-300 hover:text-white'
                      : 'text-slate-600 hover:text-[#8B1E26]'
                }`}
              >
                {currentLang === 'ta' ? item.labelTa : item.labelEn}
              </button>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            
            {/* Search Icon Button */}
            <button
              onClick={onOpenSearchModal}
              className={`p-2 rounded-full border transition-all cursor-pointer ${
                isDark 
                  ? 'text-gray-300 bg-gray-800 hover:bg-gray-700 border-gray-700'
                  : 'text-slate-600 bg-slate-100 hover:bg-slate-200 border-slate-200'
              }`}
              title="Search Portal"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Donate Button (Outline with heart icon) */}
            <button
              onClick={onOpenDonateModal}
              className="flex items-center gap-1.5 text-xs font-semibold text-[#8B1E26] dark:text-red-300 bg-transparent hover:bg-[#FDF2F2] dark:hover:bg-red-950/40 border border-[#8B1E26]/40 dark:border-red-500/50 px-3.5 py-2 rounded-full transition-all cursor-pointer shadow-sm active:scale-95"
            >
              <Heart className="w-3.5 h-3.5 fill-[#8B1E26] dark:fill-red-400 text-[#8B1E26] dark:text-red-400" />
              <span>{currentLang === 'ta' ? 'நன்கொடை' : 'Donate'}</span>
            </button>

            {/* Join Sangam / My ID Main CTA */}
            {loggedInMemberName ? (
              <button
                onClick={() => setActiveTab('member-dashboard')}
                className="flex items-center gap-1.5 text-xs font-bold text-white bg-[#8B1E26] hover:bg-[#72151C] px-4 py-2 rounded-full shadow-md transition-all transform hover:-translate-y-0.5 active:scale-95 cursor-pointer"
              >
                <User className="w-3.5 h-3.5" />
                <span>{loggedInMemberName}</span>
              </button>
            ) : (
              <button
                onClick={onOpenJoinModal}
                className="flex items-center gap-1.5 text-xs font-bold text-white bg-[#8B1E26] hover:bg-[#72151C] px-4 py-2 rounded-full shadow-md transition-all transform hover:-translate-y-0.5 active:scale-95 cursor-pointer"
              >
                <span>{currentLang === 'ta' ? 'சேரவும்' : 'Join Sangam'}</span>
              </button>
            )}

            {/* Verify ID Quick Action */}
            <button
              onClick={onOpenVerifyModal}
              className={`hidden md:flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer ${
                isDark 
                  ? 'text-gray-300 bg-gray-800 hover:bg-gray-700 border-gray-700'
                  : 'text-slate-600 bg-slate-100 hover:bg-slate-200 border-slate-200'
              }`}
              title="Verify QR Membership ID Card"
            >
              <QrCode className="w-3.5 h-3.5 text-[#8B1E26] dark:text-red-400" />
              <span>Verify</span>
            </button>

            {/* Light / Dark Theme Toggle Button */}
            <button
              onClick={onToggleTheme}
              className={`p-2 rounded-full border transition-all cursor-pointer ${
                isDark 
                  ? 'text-yellow-400 bg-gray-800 hover:bg-gray-700 border-gray-700'
                  : 'text-slate-600 bg-slate-100 hover:bg-slate-200 border-slate-200'
              }`}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-yellow-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {/* Language Switcher */}
            <button
              onClick={onToggleLang}
              className={`text-[11px] font-bold px-2.5 py-1.5 rounded-full border transition-all cursor-pointer ${
                isDark 
                  ? 'text-gray-300 bg-gray-800 hover:bg-gray-700 border-gray-700'
                  : 'text-slate-700 bg-slate-100 hover:bg-slate-200 border-slate-200'
              }`}
            >
              {currentLang === 'en' ? 'தமிழ்' : 'English'}
            </button>

            {/* Member Login */}
            {!loggedInMemberName && (
              <button
                onClick={onOpenMemberLogin}
                className="text-xs font-semibold text-slate-600 dark:text-gray-300 hover:text-[#8B1E26] dark:hover:text-red-400 cursor-pointer"
              >
                Login
              </button>
            )}

            {loggedInMemberName && (
              <button
                onClick={onLogoutMember}
                className="text-[11px] text-red-500 hover:underline font-semibold cursor-pointer"
                title="Logout"
              >
                Exit
              </button>
            )}

          </div>

          {/* Mobile menu hamburger */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={onOpenDonateModal}
              className="p-1.5 text-xs text-[#8B1E26] bg-[#FDF2F2] border border-[#8B1E26]/30 rounded-full"
            >
              <Heart className="w-4 h-4 fill-[#8B1E26]" />
            </button>
            <button
              onClick={onOpenJoinModal}
              className="text-xs font-bold text-white bg-[#8B1E26] px-3 py-1.5 rounded-full"
            >
              Join
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 ${isDark ? 'text-gray-300 hover:text-white' : 'text-slate-700 hover:text-slate-900'}`}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className={`sm:hidden border-t px-4 pt-3 pb-6 space-y-3 ${
          isDark ? 'bg-[#22262E] border-gray-800 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}>
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-gray-200 dark:border-gray-700">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'membership') {
                    onOpenJoinModal();
                  } else {
                    setActiveTab(item.id);
                  }
                  setMobileMenuOpen(false);
                }}
                className={`text-left text-sm py-2 px-3 rounded-md transition-colors ${
                  activeTab === item.id 
                    ? 'bg-[#8B1E26] text-white font-bold' 
                    : isDark ? 'text-gray-300 hover:bg-gray-800' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                {currentLang === 'ta' ? item.labelTa : item.labelEn}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <button
              onClick={() => { onOpenDonateModal(); setMobileMenuOpen(false); }}
              className="w-full flex items-center justify-center gap-2 bg-[#8B1E26] text-white font-bold py-2.5 rounded-full text-sm"
            >
              <Heart className="w-4 h-4 fill-white" />
              <span>Donate to Tamil Sangam</span>
            </button>

            <button
              onClick={() => { onOpenVerifyModal(); setMobileMenuOpen(false); }}
              className="w-full flex items-center justify-center gap-2 font-semibold py-2.5 rounded-full text-sm border border-slate-300 dark:border-gray-700"
            >
              <QrCode className="w-4 h-4 text-[#8B1E26]" />
              <span>Verify Membership QR Code</span>
            </button>

            <button
              onClick={() => { onOpenMemberLogin(); setMobileMenuOpen(false); }}
              className="w-full flex items-center justify-center gap-2 font-semibold py-2.5 rounded-full text-sm border border-slate-300 dark:border-gray-700"
            >
              <User className="w-4 h-4 text-[#8B1E26]" />
              <span>Member Login Portal</span>
            </button>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={onToggleTheme}
                className="text-xs font-bold text-slate-600 dark:text-yellow-400 py-1"
              >
                {isDark ? '☀️ Light Mode' : '🌙 Dark Mode'}
              </button>

              <button
                onClick={onToggleLang}
                className="text-xs font-bold text-[#8B1E26] dark:text-red-400 py-1"
              >
                {currentLang === 'en' ? 'தமிழ்' : 'English'}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

