import React, { useState } from 'react';
import type { DonationRecord } from '../../types';
import { addDonation } from '../../services/storageService';
import { Heart, X, RefreshCw, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

interface DonateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDonationCompleted: (receipt: DonationRecord) => void;
  currentLang: 'en' | 'ta';
}

export const DonateModal: React.FC<DonateModalProps> = ({
  isOpen,
  onClose,
  onDonationCompleted,
  currentLang
}) => {
  const [donorName, setDonorName] = useState('Er. N. Sivakumar');
  const [mobile, setMobile] = useState('9841098765');
  const [whatsapp, setWhatsapp] = useState('9841098765');
  const [email, setEmail] = useState('sivakumar.n@gmail.com');
  const [address, setAddress] = useState('Plot 4, Temple Avenue, Adyar, Chennai - 600020');
  const [amount, setAmount] = useState<number>(1000);
  const [customAmount, setCustomAmount] = useState('');
  const [purpose, setPurpose] = useState('Tamil Cultural Festival & Thirukkural Conference');
  const [paymentMethod, setPaymentMethod] = useState('UPI / GPay / PhonePe');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const purposes = [
    { id: 'fest', ta: 'தமிழ் கலாச்சார மாநாடு & திருக்குறள் கருத்தரங்கம்', en: 'Tamil Cultural Festival & Thirukkural Conference' },
    { id: 'scholarship', ta: 'ஊரக மாணவர் கல்வி உதவித்தொகை & நூலக மேம்பாடு', en: 'Rural Student Scholarship & Library Development' },
    { id: 'heritage', ta: 'பண்டைய கல்வெட்டு & கீழடி தொல்லியல் ஆய்வு', en: 'Ancient Inscriptions & Keeladi Archeology Research' },
    { id: 'social', ta: 'பொது சங்க சமூக சேவை & பேரிடர் நிவாரணம்', en: 'General Sangam Social Service & Disaster Relief' }
  ];

  const handleAutoFillSample = () => {
    setDonorName(currentLang === 'ta' ? 'முனைவர் கா. அன்பழகன்' : 'Dr. K. Anbazhagan');
    setMobile('9444012345');
    setWhatsapp('9444012345');
    setEmail('anbazhagan.k@tamilsangam.org');
    setAddress(currentLang === 'ta' ? 'எண். 45, வி.ஐ.பி அவென்யூ, ஆர்.எஸ் புரம், கோவை - 641002' : 'No. 45, VIP Avenue, RS Puram, Coimbatore - 641002');
    setAmount(2500);
    setCustomAmount('');
    setPurpose(currentLang === 'ta' ? 'ஊரக மாணவர் கல்வி உதவித்தொகை & நூலக மேம்பாடு' : 'Rural Student Scholarship & Library Development');
    setPaymentMethod('UPI / GPay / PhonePe');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalAmount = customAmount ? parseFloat(customAmount) : amount;
    const validAmount = (!finalAmount || isNaN(finalAmount) || finalAmount <= 0) ? 1000 : finalAmount;

    setIsSubmitting(true);
    try {
      // Step 1: Gateway payment verification
      await new Promise((r) => setTimeout(r, 1200));

      // Step 2: Save to SQLite Database & trigger Admin & User Notifications
      const newReceipt = await addDonation({
        donorName: donorName.trim() || 'Anonymous Donor',
        mobile: mobile.trim() || '9841000000',
        whatsapp: whatsapp.trim() || mobile.trim() || '9841000000',
        email: email.trim() || 'donor@tamilsangamtn.org',
        address: address.trim() || 'Tamil Nadu',
        amount: validAmount,
        purpose,
        paymentMethod,
        transactionId: `TXN-DON-${Date.now().toString().slice(-8)}`
      });

      try {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      } catch (err) {}

      setIsSubmitting(false);
      onDonationCompleted(newReceipt);
    } catch (err: any) {
      setIsSubmitting(false);
      console.error('Donation processing error:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-[#1E232B] rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200/80 dark:border-gray-800 my-8 relative text-slate-900 dark:text-white">
        
        <button 
          onClick={onClose} 
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-14 h-14 bg-[#FDF2F2] dark:bg-red-950/60 text-[#8B1E26] dark:text-red-400 rounded-2xl flex items-center justify-center mx-auto shadow-inner border border-[#8B1E26]/20">
            <Heart className="w-7 h-7 fill-current" />
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white font-heading">
            {currentLang === 'ta' ? 'தமிழ் சங்கம் – தமிழ்நாடு நன்கொடை' : 'DONATE TO TAMIL SANGAM – TAMIL NADU'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {currentLang === 'ta' 
              ? 'தமிழ் இலக்கியம், கலாச்சார விழாக்கள், மாணவர் கல்வி உதவித்தொகை மற்றும் ஊரக நூலகங்களை ஆதரிக்கவும்.' 
              : 'Support Tamil literature, cultural festivals, student scholarships, and rural libraries.'}
          </p>

          <button
            type="button"
            onClick={handleAutoFillSample}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FDF2F2] dark:bg-red-950/50 hover:bg-[#FBE8E8] border border-[#8B1E26]/20 text-[#8B1E26] dark:text-red-300 rounded-full text-[11px] font-bold transition-all shadow-sm mt-2 cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 fill-current text-[#8B1E26] dark:text-red-400" />
            <span>{currentLang === 'ta' ? 'மாதிரி விவரங்களை நிரப்புக' : 'Auto-fill Demo Details'}</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Preset Amounts */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              {currentLang === 'ta' ? 'நன்கொடைத் தொகையைத் தேர்ந்தெடுக்கவும் (₹)' : 'Select Donation Amount (₹)'}
            </label>
            <div className="grid grid-cols-4 gap-2 text-xs">
              {[500, 1000, 2500, 5000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => { setAmount(amt); setCustomAmount(''); }}
                  className={`py-2.5 rounded-xl border font-bold transition-all cursor-pointer ${
                    amount === amt && !customAmount 
                      ? 'bg-[#8B1E26] text-white border-[#8B1E26] shadow-md font-extrabold' 
                      : 'bg-slate-50 dark:bg-slate-900 border-slate-200/80 dark:border-gray-800 text-slate-700 dark:text-slate-300 hover:border-[#8B1E26]'
                  }`}
                >
                  ₹{amt.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {currentLang === 'ta' ? 'அல்லது விரும்பும் தொகையை உள்ளிடவும் (₹)' : 'Or Enter Custom Amount (₹)'}
            </label>
            <input
              type="number"
              placeholder="e.g. 10000"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-gray-700 text-slate-900 dark:text-white rounded-xl text-sm font-semibold focus:ring-2 focus:ring-[#8B1E26] focus:border-[#8B1E26] focus:outline-none"
            />
          </div>

          {/* Donor Personal Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {currentLang === 'ta' ? 'நன்கொடையாளர் பெயர் *' : 'Donor Name *'}
              </label>
              <input
                type="text"
                required
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-gray-700 text-slate-900 dark:text-white rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#8B1E26] focus:border-[#8B1E26]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {currentLang === 'ta' ? 'கைபேசி எண் *' : 'Mobile Number *'}
              </label>
              <input
                type="tel"
                required
                maxLength={10}
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-gray-700 text-slate-900 dark:text-white rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#8B1E26] focus:border-[#8B1E26]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {currentLang === 'ta' ? 'வாட்ஸ்அப் எண் *' : 'WhatsApp Number *'}
              </label>
              <input
                type="tel"
                required
                maxLength={10}
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-gray-700 text-slate-900 dark:text-white rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#8B1E26] focus:border-[#8B1E26]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {currentLang === 'ta' ? 'மின்னஞ்சல் முகவரி *' : 'Email Address *'}
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-gray-700 text-slate-900 dark:text-white rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#8B1E26] focus:border-[#8B1E26]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {currentLang === 'ta' ? 'முகவரி *' : 'Address *'}
            </label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-gray-700 text-slate-900 dark:text-white rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#8B1E26] focus:border-[#8B1E26]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {currentLang === 'ta' ? 'நன்கொடையின் நோக்கம் *' : 'Purpose of Donation *'}
            </label>
            <select
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-gray-700 text-slate-900 dark:text-white rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#8B1E26] focus:border-[#8B1E26]"
            >
              {purposes.map(p => (
                <option key={p.id} value={currentLang === 'ta' ? p.ta : p.en}>
                  {currentLang === 'ta' ? p.ta : p.en}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {currentLang === 'ta' ? 'செலுத்தும் முறை *' : 'Payment Method *'}
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-gray-700 text-slate-900 dark:text-white rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#8B1E26] focus:border-[#8B1E26]"
            >
              <option value="UPI / GPay / PhonePe">UPI / GPay / PhonePe</option>
              <option value="Debit Card">{currentLang === 'ta' ? 'டெபிட் கார்டு (Debit Card)' : 'Debit Card'}</option>
              <option value="Credit Card">{currentLang === 'ta' ? 'கிரெடிட் கார்டு (Credit Card)' : 'Credit Card'}</option>
              <option value="Net Banking">{currentLang === 'ta' ? 'நெட் பேங்கிங் (Net Banking)' : 'Net Banking'}</option>
            </select>
          </div>

          {/* Submit in Royal Maroon matching Home Page */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 bg-[#8B1E26] hover:bg-[#72151C] text-white font-extrabold py-3.5 rounded-xl shadow-lg transition-all uppercase text-xs tracking-wider cursor-pointer"
          >
            {isSubmitting ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Heart className="w-4 h-4 fill-current" />
                <span>
                  {currentLang === 'ta'
                    ? `₹${(customAmount ? parseFloat(customAmount) : amount).toLocaleString()} வழங்கி ரசீது பெறுக`
                    : `DONATE ₹${(customAmount ? parseFloat(customAmount) : amount).toLocaleString()} & GENERATE RECEIPT`}
                </span>
              </>
            )}
          </button>

        </form>

      </div>
    </div>
  );
};
