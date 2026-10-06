import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';

interface FooterProps {
  onOpenJoinModal: () => void;
  onOpenDonateModal: () => void;
  onOpenVerifyModal: () => void;
  onSelectPasarai?: (pasaraiId: string) => void;
  currentLang: 'en' | 'ta';
  setActiveTab?: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenJoinModal,
  onOpenDonateModal,
  onOpenVerifyModal,
  setActiveTab
}) => {
  return (
    <footer className="bg-white dark:bg-[#12151B] text-slate-700 dark:text-gray-300 pt-16 pb-8 border-t border-slate-200/80 dark:border-gray-800 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-200/80 dark:border-gray-800">
          
          {/* Column 1: Org Logo & Description */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#8B1E26] via-[#B8860B] to-[#600D13] p-0.5 shadow-md shrink-0">
                <div className="w-full h-full rounded-full overflow-hidden border border-amber-300/40 bg-[#FDF2F2]">
                  <img src="/tamil-sangam-logo.jpg" alt="தமிழ் சங்கம்" className="w-full h-full object-cover object-center" />
                </div>
              </div>
              <div>
                <h3 className="font-extrabold text-base text-[#8B1E26] dark:text-red-400 font-heading leading-tight">TAMIL SANGAM</h3>
                <p className="text-[10px] font-bold tracking-widest text-slate-500 dark:text-gray-400 uppercase -mt-0.5">TAMIL NADU</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-gray-400 leading-relaxed max-w-sm">
              Working for the development of Tamil language, culture and community through people's participation.
            </p>

            {/* Social Media Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="w-8 h-8 rounded-full bg-slate-100 dark:bg-gray-800 flex items-center justify-center text-slate-600 dark:text-gray-300 hover:bg-[#8B1E26] hover:text-white transition-colors" aria-label="Facebook">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-slate-100 dark:bg-gray-800 flex items-center justify-center text-slate-600 dark:text-gray-300 hover:bg-[#8B1E26] hover:text-white transition-colors" aria-label="Instagram">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-slate-100 dark:bg-gray-800 flex items-center justify-center text-slate-600 dark:text-gray-300 hover:bg-[#8B1E26] hover:text-white transition-colors" aria-label="YouTube">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-slate-100 dark:bg-gray-800 flex items-center justify-center text-slate-600 dark:text-gray-300 hover:bg-[#8B1E26] hover:text-white transition-colors" aria-label="X (Twitter)">
                <span className="font-bold text-xs">X</span>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-bold text-slate-900 dark:text-white text-xs tracking-wider uppercase">Quick Links</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => { if (setActiveTab) setActiveTab('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-[#8B1E26] dark:hover:text-red-400 transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => { if (setActiveTab) setActiveTab('about'); }} className="hover:text-[#8B1E26] dark:hover:text-red-400 transition-colors">
                  About
                </button>
              </li>
              <li>
                <button onClick={onOpenJoinModal} className="hover:text-[#8B1E26] dark:hover:text-red-400 transition-colors">
                  Membership
                </button>
              </li>
              <li>
                <button onClick={() => { if (setActiveTab) setActiveTab('events'); }} className="hover:text-[#8B1E26] dark:hover:text-red-400 transition-colors">
                  Events
                </button>
              </li>
              <li>
                <button onClick={() => { if (setActiveTab) setActiveTab('news'); }} className="hover:text-[#8B1E26] dark:hover:text-red-400 transition-colors">
                  News
                </button>
              </li>
              <li>
                <button onClick={() => { if (setActiveTab) setActiveTab('gallery'); }} className="hover:text-[#8B1E26] dark:hover:text-red-400 transition-colors">
                  Gallery
                </button>
              </li>
              <li>
                <button onClick={onOpenDonateModal} className="hover:text-[#8B1E26] dark:hover:text-red-400 transition-colors">
                  Donate
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Useful Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-bold text-slate-900 dark:text-white text-xs tracking-wider uppercase">Useful Links</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={onOpenVerifyModal} className="hover:text-[#8B1E26] dark:hover:text-red-400 transition-colors">
                  Verify Membership
                </button>
              </li>
              <li>
                <button onClick={onOpenJoinModal} className="hover:text-[#8B1E26] dark:hover:text-red-400 transition-colors">
                  Member Login
                </button>
              </li>
              <li>
                <button onClick={() => { if (setActiveTab) setActiveTab('pasarai'); }} className="hover:text-[#8B1E26] dark:hover:text-red-400 transition-colors">
                  Wings / Pasarai
                </button>
              </li>
              <li>
                <button onClick={() => { if (setActiveTab) setActiveTab('contact'); }} className="hover:text-[#8B1E26] dark:hover:text-red-400 transition-colors">
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Us & Map Preview */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-bold text-slate-900 dark:text-white text-xs tracking-wider uppercase">Contact Us</h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-gray-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#8B1E26] dark:text-red-400 shrink-0 mt-0.5" />
                <span>123, Tamil Sangam Building, Chennai, Tamil Nadu - 600001</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#8B1E26] dark:text-red-400 shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#8B1E26] dark:text-red-400 shrink-0" />
                <span>info@tamilsangam.org</span>
              </li>
            </ul>

            {/* Mini Map Preview Graphic */}
            <div className="mt-3 rounded-lg overflow-hidden border border-slate-200 dark:border-gray-800 shadow-sm relative h-20 bg-slate-100">
              <img 
                src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=400&auto=format&fit=crop" 
                alt="Location Map Preview Chennai" 
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-[#8B1E26] text-white flex items-center justify-center shadow-lg animate-bounce">
                  <MapPin className="w-3.5 h-3.5 fill-white" />
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Footer Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-gray-500">
          <p>© 2026 Tamil Sangam - Tamil Nadu. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-700 dark:hover:text-gray-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-700 dark:hover:text-gray-400 cursor-pointer">Terms & Conditions</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

