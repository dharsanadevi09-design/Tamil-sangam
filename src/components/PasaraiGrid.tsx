import React, { useState } from 'react';
import { PASARAI_WINGS } from '../data/mockData';
import type { Pasarai } from '../types';
import { Search, ArrowRight, ShieldCheck, ChevronRight } from 'lucide-react';

interface PasaraiGridProps {
  onSelectPasaraiToJoin: (pasaraiId: string) => void;
  currentLang: 'en' | 'ta';
  selectedPasaraiId?: string;
}

export const PasaraiGrid: React.FC<PasaraiGridProps> = ({
  onSelectPasaraiToJoin,
  currentLang,
  selectedPasaraiId
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
    <section id="pasarai" className="py-16 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-900 dark:text-amber-300 text-xs font-bold uppercase tracking-wider">
            <span>23 Specialized Wings</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
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
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 shadow-sm"
            />
          </div>
        </div>

        {/* Selected Wing Detail Header Banner */}
        {selectedWing && (
          <div className="mb-10 bg-[#181B20] text-white rounded-2xl p-6 sm:p-8 shadow-2xl gold-header-strip relative overflow-hidden">
            <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-yellow-500/10 to-transparent pointer-events-none" />
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
              <div className="lg:col-span-8 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-yellow-400 text-[#181B20] text-xs font-black px-2.5 py-1 rounded uppercase tracking-wider">
                    {selectedWing.category}
                  </span>
                  <span className="text-xs text-amber-300 font-semibold">
                    Wing #{selectedWing.id}
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                  {selectedWing.nameTamil} ({selectedWing.name})
                </h3>
                <p className="text-sm text-gray-300 leading-relaxed">
                  {currentLang === 'ta' ? selectedWing.descriptionTamil : selectedWing.description}
                </p>

                {/* Office Bearers list */}
                <div className="pt-2 flex flex-wrap gap-4 text-xs">
                  {selectedWing.officeBearers.map((ob, idx) => (
                    <div key={idx} className="bg-gray-800/90 border border-gray-700 px-3 py-1.5 rounded-lg flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-yellow-400" />
                      <div>
                        <span className="text-gray-400 font-medium">{ob.title}:</span>{' '}
                        <span className="text-white font-bold">{ob.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-4 text-left lg:text-right space-y-3">
                <div className="inline-block bg-gray-800/80 border border-gray-700 rounded-xl px-5 py-3">
                  <p className="text-xs text-gray-400">Total Active Wing Members</p>
                  <p className="text-2xl font-extrabold text-yellow-400">{selectedWing.memberCount.toLocaleString()}</p>
                </div>
                <div>
                  <button
                    onClick={() => onSelectPasaraiToJoin(selectedWing.id)}
                    className="w-full lg:w-auto inline-flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-[#181B20] font-extrabold px-6 py-3 rounded-xl shadow-lg transition-all"
                  >
                    <span>{currentLang === 'ta' ? 'இந்த பாசறையில் இணைய' : 'JOIN THIS PASARAI'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
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
                className={`cursor-pointer bg-white dark:bg-slate-800 rounded-xl overflow-hidden border transition-all duration-200 shadow-md hover:shadow-xl flex flex-col justify-between ${
                  isSelected ? 'ring-2 ring-yellow-400 border-yellow-400 transform -translate-y-1' : 'border-slate-200 dark:border-slate-700 hover:border-yellow-400/50'
                }`}
              >
                {/* Yellow Header Strip */}
                <div className="h-1.5 bg-yellow-400" />
                
                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-2 py-0.5 rounded">
                        {wing.category}
                      </span>
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        {wing.memberCount} members
                      </span>
                    </div>

                    <h4 className="font-extrabold text-base text-slate-900 dark:text-white line-clamp-1">
                      {wing.nameTamil}
                    </h4>
                    <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-2">
                      {wing.name}
                    </p>

                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                      {currentLang === 'ta' ? wing.descriptionTamil : wing.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">View Details</span>
                    <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-amber-500' : 'text-slate-400'}`} />
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectPasaraiToJoin(wing.id);
                  }}
                  className="w-full bg-slate-900 hover:bg-yellow-400 text-white hover:text-slate-900 text-xs font-bold py-2.5 transition-colors text-center"
                >
                  {currentLang === 'ta' ? 'இணைந்திடுக' : 'SELECT & JOIN'}
                </button>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
