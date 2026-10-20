import React, { useState, useEffect } from 'react';
import type { MemberApplication, DonationRecord, SystemNotification } from '../../types';
import { DigitalIdCard } from '../IdCard/DigitalIdCard';
import { DonationReceipt } from '../Donation/DonationReceipt';
import { getDonations, getCertificates, getNotifications } from '../../services/storageService';
import { api } from '../../services/apiClient';
import { User, QrCode, CreditCard, Heart, Award, Bell, ShieldCheck, LogOut, CheckCircle2, Clock, Mail, FileText } from 'lucide-react';

interface MemberDashboardProps {
  member: MemberApplication;
  onLogout: () => void;
  onVerifyQrCode: (membershipNumber: string) => void;
  currentLang: 'en' | 'ta';
}

export const MemberDashboard: React.FC<MemberDashboardProps> = ({
  member,
  onLogout,
  onVerifyQrCode,
  currentLang
}) => {
  const [activeTab, setActiveTab] = useState<'CARD' | 'PROFILE' | 'MEMBERSHIP' | 'PAYMENTS' | 'DONATIONS' | 'CERTIFICATES' | 'EVENTS' | 'NOTIFICATIONS'>('CARD');
  const [selectedDonation, setSelectedDonation] = useState<DonationRecord | null>(null);
  const [liveNotifications, setLiveNotifications] = useState<SystemNotification[]>([]);

  useEffect(() => {
    // Fetch live notifications for this member from database
    api.getNotifications({ mobile: member.mobile })
      .then(res => {
        if (Array.isArray(res) && res.length > 0) {
          setLiveNotifications(res);
        }
      })
      .catch(() => {});
  }, [member.mobile, activeTab]);

  const memberDonations = getDonations().filter(d => d.mobile === member.mobile || d.email === member.email);
  const memberCertificates = getCertificates().filter(c => c.memberId === member.id || c.memberName === member.fullName);
  
  // Combine local and database notifications, deduplicating by ID
  const localNotifs = getNotifications().filter(n => !n.recipientMobile || n.recipientMobile === member.mobile);
  const allNotifMap = new Map<string, SystemNotification>();
  liveNotifications.forEach(n => allNotifMap.set(n.id, n));
  localNotifs.forEach(n => {
    if (!allNotifMap.has(n.id)) allNotifMap.set(n.id, n);
  });
  const notifications = Array.from(allNotifMap.values());

  return (
    <div className="bg-[#FAF8F5] dark:bg-slate-950 text-slate-800 dark:text-gray-100 min-h-screen py-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Top Welcome Banner in Signature Tamil Sangam Maroon */}
      <div className="bg-gradient-to-r from-[#8B1E26] via-[#72151C] to-[#600D13] text-white rounded-3xl p-6 sm:p-8 shadow-2xl mb-8 border-b-2 border-amber-400/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={member.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
            alt={member.fullName}
            className="w-16 h-20 rounded-xl object-cover border-2 border-amber-300 shadow-md shrink-0"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded shadow">
                {member.categoryName}
              </span>
              <span className="text-xs text-amber-200 font-mono font-extrabold tracking-wider">
                {member.membershipNumber || 'TS-TN-PENDING'}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1.5 font-heading">{member.fullName}</h2>
            <p className="text-xs text-amber-100/90">{member.nameTamil} • {member.district} District</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className={`px-3 py-1.5 rounded-xl text-xs font-bold tracking-wide shadow-sm ${
            member.status === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40' : 'bg-amber-500/20 text-amber-300 border border-amber-400/40'
          }`}>
            Status: {member.status}
          </span>
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 bg-black/30 hover:bg-black/50 text-white text-xs font-semibold px-4 py-2 rounded-xl border border-white/20 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-red-300" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Dashboard Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Navigation Sidebar */}
        <div className="lg:col-span-3 space-y-2">
          {[
            { id: 'CARD', label: 'My Digital ID Card', icon: QrCode },
            { id: 'PROFILE', label: 'My Profile Details', icon: User },
            { id: 'MEMBERSHIP', label: 'Membership Status', icon: ShieldCheck },
            { id: 'PAYMENTS', label: 'Payment History', icon: CreditCard },
            { id: 'DONATIONS', label: 'Donation History', icon: Heart },
            { id: 'CERTIFICATES', label: 'My Certificates', icon: Award },
            { id: 'NOTIFICATIONS', label: 'Notifications', icon: Bell, badge: notifications.length },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id as any); setSelectedDonation(null); }}
                className={`w-full flex items-center justify-between p-3.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#8B1E26] text-white shadow-lg shadow-[#8B1E26]/25 border border-[#8B1E26]'
                    : 'bg-white dark:bg-[#1E232B] text-slate-700 dark:text-gray-200 hover:bg-[#FDF2F2] dark:hover:bg-slate-800 hover:text-[#8B1E26] dark:hover:text-amber-300 border border-slate-200/80 dark:border-gray-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-[#8B1E26] dark:text-amber-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge ? (
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-amber-400 text-slate-950' : 'bg-amber-500 text-slate-950'
                  }`}>
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        {/* Right Content Area */}
        <div className="lg:col-span-9 bg-white dark:bg-[#1E232B] rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/80 dark:border-gray-800 text-slate-900 dark:text-white transition-colors">
          
          {/* TAB 1: Digital ID Card */}
          {activeTab === 'CARD' && (
            <div className="space-y-6">
              <div className="border-b border-slate-200 dark:border-gray-800 pb-4">
                <h3 className="text-xl font-extrabold text-[#8B1E26] dark:text-amber-400 font-heading">
                  {member.status === 'APPROVED' && member.membershipNumber
                    ? (currentLang === 'ta' ? 'அதிகாரப்பூர்வ டிஜிட்டல் ID கார்டு' : 'Digital Membership ID Card')
                    : (currentLang === 'ta' ? 'விண்ணப்ப நிலை & பரிசீலனை' : 'Application Status & Verification')}
                </h3>
                <p className="text-xs text-slate-500 dark:text-gray-400">
                  {member.status === 'APPROVED' && member.membershipNumber
                    ? (currentLang === 'ta' ? 'அங்கீகரிக்கப்பட்ட டிஜிட்டல் உறுப்பினர் அடையாள அட்டை' : 'Official verified ID card with active QR code.')
                    : (currentLang === 'ta' ? 'நிர்வாகியின் பரிசீலனையில் உள்ள விண்ணப்ப விவரங்கள்' : 'Application under admin review and ID card dispatch tracker.')}
                </p>
              </div>

              {member.status === 'APPROVED' && member.membershipNumber ? (
                <DigitalIdCard
                  member={member}
                  onVerifyQrCode={onVerifyQrCode}
                  currentLang={currentLang}
                />
              ) : (
                <div className="space-y-6 animate-fadeIn">
                  {/* Status Banner */}
                  <div className="bg-gradient-to-r from-amber-500/15 via-amber-500/20 to-amber-500/10 border-2 border-amber-400 dark:border-amber-500/60 rounded-3xl p-6 sm:p-8 text-slate-900 dark:text-white shadow-lg space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow-md">
                        <Clock className="w-6 h-6 animate-spin-slow" />
                      </div>
                      <div className="space-y-1">
                        <span className="bg-amber-400 text-slate-950 font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                          STATUS: PENDING ADMIN APPROVAL
                        </span>
                        <h4 className="text-xl font-extrabold font-heading text-slate-900 dark:text-amber-300">
                          {currentLang === 'ta'
                            ? 'உறுப்பினர் விண்ணப்பம் நிர்வாகியின் பரிசீலனையில் உள்ளது'
                            : 'Application Under State Admin Review'}
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-gray-300 leading-relaxed">
                          {currentLang === 'ta'
                            ? `வணக்கம் ${member.fullName}! நீங்கள் உறுப்பினர் சேர்க்கைக் கட்டணம் ₹${member.paymentAmount || 100} வெற்றிகரமாக செலுத்திவிட்டீர்கள். உங்களின் விண்ணப்பம் (Ref: ${member.id}) மாநில தலைமை நிர்வாகியின் பரிசீலனைக்கு அனுப்பப்பட்டுள்ளது.`
                            : `Hello ${member.fullName}! Your membership fee of ₹${member.paymentAmount || 100} has been received. Your application (Ref: ${member.id}) is under review by State HQ Admin.`}
                        </p>
                      </div>
                    </div>

                    {/* Progress Workflow Tracker */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-3">
                      <div className="bg-white/80 dark:bg-slate-800/80 p-3 rounded-2xl border border-emerald-500/40 text-xs flex items-center gap-2.5">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white text-[11px]">1. Mobile OTP</p>
                          <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">Verified ✓</p>
                        </div>
                      </div>

                      <div className="bg-white/80 dark:bg-slate-800/80 p-3 rounded-2xl border border-emerald-500/40 text-xs flex items-center gap-2.5">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white text-[11px]">2. Fee Paid</p>
                          <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">₹{member.paymentAmount || 100} Paid ✓</p>
                        </div>
                      </div>

                      <div className="bg-amber-100/90 dark:bg-amber-950/60 p-3 rounded-2xl border-2 border-amber-400 text-xs flex items-center gap-2.5 shadow-sm">
                        <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 animate-pulse" />
                        <div>
                          <p className="font-bold text-amber-950 dark:text-amber-200 text-[11px]">3. Admin Review</p>
                          <p className="text-[10px] text-amber-700 dark:text-amber-300 font-bold">In Progress ⏳</p>
                        </div>
                      </div>

                      <div className="bg-white/40 dark:bg-slate-800/40 p-3 rounded-2xl border border-dashed border-slate-300 dark:border-gray-700 text-xs flex items-center gap-2.5 opacity-70">
                        <ShieldCheck className="w-5 h-5 text-slate-400 shrink-0" />
                        <div>
                          <p className="font-bold text-slate-600 dark:text-slate-400 text-[11px]">4. ID Card Generated</p>
                          <p className="text-[10px] text-slate-500 font-semibold">Upon Approval</p>
                        </div>
                      </div>
                    </div>

                    {/* Email & SMS Dispatch Notice */}
                    <div className="bg-white dark:bg-slate-950/60 p-4 rounded-2xl border border-amber-300/80 dark:border-gray-800 text-xs space-y-2">
                      <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-xs">
                        <Mail className="w-4 h-4" />
                        <span>
                          {currentLang === 'ta'
                            ? `கட்டணம் பெறப்பட்டதற்கான மின்னஞ்சல் (${member.email || 'Email'}) முகவரிக்கு அனுப்பப்பட்டுள்ளது.`
                            : `Payment confirmation email sent to ${member.email || 'your email'}.`}
                        </span>
                      </div>
                      <p className="text-slate-600 dark:text-gray-300 leading-relaxed text-[11px]">
                        {currentLang === 'ta'
                          ? `நிர்வாகி ஒப்புதல் அளித்தவுடன், உங்களின் அதிகாரப்பூர்வ உறுப்பினர் அடையாள அட்டை எண் (எ.கா. TS-TN-2026-XXXXXX) உருவாக்கப்பட்டு உங்கள் மின்னஞ்சல் மற்றும் குறுஞ்செய்திக்கு (SMS) உடனடியாக அனுப்பப்படும். அதன்பின் உங்களின் டிஜிட்டல் ID கார்டை இங்கே பதிவிறக்கம் செய்து கொள்ளலாம்.`
                          : `As soon as the Admin approves your application, your official Membership ID Number (e.g. TS-TN-2026-XXXXXX) will be generated and dispatched to your email and phone. Your downloadable Digital ID card will then appear here.`}
                      </p>
                    </div>
                  </div>

                  {/* Submission Summary Table */}
                  <div className="bg-slate-50 dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-200 dark:border-gray-800 space-y-3">
                    <h5 className="font-bold text-xs text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#8B1E26] dark:text-amber-400" />
                      <span>{currentLang === 'ta' ? 'விண்ணப்ப விவரங்கள்' : 'Application Summary'}</span>
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <p><span className="text-slate-500">Applicant:</span> <strong className="text-slate-900 dark:text-white">{member.fullName} ({member.nameTamil})</strong></p>
                      <p><span className="text-slate-500">Mobile:</span> <strong className="text-slate-900 dark:text-white">+91 {member.mobile}</strong></p>
                      <p><span className="text-slate-500">Email:</span> <strong className="text-slate-900 dark:text-white">{member.email}</strong></p>
                      <p><span className="text-slate-500">District:</span> <strong className="text-slate-900 dark:text-white">{member.district}</strong></p>
                      <p><span className="text-slate-500">Category:</span> <strong className="text-slate-900 dark:text-white">{member.categoryName}</strong></p>
                      <p><span className="text-slate-500">Txn Reference:</span> <strong className="font-mono text-emerald-700 dark:text-emerald-400">{member.paymentTransactionId || 'TXN-ONLINE'}</strong></p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Profile */}
          {activeTab === 'PROFILE' && (
            <div className="space-y-6">
              <div className="border-b border-slate-200 dark:border-gray-800 pb-4">
                <h3 className="text-xl font-extrabold text-[#8B1E26] dark:text-amber-400 font-heading">Personal Profile Details</h3>
                <p className="text-xs text-slate-500 dark:text-gray-400">Registered member information.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200 dark:border-gray-800 space-y-2">
                  <h4 className="font-extrabold text-[#8B1E26] dark:text-amber-400 border-b border-slate-200 dark:border-gray-800 pb-1 font-heading">Personal Info</h4>
                  <p><strong className="text-slate-800 dark:text-slate-200">Full Name:</strong> <span className="text-slate-600 dark:text-gray-300">{member.fullName}</span></p>
                  <p><strong className="text-slate-800 dark:text-slate-200">Name (Tamil):</strong> <span className="text-slate-600 dark:text-gray-300">{member.nameTamil}</span></p>
                  <p><strong className="text-slate-800 dark:text-slate-200">DOB:</strong> <span className="text-slate-600 dark:text-gray-300">{member.dob}</span></p>
                  <p><strong className="text-slate-800 dark:text-slate-200">Gender:</strong> <span className="text-slate-600 dark:text-gray-300">{member.gender}</span></p>
                  <p><strong className="text-slate-800 dark:text-slate-200">Guardian:</strong> <span className="text-slate-600 dark:text-gray-300">{member.guardianName}</span></p>
                  <p><strong className="text-slate-800 dark:text-slate-200">Occupation:</strong> <span className="text-slate-600 dark:text-gray-300">{member.occupation}</span></p>
                  <p><strong className="text-slate-800 dark:text-slate-200">Education:</strong> <span className="text-slate-600 dark:text-gray-300">{member.education}</span></p>
                </div>

                <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200 dark:border-gray-800 space-y-2">
                  <h4 className="font-extrabold text-[#8B1E26] dark:text-amber-400 border-b border-slate-200 dark:border-gray-800 pb-1 font-heading">Contact & Address</h4>
                  <p><strong className="text-slate-800 dark:text-slate-200">Mobile:</strong> <span className="text-slate-600 dark:text-gray-300">+91 {member.mobile}</span></p>
                  <p><strong className="text-slate-800 dark:text-slate-200">WhatsApp:</strong> <span className="text-slate-600 dark:text-gray-300">+91 {member.whatsapp}</span></p>
                  <p><strong className="text-slate-800 dark:text-slate-200">Email:</strong> <span className="text-slate-600 dark:text-gray-300">{member.email}</span></p>
                  <p><strong className="text-slate-800 dark:text-slate-200">District:</strong> <span className="text-slate-600 dark:text-gray-300">{member.district}</span></p>
                  <p><strong className="text-slate-800 dark:text-slate-200">Pasarai:</strong> <span className="text-slate-600 dark:text-gray-300">{member.pasaraiName}</span></p>
                  <p><strong className="text-slate-800 dark:text-slate-200">Address:</strong> <span className="text-slate-600 dark:text-gray-300">{member.doorNo}, {member.street}, {member.village}, {member.postOffice}, {member.taluk} - {member.pincode}</span></p>
                </div>
              </div>

              {/* Identity Verification & Aadhaar Card Image */}
              <div className="bg-[#FDF2F2] dark:bg-red-950/40 border border-[#8B1E26]/30 dark:border-red-900/50 p-4 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-[#8B1E26] dark:text-red-400 text-xs flex items-center gap-1.5 font-heading">
                    <ShieldCheck className="w-4 h-4 text-[#8B1E26] dark:text-red-400" /> Identity Verification & Aadhaar Card:
                  </span>
                  <span className="font-mono font-bold text-xs bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded shadow-sm">
                    {member.aadhaarNumber}
                  </span>
                </div>

                {member.aadhaarDocUrl ? (
                  <div className="flex flex-col sm:flex-row items-center gap-4 pt-1">
                    <div className="w-full sm:w-56 h-36 bg-slate-900 rounded-lg overflow-hidden border-2 border-[#8B1E26] dark:border-amber-400 shadow-md">
                      <img src={member.aadhaarDocUrl} alt="Uploaded Aadhaar Card" className="w-full h-full object-cover" />
                    </div>
                    <div className="text-xs text-slate-600 dark:text-gray-300 space-y-1">
                      <p className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span>Uploaded Aadhaar Card Copy</span>
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-gray-400">
                        This document is encrypted and accessible only to authorized state/district administrators.
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">No Aadhaar document uploaded.</p>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: Membership Status */}
          {activeTab === 'MEMBERSHIP' && (
            <div className="space-y-6">
              <div className="border-b border-slate-200 dark:border-gray-800 pb-4">
                <h3 className="text-xl font-extrabold text-[#8B1E26] dark:text-amber-400 font-heading">Membership Subscription Status</h3>
              </div>

              <div className="bg-gradient-to-br from-[#8B1E26] via-[#72151C] to-[#600D13] text-white p-6 sm:p-8 rounded-2xl border-2 border-amber-400 shadow-xl space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">STATE REGISTERED MEMBER</span>
                  <span className="bg-amber-400 text-slate-950 font-black text-xs px-3 py-1 rounded shadow-sm">
                    {member.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs pt-2">
                  <div>
                    <span className="text-amber-100/80 block text-[10px]">Membership ID</span>
                    <span className="font-mono font-extrabold text-amber-300 text-sm">{member.membershipNumber || member.id}</span>
                  </div>
                  <div>
                    <span className="text-amber-100/80 block text-[10px]">Category</span>
                    <span className="font-bold text-white text-sm">{member.categoryName}</span>
                  </div>
                  <div>
                    <span className="text-amber-100/80 block text-[10px]">Joining Date</span>
                    <span className="font-bold text-white">{member.joiningDate || '2026-01-10'}</span>
                  </div>
                  <div>
                    <span className="text-amber-100/80 block text-[10px]">Validity Expiry</span>
                    <span className="font-bold text-amber-300">{member.validityDate || '2027-01-10'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Payments */}
          {activeTab === 'PAYMENTS' && (
            <div className="space-y-6">
              <div className="border-b border-slate-200 dark:border-gray-800 pb-4">
                <h3 className="text-xl font-extrabold text-[#8B1E26] dark:text-amber-400 font-heading">Membership Fee Payment History</h3>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200 dark:border-gray-800 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">Initial Membership Registration Fee</p>
                  <p className="text-slate-500 dark:text-gray-400">Method: {member.paymentMethod || 'UPI / GPay'} • Txn: {member.paymentTransactionId || 'TXN98492019482'}</p>
                  <p className="text-[10px] text-slate-400">Date: {member.paymentDate || member.joiningDate || '2026-01-10'}</p>
                </div>
                <div className="text-right">
                  <span className="text-base font-black text-[#8B1E26] dark:text-amber-400">₹{member.paymentAmount || 100}</span>
                  <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>PAID</span>
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Donations */}
          {activeTab === 'DONATIONS' && (
            <div className="space-y-6">
              <div className="border-b border-slate-200 dark:border-gray-800 pb-4">
                <h3 className="text-xl font-extrabold text-[#8B1E26] dark:text-amber-400 font-heading">Donation History & PDF Receipts</h3>
              </div>

              {selectedDonation ? (
                <DonationReceipt receipt={selectedDonation} onClose={() => setSelectedDonation(null)} currentLang={currentLang} />
              ) : memberDonations.length > 0 ? (
                <div className="space-y-3">
                  {memberDonations.map(don => (
                    <div key={don.id} className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200 dark:border-gray-800 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">{don.purpose}</p>
                        <p className="text-slate-500 dark:text-gray-400">Receipt #{don.receiptNumber} • {don.date}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-black text-[#8B1E26] dark:text-amber-400 text-sm">₹{don.amount.toLocaleString()}</span>
                        <button
                          onClick={() => setSelectedDonation(don)}
                          className="bg-[#8B1E26] hover:bg-[#72151C] text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                        >
                          View Receipt
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 dark:text-gray-400">No donation records found yet.</p>
              )}
            </div>
          )}

          {/* TAB 6: Certificates */}
          {activeTab === 'CERTIFICATES' && (
            <div className="space-y-6">
              <div className="border-b border-slate-200 dark:border-gray-800 pb-4">
                <h3 className="text-xl font-extrabold text-[#8B1E26] dark:text-amber-400 font-heading">Received Certificates</h3>
              </div>

              {memberCertificates.length > 0 ? (
                <div className="space-y-3">
                  {memberCertificates.map(cert => (
                    <div key={cert.id} className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200 dark:border-gray-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="bg-[#8B1E26] text-white font-black text-[10px] px-2.5 py-0.5 rounded uppercase">
                          {cert.type} CERTIFICATE
                        </span>
                        <span className="font-mono text-xs text-[#8B1E26] dark:text-amber-400 font-bold">{cert.certificateNumber}</span>
                      </div>
                      <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">{cert.title}</h4>
                      <p className="text-xs text-slate-600 dark:text-gray-300">{cert.description}</p>
                      <p className="text-[10px] text-slate-500 dark:text-gray-400">Issued on: {cert.issueDate} by {cert.issuedBy}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 dark:text-gray-400">No active certificates issued yet.</p>
              )}
            </div>
          )}

          {/* TAB 7: Notifications */}
          {activeTab === 'NOTIFICATIONS' && (
            <div className="space-y-4">
              <div className="border-b border-slate-200 dark:border-gray-800 pb-4">
                <h3 className="text-xl font-extrabold text-[#8B1E26] dark:text-amber-400 font-heading">Organisation Announcements</h3>
              </div>

              {notifications.map(n => (
                <div key={n.id} className="p-3.5 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-gray-800 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white">{n.title}</span>
                    <span className="text-[10px] text-slate-400">{n.date}</span>
                  </div>
                  <p className="text-slate-600 dark:text-gray-300">{n.message}</p>
                </div>
              ))}
            </div>
          )}

        </div>

      </div>

    </div>
  </div>
  );
};
