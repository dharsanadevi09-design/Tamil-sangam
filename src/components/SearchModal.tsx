import React, { useState } from 'react';
import { Search, X, ChevronRight, Calendar, Users, Newspaper } from 'lucide-react';
import { PASARAI_WINGS, INITIAL_NEWS, INITIAL_EVENTS } from '../data/mockData';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectWing: (id: string) => void;
  onSelectTab: (tab: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectWing,
  onSelectTab
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const matchedWings = PASARAI_WINGS.filter(w =>
    w.name.toLowerCase().includes(query.toLowerCase()) ||
    w.nameTamil.includes(query) ||
    w.category.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 3);

  const matchedEvents = INITIAL_EVENTS.filter(e =>
    e.title.toLowerCase().includes(query.toLowerCase()) ||
    e.titleTamil.includes(query) ||
    e.district.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 3);

  const matchedNews = INITIAL_NEWS.filter(n =>
    n.title.toLowerCase().includes(query.toLowerCase()) ||
    n.titleTamil.includes(query)
  ).slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-slate-950/70 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#1E232B] rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 dark:border-gray-800 overflow-hidden animate-fadeIn">
        
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-200 dark:border-gray-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-[#8B1E26] dark:text-red-400" />
          <input
            type="text"
            autoFocus
            placeholder="Search wings, events, news, or services..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
              <X className="w-4 h-4" />
            </button>
          )}
          <button onClick={onClose} className="text-xs font-semibold px-2.5 py-1 bg-slate-100 dark:bg-gray-800 rounded-md text-slate-600 dark:text-gray-300">
            ESC
          </button>
        </div>

        {/* Results Container */}
        <div className="p-4 max-h-[60vh] overflow-y-auto space-y-5 text-xs">
          
          {query.trim() === '' ? (
            <div className="py-6 text-center text-slate-500 dark:text-gray-400 space-y-2">
              <p className="font-semibold">Type anything to search Tamil Sangam</p>
              <p className="text-[11px]">Popular: Youth Wing, Cultural Festival, District Pasarai, Membership Verification</p>
            </div>
          ) : (
            <>
              {/* Wings Results */}
              {matchedWings.length > 0 && (
                <div className="space-y-2">
                  <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-[#8B1E26]" /> Pasarai Wings ({matchedWings.length})
                  </span>
                  <div className="space-y-1.5">
                    {matchedWings.map(w => (
                      <div
                        key={w.id}
                        onClick={() => {
                          onSelectWing(w.id);
                          onClose();
                        }}
                        className="p-2.5 rounded-lg bg-slate-50 dark:bg-gray-800/80 hover:bg-[#FDF2F2] dark:hover:bg-red-950/40 cursor-pointer flex items-center justify-between transition-colors"
                      >
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white text-xs">{w.nameTamil} ({w.name})</p>
                          <p className="text-[11px] text-slate-500 dark:text-gray-400">{w.category} • {w.memberCount} members</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-[#8B1E26]" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Events Results */}
              {matchedEvents.length > 0 && (
                <div className="space-y-2">
                  <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#8B1E26]" /> Upcoming Events ({matchedEvents.length})
                  </span>
                  <div className="space-y-1.5">
                    {matchedEvents.map(e => (
                      <div
                        key={e.id}
                        onClick={() => {
                          onSelectTab('events');
                          onClose();
                        }}
                        className="p-2.5 rounded-lg bg-slate-50 dark:bg-gray-800/80 hover:bg-[#FDF2F2] dark:hover:bg-red-950/40 cursor-pointer flex items-center justify-between transition-colors"
                      >
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white text-xs">{e.titleTamil}</p>
                          <p className="text-[11px] text-slate-500 dark:text-gray-400">Date: {e.date} • {e.district}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-[#8B1E26]" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* News Results */}
              {matchedNews.length > 0 && (
                <div className="space-y-2">
                  <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] flex items-center gap-1">
                    <Newspaper className="w-3.5 h-3.5 text-[#8B1E26]" /> Latest News ({matchedNews.length})
                  </span>
                  <div className="space-y-1.5">
                    {matchedNews.map(n => (
                      <div
                        key={n.id}
                        onClick={() => {
                          onSelectTab('news');
                          onClose();
                        }}
                        className="p-2.5 rounded-lg bg-slate-50 dark:bg-gray-800/80 hover:bg-[#FDF2F2] dark:hover:bg-red-950/40 cursor-pointer flex items-center justify-between transition-colors"
                      >
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white text-xs">{n.title}</p>
                          <p className="text-[11px] text-slate-500 dark:text-gray-400">{n.category} • {n.date}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-[#8B1E26]" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {matchedWings.length === 0 && matchedEvents.length === 0 && matchedNews.length === 0 && (
                <div className="py-6 text-center text-slate-500">
                  No matching results found for "{query}".
                </div>
              )}
            </>
          )}

        </div>

      </div>
    </div>
  );
};
