import React, { useState } from 'react';
import type { MemberApplication } from '../../types';
import { getMemberById } from '../../services/storageService';
import { ShieldCheck, CheckCircle2, AlertTriangle, Search, Lock, X } from 'lucide-react';

interface PublicVerificationProps {
  initialSearchId?: string;
  onClose: () => void;
  currentLang: 'en' | 'ta';
}

export const PublicVerification: React.FC<PublicVerificationProps> = ({
  initialSearchId,
  onClose,
  currentLang
}) => {
  const [searchQuery, setSearchQuery] = useState(initialSearchId || '');
  const [searchedMember, setSearchedMember] = useState<MemberApplication | undefined>(
    initialSearchId ? getMemberById(initialSearchId) : undefined
  );
  const [hasSearched, setHasSearched] = useState(!!initialSearchId);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const found = getMemberById(searchQuery.trim());
    setSearchedMember(found);
    setHasSearched(true);
  };

  return (
    <div 
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm overflow-y-auto"
    >
      <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 my-8 relative">
        
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-lg cursor-pointer"
          title="Close"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Verification Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-14 h-14 bg-[#8B1E26]/10 text-[#8B1E26] dark:text-red-400 rounded-full flex items-center justify-center mx-auto shadow-inner border border-[#8B1E26]/30">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white font-heading">
            {currentLang === 'ta' ? 'தமிழ் சங்கம் - உறுப்பினர் சரிபார்ப்பு' : 'Official Membership Verification Portal'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {currentLang === 'ta' ? 'QR அட்டை / உறுப்பினர் எண் உள்ளிட்டு சரிபார்க்கலாம்' : 'Enter Membership Number or Scan QR Code to verify validity'}
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="e.g. TS-TN-2026-000001 or APP-1001"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-12 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-[#8B1E26] focus:outline-none"
            />
            <button
              type="submit"
              className="absolute right-2 top-2 bg-[#8B1E26] hover:bg-[#72151C] text-white p-2 rounded-lg transition-colors cursor-pointer shadow"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Search Results */}
        {hasSearched && (
          <div>
            {searchedMember ? (
              <div className="space-y-4">
                
                {/* Status Verified Banner */}
                <div className={`p-4 rounded-xl border flex items-center gap-3 ${
                  searchedMember.status === 'APPROVED'
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                    : 'bg-amber-50 border-amber-300 text-amber-900'
                }`}>
                  <CheckCircle2 className="w-6 h-6 shrink-0 text-emerald-600" />
                  <div>
                    <h4 className="font-extrabold text-sm uppercase tracking-wide">
                      {searchedMember.status === 'APPROVED' ? 'OFFICIALLY VERIFIED MEMBER ✓' : `STATUS: ${searchedMember.status}`}
                    </h4>
                    <p className="text-xs opacity-90">
                      Record matched in Tamil Sangam State Headquarters Central Register.
                    </p>
                  </div>
                </div>

                {/* Member Public Info Card */}
                <div className="bg-[#181B20] text-white p-5 rounded-2xl border border-gray-800 space-y-4 shadow-lg gold-header-strip">
                  
                  <div className="flex items-center gap-4">
                    <img
                      src={searchedMember.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                      alt={searchedMember.fullName}
                      className="w-16 h-20 rounded-lg object-cover border-2 border-yellow-400 shrink-0"
                    />
                    <div>
                      <h4 className="font-extrabold text-lg text-white">{searchedMember.fullName}</h4>
                      <p className="text-xs font-semibold text-yellow-400">{searchedMember.nameTamil}</p>
                      <span className="inline-block mt-1 bg-yellow-400 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded">
                        {searchedMember.categoryName}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs border-t border-gray-800 pt-3">
                    <div>
                      <span className="text-gray-400 block text-[10px]">Membership No:</span>
                      <span className="font-mono font-bold text-amber-300">{searchedMember.membershipNumber || searchedMember.id}</span>
                    </div>

                    <div>
                      <span className="text-gray-400 block text-[10px]">District / Local Unit:</span>
                      <span className="font-bold text-white">{searchedMember.district}</span>
                    </div>

                    <div>
                      <span className="text-gray-400 block text-[10px]">Pasarai Wing:</span>
                      <span className="font-bold text-white">{searchedMember.pasaraiName}</span>
                    </div>

                    <div>
                      <span className="text-gray-400 block text-[10px]">Status:</span>
                      <span className="font-extrabold text-emerald-400">ACTIVE</span>
                    </div>
                  </div>

                </div>

                {/* Privacy Guarantee Box */}
                <div className="bg-slate-100 p-3 rounded-xl border border-slate-200 text-[11px] text-slate-600 flex items-start gap-2">
                  <Lock className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                  <span>
                    Privacy Shield Active: Aadhaar number, Mobile number, Email, and exact street address are hidden from public verification in compliance with data privacy regulations.
                  </span>
                </div>

              </div>
            ) : (
              <div className="text-center p-6 bg-red-50 border border-red-200 rounded-xl space-y-2">
                <AlertTriangle className="w-8 h-8 text-red-500 mx-auto" />
                <h4 className="font-bold text-sm text-red-900">No Verified Member Found</h4>
                <p className="text-xs text-red-700">
                  No active membership record matches "{searchQuery}". Please check the membership number format.
                </p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
