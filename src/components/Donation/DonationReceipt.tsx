import React, { useState } from 'react';
import type { DonationRecord } from '../../types';
import { Printer, Mail, Phone, CheckCircle2, X } from 'lucide-react';

interface DonationReceiptProps {
  receipt: DonationRecord;
  onClose?: () => void;
  currentLang: 'en' | 'ta';
}

export const DonationReceipt: React.FC<DonationReceiptProps> = ({
  receipt,
  onClose,
}) => {
  const [whatsappSent, setWhatsappSent] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleSimulateWhatsApp = () => {
    setWhatsappSent(true);
    setTimeout(() => setWhatsappSent(false), 4000);
  };

  const handleSimulateEmail = () => {
    setEmailSent(true);
    setTimeout(() => setEmailSent(false), 4000);
  };

  return (
    <div className="flex flex-col items-center space-y-6 max-w-2xl mx-auto my-6">
      
      {/* Action Header */}
      {onClose && (
        <div className="no-print w-full flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Donation Receipt View</span>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Official Printable Receipt Card */}
      <div className="printable-area w-full bg-white rounded-2xl p-6 sm:p-10 shadow-2xl border-2 border-yellow-400/80 text-slate-900 relative overflow-hidden">
        
        {/* Decorative Header Strip */}
        <div className="h-3 bg-yellow-400 absolute top-0 left-0 right-0" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-6 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-[#181B20] text-2xl flex items-center justify-center border-2 border-yellow-400 shadow-md">
              🏛️
            </div>
            <div>
              <h2 className="font-black text-xl text-slate-900 tracking-tight">TAMIL SANGAM – TAMIL NADU</h2>
              <p className="text-xs font-extrabold text-amber-600">தமிழ் சங்கம் - தமிழ்நாடு</p>
              <p className="text-[10px] text-slate-500">Regd. Digital Trust & Cultural Organisation</p>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="bg-amber-100 text-amber-900 font-extrabold text-xs px-2.5 py-1 rounded">
              OFFICIAL RECEIPT
            </span>
            <p className="font-mono font-bold text-sm text-slate-800 mt-1">{receipt.receiptNumber}</p>
            <p className="text-xs text-slate-500">Date: {receipt.date}</p>
          </div>
        </div>

        {/* Receipt Details Table */}
        <div className="space-y-4 text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <span className="text-slate-500 font-semibold block text-[10px] uppercase">Received With Thanks From</span>
              <p className="font-extrabold text-slate-900 text-sm">{receipt.donorName}</p>
              <p className="text-slate-600 mt-0.5">{receipt.address}</p>
            </div>

            <div>
              <span className="text-slate-500 font-semibold block text-[10px] uppercase">Contact Details</span>
              <p className="text-slate-800"><strong className="text-slate-900">Mobile:</strong> +91 {receipt.mobile}</p>
              <p className="text-slate-800"><strong className="text-slate-900">WhatsApp:</strong> +91 {receipt.whatsapp}</p>
              <p className="text-slate-800"><strong className="text-slate-900">Email:</strong> {receipt.email}</p>
            </div>
          </div>

          <div className="bg-[#181B20] text-white p-5 rounded-xl flex items-center justify-between shadow-lg">
            <div>
              <span className="text-xs text-gray-300 block">Donation Amount Received</span>
              <p className="text-3xl font-extrabold text-yellow-400">₹{receipt.amount.toLocaleString()}</p>
            </div>

            <div className="text-right text-xs text-gray-300">
              <p><strong className="text-white">Payment Method:</strong> {receipt.paymentMethod}</p>
              <p><strong className="text-white">Txn ID:</strong> <span className="font-mono text-amber-300">{receipt.transactionId}</span></p>
            </div>
          </div>

          <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1">
            <span className="text-[10px] font-bold text-amber-900 uppercase">Purpose of Contribution:</span>
            <p className="font-bold text-slate-900">{receipt.purpose}</p>
          </div>

          {/* Authorised Seal & Signatory */}
          <div className="pt-6 border-t border-slate-200 flex items-center justify-between text-xs">
            <div>
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Transaction Verified & Audit Cleared
              </span>
              <p className="text-[10px] text-slate-500 mt-0.5">80G / Tax Exemption Eligible Trust Receipt</p>
            </div>

            <div className="text-center">
              <div className="font-script text-sm font-bold text-slate-800 italic">
                N. Sivanesan
              </div>
              <p className="text-[10px] font-bold text-slate-700 border-t border-slate-300 pt-0.5">
                FINANCE TRUSTEE & TREASURER
              </p>
            </div>
          </div>

        </div>

      </div>

      {/* Action Buttons */}
      <div className="no-print flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={handlePrint}
          className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow transition-all"
        >
          <Printer className="w-4 h-4 text-yellow-400" />
          <span>Print / Download PDF Receipt</span>
        </button>

        <button
          onClick={handleSimulateWhatsApp}
          className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow transition-all"
        >
          <Phone className="w-4 h-4" />
          <span>Send PDF to WhatsApp</span>
        </button>

        <button
          onClick={handleSimulateEmail}
          className="flex items-center gap-1.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow transition-all"
        >
          <Mail className="w-4 h-4" />
          <span>Email PDF Receipt</span>
        </button>
      </div>

      {/* Notifications */}
      {whatsappSent && (
        <div className="no-print bg-emerald-900 text-emerald-100 text-xs p-3 rounded-xl border border-emerald-500 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Donation Receipt PDF dispatched to WhatsApp (+91 {receipt.whatsapp})!</span>
        </div>
      )}

      {emailSent && (
        <div className="no-print bg-amber-900 text-amber-100 text-xs p-3 rounded-xl border border-amber-500 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
          <span>PDF Receipt emailed to {receipt.email}!</span>
        </div>
      )}

    </div>
  );
};
