import React, { useState } from 'react';
import { User, Heart, QrCode, Menu, X, Search, Moon, Sun, LogOut } from 'lucide-react';

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
  loggedInMemberPhoto?: string;
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
  loggedInMemberPhoto,
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
  const isTa = currentLang === 'ta';

  return (
    <header className={`sticky top-0 z-40 transition-colors duration-300 ${
      isDark ? 'bg-[#181B20] text-white border-b border-slate-800' : 'bg-white text-slate-800 border-b border-slate-200/80 shadow-sm'
    }`}>
      
      <div className="max-w-[1440px] mx-auto px-2 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-20 min-w-0">
          
          {/* Brand Logo & Title */}
          <div 
            onClick={() => { setActiveTab('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
            className="flex items-center gap-1.5 sm:gap-2 cursor-pointer group shrink-0 mr-1 lg:mr-2 xl:mr-3"
          >
            {/* Round Tamil Sangam Emblem Logo */}
            <div className="w-9 h-9 sm:w-10 sm:h-10 xl:w-11 xl:h-11 rounded-full bg-gradient-to-br from-[#8B1E26] via-[#B8860B] to-[#600D13] p-0.5 shadow-lg group-hover:scale-105 transition-transform duration-200 shrink-0">
              <div className="w-full h-full rounded-full overflow-hidden border border-amber-300/40 bg-[#FDF2F2]">
                <img src="/tamil-sangam-logo.jpg" alt="தமிழ் சங்கம்" className="w-full h-full object-cover object-center" />
              </div>
            </div>

            <div>
              <h1 className="font-extrabold text-xs sm:text-sm lg:text-base xl:text-lg 2xl:text-xl tracking-tight text-[#8B1E26] dark:text-red-400 font-heading leading-tight group-hover:text-[#72151C] transition-colors whitespace-nowrap">
                {currentLang === 'ta' ? 'தமிழ் சங்கம்' : 'TAMIL SANGAM'}
              </h1>
              <p className="text-[7.5px] sm:text-[8px] xl:text-[9.5px] font-bold tracking-widest text-slate-500 dark:text-gray-400 uppercase -mt-0.5 whitespace-nowrap">
                {currentLang === 'ta' ? 'தமிழ்நாடு' : 'TAMIL NADU'}
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links - Maxed out English layout with responsive Tamil support */}
          <nav className={`hidden md:flex items-center gap-1 md:gap-1.5 lg:gap-2 xl:gap-2.5 flex-1 min-w-0 px-2 overflow-x-auto no-scrollbar ${
            isTa ? 'justify-start' : 'justify-center'
          }`}>
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    if (item.id === 'home') {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    } else if (item.id === 'membership') {
                      onOpenJoinModal();
                    } else {
                      const elem = document.getElementById(item.id);
                      if (elem) elem.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className={`flex items-center gap-1 transition-all duration-200 py-1 lg:py-1.5 rounded-xl whitespace-nowrap cursor-pointer shrink-0 relative ${
                    isTa 
                      ? 'text-[9px] md:text-[10px] lg:text-[10.5px] xl:text-[11.5px] 2xl:text-[13px] px-1.5 md:px-2 lg:px-2.5 xl:px-3 font-semibold' 
                      : 'text-[11.5px] md:text-[12.5px] lg:text-[13.5px] xl:text-[14.5px] 2xl:text-[16px] px-2 md:px-2.5 lg:px-3 xl:px-3.5 font-semibold'
                  } ${
                    isActive
                      ? 'text-[#8B1E26] dark:text-red-400 font-bold bg-[#8B1E26]/10 dark:bg-red-500/15 shadow-sm'
                      : isDark 
                        ? 'text-gray-300 hover:text-white hover:bg-slate-800/80 font-medium'
                        : 'text-slate-600 hover:text-[#8B1E26] hover:bg-slate-100 font-medium'
                  }`}
                >
                  <span>{isTa ? item.labelTa : item.labelEn}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-1.5 right-1.5 lg:left-2 lg:right-2 xl:left-2.5 xl:right-2.5 h-0.5 bg-[#8B1E26] dark:bg-red-400 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-1 lg:gap-1.5 xl:gap-2 shrink-0 ml-1 lg:ml-2 xl:ml-3">
            
            {/* Search Icon Button */}
            <button
              onClick={onOpenSearchModal}
              className={`p-1.5 xl:p-2 rounded-xl border transition-all cursor-pointer ${
                isDark 
                  ? 'text-gray-300 bg-gray-800 hover:bg-gray-700 border-gray-700'
                  : 'text-slate-600 bg-slate-100 hover:bg-slate-200 border-slate-200'
              }`}
              title={currentLang === 'ta' ? 'தேடல்' : 'Search Portal'}
              aria-label="Search"
            >
              <Search className="w-3.5 h-3.5 xl:w-4 xl:h-4" />
            </button>

            {/* Donate Button */}
            <button
              onClick={onOpenDonateModal}
              className="flex items-center gap-1 text-[10px] xl:text-xs font-bold text-[#8B1E26] dark:text-red-300 bg-transparent hover:bg-[#FDF2F2] dark:hover:bg-red-950/40 border border-[#8B1E26]/40 dark:border-red-500/50 px-1.5 py-1 xl:px-2.5 xl:py-1.5 rounded-full transition-all cursor-pointer shadow-sm active:scale-95 whitespace-nowrap"
            >
              <Heart className="w-3 h-3 xl:w-3.5 xl:h-3.5 fill-[#8B1E26] dark:fill-red-400 text-[#8B1E26] dark:text-red-400" />
              <span className="hidden xl:inline">{currentLang === 'ta' ? 'நன்கொடை' : 'Donate'}</span>
            </button>

            {/* Logged in Member Profile Avatar CTA / Join Sangam Button */}
            {loggedInMemberName ? (
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => setActiveTab('member-dashboard')}
                  className="w-8 h-8 xl:w-9 xl:h-9 rounded-full border-2 border-[#8B1E26] dark:border-red-400 overflow-hidden shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer bg-[#8B1E26] flex items-center justify-center shrink-0 relative group"
                  title={`${loggedInMemberName} (${currentLang === 'ta' ? 'உறுப்பினர் தளம்' : 'Member Dashboard'})`}
                  aria-label="Member Profile"
                >
                  {loggedInMemberPhoto ? (
                    <img
                      src={loggedInMemberPhoto}
                      alt={loggedInMemberName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <User className="w-4 h-4 xl:w-5 xl:h-5 text-white" />
                  )}
                </button>
                {onLogoutMember && (
                  <button
                    onClick={onLogoutMember}
                    className="p-1 text-slate-400 hover:text-red-500 transition-colors cursor-pointer shrink-0"
                    title={currentLang === 'ta' ? 'வெளியேறு' : 'Logout'}
                    aria-label="Logout"
                  >
                    <LogOut className="w-3.5 h-3.5 xl:w-4 xl:h-4" />
                  </button>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenJoinModal}
                className="flex items-center gap-1 text-[10px] xl:text-xs font-bold text-white bg-[#8B1E26] hover:bg-[#72151C] px-2 py-1 xl:px-3 xl:py-1.5 rounded-full shadow-md transition-all transform hover:-translate-y-0.5 active:scale-95 cursor-pointer whitespace-nowrap"
              >
                <span>{currentLang === 'ta' ? 'சேரவும்' : 'Join'}</span>
              </button>
            )}

            {/* Verify ID Quick Action */}
            <button
              onClick={onOpenVerifyModal}
              className={`hidden 2xl:flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-lg border transition-all cursor-pointer whitespace-nowrap ${
                isDark 
                  ? 'text-gray-300 bg-gray-800 hover:bg-gray-700 border-gray-700'
                  : 'text-slate-600 bg-slate-100 hover:bg-slate-200 border-slate-200'
              }`}
              title={currentLang === 'ta' ? 'அடையாள அட்டை சரிபார்ப்பு' : 'Verify QR Membership ID Card'}
            >
              <QrCode className="w-3.5 h-3.5 text-[#8B1E26] dark:text-red-400" />
              <span>{currentLang === 'ta' ? 'சரிபார்ப்பு' : 'Verify'}</span>
            </button>

            {/* Light / Dark Theme Toggle Button */}
            <button
              onClick={onToggleTheme}
              className={`p-1.5 xl:p-2 rounded-xl border transition-all cursor-pointer ${
                isDark 
                  ? 'text-yellow-400 bg-gray-800 hover:bg-gray-700 border-gray-700'
                  : 'text-slate-600 bg-slate-100 hover:bg-slate-200 border-slate-200'
              }`}
              title={isDark ? (currentLang === 'ta' ? 'வெளிச்சப் பயன்முறை' : 'Switch to Light Mode') : (currentLang === 'ta' ? 'இரவுப் பயன்முறை' : 'Switch to Dark Mode')}
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun className="w-3.5 h-3.5 xl:w-4 xl:h-4 text-yellow-400" /> : <Moon className="w-3.5 h-3.5 xl:w-4 xl:h-4 text-slate-700" />}
            </button>

            {/* Language Switcher */}
            <button
              onClick={onToggleLang}
              className={`text-[10px] xl:text-[11px] font-extrabold px-1.5 lg:px-2 py-1 xl:py-1.5 rounded-full border transition-all cursor-pointer whitespace-nowrap ${
                isDark 
                  ? 'text-gray-300 bg-gray-800 hover:bg-gray-700 border-gray-700'
                  : 'text-slate-700 bg-slate-100 hover:bg-slate-200 border-slate-200'
              }`}
            >
              {currentLang === 'en' ? 'தமிழ்' : 'EN'}
            </button>

            {/* Member Login */}
            {!loggedInMemberName && (
              <button
                onClick={onOpenMemberLogin}
                className="text-[10px] xl:text-xs font-bold text-slate-600 dark:text-gray-300 hover:text-[#8B1E26] dark:hover:text-red-400 cursor-pointer whitespace-nowrap ml-0.5"
              >
                {currentLang === 'ta' ? 'உள்நுழை' : 'Login'}
              </button>
            )}

          </div>

          {/* Mobile menu hamburger */}
          <div className="flex md:hidden items-center gap-1.5 sm:gap-2">
            <button
              onClick={onOpenSearchModal}
              className={`p-1.5 rounded-full border transition-all ${
                isDark 
                  ? 'text-gray-300 bg-gray-800 border-gray-700'
                  : 'text-slate-600 bg-slate-100 border-slate-200'
              }`}
              title={currentLang === 'ta' ? 'தேடல்' : 'Search Portal'}
              aria-label="Search"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onOpenDonateModal}
              className="p-1.5 text-xs text-[#8B1E26] bg-[#FDF2F2] dark:bg-red-950/50 border border-[#8B1E26]/30 dark:border-red-500/40 rounded-full"
              title={currentLang === 'ta' ? 'நன்கொடை' : 'Donate'}
            >
              <Heart className="w-3.5 h-3.5 fill-[#8B1E26] dark:fill-red-400" />
            </button>

            {loggedInMemberName ? (
              <button
                onClick={() => setActiveTab('member-dashboard')}
                className="w-8 h-8 rounded-full border-2 border-[#8B1E26] dark:border-red-400 overflow-hidden shadow-sm bg-[#8B1E26] flex items-center justify-center shrink-0"
                title={loggedInMemberName}
              >
                {loggedInMemberPhoto ? (
                  <img src={loggedInMemberPhoto} alt={loggedInMemberName} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-4 h-4 text-white" />
                )}
              </button>
            ) : (
              <button
                onClick={onOpenJoinModal}
                className="text-xs font-bold text-white bg-[#8B1E26] hover:bg-[#72151C] px-2.5 py-1.5 rounded-full shadow-sm"
              >
                {currentLang === 'ta' ? 'சேரவும்' : 'Join'}
              </button>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-1.5 rounded-xl border transition-colors ${
                isDark 
                  ? 'text-gray-300 bg-gray-800 border-gray-700 hover:text-white' 
                  : 'text-slate-700 bg-slate-100 border-slate-200 hover:text-slate-900'
              }`}
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className={`md:hidden border-t px-4 pt-3 pb-6 space-y-3 ${
          isDark ? 'bg-[#22262E] border-gray-800 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}>
          {loggedInMemberName && (
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#8B1E26]/10 dark:bg-red-950/40 border border-[#8B1E26]/20">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-full border-2 border-[#8B1E26] overflow-hidden bg-[#8B1E26] flex items-center justify-center shrink-0">
                  {loggedInMemberPhoto ? (
                    <img src={loggedInMemberPhoto} alt={loggedInMemberName} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-4 h-4 text-white" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-extrabold text-[#8B1E26] dark:text-red-400 truncate">{loggedInMemberName}</p>
                  <p className="text-[10px] text-slate-500 dark:text-gray-400">{currentLang === 'ta' ? 'உறுப்பினர் தளம்' : 'Member Dashboard'}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => { setActiveTab('member-dashboard'); setMobileMenuOpen(false); }}
                  className="text-xs font-bold text-white bg-[#8B1E26] px-3 py-1.5 rounded-full"
                >
                  {currentLang === 'ta' ? 'பார்க்க' : 'View'}
                </button>
                {onLogoutMember && (
                  <button
                    onClick={() => { onLogoutMember(); setMobileMenuOpen(false); }}
                    className="p-1 text-red-500"
                    title={currentLang === 'ta' ? 'வெளியேறு' : 'Logout'}
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}

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
                <span>{currentLang === 'ta' ? item.labelTa : item.labelEn}</span>
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <button
              onClick={() => { onOpenDonateModal(); setMobileMenuOpen(false); }}
              className="w-full flex items-center justify-center gap-2 bg-[#8B1E26] text-white font-bold py-2.5 rounded-full text-sm"
            >
              <Heart className="w-4 h-4 fill-white" />
              <span>{currentLang === 'ta' ? 'தமிழ் சங்கத்திற்கு நன்கொடை அளிக்கவும்' : 'Donate to Tamil Sangam'}</span>
            </button>

            <button
              onClick={() => { onOpenVerifyModal(); setMobileMenuOpen(false); }}
              className="w-full flex items-center justify-center gap-2 font-semibold py-2.5 rounded-full text-sm border border-slate-300 dark:border-gray-700"
            >
              <QrCode className="w-4 h-4 text-[#8B1E26]" />
              <span>{currentLang === 'ta' ? 'அடையாள அட்டை QR சரிபார்ப்பு' : 'Verify Membership QR Code'}</span>
            </button>

            {!loggedInMemberName && (
              <button
                onClick={() => { onOpenMemberLogin(); setMobileMenuOpen(false); }}
                className="w-full flex items-center justify-center gap-2 font-semibold py-2.5 rounded-full text-sm border border-slate-300 dark:border-gray-700"
              >
                <User className="w-4 h-4 text-[#8B1E26]" />
                <span>{currentLang === 'ta' ? 'உறுப்பினர் உள்நுழைவு தளம்' : 'Member Login Portal'}</span>
              </button>
            )}

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={onToggleTheme}
                className="text-xs font-bold text-slate-600 dark:text-yellow-400 py-1 flex items-center gap-1.5"
              >
                {isDark ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-500" />
                    <span>{currentLang === 'ta' ? 'வெளிச்சப் பயன்முறை' : 'Light Mode'}</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{currentLang === 'ta' ? 'இரவுப் பயன்முறை' : 'Dark Mode'}</span>
                  </>
                )}
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


