import React, { useState } from 'react';
import { getNews } from '../services/storageService';
import type { NewsItem } from '../types';
import { Calendar, Search, ArrowRight } from 'lucide-react';

interface NewsPageProps {
  currentLang: 'en' | 'ta';
}

export const NewsPage: React.FC<NewsPageProps> = ({ currentLang }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<NewsItem | null>(null);

  const newsList = getNews();

  const filteredNews = newsList.filter(item => {
    const matchesCat = selectedCategory === 'ALL' || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.titleTamil.includes(searchQuery) || item.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Banner Header */}
        <div className="bg-[#181B20] text-white rounded-3xl p-8 sm:p-10 shadow-2xl gold-header-strip flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <span className="bg-yellow-400 text-slate-950 font-black text-xs px-3 py-1 rounded uppercase tracking-wider">
              MEDIA & ANNOUNCEMENTS
            </span>
            <h1 className="text-3xl font-extrabold text-white mt-2">
              {currentLang === 'ta' ? 'செய்திகள் & அறிவிப்புகள்' : 'News, Press Releases & Circulars'}
            </h1>
            <p className="text-xs text-gray-300 mt-1">
              Official press releases, policy circulars, district activities, and state announcements.
            </p>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search announcements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-gray-900 border border-gray-700 rounded-xl text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-bold border-b border-slate-200 dark:border-slate-800 pb-4">
          {['ALL', 'News', 'Press Release', 'Announcement', 'Circular', 'Public Notice'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-slate-900 dark:bg-yellow-400 text-yellow-400 dark:text-slate-950 shadow font-extrabold'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {cat === 'ALL' ? 'All Updates' : cat}
            </button>
          ))}
        </div>

        {/* Selected Article Detail View */}
        {selectedArticle && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 shadow-2xl border-2 border-yellow-400 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <span className="bg-yellow-400 text-slate-950 font-black text-xs px-2.5 py-0.5 rounded">
                {selectedArticle.category}
              </span>
              <button
                onClick={() => setSelectedArticle(null)}
                className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                Close Article ✕
              </button>
            </div>

            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">{selectedArticle.titleTamil}</h2>
            <h3 className="text-base font-bold text-amber-700 dark:text-yellow-400">{selectedArticle.title}</h3>
            <p className="text-xs text-slate-400">Published on: {selectedArticle.date}</p>

            <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 leading-relaxed space-y-3">
              <p className="font-semibold text-slate-900 dark:text-white">{selectedArticle.summary}</p>
              <p>{selectedArticle.content}</p>
            </div>
          </div>
        )}

        {/* News Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNews.map(item => (
            <div
              key={item.id}
              onClick={() => setSelectedArticle(item)}
              className="cursor-pointer bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md hover:shadow-xl hover:border-yellow-400/60 transition-all flex flex-col justify-between"
            >
              <div className="h-2 bg-yellow-400" />

              <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 mb-2">
                    <span className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold px-2 py-0.5 rounded uppercase">
                      {item.category}
                    </span>
                    <span className="flex items-center gap-1 font-medium">
                      <Calendar className="w-3 h-3 text-amber-600 dark:text-yellow-400" /> {item.date}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white line-clamp-2">
                    {item.titleTamil}
                  </h3>
                  <p className="text-xs font-bold text-amber-700 dark:text-yellow-400 mb-2 line-clamp-1">
                    {item.title}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                    {item.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white">
                  <span>Read Full Article</span>
                  <ArrowRight className="w-4 h-4 text-amber-600 dark:text-yellow-400" />
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
