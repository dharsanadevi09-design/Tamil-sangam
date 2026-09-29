import React, { useState } from 'react';
import type { MemberApplication } from '../../types';
import { TN_DISTRICTS, MEMBERSHIP_CATEGORIES, PASARAI_WINGS } from '../../data/mockData';
import { User, Phone, MapPin, ShieldCheck, Upload, ArrowRight, FileText, Camera, AlertTriangle, Lock } from 'lucide-react';

interface RegistrationFormProps {
  verifiedMobile: string;
  onFormCompleted: (formData: Partial<MemberApplication>) => void;
  onCancel: () => void;
  currentLang: 'en' | 'ta';
  preselectedPasaraiId?: string;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({
  verifiedMobile,
  onFormCompleted,
  onCancel,
  currentLang,
  preselectedPasaraiId
}) => {
  const [formData, setFormData] = useState<Partial<MemberApplication>>({
    fullName: '',
    nameTamil: '',
    dob: '1995-05-15',
    gender: 'Male',
    guardianName: '',
    occupation: 'Private Employee',
    education: 'Bachelor Degree',
    bloodGroup: 'O+',
    mobile: verifiedMobile,
    whatsapp: verifiedMobile,
    email: '',
    altMobile: '',
    doorNo: '12/4',
    street: 'Main Road',
    village: '',
    postOffice: '',
    taluk: '',
    district: TN_DISTRICTS[2].name,
    state: 'Tamil Nadu',
    pincode: '600001',
    country: 'India',
    aadhaarNumber: '',
    aadhaarDocUrl: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=400&q=80',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    categoryId: MEMBERSHIP_CATEGORIES[0].id,
    categoryName: MEMBERSHIP_CATEGORIES[0].name,
    pasaraiId: preselectedPasaraiId || PASARAI_WINGS[0].id,
    pasaraiName: PASARAI_WINGS.find(p => p.id === (preselectedPasaraiId || PASARAI_WINGS[0].id))?.nameTamil || PASARAI_WINGS[0].nameTamil
  });

  const [photoPreview, setPhotoPreview] = useState<string>(formData.photoUrl || '');
  const [aadhaarFileName, setAadhaarFileName] = useState<string>('aadhaar_card_doc.pdf');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategorySelect = (catId: string) => {
    const selected = MEMBERSHIP_CATEGORIES.find(c => c.id === catId);
    if (selected) {
      setFormData(prev => ({
        ...prev,
        categoryId: selected.id,
        categoryName: selected.name,
      }));
    }
  };

  const handlePasaraiSelect = (pasId: string) => {
    const selected = PASARAI_WINGS.find(p => p.id === pasId);
    if (selected) {
      setFormData(prev => ({
        ...prev,
        pasaraiId: selected.id,
        pasaraiName: selected.nameTamil,
      }));
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPhotoPreview(result);
        setFormData(prev => ({ ...prev, photoUrl: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAadhaarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAadhaarFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setFormData(prev => ({ ...prev, aadhaarDocUrl: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAutoFillSampleData = () => {
    setFormData(prev => ({
      ...prev,
      fullName: 'Sundaram Ramachandran',
      nameTamil: 'சுந்தரம் இராமச்சந்திரன்',
      guardianName: 'Ramachandran',
      email: `sundaram.${verifiedMobile}@tamilsangamtn.org`,
      doorNo: '12/4',
      street: 'Anna Salai',
      village: 'Mylapore',
      postOffice: 'Mylapore HO',
      taluk: 'Mylapore',
      district: TN_DISTRICTS[2].name,
      pincode: '600004',
      aadhaarNumber: '7890 1234 5678'
    }));
    setErrorMsg('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const finalFullName = formData.fullName?.trim() || `Sangam Member (${verifiedMobile.slice(-4)})`;
    const finalNameTamil = formData.nameTamil?.trim() || `சங்க உறுப்பினர் (${verifiedMobile.slice(-4)})`;
    const finalEmail = formData.email?.trim() || `member.${verifiedMobile}@tamilsangamtn.org`;
    const finalAadhaar = (formData.aadhaarNumber?.replace(/\D/g, '') || '789012345678').padEnd(12, '0');

    setErrorMsg('');
    onFormCompleted({
      ...formData,
      fullName: finalFullName,
      nameTamil: finalNameTamil,
      email: finalEmail,
      aadhaarNumber: finalAadhaar,
      mobileVerified: true,
      paymentAmount: MEMBERSHIP_CATEGORIES.find(c => c.id === formData.categoryId)?.fee || 100
    });
  };

  return (
    <div className="max-w-4xl mx-auto my-8 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-slate-900 dark:text-white">
      
      <div className="bg-[#181B20] text-white p-6 sm:p-8 gold-header-strip flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-yellow-400 text-[#181B20] text-xs font-black px-2 py-0.5 rounded uppercase">
              OTP Verified ✓
            </span>
            <span className="text-xs text-yellow-300 font-semibold">+91 {verifiedMobile}</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white mt-1">
            {currentLang === 'ta' ? 'உறுப்பினர் சேர்க்கை விண்ணப்பப் படிவம்' : 'Membership Application Form'}
          </h2>
          <p className="text-xs text-gray-300 mt-0.5">
            {currentLang === 'ta' ? 'தமிழ் சங்கம் - தமிழ்நாடு அதிகாரப்பூர்வ உறுப்பினர் பதிவு' : 'Tamil Sangam – Tamil Nadu Official Member Registration'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleAutoFillSampleData}
            className="text-xs font-bold text-slate-950 bg-yellow-400 hover:bg-yellow-300 px-3 py-1.5 rounded-lg shadow transition-colors cursor-pointer"
          >
            ⚡ Auto-Fill Sample Data
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="text-xs font-semibold text-gray-400 hover:text-white bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-700 cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-10">

        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* SECTION A */}
        <div className="space-y-4">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white border-l-4 border-yellow-400 pl-3 flex items-center gap-2">
            <User className="w-5 h-5 text-amber-600 dark:text-yellow-400" />
            <span>A. Personal Information / தனிநபர் விவரங்கள்</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Full Name (in English) *
              </label>
              <input
                type="text"
                name="fullName"
                required
                placeholder="e.g. Sundaram Ramachandran"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-yellow-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                பெயர் (தமிழில்) *
              </label>
              <input
                type="text"
                name="nameTamil"
                required
                placeholder="எ.கா. சுந்தரம் இராமச்சந்திரன்"
                value={formData.nameTamil}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-yellow-400 focus:outline-none font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Date of Birth / பிறந்த தேதி *
              </label>
              <input
                type="date"
                name="dob"
                required
                value={formData.dob}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-yellow-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Gender / பாலினம் *
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-yellow-400 focus:outline-none"
              >
                <option value="Male">Male / ஆண்</option>
                <option value="Female">Female / பெண்</option>
                <option value="Other">Other / இதர</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Father / Mother / Spouse Name *
              </label>
              <input
                type="text"
                name="guardianName"
                required
                placeholder="Guardian name"
                value={formData.guardianName}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-yellow-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Occupation / தொழில் *
              </label>
              <input
                type="text"
                name="occupation"
                required
                placeholder="e.g. Software Engineer, Farmer, Teacher"
                value={formData.occupation}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-yellow-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Educational Qualification / கல்வித் தகுதி *
              </label>
              <input
                type="text"
                name="education"
                required
                placeholder="e.g. B.E, B.Sc, M.A, SSLC"
                value={formData.education}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-yellow-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Blood Group (Optional) / ரத்த வகை
              </label>
              <select
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-yellow-400 focus:outline-none"
              >
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>
          </div>
        </div>

        {/* SECTION B */}
        <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white border-l-4 border-yellow-400 pl-3 flex items-center gap-2">
            <Phone className="w-5 h-5 text-amber-600 dark:text-yellow-400" />
            <span>B. Contact Information / தொடர்பு விவரங்கள்</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Verified Mobile Number (Read Only)
              </label>
              <input
                type="text"
                disabled
                value={`+91 ${verifiedMobile}`}
                className="w-full px-3.5 py-2.5 bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-bold text-slate-700 dark:text-slate-200"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                WhatsApp Number *
              </label>
              <input
                type="tel"
                name="whatsapp"
                required
                maxLength={10}
                placeholder="10-digit WhatsApp number"
                value={formData.whatsapp}
                onChange={(e) => {
                  const clean = e.target.value.replace(/\D/g, '').slice(0, 10);
                  setFormData(prev => ({ ...prev, whatsapp: clean }));
                }}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-yellow-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Email Address / மின்னஞ்சல் முகவரி *
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="member@example.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-yellow-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Alternate Mobile (Optional)
              </label>
              <input
                type="tel"
                name="altMobile"
                maxLength={10}
                placeholder="Alternate phone number"
                value={formData.altMobile}
                onChange={(e) => {
                  const clean = e.target.value.replace(/\D/g, '').slice(0, 10);
                  setFormData(prev => ({ ...prev, altMobile: clean }));
                }}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-yellow-400 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* SECTION C */}
        <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white border-l-4 border-yellow-400 pl-3 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-amber-600 dark:text-yellow-400" />
            <span>C. Address Details / முகவரி விவரங்கள்</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Door No. *</label>
              <input
                type="text"
                name="doorNo"
                required
                placeholder="Door / Flat No"
                value={formData.doorNo}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-yellow-400 focus:outline-none"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Street Name *</label>
              <input
                type="text"
                name="street"
                required
                placeholder="Street / Avenue name"
                value={formData.street}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-yellow-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Village / Town *</label>
              <input
                type="text"
                name="village"
                required
                placeholder="Village or Town"
                value={formData.village}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-yellow-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Post Office *</label>
              <input
                type="text"
                name="postOffice"
                required
                placeholder="Post Office name"
                value={formData.postOffice}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-yellow-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Taluk / தாலுகா *</label>
              <input
                type="text"
                name="taluk"
                required
                placeholder="Taluk name"
                value={formData.taluk}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-yellow-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">District / மாவட்டம் *</label>
              <select
                name="district"
                value={formData.district}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg text-sm font-semibold focus:ring-2 focus:ring-yellow-400 focus:outline-none"
              >
                {TN_DISTRICTS.map(d => (
                  <option key={d.id} value={d.name}>
                    {d.nameTamil} ({d.name})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">State</label>
              <input
                type="text"
                disabled
                value="Tamil Nadu"
                className="w-full px-3.5 py-2.5 bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-bold text-slate-700 dark:text-slate-200"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">PIN Code *</label>
              <input
                type="text"
                name="pincode"
                required
                maxLength={6}
                placeholder="6-digit PIN code"
                value={formData.pincode}
                onChange={(e) => {
                  const clean = e.target.value.replace(/\D/g, '').slice(0, 6);
                  setFormData(prev => ({ ...prev, pincode: clean }));
                }}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-yellow-400 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* SECTION D */}
        <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white border-l-4 border-yellow-400 pl-3 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-600 dark:text-yellow-400" />
              <span>D. Identity Verification / ஆதார் & புகைப்படப் பதிவு</span>
            </h3>
            <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2.5 py-1 rounded flex items-center gap-1">
              <Lock className="w-3 h-3" /> Secure Restricted Access
            </span>
          </div>

          <div className="bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl p-4 text-xs text-amber-900 dark:text-amber-300 space-y-1">
            <p className="font-bold flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" /> Aadhaar Privacy & Legal Notice:
            </p>
            <p>
              Aadhaar documents are encrypted and stored in secure Admin-only areas. They will NOT be publicly viewable during QR verification.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  12-Digit Aadhaar Number *
                </label>
                <input
                  type="text"
                  name="aadhaarNumber"
                  required
                  placeholder="e.g. 7890 1234 5678"
                  value={formData.aadhaarNumber}
                  onChange={(e) => {
                    const clean = e.target.value.replace(/\D/g, '').slice(0, 12);
                    const formatted = clean.match(/.{1,4}/g)?.join(' ') || clean;
                    setFormData(prev => ({ ...prev, aadhaarNumber: formatted }));
                  }}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg text-sm font-semibold tracking-wider focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Upload Aadhaar Card Copy (PDF/JPG/PNG) *
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <label className="flex-1 w-full border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-yellow-400 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer bg-slate-50 dark:bg-slate-800/50 hover:bg-yellow-50/30 transition-all text-center">
                    <Upload className="w-6 h-6 text-amber-600 dark:text-yellow-400 mb-1" />
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Click to upload Aadhaar Image</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{aadhaarFileName}</span>
                    <input
                      type="file"
                      accept=".pdf,image/png,image/jpeg,image/jpg"
                      onChange={handleAadhaarUpload}
                      className="hidden"
                    />
                  </label>
                  {formData.aadhaarDocUrl && (
                    <div className="w-24 h-20 bg-slate-200 dark:bg-slate-700 border-2 border-amber-500 rounded-lg overflow-hidden shrink-0 shadow-md relative group">
                      <img src={formData.aadhaarDocUrl} alt="Aadhaar Document Preview" className="w-full h-full object-cover" />
                      <span className="absolute bottom-0 inset-x-0 bg-emerald-700/90 text-white text-[9px] font-bold text-center py-0.5">
                        Uploaded ✓
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Passport Size Photograph Upload *
              </label>
              <div className="flex items-center gap-4 border border-slate-200 dark:border-slate-700 rounded-xl p-4 bg-slate-50 dark:bg-slate-800/50">
                <div className="w-24 h-28 bg-slate-200 dark:bg-slate-700 border-2 border-yellow-400 rounded-lg overflow-hidden shrink-0 shadow-md">
                  {photoPreview ? (
                    <img src={photoPreview} alt="Passport photo preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                      <Camera className="w-6 h-6" />
                      <span className="text-[9px]">Photo</span>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">Clear frontal photo for Digital ID Card</p>
                  <label className="inline-flex items-center gap-1.5 text-xs font-bold bg-slate-900 dark:bg-yellow-400 text-white dark:text-slate-950 hover:bg-yellow-400 hover:text-slate-900 px-3 py-2 rounded-lg cursor-pointer transition-colors shadow-sm">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* SECTION E */}
        <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white border-l-4 border-yellow-400 pl-3 flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-600 dark:text-yellow-400" />
            <span>E. Select Membership Category / உறுப்பினர் வகை</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {MEMBERSHIP_CATEGORIES.map((cat) => {
              const isSelected = formData.categoryId === cat.id;
              return (
                <div
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.id)}
                  className={`cursor-pointer p-4 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-amber-500/10 border-yellow-400 ring-2 ring-yellow-400 shadow-md'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-extrabold text-sm text-slate-900 dark:text-white">{cat.nameTamil}</span>
                    <span className="font-black text-amber-600 dark:text-yellow-400 text-sm">₹{cat.fee}</span>
                  </div>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">{cat.name}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">{cat.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION F */}
        <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white border-l-4 border-yellow-400 pl-3 flex items-center gap-2">
            <User className="w-5 h-5 text-amber-600 dark:text-yellow-400" />
            <span>F. Select Preferred Pasarai Wing / பாசறைத் தேர்வு</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 max-h-56 overflow-y-auto pr-2 border border-slate-200 dark:border-slate-700 rounded-xl p-3 bg-slate-50 dark:bg-slate-800/50">
            {PASARAI_WINGS.map((pas) => {
              const isSelected = formData.pasaraiId === pas.id;
              return (
                <button
                  key={pas.id}
                  type="button"
                  onClick={() => handlePasaraiSelect(pas.id)}
                  className={`text-left p-2.5 rounded-lg border text-xs transition-all ${
                    isSelected
                      ? 'bg-yellow-400 text-slate-950 font-bold border-yellow-500 shadow'
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-yellow-400'
                  }`}
                >
                  <p className="font-bold truncate">{pas.nameTamil}</p>
                  <p className="text-[10px] opacity-80 truncate">{pas.name}</p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto text-xs font-semibold text-slate-600 hover:text-slate-900 px-6 py-3"
          >
            Cancel Application
          </button>

          <button
            type="submit"
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-[#181B20] text-sm font-extrabold px-8 py-3.5 rounded-xl shadow-xl hover:shadow-yellow-400/30 transition-all uppercase tracking-wide"
          >
            <span>REVIEW APPLICATION & PAY</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </form>
    </div>
  );
};
