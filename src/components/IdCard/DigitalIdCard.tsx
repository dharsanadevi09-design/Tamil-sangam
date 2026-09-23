import React, { useState } from 'react';
import type { MemberApplication } from '../../types';
import { Phone, Mail, CheckCircle2, Printer } from 'lucide-react';

interface DigitalIdCardProps {
  member: MemberApplication;
  onVerifyQrCode?: (membershipNumber: string) => void;
  currentLang: 'en' | 'ta';
}

export const DigitalIdCard: React.FC<DigitalIdCardProps> = ({
  member,
  onVerifyQrCode,
  currentLang
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
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

  const qrDataUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
    `TS-TN-VERIFIED|${member.membershipNumber || member.id}|${member.fullName}|${member.district}`
  )}`;

  return (
    <div className="flex flex-col items-center space-y-6">
      
      {/* Front / Back Toggle Buttons */}
      <div className="no-print flex items-center justify-between w-full max-w-sm bg-slate-200 p-1 rounded-xl text-xs font-bold">
        <button
          onClick={() => setIsFlipped(false)}
          className={`flex-1 py-2 rounded-lg transition-all ${
            !isFlipped ? 'bg-yellow-400 text-slate-950 shadow' : 'text-slate-700 hover:text-slate-950'
          }`}
        >
          {currentLang === 'ta' ? 'அட்டை முன்பக்கம்' : 'Card Front'}
        </button>
        <button
          onClick={() => setIsFlipped(true)}
          className={`flex-1 py-2 rounded-lg transition-all ${
            isFlipped ? 'bg-yellow-400 text-slate-950 shadow' : 'text-slate-700 hover:text-slate-950'
          }`}
        >
          {currentLang === 'ta' ? 'அட்டை பின்பக்கம்' : 'Card Back'}
        </button>
      </div>

      {/* Printable Area - ID Card Container */}
      <div className="printable-area relative w-full max-w-sm aspect-[1.586/1] rounded-2xl overflow-hidden shadow-2xl border-2 border-yellow-400/80 bg-[#181B20] text-white flex flex-col justify-between select-none">
        
        {/* Background Watermark Pattern */}
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#FFD100_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-yellow-400/10 rounded-full blur-2xl pointer-events-none" />

        {!isFlipped ? (
          /* FRONT OF ID CARD */
          <div className="p-4 flex flex-col justify-between h-full relative z-10">
            
            {/* Header Strip */}
            <div className="flex items-center justify-between border-b border-gray-800 pb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center text-base shadow">
                  🏛️
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-white tracking-wider">TAMIL SANGAM</h4>
                  <p className="text-[9px] font-bold text-yellow-400">தமிழ் சங்கம் - தமிழ்நாடு</p>
                </div>
              </div>
              <span className="bg-yellow-400 text-[#181B20] text-[9px] font-black px-1.5 py-0.5 rounded tracking-widest uppercase">
                OFFICIAL ID
              </span>
            </div>

            {/* Main Member Info & Photo */}
            <div className="grid grid-cols-12 gap-3 items-center my-auto py-1">
              
              {/* Photo Box with Gold Border */}
              <div className="col-span-4 flex flex-col items-center">
                <div className="w-20 h-24 rounded-lg overflow-hidden border-2 border-yellow-400 shadow-md bg-gray-900">
                  <img
                    src={member.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                    alt={member.fullName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-[8px] font-bold text-emerald-400 mt-1 bg-emerald-950/80 border border-emerald-500/40 px-1 py-0.2 rounded flex items-center gap-0.5">
                  <CheckCircle2 className="w-2.5 h-2.5" /> VERIFIED
                </span>
              </div>

              {/* Member Details */}
              <div className="col-span-8 space-y-1">
                <div>
                  <span className="text-[9px] text-gray-400 uppercase font-semibold">Name</span>
                  <h5 className="font-extrabold text-sm text-white line-clamp-1 leading-tight">{member.fullName}</h5>
                  <p className="text-xs font-semibold text-yellow-400 leading-tight">{member.nameTamil}</p>
                </div>

                <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[9px]">
                  <div>
                    <span className="text-gray-400">ID No:</span>
                    <p className="font-mono font-extrabold text-white text-[10px] text-amber-300">
                      {member.membershipNumber || 'TS-TN-PENDING'}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-400">Category:</span>
                    <p className="font-bold text-white line-clamp-1">{member.categoryName}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">District:</span>
                    <p className="font-bold text-white">{member.district}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Wing / பாசறை:</span>
                    <p className="font-bold text-white line-clamp-1">{member.pasaraiName}</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom Footer Strip with QR & Validity */}
            <div className="pt-2 border-t border-gray-800 flex items-center justify-between text-[8px] text-gray-400">
              <div>
                <p><span className="text-gray-500">Joined:</span> <strong className="text-gray-300">{member.joiningDate || '2026-01-10'}</strong></p>
                <p><span className="text-gray-500">Valid Till:</span> <strong className="text-amber-400">{member.validityDate || '2027-01-10'}</strong></p>
              </div>

              {/* Clickable QR Code */}
              <div
                onClick={() => onVerifyQrCode && onVerifyQrCode(member.membershipNumber || member.id)}
                className="cursor-pointer bg-white p-1 rounded shadow hover:scale-105 transition-transform"
                title="Click to Scan QR Verification Page"
              >
                <img src={qrDataUrl} alt="QR Verification" className="w-9 h-9" />
              </div>
            </div>

          </div>
        ) : (
          /* BACK OF ID CARD */
          <div className="p-4 flex flex-col justify-between h-full relative z-10">
            <div className="border-b border-gray-800 pb-1.5 flex items-center justify-between">
              <span className="text-[9px] font-bold text-yellow-400 uppercase tracking-wider">
                MEMBER ADDRESS & AUTHORISATION
              </span>
              <span className="text-[8px] text-gray-400">Card Ref: {member.id}</span>
            </div>

            <div className="space-y-1.5 text-[9px] text-gray-300 my-auto">
              <p><strong className="text-white">Guardian:</strong> {member.guardianName}</p>
              <p><strong className="text-white">Blood Group:</strong> <span className="text-red-400 font-bold">{member.bloodGroup || 'O+'}</span></p>
              <p><strong className="text-white">Address:</strong> {member.doorNo}, {member.street}, {member.village}, {member.taluk}, {member.district} - {member.pincode}</p>
              <p><strong className="text-white">Emergency Contact:</strong> +91 {member.mobile}</p>
            </div>

            {/* Authorised Signature & Seal */}
            <div className="pt-2 border-t border-gray-800 flex items-center justify-between">
              <div className="text-[7px] text-gray-400">
                <p className="font-bold text-white">TAMIL SANGAM STATE HQ</p>
                <p>Anna Salai, Chennai - 600002</p>
              </div>

              <div className="text-center">
                <div className="font-script text-[10px] text-yellow-400 font-bold italic tracking-wide">
                  S. Ramachandran
                </div>
                <div className="text-[7px] font-bold text-gray-300 border-t border-gray-700 pt-0.5">
                  AUTHORISED SIGNATORY
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Action Buttons */}
      <div className="no-print flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={handlePrint}
          className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow transition-all"
        >
          <Printer className="w-4 h-4 text-yellow-400" />
          <span>Print / Save PDF</span>
        </button>

        <button
          onClick={handleSimulateWhatsApp}
          className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow transition-all"
        >
          <Phone className="w-4 h-4" />
          <span>Send via WhatsApp</span>
        </button>

        <button
          onClick={handleSimulateEmail}
          className="flex items-center gap-1.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow transition-all"
        >
          <Mail className="w-4 h-4" />
          <span>Send via Email</span>
        </button>
      </div>

      {/* Dispatch Notifications */}
      {whatsappSent && (
        <div className="no-print bg-emerald-900/90 text-emerald-100 text-xs p-3 rounded-xl border border-emerald-500 animate-bounce flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Digital ID Card dispatched to member WhatsApp (+91 {member.whatsapp || member.mobile})!</span>
        </div>
      )}

      {emailSent && (
        <div className="no-print bg-amber-900/90 text-amber-100 text-xs p-3 rounded-xl border border-amber-500 animate-bounce flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Confirmation email & PDF ID card sent to {member.email}!</span>
        </div>
      )}

    </div>
  );
};
