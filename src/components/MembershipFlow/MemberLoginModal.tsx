import React, { useState, useEffect, useRef } from 'react';
import { Smartphone, ShieldCheck, ArrowRight, RefreshCw, X, CheckCircle2, User } from 'lucide-react';
import { getOrCreateMemberByMobile } from '../../services/storageService';
import type { MemberApplication } from '../../types';
import { normalizeDigits } from '../../utils/numberUtils';

interface MemberLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (member: MemberApplication) => void;
  currentLang: 'en' | 'ta';
}

export const MemberLoginModal: React.FC<MemberLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  currentLang
}) => {
  const [step, setStep] = useState<'MOBILE' | 'OTP'>('MOBILE');
  const [mobileNumber, setMobileNumber] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSmsBanner, setShowSmsBanner] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  // Generate random 6-digit OTP
  const generateRandomOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  // Reset modal state on open with clean empty input
  useEffect(() => {
    if (isOpen) {
      setStep('MOBILE');
      setMobileNumber('');
      setErrorMsg('');
      setIsSubmitting(false);
      setShowSmsBanner(false);
      setTimer(30);
      setOtpDigits(['', '', '', '', '', '']);
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
    }
  }, [isOpen]);

  // Timer interval for resend OTP
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
    let cleanNumber = normalizeDigits(mobileNumber);
    if (!cleanNumber) {
      cleanNumber = '9840123456';
    } else if (cleanNumber.length > 10) {
      cleanNumber = cleanNumber.slice(-10);
    }

    setMobileNumber(cleanNumber);
    setErrorMsg('');
    setIsSubmitting(true);

    setTimeout(() => {
      const randomCode = generateRandomOtp();
      setGeneratedOtp(randomCode);
      setIsSubmitting(false);
      setStep('OTP');
      setTimer(30);
      setShowSmsBanner(true);
      setOtpDigits(['', '', '', '', '', '']);
    }, 400);
  };

  const handleAutoFillOtp = () => {
    if (generatedOtp.length === 6) {
      setOtpDigits(generatedOtp.split(''));
      setErrorMsg('');
    }
  };

  const handleVerifyOtpAndLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const enteredOtp = otpDigits.join('');

    if (enteredOtp.length < 6) {
      setOtpDigits(generatedOtp.split(''));
    }

    setErrorMsg('');
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      let cleanMobile = normalizeDigits(mobileNumber);
      if (!cleanMobile) {
        cleanMobile = '9840123456';
      }
      const member = getOrCreateMemberByMobile(cleanMobile);
      onLoginSuccess(member);
      onClose();
    }, 400);
  };

  const handleDigitChange = (index: number, val: string) => {
    const clean = normalizeDigits(val);
    if (clean.length > 1) {
      const arr = [...otpDigits];
      clean.split('').forEach((ch, idx) => {
        if (index + idx < 6) {
          arr[index + idx] = ch;
        }
      });
      setOtpDigits(arr);
      const nextIdx = Math.min(5, index + clean.length);
      document.getElementById(`login-otp-digit-${nextIdx}`)?.focus();
      return;
    }

    const updated = [...otpDigits];
    updated[index] = clean.slice(-1);
    setOtpDigits(updated);

    if (clean && index < 5) {
      const nextInput = document.getElementById(`login-otp-digit-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      const prevInput = document.getElementById(`login-otp-digit-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = normalizeDigits(e.clipboardData.getData('text')).slice(0, 6);
    if (pasted.length > 0) {
      const arr = pasted.split('');
      while (arr.length < 6) arr.push('');
      setOtpDigits(arr);
    }
  };

  const handleResendOtp = () => {
    const newCode = generateRandomOtp();
    setGeneratedOtp(newCode);
    setTimer(30);
    setShowSmsBanner(true);
    setOtpDigits(['', '', '', '', '', '']);
    setErrorMsg('');
  };

  const cleanDigitsCount = normalizeDigits(mobileNumber).length;

  const handleDirectQuickLogin = (num: string) => {
    const clean = num.replace(/\D/g, '') || '9840123456';
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const member = getOrCreateMemberByMobile(clean);
      onLoginSuccess(member);
      onClose();
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#181B20] text-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-gray-800 gold-header-strip relative overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-16 h-16 bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 rounded-full flex items-center justify-center mx-auto shadow-inner">
            {step === 'MOBILE' ? <User className="w-8 h-8" /> : <Smartphone className="w-8 h-8" />}
          </div>
          <h3 className="text-2xl font-extrabold text-white">
            {step === 'MOBILE'
              ? (currentLang === 'ta' ? 'உறுப்பினர் உள்நுழைவு' : 'Member Login Portal')
              : (currentLang === 'ta' ? 'OTP சரிபார்த்து உள்நுழையவும்' : 'Verify OTP & Login')}
          </h3>
          <p className="text-xs text-gray-400">
            {step === 'MOBILE'
              ? (currentLang === 'ta' ? 'எந்த கைபேசி எண்ணையும் தட்டச்சு செய்து ID Card காணலாம்' : 'Type ANY mobile number to view Digital ID Card & Member Dashboard')
              : (currentLang === 'ta' ? `OTP +91 ${mobileNumber} எண்ணிற்கு அனுப்பப்பட்டது` : `Verification OTP sent to +91 ${mobileNumber}`)}
          </p>
        </div>

        {/* Simulated Real-Time SMS Toast Alert Banner */}
        {step === 'OTP' && showSmsBanner && (
          <div className="mb-6 bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/20 border-2 border-yellow-400 rounded-xl p-3.5 shadow-lg animate-bounce-subtle">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2.5">
                <div className="p-1.5 bg-yellow-400 text-slate-950 rounded-lg shrink-0 mt-0.5 font-bold text-xs">
                  SMS
                </div>
                <div>
                  <p className="text-xs font-bold text-yellow-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Tamil Sangam OTP Alert</span>
                  </p>
                  <p className="text-xs text-gray-200 mt-0.5">
                    Your login verification OTP for <span className="text-yellow-400 font-mono font-bold">+91 {mobileNumber}</span> is:{' '}
                    <span className="font-mono text-base font-extrabold text-yellow-300 tracking-wider bg-slate-900/80 px-2 py-0.5 rounded border border-yellow-400/40">
                      {generatedOtp}
                    </span>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAutoFillOtp}
                className="shrink-0 bg-yellow-400 hover:bg-yellow-300 text-slate-950 text-[11px] font-extrabold px-2.5 py-1.5 rounded-lg shadow transition-all active:scale-95 cursor-pointer"
              >
                Auto-Fill
              </button>
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="mb-4 bg-red-900/60 border border-red-500 text-red-200 text-xs p-3 rounded-xl">
            {errorMsg}
          </div>
        )}

        {/* STEP 1: Enter Any Mobile Number */}
        {step === 'MOBILE' ? (
          <form onSubmit={handleSendOtp} className="space-y-5">
            <div>
              <label htmlFor="login-mobile-input" className="block text-xs font-semibold text-gray-300 mb-1.5">
                {currentLang === 'ta' ? 'உங்கள் 10 இலக்க அலைபேசி எண்' : 'Type Your 10-Digit Mobile Number'}
              </label>
              <div className="relative cursor-text" onClick={() => inputRef.current?.focus()}>
                <span className="absolute left-3.5 top-3.5 text-sm font-bold text-yellow-400 pointer-events-none select-none">+91</span>
                <input
                  ref={inputRef}
                  id="login-mobile-input"
                  type="tel"
                  inputMode="numeric"
                  maxLength={15}
                  placeholder="Type any number e.g. 9876543210"
                  value={mobileNumber}
                  onChange={(e) => {
                    const clean = e.target.value.replace(/\D/g, '').slice(0, 10);
                    setMobileNumber(clean);
                    setErrorMsg('');
                  }}
                  className="w-full pl-14 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-base font-bold text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 font-mono tracking-wider cursor-text"
                  autoFocus
                />
              </div>

              {/* Live Count & Samples */}
              <div className="mt-2.5 flex items-center justify-between text-[11px] text-gray-400 flex-wrap gap-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-gray-400">Quick 1-Click Login:</span>
                  {['9840123456', '9789012345', '9123456789', '9444012345'].map((demoNum) => (
                    <button
                      key={demoNum}
                      type="button"
                      onClick={() => handleDirectQuickLogin(demoNum)}
                      className="bg-gray-800 hover:bg-yellow-400 hover:text-slate-950 font-mono text-yellow-400 px-2 py-0.5 rounded border border-gray-700 transition-colors cursor-pointer"
                      title="Click for instant login & view ID card"
                    >
                      {demoNum}
                    </button>
                  ))}
                </div>
                <span className={`font-mono font-bold ${cleanDigitsCount >= 10 ? 'text-green-400' : 'text-yellow-400'}`}>
                  {cleanDigitsCount}/10
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-[#181B20] font-extrabold py-3.5 rounded-xl shadow-xl transition-all uppercase text-sm tracking-wider cursor-pointer"
            >
              {isSubmitting ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span>{currentLang === 'ta' ? 'OTP அனுப்புக & ID அட்டை காண்' : 'SEND OTP & VIEW ID CARD'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          /* STEP 2: Verify Random OTP */
          <form onSubmit={handleVerifyOtpAndLogin} className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-gray-300">
                  {currentLang === 'ta' ? '6 இலக்க OTP உள்ளிடவும்' : 'Enter 6-Digit OTP Code'}
                </label>
                <button
                  type="button"
                  onClick={handleAutoFillOtp}
                  className="text-[11px] font-bold text-yellow-400 hover:text-yellow-300 bg-gray-800 hover:bg-gray-700 px-2.5 py-1 rounded-lg border border-yellow-400/40 cursor-pointer transition-colors"
                >
                  ⚡ Auto-Fill ({generatedOtp})
                </button>
              </div>

              <div className="flex justify-center gap-2" onPaste={handleOtpPaste}>
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`login-otp-digit-${idx}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleDigitChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    className="w-11 h-13 text-center text-xl font-bold bg-gray-900 border border-gray-700 focus:border-yellow-400 rounded-xl text-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 font-mono"
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-[#181B20] font-extrabold py-3.5 rounded-xl shadow-xl transition-all uppercase text-sm tracking-wider cursor-pointer"
            >
              {isSubmitting ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5" />
                  <span>{currentLang === 'ta' ? 'OTP சரிபார் & உள்நுழை' : 'VERIFY OTP & LOGIN'}</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-gray-800">
              <button
                type="button"
                onClick={() => setStep('MOBILE')}
                className="hover:text-yellow-400 transition-colors cursor-pointer"
              >
                ← {currentLang === 'ta' ? 'எண் மாற்றுக' : 'Change Mobile Number'}
              </button>

              <button
                type="button"
                disabled={timer > 0}
                onClick={handleResendOtp}
                className="hover:text-yellow-400 transition-colors disabled:opacity-50 cursor-pointer"
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

