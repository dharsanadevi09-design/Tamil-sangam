import React, { useState } from 'react';
import { User, Heart, QrCode, Menu, X, Sparkles, Phone, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  onOpenJoinModal: () => void;
  onOpenDonateModal: () => void;
  onOpenVerifyModal: () => void;
  onOpenMemberLogin: () => void;
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
    { id: 'about', labelEn: 'About & Vision', labelTa: 'எங்களைப் பற்றி' },
    { id: 'pasarai', labelEn: '23 Wings / பாசறை', labelTa: '23 பாசறைகள்' },
    { id: 'events', labelEn: 'Events', labelTa: 'நிகழ்ச்சிகள்' },
    { id: 'news', labelEn: 'News & Media', labelTa: 'செய்திகள்' },
    { id: 'contact', labelEn: 'Contact HQ', labelTa: 'தொடர்புகொள்ள' },
  ];

  const isDark = theme === 'dark';

  return (
    <header className={`sticky top-0 z-40 transition-colors duration-300 shadow-xl gold-header-strip ${
      isDark ? 'bg-[#181B20] text-white' : 'bg-white text-slate-900 border-b border-slate-200'
    }`}>
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 text-[#181B20] text-xs font-semibold py-1 px-4 text-center flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 animate-pulse" />
        <span>
          {currentLang === 'ta'
            ? 'தமிழ் சங்கம் - தமிழ்நாடு டிஜிட்டல் உறுப்பினர் தளம் | 38 மாவட்டங்கள் & 23 பாசறைகள் இணைப்பு'
            : 'Official Digital Membership & Organisation Management Portal | 38 Districts & 23 Wings'}
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Org Title */}
          <div 
            onClick={() => setActiveTab('home')} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 p-0.5 shadow-lg group-hover:scale-105 transition-transform duration-200">
              <div className={`w-full h-full rounded-full flex items-center justify-center border border-yellow-400/40 ${
                isDark ? 'bg-[#181B20]' : 'bg-amber-50'
              }`}>
                <span className="text-2xl">🏛️</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`font-extrabold text-lg sm:text-xl tracking-tight group-hover:text-amber-500 transition-colors ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  TAMIL SANGAM
                </span>
                <span className="bg-yellow-400 text-[#181B20] text-[10px] font-black px-1.5 py-0.5 rounded tracking-wider">
                  TN
                </span>
              </div>
              <p className={`text-xs font-medium tracking-wide ${
                isDark ? 'text-amber-300' : 'text-amber-700'
              }`}>
                தமிழ் சங்கம் - தமிழ்நாடு
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`text-sm font-medium transition-colors py-1 border-b-2 ${
                  activeTab === item.id
                    ? 'text-amber-600 dark:text-yellow-400 border-amber-600 dark:border-yellow-400 font-bold'
                    : isDark 
                      ? 'text-gray-300 border-transparent hover:text-yellow-400 hover:border-yellow-400/50'
                      : 'text-slate-700 border-transparent hover:text-amber-600 hover:border-amber-500'
                }`}
              >
                {currentLang === 'ta' ? item.labelTa : item.labelEn}
              </button>
            ))}
          </nav>

          {/* Top Actions & CTA Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            
            {/* Verify ID Quick Action */}
            <button
              onClick={onOpenVerifyModal}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg border transition-all cursor-pointer ${
                isDark 
                  ? 'text-gray-300 bg-gray-800/80 hover:bg-gray-700 hover:text-white border-gray-700'
                  : 'text-slate-800 bg-slate-100 hover:bg-slate-200 border-slate-300'
              }`}
              title="Verify QR Membership ID Card"
            >
              <QrCode className="w-4 h-4 text-amber-600 dark:text-yellow-400" />
              <span>{currentLang === 'ta' ? 'அட்டை சரிபார்ப்பு' : 'Verify ID'}</span>
            </button>

            {/* Donate Button */}
            <button
              onClick={onOpenDonateModal}
              className="flex items-center gap-1.5 text-xs font-bold text-white bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 px-3 py-2 rounded-lg shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <Heart className="w-3.5 h-3.5 fill-current" />
              <span>{currentLang === 'ta' ? 'நன்கொடை' : 'Donate'}</span>
            </button>

            {/* Join Sangam Main CTA or Logged In My ID Card Button */}
            {loggedInMemberName ? (
              <button
                onClick={() => setActiveTab('member-dashboard')}
                className="flex items-center gap-1.5 text-xs font-extrabold text-[#181B20] bg-yellow-400 hover:bg-yellow-300 px-4 py-2 rounded-lg shadow-lg hover:shadow-yellow-400/20 transition-all transform hover:-translate-y-0.5 active:scale-95 uppercase tracking-wide cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>{currentLang === 'ta' ? 'எனது அடையாள அட்டை' : 'MY ID CARD'}</span>
              </button>
            ) : (
              <button
                onClick={onOpenJoinModal}
                className="flex items-center gap-1.5 text-xs font-extrabold text-[#181B20] bg-yellow-400 hover:bg-yellow-300 px-4 py-2 rounded-lg shadow-lg hover:shadow-yellow-400/20 transition-all transform hover:-translate-y-0.5 active:scale-95 uppercase tracking-wide cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>{currentLang === 'ta' ? 'உறுப்பினராக இணை' : 'JOIN TAMIL SANGAM'}</span>
              </button>
            )}

            {/* Light / Dark Theme Toggle Button */}
            <button
              onClick={onToggleTheme}
              className={`flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg border transition-all cursor-pointer shadow-sm ${
                isDark 
                  ? 'text-yellow-400 bg-gray-800 hover:bg-gray-700 border-yellow-400/30'
                  : 'text-amber-900 bg-amber-100 hover:bg-amber-200 border-amber-300'
              }`}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle Light/Dark Theme"
            >
              {isDark ? (
                <>
                  <Sun className="w-4 h-4 text-yellow-400" />
                  <span className="hidden md:inline">{currentLang === 'ta' ? 'வெளிச்சம்' : 'Light'}</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-amber-800" />
                  <span className="hidden md:inline">{currentLang === 'ta' ? 'இருள்' : 'Dark'}</span>
                </>
              )}
            </button>

            {/* Language Switcher */}
            <button
              onClick={onToggleLang}
              className={`text-xs font-bold px-2.5 py-2 rounded-lg border transition-all cursor-pointer ${
                isDark 
                  ? 'text-yellow-400 bg-gray-800 hover:bg-gray-700 border-yellow-400/30'
                  : 'text-amber-900 bg-amber-100 hover:bg-amber-200 border-amber-300'
              }`}
            >
              {currentLang === 'en' ? 'தமிழ்' : 'English'}
            </button>

            {/* Member Login / Profile */}
            {loggedInMemberName ? (
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${
                isDark ? 'bg-gray-800 border-amber-500/40 text-white' : 'bg-slate-100 border-amber-500 text-slate-900'
              }`}>
                <button
                  type="button"
                  onClick={() => setActiveTab('member-dashboard')}
                  className="flex items-center gap-1.5 hover:text-yellow-400 cursor-pointer font-bold text-xs"
                  title="Click to view My ID Card & Member Dashboard"
                >
                  <User className="w-4 h-4 text-amber-500 dark:text-yellow-400" />
                  <span className="max-w-[100px] truncate">{loggedInMemberName}</span>
                  <span className="bg-yellow-400 text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded shadow">
                    🪪 ID Card
                  </span>
                </button>
                <button
                  onClick={onLogoutMember}
                  className="text-[10px] text-red-500 hover:underline font-semibold ml-1 cursor-pointer border-l border-gray-300 dark:border-gray-700 pl-2"
                  title="Logout"
                >
                  Exit
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenMemberLogin}
                className={`flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg border transition-all cursor-pointer ${
                  isDark 
                    ? 'text-gray-300 bg-gray-800/60 hover:bg-gray-700 hover:text-white border-gray-700'
                    : 'text-slate-800 bg-slate-100 hover:bg-slate-200 border-slate-300'
                }`}
              >
                <Phone className="w-3.5 h-3.5 text-amber-600 dark:text-yellow-400" />
                <span>{currentLang === 'ta' ? 'உறுப்பினர் உள்நுழைவு' : 'Member Login'}</span>
              </button>
            )}

          </div>

          {/* Mobile menu hamburger */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={onToggleTheme}
              className={`p-2 rounded-lg border cursor-pointer ${
                isDark ? 'text-yellow-400 bg-gray-800 border-gray-700' : 'text-amber-900 bg-amber-100 border-amber-300'
              }`}
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
            </button>

            <button
              onClick={onOpenJoinModal}
              className="text-xs font-extrabold text-[#181B20] bg-yellow-400 hover:bg-yellow-300 px-3 py-1.5 rounded-lg cursor-pointer"
            >
              JOIN
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
        <div className={`lg:hidden border-t px-4 pt-3 pb-6 space-y-3 ${
          isDark ? 'bg-[#22262E] border-gray-800 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}>
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-gray-200 dark:border-gray-700">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`text-left text-sm py-2 px-3 rounded-md transition-colors ${
                  activeTab === item.id 
                    ? 'bg-yellow-400 text-[#181B20] font-bold' 
                    : isDark ? 'text-gray-300 hover:bg-gray-800' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                {currentLang === 'ta' ? item.labelTa : item.labelEn}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <button
              onClick={onToggleTheme}
              className={`w-full flex items-center justify-center gap-2 font-bold py-2.5 rounded-lg text-sm border ${
                isDark ? 'bg-gray-800 text-yellow-400 border-gray-700' : 'bg-amber-100 text-amber-900 border-amber-300'
              }`}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              <span>{isDark ? (currentLang === 'ta' ? 'வெளிச்ச முறைக்கு மாறுக' : 'Switch to Light Theme') : (currentLang === 'ta' ? 'இருள் முறைக்கு மாறுக' : 'Switch to Dark Theme')}</span>
            </button>

            <button
              onClick={() => { onOpenDonateModal(); setMobileMenuOpen(false); }}
              className="w-full flex items-center justify-center gap-2 bg-rose-600 text-white font-bold py-2.5 rounded-lg text-sm"
            >
              <Heart className="w-4 h-4" />
              <span>Donate to Tamil Sangam</span>
            </button>

            <button
              onClick={() => { onOpenVerifyModal(); setMobileMenuOpen(false); }}
              className={`w-full flex items-center justify-center gap-2 font-semibold py-2.5 rounded-lg text-sm border ${
                isDark ? 'bg-gray-800 text-gray-200 border-gray-700' : 'bg-slate-100 text-slate-800 border-slate-300'
              }`}
            >
              <QrCode className="w-4 h-4 text-amber-600 dark:text-yellow-400" />
              <span>Verify Membership QR Code</span>
            </button>

            <button
              onClick={() => { onOpenMemberLogin(); setMobileMenuOpen(false); }}
              className={`w-full flex items-center justify-center gap-2 font-semibold py-2.5 rounded-lg text-sm border ${
                isDark ? 'bg-gray-800 text-gray-200 border-gray-700' : 'bg-slate-100 text-slate-800 border-slate-300'
              }`}
            >
              <User className="w-4 h-4 text-amber-600 dark:text-yellow-400" />
              <span>Member Login Portal</span>
            </button>

            <button
              onClick={onToggleLang}
              className="w-full text-center text-xs font-bold text-amber-600 dark:text-yellow-400 py-2"
            >
              Switch Language to {currentLang === 'en' ? 'தமிழ்' : 'English'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
