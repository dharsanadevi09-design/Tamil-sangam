import React, { useState } from 'react';
import { 
  Users, MapPin, Calendar, Eye, Target, Sprout, ArrowRight, 
  CheckSquare, ChevronLeft, ChevronRight, MapPin as LocationIcon, Heart
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
  onOpenVerifyModal: _onOpenVerifyModal,
  currentLang: _currentLang,
  isLoggedIn,
  onGoToDashboard,
  setActiveTab
}) => {
  const [activeGalleryFilter, setActiveGalleryFilter] = useState('All');
  const [wingSlideIndex, setWingSlideIndex] = useState(0);

  // Gallery items matching reference image
  const galleryItems = [
    { id: 1, category: 'Events', title: 'Temple Chariot Festival', img: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?q=80&w=800&auto=format&fit=crop' },
    { id: 2, category: 'Culture', title: 'Classical Bharatanatyam', img: 'https://images.unsplash.com/photo-1601972599720-36938d4ecd31?q=80&w=800&auto=format&fit=crop' },
    { id: 3, category: 'Welfare', title: 'Tree Sapling Plantation', img: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=800&auto=format&fit=crop' },
    { id: 4, category: 'District', title: 'State Member Conference', img: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=800&auto=format&fit=crop' },
    { id: 5, category: 'Pasarai', title: 'Heritage Temple Tour', img: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=800&auto=format&fit=crop' },
  ];

  const filteredGallery = activeGalleryFilter === 'All' 
    ? galleryItems 
    : galleryItems.filter(g => g.category === activeGalleryFilter);

  // Wing cards with images matching reference screenshot
  const wingCards = [
    { id: 'edu', name: 'Education', icon: '🎓', img: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=600&auto=format&fit=crop' },
    { id: 'youth', name: 'Youth', icon: '🚩', img: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=600&auto=format&fit=crop' },
    { id: 'women', name: 'Women', icon: '👩', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop' },
    { id: 'culture', name: 'Culture', icon: '🎭', img: 'https://images.unsplash.com/photo-1601972599720-36938d4ecd31?q=80&w=600&auto=format&fit=crop' },
    { id: 'welfare', name: 'Welfare', icon: '🤲', img: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=600&auto=format&fit=crop' },
    { id: 'env', name: 'Environment', icon: '🌱', img: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=600&auto=format&fit=crop' },
  ];

  const handlePrevWings = () => {
    setWingSlideIndex(prev => (prev === 0 ? Math.max(0, wingCards.length - 4) : prev - 1));
  };

  const handleNextWings = () => {
    setWingSlideIndex(prev => (prev >= wingCards.length - 4 ? 0 : prev + 1));
  };

  return (
    <div className="bg-[#FAF8F5] dark:bg-slate-950 text-slate-800 dark:text-gray-100 transition-colors duration-300">
      
      {/* ========================================================================= */}
      {/* 1. HERO MAIN SECTION */}
      {/* ========================================================================= */}
      <section className="relative pt-8 pb-16 lg:pt-12 lg:pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-6 space-y-6">
              
              <p className="text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-widest">
                CONNECTING TAMIL PEOPLE
              </p>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-heading text-slate-900 dark:text-white leading-[1.15] tracking-tight">
                Preserving <br />
                Tamil Culture. <br />
                <span className="text-[#8B1E26] dark:text-red-400">Building a <br />Stronger Community.</span>
              </h1>

              <p className="text-sm sm:text-base text-slate-600 dark:text-gray-300 max-w-xl leading-relaxed">
                Tamil Sangam - Tamil Nadu is a people's organization working for the development of tamil language, culture and society.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                {isLoggedIn ? (
                  <button
                    onClick={onGoToDashboard}
                    className="flex items-center gap-2 bg-[#8B1E26] hover:bg-[#72151C] text-white text-sm font-bold px-6 py-3.5 rounded-full shadow-lg transition-all transform hover:-translate-y-0.5 active:scale-95 cursor-pointer"
                  >
                    <span>MY MEMBER DASHBOARD</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => onOpenJoinModal()}
                    className="flex items-center gap-2 bg-[#8B1E26] hover:bg-[#72151C] text-white text-sm font-bold px-6 py-3.5 rounded-full shadow-lg transition-all transform hover:-translate-y-0.5 active:scale-95 cursor-pointer"
                  >
                    <span>Join Tamil Sangam</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}

                <button
                  onClick={() => {
                    const elem = document.getElementById('about');
                    if (elem) elem.scrollIntoView({ behavior: 'smooth' });
                    else if (setActiveTab) setActiveTab('about');
                  }}
                  className="flex items-center gap-2 bg-transparent border border-slate-300 dark:border-gray-700 hover:bg-slate-200/60 dark:hover:bg-gray-800 text-slate-700 dark:text-gray-200 text-sm font-semibold px-6 py-3.5 rounded-full transition-all cursor-pointer"
                >
                  <span>Explore Our Work</span>
                </button>
              </div>

              {/* Social Proof Counter & Overlapping Avatars */}
              <div className="flex items-center gap-4 pt-4 border-t border-slate-200/80 dark:border-gray-800">
                <div className="flex -space-x-3 overflow-hidden">
                  <img className="inline-block h-10 w-10 rounded-full ring-2 ring-white dark:ring-gray-900 object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" alt="Member" />
                  <img className="inline-block h-10 w-10 rounded-full ring-2 ring-white dark:ring-gray-900 object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80" alt="Member" />
                  <img className="inline-block h-10 w-10 rounded-full ring-2 ring-white dark:ring-gray-900 object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80" alt="Member" />
                </div>
                <div>
                  <p className="text-sm font-extrabold text-slate-900 dark:text-white">10,000+</p>
                  <p className="text-xs text-slate-500 dark:text-gray-400">Members and growing</p>
                </div>
              </div>

            </div>

            {/* Right Column: Hero Image & Overlaid Tamil Quote Card */}
            <div className="lg:col-span-6 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                
                {/* Main Hero Image */}
                <div className="overflow-hidden rounded-3xl shadow-2xl border-4 border-white dark:border-gray-800 bg-slate-200 aspect-[4/3] sm:aspect-[14/11] relative">
                  <img 
                    src="https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=1200&auto=format&fit=crop" 
                    alt="Madurai Meenakshi Temple Gopuram Tamil Nadu" 
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Overlaid Quote Card (Bottom Right overlay) */}
                <div className="absolute -bottom-6 right-2 sm:right-6 bg-white dark:bg-[#1E232B] p-5 rounded-2xl shadow-xl border-l-4 border-[#8B1E26] max-w-[260px] sm:max-w-[280px]">
                  <div className="flex items-start gap-2">
                    <span className="text-2xl leading-none text-[#8B1E26] dark:text-red-400 font-serif">❝</span>
                    <div>
                      <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white font-serif leading-relaxed">
                        தமிழ் வெல்லும் <br />
                        தமிழர் பண்பு <br />
                        தமிழர் முன்னேற்றம்
                      </p>
                      <div className="w-12 h-0.5 bg-[#8B1E26] mt-2" />
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>
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
                <p className="text-xs font-medium text-slate-500 dark:text-gray-400">Members</p>
              </div>
            </div>

            {/* Stat Item 2 */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-[#FAF8F5] dark:bg-[#22262E] border border-slate-100 dark:border-gray-800 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-[#FDF2F2] dark:bg-red-950/60 flex items-center justify-center text-[#8B1E26] dark:text-red-400 shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-white">38</p>
                <p className="text-xs font-medium text-slate-500 dark:text-gray-400">Districts</p>
              </div>
            </div>

            {/* Stat Item 3 */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-[#FAF8F5] dark:bg-[#22262E] border border-slate-100 dark:border-gray-800 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-[#FDF2F2] dark:bg-red-950/60 flex items-center justify-center text-[#8B1E26] dark:text-red-400 shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-white">23</p>
                <p className="text-xs font-medium text-slate-500 dark:text-gray-400">Pasarai</p>
              </div>
            </div>

            {/* Stat Item 4 */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-[#FAF8F5] dark:bg-[#22262E] border border-slate-100 dark:border-gray-800 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-[#FDF2F2] dark:bg-red-950/60 flex items-center justify-center text-[#8B1E26] dark:text-red-400 shrink-0">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-white">100+</p>
                <p className="text-xs font-medium text-slate-500 dark:text-gray-400">Events</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. VISION, MISSION, OBJECTIVES CARDS SECTION */}
      {/* ========================================================================= */}
      <section className="py-16 bg-[#FAF8F5] dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card 1: Our Vision */}
            <div className="bg-white dark:bg-[#1E232B] p-8 rounded-2xl border border-slate-200/80 dark:border-gray-800 shadow-sm text-center space-y-4 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-full bg-[#FDF2F2] dark:bg-red-950/60 text-[#8B1E26] dark:text-red-400 mx-auto flex items-center justify-center">
                <Eye className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold font-heading text-slate-900 dark:text-white">Our Vision</h3>
              <p className="text-xs text-slate-600 dark:text-gray-300 leading-relaxed max-w-xs mx-auto">
                Tamil language, culture and community development.
              </p>
            </div>

            {/* Card 2: Our Mission */}
            <div className="bg-white dark:bg-[#1E232B] p-8 rounded-2xl border border-slate-200/80 dark:border-gray-800 shadow-sm text-center space-y-4 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-full bg-[#FDF2F2] dark:bg-red-950/60 text-[#8B1E26] dark:text-red-400 mx-auto flex items-center justify-center">
                <Target className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold font-heading text-slate-900 dark:text-white">Our Mission</h3>
              <p className="text-xs text-slate-600 dark:text-gray-300 leading-relaxed max-w-xs mx-auto">
                Connecting people and creating meaningful initiatives.
              </p>
            </div>

            {/* Card 3: Our Objectives */}
            <div className="bg-white dark:bg-[#1E232B] p-8 rounded-2xl border border-slate-200/80 dark:border-gray-800 shadow-sm text-center space-y-4 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-full bg-[#FDF2F2] dark:bg-red-950/60 text-[#8B1E26] dark:text-red-400 mx-auto flex items-center justify-center">
                <Sprout className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold font-heading text-slate-900 dark:text-white">Our Objectives</h3>
              <p className="text-xs text-slate-600 dark:text-gray-300 leading-relaxed max-w-xs mx-auto">
                Education • Culture • Welfare <br /> Social Development • Unity
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. ABOUT TAMIL SANGAM SECTION */}
      {/* ========================================================================= */}
      <section id="about" className="py-16 bg-white dark:bg-[#181B20] border-t border-slate-200/80 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Text */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-slate-900 dark:text-white">
                  About Tamil Sangam
                </h2>
                <div className="w-16 h-1 bg-[#8B1E26] mt-2 rounded-full" />
              </div>

              <p className="text-sm text-slate-600 dark:text-gray-300 leading-relaxed">
                Tamil Sangam - Tamil Nadu is a people's organization committed to preserving Tamil language, culture, heritage and supporting the overall development of our community through various social, educational and cultural initiatives.
              </p>

              <button
                onClick={() => {
                  if (setActiveTab) setActiveTab('about');
                }}
                className="inline-flex items-center gap-2 bg-[#8B1E26] hover:bg-[#72151C] text-white text-xs font-bold px-6 py-3 rounded-full shadow-md transition-all cursor-pointer"
              >
                <span>Read More</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Right Image: Thiruvalluvar Statue Kanyakumari */}
            <div className="lg:col-span-5">
              <div className="overflow-hidden rounded-2xl shadow-xl border-4 border-slate-100 dark:border-gray-800 aspect-[4/3]">
                <img 
                  src="https://images.unsplash.com/photo-1600100397608-f09074052329?q=80&w=1000&auto=format&fit=crop" 
                  alt="Thiruvalluvar Statue Kanyakumari Tamil Nadu" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
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
                    BECOME A MEMBER
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 dark:text-white mt-1">
                    Join Tamil Sangam <br />
                    <span className="text-slate-600 dark:text-gray-300 text-xl font-normal">and become part of our growing community.</span>
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700 dark:text-gray-200 font-medium">
                  <div className="flex items-center gap-2">
                    <CheckSquare className="w-4 h-4 text-[#8B1E26] dark:text-red-400 shrink-0" />
                    <span>Digital Membership ID</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckSquare className="w-4 h-4 text-[#8B1E26] dark:text-red-400 shrink-0" />
                    <span>Certificates</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckSquare className="w-4 h-4 text-[#8B1E26] dark:text-red-400 shrink-0" />
                    <span>Member Dashboard</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckSquare className="w-4 h-4 text-[#8B1E26] dark:text-red-400 shrink-0" />
                    <span>Membership Verification</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckSquare className="w-4 h-4 text-[#8B1E26] dark:text-red-400 shrink-0" />
                    <span>Event Registration</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckSquare className="w-4 h-4 text-[#8B1E26] dark:text-red-400 shrink-0" />
                    <span>Be a part of Social Initiatives</span>
                  </div>
                </div>

                <div>
                  <button
                    onClick={() => onOpenJoinModal()}
                    className="inline-flex items-center gap-2 bg-[#8B1E26] hover:bg-[#72151C] text-white text-xs font-bold px-7 py-3.5 rounded-full shadow-lg transition-all active:scale-95 cursor-pointer"
                  >
                    <span>Join Now</span>
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
                Our Wings / Pasarai
              </h2>
              <div className="w-16 h-1 bg-[#8B1E26] mt-2 rounded-full" />
            </div>

            <button
              onClick={() => {
                if (setActiveTab) setActiveTab('pasarai');
              }}
              className="flex items-center gap-1 text-xs font-bold text-[#8B1E26] dark:text-red-400 border border-[#8B1E26]/30 px-3.5 py-1.5 rounded-full hover:bg-[#FDF2F2] transition-colors cursor-pointer"
            >
              <span>View All Wings</span>
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
                      alt={wing.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                  </div>
                  
                  <div className="p-3 text-center flex items-center justify-center gap-1.5 bg-white dark:bg-[#1E232B]">
                    <span className="text-sm text-[#8B1E26]">{wing.icon}</span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{wing.name}</span>
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
                    Upcoming Events
                  </h2>
                  <div className="w-12 h-1 bg-[#8B1E26] mt-1.5 rounded-full" />
                </div>
                
                <button
                  onClick={() => {
                    if (setActiveTab) setActiveTab('events');
                  }}
                  className="text-xs font-bold text-[#8B1E26] dark:text-red-400 border border-[#8B1E26]/30 px-3 py-1 rounded-full hover:bg-[#FDF2F2] cursor-pointer"
                >
                  View All Events →
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
                      <h4 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1">Tamil Cultural Festival</h4>
                      <p className="text-[10px] text-slate-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                        <LocationIcon className="w-3 h-3 text-[#8B1E26]" /> Madurai
                      </p>
                    </div>

                    <button 
                      onClick={() => onOpenJoinModal()}
                      className="text-[11px] font-bold text-[#8B1E26] dark:text-red-400 hover:underline inline-flex items-center gap-1 cursor-pointer pt-1"
                    >
                      View Event →
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
                      <h4 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1">Youth Leadership Meet</h4>
                      <p className="text-[10px] text-slate-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                        <LocationIcon className="w-3 h-3 text-[#8B1E26]" /> Madurai
                      </p>
                    </div>

                    <button 
                      onClick={() => onOpenJoinModal()}
                      className="text-[11px] font-bold text-[#8B1E26] dark:text-red-400 hover:underline inline-flex items-center gap-1 cursor-pointer pt-1"
                    >
                      View Event →
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
                      <h4 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1">Women Empowerment Workshop</h4>
                      <p className="text-[10px] text-slate-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                        <LocationIcon className="w-3 h-3 text-[#8B1E26]" /> Chennai
                      </p>
                    </div>

                    <button 
                      onClick={() => onOpenJoinModal()}
                      className="text-[11px] font-bold text-[#8B1E26] dark:text-red-400 hover:underline inline-flex items-center gap-1 cursor-pointer pt-1"
                    >
                      View Event →
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
                    Latest News
                  </h2>
                  <div className="w-12 h-1 bg-[#8B1E26] mt-1.5 rounded-full" />
                </div>

                <button
                  onClick={() => {
                    if (setActiveTab) setActiveTab('news');
                  }}
                  className="text-xs font-bold text-[#8B1E26] dark:text-red-400 border border-[#8B1E26]/30 px-3 py-1 rounded-full hover:bg-[#FDF2F2] cursor-pointer"
                >
                  View All News →
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
                      <h4 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-2 leading-tight">{news.title}</h4>
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
                Gallery
              </h2>
              <div className="w-16 h-1 bg-[#8B1E26] mt-2 rounded-full" />
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {['All', 'Events', 'Culture', 'Welfare', 'District', 'Pasarai'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveGalleryFilter(filter)}
                  className={`text-xs font-semibold px-3 py-1 rounded-full transition-all cursor-pointer ${
                    activeGalleryFilter === filter
                      ? 'bg-[#8B1E26] text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-gray-800 text-slate-600 dark:text-gray-300 hover:bg-slate-200'
                  }`}
                >
                  {filter}
                </button>
              ))}

              <button
                onClick={() => {
                  if (setActiveTab) setActiveTab('gallery');
                }}
                className="hidden lg:flex items-center gap-1 text-xs font-bold text-[#8B1E26] dark:text-red-400 border border-[#8B1E26]/30 px-3 py-1 rounded-full hover:bg-[#FDF2F2] cursor-pointer ml-2"
              >
                <span>View Full Gallery</span>
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
      {/* 9. SUPPORT OUR INITIATIVES (DONATION BANNER) */}
      {/* ========================================================================= */}
      <section className="py-16 bg-[#FAF8F5] dark:bg-slate-950 border-t border-slate-200/80 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-[#1E232B] text-white p-8 sm:p-12">
            
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 pointer-events-none">
              <img 
                src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1600&auto=format&fit=crop" 
                alt="Support Tamil Sangam Initiatives" 
                className="w-full h-full object-cover opacity-25"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent" />
            </div>

            <div className="relative z-10 max-w-2xl space-y-4">
              <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-white">
                Support Our Initiatives
              </h2>

              <p className="text-sm sm:text-base text-gray-200 leading-relaxed">
                Your contribution can help us support community, education and cultural initiatives.
              </p>

              <div>
                <button
                  onClick={onOpenDonateModal}
                  className="inline-flex items-center gap-2 bg-[#8B1E26] hover:bg-[#72151C] text-white text-xs font-bold px-7 py-3.5 rounded-full shadow-lg transition-all active:scale-95 cursor-pointer"
                >
                  <Heart className="w-4 h-4 fill-white" />
                  <span>Donate Now</span>
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

