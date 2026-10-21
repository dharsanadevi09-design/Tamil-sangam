import React, { useState, useEffect, useRef } from 'react';
import { Smartphone, ShieldCheck, ArrowRight, RefreshCw, X, CheckCircle2, User } from 'lucide-react';
import { getMemberById } from '../../services/storageService';
import { api } from '../../services/apiClient';
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
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(45);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  // Reset modal state on open with clean empty input
  useEffect(() => {
    if (isOpen) {
      setStep('MOBILE');
      setMobileNumber('');
      setErrorMsg('');
      setIsSubmitting(false);
      setTimer(45);
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

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNumber = normalizeDigits(mobileNumber).slice(-10);
    if (!cleanNumber || cleanNumber.length !== 10) {
      setErrorMsg(
        currentLang === 'ta'
          ? 'தயவுசெய்து உங்கள் சரியான 10 இலக்க மொபைல் எண்ணை உள்ளிடவும்.'
          : 'Please enter a valid 10-digit mobile number.'
      );
      return;
    }

    setMobileNumber(cleanNumber);
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      await api.sendOtp(cleanNumber, 'LOGIN');
      setIsSubmitting(false);
      setStep('OTP');
      setTimer(45);
      setOtpDigits(['', '', '', '', '', '']);
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMsg(
        err.message ||
        (currentLang === 'ta'
          ? 'இந்த கைபேசி எண் தமிழ் சங்கத்தில் பதிவு செய்யப்படவில்லை அல்லது OTP அனுப்புவதில் பிழை ஏற்பட்டது.'
          : 'This mobile number is not registered or failed to dispatch OTP.')
      );
    }
  };

  const handleVerifyOtpAndLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const enteredOtp = otpDigits.join('');

    if (enteredOtp.length < 6) {
      setErrorMsg(
        currentLang === 'ta'
          ? 'தயவுசெய்து உங்கள் கைபேசிக்கு வந்த 6 இலக்க OTP எண்ணை முழுமையாக உள்ளிடவும்.'
          : 'Please enter all 6 digits of the OTP sent to your mobile phone.'
      );
      return;
    }

    setErrorMsg('');
    setIsSubmitting(true);

    const cleanMobile = normalizeDigits(mobileNumber).slice(-10);

    try {
      const res = await api.memberLogin(cleanMobile, enteredOtp);
      setIsSubmitting(false);
      if (res.member) {
        onLoginSuccess(res.member);
        onClose();
      } else {
        const localMember = getMemberById(cleanMobile);
        if (localMember) {
          onLoginSuccess(localMember);
          onClose();
        } else {
          setErrorMsg(currentLang === 'ta' ? 'உறுப்பினர் கணக்கு காணப்படவில்லை' : 'Member record not found');
        }
      }
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMsg(
        err.message ||
        (currentLang === 'ta'
          ? 'தவறான OTP எண். உங்கள் மொபைலுக்கு வந்த சரியான OTP எண்ணை உள்ளிடவும்.'
          : 'Invalid OTP code. Please enter the correct OTP sent to your phone.')
      );
    }
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

  const handleResendOtp = async () => {
    const cleanMobile = normalizeDigits(mobileNumber).slice(-10);
    if (cleanMobile.length !== 10) return;
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      await api.sendOtp(cleanMobile, 'LOGIN');
      setTimer(45);
      setOtpDigits(['', '', '', '', '', '']);
    } catch (err: any) {
      setErrorMsg(
        err.message || (currentLang === 'ta' ? 'OTP அனுப்புவதில் சிக்கல் ஏற்பட்டது' : 'Failed to resend OTP')
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const cleanDigitsCount = normalizeDigits(mobileNumber).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-[#1E232B] text-slate-900 dark:text-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200/80 dark:border-gray-800 relative overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-14 h-14 bg-[#FDF2F2] dark:bg-red-950/60 border border-[#8B1E26]/20 text-[#8B1E26] dark:text-red-400 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
            {step === 'MOBILE' ? <User className="w-7 h-7" /> : <Smartphone className="w-7 h-7" />}
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white font-heading">
            {step === 'MOBILE'
              ? (currentLang === 'ta' ? 'உறுப்பினர் உள்நுழைவு' : 'Member Login Portal')
              : (currentLang === 'ta' ? 'OTP சரிபார்த்து உள்நுழையவும்' : 'Verify OTP & Login')}
          </h3>
          <p className="text-xs text-slate-500 dark:text-gray-400">
            {step === 'MOBILE'
              ? (currentLang === 'ta' ? 'உங்கள் பதிவு செய்யப்பட்ட 10 இலக்க மொபைல் எண்ணை உள்ளிடவும்' : 'Enter your registered 10-digit mobile number')
              : (currentLang === 'ta' ? `ரகசிய OTP எண் +91 ${mobileNumber} மொபைலுக்கு அனுப்பப்பட்டது` : `Secret OTP sent to +91 ${mobileNumber} via SMS`)}
          </p>
        </div>

        {/* Sent OTP Status Notice - Real SMS Dispatched to Mobile */}
        {step === 'OTP' && (
          <div className="mb-6 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700/60 rounded-2xl p-4 text-xs shadow-sm animate-fadeIn">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-emerald-600 text-white rounded-xl shrink-0 mt-0.5 shadow-sm">
                <Smartphone className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <p className="font-extrabold text-emerald-800 dark:text-emerald-300 text-sm flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>{currentLang === 'ta' ? 'OTP உங்கள் கைபேசிக்கு அனுப்பப்பட்டது' : 'OTP Dispatched to Your Mobile'}</span>
                </p>
                <p className="text-slate-600 dark:text-gray-300 text-xs leading-relaxed">
                  {currentLang === 'ta'
                    ? `+91 ${mobileNumber} என்ற உங்கள் கைபேசி எண்ணிற்கு 6 இலக்க சரிபார்ப்புக் குறியீடு (OTP) SMS வழியாக தானாக அனுப்பப்பட்டுள்ளது. உங்கள் மொபைலில் வந்த SMS-ஐப் பார்த்து கீழே உள்ளிடவும்.`
                    : `A 6-digit random verification code has been dispatched via SMS directly to +91 ${mobileNumber}. Please check your phone SMS and enter the code below.`}
                </p>
              </div>
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="mb-4 bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs p-3 rounded-xl">
            {errorMsg}
          </div>
        )}

        {/* STEP 1: Enter Mobile Number */}
        {step === 'MOBILE' ? (
          <form onSubmit={handleSendOtp} className="space-y-5">
            <div>
              <label htmlFor="login-mobile-input" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {currentLang === 'ta' ? 'உங்கள் 10 இலக்க அலைபேசி எண்' : 'Type Your 10-Digit Mobile Number'}
              </label>
              <div className="relative cursor-text" onClick={() => inputRef.current?.focus()}>
                <span className="absolute left-3.5 top-3.5 text-sm font-extrabold text-[#8B1E26] dark:text-amber-400 pointer-events-none select-none">+91</span>
                <input
                  ref={inputRef}
                  id="login-mobile-input"
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  placeholder="e.g. 9876543210"
                  value={mobileNumber}
                  onChange={(e) => {
                    const clean = e.target.value.replace(/\D/g, '').slice(0, 10);
                    setMobileNumber(clean);
                    setErrorMsg('');
                  }}
                  className="w-full pl-14 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-gray-700 rounded-xl text-base font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#8B1E26] focus:border-[#8B1E26] font-mono tracking-wider cursor-text shadow-sm"
                  autoFocus
                />
              </div>

              {/* Digit Count */}
              <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500 dark:text-gray-400">
                <span className="text-slate-500 dark:text-gray-400">
                  {currentLang === 'ta' ? 'பதிவு செய்யப்பட்ட 10 இலக்க எண்' : 'Registered 10-Digit Mobile'}
                </span>
                <span className={`font-mono font-bold ${cleanDigitsCount >= 10 ? 'text-emerald-600 dark:text-emerald-400' : 'text-[#8B1E26] dark:text-amber-400'}`}>
                  {cleanDigitsCount}/10
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || cleanDigitsCount !== 10}
              className="w-full flex items-center justify-center gap-2 bg-[#8B1E26] hover:bg-[#72151C] disabled:opacity-50 text-white font-extrabold py-3.5 rounded-xl shadow-lg transition-all uppercase text-sm tracking-wider cursor-pointer"
            >
              {isSubmitting ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span>{currentLang === 'ta' ? 'OTP அனுப்புக & உள்நுழைக' : 'SEND OTP TO MOBILE'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          /* STEP 2: Verify Random OTP (User types the code received on phone) */
          <form onSubmit={handleVerifyOtpAndLogin} className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {currentLang === 'ta' ? 'உங்கள் மொபைலுக்கு வந்த 6 இலக்க OTP உள்ளிடவும்:' : 'Enter 6-Digit OTP received on phone:'}
                </label>
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
                    className="w-11 h-13 text-center text-xl font-bold bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-gray-700 focus:border-[#8B1E26] rounded-xl text-[#8B1E26] dark:text-amber-400 focus:outline-none focus:ring-2 focus:ring-[#8B1E26] font-mono shadow-sm"
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || otpDigits.join('').length !== 6}
              className="w-full flex items-center justify-center gap-2 bg-[#8B1E26] hover:bg-[#72151C] disabled:opacity-50 text-white font-extrabold py-3.5 rounded-xl shadow-lg transition-all uppercase text-sm tracking-wider cursor-pointer"
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

            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-gray-400 pt-2 border-t border-slate-200 dark:border-gray-800">
              <button
                type="button"
                onClick={() => setStep('MOBILE')}
                className="hover:text-[#8B1E26] dark:hover:text-amber-300 transition-colors cursor-pointer font-semibold"
              >
                ← {currentLang === 'ta' ? 'எண் மாற்றுக' : 'Change Mobile Number'}
              </button>

              <button
                type="button"
                disabled={timer > 0 || isSubmitting}
                onClick={handleResendOtp}
                className="hover:text-[#8B1E26] dark:hover:text-amber-300 transition-colors disabled:opacity-50 cursor-pointer font-semibold"
              >
                {timer > 0 ? (currentLang === 'ta' ? `${timer} வினாடிகளில் மறுபடி OTP` : `Resend OTP in ${timer}s`) : (currentLang === 'ta' ? 'மறுபடியும் OTP அனுப்புக' : 'Resend OTP')}
              </button>
            </div>

            {/* Quick SMS & WhatsApp Help */}
            <div className="pt-1 text-center">
              <a
                href={`https://wa.me/91${mobileNumber}?text=Tamil%20Sangam%20Login%20OTP%20Support`}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] font-bold text-slate-500 hover:text-emerald-700 dark:text-gray-400 dark:hover:text-emerald-400 hover:underline inline-flex items-center gap-1"
              >
                <span>📲 {currentLang === 'ta' ? 'SMS தாமதமானால்: WhatsApp ஆதரவு' : 'SMS delayed? WhatsApp Support'}</span>
              </a>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};

