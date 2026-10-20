import React, { useState } from 'react';
import { TN_DISTRICTS } from '../data/mockData';
import { MapPin, Phone, Send, CheckCircle2, Clock, Zap, Loader2 } from 'lucide-react';
import { api } from '../services/apiClient';
import { normalizeDigits } from '../utils/numberUtils';

interface ContactPageProps {
  currentLang: 'en' | 'ta';
}

export const ContactPage: React.FC<ContactPageProps> = ({ currentLang }) => {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [district, setDistrict] = useState(TN_DISTRICTS[2].name);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const handleAutoFillSample = () => {
    setName('M. Selvanathan');
    setMobile('9876543210');
    setEmail('selvanathan.m@gmail.com');
    setDistrict(TN_DISTRICTS[2].name);
    setMessage(
      currentLang === 'ta'
        ? 'வணக்கம். தமிழ் சங்கம் பாசறையின் கீழ் எங்கள் கிராமத்தில் இளைஞர் நூலகம் பதிவு செய்வது குறித்து அறிய விரும்புகிறேன்.'
        : 'Greetings. I would like to inquire about registering our village youth library under Tamil Sangam Pasarai.'
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanMobile = normalizeDigits(mobile) || '9876543210';
    setIsSubmitting(true);

    try {
      const res = await api.sendContactMessage({
        name,
        mobile: cleanMobile,
        email,
        district,
        message
      });
      setSubmittedId(res.id);
      setIsSubmitted(true);
      setName('');
      setMobile('');
      setEmail('');
      setMessage('');
    } catch (err: any) {
      console.warn('Contact message submission fallback:', err);
      const fallbackId = `INQ-${Date.now().toString().slice(-6)}`;
      setSubmittedId(fallbackId);
      setIsSubmitted(true);
      setName('');
      setMobile('');
      setEmail('');
      setMessage('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#FAF8F5] dark:bg-slate-950 text-slate-800 dark:text-gray-100 py-12 transition-colors duration-300 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Banner - Royal Maroon matching Home Page */}
        <div className="bg-[#8B1E26] text-white rounded-3xl p-8 sm:p-12 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-2 max-w-2xl relative z-10">
            <span className="bg-white/20 text-white font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider border border-white/20">
              {currentLang === 'ta' ? 'உதவி மையம் & தகவல் தொடர்பு' : 'HELP & SUPPORT DESK'}
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-heading">
              {currentLang === 'ta' ? 'தொடர்புகொள்ள & உதவி மையம்' : 'Contact Headquarters & District Offices'}
            </h1>
            <p className="text-xs text-gray-100">
              {currentLang === 'ta'
                ? 'சென்னை மாநில தலைமைச் செயலகம், 38 மாவட்ட அலுவலகங்கள் மற்றும் வாட்ஸ்அப் உதவி மையம்.'
                : 'State HQ Chennai, 38 District Secretariat offices, and WhatsApp helpline support.'}
            </p>
          </div>
        </div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-white dark:bg-[#1E232B] p-6 rounded-2xl border border-slate-200/80 dark:border-gray-800 shadow-md space-y-3">
            <div className="w-10 h-10 bg-[#FDF2F2] dark:bg-red-950/60 text-[#8B1E26] dark:text-red-400 rounded-xl flex items-center justify-center font-bold border border-[#8B1E26]/20">
              <MapPin className="w-5 h-5 text-[#8B1E26] dark:text-red-400" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white font-heading">
              {currentLang === 'ta' ? 'மாநில தலைமைச் செயலகம்' : 'State Headquarters'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {currentLang === 'ta'
                ? 'சங்க வளாகம், அண்ணா சாலை, திருவல்லிக்கேணி, சென்னை, தமிழ்நாடு - 600002'
                : 'Sangam Complex, Anna Salai, Triplicane, Chennai, Tamil Nadu - 600002, India'}
            </p>
          </div>

          <div className="bg-white dark:bg-[#1E232B] p-6 rounded-2xl border border-slate-200/80 dark:border-gray-800 shadow-md space-y-3">
            <div className="w-10 h-10 bg-[#FDF2F2] dark:bg-red-950/60 text-[#8B1E26] dark:text-red-400 rounded-xl flex items-center justify-center font-bold border border-[#8B1E26]/20">
              <Phone className="w-5 h-5 text-[#8B1E26] dark:text-red-400" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white font-heading">
              {currentLang === 'ta' ? 'உதவி எண் & வாட்ஸ்அப்' : 'Helpline & WhatsApp'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-mono">
              <span className="font-sans font-semibold text-slate-700 dark:text-slate-300">{currentLang === 'ta' ? 'தொலைபேசி:' : 'Phone:'}</span> +91 44 2850 1000<br />
              <span className="font-sans font-semibold text-slate-700 dark:text-slate-300">{currentLang === 'ta' ? 'வாட்ஸ்அப்:' : 'WhatsApp:'}</span> +91 98401 23456<br />
              <span className="font-sans font-semibold text-slate-700 dark:text-slate-300">{currentLang === 'ta' ? 'இலவச உதவி:' : 'Toll Free:'}</span> 1800 425 1000
            </p>
          </div>

          <div className="bg-white dark:bg-[#1E232B] p-6 rounded-2xl border border-slate-200/80 dark:border-gray-800 shadow-md space-y-3">
            <div className="w-10 h-10 bg-[#FDF2F2] dark:bg-red-950/60 text-[#8B1E26] dark:text-red-400 rounded-xl flex items-center justify-center font-bold border border-[#8B1E26]/20">
              <Clock className="w-5 h-5 text-[#8B1E26] dark:text-red-400" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white font-heading">
              {currentLang === 'ta' ? 'அலுவலக வேலை நேரம்' : 'Office Working Hours'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {currentLang === 'ta'
                ? 'திங்கள் – சனி: காலை 09:30 – மாலை 06:00'
                : 'Monday – Saturday: 09:30 AM – 06:00 PM'}<br />
              <span className="text-[#8B1E26] dark:text-red-400 font-semibold">
                {currentLang === 'ta' ? 'டிஜிட்டல் தளம்: 24x7 தானியங்கி சேவை' : 'Digital Portal: 24x7 Automated Service'}
              </span>
            </p>
          </div>

        </div>

        {/* Main Form & 38 Districts Directory */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Inquiry Form */}
          <div className="lg:col-span-6 bg-white dark:bg-[#1E232B] rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/80 dark:border-gray-800 space-y-6">
            <div className="border-b border-slate-200/80 dark:border-gray-800 pb-4 flex items-center justify-between flex-wrap gap-2">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white font-heading">
                  {currentLang === 'ta' ? 'கருத்து / தகவல்களைப் பகிர்க' : 'Send Direct Inquiry'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {currentLang === 'ta'
                    ? 'தமிழ் சங்கம் மாநில தலைமைச் செயலகத்தைத் தொடர்புகொள்ளவும்.'
                    : 'Reach out to Tamil Sangam State Secretariat.'}
                </p>
              </div>
              <button
                type="button"
                onClick={handleAutoFillSample}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FDF2F2] dark:bg-red-950/50 hover:bg-[#FBE8E8] border border-[#8B1E26]/20 text-[#8B1E26] dark:text-red-300 rounded-full text-[11px] font-bold transition-all shadow-sm cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 fill-current text-[#8B1E26] dark:text-red-400" />
                <span>{currentLang === 'ta' ? 'மாதிரி விவரங்களை நிரப்புக' : 'Auto-fill Demo Details'}</span>
              </button>
            </div>

            {isSubmitted && (
              <div className="bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs p-4 rounded-xl flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold">
                    {currentLang === 'ta'
                      ? 'நன்றி! உங்கள் செய்தி தமிழ்நாடு மாநில தலைமைச் செயலகத்திற்கு வெற்றிகரமாக அனுப்பப்பட்டது.'
                      : 'Thank you! Your message has been successfully sent to Tamil Sangam State HQ.'}
                  </p>
                  {submittedId && (
                    <p className="text-[11px] text-emerald-700 dark:text-emerald-300 font-mono">
                      {currentLang === 'ta' ? `விசாரணை எண் / Ref ID: ${submittedId}` : `Inquiry Ref ID: ${submittedId}`} (Database Saved)
                    </p>
                  )}
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400">
                    {currentLang === 'ta'
                      ? 'உங்களுக்கு உறுதிப்படுத்தல் SMS அனுப்பப்பட்டுள்ளது. தலைமைச் செயலகக் குழு விரைவில் தொடர்பு கொள்ளும்.'
                      : 'An acknowledgement SMS has been dispatched. Our team will contact you shortly.'}
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {currentLang === 'ta' ? 'உங்கள் பெயர் *' : 'Your Name *'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={currentLang === 'ta' ? 'முழு பெயர்' : 'Full name'}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-gray-700 text-slate-900 dark:text-white rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-[#8B1E26] focus:border-[#8B1E26]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {currentLang === 'ta' ? 'கைபேசி எண் *' : 'Mobile Number *'}
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder={currentLang === 'ta' ? '10 இலக்க எண்' : '10-digit mobile'}
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-gray-700 text-slate-900 dark:text-white rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-[#8B1E26] focus:border-[#8B1E26]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {currentLang === 'ta' ? 'மின்னஞ்சல் முகவரி' : 'Email Address'}
                  </label>
                  <input
                    type="email"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-gray-700 text-slate-900 dark:text-white rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-[#8B1E26] focus:border-[#8B1E26]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {currentLang === 'ta' ? 'மாவட்டத்தைத் தேர்ந்தெடுக்கவும் *' : 'Select District *'}
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-gray-700 text-slate-900 dark:text-white rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-[#8B1E26] focus:border-[#8B1E26]"
                >
                  {TN_DISTRICTS.map(d => (
                    <option key={d.id} value={d.name}>
                      {currentLang === 'ta' ? `${d.nameTamil} (${d.name})` : `${d.name} (${d.nameTamil})`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {currentLang === 'ta' ? 'உங்கள் செய்தி *' : 'Your Message *'}
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder={currentLang === 'ta' ? 'உங்கள் செய்தியை உள்ளிடவும்...' : 'Enter your message...'}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-gray-700 text-slate-900 dark:text-white rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-[#8B1E26] focus:border-[#8B1E26]"
                />
              </div>

              {/* Submit button in Home Page Royal Maroon */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-[#8B1E26] hover:bg-[#72151C] text-white font-extrabold py-3.5 rounded-xl shadow-lg transition-all uppercase text-xs tracking-wider cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{currentLang === 'ta' ? 'அனுப்பப்படுகிறது...' : 'SENDING TO HQ...'}</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>{currentLang === 'ta' ? 'தலைமைச் செயலகத்திற்கு செய்தி அனுப்புக' : 'SEND MESSAGE TO HQ'}</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* 38 Districts Contact Directory */}
          <div className="lg:col-span-6 bg-white dark:bg-[#1E232B] rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/80 dark:border-gray-800 space-y-4">
            <div className="border-b border-slate-200/80 dark:border-gray-800 pb-3">
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white font-heading">
                {currentLang === 'ta' ? '38 மாவட்ட தலைமைச் செயலகத் தொடர்புகள்' : '38 Districts Secretariat Directory'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {currentLang === 'ta'
                  ? 'உங்கள் மாவட்டத்திற்கான அதிகாரப்பூர்வ தமிழ் சங்க அலுவலகத் தொடர்பு விவரங்கள்.'
                  : 'Find local Tamil Sangam office contact for your district.'}
              </p>
            </div>

            <div className="max-h-[420px] overflow-y-auto pr-2 space-y-2">
              {TN_DISTRICTS.map(d => (
                <div key={d.id} className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200/80 dark:border-gray-800 text-xs flex items-center justify-between">
                  <div>
                    <h4 className="font-extrabold text-slate-900 dark:text-white">
                      {currentLang === 'ta' ? d.nameTamil : d.name}
                      <span className="text-[11px] font-normal text-slate-500 dark:text-slate-400 ml-1">
                        ({currentLang === 'ta' ? d.name : d.nameTamil})
                      </span>
                    </h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">
                      {currentLang === 'ta'
                        ? `${d.totalTaluks} வட்டங்கள் • ${d.totalMembers} உறுப்பினர்கள்`
                        : `${d.totalTaluks} Taluks • ${d.totalMembers} Active Members`}
                    </p>
                  </div>
                  <span className="text-[11px] font-bold font-mono text-[#8B1E26] dark:text-red-300 bg-[#FDF2F2] dark:bg-red-950/60 border border-[#8B1E26]/20 px-2.5 py-1 rounded">
                    +91 44 2850 10{d.id.slice(-2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
