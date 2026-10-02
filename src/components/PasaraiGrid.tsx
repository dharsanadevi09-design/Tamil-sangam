import React, { useState } from 'react';
import { PASARAI_WINGS } from '../data/mockData';
import type { Pasarai } from '../types';
import { Search, ArrowRight, ShieldCheck, ChevronRight } from 'lucide-react';

interface PasaraiGridProps {
  onSelectPasaraiToJoin: (pasaraiId: string) => void;
  currentLang: 'en' | 'ta';
  selectedPasaraiId?: string;
  isLoggedIn?: boolean;
  onGoToDashboard?: () => void;
}

export const PasaraiGrid: React.FC<PasaraiGridProps> = ({
  onSelectPasaraiToJoin,
  currentLang,
  selectedPasaraiId,
  isLoggedIn,
  onGoToDashboard
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWing, setSelectedWing] = useState<Pasarai | null>(
    selectedPasaraiId ? PASARAI_WINGS.find(p => p.id === selectedPasaraiId) || PASARAI_WINGS[0] : PASARAI_WINGS[0]
  );

  const filteredWings = PASARAI_WINGS.filter(w =>
    w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.nameTamil.includes(searchQuery) ||
    w.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section id="pasarai" className="py-16 bg-[#FAF8F5] dark:bg-slate-950 text-slate-800 dark:text-gray-100 transition-colors duration-300 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-900 dark:text-amber-300 text-xs font-bold uppercase tracking-wider">
            <span>23 Specialized Wings</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight font-heading">
            {currentLang === 'ta' ? 'தமிழ் சங்கம் - 23 பாசறைகள்' : 'Tamil Sangam – 23 Pasarai Wings'}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {currentLang === 'ta'
              ? 'ஒவ்வொரு பாசறையும் தனக்கென தனித்துவமான குறிக்கோள், பொறுப்பாளர்கள் மற்றும் செயல்பாடுகளுடன் இயங்குகிறது. உங்கள் விருப்பமான பாசறையைத் தேர்வு செய்து இணையலாம்.'
              : 'Each of the 23 wings operates with dedicated office bearers, targeted goals, and specialized social/cultural activities.'}
          </p>

          {/* Search bar */}
          <div className="relative max-w-md mx-auto pt-2">
            <Search className="absolute left-3.5 top-5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder={currentLang === 'ta' ? 'பாசறை தேட...' : 'Search wings by name or topic...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#8B1E26] dark:focus:ring-yellow-400 shadow-sm"
            />
          </div>
        </div>

        {/* Selected Wing Detail Header Banner */}
        {selectedWing && (
          <div className="mb-10 bg-[#8B1E26] text-white rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-30 pointer-events-none overflow-hidden">
              <img src={selectedWing.image || '/hero-temple.jpg'} alt={selectedWing.name} className="w-full h-full object-cover" />
            </div>
            <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-transparent via-[#8B1E26]/90 to-[#8B1E26] pointer-events-none" />
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
              <div className="lg:col-span-8 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-white text-[#8B1E26] text-xs font-black px-2.5 py-1 rounded uppercase tracking-wider shadow">
                    {selectedWing.category}
                  </span>
                  <span className="text-xs text-amber-200 font-semibold">
                    Wing #{selectedWing.id}
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
                  {selectedWing.nameTamil} ({selectedWing.name})
                </h3>
                <p className="text-sm text-gray-100 leading-relaxed">
                  {currentLang === 'ta' ? selectedWing.descriptionTamil : selectedWing.description}
                </p>

                {/* Office Bearers list */}
                <div className="pt-2 flex flex-wrap gap-4 text-xs">
                  {selectedWing.officeBearers.map((ob, idx) => (
                    <div key={idx} className="bg-black/30 backdrop-blur-sm border border-white/20 px-3 py-1.5 rounded-lg flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-amber-300" />
                      <div>
                        <span className="text-gray-200 font-medium">{ob.title}:</span>{' '}
                        <span className="text-white font-bold">{ob.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-4 text-left lg:text-right space-y-3">
                <div className="inline-block bg-black/30 backdrop-blur-sm border border-white/20 rounded-xl px-5 py-3">
                  <p className="text-xs text-gray-200">Total Active Wing Members</p>
                  <p className="text-2xl font-extrabold text-white">{selectedWing.memberCount.toLocaleString()}</p>
                </div>
                <div>
                  {isLoggedIn ? (
                    <button
                      onClick={onGoToDashboard}
                      className="w-full lg:w-auto inline-flex items-center justify-center gap-2 bg-white text-[#8B1E26] hover:bg-amber-100 font-extrabold px-6 py-3 rounded-xl shadow-lg transition-all cursor-pointer"
                    >
                      <span>{currentLang === 'ta' ? 'எனது பாசறை பலகை' : 'MY WING & DASHBOARD'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => onSelectPasaraiToJoin(selectedWing.id)}
                      className="w-full lg:w-auto inline-flex items-center justify-center gap-2 bg-white text-[#8B1E26] hover:bg-amber-100 font-extrabold px-6 py-3 rounded-xl shadow-lg transition-all cursor-pointer"
                    >
                      <span>{currentLang === 'ta' ? 'இந்த பாசறையில் இணைய' : 'JOIN THIS PASARAI'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 23 Wings Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredWings.map((wing) => {
            const isSelected = selectedWing?.id === wing.id;
            return (
              <div
                key={wing.id}
                onClick={() => setSelectedWing(wing)}
                className={`cursor-pointer bg-white dark:bg-[#1E232B] rounded-2xl overflow-hidden border transition-all duration-300 shadow-md hover:shadow-2xl flex flex-col justify-between group ${
                  isSelected ? 'ring-2 ring-[#8B1E26] dark:ring-yellow-400 border-[#8B1E26] dark:border-yellow-400 transform -translate-y-1' : 'border-slate-200/80 dark:border-gray-800 hover:border-[#8B1E26]/50'
                }`}
              >
                {/* Wing Image Header (Home Page Temple Image) */}
                <div className="h-40 relative overflow-hidden bg-slate-200 dark:bg-slate-800">
                  <img
                    src={wing.image || '/hero-temple.jpg'}
                    alt={wing.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Category & Members Overlay */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider bg-[#8B1E26] text-white px-2.5 py-1 rounded-full shadow">
                      {wing.category}
                    </span>
                    <span className="text-[10px] font-bold bg-black/60 backdrop-blur-sm text-yellow-300 px-2 py-0.5 rounded-full border border-yellow-400/30">
                      {wing.memberCount.toLocaleString()} members
                    </span>
                  </div>

                  {/* Title on Image */}
                  <div className="absolute bottom-2 left-3 right-3">
                    <h4 className="font-extrabold text-base text-white drop-shadow-md line-clamp-1 font-heading">
                      {wing.nameTamil}
                    </h4>
                    <p className="text-xs font-semibold text-yellow-300 drop-shadow">
                      {wing.name}
                    </p>
                  </div>
                </div>
                
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                    {currentLang === 'ta' ? wing.descriptionTamil : wing.description}
                  </p>

                  <div className="pt-2 border-t border-slate-100 dark:border-gray-800 flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Wing #{wing.id}</span>
                    <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-[#8B1E26] dark:text-yellow-400 font-bold' : 'text-slate-400'}`} />
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isLoggedIn && onGoToDashboard) {
                      onGoToDashboard();
                    } else {
                      onSelectPasaraiToJoin(wing.id);
                    }
                  }}
                  className="w-full bg-[#8B1E26] hover:bg-[#72151C] text-white text-xs font-bold py-3 transition-colors text-center cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>
                    {isLoggedIn
                      ? (currentLang === 'ta' ? 'எனது பலகை' : 'MY DASHBOARD')
                      : (currentLang === 'ta' ? 'இணைந்திடுக' : 'SELECT & JOIN')
                    }
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
