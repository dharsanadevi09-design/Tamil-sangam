import React, { useState, useEffect } from 'react';
import { Smartphone, ShieldCheck, ArrowRight, RefreshCw, X, Lock } from 'lucide-react';

interface OtpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOtpVerified: (verifiedMobile: string) => void;
  currentLang: 'en' | 'ta';
}

export const OtpModal: React.FC<OtpModalProps> = ({
  isOpen,
  onClose,
  onOtpVerified,
  currentLang
}) => {
  const [step, setStep] = useState<'MOBILE' | 'OTP'>('MOBILE');
  const [mobileNumber, setMobileNumber] = useState('9840123456');
  const [otpDigits, setOtpDigits] = useState(['1', '2', '3', '4', '5', '6']);
  const [timer, setTimer] = useState(30);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset modal state when opened
  useEffect(() => {
    if (isOpen) {
      setStep('MOBILE');
      setErrorMsg('');
      setIsSubmitting(false);
      setTimer(30);
      setOtpDigits(['1', '2', '3', '4', '5', '6']);
    }
  }, [isOpen]);

  // Countdown timer for resend OTP
  useEffect(() => {
    let interval: any = null;
    if (step === 'OTP' && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  if (!isOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNumber = mobileNumber.replace(/\D/g, '');
    if (cleanNumber.length !== 10) {
      setErrorMsg(
        currentLang === 'ta'
          ? 'தயவுசெய்து 10 இலக்க அலைபேசி எண்ணை உள்ளிடவும்.'
          : 'Please enter a valid 10-digit mobile number.'
      );
      return;
    }
    setErrorMsg('');
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setStep('OTP');
      setTimer(30);
    }, 400);
  };

  const handleVerifyOtp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const enteredOtp = otpDigits.join('');
    if (enteredOtp.length !== 6) {
      setErrorMsg(
        currentLang === 'ta'
          ? 'சரியான 6 இலக்க OTP குறியீட்டை உள்ளிடவும்.'
          : 'Please enter complete 6-digit OTP.'
      );
      return;
    }
    setErrorMsg('');
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      onOtpVerified(mobileNumber);
    }, 500);
  };

  const handleDigitChange = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const updated = [...otpDigits];
    updated[index] = val.slice(-1);
    setOtpDigits(updated);

    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-digit-${index + 1}`);
      nextInput?.focus();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#181B20] text-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-gray-800 gold-header-strip relative overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title & Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-16 h-16 bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <Smartphone className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-extrabold text-white">
            {step === 'MOBILE'
              ? (currentLang === 'ta' ? 'அலைபேசி எண் சரிபார்ப்பு' : 'Step 1: Mobile OTP Verification')
              : (currentLang === 'ta' ? '6 இலக்க OTP உள்ளிடவும்' : 'Step 2: Enter 6-Digit OTP')}
          </h3>
          <p className="text-xs text-gray-400">
            {step === 'MOBILE'
              ? (currentLang === 'ta' ? 'உறுப்பினர் படிவம் திறக்க கைபேசி எண்ணை உள்ளிடவும்' : 'Enter your 10-digit mobile number to receive verification OTP')
              : (currentLang === 'ta' ? `OTP +91 ${mobileNumber} எண்ணிற்கு அனுப்பப்பட்டது` : `Verification OTP sent to +91 ${mobileNumber}`)}
          </p>
        </div>

        {/* Locked Feature Notice */}
        <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-xl p-3 text-xs text-yellow-300 mb-6 flex items-start gap-2">
          <Lock className="w-4 h-4 shrink-0 mt-0.5" />
          <span>
            {currentLang === 'ta'
              ? 'பாதுகாப்பு காரணம் கருதி OTP சரிபார்ப்பிற்கு பின்னரே உறுப்பினர் விண்ணப்பப் படிவம் திறக்கும்.'
              : 'Membership Registration Form, Aadhaar Upload, and Payment will unlock ONLY after successful OTP verification.'}
          </span>
        </div>

        {errorMsg && (
          <div className="mb-4 bg-red-900/60 border border-red-500 text-red-200 text-xs p-3 rounded-xl">
            {errorMsg}
          </div>
        )}

        {/* STEP 1: Enter Mobile Number */}
        {step === 'MOBILE' ? (
          <form onSubmit={handleSendOtp} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                {currentLang === 'ta' ? 'உங்கள் 10 இலக்க அலைபேசி எண்' : 'Enter Your 10-Digit Mobile Number'}
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-3.5 text-sm font-bold text-yellow-400">+91</span>
                <input
                  type="tel"
                  maxLength={10}
                  placeholder="e.g. 9840123456"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                  className="w-full pl-14 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-base font-semibold text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  required
                  autoFocus
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || mobileNumber.length !== 10}
              className="w-full flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-[#181B20] font-extrabold py-3.5 rounded-xl shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase text-sm tracking-wider"
            >
              {isSubmitting ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span>{currentLang === 'ta' ? 'OTP அனுப்புக' : 'SEND OTP CODE'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          /* STEP 2: Enter 6-Digit OTP */
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-gray-300">
                  {currentLang === 'ta' ? '6 இலக்க OTP உள்ளிடவும்' : 'Enter 6-Digit OTP Code'}
                </label>
                <span className="text-[11px] font-bold text-yellow-400 bg-gray-800 px-2 py-0.5 rounded">
                  Demo Code: 123456
                </span>
              </div>

              <div className="flex justify-center gap-2">
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-digit-${idx}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleDigitChange(idx, e.target.value)}
                    className="w-11 h-13 text-center text-xl font-bold bg-gray-900 border border-gray-700 focus:border-yellow-400 rounded-xl text-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-[#181B20] font-extrabold py-3.5 rounded-xl shadow-xl transition-all uppercase text-sm tracking-wider"
            >
              {isSubmitting ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5" />
                  <span>{currentLang === 'ta' ? 'OTP சரிபார் & படிவம் திற' : 'VERIFY OTP & OPEN FORM'}</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-gray-800">
              <button
                type="button"
                onClick={() => setStep('MOBILE')}
                className="hover:text-yellow-400 transition-colors"
              >
                ← {currentLang === 'ta' ? 'எண் மாற்றுக' : 'Change Mobile Number'}
              </button>

              <button
                type="button"
                disabled={timer > 0}
                onClick={() => setTimer(30)}
                className="hover:text-yellow-400 transition-colors disabled:opacity-50"
              >
                {timer > 0 ? `Resend OTP in ${timer}s` : (currentLang === 'ta' ? 'மறுபடியும் OTP அனுப்புக' : 'Resend OTP')}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
