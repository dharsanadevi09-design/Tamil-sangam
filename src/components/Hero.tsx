import React, { useState } from 'react';
import { 
  Users, MapPin, Calendar, Eye, Target, Sprout, ArrowRight, 
  CheckSquare, ChevronLeft, ChevronRight, MapPin as LocationIcon, Heart,
  BookOpen, HelpCircle, ChevronDown, Sparkles, GraduationCap, Flag,
  HeartHandshake, Theater, ShieldCheck, FileText, Globe, TreePine,
  Landmark, IdCard
} from 'lucide-react';
import { INITIAL_NEWS } from '../data/mockData';
import type { NewsItem } from '../types';

interface HeroProps {
  onOpenJoinModal: (pasaraiId?: string) => void;
  onOpenDonateModal: () => void;
  onOpenVerifyModal: () => void;
  currentLang: 'en' | 'ta';
  isLoggedIn?: boolean;
  onGoToDashboard?: () => void;
  setActiveTab?: (tab: string) => void;
}

export const Hero: React.FC<HeroProps> = ({
  onOpenJoinModal,
  onOpenDonateModal,
  onOpenVerifyModal,
  currentLang = 'en',
  isLoggedIn,
  onGoToDashboard,
  setActiveTab
}) => {
  const [activeGalleryFilter, setActiveGalleryFilter] = useState('All');
  const [wingSlideIndex, setWingSlideIndex] = useState(0);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [isBannerZoomed, setIsBannerZoomed] = useState(false);

  // 9 Category feature pills matching the bottom bar of 2nd image banner
  const heroFeaturePills = [
    { id: 'edu', nameTa: 'தமிழ் மொழி வளர்ச்சி', nameEn: 'Tamil Language Dev', icon: BookOpen },
    { id: 'unity', nameTa: 'தமிழர் ஒற்றுமை', nameEn: 'Tamilian Unity', icon: Users },
    { id: 'culture', nameTa: 'தமிழ் பண்பாடு பாதுகாப்பு', nameEn: 'Culture Preservation', icon: Landmark },
    { id: 'welfare', nameTa: 'சமூகநல சேவைகள்', nameEn: 'Social Welfare', icon: Sprout },
    { id: 'literacy', nameTa: 'கல்வி முன்னேற்றம்', nameEn: 'Educational Progress', icon: GraduationCap },
    { id: 'youth', nameTa: 'இளைஞர் விழிப்புணர்வு', nameEn: 'Youth Awareness', icon: Flag },
    { id: 'legal', nameTa: 'சட்ட உதவி வழிகாட்டல்', nameEn: 'Legal Guidance', icon: FileText },
    { id: 'medical', nameTa: 'மருத்துவ சேவைகள்', nameEn: 'Medical Services', icon: Heart },
    { id: 'global', nameTa: 'உலகத் தமிழர் இணைப்பு', nameEn: 'Global Tamil Network', icon: Globe },
  ];

  // Gallery items matching reference image
  const galleryItems = [
    { id: 1, category: 'Events', title: 'Temple Chariot Festival', img: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?q=80&w=800&auto=format&fit=crop' },
    { id: 2, category: 'Culture', title: 'Classical Bharatanatyam', img: 'https://images.unsplash.com/photo-1601972599720-36938d4ecd31?q=80&w=800&auto=format&fit=crop' },
    { id: 3, category: 'Welfare', title: 'Tree Sapling Plantation', img: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=800&auto=format&fit=crop' },
    { id: 4, category: 'District', title: 'State Member Conference', img: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=800&auto=format&fit=crop' },
    { id: 5, category: 'Pasarai', title: 'Heritage Temple Tour', img: '/hero-temple.jpg' },
  ];

  const filteredGallery = activeGalleryFilter === 'All' 
    ? galleryItems 
    : galleryItems.filter(g => g.category === activeGalleryFilter);

  // Wing cards with icons matching reference screenshot
  const wingCards = [
    { id: 'edu', nameEn: 'Education Wing', nameTa: 'கல்விப் பாசறை', icon: GraduationCap, img: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=600&auto=format&fit=crop' },
    { id: 'youth', nameEn: 'Youth Wing', nameTa: 'இளைஞர் பாசறை', icon: Flag, img: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=600&auto=format&fit=crop' },
    { id: 'women', nameEn: 'Women Wing', nameTa: 'மகளிர் பாசறை', icon: HeartHandshake, img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop' },
    { id: 'culture', nameEn: 'Culture Wing', nameTa: 'கலை கலாச்சார பாசறை', icon: Theater, img: 'https://images.unsplash.com/photo-1601972599720-36938d4ecd31?q=80&w=600&auto=format&fit=crop' },
    { id: 'welfare', nameEn: 'Welfare Wing', nameTa: 'சமூக நலப் பாசறை', icon: ShieldCheck, img: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=600&auto=format&fit=crop' },
    { id: 'env', nameEn: 'Environment Wing', nameTa: 'சுற்றுச்சூழல் பாசறை', icon: Sprout, img: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=600&auto=format&fit=crop' },
  ];

  const faqs = currentLang === 'ta' ? [
    {
      q: 'தமிழ் சங்கத்தில் உறுப்பினராகச் சேர்வது எப்படி?',
      a: 'எங்கள் இணையதளத்தில் உள்ள "சேரவும்" (Join Tamil Sangam) பொத்தானைக் கிளிக் செய்து உங்கள் 10 இலக்க மொபைல் எண்ணை உள்ளிட்டு OTP சரிபார்ப்பு செய்து உடனடியாக டிஜிட்டல் உறுப்பினர் அட்டையைப் பெறலாம்.'
    },
    {
      q: 'பாசறைகளில் (Wings) எவ்வாறு இணைவது?',
      a: 'கல்வி, இளைஞர், மகளிர், கலை கலாச்சாரம் என 23 சிறப்பு பாசறைகள் இயங்கி வருகின்றன. உறுப்பினர் படிவத்தில் உங்களுக்கு விருப்பமான பாசறையைத் தேர்வு செய்து எளிதாக இணையலாம்.'
    },
    {
      q: 'உறுப்பினர் சான்றிதழ் மற்றும் அடையாள அட்டை உடனடியாகக் கிடைக்குமா?',
      a: 'ஆம், பதிவு செய்தவுடன் உங்கள் பிரத்யேக உறுப்பினர் எண் (Membership ID) உருவாக்கப்படும். பொதுச் சரிபார்ப்பு (Public Verification) பக்கத்தில் உங்கள் எண்ணை உள்ளிட்டு சான்றிதழைப் பதிவிறக்கம் செய்யலாம்.'
    },
    {
      q: 'தமிழ் சங்கத்தின் முக்கியச் செயல்பாடுகள் என்னென்ன?',
      a: 'தமிழ் மொழி வளர்ச்சி, பண்பாட்டு நிகழ்வுகள், இலவசக் கல்வி உதவிகள், இரத்த தான முகாம்கள், சுற்றுச்சூழல் மற்றும் சமூக நலப் பணிகள் தமிழ்நாட்டின் 38 மாவட்டங்களிலும் தொடர்ந்து நடைபெறுகின்றன.'
    }
  ] : [
    {
      q: 'How to join Tamil Sangam?',
      a: 'Click the "Join Sangam" button on our portal, enter your 10-digit mobile number for OTP verification, complete the quick registration form, and receive your digital membership ID card instantly.'
    },
    {
      q: 'How to register for specialized Pasarai wings?',
      a: 'We operate 23 specialized wings including Education, Youth, Women, IT, Legal, and Literature. You can select your preferred Pasarai wing directly during the online membership registration process.'
    },
    {
      q: 'Can I instantly verify and download my Membership ID Card?',
      a: 'Yes, as soon as registration is complete, a unique Membership ID number is assigned. You can verify and view your printable official ID card anytime using the Public QR Verification portal.'
    },
    {
      q: 'What are the key community activities of Tamil Sangam?',
      a: 'Our core activities include ancient manuscript digitization, student TNPSC coaching scholarships, tree sapling plantation drives, blood donor coordination, and classical cultural meets across all 38 districts.'
    }
  ];

  const handlePrevWings = () => {
    setWingSlideIndex(prev => (prev === 0 ? Math.max(0, wingCards.length - 4) : prev - 1));
  };

  const handleNextWings = () => {
    setWingSlideIndex(prev => (prev >= wingCards.length - 4 ? 0 : prev + 1));
  };

  return (
    <div id="home" className="bg-[#FAF8F5] dark:bg-slate-950 text-slate-800 dark:text-gray-100 transition-colors duration-300">
      
      {/* ========================================================================= */}
      {/* 1. HERO MAIN SECTION - 1ST VIEW FEATURING 2ND IMAGE BANNER */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#2A080C] via-[#5C1017] to-[#8B1E26] text-white pt-4 sm:pt-6 pb-10 sm:pb-12 shadow-2xl">
        
        {/* Ambient Glow & Gold Grid Background */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#FFD700_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 relative z-10 space-y-4 sm:space-y-6">
          
          {/* Top Announcement Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-black/40 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-amber-500/30 text-xs text-amber-200">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span className="font-extrabold tracking-wide text-amber-100">
                {currentLang === 'ta' ? 'தமிழ்ப் சங்கம் - தமிழ்நாடு அறக்கட்டளை' : 'TAMIL SANGAM - TAMIL NADU TRUST'}
              </span>
              <span className="hidden sm:inline-block text-amber-400/60">|</span>
              <span className="hidden sm:inline-block text-amber-300 font-semibold">
                {currentLang === 'ta' ? 'இந்திய அரசு பதிவு எண்: TN-15-0042417' : 'Govt of India Reg No: TN-15-0042417'}
              </span>
            </div>
            
            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={() => setIsBannerZoomed(true)}
                className="flex items-center gap-1.5 bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 text-[11px] font-bold px-3 py-1 rounded-lg border border-amber-400/40 transition-colors cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{currentLang === 'ta' ? 'முகப்பு படத்தைப் பெரிதாக்குக' : 'View Banner Fullscreen'}</span>
              </button>
            </div>
          </div>

          {/* MAIN 1ST VIEW IMAGE AT TOP OF HOME PAGE */}
          <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-amber-400/40 bg-slate-950 group">
            {/* Clean Cropped Image (Without redundant image navbar) */}
            <img 
              src="/tamil-sangam-banner.jpg" 
              alt="தமிழ் சங்கம் தமிழ்நாடு" 
              className="w-full h-auto max-h-[560px] object-cover object-center w-full transition-transform duration-700 cursor-pointer"
              onClick={() => setIsBannerZoomed(true)}
            />

            {/* Bottom Floating Quick Actions Bar */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/75 to-transparent p-4 sm:p-6 flex flex-wrap items-center justify-between gap-4">
              <div className="text-white space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full overflow-hidden border border-amber-400 shrink-0">
                    <img src="/tamil-sangam-logo.jpg" alt="Logo" className="w-full h-full object-cover" />
                  </div>
                  <h2 className="text-base sm:text-2xl font-black font-heading text-amber-300 drop-shadow-md">
                    {currentLang === 'ta' ? 'தமிழ் சங்கம் - தமிழ்நாடு' : 'TAMIL SANGAM - TAMIL NADU'}
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-slate-200 font-medium max-w-xl hidden sm:block">
                  {currentLang === 'ta' 
                    ? 'தமிழ் மொழி, பண்பாடு, கலாச்சாரம் மற்றும் சமுதாய மறுமலர்ச்சிக்கான மாநில ஒருங்கிணைப்பு போர்ட்டல்.' 
                    : 'Statewide Digital Portal for Tamil Language, Culture, Heritage & Social Welfare.'}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                {isLoggedIn ? (
                  <button
                    onClick={onGoToDashboard}
                    className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-lg transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    <span>{currentLang === 'ta' ? 'எனது பலகை' : 'My Dashboard'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => onOpenJoinModal()}
                    className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-lg transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    <IdCard className="w-4 h-4 text-slate-950" />
                    <span>{currentLang === 'ta' ? 'உறுப்பினர் சேர்க்கை / விண்ணப்பம்' : 'Join Tamil Sangam'}</span>
                  </button>
                )}

                <button
                  onClick={onOpenVerifyModal}
                  className="flex items-center gap-2 bg-black/60 hover:bg-black/80 text-amber-300 border border-amber-400/50 font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl backdrop-blur-md shadow-md transition-all cursor-pointer"
                >
                  <CheckSquare className="w-4 h-4" />
                  <span>{currentLang === 'ta' ? 'அட்டை சரிபார்ப்பு' : 'Verify ID Card'}</span>
                </button>

                <button
                  onClick={onOpenDonateModal}
                  className="flex items-center gap-2 bg-red-700/80 hover:bg-red-700 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-red-500/50 shadow-md transition-all cursor-pointer"
                >
                  <Heart className="w-4 h-4 text-rose-300" />
                  <span>{currentLang === 'ta' ? 'நன்கொடை' : 'Donate'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* 9 FEATURE PILLS BAR (MATCHING BOTTOM STRIP OF 2ND IMAGE) */}
          <div className="bg-white/95 dark:bg-[#1E232B]/95 backdrop-blur-md rounded-2xl p-3 sm:p-4 shadow-xl border border-amber-400/40">
            <p className="text-[11px] font-extrabold text-[#8B1E26] dark:text-amber-400 uppercase tracking-widest text-center mb-3">
              {currentLang === 'ta' ? 'முதன்மைச் சேவைகள் & பாசறைகள்' : 'CORE SERVICES & WINGS'}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-2">
              {heroFeaturePills.map((pill) => {
                const IconComponent = pill.icon;
                return (
                  <button
                    key={pill.id}
                    onClick={() => {
                      if (pill.id === 'unity' || pill.id === 'global') {
                        onOpenJoinModal();
                      } else {
                        onOpenJoinModal(pill.id);
                      }
                    }}
                    className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-gray-800 hover:border-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-slate-800 dark:text-gray-200 transition-all duration-200 group cursor-pointer text-center"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#8B1E26]/10 dark:bg-amber-400/10 flex items-center justify-center text-[#8B1E26] dark:text-amber-400 group-hover:scale-110 group-hover:bg-[#8B1E26] group-hover:text-white transition-all mb-1.5">
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-bold leading-tight font-sans text-slate-800 dark:text-gray-200 group-hover:text-[#8B1E26] dark:group-hover:text-amber-300">
                      {currentLang === 'ta' ? pill.nameTa : pill.nameEn}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* FULLSCREEN BANNER LIGHTBOX MODAL */}
        {isBannerZoomed && (
          <div 
            onClick={() => setIsBannerZoomed(false)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-lg flex items-center justify-center p-4 cursor-zoom-out animate-fadeIn"
          >
            <div className="relative max-w-6xl w-full max-h-[90vh] bg-slate-950 rounded-2xl overflow-hidden border-2 border-amber-400 shadow-2xl flex flex-col" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#8B1E26] to-[#600D13] text-white">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-300" />
                  <h3 className="font-extrabold text-sm sm:text-base text-amber-200">
                    {currentLang === 'ta' ? 'தமிழ் சங்கம் - தமிழ்நாடு (முகப்பு 1st View)' : 'Tamil Sangam - Tamil Nadu Banner'}
                  </h3>
                </div>
                <button 
                  onClick={() => setIsBannerZoomed(false)}
                  className="bg-black/40 hover:bg-black/80 text-white text-xs font-bold px-3 py-1.5 rounded-lg border border-amber-400/40 cursor-pointer"
                >
                  ✕ Close
                </button>
              </div>
              <div className="p-2 overflow-auto flex items-center justify-center bg-black">
                <img 
                  src="/tamil-sangam-banner.jpg" 
                  alt="Full Banner" 
                  className="max-w-full max-h-[80vh] object-contain rounded-lg" 
                />
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* 2. STATS COUNTER BAR */}
      {/* ========================================================================= */}
      <section className="py-8 bg-white dark:bg-[#181B20] border-y border-slate-200/80 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            
            {/* Stat Item 1 */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-[#FAF8F5] dark:bg-[#22262E] border border-slate-100 dark:border-gray-800 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-[#FDF2F2] dark:bg-red-950/60 flex items-center justify-center text-[#8B1E26] dark:text-red-400 shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-white">10,000+</p>
                <p className="text-xs font-medium text-slate-500 dark:text-gray-400">
                  {currentLang === 'ta' ? 'உறுப்பினர்கள்' : 'Members'}
                </p>
              </div>
            </div>

            {/* Stat Item 2 */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-[#FAF8F5] dark:bg-[#22262E] border border-slate-100 dark:border-gray-800 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-[#FDF2F2] dark:bg-red-950/60 flex items-center justify-center text-[#8B1E26] dark:text-red-400 shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-white">38</p>
                <p className="text-xs font-medium text-slate-500 dark:text-gray-400">
                  {currentLang === 'ta' ? 'மாவட்டங்கள்' : 'Districts'}
                </p>
              </div>
            </div>

            {/* Stat Item 3 */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-[#FAF8F5] dark:bg-[#22262E] border border-slate-100 dark:border-gray-800 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-[#FDF2F2] dark:bg-red-950/60 flex items-center justify-center text-[#8B1E26] dark:text-red-400 shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-white">23</p>
                <p className="text-xs font-medium text-slate-500 dark:text-gray-400">
                  {currentLang === 'ta' ? 'பாசறைகள்' : 'Pasarai Wings'}
                </p>
              </div>
            </div>

            {/* Stat Item 4 */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-[#FAF8F5] dark:bg-[#22262E] border border-slate-100 dark:border-gray-800 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-[#FDF2F2] dark:bg-red-950/60 flex items-center justify-center text-[#8B1E26] dark:text-red-400 shrink-0">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-white">100+</p>
                <p className="text-xs font-medium text-slate-500 dark:text-gray-400">
                  {currentLang === 'ta' ? 'நிகழ்ச்சிகள்' : 'Events'}
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. VISION, MISSION, OBJECTIVES CARDS SECTION (EXPANDED CONTENT) */}
      {/* ========================================================================= */}
      <section className="py-16 bg-[#FAF8F5] dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <span className="bg-[#8B1E26]/10 text-[#8B1E26] dark:text-red-400 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider border border-[#8B1E26]/20">
              {currentLang === 'ta' ? 'அமைப்பின் தொலைநோக்கு & கோட்பாடு' : 'ORGANISATIONAL FOUNDATION'}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-heading">
              {currentLang === 'ta' ? 'எமது தொலைநோக்கு, பணி & முதன்மை நோக்கங்கள்' : 'Our Vision, Mission & Strategic Objectives'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-400 max-w-2xl mx-auto">
              {currentLang === 'ta' 
                ? 'தமிழ் பண்பாட்டுப் பாதுகாப்பு, சமுதாய மறுமலர்ச்சி மற்றும் டிஜிட்டல் உறுப்பினர் கட்டமைப்புக்கான எமது மூன்று முக்கியத் தூண்கள்.' 
                : 'Dedicated framework ensuring Tamil heritage preservation, digital community empowerment, and transparent social welfare across all 38 districts.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            
            {/* Card 1: Our Vision */}
            <div className="bg-white dark:bg-[#1E232B] p-8 rounded-3xl border border-slate-200/80 dark:border-gray-800 shadow-lg text-left space-y-5 hover:shadow-xl transition-all flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-[#FDF2F2] dark:bg-red-950/60 text-[#8B1E26] dark:text-red-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Eye className="w-7 h-7" />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold text-[#8B1E26] dark:text-red-400 uppercase tracking-widest block mb-1">
                    {currentLang === 'ta' ? 'எதிர்கால தொலைநோக்கு' : 'GLOBAL HERITAGE VISION'}
                  </span>
                  <h3 className="text-2xl font-extrabold font-heading text-slate-900 dark:text-white">
                    {currentLang === 'ta' ? 'எமது தொலைநோக்கு' : 'Our Vision'}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-300 leading-relaxed">
                  {currentLang === 'ta'
                    ? 'பண்டைய முச்சங்க இலக்கியங்கள் மற்றும் தமிழ் பண்பாட்டு பெருமைகளைப் பாதுகாத்து, உலகெங்கிலும் வாழும் தமிழ்மக்களை ஒன்றிணைத்து, வருங்கால தலைமுறையினருக்கு தமிழ் பாரம்பரியத்தை டிஜிட்டல் தொழில்நுட்பம் மூலம் கொண்டு சேர்ப்பதே எமது முதன்மை தொலைநோக்காகும்.'
                    : 'To build a globally connected Tamil ecosystem that preserves ancient literature, fosters cultural pride among youth, and unites Tamil diaspora across 25+ nations through 100% verified digital local units.'}
                </p>
              </div>

              {/* Bullet highlights */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs font-semibold text-slate-700 dark:text-gray-300">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#8B1E26] dark:text-red-400 shrink-0" />
                  <span>{currentLang === 'ta' ? 'பழங்கால ஓலைச்சுவடிகள் கணினிமயமாக்கல்' : 'Digitization of Palm-leaf Manuscripts'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#8B1E26] dark:text-red-400 shrink-0" />
                  <span>{currentLang === 'ta' ? '25+ நாடுகளில் உலகளாவிய தமிழ் பிணைப்பு' : 'Global Diaspora Network in 25+ Nations'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-[#8B1E26] dark:text-red-400 shrink-0" />
                  <span>{currentLang === 'ta' ? 'பல்கலைக்கழக தமிழ் இருக்கை ஆய்வுகள்' : 'International University Tamil Chairs'}</span>
                </div>
              </div>
            </div>

            {/* Card 2: Our Mission */}
            <div className="bg-white dark:bg-[#1E232B] p-8 rounded-3xl border border-slate-200/80 dark:border-gray-800 shadow-lg text-left space-y-5 hover:shadow-xl transition-all flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-[#FDF2F2] dark:bg-red-950/60 text-[#8B1E26] dark:text-red-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Target className="w-7 h-7" />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold text-[#8B1E26] dark:text-red-400 uppercase tracking-widest block mb-1">
                    {currentLang === 'ta' ? 'செயல் திட்ட லட்சியம்' : 'ACTIONABLE EXECUTION'}
                  </span>
                  <h3 className="text-2xl font-extrabold font-heading text-slate-900 dark:text-white">
                    {currentLang === 'ta' ? 'எமது லட்சியம் & பணி' : 'Our Mission'}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-300 leading-relaxed">
                  {currentLang === 'ta'
                    ? 'தமிழ்நாட்டின் 38 மாவட்டங்களிலும் 23 சிறப்பு பாசறைகள் மூலம் இளைஞர்கள், பெண்கள், மாணவர்கள் மற்றும் விவசாயிகளுக்கு இலவச கல்வி உதவிகள், சட்ட ஆலோசனை, டிஜிட்டல் அடையாள சான்றிதழ் மற்றும் சமூக நலப்பணிகளை வழங்குவதே எமது பணியாகும்.'
                    : 'To empower grassroots communities across all 38 districts of Tamil Nadu through 23 specialized Pasarai wings, delivering automated digital membership verification, student scholarships, career guidance, and emergency aid.'}
                </p>
              </div>

              {/* Bullet highlights */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs font-semibold text-slate-700 dark:text-gray-300">
                <div className="flex items-center gap-2">
                  <IdCard className="w-4 h-4 text-[#8B1E26] dark:text-red-400 shrink-0" />
                  <span>{currentLang === 'ta' ? '100% டிஜிட்டல் உறுப்பினர் சான்றிதழ்' : '100% Digital Member Cards & Verification'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Flag className="w-4 h-4 text-[#8B1E26] dark:text-red-400 shrink-0" />
                  <span>{currentLang === 'ta' ? '23 சிறப்பு பாசறை அமைப்புகள்' : '23 Wings for Youth, Women & Technology'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <HeartHandshake className="w-4 h-4 text-[#8B1E26] dark:text-red-400 shrink-0" />
                  <span>{currentLang === 'ta' ? 'இரத்த தானம் & உடனடி மருத்துவ உதவிகள்' : '24/7 Community Blood & Welfare Support'}</span>
                </div>
              </div>
            </div>

            {/* Card 3: Our Objectives */}
            <div className="bg-white dark:bg-[#1E232B] p-8 rounded-3xl border border-slate-200/80 dark:border-gray-800 shadow-lg text-left space-y-5 hover:shadow-xl transition-all flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-[#FDF2F2] dark:bg-red-950/60 text-[#8B1E26] dark:text-red-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Sprout className="w-7 h-7" />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold text-[#8B1E26] dark:text-red-400 uppercase tracking-widest block mb-1">
                    {currentLang === 'ta' ? 'முக்கியக் குறிக்கோள்கள்' : 'STRATEGIC PILLARS'}
                  </span>
                  <h3 className="text-2xl font-extrabold font-heading text-slate-900 dark:text-white">
                    {currentLang === 'ta' ? 'எமது முதன்மை நோக்கங்கள்' : 'Our Objectives'}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-300 leading-relaxed">
                  {currentLang === 'ta'
                    ? 'கிராமப்புற மாணவர்களுக்கு TNPSC/UPSC இலவச பயிற்சி, திருக்குறள் ஆய்வு மாநாடுகள், இயற்கை வளம் காக்கும் பசுமை இயக்கங்கள், தமிழ் கலை-இசை மறுமலர்ச்சி மற்றும் வெளிப்படைத்தன்மையுடன் கூடிய சமுதாய சேவை.'
                    : 'To construct a transparent foundation centered on educational scholarships, Thirukkural symposiums, environmental tree plantation drives, classical arts preservation, and structured local leadership.'}
                </p>
              </div>

              {/* Bullet highlights */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs font-semibold text-slate-700 dark:text-gray-300">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#8B1E26] dark:text-red-400 shrink-0" />
                  <span>{currentLang === 'ta' ? 'இலவச போட்டித்தேர்வு பயிற்சி & உதவித்தொகை' : 'Free TNPSC/UPSC Coaching & Scholarships'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <TreePine className="w-4 h-4 text-[#8B1E26] dark:text-red-400 shrink-0" />
                  <span>{currentLang === 'ta' ? 'மரக்கன்றுகள் நடுதல் & இயற்கை பாதுகாப்பு' : 'Environmental Tree Plantation Drives'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Theater className="w-4 h-4 text-[#8B1E26] dark:text-red-400 shrink-0" />
                  <span>{currentLang === 'ta' ? 'தமிழ் இசை, நாட்டியம் & நாட்டுப்புறக் கலைகள்' : 'Classical Arts & Folk Literature Festivals'}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. ABOUT TAMIL SANGAM SECTION */}
      {/* ========================================================================= */}
      {/* ========================================================================= */}
      {/* 4. ABOUT TAMIL SANGAM SECTION */}
      {/* ========================================================================= */}
      <section id="about" className="py-16 bg-white dark:bg-[#181B20] border-t border-slate-200/80 dark:border-gray-800 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
            
            {/* Left Text Column */}
            <div className="lg:col-span-6 flex flex-col justify-center space-y-6 py-2">
              <div className="space-y-2">
                <span className="text-xs font-extrabold text-[#8B1E26] dark:text-red-400 uppercase tracking-widest bg-[#FDF2F2] dark:bg-red-950/50 px-3 py-1 rounded-full border border-[#8B1E26]/20">
                  {currentLang === 'ta' ? 'எங்களைப் பற்றி' : 'ABOUT OUR SANGAM'}
                </span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-slate-900 dark:text-white leading-tight">
                  {currentLang === 'ta' ? 'தமிழ் சங்கம் பற்றி' : 'About Tamil Sangam'}
                </h2>
                <div className="w-20 h-1.5 bg-[#8B1E26] dark:bg-red-500 mt-2 rounded-full" />
              </div>

              <p className="text-sm sm:text-base text-slate-600 dark:text-gray-300 leading-relaxed font-normal">
                {currentLang === 'ta'
                  ? 'தமிழ் சங்கம் - தமிழ்நாடு என்பது தமிழ் மொழி, பண்பாடு, கலாச்சாரம் மற்றும் பாரம்பரியத்தைப் பாதுகாக்கவும், பல்வேறு சமூக, கல்வி மற்றும் பண்பாட்டுத் திட்டங்கள் மூலம் நமது சமுதாயத்தின் ஒட்டுமொத்த வளர்ச்சிக்கு உறுதுணையாக இருக்கவும் இயங்கும் மக்கள் அமைப்பாகும்.'
                  : 'Tamil Sangam - Tamil Nadu is a dedicated people\'s organization committed to preserving Tamil language, culture, heritage and supporting the overall development of our community through various social, educational and cultural initiatives.'}
              </p>

              {/* Key Features Badge Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-semibold text-slate-700 dark:text-gray-300 pt-1">
                <div className="flex items-center gap-2.5 bg-[#FAF8F5] dark:bg-slate-800/80 p-3 rounded-xl border border-slate-200/80 dark:border-slate-700 shadow-sm">
                  <Landmark className="w-4 h-4 text-[#8B1E26] dark:text-red-400 shrink-0" />
                  <span>{currentLang === 'ta' ? 'முச்சங்கபாரம்பரியம்' : 'Ancient Sangam Heritage'}</span>
                </div>
                <div className="flex items-center gap-2.5 bg-[#FAF8F5] dark:bg-slate-800/80 p-3 rounded-xl border border-slate-200/80 dark:border-slate-700 shadow-sm">
                  <Flag className="w-4 h-4 text-[#8B1E26] dark:text-red-400 shrink-0" />
                  <span>{currentLang === 'ta' ? '23 பாசறைகள்' : '23 Wings / Pasarai'}</span>
                </div>
                <div className="flex items-center gap-2.5 bg-[#FAF8F5] dark:bg-slate-800/80 p-3 rounded-xl border border-slate-200/80 dark:border-slate-700 shadow-sm">
                  <MapPin className="w-4 h-4 text-[#8B1E26] dark:text-red-400 shrink-0" />
                  <span>{currentLang === 'ta' ? '38 மாவட்ட அலகுகள்' : '38 District Units'}</span>
                </div>
                <div className="flex items-center gap-2.5 bg-[#FAF8F5] dark:bg-slate-800/80 p-3 rounded-xl border border-slate-200/80 dark:border-slate-700 shadow-sm">
                  <ShieldCheck className="w-4 h-4 text-[#8B1E26] dark:text-red-400 shrink-0" />
                  <span>{currentLang === 'ta' ? 'டிஜிட்டல் உறுப்பினர் சான்று' : 'Digital ID & Verification'}</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    if (setActiveTab) setActiveTab('about');
                  }}
                  className="inline-flex items-center gap-2 bg-[#8B1E26] hover:bg-[#72151C] text-white text-xs font-extrabold px-7 py-3.5 rounded-full shadow-lg hover:shadow-xl transition-all active:scale-95 cursor-pointer uppercase tracking-wider"
                >
                  <span>{currentLang === 'ta' ? 'மேலும் அறிய (Read More)' : 'Read Full History'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Image Column - Full right side container with Thiruvalluvar Statue Kanyakumari Sunset image */}
            <div className="lg:col-span-6 relative min-h-[380px] sm:min-h-[460px] lg:min-h-[500px] w-full flex">
              <div className="w-full h-full rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-100 dark:border-slate-800 relative group flex">
                <img 
                  src="/kanyakumari-statue.png" 
                  alt="Thiruvalluvar Statue & Vivekananda Rock Memorial Kanyakumari Sunset" 
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 min-h-[380px] lg:min-h-[500px]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent p-6 sm:p-8 flex flex-col justify-end pointer-events-none">
                  <span className="bg-[#8B1E26] text-white text-[10px] font-extrabold px-3 py-1 rounded-full w-fit uppercase tracking-widest mb-2 shadow-md">
                    KANYAKUMARI LANDMARK
                  </span>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white font-heading tracking-tight drop-shadow-md">
                    {currentLang === 'ta' ? 'திருவள்ளுவர் சிலை & விவேகானந்தர் பாறை' : 'Thiruvalluvar Statue & Vivekananda Rock'}
                  </h3>
                  <p className="text-xs text-gray-200 mt-1 font-medium drop-shadow">
                    {currentLang === 'ta' ? 'கன்னியாகுமரி கடலில் தமிழ் பெருமையின் சின்னம்' : 'Symbol of Tamil Pride & Heritage at Kanyakumari Sea'}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. BECOME A MEMBER CALLOUT BANNER */}
      {/* ========================================================================= */}
      <section id="membership" className="py-16 bg-[#FAF8F5] dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-[#1E232B] rounded-3xl p-6 sm:p-10 border border-slate-200/80 dark:border-gray-800 shadow-xl overflow-hidden">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Image */}
              <div className="lg:col-span-5 overflow-hidden rounded-2xl aspect-[4/3] sm:aspect-[16/10]">
                <img 
                  src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=800&auto=format&fit=crop" 
                  alt="Join Tamil Sangam Members" 
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Right Checklist & CTA */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <span className="text-xs font-extrabold text-[#8B1E26] dark:text-red-400 uppercase tracking-wider">
                    {currentLang === 'ta' ? 'உறுப்பினராக இணையுங்கள்' : 'BECOME A MEMBER'}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 dark:text-white mt-1">
                    {currentLang === 'ta' ? (
                      <>
                        தமிழ் சங்கத்தில் இணையுங்கள் <br />
                        <span className="text-slate-600 dark:text-gray-300 text-xl font-normal">எங்கள் அமைப்பின் அங்கமாகி சமுதாயப் பணியாற்ற வாருங்கள்.</span>
                      </>
                    ) : (
                      <>
                        Join Tamil Sangam <br />
                        <span className="text-slate-600 dark:text-gray-300 text-xl font-normal">and become part of our growing community.</span>
                      </>
                    )}
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700 dark:text-gray-200 font-medium">
                  <div className="flex items-center gap-2">
                    <CheckSquare className="w-4 h-4 text-[#8B1E26] dark:text-red-400 shrink-0" />
                    <span>{currentLang === 'ta' ? 'டிஜிட்டல் அடையாள அட்டை' : 'Digital Membership ID'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckSquare className="w-4 h-4 text-[#8B1E26] dark:text-red-400 shrink-0" />
                    <span>{currentLang === 'ta' ? 'உறுப்பினர் சான்றிதழ்கள்' : 'Verified Certificates'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckSquare className="w-4 h-4 text-[#8B1E26] dark:text-red-400 shrink-0" />
                    <span>{currentLang === 'ta' ? 'உறுப்பினர் கட்டுப்பாட்டுப் பலகை' : 'Member Dashboard'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckSquare className="w-4 h-4 text-[#8B1E26] dark:text-red-400 shrink-0" />
                    <span>{currentLang === 'ta' ? 'QR சரிபார்ப்பு வசதி' : 'Membership Verification'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckSquare className="w-4 h-4 text-[#8B1E26] dark:text-red-400 shrink-0" />
                    <span>{currentLang === 'ta' ? 'நிகழ்ச்சிப் பதிவு' : 'Event Registration'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckSquare className="w-4 h-4 text-[#8B1E26] dark:text-red-400 shrink-0" />
                    <span>{currentLang === 'ta' ? 'சமூக நலப் பணிகளில் பங்கேற்பு' : 'Be a part of Social Initiatives'}</span>
                  </div>
                </div>

                <div>
                  <button
                    onClick={() => onOpenJoinModal()}
                    className="inline-flex items-center gap-2 bg-[#8B1E26] hover:bg-[#72151C] text-white text-xs font-bold px-7 py-3.5 rounded-full shadow-lg transition-all active:scale-95 cursor-pointer"
                  >
                    <span>{currentLang === 'ta' ? 'இப்போதே இணையுங்கள்' : 'Join Now'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. OUR WINGS / PASARAI SECTION */}
      {/* ========================================================================= */}
      <section id="pasarai" className="py-16 bg-white dark:bg-[#181B20] border-t border-slate-200/80 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 dark:text-white">
                {currentLang === 'ta' ? 'எமது பாசறைகள்' : 'Our Wings / Pasarai'}
              </h2>
              <div className="w-16 h-1 bg-[#8B1E26] mt-2 rounded-full" />
            </div>

            <button
              onClick={() => {
                if (setActiveTab) setActiveTab('pasarai');
              }}
              className="flex items-center gap-1 text-xs font-bold text-[#8B1E26] dark:text-red-400 border border-[#8B1E26]/30 px-3.5 py-1.5 rounded-full hover:bg-[#FDF2F2] transition-colors cursor-pointer"
            >
              <span>{currentLang === 'ta' ? 'அனைத்து பாசறைகளும்' : 'View All Wings'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Slider Controls & Cards Row */}
          <div className="relative">
            
            <button 
              onClick={handlePrevWings}
              className="absolute left-0 top-1/2 -translate-y-1/2 -left-4 z-10 w-9 h-9 rounded-full bg-white dark:bg-gray-800 shadow-md border border-slate-200 dark:border-gray-700 flex items-center justify-center text-slate-700 dark:text-gray-200 hover:bg-slate-100 cursor-pointer"
              aria-label="Previous Wing"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button 
              onClick={handleNextWings}
              className="absolute right-0 top-1/2 -translate-y-1/2 -right-4 z-10 w-9 h-9 rounded-full bg-white dark:bg-gray-800 shadow-md border border-slate-200 dark:border-gray-700 flex items-center justify-center text-slate-700 dark:text-gray-200 hover:bg-slate-100 cursor-pointer"
              aria-label="Next Wing"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {wingCards.slice(wingSlideIndex, wingSlideIndex + 6).concat(wingCards.slice(0, Math.max(0, (wingSlideIndex + 6) - wingCards.length))).map((wing) => (
                <div
                  key={wing.id}
                  onClick={() => onOpenJoinModal(wing.id)}
                  className="bg-[#FAF8F5] dark:bg-[#22262E] rounded-xl overflow-hidden border border-slate-200/80 dark:border-gray-800 hover:border-[#8B1E26] transition-all cursor-pointer group shadow-sm flex flex-col justify-between"
                >
                  <div className="h-32 overflow-hidden relative">
                    <img 
                      src={wing.img} 
                      alt={currentLang === 'ta' ? wing.nameTa : wing.nameEn} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                  </div>
                  
                  <div className="p-3 text-center flex items-center justify-center gap-1.5 bg-white dark:bg-[#1E232B]">
                    <wing.icon className="w-4 h-4 text-[#8B1E26] shrink-0" />
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {currentLang === 'ta' ? wing.nameTa : wing.nameEn}
                    </span>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. UPCOMING EVENTS & LATEST NEWS SECTION */}
      {/* ========================================================================= */}
      <section id="events" className="py-16 bg-[#FAF8F5] dark:bg-slate-950 border-t border-slate-200/80 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Left Column: Upcoming Events */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-extrabold font-heading text-slate-900 dark:text-white">
                    {currentLang === 'ta' ? 'வரவிருக்கும் நிகழ்ச்சிகள்' : 'Upcoming Events'}
                  </h2>
                  <div className="w-12 h-1 bg-[#8B1E26] mt-1.5 rounded-full" />
                </div>
                
                <button
                  onClick={() => {
                    if (setActiveTab) setActiveTab('events');
                  }}
                  className="text-xs font-bold text-[#8B1E26] dark:text-red-400 border border-[#8B1E26]/30 px-3 py-1 rounded-full hover:bg-[#FDF2F2] cursor-pointer"
                >
                  {currentLang === 'ta' ? 'அனைத்து நிகழ்ச்சிகளும் →' : 'View All Events →'}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                {/* Event Card 1 */}
                <div className="bg-white dark:bg-[#1E232B] rounded-xl overflow-hidden border border-slate-200/80 dark:border-gray-800 shadow-sm flex flex-col justify-between">
                  <div className="h-32 relative overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1609137144813-7d9921338f24?q=80&w=600&auto=format&fit=crop" alt="Event 1" className="w-full h-full object-cover" />
                    <div className="absolute top-2 left-2 bg-[#8B1E26] text-white text-center px-2 py-1 rounded text-[10px] font-bold leading-tight shadow">
                      <span className="text-base font-extrabold block">12</span> OCT
                    </div>
                  </div>
                  
                  <div className="p-3 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1">
                        {currentLang === 'ta' ? 'தமிழ் பண்பாட்டுத் திருவிழா' : 'Tamil Cultural Festival'}
                      </h4>
                      <p className="text-[10px] text-slate-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                        <LocationIcon className="w-3 h-3 text-[#8B1E26]" /> {currentLang === 'ta' ? 'மதுரை' : 'Madurai'}
                      </p>
                    </div>

                    <button 
                      onClick={() => onOpenJoinModal()}
                      className="text-[11px] font-bold text-[#8B1E26] dark:text-red-400 hover:underline inline-flex items-center gap-1 cursor-pointer pt-1"
                    >
                      {currentLang === 'ta' ? 'நிகழ்ச்சி விவரம் →' : 'View Event →'}
                    </button>
                  </div>
                </div>

                {/* Event Card 2 */}
                <div className="bg-white dark:bg-[#1E232B] rounded-xl overflow-hidden border border-slate-200/80 dark:border-gray-800 shadow-sm flex flex-col justify-between">
                  <div className="h-32 relative overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=600&auto=format&fit=crop" alt="Event 2" className="w-full h-full object-cover" />
                    <div className="absolute top-2 left-2 bg-[#8B1E26] text-white text-center px-2 py-1 rounded text-[10px] font-bold leading-tight shadow">
                      <span className="text-base font-extrabold block">25</span> OCT
                    </div>
                  </div>
                  
                  <div className="p-3 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1">
                        {currentLang === 'ta' ? 'இளைஞர் தலைமைத்துவ மாநாடு' : 'Youth Leadership Meet'}
                      </h4>
                      <p className="text-[10px] text-slate-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                        <LocationIcon className="w-3 h-3 text-[#8B1E26]" /> {currentLang === 'ta' ? 'மதுரை' : 'Madurai'}
                      </p>
                    </div>

                    <button 
                      onClick={() => onOpenJoinModal()}
                      className="text-[11px] font-bold text-[#8B1E26] dark:text-red-400 hover:underline inline-flex items-center gap-1 cursor-pointer pt-1"
                    >
                      {currentLang === 'ta' ? 'நிகழ்ச்சி விவரம் →' : 'View Event →'}
                    </button>
                  </div>
                </div>

                {/* Event Card 3 */}
                <div className="bg-white dark:bg-[#1E232B] rounded-xl overflow-hidden border border-slate-200/80 dark:border-gray-800 shadow-sm flex flex-col justify-between">
                  <div className="h-32 relative overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop" alt="Event 3" className="w-full h-full object-cover" />
                    <div className="absolute top-2 left-2 bg-[#8B1E26] text-white text-center px-2 py-1 rounded text-[10px] font-bold leading-tight shadow">
                      <span className="text-base font-extrabold block">05</span> NOV
                    </div>
                  </div>
                  
                  <div className="p-3 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1">
                        {currentLang === 'ta' ? 'மகளிர் சுயசார்பு பயிலரங்கம்' : 'Women Empowerment Workshop'}
                      </h4>
                      <p className="text-[10px] text-slate-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                        <LocationIcon className="w-3 h-3 text-[#8B1E26]" /> {currentLang === 'ta' ? 'சென்னை' : 'Chennai'}
                      </p>
                    </div>

                    <button 
                      onClick={() => onOpenJoinModal()}
                      className="text-[11px] font-bold text-[#8B1E26] dark:text-red-400 hover:underline inline-flex items-center gap-1 cursor-pointer pt-1"
                    >
                      {currentLang === 'ta' ? 'நிகழ்ச்சி விவரம் →' : 'View Event →'}
                    </button>
                  </div>
                </div>

              </div>

            </div>

            {/* Right Column: Latest News */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-extrabold font-heading text-slate-900 dark:text-white">
                    {currentLang === 'ta' ? 'சமீபத்திய செய்திகள்' : 'Latest News'}
                  </h2>
                  <div className="w-12 h-1 bg-[#8B1E26] mt-1.5 rounded-full" />
                </div>

                <button
                  onClick={() => {
                    if (setActiveTab) setActiveTab('news');
                  }}
                  className="text-xs font-bold text-[#8B1E26] dark:text-red-400 border border-[#8B1E26]/30 px-3 py-1 rounded-full hover:bg-[#FDF2F2] cursor-pointer"
                >
                  {currentLang === 'ta' ? 'அனைத்து செய்திகளும் →' : 'View All News →'}
                </button>
              </div>

              <div className="space-y-3">
                
                {INITIAL_NEWS.slice(0, 3).map((news: NewsItem) => (
                  <div key={news.id} className="bg-white dark:bg-[#1E232B] p-3 rounded-xl border border-slate-200/80 dark:border-gray-800 shadow-sm flex items-center gap-3">
                    <img 
                      src={news.summary ? "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=200&auto=format&fit=crop" : "https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=200&auto=format&fit=crop"} 
                      alt={news.title} 
                      className="w-16 h-16 rounded-lg object-cover shrink-0" 
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-bold uppercase text-[#8B1E26] dark:text-red-400 bg-[#FDF2F2] dark:bg-red-950/60 px-1.5 py-0.5 rounded">
                          {news.category}
                        </span>
                        <span className="text-[10px] text-slate-400">{news.date}</span>
                      </div>
                      <h4 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-2 leading-tight">
                        {currentLang === 'ta' ? (news.titleTamil || news.title) : news.title}
                      </h4>
                    </div>
                  </div>
                ))}

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. GALLERY SECTION */}
      {/* ========================================================================= */}
      <section id="gallery" className="py-16 bg-white dark:bg-[#181B20] border-t border-slate-200/80 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 dark:text-white">
                {currentLang === 'ta' ? 'புகைப்படக் கூடம்' : 'Gallery'}
              </h2>
              <div className="w-16 h-1 bg-[#8B1E26] mt-2 rounded-full" />
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {(currentLang === 'ta' 
                ? ['அனைத்தும்', 'நிகழ்ச்சிகள்', 'கலாச்சாரம்', 'நலத்திட்டங்கள்', 'மாவட்டங்கள்', 'பாசறைகள்'] 
                : ['All', 'Events', 'Culture', 'Welfare', 'District', 'Pasarai']
              ).map((filter, filterIdx) => {
                const rawCategoryKeys = ['All', 'Events', 'Culture', 'Welfare', 'District', 'Pasarai'];
                const categoryKey = rawCategoryKeys[filterIdx];
                return (
                  <button
                    key={filter}
                    onClick={() => setActiveGalleryFilter(categoryKey)}
                    className={`text-xs font-semibold px-3 py-1 rounded-full transition-all cursor-pointer ${
                      activeGalleryFilter === categoryKey
                        ? 'bg-[#8B1E26] text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-gray-800 text-slate-600 dark:text-gray-300 hover:bg-slate-200'
                    }`}
                  >
                    {filter}
                  </button>
                );
              })}

              <button
                onClick={() => {
                  if (setActiveTab) setActiveTab('gallery');
                }}
                className="hidden lg:flex items-center gap-1 text-xs font-bold text-[#8B1E26] dark:text-red-400 border border-[#8B1E26]/30 px-3 py-1 rounded-full hover:bg-[#FDF2F2] cursor-pointer ml-2"
              >
                <span>{currentLang === 'ta' ? 'முழுப்படக் கூடம் பார்க்க' : 'View Full Gallery'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Photo Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {filteredGallery.map((item) => (
              <div key={item.id} className="group overflow-hidden rounded-xl bg-slate-100 dark:bg-gray-800 aspect-[4/3] relative shadow-sm cursor-pointer">
                <img 
                  src={item.img} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end">
                  <span className="text-[10px] font-bold text-red-300 uppercase">{item.category}</span>
                  <p className="text-xs font-bold text-white line-clamp-1">{item.title}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. THIRUKKURAL OF THE DAY / TAMIL WISDOM SECTION */}
      {/* ========================================================================= */}
      <section className="py-14 bg-[#FDF2F2] dark:bg-[#1E191A] border-t border-slate-200/80 dark:border-red-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-[#251D1F] p-8 sm:p-10 rounded-3xl border border-[#8B1E26]/20 shadow-md relative overflow-hidden">
            
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <BookOpen className="w-48 h-48 text-[#8B1E26]" />
            </div>

            <div className="max-w-3xl space-y-4 relative z-10">
              <div className="inline-flex items-center gap-2 bg-[#8B1E26]/10 text-[#8B1E26] dark:text-red-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{currentLang === 'ta' ? 'தினமொரு திருக்குறள்' : 'Thirukkural of the Day'}</span>
              </div>

              <blockquote className="text-xl sm:text-2xl font-serif font-bold text-slate-900 dark:text-gray-100 leading-snug">
                {currentLang === 'ta' ? (
                  <>
                    "கற்க கசடறக் கற்பவை கற்றபின் <br className="hidden sm:inline" />
                    நிற்க அதற்குத் தக."
                  </>
                ) : (
                  <>
                    "Learn thoroughly whatever you learn; <br className="hidden sm:inline" />
                    after learning, let your conduct strictly reflect it."
                  </>
                )}
              </blockquote>

              <div className="space-y-1.5 text-xs sm:text-sm text-slate-600 dark:text-gray-300">
                {currentLang === 'ta' ? (
                  <p><strong className="text-slate-900 dark:text-white">பொருள்:</strong> கற்கத் தகுந்த நூல்களைக் குற்றமறக் கற்க வேண்டும்; அவ்வாறு கற்ற பிறகு, அக்கற்ற கல்விக்குத் தக்கவாறு நெறியில் நிற்க வேண்டும்.</p>
                ) : (
                  <p><strong className="text-slate-900 dark:text-white">Meaning:</strong> Learn thoroughly whatever you learn; after learning, let your conduct strictly reflect what you have learned.</p>
                )}
              </div>

              <div className="pt-2 flex items-center gap-4 text-xs font-semibold text-[#8B1E26] dark:text-red-400">
                <span>{currentLang === 'ta' ? '— அதிகாரம்: கல்வி (குறள் 391)' : '— Chapter: Knowledge (Kural 391)'}</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 10. LEADERSHIP & OFFICE BEARERS SECTION */}
      {/* ========================================================================= */}
      <section className="py-16 bg-white dark:bg-[#181B20] border-t border-slate-200/80 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <span className="text-xs font-extrabold text-[#8B1E26] dark:text-red-400 uppercase tracking-wider">
              {currentLang === 'ta' ? 'மாநில தலைமை' : 'STATE LEADERSHIP'}
            </span>
            <h2 className="text-3xl font-extrabold font-heading text-slate-900 dark:text-white">
              {currentLang === 'ta' ? 'தலைமை நிர்வாகிகள்' : 'State Office Bearers'}
            </h2>
            <div className="w-16 h-1 bg-[#8B1E26] mx-auto rounded-full" />
            <p className="text-xs text-slate-600 dark:text-gray-400">
              {currentLang === 'ta' 
                ? 'தமிழ் சங்கத்தின் வளர்ச்சிக்கும் சமூக முன்னேற்றத்திற்கும் வழிகாட்டும் மாநில நிர்வாகிகள்' 
                : 'State leaders guiding the growth, cultural preservation, and digital governance of Tamil Sangam.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Leader 1 */}
            <div className="bg-[#FAF8F5] dark:bg-[#22262E] p-5 rounded-2xl border border-slate-200/80 dark:border-gray-800 shadow-sm text-center space-y-3 hover:border-[#8B1E26] transition-all group">
              <div className="w-24 h-24 rounded-full overflow-hidden mx-auto ring-4 ring-white dark:ring-gray-700 shadow-md">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop" 
                  alt="State President" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  {currentLang === 'ta' ? 'முனைவர். கே. பாரதிதாசன்' : 'Dr. K. Bharathidasan'}
                </h4>
                <p className="text-xs text-[#8B1E26] dark:text-red-400 font-semibold">
                  {currentLang === 'ta' ? 'மாநிலத் தலைவர்' : 'State President'}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-gray-400 mt-1">
                  {currentLang === 'ta' ? 'தமிழ் கலை & தமிழ் செம்மொழி ஆய்வாளர்' : 'Classical Tamil Literature Scholar'}
                </p>
              </div>
            </div>

            {/* Leader 2 */}
            <div className="bg-[#FAF8F5] dark:bg-[#22262E] p-5 rounded-2xl border border-slate-200/80 dark:border-gray-800 shadow-sm text-center space-y-3 hover:border-[#8B1E26] transition-all group">
              <div className="w-24 h-24 rounded-full overflow-hidden mx-auto ring-4 ring-white dark:ring-gray-700 shadow-md">
                <img 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300&auto=format&fit=crop" 
                  alt="General Secretary" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  {currentLang === 'ta' ? 'திருமதி. இரா. கயல்விழி' : 'Mrs. R. Kayalvizhi'}
                </h4>
                <p className="text-xs text-[#8B1E26] dark:text-red-400 font-semibold">
                  {currentLang === 'ta' ? 'பொதுச் செயலாளர்' : 'General Secretary'}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-gray-400 mt-1">
                  {currentLang === 'ta' ? 'மகளிர் பாசறை ஆலோசகர்' : 'Women Empowerment Advisor'}
                </p>
              </div>
            </div>

            {/* Leader 3 */}
            <div className="bg-[#FAF8F5] dark:bg-[#22262E] p-5 rounded-2xl border border-slate-200/80 dark:border-gray-800 shadow-sm text-center space-y-3 hover:border-[#8B1E26] transition-all group">
              <div className="w-24 h-24 rounded-full overflow-hidden mx-auto ring-4 ring-white dark:ring-gray-700 shadow-md">
                <img 
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop" 
                  alt="Treasurer" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  {currentLang === 'ta' ? 'திரு. செ. இளங்கோவன்' : 'Mr. S. Elangovan'}
                </h4>
                <p className="text-xs text-[#8B1E26] dark:text-red-400 font-semibold">
                  {currentLang === 'ta' ? 'பொருளாளர்' : 'State Treasurer'}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-gray-400 mt-1">
                  {currentLang === 'ta' ? 'சமூக நலப் பணிகள் ஒருங்கிணைப்பாளர்' : 'Social Welfare Coordinator'}
                </p>
              </div>
            </div>

            {/* Leader 4 */}
            <div className="bg-[#FAF8F5] dark:bg-[#22262E] p-5 rounded-2xl border border-slate-200/80 dark:border-gray-800 shadow-sm text-center space-y-3 hover:border-[#8B1E26] transition-all group">
              <div className="w-24 h-24 rounded-full overflow-hidden mx-auto ring-4 ring-white dark:ring-gray-700 shadow-md">
                <img 
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300&auto=format&fit=crop" 
                  alt="Youth Coordinator" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  {currentLang === 'ta' ? 'டாக்டர். மு. தமிழ்ச்செல்வி' : 'Dr. M. Tamilselvi'}
                </h4>
                <p className="text-xs text-[#8B1E26] dark:text-red-400 font-semibold">
                  {currentLang === 'ta' ? 'இளைஞர் பாசறைத் தலைவர்' : 'Youth Wing President'}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-gray-400 mt-1">
                  {currentLang === 'ta' ? 'கல்வி மற்றும் ஊடகப் பொறுப்பாளர்' : 'Education & Media Coordinator'}
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 11. FREQUENTLY ASKED QUESTIONS (FAQ) SECTION */}
      {/* ========================================================================= */}
      <section className="py-16 bg-[#FAF8F5] dark:bg-slate-950 border-t border-slate-200/80 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <span className="text-xs font-extrabold text-[#8B1E26] dark:text-red-400 uppercase tracking-wider flex items-center justify-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-[#8B1E26]" />
              <span>{currentLang === 'ta' ? 'அடிக்கடி கேட்கப்படும் கேள்விகள்' : 'FREQUENTLY ASKED QUESTIONS'}</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 dark:text-white">
              {currentLang === 'ta' ? 'உங்களின் சந்தேகங்களுக்கான விடைகள்' : 'Answers to Your Questions'}
            </h2>
            <div className="w-16 h-1 bg-[#8B1E26] mx-auto rounded-full" />
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div 
                  key={idx}
                  className="bg-white dark:bg-[#1E232B] rounded-2xl border border-slate-200/80 dark:border-gray-800 overflow-hidden shadow-sm transition-all"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-slate-900 dark:text-white hover:text-[#8B1E26] cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-5 h-5 text-[#8B1E26] transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs text-slate-600 dark:text-gray-300 leading-relaxed border-t border-slate-100 dark:border-gray-800/60 bg-[#FAF8F5]/50 dark:bg-slate-900/30">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 12. SUPPORT OUR INITIATIVES (DONATION BANNER) */}
      {/* ========================================================================= */}
      <section className="py-16 bg-white dark:bg-[#181B20] border-t border-slate-200/80 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-[#8B1E26] via-[#72151C] to-[#500F14] text-white p-8 sm:p-12 border border-red-900/30">
            
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 pointer-events-none">
              <img 
                src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1600&auto=format&fit=crop" 
                alt="Support Tamil Sangam Initiatives" 
                className="w-full h-full object-cover opacity-50 transition-opacity duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#500F14]/95 via-[#72151C]/70 to-[#500F14]/30" />
            </div>

            <div className="relative z-10 max-w-2xl space-y-4">
              <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-white">
                {currentLang === 'ta' ? 'எங்கள் சமுதாயப் பணிகளுக்கு ஆதரவு தாருங்கள்' : 'Support Our Initiatives'}
              </h2>

              <p className="text-sm sm:text-base text-red-100 leading-relaxed font-medium">
                {currentLang === 'ta'
                  ? 'உங்கள் அன்பளிப்பு மற்றும் நன்கொடைகள் தமிழ் சமுதாயத்தின் கல்வி, பண்பாடு மற்றும் சமூக நலத் திட்டங்களை செயல்படுத்தப் பெரிதும் உதவும்.'
                  : 'Your generous contributions help us support education, cultural revival, environmental protection, and welfare initiatives across Tamil Nadu.'}
              </p>

              <div>
                <button
                  onClick={onOpenDonateModal}
                  className="inline-flex items-center gap-2 bg-white hover:bg-amber-100 text-[#8B1E26] text-xs font-black px-7 py-3.5 rounded-full shadow-xl transition-all active:scale-95 cursor-pointer uppercase tracking-wider"
                >
                  <Heart className="w-4 h-4 fill-[#8B1E26] text-[#8B1E26]" />
                  <span>{currentLang === 'ta' ? 'நன்கொடை அளியுங்கள்' : 'Donate Now'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};

