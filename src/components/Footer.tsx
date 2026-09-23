import React from 'react';
import { Phone, Mail, MapPin, Globe } from 'lucide-react';
import { PASARAI_WINGS } from '../data/mockData';

interface FooterProps {
  onOpenJoinModal: () => void;
  onOpenDonateModal: () => void;
  onOpenVerifyModal: () => void;
  onSelectPasarai: (pasaraiId: string) => void;
  currentLang: 'en' | 'ta';
}

export const Footer: React.FC<FooterProps> = ({
  onOpenJoinModal,
  onOpenDonateModal,
  onOpenVerifyModal,
  onSelectPasarai,
  currentLang
}) => {
  return (
    <footer className="bg-[#181B20] text-gray-300 pt-16 pb-12 border-t-4 border-yellow-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-gray-800">
          
          {/* Org Info Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center text-2xl shadow-lg">
                🏛️
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-white tracking-tight">TAMIL SANGAM</h3>
                <p className="text-xs text-yellow-400 font-semibold">தமிழ் சங்கம் - தமிழ்நாடு</p>
              </div>
            </div>

            <p className="text-xs text-gray-400 leading-relaxed">
              {currentLang === 'ta'
                ? 'தமிழ் சங்கம் - தமிழ்நாடு டிஜிட்டல் உறுப்பினர் மற்றும் நிர்வாக மேலாண்மைத் தளம். 38 மாவட்டங்கள் மற்றும் 23 பாசறைகளின் ஒருங்கிணைந்த மக்கள் இயக்கம்.'
                : 'Tamil Sangam – Tamil Nadu Digital Membership & Organisation Management Portal. Connecting Tamil lovers across 38 districts and 23 specialized Pasarai wings.'}
            </p>

            <div className="pt-2 flex flex-wrap gap-2">
              <button
                onClick={onOpenJoinModal}
                className="text-xs font-bold bg-yellow-400 text-[#181B20] px-3 py-1.5 rounded hover:bg-yellow-300 transition-colors"
              >
                {currentLang === 'ta' ? 'இணைந்திடுக' : 'Join Membership'}
              </button>
              <button
                onClick={onOpenDonateModal}
                className="text-xs font-bold bg-rose-600 text-white px-3 py-1.5 rounded hover:bg-rose-500 transition-colors"
              >
                {currentLang === 'ta' ? 'நன்கொடை அளி' : 'Donate Now'}
              </button>
            </div>
          </div>

          {/* Quick Links & Services */}
          <div>
            <h4 className="font-bold text-white text-sm tracking-wide uppercase border-l-2 border-yellow-400 pl-2.5 mb-4">
              {currentLang === 'ta' ? 'சேவைகள் & வசதிகள்' : 'Portal Services'}
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={onOpenJoinModal} className="hover:text-yellow-400 transition-colors flex items-center gap-1.5">
                  <span className="text-yellow-400">›</span> Online Membership Application
                </button>
              </li>
              <li>
                <button onClick={onOpenVerifyModal} className="hover:text-yellow-400 transition-colors flex items-center gap-1.5">
                  <span className="text-yellow-400">›</span> Verify Digital Membership Card
                </button>
              </li>
              <li>
                <button onClick={onOpenDonateModal} className="hover:text-yellow-400 transition-colors flex items-center gap-1.5">
                  <span className="text-yellow-400">›</span> Online Donation & Automated PDF Receipt
                </button>
              </li>
              <li>
                <a href="#events" className="hover:text-yellow-400 transition-colors flex items-center gap-1.5">
                  <span className="text-yellow-400">›</span> Upcoming Sangam Events & Registration
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-yellow-400 transition-colors flex items-center gap-1.5">
                  <span className="text-yellow-400">›</span> Vision, Mission & Objectives
                </a>
              </li>
            </ul>
          </div>

          {/* 23 Wings / Pasarai Sample Column */}
          <div>
            <h4 className="font-bold text-white text-sm tracking-wide uppercase border-l-2 border-yellow-400 pl-2.5 mb-4">
              {currentLang === 'ta' ? '23 பாசறைகள்' : '23 Wings (Pasarai)'}
            </h4>
            <div className="grid grid-cols-1 gap-1.5 text-xs max-h-48 overflow-y-auto pr-2 scrollbar-thin">
              {PASARAI_WINGS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => onSelectPasarai(p.id)}
                  className="text-left text-gray-400 hover:text-yellow-400 truncate transition-colors py-0.5"
                >
                  <span className="text-yellow-400 mr-1">•</span> {currentLang === 'ta' ? p.nameTamil : p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Contact Details Column */}
          <div>
            <h4 className="font-bold text-white text-sm tracking-wide uppercase border-l-2 border-yellow-400 pl-2.5 mb-4">
              {currentLang === 'ta' ? 'தொடர்பு விவரங்கள்' : 'Contact Office'}
            </h4>
            <ul className="space-y-3 text-xs text-gray-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                <span>State Headquarters, Sangam Complex, Anna Salai, Chennai, Tamil Nadu - 600002, India</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-yellow-400 shrink-0" />
                <span>+91 44 2850 1000 / WhatsApp: +91 98401 23456</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-yellow-400 shrink-0" />
                <span>contact@tamilsangamtn.org</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Globe className="w-4 h-4 text-yellow-400 shrink-0" />
                <span>www.tamilsangamtn.org</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Footer Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© 2026 Tamil Sangam – Tamil Nadu. All Rights Reserved. Digital Membership & Organisation Management System.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-gray-400 cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-gray-400 cursor-pointer">Terms of Membership</span>
            <span>•</span>
            <span className="hover:text-gray-400 cursor-pointer">Aadhaar Data Protection</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
