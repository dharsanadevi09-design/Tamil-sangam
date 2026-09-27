import React from 'react';
import { Sparkles, QrCode, Users, MapPin, Heart, ArrowRight, CheckCircle } from 'lucide-react';

interface HeroProps {
  onOpenJoinModal: () => void;
  onOpenDonateModal: () => void;
  onOpenVerifyModal: () => void;
  currentLang: 'en' | 'ta';
}

export const Hero: React.FC<HeroProps> = ({
  onOpenJoinModal,
  onOpenDonateModal,
  onOpenVerifyModal,
  currentLang
}) => {
  return (
    <div className="relative bg-slate-100 dark:bg-[#181B20] text-slate-900 dark:text-white overflow-hidden border-b border-slate-200 dark:border-gray-800 transition-colors duration-300">
      
      {/* Decorative Golden Ambient Gradients */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Banner Hero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            <div className="inline-flex items-center gap-2 bg-yellow-400/20 dark:bg-yellow-400/15 border border-yellow-500/40 text-amber-900 dark:text-yellow-400 text-xs font-bold px-3 py-1.5 rounded-full">
              <Sparkles className="w-4 h-4 text-amber-600 dark:text-yellow-400" />
              <span>
                {currentLang === 'ta'
                  ? 'தமிழ் சங்கம் - தமிழ்நாடு அதிகாரப்பூர்வ இணையதளம்'
                  : 'OFFICIAL DIGITAL PORTAL - TAMIL NADU'}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
              {currentLang === 'ta' ? (
                <>
                  <span className="text-amber-600 dark:text-yellow-400">தமிழ் சங்கம்</span> - தமிழ்நாடு <br />
                  டிஜிட்டல் உறுப்பினர் & அமைப்புக் கட்டமைப்பு
                </>
              ) : (
                <>
                  <span className="text-amber-600 dark:text-yellow-400">TAMIL SANGAM</span> – TAMIL NADU <br />
                  Digital Membership & Organisation Management Portal
                </>
              )}
            </h1>

            <p className="text-sm sm:text-base text-slate-700 dark:text-gray-300 max-w-2xl leading-relaxed">
              {currentLang === 'ta'
                ? 'தமிழ்நாட்டின் 38 மாவட்டங்கள் மற்றும் 23 பாசறைகளை இணைக்கும் டிஜிட்டல் உறுப்பினர் சேர்க்கை, உடனடி அலைபேசி OTP சரிபார்ப்பு, ஆதார் தரவு பாதுகாப்பு, டிஜிட்டல் உறுப்பினர் அட்டை, QR அட்டை சரிபார்ப்பு மற்றும் தானியங்கி நன்கொடை ரசீது மேலாண்மைத் தளம்.'
                : 'A comprehensive digital ecosystem supporting online mobile OTP verification, Aadhaar document privacy, online fee payment, automated Digital ID Cards with QR code verification, 23 specialized Pasarai wings, and instant donation receipt generation.'}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onOpenJoinModal}
                className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-[#181B20] text-sm font-extrabold px-6 py-3.5 rounded-xl shadow-xl hover:shadow-yellow-400/25 transition-all transform hover:-translate-y-0.5 active:scale-95 uppercase tracking-wide cursor-pointer"
              >
                <Sparkles className="w-5 h-5" />
                <span>{currentLang === 'ta' ? 'உறுப்பினராக இணை' : 'JOIN TAMIL SANGAM'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenDonateModal}
                className="flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white text-sm font-bold px-5 py-3.5 rounded-xl shadow-lg transition-all active:scale-95 cursor-pointer"
              >
                <Heart className="w-4 h-4 fill-current" />
                <span>{currentLang === 'ta' ? 'நன்கொடை அளிக்க' : 'Donate Online'}</span>
              </button>

              <button
                onClick={onOpenVerifyModal}
                className="flex items-center gap-2 bg-white dark:bg-gray-800 hover:bg-slate-200 dark:hover:bg-gray-700 text-slate-800 dark:text-gray-200 border border-slate-300 dark:border-gray-700 text-sm font-semibold px-4 py-3.5 rounded-xl transition-all cursor-pointer shadow-sm"
              >
                <QrCode className="w-4 h-4 text-amber-600 dark:text-yellow-400" />
                <span>{currentLang === 'ta' ? 'அட்டை சரிபார்ப்பு' : 'Verify ID Card'}</span>
              </button>
            </div>

            {/* Enforced Membership Sequence Badges */}
            <div className="pt-4 border-t border-slate-300 dark:border-gray-800 text-xs text-slate-600 dark:text-gray-400 flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2">
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-amber-600 dark:text-yellow-400" />
                <span>Mobile OTP Verified</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-amber-600 dark:text-yellow-400" />
                <span>Secure Aadhaar Upload</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-amber-600 dark:text-yellow-400" />
                <span>Admin Approval Workflow</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-amber-600 dark:text-yellow-400" />
                <span>Digital ID & WhatsApp PDF</span>
              </div>
            </div>

          </div>

          {/* Right Cards Column */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            
            {/* Feature Card 1: 38 Districts Structure */}
            <div className="bg-white dark:bg-[#22262E] rounded-xl p-5 border border-slate-200 dark:border-gray-800 hover:border-yellow-400/50 transition-all gold-header-strip shadow-xl">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-bold text-amber-600 dark:text-yellow-400 uppercase tracking-wider">Structure</span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">38 Districts Management</h3>
                  <p className="text-xs text-slate-600 dark:text-gray-400 mt-1">State → District → Taluk → Village → Local Unit hierarchy.</p>
                </div>
                <div className="p-3 bg-yellow-400/10 rounded-lg text-amber-600 dark:text-yellow-400">
                  <MapPin className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Feature Card 2: 23 Pasarai Wings */}
            <div className="bg-white dark:bg-[#22262E] rounded-xl p-5 border border-slate-200 dark:border-gray-800 hover:border-yellow-400/50 transition-all gold-header-strip shadow-xl">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-bold text-amber-600 dark:text-yellow-400 uppercase tracking-wider">Wings / பாசறைகள்</span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">23 Wings (Pasarai)</h3>
                  <p className="text-xs text-slate-600 dark:text-gray-400 mt-1">Youth, Women, Students, IT, Literature, Legal, Sports, & 16 more.</p>
                </div>
                <div className="p-3 bg-yellow-400/10 rounded-lg text-amber-600 dark:text-yellow-400">
                  <Users className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Feature Card 3: Digital Membership ID Card */}
            <div className="bg-white dark:bg-[#22262E] rounded-xl p-5 border border-slate-200 dark:border-gray-800 hover:border-yellow-400/50 transition-all gold-header-strip shadow-xl">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-bold text-amber-600 dark:text-yellow-400 uppercase tracking-wider">Instant Verification</span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">Digital ID Card & QR Code</h3>
                  <p className="text-xs text-slate-600 dark:text-gray-400 mt-1">Automatic TS-TN-2026-XXXXXX generation with instant QR scan page.</p>
                </div>
                <div className="p-3 bg-yellow-400/10 rounded-lg text-amber-600 dark:text-yellow-400">
                  <QrCode className="w-6 h-6" />
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Counter Stats Bar */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 bg-white dark:bg-[#22262E]/90 backdrop-blur border border-slate-200 dark:border-gray-800 rounded-2xl p-6 shadow-2xl transition-colors">
          <div className="text-center border-r border-slate-200 dark:border-gray-800 last:border-0">
            <p className="text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-yellow-400">38</p>
            <p className="text-xs text-slate-600 dark:text-gray-400 font-medium mt-1">TN Districts Covered</p>
          </div>
          <div className="text-center border-r border-slate-200 dark:border-gray-800 last:border-0">
            <p className="text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-yellow-400">23</p>
            <p className="text-xs text-slate-600 dark:text-gray-400 font-medium mt-1">Specialized Pasarai Wings</p>
          </div>
          <div className="text-center border-r border-slate-200 dark:border-gray-800 last:border-0">
            <p className="text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-yellow-400">125,000+</p>
            <p className="text-xs text-slate-600 dark:text-gray-400 font-medium mt-1">Registered Members</p>
          </div>
          <div className="text-center">
            <p className="text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-yellow-400">100%</p>
            <p className="text-xs text-slate-600 dark:text-gray-400 font-medium mt-1">Digital QR Verified</p>
          </div>
        </div>

      </div>
    </div>
  );
};
