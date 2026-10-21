import React, { useState } from 'react';
import type { MemberApplication } from '../../types';
import { 
  ShieldCheck, 
  CreditCard, 
  X, 
  RefreshCw, 
  Smartphone, 
  Lock, 
  CheckCircle2, 
  ArrowRight, 
  AlertTriangle, 
  QrCode, 
  Building2, 
  User
} from 'lucide-react';
import confetti from 'canvas-confetti';

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
  
  // Payment Gateway States: PENDING -> PROCESSING -> SUCCESS or FAILED
  const [paymentStatus, setPaymentStatus] = useState<'PENDING' | 'PROCESSING' | 'SUCCESS' | 'FAILED'>('PENDING');
  const [generatedTxn, setGeneratedTxn] = useState('');
  const [createdMember, setCreatedMember] = useState<MemberApplication | null>(null);
  const [failureReason, setFailureReason] = useState('');

  // Simulator toggle for testing both Success & Failure scenarios
  const [simulateOutcome, setSimulateOutcome] = useState<'SUCCESS' | 'FAILURE'>('SUCCESS');

  // Input states
  const [upiId, setUpiId] = useState(`${applicationData.mobile || 'member'}@okhdfcbank`);
  const [cardNumber, setCardNumber] = useState('4532 8910 2341 9012');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvv, setCardCvv] = useState('892');
  const [cardName, setCardName] = useState(applicationData.fullName || 'Member Name');
  const [selectedBank, setSelectedBank] = useState('State Bank of India (SBI)');

  const amount = applicationData.paymentAmount || 100;

  // Handle Payment Submission
  const handlePaySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentStatus('PROCESSING');
    setFailureReason('');

    // Simulate realistic 1.8 second gateway transaction processing
    await new Promise((resolve) => setTimeout(resolve, 1800));

    // SCENARIO 1: PAYMENT FAILED
    // "payment aagala na next process poga kudathu"
    if (simulateOutcome === 'FAILURE') {
      setPaymentStatus('FAILED');
      setFailureReason(
        currentLang === 'ta'
          ? 'வங்கி பரிவர்த்தனை தோல்வியடைந்தது அல்லது ரத்து செய்யப்பட்டது. கட்டணம் வெற்றி பெறாததால் அடுத்த படிக்கு செல்ல முடியாது.'
          : 'Bank transaction was declined or cancelled. You cannot proceed to the next step without successful payment.'
      );
      return;
    }

    // SCENARIO 2: PAYMENT SUCCESS
    // "payment success ana mattum tha next process poganum"
    try {
      const txn = `TXN-${paymentMethod}-${Date.now().toString().slice(-8)}`;
      setGeneratedTxn(txn);

      const paymentMethodName = 
        paymentMethod === 'UPI' ? 'UPI / GPay' :
        paymentMethod === 'CARD' ? 'Debit/Credit Card' : 'Net Banking';

      // Save member to backend & SQLite database only on payment success
      const member = await onConfirmAndPay({
        paymentMethod: paymentMethodName,
        transactionId: txn
      });

      if (member) {
        setCreatedMember(member);
      }

      setPaymentStatus('SUCCESS');

      try {
        confetti({
          particleCount: 120,
          spread: 90,
          origin: { y: 0.6 }
        });
      } catch (err) {
        // confetti fallback
      }
    } catch (err: any) {
      console.error('Payment confirmation error:', err);
      setPaymentStatus('FAILED');
      setFailureReason(
        err.message || 
        (currentLang === 'ta' 
          ? 'கட்டணம் செயலாக்கத்தில் பிழை ஏற்பட்டது. மீண்டும் முயற்சிக்கவும்.' 
          : 'Payment processing error. Please try again.')
      );
    }
  };

  // Reset to retry payment if failed
  const handleRetryPayment = () => {
    setPaymentStatus('PENDING');
    setFailureReason('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="bg-white dark:bg-[#1E232B] text-slate-900 dark:text-white rounded-3xl max-w-2xl w-full p-5 sm:p-8 shadow-2xl border border-slate-200/80 dark:border-gray-800 my-6 relative">
        
        {/* Header Strip */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 mb-6">
          <div>
            <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border ${
              paymentStatus === 'SUCCESS'
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300'
                : paymentStatus === 'FAILED'
                ? 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300 border-red-300'
                : 'text-[#8B1E26] dark:text-red-400 bg-[#FDF2F2] dark:bg-red-950/60 border-[#8B1E26]/20'
            }`}>
              {paymentStatus === 'SUCCESS' 
                ? (currentLang === 'ta' ? 'படி 3: கட்டணம் வெற்றி ✓' : 'Step 3: Payment Success ✓') 
                : paymentStatus === 'FAILED'
                ? (currentLang === 'ta' ? 'படி 3: கட்டணம் தோல்வி ✗' : 'Step 3: Payment Failed ✗')
                : (currentLang === 'ta' ? 'படி 3: கட்டணம் செலுத்துதல்' : 'Step 3: Membership Fee Payment')}
            </span>

            <h3 className="text-xl sm:text-2xl font-extrabold text-[#8B1E26] dark:text-amber-400 font-heading mt-1.5">
              {paymentStatus === 'SUCCESS'
                ? (currentLang === 'ta' ? 'கட்டணம் பெறப்பட்டது! உறுப்பினர் தளம் தயார்' : 'Payment Verified! Member Access Ready')
                : paymentStatus === 'FAILED'
                ? (currentLang === 'ta' ? 'கட்டணம் பெறப்படவில்லை!' : 'Payment Failed / Incomplete')
                : (currentLang === 'ta' ? 'விண்ணப்ப மறுஆய்வு & கட்டணம் செலுத்துதல்' : 'Review Application & Complete Payment')}
            </h3>
          </div>

          {paymentStatus !== 'PROCESSING' && (
            <button 
              onClick={onBack} 
              className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Close / Back"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* ======================================================== */}
        {/* VIEW 1: PAYMENT SUCCESS (Unlocks Next Process Button)      */}
        {/* ======================================================== */}
        {paymentStatus === 'SUCCESS' ? (
          <div className="space-y-6 py-2 animate-fadeIn">
            {/* Top Success Badge */}
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mx-auto shadow-inner border-2 border-emerald-400 dark:border-emerald-600 animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-2xl font-extrabold text-slate-900 dark:text-white font-heading">
                {currentLang === 'ta' ? 'கட்டணம் வெற்றிகரமாக பெறப்பட்டது!' : 'Payment Verified Successfully!'}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                {currentLang === 'ta'
                  ? 'உங்களின் உறுப்பினர் சேர்க்கைக் கட்டணம் வெற்றிகரமாக பெறப்பட்டது. உங்களின் உறுப்பினர் தளம் மற்றும் டிஜிட்டல் ID கார்டை இப்போது பார்க்கலாம்.'
                  : 'Your membership fee has been received and verified. Your Member Dashboard and Digital ID Card are now ready.'}
              </p>
            </div>

            {/* Official Payment Receipt Card */}
            <div className="bg-gradient-to-r from-[#8B1E26] via-[#72151C] to-[#8B1E26] text-white p-6 rounded-3xl border-2 border-amber-400 shadow-xl space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2 border-b border-white/20 pb-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-amber-200 tracking-wider">
                    {currentLang === 'ta' ? 'விண்ணப்ப எண்' : 'APPLICATION REFERENCE'}
                  </span>
                  <p className="text-2xl font-mono font-black text-amber-300 tracking-wider">
                    {createdMember?.id || 'APP-COMPLETED'}
                  </p>
                </div>
                <div className="text-right">
                  <span className="bg-emerald-500 text-white font-black text-xs px-3 py-1 rounded-full uppercase shadow inline-flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> PAID ₹{amount}
                  </span>
                  <p className="text-amber-100 text-xs mt-1 font-semibold">{applicationData.categoryName}</p>
                </div>
              </div>

              {/* Receipt Details Table */}
              <div className="grid grid-cols-2 gap-3 text-xs text-amber-100/90 pt-1">
                <div>
                  <span className="text-white/60 block text-[10px] uppercase">{currentLang === 'ta' ? 'உறுப்பினர் பெயர்' : 'MEMBER NAME'}</span>
                  <span className="font-bold text-white text-sm">{applicationData.fullName}</span>
                </div>
                <div>
                  <span className="text-white/60 block text-[10px] uppercase">{currentLang === 'ta' ? 'கைபேசி எண்' : 'MOBILE NUMBER'}</span>
                  <span className="font-mono font-bold text-white">+91 {applicationData.mobile}</span>
                </div>
                <div>
                  <span className="text-white/60 block text-[10px] uppercase">{currentLang === 'ta' ? 'பரிவர்த்தனை எண்' : 'TRANSACTION ID'}</span>
                  <span className="font-mono font-bold text-amber-300">{generatedTxn}</span>
                </div>
                <div>
                  <span className="text-white/60 block text-[10px] uppercase">{currentLang === 'ta' ? 'செலுத்தும் முறை' : 'PAYMENT METHOD'}</span>
                  <span className="font-bold text-white">{paymentMethod === 'UPI' ? 'UPI / GPay' : paymentMethod === 'CARD' ? 'Card' : 'Net Banking'}</span>
                </div>
              </div>

              {/* Next Step Information Banner */}
              <div className="bg-black/30 backdrop-blur-sm p-3.5 rounded-xl border border-white/10 text-xs text-amber-100/90 leading-relaxed">
                <p className="font-semibold text-amber-300 flex items-center gap-1.5 mb-1">
                  <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{currentLang === 'ta' ? 'உறுப்பினர் அட்டை & அடுத்த கட்டம்:' : 'Official ID Card & Next Steps:'}</span>
                </p>
                <span>
                  {currentLang === 'ta'
                    ? `கட்டணம் வெற்றிகரமாக பெறப்பட்டது. உங்களின் தற்காலிக டிஜிட்டல் உறுப்பினர் அடையாள அட்டை உருவாக்கப்பட்டு உறுப்பினர் தளத்தில் இணைக்கப்பட்டுள்ளது. மாநில நிர்வாகி ஒப்புதல் அளித்தவுடன் இறுதி அடையாள அட்டை எண் (+91 ${applicationData.mobile}) SMS மற்றும் மின்னஞ்சல் மூலம் உறுதி செய்யப்படும்.`
                    : `Payment verified. Your provisional Digital Membership ID Card is now unlocked in your Member Dashboard. Full verification details dispatched to +91 ${applicationData.mobile}.`}
                </span>
              </div>
            </div>

            {/* ONLY ON PAYMENT SUCCESS: Button to proceed to the next process (Member Dashboard & ID Card) */}
            <button
              type="button"
              onClick={() => {
                const finalMember = createdMember || {
                  ...(applicationData as MemberApplication),
                  id: `APP-${Date.now().toString().slice(-4)}`,
                  paymentTransactionId: generatedTxn,
                  paymentMethod: paymentMethod === 'UPI' ? 'UPI / GPay' : 'Card',
                  paymentDate: new Date().toISOString().split('T')[0],
                  paymentAmount: amount,
                  status: 'PENDING',
                  mobileVerified: true
                };
                onLoginSuccess(finalMember);
              }}
              className="w-full flex items-center justify-center gap-2 bg-[#8B1E26] hover:bg-[#72151C] text-white font-extrabold py-4 rounded-2xl shadow-xl hover:shadow-[#8B1E26]/30 transition-all uppercase text-sm sm:text-base tracking-wider cursor-pointer hover:scale-[1.01]"
            >
              <span>{currentLang === 'ta' ? 'அடுத்த படி: உறுப்பினர் அட்டை & தளத்திற்குச் செல்க' : 'PROCEED TO MEMBER DASHBOARD & ID CARD'}</span>
              <ArrowRight className="w-5 h-5 text-amber-300" />
            </button>
          </div>
        ) : paymentStatus === 'FAILED' ? (
          /* ======================================================== */
          /* VIEW 2: PAYMENT FAILED (Strictly blocks next process)    */
          /* ======================================================== */
          <div className="space-y-6 py-4 animate-fadeIn">
            {/* Failure Alert Box */}
            <div className="bg-red-50 dark:bg-red-950/50 border-2 border-red-500 rounded-3xl p-6 text-center space-y-3">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/60 text-red-600 dark:text-red-300 rounded-2xl flex items-center justify-center mx-auto shadow-inner border border-red-300">
                <AlertTriangle className="w-10 h-10" />
              </div>
              <h4 className="text-2xl font-extrabold text-red-700 dark:text-red-300 font-heading">
                {currentLang === 'ta' ? 'கட்டணம் தோல்வியடைந்தது!' : 'Payment Failed / Declined'}
              </h4>
              <p className="text-xs sm:text-sm text-red-800 dark:text-red-200 max-w-md mx-auto leading-relaxed">
                {failureReason || (currentLang === 'ta'
                  ? 'பரிவர்த்தனை வங்கியால் நிராகரிக்கப்பட்டது அல்லது ரத்து செய்யப்பட்டது.'
                  : 'Your transaction was declined or could not be completed.')}
              </p>

              {/* Strict Notice that user cannot proceed */}
              <div className="bg-red-100/80 dark:bg-red-900/40 p-3 rounded-xl border border-red-300 dark:border-red-800 text-xs text-red-900 dark:text-red-100 font-bold">
                ⚠️ {currentLang === 'ta' 
                  ? 'கட்டணம் வெற்றி பெறாததால் அடுத்த படிக்கு செல்ல முடியாது (Payment aagala na next process poga kudathu). தயவுசெய்து மீண்டும் கட்டணம் செலுத்தவும்.' 
                  : 'Cannot proceed to Member Dashboard or ID Card generation without successful payment completion.'}
              </div>
            </div>

            {/* Application Summary Reminder */}
            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs flex items-center justify-between">
              <div>
                <span className="text-slate-500 block text-[10px]">APPLICANT</span>
                <span className="font-bold text-slate-900 dark:text-white">{applicationData.fullName} (+91 {applicationData.mobile})</span>
              </div>
              <div className="text-right">
                <span className="text-slate-500 block text-[10px]">FEE PAYABLE</span>
                <span className="font-mono font-extrabold text-red-600 text-sm">₹{amount}</span>
              </div>
            </div>

            {/* Actions: ONLY Try Again or Go Back. NEXT PROCESS BUTTON IS COMPLETELY BLOCKED. */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={onBack}
                className="w-full sm:w-1/2 py-3.5 px-4 rounded-xl border-2 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs uppercase tracking-wider hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
              >
                ← {currentLang === 'ta' ? 'விவரங்களை திருத்துக' : 'Edit Application Details'}
              </button>

              <button
                type="button"
                onClick={handleRetryPayment}
                className="w-full sm:w-1/2 flex items-center justify-center gap-2 bg-[#8B1E26] hover:bg-[#72151C] text-white font-extrabold py-3.5 px-4 rounded-xl shadow-lg transition-all uppercase text-xs tracking-wider cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>{currentLang === 'ta' ? 'மீண்டும் கட்டணம் செலுத்துக' : 'Try Payment Again'}</span>
              </button>
            </div>
          </div>
        ) : (
          /* ======================================================== */
          /* VIEW 3: APPLICATION REVIEW & PAYMENT FORM                */
          /* ======================================================== */
          <div>
            {/* 1. Member Application Summary Card */}
            <div className="space-y-4 mb-6">
              <div className="bg-slate-50 dark:bg-slate-900/80 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 text-xs space-y-2.5">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-[#8B1E26] dark:text-amber-400" />
                    <span className="font-extrabold text-slate-900 dark:text-white text-sm">
                      {applicationData.fullName}
                    </span>
                    <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-300">
                      OTP Verified ✓
                    </span>
                  </div>
                  <span className="bg-[#8B1E26] text-white text-[10px] font-black px-2.5 py-0.5 rounded shadow">
                    {applicationData.categoryName}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-slate-600 dark:text-slate-300 text-[11px]">
                  <p><strong className="text-slate-900 dark:text-white">Name (Tamil):</strong> {applicationData.nameTamil}</p>
                  <p><strong className="text-slate-900 dark:text-white">Mobile:</strong> +91 {applicationData.mobile}</p>
                  <p><strong className="text-slate-900 dark:text-white">District:</strong> {applicationData.district}</p>
                  <p><strong className="text-slate-900 dark:text-white">Pasarai:</strong> {applicationData.pasaraiName}</p>
                  <p><strong className="text-slate-900 dark:text-white">Aadhaar:</strong> {applicationData.aadhaarNumber}</p>
                  <p><strong className="text-slate-900 dark:text-white">Email:</strong> {applicationData.email}</p>
                </div>

                {applicationData.aadhaarDocUrl && (
                  <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center gap-3">
                    <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Aadhaar Card Uploaded:</span>
                    <div className="w-16 h-10 rounded-lg border-2 border-[#8B1E26] dark:border-amber-400 overflow-hidden shadow-sm">
                      <img src={applicationData.aadhaarDocUrl} alt="Aadhaar" className="w-full h-full object-cover" />
                    </div>
                  </div>
                )}
              </div>

              {/* 2. Total Fee Banner in Signature Tamil Sangam Maroon */}
              <div className="bg-gradient-to-r from-[#8B1E26] via-[#72151C] to-[#600D13] text-white p-5 rounded-2xl flex items-center justify-between border-l-4 border-amber-400 shadow-xl">
                <div>
                  <p className="text-xs text-amber-100/90 font-medium">{currentLang === 'ta' ? 'செலுத்த வேண்டிய உறுப்பினர் கட்டணம்' : 'Total Membership Fee'}</p>
                  <p className="text-3xl font-extrabold text-amber-300 font-mono tracking-tight">
                    ₹{amount}
                  </p>
                </div>
                <div className="text-right text-xs text-amber-100/80">
                  <p className="font-semibold text-white">{applicationData.categoryName}</p>
                  <p className="text-emerald-300 font-semibold flex items-center justify-end gap-1 mt-0.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Includes Digital ID & Sangam Membership</span>
                  </p>
                </div>
              </div>
            </div>

            {/* 3. Payment Method Selection */}
            <form onSubmit={handlePaySubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-900 dark:text-slate-200 mb-2 font-heading">
                  {currentLang === 'ta' ? 'கட்டண முறை தேர்வு செய்க / Select Payment Method' : 'Select Payment Method'}
                </label>
                <div className="grid grid-cols-3 gap-2.5 text-xs">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('UPI')}
                    className={`p-3 rounded-2xl border font-bold flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      paymentMethod === 'UPI' 
                        ? 'bg-[#FDF2F2] dark:bg-red-950/50 border-2 border-[#8B1E26] dark:border-amber-400 text-[#8B1E26] dark:text-amber-300 ring-2 ring-[#8B1E26] dark:ring-amber-400 shadow-md' 
                        : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    <Smartphone className="w-5 h-5 text-[#8B1E26] dark:text-amber-400" />
                    <span>UPI / GPay / QR</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('CARD')}
                    className={`p-3 rounded-2xl border font-bold flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      paymentMethod === 'CARD' 
                        ? 'bg-[#FDF2F2] dark:bg-red-950/50 border-2 border-[#8B1E26] dark:border-amber-400 text-[#8B1E26] dark:text-amber-300 ring-2 ring-[#8B1E26] dark:ring-amber-400 shadow-md' 
                        : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-[#8B1E26] dark:text-amber-400" />
                    <span>Debit / Credit Card</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('NETBANKING')}
                    className={`p-3 rounded-2xl border font-bold flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      paymentMethod === 'NETBANKING' 
                        ? 'bg-[#FDF2F2] dark:bg-red-950/50 border-2 border-[#8B1E26] dark:border-amber-400 text-[#8B1E26] dark:text-amber-300 ring-2 ring-[#8B1E26] dark:ring-amber-400 shadow-md' 
                        : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    <Building2 className="w-5 h-5 text-[#8B1E26] dark:text-amber-400" />
                    <span>Net Banking</span>
                  </button>
                </div>
              </div>

              {/* Dynamic Payment Details Area */}
              {paymentMethod === 'UPI' && (
                <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                  {/* Dynamic UPI QR Code */}
                  <div className="flex flex-col sm:flex-row items-center gap-4 bg-white dark:bg-slate-800/80 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                    <div className="w-28 h-28 bg-white p-1.5 rounded-lg border-2 border-[#8B1E26] dark:border-amber-400 shrink-0 shadow-sm flex items-center justify-center">
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=tamilsangam@upi%26pn=TamilSangamTN%26am=${amount}%26cu=INR`} 
                        alt="UPI QR Code" 
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="space-y-1 text-center sm:text-left">
                      <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-center sm:justify-start gap-1">
                        <QrCode className="w-3.5 h-3.5" /> Instant Scan & Pay
                      </span>
                      <p className="text-xs font-bold text-slate-800 dark:text-white">
                        Scan with GPay, PhonePe, Paytm, BHIM, or any UPI App
                      </p>
                      <p className="text-[11px] text-slate-500 font-mono">
                        UPI ID: <strong className="text-[#8B1E26] dark:text-amber-400">tamilsangam@upi</strong>
                      </p>
                    </div>
                  </div>

                  {/* Or Enter UPI VPA */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Or Enter Virtual Payment Address (VPA) / UPI ID:
                    </label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="e.g. yourname@okhdfcbank"
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-white focus:ring-2 focus:ring-[#8B1E26] focus:outline-none"
                      required
                    />
                  </div>
                </div>
              )}

              {paymentMethod === 'CARD' && (
                <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Name on Card</label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="w-full px-3.5 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-semibold text-slate-800 dark:text-white focus:ring-2 focus:ring-[#8B1E26] focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-3.5 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-semibold font-mono text-slate-800 dark:text-white focus:ring-2 focus:ring-[#8B1E26] focus:outline-none"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Expiry (MM/YY)</label>
                      <input 
                        type="text" 
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full px-3.5 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white font-mono focus:ring-2 focus:ring-[#8B1E26] focus:outline-none" 
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">CVV</label>
                      <input 
                        type="password" 
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        maxLength={3} 
                        className="w-full px-3.5 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white font-mono focus:ring-2 focus:ring-[#8B1E26] focus:outline-none" 
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'NETBANKING' && (
                <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                  <label className="block font-bold text-slate-700 dark:text-slate-300">Select Bank</label>
                  <select 
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-semibold text-slate-800 dark:text-white focus:ring-2 focus:ring-[#8B1E26] focus:outline-none"
                  >
                    <option>State Bank of India (SBI)</option>
                    <option>HDFC Bank</option>
                    <option>ICICI Bank</option>
                    <option>Indian Overseas Bank (IOB)</option>
                    <option>Canara Bank</option>
                    <option>Axis Bank</option>
                    <option>Punjab National Bank</option>
                  </select>
                </div>
              )}

              {/* Testing / Simulator Mode Switcher */}
              <div className="bg-amber-50/80 dark:bg-slate-900/90 border border-amber-300 dark:border-amber-800/60 p-3 rounded-xl text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                    <span>⚡ Payment Gateway Simulator Mode:</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSimulateOutcome('SUCCESS')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-all ${
                        simulateOutcome === 'SUCCESS' 
                          ? 'bg-emerald-600 text-white shadow' 
                          : 'bg-white dark:bg-slate-800 text-slate-600 border'
                      }`}
                    >
                      ✓ Success
                    </button>
                    <button
                      type="button"
                      onClick={() => setSimulateOutcome('FAILURE')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-all ${
                        simulateOutcome === 'FAILURE' 
                          ? 'bg-red-600 text-white shadow' 
                          : 'bg-white dark:bg-slate-800 text-slate-600 border'
                      }`}
                    >
                      ✗ Test Failure
                    </button>
                  </div>
                </div>
                <p className="text-[10px] text-amber-800 dark:text-amber-200/80">
                  {simulateOutcome === 'SUCCESS'
                    ? '✓ "Payment Success" - Verified and unlocks official Member Dashboard & ID Card.'
                    : '✗ "Payment Failed" - Verifies requirement: payment aagala na next process poga kudathu! (Blocks access).'}
                </p>
              </div>

              {/* Security Badge */}
              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800">
                <span className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                  <Lock className="w-3.5 h-3.5" /> 256-Bit SSL Encrypted Payment Gate
                </span>
                <span>Ref: TS-REG-2026</span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={onBack}
                  className="text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                >
                  ← {currentLang === 'ta' ? 'விவரங்களை திருத்துக' : 'Edit Details'}
                </button>

                <button
                  type="submit"
                  disabled={paymentStatus === 'PROCESSING'}
                  className="flex items-center gap-2 bg-[#8B1E26] hover:bg-[#72151C] text-white text-xs sm:text-sm font-extrabold px-7 py-3.5 rounded-xl shadow-xl hover:shadow-[#8B1E26]/30 transition-all uppercase tracking-wide cursor-pointer hover:scale-[1.02]"
                >
                  {paymentStatus === 'PROCESSING' ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>{currentLang === 'ta' ? 'கட்டணம் செயலாக்கப்படுகிறது...' : 'Authorizing Payment...'}</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>{currentLang === 'ta' ? `கட்டணம் செலுத்துக ₹${amount}` : `CONFIRM & PAY ₹${amount}`}</span>
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
