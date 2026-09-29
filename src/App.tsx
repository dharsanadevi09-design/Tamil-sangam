import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { PasaraiGrid } from './components/PasaraiGrid';
import { AboutVision } from './components/AboutVision';
import { NewsPage } from './components/NewsPage';
import { ContactPage } from './components/ContactPage';

import { OtpModal } from './components/MembershipFlow/OtpModal';
import { MemberLoginModal } from './components/MembershipFlow/MemberLoginModal';
import { RegistrationForm } from './components/MembershipFlow/RegistrationForm';
import { ReviewAndPaymentModal } from './components/MembershipFlow/ReviewAndPaymentModal';
import { PublicVerification } from './components/IdCard/PublicVerification';
import { DonateModal } from './components/Donation/DonateModal';
import { DonationReceipt } from './components/Donation/DonationReceipt';
import { MemberDashboard } from './components/MemberDashboard/MemberDashboard';
import { AdminDashboard } from './components/AdminDashboard/AdminDashboard';
import { AdminLoginModal } from './components/AdminLoginModal';

import { 
  addMemberApplication, 
  getEvents, 
  getSavedLoggedInMember, 
  saveLoggedInMember, 
  getSavedLoggedInAdmin, 
  saveLoggedInAdmin 
} from './services/storageService';
import type { MemberApplication, DonationRecord, AdminAccount } from './types';

export function App() {
  const [currentLang, setCurrentLang] = useState<'en' | 'ta'>('en');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme');
    return (saved === 'light' || saved === 'dark') ? saved : 'dark';
  });

  // User Session Persistence (once logged in or registered, stay logged in!)
  const [loggedInMember, setLoggedInMember] = useState<MemberApplication | null>(() => getSavedLoggedInMember());

  // Admin Session Persistence
  const [currentAdmin, setCurrentAdmin] = useState<AdminAccount | null>(() => getSavedLoggedInAdmin());
  const [isAdminPortalActive, setIsAdminPortalActive] = useState<boolean>(() => !!getSavedLoggedInAdmin());

  const [activeTab, setActiveTab] = useState(() => {
    if (getSavedLoggedInMember()) return 'member-dashboard';
    return 'home';
  });

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

  const [isMemberLoginModalOpen, setIsMemberLoginModalOpen] = useState(false);
  const [isAdminPasswordModalOpen, setIsAdminPasswordModalOpen] = useState(false);
  const [selectedPasaraiId, setSelectedPasaraiId] = useState<string | undefined>(undefined);

  // Sync theme with HTML root document & body
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Check URL path/hash for /admin & open site login prompt if not logged in
  useEffect(() => {
    const checkAdminRoute = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path.includes('/admin') || hash.includes('admin')) {
        if (getSavedLoggedInAdmin()) {
          setIsAdminPortalActive(true);
        } else {
          setIsAdminPasswordModalOpen(true);
        }
      }
    };

    checkAdminRoute();
    window.addEventListener('hashchange', checkAdminRoute);
    return () => window.removeEventListener('hashchange', checkAdminRoute);
  }, []);

  const handleToggleLang = () => {
    setCurrentLang(prev => (prev === 'en' ? 'ta' : 'en'));
  };

  const handleToggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
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

  // STEP 3: Payment Confirmed -> Save Application, Auto-Login & Persist Session
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

    // Save persistent user session
    saveLoggedInMember(created);
    setLoggedInMember(created);
    setActiveTab('member-dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenVerifyWithId = (memNumber: string) => {
    setVerifySearchId(memNumber);
    setIsVerifyModalOpen(true);
  };

  const handleAdminAuthSuccess = (admin: AdminAccount) => {
    saveLoggedInAdmin(admin);
    setCurrentAdmin(admin);
    setIsAdminPasswordModalOpen(false);
    setIsAdminPortalActive(true);
  };

  const handleAdminLogout = () => {
    saveLoggedInAdmin(null);
    setCurrentAdmin(null);
    setIsAdminPortalActive(false);
  };

  const handleLogoutMember = () => {
    saveLoggedInMember(null);
    setLoggedInMember(null);
    setActiveTab('home');
  };

  const handleOpenJoinModal = (pasaraiId?: string) => {
    if (loggedInMember) {
      setActiveTab('member-dashboard');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      if (pasaraiId) setSelectedPasaraiId(pasaraiId);
      setIsOtpModalOpen(true);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${
      theme === 'dark' ? 'dark bg-slate-900 text-white' : 'bg-slate-50 text-slate-900'
    }`}>
      
      {/* Main Header */}
      <Header
        onOpenJoinModal={() => handleOpenJoinModal()}
        onOpenDonateModal={() => setIsDonateModalOpen(true)}
        onOpenVerifyModal={() => { setVerifySearchId(undefined); setIsVerifyModalOpen(true); }}
        onOpenMemberLogin={() => setIsMemberLoginModalOpen(true)}
        currentLang={currentLang}
        onToggleLang={handleToggleLang}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setIsAdminPortalActive(false);
          setActiveTab(tab);
        }}
        loggedInMemberName={loggedInMember?.fullName}
        onLogoutMember={handleLogoutMember}
      />

      {/* Main Body Content Switcher */}
      <main className="flex-1">
        
        {isAdminPortalActive ? (
          <AdminDashboard
            onCloseAdmin={handleAdminLogout}
            onVerifyQrCode={handleOpenVerifyWithId}
            currentLang={currentLang}
            currentAdmin={currentAdmin}
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
            onLogout={handleLogoutMember}
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
                  onOpenJoinModal={() => handleOpenJoinModal()}
                  onOpenDonateModal={() => setIsDonateModalOpen(true)}
                  onOpenVerifyModal={() => { setVerifySearchId(undefined); setIsVerifyModalOpen(true); }}
                  currentLang={currentLang}
                  isLoggedIn={!!loggedInMember}
                  onGoToDashboard={() => { setActiveTab('member-dashboard'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                />

                <PasaraiGrid
                  onSelectPasaraiToJoin={(pasaraiId) => handleOpenJoinModal(pasaraiId)}
                  currentLang={currentLang}
                  selectedPasaraiId={selectedPasaraiId}
                  isLoggedIn={!!loggedInMember}
                  onGoToDashboard={() => { setActiveTab('member-dashboard'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                />
              </>
            )}

            {/* 2. DEDICATED ABOUT & VISION PAGE */}
            {activeTab === 'about' && (
              <AboutVision
                currentLang={currentLang}
                onOpenJoinModal={() => handleOpenJoinModal()}
                isLoggedIn={!!loggedInMember}
                onGoToDashboard={() => { setActiveTab('member-dashboard'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              />
            )}

            {/* 3. DEDICATED 23 WINGS (PASARAI) PAGE */}
            {activeTab === 'pasarai' && (
              <PasaraiGrid
                onSelectPasaraiToJoin={(pasaraiId) => handleOpenJoinModal(pasaraiId)}
                currentLang={currentLang}
                selectedPasaraiId={selectedPasaraiId}
                isLoggedIn={!!loggedInMember}
                onGoToDashboard={() => { setActiveTab('member-dashboard'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              />
            )}

            {/* 4. DEDICATED EVENTS PAGE */}
            {activeTab === 'events' && (
              <section className={`py-16 min-h-[60vh] transition-colors duration-300 ${
                theme === 'dark' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-900'
              }`}>
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
                      <div key={evt.id} className={`rounded-2xl overflow-hidden shadow-lg border flex flex-col sm:flex-row transition-colors ${
                        theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
                      }`}>
                        <img src={evt.bannerUrl} alt="" className="w-full sm:w-48 h-48 object-cover shrink-0" />
                        <div className="p-5 flex flex-col justify-between space-y-3">
                          <div>
                            <span className="bg-slate-900 text-yellow-400 text-[10px] font-bold px-2 py-0.5 rounded">
                              {evt.district} District
                            </span>
                            <h3 className={`font-extrabold text-base mt-1 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{evt.titleTamil}</h3>
                            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>{evt.title}</p>
                            <p className={`text-xs mt-2 line-clamp-2 ${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'}`}>{evt.description}</p>
                          </div>

                          <div className={`pt-2 border-t flex items-center justify-between text-xs ${
                            theme === 'dark' ? 'border-slate-700' : 'border-slate-100'
                          }`}>
                            <span className="font-bold text-amber-500">Date: {evt.date}</span>
                            <button
                              onClick={() => setIsOtpModalOpen(true)}
                              className="bg-yellow-400 text-slate-950 font-extrabold px-3 py-1.5 rounded-lg text-xs hover:bg-yellow-300 transition-colors"
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

      {/* STEP 1: REGISTRATION MOBILE OTP MODAL */}
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

      {/* DEDICATED MEMBER LOGIN MODAL */}
      <MemberLoginModal
        isOpen={isMemberLoginModalOpen}
        onClose={() => setIsMemberLoginModalOpen(false)}
        onLoginSuccess={(member) => {
          saveLoggedInMember(member);
          setLoggedInMember(member);
          setActiveTab('member-dashboard');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        currentLang={currentLang}
      />

      {/* ADMIN PASSWORD VERIFICATION MODAL (Triggered by /admin or header link) */}
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
