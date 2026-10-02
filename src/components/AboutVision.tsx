import React from 'react';
import { Landmark, CheckCircle2 } from 'lucide-react';

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
  return (
    <div className="bg-[#FAF8F5] dark:bg-slate-950 text-slate-800 dark:text-gray-100 py-12 transition-colors duration-300 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Top Page Header */}
        <div className="bg-[#8B1E26] text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden min-h-[220px] flex items-center">
          <div className="absolute right-0 top-0 bottom-0 w-full sm:w-1/2 opacity-30 sm:opacity-50 pointer-events-none overflow-hidden">
            <img src="/hero-temple.jpg" alt="Madurai Meenakshi Temple" className="w-full h-full object-cover object-right" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#8B1E26] via-[#8B1E26]/60 to-transparent" />
          </div>
          
          <div className="max-w-2xl space-y-4 relative z-10">
            <span className="bg-white/20 backdrop-blur-md text-white font-black text-xs px-3.5 py-1.5 rounded-full uppercase tracking-widest border border-white/30">
              ORGANISATION FOUNDATION & HERITAGE
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight font-heading">
              {currentLang === 'ta' ? (
                <>
                  தமிழ் சங்கம் - தமிழ்நாடு <br />
                  <span className="text-yellow-300">வரலாறு, தொலைநோக்கு & குறிக்கோள்</span>
                </>
              ) : (
                <>
                  TAMIL SANGAM – TAMIL NADU <br />
                  <span className="text-yellow-300">History, Vision & Strategic Roadmap</span>
                </>
              )}
            </h1>
            <p className="text-sm sm:text-base text-gray-100 leading-relaxed max-w-xl">
              Preserving ancient Sangam literature, empowering 23 specialized Pasarai wings, protecting classical Tamil heritage, and building a 100% digitally verified network across all 38 districts of Tamil Nadu.
            </p>
          </div>
        </div>

        {/* SECTION 1: Historical Legacy & Sangam Heritage with Visible Temple Image on Right Side */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center gap-2 bg-[#8B1E26]/10 text-[#8B1E26] dark:text-red-400 text-xs font-extrabold px-3 py-1.5 rounded-full border border-[#8B1E26]/20">
              <Landmark className="w-4 h-4 text-[#8B1E26] dark:text-red-400" />
              <span>Ancient Roots & Modern Renaissance</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-heading">
              {currentLang === 'ta' ? 'முச்சங்க வரலாறு & தமிழ் சங்கம் நெறி' : 'The Legacy of Three Sangams & Modern Renaissance'}
            </h2>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              The original Tamil Sangam assemblies in ancient Madurai (First, Second, and Third Sangam) preserved Thirukkural, Silappathikaram, Manimekalai, Purananuru, and Akananuru. Today, **Tamil Sangam – Tamil Nadu** operates as the premier digital membership and cultural management trust keeping that legacy vibrant for generations to come.
            </p>
            <ul className="space-y-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#8B1E26] dark:text-red-400 shrink-0" /> Preservation of ancient manuscripts and palm-leaf digitalization.
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#8B1E26] dark:text-red-400 shrink-0" /> Thirukkural research symposiums in schools and universities.
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#8B1E26] dark:text-red-400 shrink-0" /> Global diaspora Tamil Sangam coordination across 25+ countries.
              </li>
            </ul>
          </div>

          {/* Right Side Visible Background Image Card */}
          <div className="lg:col-span-6 space-y-4">
            <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-gray-800 relative aspect-[4/3] group">
              <img 
                src="/hero-temple.jpg" 
                alt="Madurai Meenakshi Amman Temple Heritage" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-6 flex flex-col justify-end">
                <span className="bg-[#8B1E26] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full w-fit uppercase tracking-wider mb-1">
                  HISTORICAL LANDMARK
                </span>
                <h3 className="text-xl font-extrabold text-white font-heading">Madurai Meenakshi Temple & Golden Pond</h3>
                <p className="text-xs text-gray-200 mt-1">Seat of the Ancient Tamil Sangam Assemblies</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white dark:bg-[#1E232B] p-3 rounded-xl border border-slate-200 dark:border-gray-800 text-center shadow-sm">
                <h4 className="font-extrabold text-xs text-[#8B1E26] dark:text-red-400">Mudhal Sangam</h4>
                <p className="text-[10px] text-slate-500 dark:text-gray-400">Thenmadurai</p>
              </div>
              <div className="bg-white dark:bg-[#1E232B] p-3 rounded-xl border border-slate-200 dark:border-gray-800 text-center shadow-sm">
                <h4 className="font-extrabold text-xs text-[#8B1E26] dark:text-red-400">Idai Sangam</h4>
                <p className="text-[10px] text-slate-500 dark:text-gray-400">Kapatapuram</p>
              </div>
              <div className="bg-white dark:bg-[#1E232B] p-3 rounded-xl border border-slate-200 dark:border-gray-800 text-center shadow-sm">
                <h4 className="font-extrabold text-xs text-[#8B1E26] dark:text-red-400">Kadaichangam</h4>
                <p className="text-[10px] text-slate-500 dark:text-gray-400">Madurai</p>
              </div>
              <div className="bg-white dark:bg-[#1E232B] p-3 rounded-xl border border-slate-200 dark:border-gray-800 text-center shadow-sm">
                <h4 className="font-extrabold text-xs text-[#8B1E26] dark:text-red-400">Digital Sangam</h4>
                <p className="text-[10px] text-slate-500 dark:text-gray-400">38 Districts</p>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: 10 Core Pillars of Tamil Sangam Portal */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-200 dark:border-slate-800 space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="bg-slate-900 dark:bg-yellow-400 text-yellow-400 dark:text-slate-950 text-xs font-black px-3 py-1 rounded uppercase tracking-wider">
              Management Framework
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {currentLang === 'ta' ? 'தமிழ் சங்கத்தின் 10 முக்கியத் தூண்கள்' : '10 Core Pillars of Organisation Governance'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Structured execution ensuring transparency, digital verification, and community service.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 text-xs">
            {[
              { num: '01', title: 'Mobile OTP Onboarding', desc: 'Secure 10-digit mobile verification before application access.' },
              { num: '02', title: 'Aadhaar Data Privacy', desc: 'Encrypted document vault restricted strictly to State Admin.' },
              { num: '03', title: '23 Pasarai Wings', desc: 'Specialized wings for Youth, Women, IT, Literature, Legal, & Farmers.' },
              { num: '04', title: '38 District Hierarchy', desc: 'State → District → Taluk → Village → Local Unit structure.' },
              { num: '05', title: 'Digital ID Cards', desc: 'Dual-sided printable card with official hologram & signature.' },
              { num: '06', title: 'Public QR Verification', desc: 'Instant QR code verification displaying active member badge.' },
              { num: '07', title: 'Donation Receipts', desc: '80G trust tax receipts generated automatically with PDF export.' },
              { num: '08', title: 'WhatsApp & Email API', desc: 'Direct automated dispatch of ID cards and donation receipts.' },
              { num: '09', title: 'Certificates Vault', desc: 'Verified certificates for event participation & volunteers.' },
              { num: '10', title: 'Role-based Admin', desc: 'Super Admin, District Admin, and Finance Admin permissions.' },
            ].map((p, idx) => (
              <div key={idx} className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-xl space-y-1 hover:border-yellow-400 transition-colors">
                <span className="font-extrabold text-amber-600 dark:text-yellow-400 text-sm">{p.num}</span>
                <h4 className="font-bold text-slate-900 dark:text-white text-xs">{p.title}</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 3: Vision 2030 Strategic Roadmap */}
        <div className="bg-[#181B20] text-white rounded-3xl p-8 sm:p-12 shadow-2xl border-t-4 border-yellow-400 space-y-8">
          <div className="max-w-2xl space-y-2">
            <span className="text-yellow-400 text-xs font-bold tracking-widest uppercase">Future Roadmap</span>
            <h2 className="text-3xl font-extrabold text-white">Vision 2030 Strategic Goals</h2>
            <p className="text-xs text-gray-300">Empowering 500,000 active members and digital Tamil centers worldwide.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div className="bg-[#22262E] p-6 rounded-2xl border border-gray-800 space-y-3">
              <span className="bg-yellow-400 text-slate-950 font-black px-2 py-0.5 rounded text-[10px]">GOAL 1</span>
              <h3 className="font-bold text-base text-white">100% District Local Units</h3>
              <p className="text-gray-300">Establish functioning local units in all 314 Taluks and 12,500 Village Panchayats across Tamil Nadu.</p>
            </div>

            <div className="bg-[#22262E] p-6 rounded-2xl border border-gray-800 space-y-3">
              <span className="bg-yellow-400 text-slate-950 font-black px-2 py-0.5 rounded text-[10px]">GOAL 2</span>
              <h3 className="font-bold text-base text-white">Digital Tamil Library & AI</h3>
              <p className="text-gray-300">Launch open source Tamil LLM datasets, manuscript digitization, and Thirukkural mobile learning tools.</p>
            </div>

            <div className="bg-[#22262E] p-6 rounded-2xl border border-gray-800 space-y-3">
              <span className="bg-yellow-400 text-slate-950 font-black px-2 py-0.5 rounded text-[10px]">GOAL 3</span>
              <h3 className="font-bold text-base text-white">Youth & Student Welfare</h3>
              <p className="text-gray-300">Provide 10,000 annual student scholarships and TNPSC/UPSC coaching for rural students.</p>
            </div>
          </div>

          <div className="pt-4 text-center">
            {isLoggedIn ? (
              <button
                onClick={onGoToDashboard}
                className="bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-extrabold px-8 py-3.5 rounded-xl shadow-xl uppercase text-xs tracking-wider cursor-pointer"
              >
                {currentLang === 'ta' ? 'உறுப்பினர் பலகை (GO TO DASHBOARD)' : 'GO TO MY MEMBER DASHBOARD'}
              </button>
            ) : (
              <button
                onClick={onOpenJoinModal}
                className="bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-extrabold px-8 py-3.5 rounded-xl shadow-xl uppercase text-xs tracking-wider cursor-pointer"
              >
                BECOME A MEMBER TODAY
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
