import React, { useState } from 'react';
import { getNews } from '../services/storageService';
import type { NewsItem } from '../types';
import { Calendar, Search, ArrowRight, X } from 'lucide-react';

interface NewsPageProps {
  currentLang: 'en' | 'ta';
}

export const NewsPage: React.FC<NewsPageProps> = ({ currentLang }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<NewsItem | null>(null);

  const newsList = getNews();

  const categories = [
    { id: 'ALL', labelTa: 'அனைத்தும்', labelEn: 'All Updates' },
    { id: 'News', labelTa: 'செய்திகள்', labelEn: 'News' },
    { id: 'Press Release', labelTa: 'செய்தி அறிக்கை', labelEn: 'Press Release' },
    { id: 'Announcement', labelTa: 'அறிவிப்பு', labelEn: 'Announcement' },
    { id: 'Circular', labelTa: 'சுற்றறிக்கை', labelEn: 'Circular' },
    { id: 'Public Notice', labelTa: 'பொது அறிவிப்பு', labelEn: 'Public Notice' }
  ];

  const filteredNews = newsList.filter(item => {
    const matchesCat = selectedCategory === 'ALL' || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.titleTamil.includes(searchQuery) || 
                          item.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const getCategoryLabel = (cat: string) => {
    const found = categories.find(c => c.id === cat);
    if (!found) return cat;
    return currentLang === 'ta' ? found.labelTa : found.labelEn;
  };

  return (
    <div className="bg-[#FAF8F5] dark:bg-slate-950 text-slate-800 dark:text-gray-100 py-12 transition-colors duration-300 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Banner Header - Royal Maroon matching Home Page */}
        <div className="bg-[#8B1E26] text-white rounded-3xl p-8 sm:p-10 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="relative z-10">
            <span className="bg-white/20 text-white font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider border border-white/20">
              {currentLang === 'ta' ? 'அதிகாரப்பூர்வ செய்திகள் & சுற்றறிக்கைகள்' : 'MEDIA & ANNOUNCEMENTS'}
            </span>
            <h1 className="text-3xl font-extrabold text-white mt-2 font-heading">
              {currentLang === 'ta' ? 'செய்திகள் & அதிகாரப்பூர்வ அறிவிப்புகள்' : 'News, Press Releases & Circulars'}
            </h1>
            <p className="text-xs text-gray-100 mt-1 max-w-xl">
              {currentLang === 'ta'
                ? 'மாநில தலைமைச் செயலகம் மற்றும் 38 மாவட்டக் கிளைகளின் அதிகாரப்பூர்வ செய்தி அறிக்கைகள், அறிவிப்புகள்.'
                : 'Official press releases, policy circulars, district activities, and state announcements.'}
            </p>
          </div>

          <div className="relative w-full md:w-72 z-10">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-300" />
            <input
              type="text"
              placeholder={currentLang === 'ta' ? 'செய்திகளைத் தேடுக...' : 'Search announcements...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-black/20 border border-white/30 rounded-xl text-xs font-semibold text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white"
            />
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-bold border-b border-slate-200 dark:border-slate-800 pb-4">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#8B1E26] text-white shadow-md font-extrabold'
                  : 'bg-white dark:bg-[#1E232B] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-gray-800 border border-slate-200/80 dark:border-gray-800'
              }`}
            >
              {currentLang === 'ta' ? cat.labelTa : cat.labelEn}
            </button>
          ))}
        </div>

        {/* Selected Article Detail View */}
        {selectedArticle && (
          <div className="bg-white dark:bg-[#1E232B] rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-[#8B1E26] space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-gray-800 pb-3">
              <span className="bg-[#FDF2F2] dark:bg-red-950/60 text-[#8B1E26] dark:text-red-400 font-extrabold text-xs px-3 py-1 rounded-lg border border-[#8B1E26]/20">
                {getCategoryLabel(selectedArticle.category)}
              </span>
              <button
                onClick={() => setSelectedArticle(null)}
                className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-[#8B1E26] dark:hover:text-white cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <span>{currentLang === 'ta' ? 'மூடுக' : 'Close Article'}</span>
                <X className="w-4 h-4" />
              </button>
            </div>

            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white font-heading">
              {currentLang === 'ta' ? selectedArticle.titleTamil : selectedArticle.title}
            </h2>
            <h3 className="text-sm font-semibold text-[#8B1E26] dark:text-red-400">
              {currentLang === 'ta' ? selectedArticle.title : selectedArticle.titleTamil}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#8B1E26] dark:text-red-400" />
              <span>{currentLang === 'ta' ? 'வெளியிடப்பட்ட நாள்: ' : 'Published on: '}{selectedArticle.date}</span>
            </p>

            <div className="bg-slate-50 dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-200/80 dark:border-gray-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed space-y-3">
              <p className="font-bold text-sm text-slate-900 dark:text-white leading-relaxed">{selectedArticle.summary}</p>
              <p className="leading-relaxed">{selectedArticle.content}</p>
            </div>
          </div>
        )}

        {/* News Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNews.map(item => (
            <div
              key={item.id}
              onClick={() => setSelectedArticle(item)}
              className="cursor-pointer bg-white dark:bg-[#1E232B] rounded-2xl overflow-hidden border border-slate-200/80 dark:border-gray-800 shadow-md hover:shadow-xl hover:border-[#8B1E26] transition-all flex flex-col justify-between group"
            >
              {/* Top Accent Strip in Royal Maroon */}
              <div className="h-1.5 bg-[#8B1E26]" />

              <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-2.5">
                    <span className="bg-[#FDF2F2] dark:bg-red-950/60 text-[#8B1E26] dark:text-red-400 font-extrabold px-2.5 py-0.5 rounded-md border border-[#8B1E26]/20 uppercase">
                      {getCategoryLabel(item.category)}
                    </span>
                    <span className="flex items-center gap-1.5 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-[#8B1E26] dark:text-red-400" /> {item.date}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white line-clamp-2 font-heading group-hover:text-[#8B1E26] dark:group-hover:text-red-400 transition-colors">
                    {currentLang === 'ta' ? item.titleTamil : item.title}
                  </h3>
                  <p className="text-xs font-semibold text-[#8B1E26] dark:text-red-400/90 mb-2 line-clamp-1">
                    {currentLang === 'ta' ? item.title : item.titleTamil}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                    {item.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-gray-800 flex items-center justify-between text-xs font-bold text-[#8B1E26] dark:text-red-400">
                  <span>{currentLang === 'ta' ? 'முழு செய்தியை வாசிக்க' : 'Read Full Article'}</span>
                  <ArrowRight className="w-4 h-4 text-[#8B1E26] dark:text-red-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
