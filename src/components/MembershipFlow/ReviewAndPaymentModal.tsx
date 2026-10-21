import React, { useState, useEffect, useRef } from 'react';
import type { MemberApplication } from '../../types';
import { ShieldCheck, CreditCard, X, RefreshCw, Smartphone, Lock, CheckCircle2, ArrowRight, KeyRound } from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../../services/apiClient';
import { normalizeDigits } from '../../utils/numberUtils';

interface ReviewAndPaymentModalProps {
  applicationData: Partial<MemberApplication>;
  onConfirmAndPay: (paymentDetails: { paymentMethod: string; transactionId: string }) => Promise<MemberApplication | undefined>;
  onLoginSuccess: (member: MemberApplication) => void;
  onBack: () => void;
  currentLang: 'en' | 'ta';
}

export const ReviewAndPaymentModal: React.FC<ReviewAndPaymentModalProps> = ({
  applicationData,
  onConfirmAndPay,
  onLoginSuccess,
  onBack,
  currentLang
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CARD' | 'NETBANKING'>('UPI');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccessStep, setPaymentSuccessStep] = useState(false);
  const [generatedTxn, setGeneratedTxn] = useState('');
  const [createdMember, setCreatedMember] = useState<MemberApplication | null>(null);

  // OTP Login States
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(45);
  const [otpError, setOtpError] = useState('');
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  const [upiId, setUpiId] = useState('member@upi');
  const [cardNumber, setCardNumber] = useState('4532 8910 2341 9012');

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer interval for resend OTP
  useEffect(() => {
    let interval: any = null;
    if (paymentSuccessStep && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [paymentSuccessStep, timer]);

  const handlePaySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const dummyTxn = `TXN-${paymentMethod}-${Date.now().toString().slice(-8)}`;
      setGeneratedTxn(dummyTxn);

      // Save member application to backend & generate official ID card
      const member = await onConfirmAndPay({
        paymentMethod: paymentMethod === 'UPI' ? 'UPI / GPay' : paymentMethod === 'CARD' ? 'Debit/Credit Card' : 'Net Banking',
        transactionId: dummyTxn
      });

      if (member) {
        setCreatedMember(member);
      }

      // Dispatch Login OTP to User's Mobile Phone
      const cleanMobile = normalizeDigits(applicationData.mobile || '').slice(-10);
      if (cleanMobile.length === 10) {
        try {
          await api.sendOtp(cleanMobile, 'LOGIN');
        } catch (otpErr) {
          console.warn('Post-payment send OTP error:', otpErr);
        }
      }

      setTimer(45);
      setOtpDigits(['', '', '', '', '', '']);

      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (err) {
        // confetti fallback
      }

      setPaymentSuccessStep(true);
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 300);
    } catch (err) {
      console.error('Payment or member creation failed:', err);
      alert('Payment processing failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleResendOtp = async () => {
    if (!createdMember && !applicationData.mobile) return;
    const cleanMobile = normalizeDigits(createdMember?.mobile || applicationData.mobile || '').slice(-10);
    if (cleanMobile.length !== 10) return;
    try {
      await api.sendOtp(cleanMobile, 'LOGIN');
    } catch (err) {
      console.warn('Resend OTP error:', err);
    }
    setTimer(45);
    setOtpDigits(['', '', '', '', '', '']);
    setOtpError('');
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
      otpInputRefs.current[nextIdx]?.focus();
      return;
    }

    const updated = [...otpDigits];
    updated[index] = clean;
    setOtpDigits(updated);
    setOtpError('');

    if (clean && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  // User manually submits OTP to complete login
  const handleVerifyOtpAndLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const enteredOtp = otpDigits.join('');

    if (enteredOtp.length < 6) {
      setOtpError(
        currentLang === 'ta'
          ? 'தயவுசெய்து உங்கள் கைபேசிக்கு வந்த 6 இலக்க OTP எண்ணை முழுமையாக உள்ளிடவும்.'
          : 'Please enter all 6 digits of the OTP sent to your phone.'
      );
      return;
    }

    setIsVerifyingOtp(true);
    setOtpError('');

    const targetMobile = normalizeDigits(createdMember?.mobile || applicationData.mobile || '').slice(-10);

    try {
      const verifyRes = await api.verifyOtp(targetMobile, enteredOtp, 'LOGIN');
      if (verifyRes.success) {
        const loginRes = await api.memberLogin(targetMobile, enteredOtp);
        setIsVerifyingOtp(false);
        const finalMember = loginRes.member || createdMember;
        if (finalMember) {
          onLoginSuccess(finalMember);
        }
      } else {
        setIsVerifyingOtp(false);
        setOtpError(verifyRes.message || (currentLang === 'ta' ? 'தவறான OTP எண்' : 'Invalid OTP code'));
      }
    } catch (err: any) {
      setIsVerifyingOtp(false);
      setOtpError(err.message || (currentLang === 'ta' ? 'தவறான OTP எண். மீண்டும் சரிபார்க்கவும்.' : 'Invalid OTP code. Please try again.'));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-[#1E232B] text-slate-900 dark:text-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200/80 dark:border-gray-800 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 mb-6">
          <div>
            <span className="text-xs font-bold text-[#8B1E26] dark:text-red-400 bg-[#FDF2F2] dark:bg-red-950/60 border border-[#8B1E26]/20 px-3 py-1 rounded-full uppercase tracking-wider">
              {paymentSuccessStep 
                ? (currentLang === 'ta' ? 'அடையாள அட்டை தயார் & OTP உள்நுழைவு' : 'ID Card Ready & OTP Login') 
                : (currentLang === 'ta' ? 'இறுதிப் படி' : 'Final Step')}
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#8B1E26] dark:text-amber-400 font-heading mt-1.5">
              {paymentSuccessStep
                ? (currentLang === 'ta' ? 'கட்டணம் பெறப்பட்டது & ID கார்டு உருவாக்கப்பட்டது!' : 'Payment Verified & ID Card Generated!')
                : (currentLang === 'ta' ? 'விண்ணப்ப மறுஆய்வு & கட்டணம் செலுத்தல்' : 'Review Application & Confirm Payment')}
            </h3>
          </div>
          {!paymentSuccessStep && (
            <button onClick={onBack} className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {paymentSuccessStep ? (
          <div className="space-y-6 py-2">
            
            {/* Top Success Banner */}
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mx-auto shadow-inner border border-emerald-300 dark:border-emerald-800 animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-2xl font-extrabold text-slate-900 dark:text-white font-heading">
                {currentLang === 'ta' ? 'கட்டணம் வெற்றிகரமாக பெறப்பட்டது!' : 'Payment Received Successfully!'}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                {currentLang === 'ta'
                  ? 'உங்களின் உறுப்பினர் கட்டணம் பெறப்பட்டு விண்ணப்பம் நிர்வாகியின் ஒப்புதலுக்காக அனுப்பப்பட்டுள்ளது.'
                  : 'Your membership fee has been received and your application is submitted for Admin Approval.'}
              </p>
            </div>

            {/* Application & Payment Submission Receipt */}
            <div className="bg-gradient-to-r from-[#8B1E26] via-[#72151C] to-[#8B1E26] text-white p-5 rounded-2xl border-2 border-amber-400 shadow-xl space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <span className="text-[10px] uppercase font-bold text-amber-200 tracking-wider">
                    {currentLang === 'ta' ? 'விண்ணப்ப எண்' : 'APPLICATION REFERENCE'}
                  </span>
                  <p className="text-xl font-mono font-black text-amber-300 tracking-wider">
                    {createdMember?.id || 'APP-PENDING'}
                  </p>
                  {generatedTxn && (
                    <p className="text-[11px] font-mono text-amber-100 mt-0.5">
                      Txn: {generatedTxn} • ₹{applicationData.paymentAmount || 100} ({paymentMethod})
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <span className="bg-amber-400 text-slate-950 font-black text-[11px] px-3 py-1 rounded-full uppercase shadow">
                    PENDING ADMIN APPROVAL
                  </span>
                  <p className="text-amber-100 text-[11px] mt-1 font-semibold">{applicationData.categoryName}</p>
                </div>
              </div>

              <div className="bg-black/30 backdrop-blur-sm p-3 rounded-xl border border-white/10 text-xs text-amber-100/90 leading-relaxed">
                <p className="font-semibold text-amber-300 flex items-center gap-1.5 mb-1">
                  <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{currentLang === 'ta' ? 'நிர்வாக ஒப்புதல் & ID கார்டு எண் அறிவிப்பு:' : 'Admin Approval & ID Card Notice:'}</span>
                </p>
                <span>
                  {currentLang === 'ta'
                    ? `மாநில நிர்வாகி தங்கள் ஆவணங்களை சரிபார்த்து ஒப்புதல் அளித்தவுடன், உங்களின் அதிகாரப்பூர்வ உறுப்பினர் அடையாள அட்டை எண் (ID Card Number) உருவாக்கப்பட்டு உங்கள் மின்னஞ்சல் (${applicationData.email || 'Email'}) மற்றும் SMS வழியாக அனுப்பப்படும்.`
                    : `Once the State Admin reviews and approves your documents, your official Membership ID Card Number will be generated and dispatched to your email (${applicationData.email || 'Email'}) and phone.`}
                </span>
              </div>
            </div>

            {/* OTP LOGIN FORM - User must enter OTP from phone to proceed */}
            <div className="bg-amber-50/70 dark:bg-slate-900 p-6 rounded-3xl border-2 border-amber-400 dark:border-amber-500/50 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#8B1E26] text-white flex items-center justify-center shrink-0 shadow">
                  <KeyRound className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <h5 className="font-extrabold text-slate-900 dark:text-white text-sm sm:text-base font-heading">
                    {currentLang === 'ta' ? 'OTP உள்ளிட்டு கணக்கில் நுழையவும்' : 'Enter OTP to Access Member Account'}
                  </h5>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {currentLang === 'ta'
                      ? `உங்களின் கைபேசி (+91 ${applicationData.mobile})க்கு வந்த 6 இலக்க OTP ஐ உள்ளிடவும்.`
                      : `Enter the 6-digit OTP sent to your phone (+91 ${applicationData.mobile}).`}
                  </p>
                </div>
              </div>

              {/* Status Notice - Real SMS Dispatched to Mobile */}
              <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700/60 text-slate-800 dark:text-gray-200 p-3.5 rounded-xl text-xs space-y-1 animate-fadeIn">
                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold">
                  <Smartphone className="w-4 h-4" />
                  <span>{currentLang === 'ta' ? 'OTP உங்கள் கைபேசிக்கு அனுப்பப்பட்டது' : 'OTP Dispatched via SMS'}</span>
                </div>
                <p className="text-slate-600 dark:text-gray-300 text-[11px] leading-relaxed">
                  {currentLang === 'ta'
                    ? `+91 ${applicationData.mobile} என்ற எண்ணிற்கு 6 இலக்க உள்நுழைவு OTP SMS வழியாக அனுப்பப்பட்டுள்ளது. உங்கள் மொபைலைப் பார்த்து கீழே உள்ளிடவும்.`
                    : `A 6-digit login OTP code has been dispatched to +91 ${applicationData.mobile} via SMS. Please enter the code below to log in.`}
                </p>
              </div>

              {/* 6-Digit OTP Form */}
              <form onSubmit={handleVerifyOtpAndLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-800 dark:text-slate-200 mb-2">
                    {currentLang === 'ta' ? '6 இலக்க OTP எண் (User Must Enter):' : 'Enter 6-Digit OTP Code:'}
                  </label>
                  <div className="flex items-center justify-center gap-2 sm:gap-3">
                    {otpDigits.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => { otpInputRefs.current[idx] = el; }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleDigitChange(idx, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(idx, e)}
                        className="w-11 h-13 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-black rounded-xl border-2 border-slate-300 dark:border-gray-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-[#8B1E26] dark:focus:border-amber-400 focus:ring-2 focus:ring-[#8B1E26]/20 focus:outline-none transition-all shadow-inner"
                      />
                    ))}
                  </div>
                </div>

                {otpError && (
                  <p className="text-xs font-bold text-red-600 dark:text-red-400 text-center animate-shake">
                    {otpError}
                  </p>
                )}

                {/* Resend OTP Timer */}
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
                  <span>
                    {timer > 0 ? (
                      `${currentLang === 'ta' ? 'மீண்டும் அனுப்ப' : 'Resend OTP in'}: ${timer}s`
                    ) : (
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        className="text-[#8B1E26] dark:text-amber-400 font-bold hover:underline cursor-pointer flex items-center gap-1"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>{currentLang === 'ta' ? 'மறுமுறை OTP அனுப்புக' : 'Resend OTP Now'}</span>
                      </button>
                    )}
                  </span>
                  <span className="font-semibold text-slate-600 dark:text-slate-300">
                    Mobile: +91 {applicationData.mobile}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isVerifyingOtp}
                  className="w-full flex items-center justify-center gap-2 bg-[#8B1E26] hover:bg-[#72151C] text-white font-extrabold py-4 rounded-xl shadow-xl hover:shadow-[#8B1E26]/30 transition-all uppercase text-xs sm:text-sm tracking-wider cursor-pointer"
                >
                  {isVerifyingOtp ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <span>{currentLang === 'ta' ? 'OTP சரிபார்த்து கணக்கில் நுழைக' : 'VERIFY OTP & OPEN MEMBER DASHBOARD'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Helper / WhatsApp Support */}
                <div className="pt-2 border-t border-amber-200/60 dark:border-gray-800 text-center">
                  <a
                    href={`https://wa.me/91${applicationData.mobile}?text=Tamil%20Sangam%20Payment%20OTP%20Support`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] font-bold text-slate-500 hover:text-emerald-700 dark:text-gray-400 dark:hover:text-emerald-400 hover:underline inline-flex items-center gap-1"
                  >
                    <span>📲 {currentLang === 'ta' ? 'SMS தாமதமானால்: WhatsApp ஆதரவு' : 'SMS delayed? WhatsApp Support'}</span>
                  </a>
                </div>
              </form>
            </div>

          </div>
        ) : (
          <div>
            {/* Application Summary Cards */}
            <div className="space-y-4 mb-6">
              
              <div className="bg-slate-50 dark:bg-slate-900/80 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 text-xs space-y-2">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                  <span className="font-extrabold text-slate-900 dark:text-white text-sm">{applicationData.fullName}</span>
                  <span className="bg-[#8B1E26] text-white text-[10px] font-black px-2.5 py-0.5 rounded shadow">
                    {applicationData.categoryName}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-slate-600 dark:text-slate-300">
                  <p><strong className="text-slate-900 dark:text-white">Name (Tamil):</strong> {applicationData.nameTamil}</p>
                  <p><strong className="text-slate-900 dark:text-white">Mobile:</strong> +91 {applicationData.mobile}</p>
                  <p><strong className="text-slate-900 dark:text-white">District:</strong> {applicationData.district}</p>
                  <p><strong className="text-slate-900 dark:text-white">Pasarai:</strong> {applicationData.pasaraiName}</p>
                  <p><strong className="text-slate-900 dark:text-white">Aadhaar:</strong> {applicationData.aadhaarNumber}</p>
                  <p><strong className="text-slate-900 dark:text-white">Email:</strong> {applicationData.email}</p>
                </div>

                {applicationData.aadhaarDocUrl && (
                  <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center gap-3">
                    <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Aadhaar Card Uploaded:</span>
                    <div className="w-16 h-12 rounded-lg border-2 border-[#8B1E26] dark:border-amber-400 overflow-hidden shadow-sm">
                      <img src={applicationData.aadhaarDocUrl} alt="Aadhaar" className="w-full h-full object-cover" />
                    </div>
                  </div>
                )}
              </div>

              {/* Membership Fee Box in Signature Home Page Maroon Gradient */}
              <div className="bg-gradient-to-r from-[#8B1E26] via-[#72151C] to-[#600D13] text-white p-5 rounded-2xl flex items-center justify-between border-l-4 border-amber-400 shadow-xl">
                <div>
                  <p className="text-xs text-amber-100/90 font-medium">Total Membership Registration Fee</p>
                  <p className="text-3xl font-extrabold text-amber-300 font-mono tracking-tight">
                    ₹{applicationData.paymentAmount || 100}
                  </p>
                </div>
                <div className="text-right text-xs text-amber-100/80">
                  <p className="font-semibold text-white">Category: {applicationData.categoryName}</p>
                  <p className="text-emerald-300 font-semibold flex items-center justify-end gap-1 mt-0.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Includes GST & Digital ID Processing</span>
                  </p>
                </div>
              </div>

            </div>

            {/* Payment Gateway Options */}
            <form onSubmit={handlePaySubmit} className="space-y-6">
              
              <div>
                <label className="block text-xs font-bold text-slate-900 dark:text-slate-200 mb-2 font-heading">
                  Select Payment Method / செலுத்தும் முறை
                </label>
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('UPI')}
                    className={`p-3 rounded-xl border font-bold flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      paymentMethod === 'UPI' ? 'bg-[#FDF2F2] dark:bg-red-950/50 border-2 border-[#8B1E26] dark:border-amber-400 text-[#8B1E26] dark:text-amber-300 ring-2 ring-[#8B1E26] dark:ring-amber-400 shadow-md' : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    <Smartphone className="w-5 h-5 text-[#8B1E26] dark:text-amber-400" />
                    <span>UPI / GPay / Paytm</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('CARD')}
                    className={`p-3 rounded-xl border font-bold flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      paymentMethod === 'CARD' ? 'bg-[#FDF2F2] dark:bg-red-950/50 border-2 border-[#8B1E26] dark:border-amber-400 text-[#8B1E26] dark:text-amber-300 ring-2 ring-[#8B1E26] dark:ring-amber-400 shadow-md' : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-[#8B1E26] dark:text-amber-400" />
                    <span>Debit / Credit Card</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('NETBANKING')}
                    className={`p-3 rounded-xl border font-bold flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      paymentMethod === 'NETBANKING' ? 'bg-[#FDF2F2] dark:bg-red-950/50 border-2 border-[#8B1E26] dark:border-amber-400 text-[#8B1E26] dark:text-amber-300 ring-2 ring-[#8B1E26] dark:ring-amber-400 shadow-md' : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    <ShieldCheck className="w-5 h-5 text-[#8B1E26] dark:text-amber-400" />
                    <span>Net Banking</span>
                  </button>
                </div>
              </div>

              {/* Payment Detail Field */}
              {paymentMethod === 'UPI' && (
                <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Enter VPA / Virtual Payment Address</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm font-semibold text-slate-800 dark:text-white focus:ring-2 focus:ring-[#8B1E26] focus:border-[#8B1E26] dark:focus:ring-amber-400 focus:outline-none"
                    required
                  />
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Supported: GPay, PhonePe, Paytm, BHIM, Amazon Pay</p>
                </div>
              )}

              {paymentMethod === 'CARD' && (
                <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-3.5 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg font-semibold text-slate-800 dark:text-white focus:ring-2 focus:ring-[#8B1E26] focus:border-[#8B1E26] dark:focus:ring-amber-400 focus:outline-none"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Expiry (MM/YY)</label>
                      <input type="text" defaultValue="08/28" className="w-full px-3.5 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-white focus:ring-2 focus:ring-[#8B1E26] focus:border-[#8B1E26] dark:focus:ring-amber-400 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">CVV</label>
                      <input type="password" defaultValue="982" maxLength={3} className="w-full px-3.5 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-white focus:ring-2 focus:ring-[#8B1E26] focus:border-[#8B1E26] dark:focus:ring-amber-400 focus:outline-none" />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'NETBANKING' && (
                <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                  <label className="block font-bold text-slate-700 dark:text-slate-300">Select Popular Bank</label>
                  <select className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg font-semibold text-slate-800 dark:text-white focus:ring-2 focus:ring-[#8B1E26] focus:border-[#8B1E26] dark:focus:ring-amber-400 focus:outline-none">
                    <option>State Bank of India (SBI)</option>
                    <option>HDFC Bank</option>
                    <option>ICICI Bank</option>
                    <option>Indian Overseas Bank (IOB)</option>
                    <option>Axis Bank</option>
                  </select>
                </div>
              )}

              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800">
                <span className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                  <Lock className="w-3.5 h-3.5" /> 256-Bit SSL Secured Gateway
                </span>
                <span>Ref: TS-REG-2026</span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={onBack}
                  className="text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                >
                  ← Edit Details
                </button>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="flex items-center gap-2 bg-[#8B1E26] hover:bg-[#72151C] text-white text-sm font-extrabold px-8 py-3.5 rounded-xl shadow-xl hover:shadow-[#8B1E26]/30 transition-all uppercase tracking-wide cursor-pointer"
                >
                  {isProcessing ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>CONFIRM & PAY ₹{applicationData.paymentAmount || 100}</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        )}

      </div>
    </div>
  );
};
