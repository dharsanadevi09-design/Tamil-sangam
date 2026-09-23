import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { PasaraiGrid } from './components/PasaraiGrid';
import { AboutVision } from './components/AboutVision';
import { NewsPage } from './components/NewsPage';
import { ContactPage } from './components/ContactPage';

import { OtpModal } from './components/MembershipFlow/OtpModal';
import { RegistrationForm } from './components/MembershipFlow/RegistrationForm';
import { ReviewAndPaymentModal } from './components/MembershipFlow/ReviewAndPaymentModal';
import { PublicVerification } from './components/IdCard/PublicVerification';
import { DonateModal } from './components/Donation/DonateModal';
import { DonationReceipt } from './components/Donation/DonationReceipt';
import { MemberDashboard } from './components/MemberDashboard/MemberDashboard';
import { AdminDashboard } from './components/AdminDashboard/AdminDashboard';
import { AdminLoginModal } from './components/AdminLoginModal';

import { addMemberApplication, getEvents, getOrCreateMemberByMobile } from './services/storageService';
import type { MemberApplication, DonationRecord } from './types';
import { Users } from 'lucide-react';

export function App() {
  const [currentLang, setCurrentLang] = useState<'en' | 'ta'>('en');
  const [activeTab, setActiveTab] = useState('home');

  // Modals & Workflows
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [verifiedMobileForRegistration, setVerifiedMobileForRegistration] = useState<string | null>(null);
  const [pendingFormData, setPendingFormData] = useState<Partial<MemberApplication> | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // Verification & Donation Modals
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [verifySearchId, setVerifySearchId] = useState<string | undefined>(undefined);
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);
  const [currentDonationReceipt, setCurrentDonationReceipt] = useState<DonationRecord | null>(null);

  // User Sessions & Member Login
  const [loggedInMember, setLoggedInMember] = useState<MemberApplication | null>(null);
  const [isMemberLoginModalOpen, setIsMemberLoginModalOpen] = useState(false);
  const [loginMobileInput, setLoginMobileInput] = useState('9840123456');

  // Admin Access & Password Security (p@$$word)
  const [isAdminPortalActive, setIsAdminPortalActive] = useState(false);
  const [isAdminPasswordModalOpen, setIsAdminPasswordModalOpen] = useState(false);

  const [selectedPasaraiId, setSelectedPasaraiId] = useState<string | undefined>(undefined);

  // Check URL path/hash for /admin & open site login prompt
  useEffect(() => {
    const checkAdminRoute = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path.includes('/admin') || hash.includes('admin')) {
        setIsAdminPasswordModalOpen(true);
      }
    };

    checkAdminRoute();
    window.addEventListener('hashchange', checkAdminRoute);
    return () => window.removeEventListener('hashchange', checkAdminRoute);
  }, []);

  const handleToggleLang = () => {
    setCurrentLang(prev => (prev === 'en' ? 'ta' : 'en'));
  };

  // STEP 1: OTP Verified -> Unlocks Registration Form
  const handleOtpVerified = (verifiedMobile: string) => {
    setIsOtpModalOpen(false);
    setVerifiedMobileForRegistration(verifiedMobile);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // STEP 2: Registration Form Completed -> Opens Review & Payment
  const handleFormCompleted = (formData: Partial<MemberApplication>) => {
    setPendingFormData(formData);
    setIsPaymentModalOpen(true);
  };

  // STEP 3: Payment Confirmed -> Save Application & Open Dashboard
  const handleConfirmAndPay = (paymentDetails: { paymentMethod: string; transactionId: string }) => {
    if (!pendingFormData) return;

    const fullApp: Omit<MemberApplication, 'id' | 'status'> = {
      ...(pendingFormData as any),
      paymentMethod: paymentDetails.paymentMethod,
      paymentTransactionId: paymentDetails.transactionId,
      paymentDate: new Date().toISOString().split('T')[0],
      mobileVerified: true,
    };

    const created = addMemberApplication(fullApp);
    setIsPaymentModalOpen(false);
    setVerifiedMobileForRegistration(null);
    setPendingFormData(null);

    setLoggedInMember(created);
    setActiveTab('member-dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenVerifyWithId = (memNumber: string) => {
    setVerifySearchId(memNumber);
    setIsVerifyModalOpen(true);
  };

  // Seamless login for ANY mobile number or ID entered by user
  const handleMemberLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginMobileInput.trim()) return;

    const member = getOrCreateMemberByMobile(loginMobileInput.trim());
    setLoggedInMember(member);
    setIsMemberLoginModalOpen(false);
    setActiveTab('member-dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminAuthSuccess = () => {
    setIsAdminPasswordModalOpen(false);
    setIsAdminPortalActive(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      
      {/* Main Header */}
      <Header
        onOpenJoinModal={() => setIsOtpModalOpen(true)}
        onOpenDonateModal={() => setIsDonateModalOpen(true)}
        onOpenVerifyModal={() => { setVerifySearchId(undefined); setIsVerifyModalOpen(true); }}
        onOpenMemberLogin={() => setIsMemberLoginModalOpen(true)}
        currentLang={currentLang}
        onToggleLang={handleToggleLang}
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setIsAdminPortalActive(false);
          setActiveTab(tab);
        }}
        loggedInMemberName={loggedInMember?.fullName}
        onLogoutMember={() => setLoggedInMember(null)}
      />

      {/* Main Body Content Switcher */}
      <main className="flex-1">
        
        {isAdminPortalActive ? (
          <AdminDashboard
            onCloseAdmin={() => setIsAdminPortalActive(false)}
            onVerifyQrCode={handleOpenVerifyWithId}
            currentLang={currentLang}
          />
        ) : verifiedMobileForRegistration ? (
          /* Step 2: Unlocked Membership Registration Form after Mobile OTP */
          <RegistrationForm
            verifiedMobile={verifiedMobileForRegistration}
            onFormCompleted={handleFormCompleted}
            onCancel={() => setVerifiedMobileForRegistration(null)}
            currentLang={currentLang}
            preselectedPasaraiId={selectedPasaraiId}
          />
        ) : activeTab === 'member-dashboard' && loggedInMember ? (
          /* Logged In Member Dashboard */
          <MemberDashboard
            member={loggedInMember}
            onLogout={() => setLoggedInMember(null)}
            onVerifyQrCode={handleOpenVerifyWithId}
            currentLang={currentLang}
          />
        ) : (
          /* Standard Menu Page Views */
          <div>
            
            {/* 1. HOME VIEW */}
            {activeTab === 'home' && (
              <>
                <Hero
                  onOpenJoinModal={() => setIsOtpModalOpen(true)}
                  onOpenDonateModal={() => setIsDonateModalOpen(true)}
                  onOpenVerifyModal={() => { setVerifySearchId(undefined); setIsVerifyModalOpen(true); }}
                  currentLang={currentLang}
                />

                <PasaraiGrid
                  onSelectPasaraiToJoin={(pasaraiId) => {
                    setSelectedPasaraiId(pasaraiId);
                    setIsOtpModalOpen(true);
                  }}
                  currentLang={currentLang}
                  selectedPasaraiId={selectedPasaraiId}
                />
              </>
            )}

            {/* 2. DEDICATED ABOUT & VISION PAGE */}
            {activeTab === 'about' && (
              <AboutVision
                currentLang={currentLang}
                onOpenJoinModal={() => setIsOtpModalOpen(true)}
              />
            )}

            {/* 3. DEDICATED 23 WINGS (PASARAI) PAGE */}
            {activeTab === 'pasarai' && (
              <PasaraiGrid
                onSelectPasaraiToJoin={(pasaraiId) => {
                  setSelectedPasaraiId(pasaraiId);
                  setIsOtpModalOpen(true);
                }}
                currentLang={currentLang}
                selectedPasaraiId={selectedPasaraiId}
              />
            )}

            {/* 4. DEDICATED EVENTS PAGE */}
            {activeTab === 'events' && (
              <section className="py-16 bg-slate-100 min-h-[60vh]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                  <div className="bg-[#181B20] text-white rounded-3xl p-8 shadow-2xl gold-header-strip">
                    <span className="bg-yellow-400 text-slate-950 font-black text-xs px-3 py-1 rounded uppercase">
                      CONVENTIONS & MEETS
                    </span>
                    <h1 className="text-3xl font-extrabold text-white mt-2">Sangam Events 2026</h1>
                    <p className="text-xs text-gray-300">Register for state level symposiums and youth tournaments.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {getEvents().map((evt) => (
                      <div key={evt.id} className="bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-200 flex flex-col sm:flex-row">
                        <img src={evt.bannerUrl} alt="" className="w-full sm:w-48 h-48 object-cover shrink-0" />
                        <div className="p-5 flex flex-col justify-between space-y-3">
                          <div>
                            <span className="bg-slate-900 text-yellow-400 text-[10px] font-bold px-2 py-0.5 rounded">
                              {evt.district} District
                            </span>
                            <h3 className="font-extrabold text-base text-slate-900 mt-1">{evt.titleTamil}</h3>
                            <p className="text-xs text-slate-500">{evt.title}</p>
                            <p className="text-xs text-slate-600 mt-2 line-clamp-2">{evt.description}</p>
                          </div>

                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                            <span className="font-bold text-amber-700">Date: {evt.date}</span>
                            <button
                              onClick={() => setIsOtpModalOpen(true)}
                              className="bg-yellow-400 text-slate-950 font-extrabold px-3 py-1.5 rounded-lg text-xs hover:bg-yellow-300"
                            >
                              Register Event
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* 5. DEDICATED NEWS & MEDIA PAGE */}
            {activeTab === 'news' && (
              <NewsPage currentLang={currentLang} />
            )}

            {/* 6. DEDICATED CONTACT PAGE */}
            {activeTab === 'contact' && (
              <ContactPage currentLang={currentLang} />
            )}

          </div>
        )}

      </main>

      {/* STEP 1: MOBILE OTP MODAL */}
      <OtpModal
        isOpen={isOtpModalOpen}
        onClose={() => setIsOtpModalOpen(false)}
        onOtpVerified={handleOtpVerified}
        currentLang={currentLang}
      />

      {/* STEP 3: REVIEW APPLICATION & PAYMENT MODAL */}
      {isPaymentModalOpen && pendingFormData && (
        <ReviewAndPaymentModal
          applicationData={pendingFormData}
          onConfirmAndPay={handleConfirmAndPay}
          onBack={() => {
            setIsPaymentModalOpen(false);
            setVerifiedMobileForRegistration(pendingFormData.mobile || '9840123456');
          }}
          currentLang={currentLang}
        />
      )}

      {/* PUBLIC QR MEMBERSHIP VERIFICATION MODAL */}
      {isVerifyModalOpen && (
        <PublicVerification
          initialSearchId={verifySearchId}
          onClose={() => setIsVerifyModalOpen(false)}
          currentLang={currentLang}
        />
      )}

      {/* DONATION MODAL */}
      {isDonateModalOpen && (
        <DonateModal
          isOpen={isDonateModalOpen}
          onClose={() => setIsDonateModalOpen(false)}
          onDonationCompleted={(receipt) => {
            setIsDonateModalOpen(false);
            setCurrentDonationReceipt(receipt);
          }}
          currentLang={currentLang}
        />
      )}

      {/* DONATION RECEIPT VIEW MODAL */}
      {currentDonationReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-100 p-4 rounded-2xl max-w-3xl w-full">
            <DonationReceipt
              receipt={currentDonationReceipt}
              onClose={() => setCurrentDonationReceipt(null)}
              currentLang={currentLang}
            />
          </div>
        </div>
      )}

      {/* MEMBER LOGIN MODAL */}
      {isMemberLoginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-[#181B20] text-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-gray-800 gold-header-strip relative">
            <button onClick={() => setIsMemberLoginModalOpen(false)} className="absolute right-4 top-4 text-gray-400">✕</button>
            
            <div className="text-center space-y-2 mb-4">
              <div className="w-12 h-12 bg-yellow-400/10 text-yellow-400 rounded-full flex items-center justify-center mx-auto">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-lg text-white">Member Login Portal</h3>
              <p className="text-xs text-gray-400">Type ANY mobile number or ID to login instantly</p>
            </div>

            <form onSubmit={handleMemberLoginSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Mobile / Membership Number</label>
                <input
                  type="text"
                  value={loginMobileInput}
                  onChange={(e) => setLoginMobileInput(e.target.value)}
                  placeholder="Enter ANY mobile number..."
                  className="w-full p-3 bg-gray-900 border border-gray-700 rounded-xl text-white font-semibold"
                  required
                  autoFocus
                />
              </div>

              <button
                type="submit"
                className="w-full bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-extrabold py-3.5 rounded-xl uppercase tracking-wider text-xs shadow-lg"
              >
                LOGIN TO MEMBER DASHBOARD
              </button>

              <div className="bg-gray-800/60 p-2.5 rounded-lg text-[10px] text-gray-400 space-y-1">
                <p className="font-bold text-yellow-400">Instant Login Enabled:</p>
                <p>Type ANY number (e.g. <code className="text-white font-mono">9840123456</code>, <code className="text-white font-mono">9789012345</code>, or any number of your choice) to log in immediately!</p>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADMIN PASSWORD VERIFICATION MODAL (Triggered by /admin) */}
      <AdminLoginModal
        isOpen={isAdminPasswordModalOpen}
        onClose={() => setIsAdminPasswordModalOpen(false)}
        onSuccess={handleAdminAuthSuccess}
        currentLang={currentLang}
      />

      {/* Main Footer */}
      <Footer
        onOpenJoinModal={() => setIsOtpModalOpen(true)}
        onOpenDonateModal={() => setIsDonateModalOpen(true)}
        onOpenVerifyModal={() => { setVerifySearchId(undefined); setIsVerifyModalOpen(true); }}
        onSelectPasarai={(pasaraiId) => {
          setSelectedPasaraiId(pasaraiId);
          setActiveTab('pasarai');
        }}
        currentLang={currentLang}
      />

    </div>
  );
}

export default App;
