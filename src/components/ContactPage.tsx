import React, { useState } from 'react';
import { TN_DISTRICTS } from '../data/mockData';
import { MapPin, Phone, Send, CheckCircle2, Clock, Zap } from 'lucide-react';

interface ContactPageProps {
  currentLang: 'en' | 'ta';
}

export const ContactPage: React.FC<ContactPageProps> = ({ currentLang }) => {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [district, setDistrict] = useState(TN_DISTRICTS[2].name);
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleAutoFillSample = () => {
    setName('M. Selvanathan');
    setMobile('9876543210');
    setEmail('selvanathan.m@gmail.com');
    setDistrict(TN_DISTRICTS[2].name);
    setMessage('Greetings. I would like to inquire about registering our village youth library under Tamil Sangam Pasarai.');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 5000);
    setName('');
    setMobile('');
    setEmail('');
    setMessage('');
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 py-12 text-slate-900 dark:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Banner */}
        <div className="bg-[#181B20] text-white rounded-3xl p-8 sm:p-12 shadow-2xl gold-header-strip flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="bg-yellow-400 text-slate-950 font-black text-xs px-3 py-1 rounded uppercase tracking-wider">
              HELP & SUPPORT DESK
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
              {currentLang === 'ta' ? 'தொடர்புகொள்ள & உதவி மையம்' : 'Contact Headquarters & District Offices'}
            </h1>
            <p className="text-xs text-gray-300">
              State HQ Chennai, 38 District Secretariat offices, and WhatsApp helpline support.
            </p>
          </div>
        </div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md space-y-3">
            <div className="w-10 h-10 bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 rounded-xl flex items-center justify-center font-bold">
              <MapPin className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">State Headquarters</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Sangam Complex, Anna Salai, Triplicane, Chennai, Tamil Nadu - 600002, India
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md space-y-3">
            <div className="w-10 h-10 bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 rounded-xl flex items-center justify-center font-bold">
              <Phone className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Helpline & WhatsApp</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Phone: +91 44 2850 1000<br />
              WhatsApp: +91 98401 23456<br />
              Toll Free: 1800 425 1000
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md space-y-3">
            <div className="w-10 h-10 bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 rounded-xl flex items-center justify-center font-bold">
              <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Office Working Hours</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Monday – Saturday: 09:30 AM – 06:00 PM<br />
              Digital Portal: 24x7 Automated Service
            </p>
          </div>

        </div>

        {/* Main Form & 38 Districts Directory */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Inquiry Form */}
          <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-4 flex items-center justify-between flex-wrap gap-2">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Send Direct Inquiry / கருத்து தெரிவிக்க</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Reach out to Tamil Sangam State Secretariat.</p>
              </div>
              <button
                type="button"
                onClick={handleAutoFillSample}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 border border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300 rounded-full text-[11px] font-bold transition-all shadow-sm"
              >
                <Zap className="w-3.5 h-3.5 fill-current text-amber-500" />
                <span>⚡ மாதிரி விவரங்கள் (Auto-fill)</span>
              </button>
            </div>

            {isSubmitted && (
              <div className="bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs p-4 rounded-xl flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Thank you! Your message has been sent to Tamil Sangam State HQ. We will contact you shortly.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Your Name / பெயர் *</label>
                <input
                  type="text"
                  required
                  placeholder="Full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="10-digit mobile"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Select District / மாவட்டம் *</label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl font-semibold"
                >
                  {TN_DISTRICTS.map(d => (
                    <option key={d.id} value={d.name}>{d.nameTamil} ({d.name})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Your Message / செய்தி *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Enter your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl font-semibold"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-extrabold py-3.5 rounded-xl shadow-lg transition-all uppercase text-xs tracking-wider cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>SEND MESSAGE TO HQ</span>
              </button>
            </form>
          </div>

          {/* 38 Districts Contact Directory */}
          <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">38 Districts Secretariat Directory</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Find local Tamil Sangam office contact for your district.</p>
            </div>

            <div className="max-h-[420px] overflow-y-auto pr-2 space-y-2">
              {TN_DISTRICTS.map(d => (
                <div key={d.id} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 text-xs flex items-center justify-between">
                  <div>
                    <h4 className="font-extrabold text-slate-900 dark:text-white">{d.nameTamil} ({d.name})</h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">{d.totalTaluks} Taluks • {d.totalMembers} Active Members</p>
                  </div>
                  <span className="text-[11px] font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 px-2 py-1 rounded">
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

