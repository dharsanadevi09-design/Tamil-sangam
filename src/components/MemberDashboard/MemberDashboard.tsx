import React, { useState } from 'react';
import type { MemberApplication, DonationRecord } from '../../types';
import { DigitalIdCard } from '../IdCard/DigitalIdCard';
import { DonationReceipt } from '../Donation/DonationReceipt';
import { getDonations, getCertificates, getNotifications } from '../../services/storageService';
import { User, QrCode, CreditCard, Heart, Award, Bell, ShieldCheck, LogOut } from 'lucide-react';

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

  const memberDonations = getDonations().filter(d => d.mobile === member.mobile || d.email === member.email);
  const memberCertificates = getCertificates().filter(c => c.memberId === member.id || c.memberName === member.fullName);
  const notifications = getNotifications().filter(n => !n.recipientMobile || n.recipientMobile === member.mobile);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Top Welcome Banner */}
      <div className="bg-[#181B20] text-white rounded-2xl p-6 sm:p-8 shadow-2xl gold-header-strip mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={member.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
            alt={member.fullName}
            className="w-16 h-20 rounded-xl object-cover border-2 border-yellow-400 shadow-md shrink-0"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-yellow-400 text-[#181B20] text-[10px] font-black px-2 py-0.5 rounded">
                {member.categoryName}
              </span>
              <span className="text-xs text-amber-300 font-mono font-extrabold">
                {member.membershipNumber || 'TS-TN-PENDING'}
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-white mt-1">{member.fullName}</h2>
            <p className="text-xs text-gray-300">{member.nameTamil} • {member.district} District</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
            member.status === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-amber-500/20 text-yellow-400 border border-yellow-500/40'
          }`}>
            Status: {member.status}
          </span>
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 bg-gray-800 hover:bg-gray-700 text-red-400 text-xs font-semibold px-4 py-2 rounded-lg border border-gray-700 transition-colors"
          >
            <LogOut className="w-4 h-4" />
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
                className={`w-full flex items-center justify-between p-3.5 rounded-xl font-bold text-xs transition-all ${
                  isActive
                    ? 'bg-yellow-400 text-slate-950 shadow-md'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge ? (
                  <span className="bg-amber-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        {/* Right Content Area */}
        <div className="lg:col-span-9 bg-white rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-200">
          
          {/* TAB 1: Digital ID Card */}
          {activeTab === 'CARD' && (
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-4">
                <h3 className="text-lg font-extrabold text-slate-900">Digital Membership ID Card</h3>
                <p className="text-xs text-slate-500">Official verified ID card with active QR code.</p>
              </div>

              <DigitalIdCard
                member={member}
                onVerifyQrCode={onVerifyQrCode}
                currentLang={currentLang}
              />
            </div>
          )}

          {/* TAB 2: Profile */}
          {activeTab === 'PROFILE' && (
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-4">
                <h3 className="text-lg font-extrabold text-slate-900">Personal Profile Details</h3>
                <p className="text-xs text-slate-500">Registered member information.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <h4 className="font-extrabold text-slate-900 border-b pb-1">Personal Info</h4>
                  <p><strong className="text-slate-700">Full Name:</strong> {member.fullName}</p>
                  <p><strong className="text-slate-700">Name (Tamil):</strong> {member.nameTamil}</p>
                  <p><strong className="text-slate-700">DOB:</strong> {member.dob}</p>
                  <p><strong className="text-slate-700">Gender:</strong> {member.gender}</p>
                  <p><strong className="text-slate-700">Guardian:</strong> {member.guardianName}</p>
                  <p><strong className="text-slate-700">Occupation:</strong> {member.occupation}</p>
                  <p><strong className="text-slate-700">Education:</strong> {member.education}</p>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <h4 className="font-extrabold text-slate-900 border-b pb-1">Contact & Address</h4>
                  <p><strong className="text-slate-700">Mobile:</strong> +91 {member.mobile}</p>
                  <p><strong className="text-slate-700">WhatsApp:</strong> +91 {member.whatsapp}</p>
                  <p><strong className="text-slate-700">Email:</strong> {member.email}</p>
                  <p><strong className="text-slate-700">District:</strong> {member.district}</p>
                  <p><strong className="text-slate-700">Pasarai:</strong> {member.pasaraiName}</p>
                  <p><strong className="text-slate-700">Address:</strong> {member.doorNo}, {member.street}, {member.village}, {member.postOffice}, {member.taluk} - {member.pincode}</p>
                </div>
              </div>

              {/* Identity Verification & Aadhaar Card Image */}
              <div className="bg-amber-50/80 border border-yellow-400 p-4 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-amber-900 text-xs flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-amber-600" /> Identity Verification & Aadhaar Card:
                  </span>
                  <span className="font-mono font-bold text-xs bg-amber-200 text-slate-950 px-2.5 py-0.5 rounded">
                    {member.aadhaarNumber}
                  </span>
                </div>

                {member.aadhaarDocUrl ? (
                  <div className="flex flex-col sm:flex-row items-center gap-4 pt-1">
                    <div className="w-full sm:w-56 h-36 bg-slate-900 rounded-lg overflow-hidden border-2 border-yellow-400 shadow-md">
                      <img src={member.aadhaarDocUrl} alt="Uploaded Aadhaar Card" className="w-full h-full object-cover" />
                    </div>
                    <div className="text-xs text-slate-600 space-y-1">
                      <p className="font-bold text-emerald-700 flex items-center gap-1">
                        ✓ Uploaded Aadhaar Card Copy
                      </p>
                      <p className="text-[11px] text-slate-500">
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
              <div className="border-b border-slate-200 pb-4">
                <h3 className="text-lg font-extrabold text-slate-900">Membership Subscription Status</h3>
              </div>

              <div className="bg-[#181B20] text-white p-6 rounded-2xl border-2 border-yellow-400 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-yellow-400">STATE REGISTERED MEMBER</span>
                  <span className="bg-emerald-500 text-slate-950 font-black text-xs px-2.5 py-0.5 rounded">
                    {member.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs pt-2">
                  <div>
                    <span className="text-gray-400 block text-[10px]">Membership ID</span>
                    <span className="font-mono font-extrabold text-amber-300 text-sm">{member.membershipNumber || member.id}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px]">Category</span>
                    <span className="font-bold text-white text-sm">{member.categoryName}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px]">Joining Date</span>
                    <span className="font-bold text-white">{member.joiningDate || '2026-01-10'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px]">Validity Expiry</span>
                    <span className="font-bold text-amber-400">{member.validityDate || '2027-01-10'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Payments */}
          {activeTab === 'PAYMENTS' && (
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-4">
                <h3 className="text-lg font-extrabold text-slate-900">Membership Fee Payment History</h3>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-slate-900">Initial Membership Registration Fee</p>
                  <p className="text-slate-500">Method: {member.paymentMethod || 'UPI / GPay'} • Txn: {member.paymentTransactionId || 'TXN98492019482'}</p>
                  <p className="text-[10px] text-slate-400">Date: {member.paymentDate || member.joiningDate || '2026-01-10'}</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-black text-slate-900">₹{member.paymentAmount || 100}</span>
                  <span className="block text-[10px] text-emerald-600 font-bold">PAID ✓</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Donations */}
          {activeTab === 'DONATIONS' && (
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-4">
                <h3 className="text-lg font-extrabold text-slate-900">Donation History & PDF Receipts</h3>
              </div>

              {selectedDonation ? (
                <DonationReceipt receipt={selectedDonation} onClose={() => setSelectedDonation(null)} currentLang={currentLang} />
              ) : memberDonations.length > 0 ? (
                <div className="space-y-3">
                  {memberDonations.map(don => (
                    <div key={don.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-slate-900">{don.purpose}</p>
                        <p className="text-slate-500">Receipt #{don.receiptNumber} • {don.date}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-black text-rose-600 text-sm">₹{don.amount.toLocaleString()}</span>
                        <button
                          onClick={() => setSelectedDonation(don)}
                          className="bg-slate-900 hover:bg-yellow-400 text-white hover:text-slate-900 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
                        >
                          View Receipt
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500">No donation records found yet.</p>
              )}
            </div>
          )}

          {/* TAB 6: Certificates */}
          {activeTab === 'CERTIFICATES' && (
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-4">
                <h3 className="text-lg font-extrabold text-slate-900">Received Certificates</h3>
              </div>

              {memberCertificates.length > 0 ? (
                <div className="space-y-3">
                  {memberCertificates.map(cert => (
                    <div key={cert.id} className="bg-amber-50/60 p-4 rounded-xl border border-amber-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="bg-yellow-400 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded uppercase">
                          {cert.type} CERTIFICATE
                        </span>
                        <span className="font-mono text-xs text-amber-900 font-bold">{cert.certificateNumber}</span>
                      </div>
                      <h4 className="font-extrabold text-slate-900 text-sm">{cert.title}</h4>
                      <p className="text-xs text-slate-600">{cert.description}</p>
                      <p className="text-[10px] text-slate-500">Issued on: {cert.issueDate} by {cert.issuedBy}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500">No active certificates issued yet.</p>
              )}
            </div>
          )}

          {/* TAB 7: Notifications */}
          {activeTab === 'NOTIFICATIONS' && (
            <div className="space-y-4">
              <div className="border-b border-slate-200 pb-4">
                <h3 className="text-lg font-extrabold text-slate-900">Organisation Announcements</h3>
              </div>

              {notifications.map(n => (
                <div key={n.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{n.title}</span>
                    <span className="text-[10px] text-slate-400">{n.date}</span>
                  </div>
                  <p className="text-slate-600">{n.message}</p>
                </div>
              ))}
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
