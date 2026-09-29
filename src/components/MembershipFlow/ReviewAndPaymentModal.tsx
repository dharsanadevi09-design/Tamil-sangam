import React, { useState } from 'react';
import type { MemberApplication } from '../../types';
import { ShieldCheck, CreditCard, X, RefreshCw, Smartphone, Lock } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ReviewAndPaymentModalProps {
  applicationData: Partial<MemberApplication>;
  onConfirmAndPay: (paymentDetails: { paymentMethod: string; transactionId: string }) => void;
  onBack: () => void;
  currentLang: 'en' | 'ta';
}

export const ReviewAndPaymentModal: React.FC<ReviewAndPaymentModalProps> = ({
  applicationData,
  onConfirmAndPay,
  onBack,
  currentLang
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CARD' | 'NETBANKING'>('UPI');
  const [isProcessing, setIsProcessing] = useState(false);
  const [upiId, setUpiId] = useState('member@upi');
  const [cardNumber, setCardNumber] = useState('4532 8910 2341 9012');

  const handlePaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        // confetti fallback
      }

      const dummyTxn = `TXN-${paymentMethod}-${Date.now().toString().slice(-8)}`;
      onConfirmAndPay({
        paymentMethod: paymentMethod === 'UPI' ? 'UPI / GPay' : paymentMethod === 'CARD' ? 'Debit/Credit Card' : 'Net Banking',
        transactionId: dummyTxn
      });
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-[#181B20] text-slate-900 dark:text-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 mb-6">
          <div>
            <span className="text-xs font-bold text-amber-600 dark:text-yellow-400 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-1 rounded">
              Final Step
            </span>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
              {currentLang === 'ta' ? 'விண்ணப்ப மறுஆய்வு & கட்டணம் செலுத்தல்' : 'Review Application & Confirm Payment'}
            </h3>
          </div>
          <button onClick={onBack} className="text-slate-400 hover:text-slate-700 dark:hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Application Summary Cards */}
        <div className="space-y-4 mb-6">
          
          <div className="bg-slate-50 dark:bg-slate-900/80 rounded-xl p-4 border border-slate-200 dark:border-slate-800 text-xs space-y-2">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
              <span className="font-extrabold text-slate-900 dark:text-white text-sm">{applicationData.fullName}</span>
              <span className="bg-yellow-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded">
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
                <div className="w-16 h-12 rounded border border-amber-400 overflow-hidden shadow-sm">
                  <img src={applicationData.aadhaarDocUrl} alt="Aadhaar" className="w-full h-full object-cover" />
                </div>
              </div>
            )}
          </div>

          {/* Membership Fee Box */}
          <div className="bg-[#181B20] text-white p-4 rounded-xl flex items-center justify-between border-l-4 border-yellow-400 shadow-md">
            <div>
              <p className="text-xs text-gray-300">Total Membership Registration Fee</p>
              <p className="text-2xl font-extrabold text-yellow-400">
                ₹{applicationData.paymentAmount || 100}
              </p>
            </div>
            <div className="text-right text-xs text-gray-400">
              <p>Category: {applicationData.categoryName}</p>
              <p className="text-emerald-400 font-semibold">Includes GST & Processing</p>
            </div>
          </div>

        </div>

        {/* Payment Gateway Options */}
        <form onSubmit={handlePaySubmit} className="space-y-6">
          
          <div>
            <label className="block text-xs font-bold text-slate-900 dark:text-slate-200 mb-2">
              Select Payment Method / செலுத்தும் முறை
            </label>
            <div className="grid grid-cols-3 gap-3 text-xs">
              <button
                type="button"
                onClick={() => setPaymentMethod('UPI')}
                className={`p-3 rounded-xl border font-bold flex flex-col items-center justify-center gap-1.5 transition-all ${
                  paymentMethod === 'UPI' ? 'bg-amber-500/10 border-yellow-400 text-amber-900 dark:text-yellow-400 ring-2 ring-yellow-400' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <Smartphone className="w-5 h-5 text-amber-600 dark:text-yellow-400" />
                <span>UPI / GPay / Paytm</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('CARD')}
                className={`p-3 rounded-xl border font-bold flex flex-col items-center justify-center gap-1.5 transition-all ${
                  paymentMethod === 'CARD' ? 'bg-amber-500/10 border-yellow-400 text-amber-900 dark:text-yellow-400 ring-2 ring-yellow-400' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <CreditCard className="w-5 h-5 text-amber-600 dark:text-yellow-400" />
                <span>Debit / Credit Card</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('NETBANKING')}
                className={`p-3 rounded-xl border font-bold flex flex-col items-center justify-center gap-1.5 transition-all ${
                  paymentMethod === 'NETBANKING' ? 'bg-amber-500/10 border-yellow-400 text-amber-900 dark:text-yellow-400 ring-2 ring-yellow-400' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <ShieldCheck className="w-5 h-5 text-amber-600 dark:text-yellow-400" />
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
                className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm font-semibold text-slate-800 dark:text-white"
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
                  className="w-full px-3.5 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg font-semibold text-slate-800 dark:text-white"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Expiry (MM/YY)</label>
                  <input type="text" defaultValue="08/28" className="w-full px-3.5 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-white" />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">CVV</label>
                  <input type="password" defaultValue="888" className="w-full px-3.5 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-white" />
                </div>
              </div>
            </div>
          )}

          {paymentMethod === 'NETBANKING' && (
            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
              <label className="block font-bold text-slate-700 dark:text-slate-300">Select Popular Bank</label>
              <select className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg font-semibold text-slate-800 dark:text-white">
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
              className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              ← Edit Details
            </button>

            <button
              type="submit"
              disabled={isProcessing}
              className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-[#181B20] text-sm font-extrabold px-8 py-3.5 rounded-xl shadow-xl transition-all uppercase tracking-wide"
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
    </div>
  );
};
