import React, { useState } from 'react';
import { User, Heart, QrCode, Menu, X, Sparkles, Phone } from 'lucide-react';

interface HeaderProps {
  onOpenJoinModal: () => void;
  onOpenDonateModal: () => void;
  onOpenVerifyModal: () => void;
  onOpenMemberLogin: () => void;
  currentLang: 'en' | 'ta';
  onToggleLang: () => void;
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

  return (
    <header className="sticky top-0 z-40 bg-[#181B20] text-white shadow-xl gold-header-strip">
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
              <div className="w-full h-full bg-[#181B20] rounded-full flex items-center justify-center border border-yellow-400/40">
                <span className="text-2xl">🏛️</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white group-hover:text-yellow-400 transition-colors">
                  TAMIL SANGAM
                </span>
                <span className="bg-yellow-400 text-[#181B20] text-[10px] font-black px-1.5 py-0.5 rounded tracking-wider">
                  TN
                </span>
              </div>
              <p className="text-xs text-amber-300 font-medium tracking-wide">
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
                    ? 'text-yellow-400 border-yellow-400 font-semibold'
                    : 'text-gray-300 border-transparent hover:text-yellow-400 hover:border-yellow-400/50'
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
              className="flex items-center gap-1.5 text-xs font-semibold text-gray-300 bg-gray-800/80 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-lg border border-gray-700 transition-all"
              title="Verify QR Membership ID Card"
            >
              <QrCode className="w-4 h-4 text-yellow-400" />
              <span>{currentLang === 'ta' ? 'அட்டை சரிபார்ப்பு' : 'Verify ID'}</span>
            </button>

            {/* Donate Button */}
            <button
              onClick={onOpenDonateModal}
              className="flex items-center gap-1.5 text-xs font-bold text-white bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 px-3 py-2 rounded-lg shadow-md transition-all active:scale-95"
            >
              <Heart className="w-3.5 h-3.5 fill-current" />
              <span>{currentLang === 'ta' ? 'நன்கொடை' : 'Donate'}</span>
            </button>

            {/* Join Sangam Main CTA */}
            <button
              onClick={onOpenJoinModal}
              className="flex items-center gap-1.5 text-xs font-extrabold text-[#181B20] bg-yellow-400 hover:bg-yellow-300 px-4 py-2 rounded-lg shadow-lg hover:shadow-yellow-400/20 transition-all transform hover:-translate-y-0.5 active:scale-95 uppercase tracking-wide"
            >
              <Sparkles className="w-4 h-4" />
              <span>{currentLang === 'ta' ? 'உறுப்பினராக இணை' : 'JOIN TAMIL SANGAM'}</span>
            </button>

            {/* Language Switcher */}
            <button
              onClick={onToggleLang}
              className="text-xs font-bold text-yellow-400 bg-gray-800 hover:bg-gray-700 px-2.5 py-2 rounded-lg border border-yellow-400/30 transition-all"
            >
              {currentLang === 'en' ? 'தமிழ்' : 'English'}
            </button>

            {/* Member Login / Profile */}
            {loggedInMemberName ? (
              <div className="flex items-center gap-2 bg-gray-800 border border-amber-500/40 px-3 py-1.5 rounded-lg">
                <User className="w-4 h-4 text-yellow-400" />
                <span className="text-xs font-bold text-white max-w-[100px] truncate">{loggedInMemberName}</span>
                <button
                  onClick={onLogoutMember}
                  className="text-[10px] text-red-400 hover:underline font-semibold ml-1"
                >
                  Exit
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenMemberLogin}
                className="flex items-center gap-1.5 text-xs font-medium text-gray-300 hover:text-white px-3 py-2 rounded-lg bg-gray-800/60 hover:bg-gray-700 transition-all border border-gray-700"
              >
                <Phone className="w-3.5 h-3.5 text-yellow-400" />
                <span>{currentLang === 'ta' ? 'உறுப்பினர் உள்நுழைவு' : 'Member Login'}</span>
              </button>
            )}

            {/* NOTE: Admin button is hidden from public user interface per requirement */}

          </div>

          {/* Mobile menu hamburger */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={onOpenJoinModal}
              className="text-xs font-extrabold text-[#181B20] bg-yellow-400 hover:bg-yellow-300 px-3 py-1.5 rounded-lg"
            >
              JOIN
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#22262E] border-t border-gray-800 px-4 pt-3 pb-6 space-y-3">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-gray-700">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`text-left text-sm py-2 px-3 rounded-md transition-colors ${
                  activeTab === item.id ? 'bg-yellow-400 text-[#181B20] font-bold' : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                {currentLang === 'ta' ? item.labelTa : item.labelEn}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <button
              onClick={() => { onOpenDonateModal(); setMobileMenuOpen(false); }}
              className="w-full flex items-center justify-center gap-2 bg-rose-600 text-white font-bold py-2.5 rounded-lg text-sm"
            >
              <Heart className="w-4 h-4" />
              <span>Donate to Tamil Sangam</span>
            </button>

            <button
              onClick={() => { onOpenVerifyModal(); setMobileMenuOpen(false); }}
              className="w-full flex items-center justify-center gap-2 bg-gray-800 text-gray-200 font-semibold py-2.5 rounded-lg text-sm border border-gray-700"
            >
              <QrCode className="w-4 h-4 text-yellow-400" />
              <span>Verify Membership QR Code</span>
            </button>

            <button
              onClick={() => { onOpenMemberLogin(); setMobileMenuOpen(false); }}
              className="w-full flex items-center justify-center gap-2 bg-gray-800 text-gray-200 font-semibold py-2.5 rounded-lg text-sm border border-gray-700"
            >
              <User className="w-4 h-4 text-yellow-400" />
              <span>Member Login Portal</span>
            </button>

            <button
              onClick={onToggleLang}
              className="w-full text-center text-xs font-bold text-yellow-400 py-2"
            >
              Switch Language to {currentLang === 'en' ? 'தமிழ்' : 'English'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
