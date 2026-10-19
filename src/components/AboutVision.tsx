import React, { useState } from 'react';
import { 
  Landmark, BookOpen, GraduationCap, Users, ShieldCheck, 
  Heart, Award, Sparkles, ArrowRight, Compass, Target, Globe, 
  TreePine, Scale, Building2, History, Layers, Eye, 
  Flag, HeartHandshake, Stethoscope, Check, 
  Calendar, HelpCircle, ChevronDown, ChevronUp, 
  BadgeCheck, Flame, ScrollText
} from 'lucide-react';

interface AboutVisionProps {
  currentLang: 'en' | 'ta';
  onOpenJoinModal: () => void;
  isLoggedIn?: boolean;
  onGoToDashboard?: () => void;
}

export const AboutVision: React.FC<AboutVisionProps> = ({
  currentLang,
  onOpenJoinModal,
  isLoggedIn,
  onGoToDashboard
}) => {
  const isTa = currentLang === 'ta';
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(prev => prev === index ? null : index);
  };

  return (
    <div className="bg-[#FAF8F5] dark:bg-slate-950 text-slate-800 dark:text-gray-100 min-h-screen py-8 sm:py-14 transition-colors duration-300 selection:bg-[#8B1E26] selection:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        
        {/* ========================================================================= */}
        {/* 1. TOP HERO SECTION - ROYAL MAROON BRAND HEADER (MATCHING HOME PAGE) */}
        {/* ========================================================================= */}
        <section className="bg-[#8B1E26] text-white rounded-3xl p-6 sm:p-12 shadow-2xl relative overflow-hidden">
          
          {/* Subtle Temple Background Graphic with Maroon Overlay */}
          <div className="absolute right-0 top-0 bottom-0 w-full lg:w-1/2 opacity-20 sm:opacity-30 pointer-events-none overflow-hidden">
            <img 
              src="/hero-temple.jpg" 
              alt={isTa ? 'கோவில் மரபு' : 'Temple Heritage'} 
              className="w-full h-full object-cover object-right filter brightness-110" 
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#8B1E26] via-[#8B1E26]/80 to-transparent" />
          </div>
          
          <div className="max-w-3xl space-y-5 relative z-10">
            
            {/* Official Registration Badge */}
            <div className="inline-flex items-center gap-2 bg-white/15 border border-white/30 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-md">
              <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
              <span className="text-amber-200 font-extrabold text-[11px] sm:text-xs tracking-wider uppercase">
                {isTa ? 'அரசு பதிவு பெற்ற பொது அறக்கட்டளை • பதிவு எண்: TN-15-0042417' : 'Govt Registered Public Trust • Reg No: TN-15-0042417'}
              </span>
            </div>

            {/* Main Header Title */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight font-heading">
              {isTa ? (
                <>
                  தமிழ் சங்கம் - தமிழ்நாடு <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400">
                    முச்சங்க மரபு, 23 பாசறைகள் & மக்கள் இயக்கம்
                  </span>
                </>
              ) : (
                <>
                  TAMIL SANGAM - TAMIL NADU <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400">
                    Heritage of Three Sangams, 23 Wings & People Movement
                  </span>
                </>
              )}
            </h1>

            {/* Comprehensive Intro Paragraph */}
            <p className="text-sm sm:text-base text-gray-100 leading-relaxed font-sans max-w-2xl">
              {isTa 
                ? 'மூவாயிரத்து ஐந்நூறு ஆண்டுகளுக்கும் மேலான தொன்மையான சங்கத் தமிழ் மரபைப் போற்றிப் பாதுகாத்து, தமிழ்நாட்டின் 38 மாவட்டங்களிலும் 23 பாசறைகள் வழியே சமூக, கல்வி, மருத்துவ, சுற்றுச்சூழல் மற்றும் பண்பாட்டுப் பணிகளை ஆற்றி, அதிநவீன டிஜிட்டல் தொழில்நுட்பத்துடன் உலகத் தமிழர்களை இணைக்கும் தன்னிகரற்ற மக்கள் அமைப்பாகச் செயல்படுகிறோம்.'
                : 'Preserving over 3,500 years of classical Sangam heritage, driving grassroots social, educational, medical, ecological, and cultural empowerment across all 38 districts via 23 specialized wings, and uniting the global Tamil diaspora through transparent digital governance.'}
            </p>

            {/* Action Buttons in Hero */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              {isLoggedIn ? (
                <button
                  onClick={onGoToDashboard}
                  className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <span>{isTa ? 'எனது உறுப்பினர் பலகை' : 'Go To My Dashboard'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={onOpenJoinModal}
                  className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <Award className="w-4 h-4" />
                  <span>{isTa ? 'உறுப்பினராக இணையுங்கள்' : 'Join Tamil Sangam'}</span>
                </button>
              )}

              <a
                href="#history"
                className="bg-white/10 hover:bg-white/20 text-white border border-white/30 font-bold text-xs sm:text-sm px-5 py-3 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 backdrop-blur-sm"
              >
                <History className="w-4 h-4 text-amber-300" />
                <span>{isTa ? 'முச்சங்க வரலாற்றை வாசிக்க' : 'Explore Sangam History'}</span>
              </a>
            </div>

          </div>

          {/* Quick Stats Grid in Hero */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mt-8 pt-6 border-t border-white/20 relative z-10">
            
            <div className="bg-white/10 border border-white/20 p-3.5 rounded-2xl text-center backdrop-blur-sm">
              <p className="text-xl sm:text-2xl font-black text-amber-300">10,000+</p>
              <p className="text-[11px] text-gray-100 font-semibold mt-0.5">
                {isTa ? 'உறுப்பினர்கள்' : 'Verified Members'}
              </p>
            </div>

            <div className="bg-white/10 border border-white/20 p-3.5 rounded-2xl text-center backdrop-blur-sm">
              <p className="text-xl sm:text-2xl font-black text-amber-300">38</p>
              <p className="text-[11px] text-gray-100 font-semibold mt-0.5">
                {isTa ? 'மாவட்டங்கள்' : 'Districts Covered'}
              </p>
            </div>

            <div className="bg-white/10 border border-white/20 p-3.5 rounded-2xl text-center backdrop-blur-sm">
              <p className="text-xl sm:text-2xl font-black text-amber-300">23</p>
              <p className="text-[11px] text-gray-100 font-semibold mt-0.5">
                {isTa ? 'பாசறைகள்' : 'Specialized Wings'}
              </p>
            </div>

            <div className="bg-white/10 border border-white/20 p-3.5 rounded-2xl text-center backdrop-blur-sm">
              <p className="text-xl sm:text-2xl font-black text-amber-300">3,500+</p>
              <p className="text-[11px] text-gray-100 font-semibold mt-0.5">
                {isTa ? 'ஆண்டுகள் மரபு' : 'Years Heritage'}
              </p>
            </div>

            <div className="bg-white/10 border border-white/20 p-3.5 rounded-2xl text-center backdrop-blur-sm">
              <p className="text-xl sm:text-2xl font-black text-amber-300">100%</p>
              <p className="text-[11px] text-gray-100 font-semibold mt-0.5">
                {isTa ? 'டிஜிட்டல் அட்டை' : 'Digital QR ID'}
              </p>
            </div>

            <div className="bg-white/10 border border-white/20 p-3.5 rounded-2xl text-center backdrop-blur-sm">
              <p className="text-xl sm:text-2xl font-black text-amber-300">24/7</p>
              <p className="text-[11px] text-gray-100 font-semibold mt-0.5">
                {isTa ? 'இரத்த தான உதவி' : 'Emergency Blood Desk'}
              </p>
            </div>

          </div>

        </section>

        {/* ========================================================================= */}
        {/* QUICK SECTION JUMP NAVIGATION PILLS (MATCHING HOME PAGE) */}
        {/* ========================================================================= */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar border-b border-slate-200 dark:border-gray-800 text-xs">
          <span className="text-[#8B1E26] dark:text-red-400 font-extrabold uppercase shrink-0 flex items-center gap-1 text-[11px]">
            <Compass className="w-3.5 h-3.5" />
            {isTa ? 'பிரிவுகள்:' : 'Jump To:'}
          </span>
          {[
            { id: '#history', ta: 'வரலாறு', en: 'History' },
            { id: '#vision', ta: 'தொலைநோக்கு', en: 'Vision & Mission' },
            { id: '#objectives', ta: '12 நோக்கங்கள்', en: '12 Objectives' },
            { id: '#timeline', ta: 'மைல்கற்கள்', en: 'Milestones' },
            { id: '#governance', ta: 'நிர்வாகம்', en: 'Leadership' },
            { id: '#wings', ta: '23 பாசறைகள்', en: '23 Wings' },
            { id: '#events', ta: 'ஆண்டு விழாக்கள்', en: 'Annual Events' },
            { id: '#ethics', ta: 'ஒழுக்க நெறி', en: 'Code of Ethics' },
            { id: '#faq', ta: 'கேள்விகள்', en: 'FAQ' },
            { id: '#legal', ta: 'சட்ட விபரம்', en: 'Legal Trust' },
          ].map((item, idx) => (
            <a
              key={idx}
              href={item.id}
              className="px-3 py-1.5 rounded-full bg-white dark:bg-[#1E232B] hover:bg-[#FDF2F2] dark:hover:bg-red-950/40 text-slate-700 dark:text-gray-300 hover:text-[#8B1E26] dark:hover:text-red-400 border border-slate-200/80 dark:border-gray-800 font-semibold shrink-0 transition-colors shadow-sm"
            >
              {isTa ? item.ta : item.en}
            </a>
          ))}
        </div>

        {/* ========================================================================= */}
        {/* 2. HISTORICAL LEGACY - THE LEGEND OF THREE SANGAMS */}
        {/* ========================================================================= */}
        <section id="history" className="space-y-8 scroll-mt-24">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 bg-[#FDF2F2] dark:bg-red-950/60 text-[#8B1E26] dark:text-red-400 border border-[#8B1E26]/20 text-xs font-extrabold px-3.5 py-1 rounded-full uppercase tracking-wider">
              <History className="w-3.5 h-3.5" />
              <span>{isTa ? 'தொன்மைச் சங்க மரபு' : 'Ancient Sangam Heritage'}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-heading">
              {isTa ? 'முச்சங்க வரலாறு & நவீன டிஜிட்டல் மறுமலர்ச்சி' : 'The Legacy of Three Sangams & Modern Digital Renaissance'}
            </h2>
            <div className="w-20 h-1 bg-[#8B1E26] dark:bg-red-500 mx-auto rounded-full" />
            <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-300 leading-relaxed font-sans">
              {isTa 
                ? 'பண்டைய பாண்டிய மன்னர்களின் பேராதரவோடு தென்மதுரை, கபாடபுரம், மற்றும் மதுரையில் முச்சங்கங்கள் கூடி தமிழ் வளர்த்தன. திருக்குறள், தொல்காப்பியம், சிலப்பதிகாரம், எட்டுத்தொகை, பத்துப்பாட்டு போன்ற அமர இலக்கியங்கள் இந்த முச்சங்கங்களாலேயே அரங்கேற்றப்பட்டன. அந்தப் புனிதமான வரலாற்றுப் பாதையில், இன்றைய 21-ஆம் நூற்றாண்டில் 38 மாவட்டங்களிலும் நவீன டிஜிட்டல் சங்கமாக நாம் செயல்படுகிறோம்.'
                : 'Under the noble patronage of ancient Pandyan monarchs, the three legendary Sangam assemblies flourished in Thenmadurai, Kapatapuram, and Madurai. Foundational classics including Thirukkural, Tolkappiyam, Silappathikaram, Ettuthogai, and Pathupattu were canonized here. Today, we carry that torch forward as a 21st-century digital Sangam across all 38 districts.'}
            </p>
          </div>

          {/* 4 Chronological Era Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* First Sangam */}
            <div className="bg-white dark:bg-[#1E232B] border border-slate-200/80 dark:border-gray-800 p-5 rounded-2xl shadow-md hover:shadow-xl hover:border-[#8B1E26] dark:hover:border-red-400 transition-all flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#FDF2F2] dark:bg-red-950/60 border border-[#8B1E26]/20 flex items-center justify-center text-[#8B1E26] dark:text-red-400 group-hover:bg-[#8B1E26] group-hover:text-white transition-colors">
                  <Landmark className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#8B1E26] dark:text-red-400 bg-[#FDF2F2] dark:bg-red-950/60 px-2 py-0.5 rounded">
                  {isTa ? 'முதற்சங்கம்' : 'First Sangam'}
                </span>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  {isTa ? 'தென்மதுரை தமிழ்ச் சங்கம்' : 'Thenmadurai Assembly'}
                </h3>
                <p className="text-xs text-slate-600 dark:text-gray-300 leading-relaxed font-sans">
                  {isTa 
                    ? 'அகத்தியர், இறையனார் உள்ளிட்ட 549 புலவர்கள் கூடி 4,440 ஆண்டுகள் தென்மதுரையில் தமிழ் வளர்த்தனர். பேரகத்தியம், முதுநாரை, முதுகுருகு, களரியாவிரை, பரிபாடல் நூல்கள் இயற்றப்பட்டன. பின்னர் தென்மதுரை கடல்கோளால் அழிவுற்றது.'
                    : 'Chaired by sage Agathiyar, lord Iraiyanar, and 549 poets in Thenmadurai, functioning for 4,440 years under 89 Pandyan monarchs. Pioneered foundational poetics before being submerged in the Kumari Kandam deluge.'}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-gray-800 text-[11px] font-semibold text-[#8B1E26] dark:text-red-400 flex items-center justify-between">
                <span>{isTa ? 'தலைநகர்: தென்மதுரை' : 'Capital: Thenmadurai'}</span>
                <span>{isTa ? '4,440 ஆண்டுகள்' : '4,440 Years'}</span>
              </div>
            </div>

            {/* Second Sangam */}
            <div className="bg-white dark:bg-[#1E232B] border border-slate-200/80 dark:border-gray-800 p-5 rounded-2xl shadow-md hover:shadow-xl hover:border-[#8B1E26] dark:hover:border-red-400 transition-all flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#FDF2F2] dark:bg-red-950/60 border border-[#8B1E26]/20 flex items-center justify-center text-[#8B1E26] dark:text-red-400 group-hover:bg-[#8B1E26] group-hover:text-white transition-colors">
                  <BookOpen className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#8B1E26] dark:text-red-400 bg-[#FDF2F2] dark:bg-red-950/60 px-2 py-0.5 rounded">
                  {isTa ? 'இடைச்சங்கம்' : 'Second Sangam'}
                </span>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  {isTa ? 'கபாடபுரத் தமிழ்ச் சங்கம்' : 'Kapatapuram Assembly'}
                </h3>
                <p className="text-xs text-slate-600 dark:text-gray-300 leading-relaxed font-sans">
                  {isTa 
                    ? 'தொல்காப்பியர் தலைமையில் 59 புலவர்கள் கூடி 3,700 ஆண்டுகள் கபாடபுரத்தில் தமிழ் ஆய்ந்தனர். தமிழின் ஆகச்சிறந்த இலக்கணப் பெட்டகமான தொல்காப்பியம், மாபுராணம், பூதபுராணம் அரங்கேற்றப்பட்டன. பின்னர் இந்நகரமும் கடல்கோளால் மூழ்கியது.'
                    : 'Operated for 3,700 years in Kapatapuram with master grammarian Tolkappiyar and 59 savants under 59 Pandyan kings, producing the monumental grammatical treatise Tolkappiyam before the second ocean cataclysm.'}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-gray-800 text-[11px] font-semibold text-[#8B1E26] dark:text-red-400 flex items-center justify-between">
                <span>{isTa ? 'தலைநகர்: கபாடபுரம்' : 'Capital: Kapatapuram'}</span>
                <span>{isTa ? '3,700 ஆண்டுகள்' : '3,700 Years'}</span>
              </div>
            </div>

            {/* Third Sangam */}
            <div className="bg-white dark:bg-[#1E232B] border border-slate-200/80 dark:border-gray-800 p-5 rounded-2xl shadow-md hover:shadow-xl hover:border-[#8B1E26] dark:hover:border-red-400 transition-all flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#FDF2F2] dark:bg-red-950/60 border border-[#8B1E26]/20 flex items-center justify-center text-[#8B1E26] dark:text-red-400 group-hover:bg-[#8B1E26] group-hover:text-white transition-colors">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#8B1E26] dark:text-red-400 bg-[#FDF2F2] dark:bg-red-950/60 px-2 py-0.5 rounded">
                  {isTa ? 'கடைச்சங்கம்' : 'Third Sangam'}
                </span>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  {isTa ? 'மதுரை தமிழ்ச் சங்கம்' : 'Madurai Sangam'}
                </h3>
                <p className="text-xs text-slate-600 dark:text-gray-300 leading-relaxed font-sans">
                  {isTa 
                    ? 'நக்கீரர், கபிலர், பரணர், ஔவையார் உள்ளிட்ட 49 புலவர்கள் கூடி 1,850 ஆண்டுகள் மதுரையில் தமிழ் வளர்த்தனர். திருவள்ளுவரின் உலகப் பொதுமறையான திருக்குறள், எட்டுத்தொகை, பத்துப்பாட்டு மற்றும் சிலப்பதிகாரம் அரங்கேற்றப்பட்டன.'
                    : 'Convened at historic Madurai by Nakkeerar, Kapilar, Paranar, Avvaiyar, and 49 savants for 1,850 years under 49 kings, canonizing Thirukkural, Silappathikaram, Pathupattu, and Ettuthogai anthologies.'}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-gray-800 text-[11px] font-semibold text-[#8B1E26] dark:text-red-400 flex items-center justify-between">
                <span>{isTa ? 'தலைநகர்: மதுரை' : 'Capital: Madurai'}</span>
                <span>{isTa ? '1,850 ஆண்டுகள்' : '1,850 Years'}</span>
              </div>
            </div>

            {/* Modern Digital Sangam */}
            <div className="bg-gradient-to-br from-[#8B1E26] to-[#68141B] text-white border-2 border-amber-400 p-5 rounded-2xl shadow-xl flex flex-col justify-between group relative overflow-hidden">
              <div className="space-y-3 relative z-10">
                <div className="w-10 h-10 rounded-xl bg-amber-400 flex items-center justify-center text-slate-950 font-black">
                  <Globe className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-950 bg-amber-300 px-2 py-0.5 rounded">
                  {isTa ? 'நவீன டிஜிட்டல் சங்கம்' : 'Modern Digital Sangam'}
                </span>
                <h3 className="font-extrabold text-base text-white">
                  {isTa ? 'தமிழ் சங்கம் - தமிழ்நாடு' : 'Tamil Sangam Tamil Nadu'}
                </h3>
                <p className="text-xs text-gray-100 leading-relaxed font-sans">
                  {isTa 
                    ? 'தமிழ்நாட்டின் 38 மாவட்டங்களிலும் 23 பாசறைகள், உடனடி கியூஆர் உறுப்பினர் அடையாள அட்டை, பொது இணையச் சரிபார்ப்பு, ஓலைச்சுவடிகள் மின்னாக்கம் மற்றும் உலகளாவிய 25+ நாடுகளின் தமிழர் இணைப்பு.'
                    : 'Unifying all 38 districts with 23 specialized wings, instant digital ID cards, QR public verification, palm-leaf manuscript archives, and global diaspora networks across 25+ nations.'}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/20 text-[11px] font-bold text-amber-300 relative z-10 flex items-center justify-between">
                <span>{isTa ? 'செயல் எல்லை: 38 மாவட்டங்கள்' : 'Coverage: 38 Districts'}</span>
                <span>{isTa ? 'நிகழ்காலம்' : 'Present Era'}</span>
              </div>
            </div>

          </div>

          {/* Heritage Landmark Banner Card */}
          <div className="bg-white dark:bg-[#1E232B] rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-gray-800 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-4 rounded-2xl overflow-hidden aspect-[16/10] border-2 border-[#8B1E26]/20 shadow-md">
              <img 
                src="/hero-temple.jpg" 
                alt={isTa ? 'கோவில் கட்டடக்கலை' : 'Temple Architecture'} 
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="lg:col-span-8 space-y-3">
              <span className="text-xs font-extrabold text-[#8B1E26] dark:text-red-400 uppercase tracking-widest flex items-center gap-1.5">
                <Landmark className="w-4 h-4" />
                {isTa ? 'மதுரை பொற்றாமரைக் குளம் & சங்கப் பலகை' : 'Golden Lotus Pond & Sangam Assembly Seat'}
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-heading">
                {isTa ? 'சங்கப் பலகையில் அரங்கேறிய திருக்குறளும் உலகப் பெருமையும்' : 'The Consecration of Thirukkural on the Sacred Sangam Plank'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-300 leading-relaxed font-sans">
                {isTa 
                  ? 'மதுரை மீனாட்சி சுந்தரேஸ்வரர் திருக்கோவில் பொற்றாமரைக் குளத்தில் மிதந்த தெய்விகச் சங்கப் பலகையில் திருவள்ளுவரின் உலகப் பொதுமறையான திருக்குறள் அரங்கேற்றப்பட்டு அகில உலகிற்கும் ஒளியூட்டியது. அந்த வரலாற்று அறவழியைப் பின்பற்றி எமது சங்கம் சமத்துவம், மனிதநேயம், கல்வி விழிப்புணர்வு மற்றும் சமுதாய முன்னேற்றத்தை முன்னிறுத்துகிறது.'
                  : 'On the sacred Sangam plank floating in the Golden Lotus Pond of Madurai, saint Thiruvalluvar presented the universal ethical masterpiece Thirukkural. Drawing inspiration from that immortal wisdom, our trust champions social equality, literary preservation, and transparent public welfare.'}
              </p>
            </div>
          </div>

        </section>

        {/* ========================================================================= */}
        {/* 3. VISION, MISSION & CORE VALUES */}
        {/* ========================================================================= */}
        <section id="vision" className="space-y-8 scroll-mt-24">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 bg-[#FDF2F2] dark:bg-red-950/60 text-[#8B1E26] dark:text-red-400 border border-[#8B1E26]/20 text-xs font-extrabold px-3.5 py-1 rounded-full uppercase tracking-wider">
              <Compass className="w-3.5 h-3.5" />
              <span>{isTa ? 'கோட்பாடுகள் & வழிகாட்டல்' : 'Guiding Pillars'}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-heading">
              {isTa ? 'தொலைநோக்கு, குறிக்கோள் & அடிப்படைக் கொள்கைகள்' : 'Our Vision, Mission & Core Values'}
            </h2>
            <div className="w-20 h-1 bg-[#8B1E26] dark:bg-red-500 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Vision Card */}
            <div className="bg-white dark:bg-[#1E232B] border border-slate-200/80 dark:border-gray-800 hover:border-[#8B1E26] dark:hover:border-red-400 p-6 sm:p-7 rounded-3xl shadow-lg space-y-4 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-[#FDF2F2] dark:bg-red-950/60 border border-[#8B1E26]/20 flex items-center justify-center text-[#8B1E26] dark:text-red-400">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white font-heading">
                {isTa ? 'எமது தொலைநோக்கு' : 'Our Vision'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-300 leading-relaxed font-sans">
                {isTa 
                  ? 'உலகெங்கிலும் வாழும் தமிழர்களின் தொன்மையான மொழி, பண்பாடு மற்றும் உரிமைகளைப் பாதுகாத்து, இளைய தலைமுறையினரிடம் தமிழ் உணர்வை வளர்த்து, நவீன அறிவியல் மற்றும் தொழில்நுட்பக் களங்களில் தமிழ் மொழியை முதன்மை உலக மொழியாக உயர்த்துதல்.'
                  : 'To protect the ancient language, cultural identity, and social rights of Tamils worldwide, instill deep cultural pride in youth, and advance Tamil as a foremost global language in science, technology, and literature.'}
              </p>
              <ul className="space-y-2 pt-2 text-xs font-semibold text-slate-700 dark:text-gray-300">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#8B1E26] dark:text-red-400 shrink-0" />
                  <span>{isTa ? 'பண்டைய ஓலைச்சுவடிகள் மின்னாக்கம்' : 'Ancient manuscript preservation'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#8B1E26] dark:text-red-400 shrink-0" />
                  <span>{isTa ? '25+ நாடுகளில் உலகத் தமிழர் இணைப்பு' : 'Global network across 25+ nations'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#8B1E26] dark:text-red-400 shrink-0" />
                  <span>{isTa ? 'மாணவர்களுக்கு திருக்குறள் ஆய்வுப் பீடம்' : 'Thirukkural research chairs'}</span>
                </li>
              </ul>
            </div>

            {/* Mission Card */}
            <div className="bg-white dark:bg-[#1E232B] border border-slate-200/80 dark:border-gray-800 hover:border-[#8B1E26] dark:hover:border-red-400 p-6 sm:p-7 rounded-3xl shadow-lg space-y-4 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-[#FDF2F2] dark:bg-red-950/60 border border-[#8B1E26]/20 flex items-center justify-center text-[#8B1E26] dark:text-red-400">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white font-heading">
                {isTa ? 'எமது குறிக்கோள்' : 'Our Mission'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-300 leading-relaxed font-sans">
                {isTa 
                  ? 'தமிழ்நாட்டின் 38 மாவட்டங்களிலும் உள்ள கடைக்கோடி கிராமங்கள் வரை சென்று, 23 சிறப்புப் பாசறைகள் மூலம் கல்வி உதவிகள், இலவச மருத்துவ சேவைகள், இரத்த தான ஒருங்கிணைப்பு மற்றும் தன்னாட்சி சமூக அமைப்புகளை உருவாக்குதல்.'
                  : 'To mobilize grassroots welfare across every taluk and village in all 38 districts of Tamil Nadu, operating 23 specialized wings to provide free education coaching, 24/7 blood aid, and transparent community service.'}
              </p>
              <ul className="space-y-2 pt-2 text-xs font-semibold text-slate-700 dark:text-gray-300">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#8B1E26] dark:text-red-400 shrink-0" />
                  <span>{isTa ? '100% சரிபார்க்கப்பட்ட டிஜிட்டல் அட்டை' : '100% verified digital membership'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#8B1E26] dark:text-red-400 shrink-0" />
                  <span>{isTa ? '24 மணி நேர இரத்த தான உதவி மையம்' : '24/7 blood donor emergency desk'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#8B1E26] dark:text-red-400 shrink-0" />
                  <span>{isTa ? 'கிராமப்புற மாணவர் கல்வி உதவித்தொகை' : 'Rural student scholarships'}</span>
                </li>
              </ul>
            </div>

            {/* Core Values Card */}
            <div className="bg-white dark:bg-[#1E232B] border border-slate-200/80 dark:border-gray-800 hover:border-[#8B1E26] dark:hover:border-red-400 p-6 sm:p-7 rounded-3xl shadow-lg space-y-4 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-[#FDF2F2] dark:bg-red-950/60 border border-[#8B1E26]/20 flex items-center justify-center text-[#8B1E26] dark:text-red-400">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white font-heading">
                {isTa ? 'அடிப்படைக் கோட்பாடுகள்' : 'Core Values'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-300 leading-relaxed font-sans">
                {isTa 
                  ? '"யாதும் ஊரே யாவரும் கேளிர்" மற்றும் "பிறப்பொக்கும் எல்லா உயிர்க்கும்" என்ற சங்கத் தமிழ் முழக்கத்திற்கேற்ப, சாதி மதப் பிரிவினைகளுக்கு அப்பாற்பட்டு அனைத்து தமிழர்களையும் ஒரே குடும்பமாக இணைத்து, நேர்மை, வெளிப்படைத்தன்மை மற்றும் தன்னலமற்ற சேவையை நிலைநாட்டுதல்.'
                  : 'Inspired by the timeless Sangam maxims "Every land our town, every human our kin" and "All beings are born equal", uniting all Tamils beyond social divides through integrity, radical transparency, self-reliance, and compassionate service.'}
              </p>
              <ul className="space-y-2 pt-2 text-xs font-semibold text-slate-700 dark:text-gray-300">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#8B1E26] dark:text-red-400 shrink-0" />
                  <span>{isTa ? 'சாதி மத பேதமற்ற சமத்துவப் பார்வை' : 'Universal equality and human dignity'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#8B1E26] dark:text-red-400 shrink-0" />
                  <span>{isTa ? 'நிதி மற்றும் நிர்வாக வெளிப்படைத்தன்மை' : 'Audited financial transparency'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#8B1E26] dark:text-red-400 shrink-0" />
                  <span>{isTa ? 'தன்னலமற்ற பொதுநல அர்ப்பணிப்பு' : 'Selfless dedication to public welfare'}</span>
                </li>
              </ul>
            </div>

          </div>

        </section>

        {/* ========================================================================= */}
        {/* 4. 12 KEY STRATEGIC OBJECTIVES OF TAMIL SANGAM */}
        {/* ========================================================================= */}
        <section id="objectives" className="space-y-8 scroll-mt-24">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 bg-[#FDF2F2] dark:bg-red-950/60 text-[#8B1E26] dark:text-red-400 border border-[#8B1E26]/20 text-xs font-extrabold px-3.5 py-1 rounded-full uppercase tracking-wider">
              <Target className="w-3.5 h-3.5" />
              <span>{isTa ? 'முதன்மை இலக்குகள்' : 'Strategic Focus'}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-heading">
              {isTa ? 'தமிழ் சங்கத்தின் 12 முதன்மை நோக்கங்கள்' : '12 Core Objectives of Tamil Sangam'}
            </h2>
            <div className="w-20 h-1 bg-[#8B1E26] dark:bg-red-500 mx-auto rounded-full" />
            <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-300 leading-relaxed font-sans">
              {isTa 
                ? 'தமிழ் பண்பாட்டுப் பாதுகாப்பு, கல்வி வளர்ச்சி, இயற்கை வளம், மருத்துவம் மற்றும் சமூக சமத்துவத்தை முன்னிறுத்தி வகுக்கப்பட்ட 12 முதன்மை இலக்குகள்.'
                : '12 foundational pillars designed for cultural preservation, educational upliftment, ecology, healthcare, and progressive social justice.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[
              {
                icon: ScrollText,
                num: '01',
                titleTa: 'பண்டைய ஓலைச்சுவடிகள் மின்னாக்கம்',
                titleEn: 'Ancient Manuscript Digitization',
                descTa: 'பண்டைய தமிழ் ஓலைச்சுவடிகள், இலக்கண நூல்கள் மற்றும் இலக்கியப் பெட்டகங்களை உயர்தர டிஜிட்டல் ஆவணங்களாக மாற்றி அழியாமல் பாதுகாத்தல்.',
                descEn: 'Digitizing and preserving ancient palm-leaf manuscripts and classical literary treatises into high-resolution digital archives.'
              },
              {
                icon: Globe,
                num: '02',
                titleTa: 'அறிவியல் & கணிப்பொறியில் தமிழ்',
                titleEn: 'Tamil in Computing & AI',
                descTa: 'கணிப்பொறி மொழிபெயர்ப்பு, திறந்தநிலை தமிழ் செயற்கை நுண்ணறிவு மாதிரிகள், விக்கிபீடியா விரிவாக்கம் மற்றும் புதிய கலைச்சொற்கள் உருவாக்கம்.',
                descEn: 'Developing open-source Tamil natural language processing, AI datasets, computing terminology, and expanding Tamil digital resources.'
              },
              {
                icon: GraduationCap,
                num: '03',
                titleTa: 'கிராமப்புற மாணவர் கல்வி உதவி',
                titleEn: 'Rural Education & Scholarships',
                descTa: 'பொருளாதாரத்தில் பின்தங்கிய ஏழை எளிய மாணவர்களுக்கு கல்வி உதவித்தொகை, பள்ளிப் பொருட்கள் மற்றும் போட்டித் தேர்வுகளுக்கு இலவசப் பயிற்சி.',
                descEn: 'Providing educational sponsorships, essential study kits, and free residential coaching for civil service and government competitive exams.'
              },
              {
                icon: Heart,
                num: '04',
                titleTa: '24 மணி நேர இரத்த தானக் கட்டமைப்பு',
                titleEn: '24/7 Blood Donation Network',
                descTa: '38 மாவட்டங்களிலும் 24 மணி நேரமும் செயல்படும் அவசர இரத்த தான ஒருங்கிணைப்பு மையம் அமைத்து ஆபத்தான சூழலில் உயிர்களைக் காத்தல்.',
                descEn: 'Operating a 24/7 centralized emergency blood donation helpline across all 38 districts to instantly save lives during critical needs.'
              },
              {
                icon: Flame,
                num: '05',
                titleTa: 'சிலம்பம் & பாரம்பரிய வீரவிளையாட்டு',
                titleEn: 'Traditional Martial Arts Promotion',
                descTa: 'சிலம்பம், கபடி, களரி உள்ளிட்ட தமிழரின் பாரம்பரிய தற்காப்புக் கலைகளை இளைய தலைமுறையினரிடம் கொண்டு சென்று மாநில அளவிலான போட்டிகள் நடத்துதல்.',
                descEn: 'Revitalizing traditional martial sports including Silambam, Kabaddi, and Kalari among youth through state-level tournaments and training camps.'
              },
              {
                icon: TreePine,
                num: '06',
                titleTa: '100,000 நாட்டு மரக்கன்றுகள் நடுதல்',
                titleEn: '100,000 Native Tree Plantation',
                descTa: 'தமிழ்நாட்டின் சுற்றுச்சூழல் மற்றும் நிலத்தடி நீரைப் பாதுகாக்க ஆண்டுதோறும் 100,000 ஆலமரம், வேப்பமரம் உள்ளிட்ட நாட்டு மரக்கன்றுகளை நட்டு பராமரித்தல்.',
                descEn: 'Planting and nurturing 100,000 native tree saplings annually across Tamil Nadu to enhance green cover and protect groundwater levels.'
              },
              {
                icon: Stethoscope,
                num: '07',
                titleTa: 'பாரம்பரிய சித்த மருத்துவ நலம்',
                titleEn: 'Siddha & Herbal Healthcare',
                descTa: 'தமிழர்களின் பாரம்பரிய சித்த மருத்துவ முறை, இயற்கை மூலிகைகள் மற்றும் ஆரோக்கிய வாழ்க்கை முறை பற்றிய விழிப்புணர்வு முகாம்கள் நடத்துதல்.',
                descEn: 'Conducting rural wellness camps emphasizing indigenous Siddha medicine, herbal knowledge, and balanced holistic wellness traditions.'
              },
              {
                icon: HeartHandshake,
                num: '08',
                titleTa: 'மகளிர் தன்னாட்சி & சுயதொழில் பயிற்சி',
                titleEn: 'Women Empowerment & Self-Reliance',
                descTa: 'பெண்களுக்கு கைவினைப் பொருட்கள் தயாரிப்பு, தையல், சுயஉதவிக் குழுக்கள் உருவாக்கம் மற்றும் சட்ட விழிப்புணர்வு ஆலோசனைகள் வழங்குதல்.',
                descEn: 'Offering vocational handicraft training, self-help entrepreneurship mentorship, legal rights aid, and micro-business guidance for women.'
              },
              {
                icon: Compass,
                num: '09',
                titleTa: 'உழவர் வாழ்வாதாரம் & இயற்கை வேளாண்மை',
                titleEn: 'Farmer Welfare & Organic Agriculture',
                descTa: 'நஞ்சில்லா இயற்கை விவசாய முறை, பாரம்பரிய நாட்டு விதைகள் பாதுகாப்பு மற்றும் இடைத்தரகர்கள் இன்றி உழவர் விளைபொருட்களை சந்தைப்படுத்தும் வழிகாட்டல்.',
                descEn: 'Promoting organic farming, indigenous seed banks, water conservation, and establishing fair direct-to-consumer farmer markets.'
              },
              {
                icon: Scale,
                num: '10',
                titleTa: 'இலவச சட்ட ஆலோசனை மையம்',
                titleEn: 'Free Legal Aid & Social Justice',
                descTa: 'சமூகத்தில் நலிவடைந்த மக்களுக்கு இலவச சட்ட உதவிகள், மனித உரிமைப் பாதுகாப்பு மற்றும் அரசு நலத்திட்டங்களை பெற்றுத் தரும் வழிகாட்டல்.',
                descEn: 'Delivering pro-bono legal consultation, civil rights advocacy, consumer protection, and guidance for accessing government welfare schemes.'
              },
              {
                icon: Users,
                num: '11',
                titleTa: 'உலகத் தமிழர் கூட்டமைப்பு',
                titleEn: 'Global Tamil Diaspora Solidarity',
                descTa: 'மலேசியா, சிங்கப்பூர், இலங்கை, ஐரோப்பா, அமெரிக்கா உள்ளிட்ட 25+ நாடுகளில் இயங்கும் தமிழ்ச் சங்கங்களை ஒரே குடையின் கீழ் இணைத்தல்.',
                descEn: 'Fostering cultural and business connections with Tamil diaspora associations across 25+ countries including Singapore, Malaysia, and USA.'
              },
              {
                icon: Landmark,
                num: '12',
                titleTa: 'சாதி மத பேதமற்ற சமத்துவ சமுதாயம்',
                titleEn: 'Non-Sectarian Brotherhood',
                descTa: '"பிறப்பொக்கும் எல்லா உயிர்க்கும்" என்ற நெறியின்படி, சாதி, மத, அரசியல் பாகுபாடின்றி அனைத்து தமிழர்களையும் சகோதரத்துவத்துடன் ஒருங்கிணைத்தல்.',
                descEn: 'Championing absolute social equality and secular fraternity beyond caste, creed, and political lines under universal human brotherhood.'
              },
            ].map((obj, idx) => {
              const ObjIcon = obj.icon;
              return (
                <div 
                  key={idx}
                  className="bg-white dark:bg-[#1E232B] border border-slate-200/80 dark:border-gray-800 hover:border-[#8B1E26] dark:hover:border-red-400 p-5 rounded-2xl space-y-3 transition-all flex flex-col justify-between group shadow-sm hover:shadow-md hover:-translate-y-1"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-black text-[#8B1E26] dark:text-red-400 text-sm">{obj.num}</span>
                      <div className="w-8 h-8 rounded-lg bg-[#FDF2F2] dark:bg-red-950/60 border border-[#8B1E26]/20 flex items-center justify-center text-[#8B1E26] dark:text-red-400 group-hover:bg-[#8B1E26] group-hover:text-white transition-colors">
                        <ObjIcon className="w-4 h-4" />
                      </div>
                    </div>
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-sm font-heading">
                      {isTa ? obj.titleTa : obj.titleEn}
                    </h3>
                    <p className="text-[11px] text-slate-600 dark:text-gray-300 leading-relaxed font-sans">
                      {isTa ? obj.descTa : obj.descEn}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </section>

        {/* ========================================================================= */}
        {/* 5. HISTORIC TIMELINE & MILESTONES ROADMAP */}
        {/* ========================================================================= */}
        <section id="timeline" className="bg-white dark:bg-[#1E232B] rounded-3xl p-6 sm:p-10 border border-slate-200/80 dark:border-gray-800 shadow-xl space-y-8 scroll-mt-24">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="bg-[#8B1E26] text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
              {isTa ? 'வரலாற்றுச் சுவடுகள்' : 'Milestone Journey'}
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-heading">
              {isTa ? 'தமிழ் சங்கத்தின் வளர்ச்சி மைல்கற்கள்' : 'Key Milestones in Our Evolution'}
            </h2>
            <div className="w-20 h-1 bg-[#8B1E26] dark:bg-red-500 mx-auto rounded-full" />
            <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-300 leading-relaxed font-sans">
              {isTa 
                ? 'தொடக்கம் முதல் இன்றைய டிஜிட்டல் மறுமலர்ச்சி வரை தமிழ் சங்கம் அடைந்த வரலாற்று வெற்றிகளும் விரிவாக்கமும்.'
                : 'Key historical turning points from foundational trust registration to statewide digital transformation.'}
            </p>
          </div>

          <div className="relative border-l-2 border-[#8B1E26]/40 ml-4 sm:ml-8 pl-6 sm:pl-8 space-y-8">
            {[
              {
                year: '2018',
                titleTa: 'அறக்கட்டளை உருவாக்கம் & அரசு பதிவு',
                titleEn: 'Foundational Trust Registration',
                descTa: 'தமிழ்ப் பெருமக்கள் மற்றும் அறிஞர்கள் ஒன்றுகூடி இந்திய அறக்கட்டளைச் சட்டத்தின் கீழ் தமிழ் சங்கத்தை முறையாக பதிவு செய்தனர் (பதிவு எண்: TN-15-0042417).',
                descEn: 'Eminent scholars and community visionaries convened to officially register Tamil Sangam under the Indian Public Trust Act (Reg: TN-15-0042417).'
              },
              {
                year: '2020',
                titleTa: '38 மாவட்ட ஒருங்கிணைப்புக் குழுக்கள் அமைத்தல்',
                titleEn: 'Statewide 38 District Expansion',
                descTa: 'தமிழ்நாட்டின் 38 மாவட்டங்களிலும் மாவட்டச் செயலாளர்கள் மற்றும் ஒருங்கிணைப்பாளர்கள் நியமிக்கப்பட்டு மாநில அளவிலான கட்டமைப்பு விரிவுபடுத்தப்பட்டது.',
                descEn: 'District secretaries and coordinators appointed across all 38 districts of Tamil Nadu, establishing a unified grassroots administrative network.'
              },
              {
                year: '2021',
                titleTa: '23 துறைசார் சிறப்புப் பாசறைகள் தொடக்கம்',
                titleEn: 'Inauguration of 23 Specialized Wings',
                descTa: 'கல்வி, இளைஞர், மகளிர், தகவல் தொழில்நுட்பம், விவசாயம், மருத்துவம், சட்டம் உள்ளிட்ட 23 களப் பாசறைகள் அதிகாரப்பூர்வமாக தொடங்கப்பட்டன.',
                descEn: 'Formally launched 23 functional wings dedicated to education, youth, women, technology, agriculture, medical aid, and human rights.'
              },
              {
                year: '2022',
                titleTa: 'மத்திய அரசு 80G & 12A வரிவிலக்கு அங்கீகாரம்',
                titleEn: 'Income Tax 80G & 12A Certification',
                descTa: 'மத்திய வருமான வரித்துறையிடமிருந்து அறக்கட்டளைக்கு 80G மற்றும் 12A வரிவிலக்கு அங்கீகாரம் பெறப்பட்டு, நன்கொடையாளர்களுக்கு வரிவிலக்கு உறுதி செய்யப்பட்டது.',
                descEn: 'Accredited under Section 80G and 12A of the Income Tax Act, granting 50% tax deductions to donors and institutional contributors.'
              },
              {
                year: '2023',
                titleTa: 'உடனடி கியூஆர் டிஜிட்டல் உறுப்பினர் அட்டை அறிமுகம்',
                titleEn: 'Instant QR Digital Membership ID System',
                descTa: 'மொபைல் சரிபார்ப்பு மூலம் விண்ணப்பித்து நொடியில் கியூஆர் குறியீட்டுடன் கூடிய அதிகாரப்பூர்வ டிஜிட்டல் அடையாள அட்டை பெறும் அதிநவீன தொழில்நுட்பம் அறிமுகமானது.',
                descEn: 'Deployed automated digital membership infrastructure generating instant QR-verified identity cards with dual-sided print compatibility.'
              },
              {
                year: '2024',
                titleTa: '10,000+ உறுப்பினர்கள் & 24/7 இரத்த தான உதவி மையம்',
                titleEn: '10,000+ Members & 24/7 Blood Donation Desk',
                descTa: 'பத்தாயிரத்திற்கும் மேற்பட்ட சரிபார்க்கப்பட்ட உறுப்பினர்கள் இணைந்தனர்; 38 மாவட்டங்களிலும் 24 மணி நேர அவசர இரத்த தான ஒருங்கிணைப்பு மையம் வெற்றிகரமாக செயல்படத் தொடங்கியது.',
                descEn: 'Crossed 10,000 verified active members and operationalized the 24/7 emergency blood donation coordinator desk across Tamil Nadu.'
              },
              {
                year: '2025',
                titleTa: 'உலகத் தமிழ் இலக்கிய மாநாடு & டிஜிட்டல் நூலகம்',
                titleEn: 'World Tamil Literary Conclave & Digital Archive',
                descTa: '25 நாடுகளின் பிரதிநிதிகள் பங்கேற்ற உலகத் தமிழ் மாநாடு நடத்தப்பட்டதுடன், 50,000 பண்டைய தமிழ் நூல்கள் மற்றும் ஓலைச்சுவடிகள் மின்னாக்கம் செய்யப்பட்டன.',
                descEn: 'Convened international delegates from 25 nations and initiated large-scale digitization of over 50,000 rare Tamil literary manuscripts.'
              },
              {
                year: '2026',
                titleTa: 'கிளவுட் தளம் & கிராமப்புற இளைஞர் வளர்ச்சித் திட்டங்கள்',
                titleEn: 'Next-Gen Cloud Portal & Rural Youth Empowerment',
                descTa: 'நவீன கிளவுட் மேலாண்மை, பாதுகாப்பான ஆவணப் பெட்டகம், கிராமப்புற மாணவ உதவித்தொகை மற்றும் 100,000 மரக்கன்றுகள் நடும் திட்டம் முழுவீச்சில் தொடக்கம்.',
                descEn: 'Rolled out secure cloud infrastructure, encrypted member vault, expanded rural scholarship funds, and the 100,000 native tree plantation initiative.'
              },
            ].map((milestone, idx) => (
              <div key={idx} className="relative group">
                <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-[#8B1E26] border-2 border-white dark:border-[#1E232B] group-hover:scale-125 transition-transform" />
                <div className="bg-[#FAF8F5] dark:bg-slate-900 border border-slate-200/80 dark:border-gray-800 p-4 sm:p-5 rounded-2xl space-y-2 hover:border-[#8B1E26] transition-all">
                  <div className="flex items-center gap-3">
                    <span className="bg-[#8B1E26] text-white font-black px-2.5 py-0.5 rounded text-xs">
                      {milestone.year}
                    </span>
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-sm sm:text-base font-heading">
                      {isTa ? milestone.titleTa : milestone.titleEn}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-gray-300 leading-relaxed font-sans">
                    {isTa ? milestone.descTa : milestone.descEn}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </section>

        {/* ========================================================================= */}
        {/* 6. OPERATIONAL HIERARCHY & 4-TIER GOVERNANCE */}
        {/* ========================================================================= */}
        <section id="governance" className="space-y-8 scroll-mt-24">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="bg-[#FDF2F2] dark:bg-red-950/60 text-[#8B1E26] dark:text-red-400 border border-[#8B1E26]/20 text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider">
              {isTa ? 'நிர்வாக அடுக்குமுறை' : 'Organisational Hierarchy'}
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-heading">
              {isTa ? 'தமிழ் சங்கத்தின் 4 நிலை நிர்வாகக் கட்டமைப்பு' : '4-Tier Operational & Administrative Structure'}
            </h2>
            <div className="w-20 h-1 bg-[#8B1E26] dark:bg-red-500 mx-auto rounded-full" />
            <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-300 leading-relaxed font-sans">
              {isTa 
                ? 'மாநில தலைமை முதல் கடைக்கோடி கிராமம் வரை ஒவ்வொரு உறுப்பினரும் வெளிப்படைத்தன்மையுடன் இணைந்து பணியாற்ற வழிவகை செய்யும் ஜனநாயக நிர்வாக அமைப்பு.'
                : 'A democratic, transparent governance model connecting the State Secretariat directly to districts, taluks, and grassroots village panchayats.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Level 1: State */}
            <div className="bg-white dark:bg-[#1E232B] border border-slate-200/80 dark:border-gray-800 p-5 rounded-2xl space-y-3 text-center hover:border-[#8B1E26] dark:hover:border-red-400 transition-all flex flex-col justify-between shadow-md">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#8B1E26] text-white font-black flex items-center justify-center mx-auto text-sm shadow-md">
                  1
                </div>
                <span className="text-[10px] font-black uppercase text-[#8B1E26] dark:text-red-400 bg-[#FDF2F2] dark:bg-red-950/60 px-2 py-0.5 rounded">
                  {isTa ? 'நிலை 1: மாநிலம்' : 'Tier 1: State'}
                </span>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  {isTa ? 'மாநில தலைமை செயற்குழு' : 'State Executive Council'}
                </h3>
                <p className="text-xs text-slate-600 dark:text-gray-300 leading-relaxed font-sans">
                  {isTa 
                    ? 'கொள்கை முடிவுகள், சட்டதிட்டங்கள், 38 மாவட்ட நிர்வாகிகள் நியமனம், நிதி தணிக்கை மற்றும் மாநில அளவிலான மாநாடுகளை நடத்துதல்.'
                    : 'Statewide policy directives, constitutional governance, district appointments, financial audits, and annual state conclaves.'}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-gray-800 text-[11px] font-semibold text-[#8B1E26] dark:text-red-400">
                {isTa ? 'தலைமைச் செயலகம்' : 'Central Secretariat'}
              </div>
            </div>

            {/* Level 2: District */}
            <div className="bg-white dark:bg-[#1E232B] border border-slate-200/80 dark:border-gray-800 p-5 rounded-2xl space-y-3 text-center hover:border-[#8B1E26] dark:hover:border-red-400 transition-all flex flex-col justify-between shadow-md">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#8B1E26] text-white font-black flex items-center justify-center mx-auto text-sm shadow-md">
                  2
                </div>
                <span className="text-[10px] font-black uppercase text-[#8B1E26] dark:text-red-400 bg-[#FDF2F2] dark:bg-red-950/60 px-2 py-0.5 rounded">
                  {isTa ? 'நிலை 2: மாவட்டம்' : 'Tier 2: District'}
                </span>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  {isTa ? '38 மாவட்டக் குழுக்கள்' : '38 District Councils'}
                </h3>
                <p className="text-xs text-slate-600 dark:text-gray-300 leading-relaxed font-sans">
                  {isTa 
                    ? 'மாவட்ட அளவிலான பொதுக்குழு கூட்டங்கள், உறுப்பினர் சான்றிதழ் விநியோகம், சமூக நல முகாம்கள் மற்றும் இரத்த தான முகாம்கள் ஒருங்கிணைப்பு.'
                    : 'District meetings, member verification drives, district welfare camps, and local emergency blood donation coordination.'}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-gray-800 text-[11px] font-semibold text-[#8B1E26] dark:text-red-400">
                {isTa ? '38 மாவட்டங்கள்' : '38 Districts'}
              </div>
            </div>

            {/* Level 3: Taluk */}
            <div className="bg-white dark:bg-[#1E232B] border border-slate-200/80 dark:border-gray-800 p-5 rounded-2xl space-y-3 text-center hover:border-[#8B1E26] dark:hover:border-red-400 transition-all flex flex-col justify-between shadow-md">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#8B1E26] text-white font-black flex items-center justify-center mx-auto text-sm shadow-md">
                  3
                </div>
                <span className="text-[10px] font-black uppercase text-[#8B1E26] dark:text-red-400 bg-[#FDF2F2] dark:bg-red-950/60 px-2 py-0.5 rounded">
                  {isTa ? 'நிலை 3: வட்டம்' : 'Tier 3: Taluk'}
                </span>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  {isTa ? '314 வட்டாரப் பிரிவுகள்' : '314 Taluk Units'}
                </h3>
                <p className="text-xs text-slate-600 dark:text-gray-300 leading-relaxed font-sans">
                  {isTa 
                    ? 'வட்டார அளவில் உள்ள கல்வி நிலையங்கள், கல்லூரிகள் மற்றும் பொது நிறுவனங்களுடன் இணைந்து இளைஞர் விழிப்புணர்வு கூட்டங்கள் நடத்துதல்.'
                    : 'Engagement with taluk academic institutions, colleges, and local community halls for youth training and cultural events.'}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-gray-800 text-[11px] font-semibold text-[#8B1E26] dark:text-red-400">
                {isTa ? '314 வட்டாரங்கள்' : '314 Taluks'}
              </div>
            </div>

            {/* Level 4: Village/Ward */}
            <div className="bg-white dark:bg-[#1E232B] border border-slate-200/80 dark:border-gray-800 p-5 rounded-2xl space-y-3 text-center hover:border-[#8B1E26] dark:hover:border-red-400 transition-all flex flex-col justify-between shadow-md">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#8B1E26] text-white font-black flex items-center justify-center mx-auto text-sm shadow-md">
                  4
                </div>
                <span className="text-[10px] font-black uppercase text-[#8B1E26] dark:text-red-400 bg-[#FDF2F2] dark:bg-red-950/60 px-2 py-0.5 rounded">
                  {isTa ? 'நிலை 4: கிராமம் / வார்டு' : 'Tier 4: Village & Ward'}
                </span>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  {isTa ? '12,500+ கிராம & வார்டு பாசறைகள்' : '12,500+ Grassroots Units'}
                </h3>
                <p className="text-xs text-slate-600 dark:text-gray-300 leading-relaxed font-sans">
                  {isTa 
                    ? 'கடைக்கோடி கிராம மக்களிடம் நேரடி சேவை, அவசர இரத்த தான உதவி, மரம் நடும் பணிகள் மற்றும் புதிய உறுப்பினர் சேர்க்கைப் பணிகள்.'
                    : 'Direct village service, emergency blood donor dispatch, community tree plantations, and new member on-boarding.'}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-gray-800 text-[11px] font-semibold text-[#8B1E26] dark:text-red-400">
                {isTa ? 'கிராம ஊராட்சிகள்' : 'Village Panchayats'}
              </div>
            </div>

          </div>

          {/* Core Leadership Roles Breakdown */}
          <div className="bg-white dark:bg-[#1E232B] border border-slate-200/80 dark:border-gray-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-base sm:text-lg font-heading flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#8B1E26] dark:text-red-400" />
              <span>{isTa ? 'மாநில தலைமைப் பொறுப்புகள்' : 'Key State Leadership Positions'}</span>
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
              {[
                {
                  roleTa: 'மாநிலத் தலைவர்',
                  roleEn: 'State President',
                  descTa: 'அமைப்பின் முதன்மை வழிகாட்டி மற்றும் தலைமை நிர்வாகப் பொறுப்பாளர்.',
                  descEn: 'Principal executive guide and constitutional head of the trust.'
                },
                {
                  roleTa: 'மாநிலப் பொதுச் செயலாளர்',
                  roleEn: 'State General Secretary',
                  descTa: '38 மாவட்டங்கள் மற்றும் 23 பாசறைகளின் நிர்வாக ஒருங்கிணைப்பு.',
                  descEn: 'Administrative oversight across 38 districts and 23 wings.'
                },
                {
                  roleTa: 'மாநிலப் பொருளாளர்',
                  roleEn: 'State Treasurer',
                  descTa: 'அறக்கட்டளையின் நிதி மேலாண்மை, தணிக்கை மற்றும் 80G ரசீது விநியோகம்.',
                  descEn: 'Financial governance, statutory audit management, and 80G oversight.'
                },
                {
                  roleTa: 'முதன்மை ஒருங்கிணைப்பாளர்',
                  roleEn: 'Chief State Coordinator',
                  descTa: 'மாநில அளவிலான மாநாடுகள், முகாம்கள் மற்றும் நிகழ்ச்சிகள் திட்டமிடல்.',
                  descEn: 'Planning statewide conclaves, awareness campaigns, and public rallies.'
                },
                {
                  roleTa: 'தலைமை சட்ட ஆலோசகர்',
                  roleEn: 'Chief Legal Counsel',
                  descTa: 'அறக்கட்டளையின் சட்ட விவகாரங்கள் மற்றும் ஏழை எளியோருக்கான சட்ட உதவி.',
                  descEn: 'Trust legal affairs, regulatory compliance, and pro-bono aid wings.'
                },
                {
                  roleTa: 'தலைமை மக்கள் தொடர்பு அலுவலர்',
                  roleEn: 'Chief Public Relations Officer',
                  descTa: 'ஊடகத் தொடர்புகள், அதிகாரப்பூர்வ அறிக்கைகள் மற்றும் செய்தி வெளியீடு.',
                  descEn: 'Press releases, media relations, and official trust communications.'
                },
              ].map((ldr, idx) => (
                <div key={idx} className="bg-[#FAF8F5] dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200/80 dark:border-gray-800 space-y-1">
                  <p className="font-extrabold text-[#8B1E26] dark:text-amber-400 text-xs">
                    {isTa ? ldr.roleTa : ldr.roleEn}
                  </p>
                  <p className="text-[11px] text-slate-600 dark:text-gray-300 leading-relaxed font-sans">
                    {isTa ? ldr.descTa : ldr.descEn}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </section>

        {/* ========================================================================= */}
        {/* 7. THE 23 SPECIALIZED WINGS (PASARAI) */}
        {/* ========================================================================= */}
        <section id="wings" className="space-y-8 scroll-mt-24">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 bg-[#FDF2F2] dark:bg-red-950/60 text-[#8B1E26] dark:text-red-400 border border-[#8B1E26]/20 text-xs font-extrabold px-3.5 py-1 rounded-full uppercase tracking-wider">
              <Layers className="w-3.5 h-3.5" />
              <span>{isTa ? '23 பாசறைகளின் கட்டமைப்பு' : '23 Specialized Wings'}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-heading">
              {isTa ? 'சமூகப் பணிகள் & பாசறைகளின் 6 முதன்மைக் களங்கள்' : 'Six Core Domains of Community Action & 23 Wings'}
            </h2>
            <div className="w-20 h-1 bg-[#8B1E26] dark:bg-red-500 mx-auto rounded-full" />
            <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-300 leading-relaxed font-sans">
              {isTa 
                ? 'தமிழ் சங்கத்தின் 23 சிறப்புப் பாசறைகளும் சமுதாயத்தின் ஒவ்வொரு துறையிலும் ஆக்கப்பூர்வமான மாற்றத்தை ஏற்படுத்த 6 முதன்மைப் பிரிவுகளாக ஒருங்கிணைக்கப்பட்டு செயல்படுகின்றன.'
                : 'Our 23 specialized Pasarai wings operate across 6 strategic domains ensuring comprehensive social upliftment, cultural revival, and educational empowerment.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Cluster 1: Education & Literature */}
            <div className="bg-white dark:bg-[#1E232B] border border-slate-200/80 dark:border-gray-800 hover:border-[#8B1E26] dark:hover:border-red-400 p-6 rounded-3xl shadow-lg space-y-3.5 transition-all">
              <div className="w-11 h-11 rounded-xl bg-[#FDF2F2] dark:bg-red-950/60 border border-[#8B1E26]/20 flex items-center justify-center text-[#8B1E26] dark:text-red-400">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading">
                {isTa ? '1. கல்வி & இலக்கியக் களம்' : '1. Education & Literature Wings'}
              </h3>
              <p className="text-xs text-slate-600 dark:text-gray-300 leading-relaxed font-sans">
                {isTa 
                  ? 'பண்டைய தமிழ் ஓலைச்சுவடிகளை மின்னாக்கம் செய்தல், மாணவர்களுக்கு திருக்குறள் போட்டிகள் நடத்துதல் மற்றும் போட்டித் தேர்வுகளுக்கு இலவச வழிகாட்டல் வழங்குதல்.'
                  : 'Digitization of ancient palm-leaf manuscripts, statewide student Thirukkural symposiums, and comprehensive study materials for competitive exams.'}
              </p>
              <div className="pt-2 border-t border-slate-100 dark:border-gray-800 text-[11px] font-semibold text-[#8B1E26] dark:text-amber-400">
                {isTa 
                  ? 'பாசறைகள்: கல்விப் பாசறை • இலக்கியப் பாசறை • கலை & பண்பாட்டுப் பாசறை • ஆராய்ச்சிப் பாசறை' 
                  : 'Wings: Education Wing • Literature Wing • Art & Culture Wing • Research Wing'}
              </div>
            </div>

            {/* Cluster 2: Youth & Sports */}
            <div className="bg-white dark:bg-[#1E232B] border border-slate-200/80 dark:border-gray-800 hover:border-[#8B1E26] dark:hover:border-red-400 p-6 rounded-3xl shadow-lg space-y-3.5 transition-all">
              <div className="w-11 h-11 rounded-xl bg-[#FDF2F2] dark:bg-red-950/60 border border-[#8B1E26]/20 flex items-center justify-center text-[#8B1E26] dark:text-red-400">
                <Flag className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading">
                {isTa ? '2. இளைஞர் & விளையாட்டுப் பாசறைகள்' : '2. Youth & Traditional Sports Wings'}
              </h3>
              <p className="text-xs text-slate-600 dark:text-gray-300 leading-relaxed font-sans">
                {isTa 
                  ? 'இளைஞர்களுக்கு தலைமைத்துவப் பயிற்சிகள், சிலம்பம், கபடி போன்ற பாரம்பரிய விளையாட்டுகளுக்கு ஊக்கம் மற்றும் இளைஞர் திறன் மேம்பாட்டு முகாம்கள்.'
                  : 'Empowering young leaders through skill workshops, job mentorship, and revitalizing traditional martial arts including Silambam and Kabaddi.'}
              </p>
              <div className="pt-2 border-t border-slate-100 dark:border-gray-800 text-[11px] font-semibold text-[#8B1E26] dark:text-amber-400">
                {isTa 
                  ? 'பாசறைகள்: இளைஞர் பாசறை • மாணவர் பாசறை • விளையாட்டுப் பாசறை • சிலம்பம் & களரி பாசறை' 
                  : 'Wings: Youth Wing • Student Wing • Traditional Sports Wing • Martial Arts Wing'}
              </div>
            </div>

            {/* Cluster 3: Women Empowerment */}
            <div className="bg-white dark:bg-[#1E232B] border border-slate-200/80 dark:border-gray-800 hover:border-[#8B1E26] dark:hover:border-red-400 p-6 rounded-3xl shadow-lg space-y-3.5 transition-all">
              <div className="w-11 h-11 rounded-xl bg-[#FDF2F2] dark:bg-red-950/60 border border-[#8B1E26]/20 flex items-center justify-center text-[#8B1E26] dark:text-red-400">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading">
                {isTa ? '3. மகளிர் & சமூக நலப் பாசறைகள்' : '3. Women Empowerment & Social Welfare'}
              </h3>
              <p className="text-xs text-slate-600 dark:text-gray-300 leading-relaxed font-sans">
                {isTa 
                  ? 'பெண்களுக்கு சுயதொழில் பயிற்சிகள், பெண்களுக்கான சட்ட விழிப்புணர்வு முகாம்கள், மகளிர் தொழில்முனைவோர் ஆலோசனை மற்றும் முதியோர், மாற்றுத்திறனாளிகள் நல ஆதரவு.'
                  : 'Fostering financial self-reliance through vocational craft workshops, legal rights awareness, health seminars, and senior citizen and disabled welfare.'}
              </p>
              <div className="pt-2 border-t border-slate-100 dark:border-gray-800 text-[11px] font-semibold text-[#8B1E26] dark:text-amber-400">
                {isTa 
                  ? 'பாசறைகள்: மகளிர் பாசறை • தாய்மை நலப் பாசறை • முதியோர் ஆதரவுப் பாசறை • மாற்றுத்திறனாளிகள் நலப் பாசறை' 
                  : 'Wings: Women Wing • Maternal Care Wing • Senior Care Wing • Differently-Abled Wing'}
              </div>
            </div>

            {/* Cluster 4: Agriculture & Environment */}
            <div className="bg-white dark:bg-[#1E232B] border border-slate-200/80 dark:border-gray-800 hover:border-[#8B1E26] dark:hover:border-red-400 p-6 rounded-3xl shadow-lg space-y-3.5 transition-all">
              <div className="w-11 h-11 rounded-xl bg-[#FDF2F2] dark:bg-red-950/60 border border-[#8B1E26]/20 flex items-center justify-center text-[#8B1E26] dark:text-red-400">
                <TreePine className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading">
                {isTa ? '4. விவசாயம் & சுற்றுச்சூழல் பாசறைகள்' : '4. Agriculture & Ecology Wings'}
              </h3>
              <p className="text-xs text-slate-600 dark:text-gray-300 leading-relaxed font-sans">
                {isTa 
                  ? 'இயற்கை விவசாய முறைக்கான விழிப்புணர்வு, நதிநீர் மற்றும் ஏரி குளங்கள் பாதுகாப்பு பிரச்சாரங்கள் மற்றும் ஆண்டுதோறும் 100,000 மரக்கன்றுகள் நடும் பசுமைப் பணிகள்.'
                  : 'Promoting organic farming methodologies, waterbody rejuvenation initiatives, animal welfare, and planting over 100,000 native tree saplings every year.'}
              </p>
              <div className="pt-2 border-t border-slate-100 dark:border-gray-800 text-[11px] font-semibold text-[#8B1E26] dark:text-amber-400">
                {isTa 
                  ? 'பாசறைகள்: உழவர் பாசறை • சுற்றுச்சூழல் பாசறை • நீர்நிலைகள் பாதுகாப்புப் பாசறை • விலங்கு நலப் பாசறை' 
                  : 'Wings: Farmers Wing • Green Ecology Wing • Waterbodies Wing • Animal Welfare Wing'}
              </div>
            </div>

            {/* Cluster 5: Healthcare & Blood Aid */}
            <div className="bg-white dark:bg-[#1E232B] border border-slate-200/80 dark:border-gray-800 hover:border-[#8B1E26] dark:hover:border-red-400 p-6 rounded-3xl shadow-lg space-y-3.5 transition-all">
              <div className="w-11 h-11 rounded-xl bg-[#FDF2F2] dark:bg-red-950/60 border border-[#8B1E26]/20 flex items-center justify-center text-[#8B1E26] dark:text-red-400">
                <Stethoscope className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading">
                {isTa ? '5. மருத்துவம் & அவசர உதவி மையங்கள்' : '5. Healthcare & Emergency Aid Wings'}
              </h3>
              <p className="text-xs text-slate-600 dark:text-gray-300 leading-relaxed font-sans">
                {isTa 
                  ? '38 மாவட்டங்களிலும் 24 மணி நேர இரத்த தான ஒருங்கிணைப்பு, கிராமப்புற இலவச மருத்துவ முகாம்கள், சித்த மருத்துவ விழிப்புணர்வு மற்றும் பேரிடர் நிவாரணப் பணிகள்.'
                  : 'Maintaining a 24/7 emergency blood donation coordinator desk across 38 districts, rural medical camps, Siddha awareness, and disaster relief aid.'}
              </p>
              <div className="pt-2 border-t border-slate-100 dark:border-gray-800 text-[11px] font-semibold text-[#8B1E26] dark:text-amber-400">
                {isTa 
                  ? 'பாசறைகள்: மருத்துவப் பாசறை • இரத்த தானக் கட்டமைப்பு • சித்த மருத்துவப் பாசறை • பேரிடர் மீட்புப் பாசறை' 
                  : 'Wings: Medical Wing • Blood Desk Network • Siddha Healthcare Wing • Disaster Relief Wing'}
              </div>
            </div>

            {/* Cluster 6: Technology & Global Network */}
            <div className="bg-white dark:bg-[#1E232B] border border-slate-200/80 dark:border-gray-800 hover:border-[#8B1E26] dark:hover:border-red-400 p-6 rounded-3xl shadow-lg space-y-3.5 transition-all">
              <div className="w-11 h-11 rounded-xl bg-[#FDF2F2] dark:bg-red-950/60 border border-[#8B1E26]/20 flex items-center justify-center text-[#8B1E26] dark:text-red-400">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading">
                {isTa ? '6. தகவல் தொழில்நுட்பம், சட்டம் & உலகத் தமிழர்' : '6. IT, Legal & Global Diaspora Wings'}
              </h3>
              <p className="text-xs text-slate-600 dark:text-gray-300 leading-relaxed font-sans">
                {isTa 
                  ? 'தமிழ் கணினி வளர்ச்சி, தமிழ் விக்கிபீடியா விரிவாக்கம், இலவச சட்ட ஆலோசனை மற்றும் 25+ வெளிநாட்டுத் தமிழ்ச் சங்கங்களுடன் இணைப்பு.'
                  : 'Advancing Tamil language processing, pro-bono human rights legal consultation, and international ties with Tamil societies in 25+ nations.'}
              </p>
              <div className="pt-2 border-t border-slate-100 dark:border-gray-800 text-[11px] font-semibold text-[#8B1E26] dark:text-amber-400">
                {isTa 
                  ? 'பாசறைகள்: தொழில்நுட்பப் பாசறை • சட்டப் பாசறை • உலகத் தமிழர் பாசறை' 
                  : 'Wings: IT & Tech Wing • Legal Aid Wing • Global Diaspora Wing'}
              </div>
            </div>

          </div>

        </section>

        {/* ========================================================================= */}
        {/* 8. ANNUAL FLAGSHIP EVENTS & CULTURAL CELEBRATIONS */}
        {/* ========================================================================= */}
        <section id="events" className="bg-white dark:bg-[#1E232B] rounded-3xl p-6 sm:p-10 border border-slate-200/80 dark:border-gray-800 shadow-xl space-y-8 scroll-mt-24">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="bg-[#8B1E26] text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
              {isTa ? 'ஆண்டு விழாக்கள்' : 'Annual Flagship Events'}
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-heading">
              {isTa ? 'தமிழ் சங்கத்தின் முக்கிய 6 ஆண்டு நிகழ்வுகள்' : 'Six Grand Annual Conclaves & Celebrations'}
            </h2>
            <div className="w-20 h-1 bg-[#8B1E26] dark:bg-red-500 mx-auto rounded-full" />
            <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-300 leading-relaxed font-sans">
              {isTa 
                ? 'தமிழ்நாட்டின் கலாச்சாரத்தைப் பறைசாற்றவும், சமுதாய நலனை மேம்படுத்தவும் ஆண்டுதோறும் மாநில அளவில் நடத்தப்படும் முதன்மை விழாக்கள்.'
                : 'Statewide flagship celebrations organized annually to uphold heritage, sportsmanship, literature, and social service.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                monthTa: 'தை மாதம் (ஜனவரி)',
                monthEn: 'January (Thai Month)',
                titleTa: 'தைப்பொங்கல் & தமிழர் பண்பாட்டுத் திருவிழா',
                titleEn: 'Thai Pongal & Heritage Grand Festival',
                descTa: 'உழவர் பெருவிழா, பாரம்பரிய சிலம்பாட்ட அரங்கேற்றம், நாட்டுப்புறக் கலை நிகழ்ச்சிகள் மற்றும் கிராமிய விளையாட்டுகள்.',
                descEn: 'Honoring agrarian heritage, folk dance recitals, traditional Silambam exhibitions, and traditional sports meets.'
              },
              {
                monthTa: 'சித்திரை மாதம் (ஏப்ரல்)',
                monthEn: 'April (Chithirai Month)',
                titleTa: 'உலகத் தமிழ் இலக்கிய மாநாடு & திருக்குறள் அரங்கம்',
                titleEn: 'World Tamil Literary & Thirukkural Assembly',
                descTa: 'சர்வதேசத் தமிழறிஞர்கள் பங்கேற்கும் ஆய்வுக்கட்டுரை வாசிப்பு, கவியரங்கம் மற்றும் பள்ளி மாணவர்களுக்கு திருக்குறள் ஒப்புவித்தல் போட்டிகள்.',
                descEn: 'Scholarly paper presentations with international academics, poetic symposia, and statewide student Thirukkural recitation awards.'
              },
              {
                monthTa: 'ஆடி மாதம் (ஜூலை)',
                monthEn: 'July (Aadi Month)',
                titleTa: '100,000 நாட்டு மரக்கன்றுகள் நடும் பசுமை விழா',
                titleEn: '100,000 Native Trees Green Plantation Drive',
                descTa: '38 மாவட்டங்களிலும் ஒரே நாளில் நதிநீர்ப் படுகைகள், பள்ளி வளாகங்கள் மற்றும் பொது இடங்களில் மரக்கன்றுகள் நடும் மக்கள் இயக்கம்.',
                descEn: 'Statewide ecological mobilization planting native neem and banyan saplings along riverbanks, public parks, and schools.'
              },
              {
                monthTa: 'புரட்டாசி மாதம் (செப்டம்பர்)',
                monthEn: 'September (Purattasi Month)',
                titleTa: 'மாநில அளவிலான சிலம்பம் & களரி சாம்பியன்ஷிப்',
                titleEn: 'State Silambam & Martial Arts Championship',
                descTa: 'ஆயிரக்கணக்கான வீரர் வீராங்கனைகள் பங்கேற்கும் மாநில தழுவிய சிலம்பம், வாள்வீச்சு, சுருள்வாள் மற்றும் களரி போட்டிகள்.',
                descEn: 'Thousands of young athletes competing across age categories in traditional stick fighting, swordcraft, and self-defense martial arts.'
              },
              {
                monthTa: 'ஐப்பசி மாதம் (அக்டோபர்)',
                monthEn: 'October (Aippasi Month)',
                titleTa: 'மாபெரும் அவசர இரத்த தான முகாம்கள்',
                titleEn: 'Statewide Mega Blood Donation Drives',
                descTa: 'அரசு தலைமை மருத்துவமனைகளுடன் இணைந்து 38 மாவட்டங்களிலும் பல்லாயிரக்கணக்கான அலகுகள் இரத்தம் சேகரிக்கும் மாபெரும் முகாம்.',
                descEn: 'Organized in collaboration with government hospital blood banks, mobilizing thousands of voluntary life-saving blood units.'
              },
              {
                monthTa: 'மார்கழி மாதம் (டிசம்பர்)',
                monthEn: 'December (Margazhi Month)',
                titleTa: 'தமிழ் கணிப்பொறி & ஏஐ தொழில்நுட்பக் கருத்தரங்கம்',
                titleEn: 'Tamil Computing & AI Technology Conclave',
                descTa: 'மென்பொருள் பொறியாளர்கள், மாணவர்கள் மற்றும் ஆராய்ச்சியாளர்கள் கூடி தமிழ் செயற்கை நுண்ணறிவு மற்றும் மொழி மாதிரிகள் உருவாக்குதல்.',
                descEn: 'Tech hackathon convening engineers, researchers, and students to build open-source Tamil NLP tools and AI solutions.'
              },
            ].map((evt, idx) => (
              <div 
                key={idx} 
                className="bg-[#FAF8F5] dark:bg-slate-900 border border-slate-200/80 dark:border-gray-800 hover:border-[#8B1E26] p-5 rounded-2xl space-y-3 transition-all flex flex-col justify-between group shadow-sm hover:shadow-md"
              >
                <div className="space-y-2">
                  <span className="text-[10px] font-black uppercase text-[#8B1E26] dark:text-red-400 bg-[#FDF2F2] dark:bg-red-950/60 px-2.5 py-1 rounded inline-flex items-center gap-1.5">
                    <Calendar className="w-3 h-3 text-[#8B1E26] dark:text-red-400" />
                    {isTa ? evt.monthTa : evt.monthEn}
                  </span>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-sm sm:text-base font-heading">
                    {isTa ? evt.titleTa : evt.titleEn}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-gray-300 leading-relaxed font-sans">
                    {isTa ? evt.descTa : evt.descEn}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </section>

        {/* ========================================================================= */}
        {/* 9. CODE OF CONDUCT & ETHICS FOR MEMBERS */}
        {/* ========================================================================= */}
        <section id="ethics" className="space-y-8 scroll-mt-24">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="bg-[#FDF2F2] dark:bg-red-950/60 text-[#8B1E26] dark:text-red-400 border border-[#8B1E26]/20 text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider">
              {isTa ? 'ஒழுக்க நெறிமுறைகள்' : 'Code of Ethics'}
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-heading">
              {isTa ? 'உறுப்பினர்களுக்கான 8 ஒழுக்கக் கோட்பாடுகள்' : '8 Pillars of Member Conduct & Integrity'}
            </h2>
            <div className="w-20 h-1 bg-[#8B1E26] dark:bg-red-500 mx-auto rounded-full" />
            <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-300 leading-relaxed font-sans">
              {isTa 
                ? 'தமிழ் சங்கத்தின் உறுப்பினராக இணைந்த ஒவ்வொருவரும் காக்க வேண்டிய சமூகப் பொறுப்புணர்வும் உன்னத நற்பண்புகளும்.'
                : 'Essential ethical standards and civic responsibilities expected of every registered Tamil Sangam member.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            {[
              {
                num: '01',
                titleTa: 'மொழி & பண்பாட்டு மரியாதை',
                titleEn: 'Linguistic & Cultural Respect',
                descTa: 'தமிழ் மொழியின் மாண்பையும், பண்டைய சங்க இலக்கிய அறநெறிகளையும் போற்றி கண்ணியத்துடன் நடந்துகொள்ளுதல்.',
                descEn: 'Upholding classical Tamil literary values, respectful conduct, and linguistic dignity in all forums.'
              },
              {
                num: '02',
                titleTa: 'சாதி மத பாகுபாடின்மை',
                titleEn: 'Strict Secular Harmony',
                descTa: 'சாதி, மத, அரசியல் வேறுபாடுகளுக்கு முற்றிலும் இடமளிக்காமல் சமத்துவத்துடன் சகோதரத்துவத்தை நிலைநாட்டுதல்.',
                descEn: 'Strict neutrality beyond caste, religious, and political affiliations, embracing universal fraternity.'
              },
              {
                num: '03',
                titleTa: 'தன்னலமற்ற மக்கள் சேவை',
                titleEn: 'Selfless Community Service',
                descTa: 'தனிப்பட்ட ஆதாயங்களின்றி, நலிந்த மக்களுக்கு கல்வி, மருத்துவம், இரத்த தானம் மற்றும் பேரிடர் உதவிகளை வழங்குதல்.',
                descEn: 'Serving marginalized citizens in education, healthcare, and emergency aid without personal motive.'
              },
              {
                num: '04',
                titleTa: 'நிதி & நிர்வாக நேர்மை',
                titleEn: 'Financial & Moral Integrity',
                descTa: 'அறக்கட்டளையின் நன்கொடைகள் மற்றும் உறுப்பினர் விவகாரங்களில் நூறு சதவீதம் வெளிப்படைத்தன்மையைக் கடைபிடித்தல்.',
                descEn: 'Maintaining 100% honesty, audit transparency, and ethical handling in all community and trust finances.'
              },
              {
                num: '05',
                titleTa: 'டிஜிட்டல் அட்டையின் கண்ணியம்',
                titleEn: 'Dignified Use of Credentials',
                descTa: 'அரசு பதிவு பெற்ற அடையாள அட்டையை சட்டவிரோத செயல்களுக்குப் பயன்படுத்தாமல் நற்பெயரைக் காத்தல்.',
                descEn: 'Safeguarding official membership credentials against misuse and upholding organizational honor.'
              },
              {
                num: '06',
                titleTa: 'சமூக ஒற்றுமை & நல்லிணக்கம்',
                titleEn: 'Social Harmony & Solidarity',
                descTa: 'சமூக அமைதிக்கு குந்தகம் விளைவிக்கும் எவ்வித பிரிவினைவாத நடவடிக்கைகளிலும் ஈடுபடாமல் ஒற்றுமையை வளர்த்தல்.',
                descEn: 'Fostering peaceful coexistence and constructive community collaboration without divisive behavior.'
              },
              {
                num: '07',
                titleTa: 'வன்முறையற்ற அறநெறி வழிமுறை',
                titleEn: 'Commitment to Non-Violence',
                descTa: 'அனைத்து பிரச்சனைகளுக்கும் பேச்சுவார்த்தை, சட்டரீதியான அணுகுமுறை மற்றும் அமைதியான அறவழி முறைகளையே பின்பற்றுதல்.',
                descEn: 'Resolving disputes strictly through peaceful dialogue, constitutional avenues, and non-violent ethics.'
              },
              {
                num: '08',
                titleTa: 'இளைய தலைமுறைக்கு வழிகாட்டல்',
                titleEn: 'Mentoring Future Generations',
                descTa: 'மாணவர்களுக்கும் இளைஞர்களுக்கும் நற்பண்புகளையும், கல்வியையும், தாய்மொழிப் பற்றையும் ஊட்டி வழிகாட்டுதல்.',
                descEn: 'Guiding students and young adults towards higher education, ethical character, and cultural knowledge.'
              },
            ].map((eth, idx) => (
              <div 
                key={idx}
                className="bg-white dark:bg-[#1E232B] border border-slate-200/80 dark:border-gray-800 hover:border-[#8B1E26] p-4 rounded-2xl space-y-2 transition-all group flex flex-col justify-between shadow-sm hover:shadow-md"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-[#8B1E26] dark:text-red-400 text-xs">{eth.num}</span>
                    <BadgeCheck className="w-4 h-4 text-[#8B1E26] dark:text-red-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs font-heading">
                    {isTa ? eth.titleTa : eth.titleEn}
                  </h4>
                  <p className="text-[11px] text-slate-600 dark:text-gray-300 leading-relaxed font-sans">
                    {isTa ? eth.descTa : eth.descEn}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </section>

        {/* ========================================================================= */}
        {/* 10. INTERACTIVE FAQ SECTION (ACCORDION) */}
        {/* ========================================================================= */}
        <section id="faq" className="space-y-8 scroll-mt-24">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 bg-[#FDF2F2] dark:bg-red-950/60 text-[#8B1E26] dark:text-red-400 border border-[#8B1E26]/20 text-xs font-extrabold px-3.5 py-1 rounded-full uppercase tracking-wider">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{isTa ? 'விளக்கங்கள் & உதவிகள்' : 'Clarifications & Help'}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-heading">
              {isTa ? 'அடிக்கடி கேட்கப்படும் வினாக்களும் விடைகளும்' : 'Frequently Asked Questions (FAQ)'}
            </h2>
            <div className="w-20 h-1 bg-[#8B1E26] dark:bg-red-500 mx-auto rounded-full" />
            <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-300 leading-relaxed font-sans">
              {isTa 
                ? 'தமிழ் சங்கத்தில் இணைவது, உறுப்பினர் அட்டை பெறுவது மற்றும் பாசறை செயல்பாடுகள் குறித்த பொதுவான சந்தேகங்களுக்கான விடைகள்.'
                : 'Detailed answers to common questions regarding membership, digital ID generation, tax exemptions, and wing participation.'}
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-3">
            {[
              {
                qTa: 'தமிழ் சங்கத்தில் யார் யார் உறுப்பினராக இணையலாம்?',
                qEn: 'Who is eligible to join Tamil Sangam?',
                aTa: '18 வயது பூர்த்தியடைந்த, தமிழ் மொழி, பண்பாடு மற்றும் சமுதாய நல்வாழ்வில் பற்றுடைய அனைத்து இந்தியக் குடிமக்களும், உலகெங்கிலும் வாழும் புலம்பெயர் தமிழர்களும் சாதி, மத, அரசியல் பேதமின்றி தமிழ் சங்கத்தில் உறுப்பினராக இணையலாம்.',
                aEn: 'Any individual aged 18 or above who respects Tamil language, cultural values, and progressive public welfare can join, regardless of caste, religion, gender, or political beliefs. Members of the worldwide Tamil diaspora are warmly welcomed.'
              },
              {
                qTa: 'டிஜிட்டல் உறுப்பினர் அடையாள அட்டை எவ்வாறு கிடைக்கும்?',
                qEn: 'How do I receive my verified digital membership ID card?',
                aTa: 'இணையதளத்தில் உங்கள் 10 இலக்க மொபைல் எண்ணை உள்ளிட்டு ஒருமுறை கடவுச்சொல் மூலம் சரிபார்த்து, எளிய விண்ணப்பப் படிவத்தைப் பூர்த்தி செய்து சமர்ப்பித்தவுடன், அதிகாரி கையொப்பம் மற்றும் கியூஆர் குறியீட்டுடன் கூடிய டிஜிட்டல் அட்டை உடனடியாகத் திரையில் தோன்றும். அதனைப் பிடிஎஃப் வடிவில் உடனே பதிவிறக்கம் செய்து கொள்ளலாம்.',
                aEn: 'Enter your 10-digit mobile number on our portal, verify with one-time SMS verification, complete the quick registration form, and submit. Your official dual-sided ID card featuring instant QR code verification, hologram, and authorized seal is generated immediately for instant download.'
              },
              {
                qTa: 'அடையாள அட்டையில் உள்ள கியூஆர் குறியீடு எவ்வாறு செயல்படுகிறது?',
                qEn: 'How does the public QR code verification work?',
                aTa: 'உங்கள் உறுப்பினர் அட்டையில் அச்சிடப்பட்டுள்ள கியூஆர் குறியீட்டை எந்தவொரு சாதாரண ஸ்மார்ட்போன் கேமரா வழியாக ஸ்கேன் செய்தாலும், அது தமிழ் சங்கத்தின் அதிகாரப்பூர்வ பொது சரிபார்ப்பு பக்கத்திற்குச் சென்று உங்கள் உறுப்பினர் எண், பெயர், மாவட்டம், பாசறை மற்றும் உறுப்பினர் தகுதி ஆகியவற்றை உறுதிப்படுத்தும்.',
                aEn: 'Scanning the QR code on the ID card with any standard mobile camera immediately opens the public verification portal showing the member name, assigned wing, district, membership number, and active certified trust status.'
              },
              {
                qTa: 'தமிழ் சங்கத்திற்கு வழங்கப்படும் நன்கொடைகளுக்கு வரிவிலக்கு உண்டா?',
                qEn: 'Are donations eligible for Income Tax exemption?',
                aTa: 'ஆம், தமிழ் சங்கம் இந்திய வருமான வரிச் சட்டம் பிரிவு 80G மற்றும் 12A-இன் கீழ் பதிவு செய்யப்பட்டுள்ளது. நீங்கள் வழங்கும் நன்கொடைகளுக்கு 50% வருமான வரிவிலக்கு உண்டு. நன்கொடை செலுத்திய உடனேயே அதிகாரப்பூர்வ வரிவிலக்கு பிடிஎஃப் ரசீது வழங்கப்படும்.',
                aEn: 'Yes, Tamil Sangam is registered under Section 80G and Section 12A of the Indian Income Tax Act. All eligible donations qualify for a 50% tax deduction, and an official 80G digital receipt with PAN details is generated instantly upon contribution.'
              },
              {
                qTa: 'தமிழ்நாட்டிற்கு வெளியே அல்லது வெளிநாடுகளில் வசிப்பவர்கள் இணைய முடியுமா?',
                qEn: 'Can individuals living outside Tamil Nadu or overseas join?',
                aTa: 'நிச்சயமாக இணையலாம். வெளிமாநிலங்கள் மற்றும் மலேசியா, சிங்கப்பூர், இலங்கை, அமெரிக்கா, ஐரோப்பா உள்ளிட்ட நாடுகளில் வாழும் தமிழர்கள் "உலகத் தமிழர் பாசறை" அல்லது அவர்கள் விரும்பும் சிறப்புப் பாசறையில் இணைந்து உலகளாவிய சமூகப் பணிகளில் பங்கெடுக்கலாம்.',
                aEn: 'Absolutely. Tamils residing in other Indian states and overseas countries (Singapore, Malaysia, Sri Lanka, USA, Europe, GCC) can register and actively participate under the Global Diaspora Wing or any of the 23 functional wings.'
              },
              {
                qTa: '23 பாசறைகளில் உறுப்பினர்கள் எவ்வாறு இணைந்து பணியாற்றலாம்?',
                qEn: 'How can members actively participate in the 23 Pasarai wings?',
                aTa: 'உறுப்பினர் சேர்க்கையின் போதே உங்கள் ஆர்வம் மற்றும் துறைக்கேற்ப (எ.கா: கல்வி, இளைஞர், மருத்துவம், இயற்கை விவசாயம், தகவல் தொழில்நுட்பம்) விருப்பமான பாசறையைத் தேர்வு செய்யலாம். மாவட்ட மற்றும் வட்டாரக் கூட்டங்கள், சேவை முகாம்கள் வழியே அப்பாசறையின் நேரடிப் பணிகளில் ஈடுபடலாம்.',
                aEn: 'During registration, you can choose your preferred Pasarai matching your background or passion (e.g., Youth, Education, Healthcare, Agriculture, Technology). You will be connected to your district coordinators to lead local workshops, tree plantations, or blood drives.'
              },
              {
                qTa: 'அவசர இரத்த தான உதவிக்கு தமிழ் சங்கத்தை எவ்வாறு அணுகுவது?',
                qEn: 'How can the public request emergency blood donation assistance?',
                aTa: 'எமது 38 மாவட்ட மருத்துவப் பாசறை ஒருங்கிணைப்பாளர்கள் 24 மணி நேரமும் அவசர இரத்தத் தேவைகளுக்கு உதவ தயாராக உள்ளனர். வலைத்தளத்தின் அவசர தொடர்பு எண் அல்லது மாவட்டப் பொறுப்பாளர்களைத் தொடர்பு கொண்டால், அருகில் உள்ள பதிவுபெற்ற கொடையாளர்கள் உடனடியாக அனுப்பி வைக்கப்படுவர்.',
                aEn: 'Our Medical Wing coordinators maintain active blood donor groups across all 38 districts. In emergency situations, contacting our 24/7 hotline alerts nearby verified voluntary donors to immediately report to the hospital blood bank.'
              },
              {
                qTa: 'உறுப்பினர் கட்டணம் மற்றும் நன்கொடைகள் எவ்வாறு செலவிடப்படுகின்றன?',
                qEn: 'How are membership fees and donor funds utilized?',
                aTa: 'அனைத்து நிதிகளும் ஏழை எளிய மாணவர்களின் கல்வி உதவித்தொகை, இலவச மருத்துவ முகாம்கள், 100,000 மரக்கன்றுகள் நடும் திட்டங்கள், ஓலைச்சுவடிகள் மின்னாக்கம் மற்றும் பேரிடர் நிவாரணப் பணிகளுக்கு மட்டுமே செலவிடப்படுகின்றன. அனைத்து வரவு செலவுகளும் பட்டயக் கணக்காளர் மூலம் தணிக்கை செய்யப்பட்டு வெளிப்படையாகப் பராமரிக்கப்படுகின்றன.',
                aEn: 'Every rupee received is strictly channeled into rural student scholarships, free medical and blood camps, native tree plantation drives, ancient manuscript digitization, and disaster relief. Accounts undergo rigorous statutory auditing by certified chartered accountants.'
              },
            ].map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div 
                  key={idx}
                  className="bg-white dark:bg-[#1E232B] border border-slate-200/80 dark:border-gray-800 hover:border-[#8B1E26] dark:hover:border-red-400 rounded-2xl overflow-hidden transition-all shadow-sm"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <span className="font-extrabold text-slate-900 dark:text-white text-xs sm:text-sm font-heading flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-[#8B1E26]/10 text-[#8B1E26] dark:text-red-400 flex items-center justify-center text-[11px] font-black shrink-0">
                        {idx + 1}
                      </span>
                      <span>{isTa ? faq.qTa : faq.qEn}</span>
                    </span>
                    <span className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-gray-700 flex items-center justify-center text-slate-600 dark:text-gray-300 shrink-0">
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 border-t border-slate-100 dark:border-gray-800">
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-300 leading-relaxed font-sans pl-8">
                        {isTa ? faq.aTa : faq.aEn}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </section>

        {/* ========================================================================= */}
        {/* 11. OFFICIAL TRUST DETAILS & LEGAL TRANSPARENCY */}
        {/* ========================================================================= */}
        <section id="legal" className="bg-white dark:bg-[#1E232B] border border-slate-200/80 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-xl scroll-mt-24">
          
          <div className="mb-6 pb-4 border-b border-slate-100 dark:border-gray-800 flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-black uppercase text-[#8B1E26] dark:text-red-400 tracking-wider">
                {isTa ? 'அரசு அங்கீகாரம் & வெளிப்படைத்தன்மை' : 'Govt Accreditation & Transparency'}
              </span>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-lg sm:text-xl font-heading">
                {isTa ? 'சட்டப்பூர்வ அறக்கட்டளை விபரங்கள்' : 'Statutory & Trust Compliance Credentials'}
              </h3>
            </div>
            <div className="inline-flex items-center gap-2 bg-[#FDF2F2] dark:bg-red-950/60 border border-[#8B1E26]/20 px-3 py-1.5 rounded-xl text-xs text-[#8B1E26] dark:text-red-300 font-bold">
              <ShieldCheck className="w-4 h-4 text-[#8B1E26] dark:text-red-400" />
              <span>{isTa ? 'நூறு சதவீதம் தணிக்கை செய்யப்பட்டது' : '100% Statutorily Audited'}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
            
            <div className="space-y-1.5">
              <span className="text-[10px] font-black uppercase text-[#8B1E26] dark:text-red-400 tracking-wider">
                {isTa ? 'சட்டப்பூர்வ பதிவு' : 'Legal Trust Status'}
              </span>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                {isTa ? 'இந்திய அரசு அறக்கட்டளை' : 'Indian Public Trust Act'}
              </h4>
              <p className="text-slate-600 dark:text-gray-300 leading-relaxed font-sans">
                {isTa ? 'அரசு பதிவு எண்: TN-15-0042417' : 'Govt Registered: TN-15-0042417'}
              </p>
              <p className="text-[11px] text-[#8B1E26] dark:text-red-400 font-semibold">
                {isTa ? 'அரசாணை அங்கீகாரம் பெற்றது' : 'State Govt Gazette Recognized'}
              </p>
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] font-black uppercase text-[#8B1E26] dark:text-red-400 tracking-wider">
                {isTa ? 'வரிவிலக்கு சலுகை' : 'Charitable Tax Exemption'}
              </span>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                {isTa ? 'பிரிவு 80G & 12A வரிவிலக்கு' : 'Section 80G & 12A Income Tax'}
              </h4>
              <p className="text-slate-600 dark:text-gray-300 leading-relaxed font-sans">
                {isTa ? 'அனைத்து நன்கொடைகளுக்கும் இந்திய வருமான வரிச் சட்டத்தின் கீழ் 50% வரிவிலக்கு உண்டு.' : 'Eligible donations receive 50% deduction under Indian Income Tax provisions.'}
              </p>
              <p className="text-[11px] text-[#8B1E26] dark:text-red-400 font-semibold">
                {isTa ? 'உடனடி டிஜிட்டல் ரசீது' : 'Instant 80G Digital Receipt'}
              </p>
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] font-black uppercase text-[#8B1E26] dark:text-red-400 tracking-wider">
                {isTa ? 'தலைமைச் செயலகம்' : 'Registered Secretariat'}
              </span>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                {isTa ? 'மதுரை & சென்னை' : 'Madurai & Chennai'}
              </h4>
              <p className="text-slate-600 dark:text-gray-300 leading-relaxed font-sans">
                {isTa ? 'தமிழ்நாடு, இந்தியா - தலைமை நிர்வாக செயலகம்.' : 'Tamil Nadu, India - Central Trust Secretariat.'}
              </p>
              <p className="text-[11px] text-[#8B1E26] dark:text-red-400 font-semibold">
                {isTa ? '38 மாவட்ட அலுவலகங்கள்' : '38 District Unit Desks'}
              </p>
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] font-black uppercase text-[#8B1E26] dark:text-red-400 tracking-wider">
                {isTa ? 'தணிக்கை & தகவல் பாதுகாப்பு' : 'Audit & Data Security'}
              </span>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                {isTa ? 'ஆண்டு நிதி தணிக்கை & கிரிப்டோ பாதுகாப்பு' : 'Chartered Audit & Vault Security'}
              </h4>
              <p className="text-slate-600 dark:text-gray-300 leading-relaxed font-sans">
                {isTa ? 'அங்கீகரிக்கப்பட்ட பட்டயக் கணக்காளர் மூலம் தணிக்கை; உறுப்பினர் ஆவணங்கள் மறைகுறியாக்கப்பட்டு பாதுகாக்கப்படுகின்றன.' : 'Statutory audit by certified chartered accountants; member documents stored in 256-bit encrypted vault.'}
              </p>
              <p className="text-[11px] text-[#8B1E26] dark:text-red-400 font-semibold">
                {isTa ? 'தரவு பாதுகாப்பு உறுதி' : 'Data Privacy Guaranteed'}
              </p>
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 12. BOTTOM CALL TO ACTION (MATCHING HOME PAGE) */}
        {/* ========================================================================= */}
        <section className="bg-[#8B1E26] rounded-3xl p-8 sm:p-12 text-center text-white shadow-2xl space-y-6">
          <div className="max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 bg-white/15 text-amber-300 border border-white/20 text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isTa ? 'மக்கள் இயக்கம்' : 'People Movement'}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold font-heading text-white">
              {isTa ? 'தமிழ் சங்கத்தில் இன்றே பெருமையுடன் இணையுங்கள்!' : 'Join Tamil Sangam with Pride Today!'}
            </h2>
            <p className="text-sm sm:text-base text-gray-100 leading-relaxed font-sans">
              {isTa 
                ? 'உங்கள் 10 இலக்க மொபைல் எண்ணை உள்ளிட்டு, எளிய படிவத்தை பூர்த்தி செய்து உடனடியாக அதிகாரப்பூர்வ டிஜிட்டல் உறுப்பினர் அடையாள அட்டையைப் பெறுங்கள்.'
                : 'Enter your 10-digit mobile number, complete the quick registration form, and receive your verified official digital membership ID card instantly.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            {isLoggedIn ? (
              <button
                onClick={onGoToDashboard}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-8 py-3.5 rounded-xl shadow-xl text-xs sm:text-sm tracking-wider uppercase transition-all active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <span>{isTa ? 'எனது உறுப்பினர் பலகைக்குச் செல்க' : 'Go To My Dashboard'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onOpenJoinModal}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-8 py-3.5 rounded-xl shadow-xl text-xs sm:text-sm tracking-wider uppercase transition-all active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <Award className="w-4 h-4" />
                <span>{isTa ? 'உறுப்பினராக இன்றே இணையுங்கள்' : 'Become A Member Today'}</span>
              </button>
            )}

            <a
              href="#wings"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/30 font-bold text-xs sm:text-sm px-6 py-3.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 backdrop-blur-sm"
            >
              <Layers className="w-4 h-4 text-amber-300" />
              <span>{isTa ? '23 பாசறைகளை பார்வையிடுக' : 'Explore 23 Wings'}</span>
            </a>
          </div>
        </section>

      </div>
    </div>
  );
};
