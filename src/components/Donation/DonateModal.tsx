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
  const [paymentMethod, setPaymentMethod] = useState('UPI / GPay');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleAutoFillSample = () => {
    setDonorName('Dr. K. Anbazhagan');
    setMobile('9444012345');
    setWhatsapp('9444012345');
    setEmail('anbazhagan.k@tamilsangam.org');
    setAddress('No. 45, VIP Avenue, RS Puram, Coimbatore - 641002');
    setAmount(2500);
    setCustomAmount('');
    setPurpose('Rural Student Scholarship & Library Development');
    setPaymentMethod('UPI / GPay');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalAmount = customAmount ? parseFloat(customAmount) : amount;
    const validAmount = (!finalAmount || isNaN(finalAmount) || finalAmount <= 0) ? 1000 : finalAmount;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      try {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      } catch (err) {}

      const newReceipt = addDonation({
        donorName: donorName.trim() || 'Anonymous Donor',
        mobile: mobile.trim() || '9841000000',
        whatsapp: whatsapp.trim() || mobile.trim() || '9841000000',
        email: email.trim() || 'donor@tamilsangamtn.org',
        address: address.trim() || 'Tamil Nadu',
        amount: validAmount,
        purpose,
        paymentMethod,
        transactionId: `TXN-${Date.now().toString().slice(-8)}`
      });

      onDonationCompleted(newReceipt);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 my-8 relative text-slate-900 dark:text-white">
        
        <button onClick={onClose} className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 dark:hover:text-white">
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-14 h-14 bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 rounded-full flex items-center justify-center mx-auto shadow-inner border border-rose-200 dark:border-rose-800">
            <Heart className="w-7 h-7 fill-current" />
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {currentLang === 'ta' ? 'தமிழ் சங்கம் - நன்கொடை வழங்குதல்' : 'DONATE TO TAMIL SANGAM – TAMIL NADU'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {currentLang === 'ta' ? 'தமிழ் வளர்ச்சி, இலக்கியம் & கல்வி திட்டங்களுக்கு பங்களிக்கவும்' : 'Support Tamil literature, cultural festivals, student scholarships, and rural libraries.'}
          </p>

          <button
            type="button"
            onClick={handleAutoFillSample}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 rounded-full text-[11px] font-bold transition-all shadow-sm mt-2"
          >
            <Zap className="w-3.5 h-3.5 fill-current text-rose-500" />
            <span>⚡ மாதிரி விவரங்களை நிரப்புக (Auto-fill Sample)</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Preset Amounts */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Select Donation Amount (₹)</label>
            <div className="grid grid-cols-4 gap-2 text-xs">
              {[500, 1000, 2500, 5000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => { setAmount(amt); setCustomAmount(''); }}
                  className={`py-2.5 rounded-lg border font-bold transition-all ${
                    amount === amt && !customAmount ? 'bg-rose-600 text-white border-rose-600 shadow' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-rose-400'
                  }`}
                >
                  ₹{amt.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Or Enter Custom Amount (₹)</label>
            <input
              type="number"
              placeholder="e.g. 10000"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg text-sm font-semibold focus:ring-2 focus:ring-rose-500 focus:outline-none"
            />
          </div>

          {/* Donor Personal Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Donor Name *</label>
              <input
                type="text"
                required
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Mobile Number *</label>
              <input
                type="tel"
                required
                maxLength={10}
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">WhatsApp Number *</label>
              <input
                type="tel"
                required
                maxLength={10}
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Email Address *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg text-xs font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Address *</label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg text-xs font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Purpose of Donation *</label>
            <select
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg text-xs font-semibold"
            >
              <option>Tamil Cultural Festival & Thirukkural Conference</option>
              <option>Rural Student Scholarship & Library Development</option>
              <option>Ancient Inscriptions & Keeladi Archeology Research</option>
              <option>General Sangam Social Service & Disaster Relief</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Payment Method *</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg text-xs font-semibold"
            >
              <option value="UPI / GPay">UPI / GPay / PhonePe</option>
              <option value="Debit Card">Debit Card</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Net Banking">Net Banking</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-500 text-white font-extrabold py-3.5 rounded-xl shadow-lg transition-all uppercase text-xs tracking-wider cursor-pointer"
          >
            {isSubmitting ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Heart className="w-4 h-4 fill-current" />
                <span>DONATE ₹{(customAmount ? parseFloat(customAmount) : amount).toLocaleString()} & GENERATE RECEIPT</span>
              </>
            )}
          </button>

        </form>

      </div>
    </div>
  );
};

