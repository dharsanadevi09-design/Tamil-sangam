import type { MemberApplication, DonationRecord, EventItem, CertificateItem, NewsItem, SystemNotification, MembershipCategory, AdminAccount, GalleryItem, Pasarai } from '../types';
import { INITIAL_MEMBERS, INITIAL_DONATIONS, INITIAL_EVENTS, INITIAL_NEWS, INITIAL_CERTIFICATES, MEMBERSHIP_CATEGORIES, PASARAI_WINGS } from '../data/mockData';
import { api } from './apiClient';

const KEYS = {
  MEMBERS: 'ts_members_v1',
  DONATIONS: 'ts_donations_v1',
  EVENTS: 'ts_events_v1',
  NEWS: 'ts_news_v1',
  CERTIFICATES: 'ts_certificates_v1',
  CATEGORIES: 'ts_categories_v1',
  ID_FORMAT: 'ts_id_format_v1',
  NOTIFICATIONS: 'ts_notifications_v1',
  ADMINS: 'ts_admins_v1',
  CURRENT_MEMBER_SESSION: 'ts_logged_in_member_v1',
  CURRENT_ADMIN_SESSION: 'ts_logged_in_admin_v1',
  GALLERY: 'ts_gallery_v1',
  PASARAI: 'ts_pasarai_v1',
};

export const INITIAL_GALLERY: GalleryItem[] = [
  { id: 'GAL-01', title: 'Madurai Meenakshi Temple & Golden Pond', titleTamil: 'மதுரை மீனாட்சி அம்மன் கோயில் & பொற்றாமரைக் குளம்', category: 'Culture', img: '/hero-temple.jpg', date: '2026-01-15' },
  { id: 'GAL-02', title: 'Madurai Temple Chariot Festival', titleTamil: 'மதுரை கோயில் தேரோட்டம்', category: 'Events', img: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?q=80&w=800&auto=format&fit=crop', date: '2026-01-18' },
  { id: 'GAL-03', title: 'Classical Bharatanatyam Recital', titleTamil: 'பாரம்பரிய பரதநாட்டிய அரங்கேற்றம்', category: 'Culture', img: 'https://images.unsplash.com/photo-1601972599720-36938d4ecd31?q=80&w=800&auto=format&fit=crop', date: '2026-01-20' },
  { id: 'GAL-04', title: 'Tree Sapling Plantation Drive', titleTamil: 'மரக்கன்றுகள் நடும் பசுமை இயக்கம்', category: 'Welfare', img: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=800&auto=format&fit=crop', date: '2026-01-22' },
  { id: 'GAL-05', title: 'State Level Youth Assembly', titleTamil: 'மாநில இளைஞர் பேரவை மாநாடு', category: 'Events', img: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=800&auto=format&fit=crop', date: '2026-01-25' },
  { id: 'GAL-06', title: 'Thiruvalluvar Statue Heritage Tour', titleTamil: 'திருவள்ளுவர் சிலை மரபுச் சுற்றுலா', category: 'Pasarai', img: 'https://images.unsplash.com/photo-1600100397608-f09074052329?q=80&w=800&auto=format&fit=crop', date: '2026-02-01' },
  { id: 'GAL-07', title: 'Free Medical & Siddha Camp', titleTamil: 'இலவச சித்த & பொது மருத்துவ முகாம்', category: 'Welfare', img: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=800&auto=format&fit=crop', date: '2026-02-05' },
  { id: 'GAL-08', title: 'Sangam Literature Book Fair', titleTamil: 'சங்க இலக்கிய புத்தகக் கண்காட்சி', category: 'District', img: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=800&auto=format&fit=crop', date: '2026-02-10' },
];

export const INITIAL_ADMINS: AdminAccount[] = [
  {
    id: 'ADMIN-01',
    name: 'State HQ Super Admin',
    username: 'superadmin',
    password: 'p@$$word',
    role: 'SUPER_ADMIN',
    district: 'ALL',
    createdAt: '2026-01-01'
  },
  {
    id: 'ADMIN-02',
    name: 'Madurai District Admin',
    username: 'maduraiadmin',
    password: 'p@$$word',
    role: 'DISTRICT_ADMIN',
    district: 'Madurai',
    createdAt: '2026-01-05'
  },
  {
    id: 'ADMIN-03',
    name: 'Chennai District Admin',
    username: 'chennaiadmin',
    password: 'p@$$word',
    role: 'DISTRICT_ADMIN',
    district: 'Chennai',
    createdAt: '2026-01-05'
  },
  {
    id: 'ADMIN-04',
    name: 'Coimbatore District Admin',
    username: 'coimbatoreadmin',
    password: 'p@$$word',
    role: 'DISTRICT_ADMIN',
    district: 'Coimbatore',
    createdAt: '2026-01-05'
  },
  {
    id: 'ADMIN-05',
    name: 'Tiruchirappalli District Admin',
    username: 'trichyadmin',
    password: 'p@$$word',
    role: 'DISTRICT_ADMIN',
    district: 'Tiruchirappalli',
    createdAt: '2026-01-05'
  }
];

// Initialize LocalStorage with mock data if missing and trigger background DB sync
export const initStorage = () => {
  if (!localStorage.getItem(KEYS.MEMBERS)) {
    localStorage.setItem(KEYS.MEMBERS, JSON.stringify(INITIAL_MEMBERS));
  }
  if (!localStorage.getItem(KEYS.DONATIONS)) {
    localStorage.setItem(KEYS.DONATIONS, JSON.stringify(INITIAL_DONATIONS));
  }
  if (!localStorage.getItem(KEYS.EVENTS)) {
    localStorage.setItem(KEYS.EVENTS, JSON.stringify(INITIAL_EVENTS));
  }
  if (!localStorage.getItem(KEYS.NEWS)) {
    localStorage.setItem(KEYS.NEWS, JSON.stringify(INITIAL_NEWS));
  }
  if (!localStorage.getItem(KEYS.CERTIFICATES)) {
    localStorage.setItem(KEYS.CERTIFICATES, JSON.stringify(INITIAL_CERTIFICATES));
  }
  if (!localStorage.getItem(KEYS.CATEGORIES)) {
    localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(MEMBERSHIP_CATEGORIES));
  }
  if (!localStorage.getItem(KEYS.ID_FORMAT)) {
    localStorage.setItem(KEYS.ID_FORMAT, 'TS-TN-2026-{SEQ}');
  }
  if (!localStorage.getItem(KEYS.ADMINS)) {
    localStorage.setItem(KEYS.ADMINS, JSON.stringify(INITIAL_ADMINS));
  }
  if (!localStorage.getItem(KEYS.GALLERY)) {
    localStorage.setItem(KEYS.GALLERY, JSON.stringify(INITIAL_GALLERY));
  }
  if (!localStorage.getItem(KEYS.PASARAI)) {
    localStorage.setItem(KEYS.PASARAI, JSON.stringify(PASARAI_WINGS));
  }

  // Asynchronously synchronize with Backend SQLite Database
  syncWithBackendDatabase();
};

let isSyncing = false;
export const syncWithBackendDatabase = async () => {
  if (isSyncing) return;
  isSyncing = true;
  try {
    const [members, donations, events, news, certs, admins, gallery, wings, categories, notifs] = await Promise.all([
      api.getMembers().catch(() => null),
      api.getDonations().catch(() => null),
      api.getEvents().catch(() => null),
      api.getNews().catch(() => null),
      api.getCertificates().catch(() => null),
      api.getAdmins().catch(() => null),
      api.getGallery().catch(() => null),
      api.getPasarai().catch(() => null),
      api.getCategories().catch(() => null),
      api.getNotifications().catch(() => null),
    ]);

    if (members && members.length > 0) {
      localStorage.setItem(KEYS.MEMBERS, JSON.stringify(members));
    }
    if (donations && donations.length > 0) {
      localStorage.setItem(KEYS.DONATIONS, JSON.stringify(donations));
    }
    if (events && events.length > 0) {
      localStorage.setItem(KEYS.EVENTS, JSON.stringify(events));
    }
    if (news && news.length > 0) {
      localStorage.setItem(KEYS.NEWS, JSON.stringify(news));
    }
    if (certs && certs.length > 0) {
      localStorage.setItem(KEYS.CERTIFICATES, JSON.stringify(certs));
    }
    if (admins && admins.length > 0) {
      localStorage.setItem(KEYS.ADMINS, JSON.stringify(admins));
    }
    if (gallery && gallery.length > 0) {
      localStorage.setItem(KEYS.GALLERY, JSON.stringify(gallery));
    }
    if (wings && wings.length > 0) {
      localStorage.setItem(KEYS.PASARAI, JSON.stringify(wings));
    }
    if (categories && categories.length > 0) {
      localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(categories));
    }
    if (notifs && notifs.length > 0) {
      localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(notifs));
    }
  } catch (err) {
    console.warn('Backend sync skipped or offline:', err);
  } finally {
    isSyncing = false;
  }
};

// Auto-trigger sync on load
if (typeof window !== 'undefined') {
  setTimeout(() => {
    initStorage();
  }, 100);
}

// --- USER MEMBER SESSION PERSISTENCE ---
export const getSavedLoggedInMember = (): MemberApplication | null => {
  try {
    const data = localStorage.getItem(KEYS.CURRENT_MEMBER_SESSION);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    return null;
  }
};

export const saveLoggedInMember = (member: MemberApplication | null) => {
  if (member) {
    localStorage.setItem(KEYS.CURRENT_MEMBER_SESSION, JSON.stringify(member));
  } else {
    localStorage.removeItem(KEYS.CURRENT_MEMBER_SESSION);
  }
};

// --- ADMIN SESSION PERSISTENCE ---
export const getSavedLoggedInAdmin = (): AdminAccount | null => {
  try {
    const data = localStorage.getItem(KEYS.CURRENT_ADMIN_SESSION);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    return null;
  }
};

export const saveLoggedInAdmin = (admin: AdminAccount | null) => {
  if (admin) {
    localStorage.setItem(KEYS.CURRENT_ADMIN_SESSION, JSON.stringify(admin));
  } else {
    localStorage.removeItem(KEYS.CURRENT_ADMIN_SESSION);
  }
};

// --- ADMIN ACCOUNTS MANAGEMENT ---
export const getAdminAccounts = (): AdminAccount[] => {
  initStorage();
  const data = localStorage.getItem(KEYS.ADMINS);
  return data ? JSON.parse(data) : INITIAL_ADMINS;
};

export const saveAdminAccounts = (admins: AdminAccount[]) => {
  localStorage.setItem(KEYS.ADMINS, JSON.stringify(admins));
};

export const addAdminAccount = (accountData: Omit<AdminAccount, 'id' | 'createdAt'>): AdminAccount => {
  const admins = getAdminAccounts();
  const newAdmin: AdminAccount = {
    ...accountData,
    id: `ADMIN-${Date.now().toString().slice(-4)}`,
    createdAt: new Date().toISOString().split('T')[0]
  };
  admins.push(newAdmin);
  saveAdminAccounts(admins);

  // Sync with Backend SQLite Database
  api.createAdmin(newAdmin).catch(err => console.error('Failed to sync admin to DB:', err));

  return newAdmin;
};

export const deleteAdminAccount = (id: string): void => {
  const admins = getAdminAccounts().filter(a => a.id !== id);
  saveAdminAccounts(admins);
  // Delete from backend DB
  api.deleteAdmin(id).catch(err => console.error('Failed to delete admin from DB:', err));
};

// --- MEMBERS MANAGEMENT ---
export const getMembers = (): MemberApplication[] => {
  initStorage();
  const data = localStorage.getItem(KEYS.MEMBERS);
  return data ? JSON.parse(data) : INITIAL_MEMBERS;
};

export const saveMembers = (members: MemberApplication[]) => {
  localStorage.setItem(KEYS.MEMBERS, JSON.stringify(members));
};

export const deleteMember = (id: string): void => {
  const members = getMembers().filter(m => m.id !== id);
  saveMembers(members);
  // Delete from backend DB
  api.deleteMember(id).catch(err => console.error('Failed to delete member from DB:', err));
};

export const getMemberById = (id: string): MemberApplication | undefined => {
  const members = getMembers();
  const cleanId = id.trim();
  return members.find(m => 
    m.id === cleanId || 
    m.membershipNumber === cleanId || 
    m.mobile === cleanId || 
    m.mobile.includes(cleanId)
  );
};

// Dynamic account lookup or instant creation for ANY mobile number typed by the user
export const getOrCreateMemberByMobile = (mobileOrId: string): MemberApplication => {
  const existing = getMemberById(mobileOrId);
  if (existing) return existing;

  const members = getMembers();
  const cleanNum = mobileOrId.replace(/\D/g, '') || '9840123456';
  const seq = String(members.length + 101).padStart(6, '0');
  const newMemNum = `TS-TN-2026-${seq}`;

  const newMember: MemberApplication = {
    id: `APP-${Date.now().toString().slice(-4)}`,
    mobileVerified: true,
    fullName: `Sangam Member (${cleanNum.slice(-4)})`,
    nameTamil: `சங்க உறுப்பினர் (${cleanNum.slice(-4)})`,
    dob: '1995-06-15',
    gender: 'Male',
    guardianName: 'Tamil Sangam Parent',
    occupation: 'Professional',
    education: 'Bachelor Degree',
    bloodGroup: 'O+',
    mobile: cleanNum,
    whatsapp: cleanNum,
    email: `member.${cleanNum}@tamilsangamtn.org`,
    doorNo: '10/2',
    street: 'Main Avenue',
    village: 'Mylapore',
    postOffice: 'Mylapore HO',
    taluk: 'Mylapore',
    district: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600004',
    country: 'India',
    aadhaarNumber: '7890-1234-5678',
    aadhaarDocUrl: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=400&q=80',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    categoryId: 'CAT-GEN',
    categoryName: 'General Member',
    pasaraiId: 'PAS-01',
    pasaraiName: 'இளைஞர் பாசறை',
    paymentMethod: 'UPI / GPay',
    paymentAmount: 100,
    paymentTransactionId: `TXN-${Date.now().toString().slice(-6)}`,
    paymentDate: new Date().toISOString().split('T')[0],
    status: 'APPROVED',
    membershipNumber: newMemNum,
    joiningDate: new Date().toISOString().split('T')[0],
    validityDate: '2027-01-10',
    qrCodeData: `TS-TN-VERIFIED|${newMemNum}|Sangam Member|Chennai`
  };

  members.unshift(newMember);
  saveMembers(members);

  // Sync to backend DB
  api.createMember(newMember).catch(err => console.error('Failed to sync created member to DB:', err));

  return newMember;
};

export const addMemberApplication = async (app: Omit<MemberApplication, 'id' | 'status'>): Promise<MemberApplication> => {
  const members = getMembers();
  let createdApp: MemberApplication;

  try {
    const res = await api.createMember(app);
    createdApp = res.member;
  } catch (err) {
    console.warn('API createMember fallback to local:', err);
    const approvedCount = members.filter(m => m.status === 'APPROVED' || m.membershipNumber).length + 1;
    const seqStr = String(approvedCount).padStart(6, '0');
    const currentFormat = localStorage.getItem(KEYS.ID_FORMAT) || 'TS-TN-2026-{SEQ}';
    const memNum = currentFormat.replace('{SEQ}', seqStr);
    const today = new Date().toISOString().split('T')[0];
    const expDate = new Date();
    expDate.setFullYear(expDate.getFullYear() + 1);

    createdApp = {
      ...app,
      id: `APP-${Date.now().toString().slice(-4)}`,
      membershipNumber: memNum,
      status: 'APPROVED',
      joiningDate: today,
      validityDate: expDate.toISOString().split('T')[0],
      qrCodeData: `VERIFIED|${memNum}|${app.fullName}|${app.district}|${app.categoryName}`
    };
  }

  // Update local memory & storage
  const idx = members.findIndex(m => m.id === createdApp.id || m.mobile === createdApp.mobile);
  if (idx !== -1) {
    members[idx] = createdApp;
  } else {
    members.unshift(createdApp);
  }
  saveMembers(members);
  
  addNotification({
    title: 'Membership Confirmed & ID Card Ready! 🌟',
    message: `Payment confirmed for ${createdApp.fullName}. Official Member ID: ${createdApp.membershipNumber}. You can log in with OTP anytime.`,
    type: 'MEMBERSHIP',
    recipientMobile: createdApp.mobile
  });

  return createdApp;
};

export const approveMemberApplication = (appId: string): MemberApplication | null => {
  const members = getMembers();
  const index = members.findIndex(m => m.id === appId);
  if (index === -1) return null;

  const approvedCount = members.filter(m => m.status === 'APPROVED').length + 1;
  const seqStr = String(approvedCount).padStart(6, '0');
  
  const currentFormat = localStorage.getItem(KEYS.ID_FORMAT) || 'TS-TN-2026-{SEQ}';
  const memNum = currentFormat.replace('{SEQ}', seqStr);

  const today = new Date().toISOString().split('T')[0];
  const cat = getCategories().find(c => c.id === members[index].categoryId);
  const valMonths = cat ? cat.validityMonths : 12;

  const expDate = new Date();
  expDate.setMonth(expDate.getMonth() + valMonths);
  const validityStr = expDate.toISOString().split('T')[0];

  const approvedMember: MemberApplication = {
    ...members[index],
    status: 'APPROVED',
    membershipNumber: memNum,
    joiningDate: today,
    validityDate: validityStr,
    qrCodeData: `VERIFIED|${memNum}|${members[index].fullName}|${members[index].district}|${members[index].categoryName}`
  };

  members[index] = approvedMember;
  saveMembers(members);

  // Sync active user session if approved member is currently logged in
  const currentSessionMember = getSavedLoggedInMember();
  if (currentSessionMember && (currentSessionMember.id === approvedMember.id || currentSessionMember.mobile === approvedMember.mobile)) {
    saveLoggedInMember(approvedMember);
  }

  addNotification({
    title: 'Membership Approved! 🌟',
    message: `Congratulations ${approvedMember.fullName}! Your Membership ID is ${memNum}. Your Digital ID card is ready.`,
    type: 'MEMBERSHIP',
    recipientMobile: approvedMember.mobile
  });

  // Call Backend API to commit approval, trigger user notification & SMS/WhatsApp
  api.approveMember(appId).then(res => {
    if (res.member) {
      const mIdx = members.findIndex(m => m.id === appId);
      if (mIdx !== -1) {
        members[mIdx] = res.member;
        saveMembers(members);
      }
    }
  }).catch(err => console.error('Error committing approval to DB:', err));

  return approvedMember;
};

export const rejectMemberApplication = (appId: string, reason: string): MemberApplication | null => {
  const members = getMembers();
  const index = members.findIndex(m => m.id === appId);
  if (index === -1) return null;

  members[index] = {
    ...members[index],
    status: 'REJECTED',
    rejectionReason: reason
  };

  saveMembers(members);

  // Commit rejection to backend database
  api.rejectMember(appId, reason).catch(err => console.error('Error rejecting member in DB:', err));

  return members[index];
};

// --- DONATIONS MANAGEMENT ---
export const getDonations = (): DonationRecord[] => {
  initStorage();
  const data = localStorage.getItem(KEYS.DONATIONS);
  return data ? JSON.parse(data) : INITIAL_DONATIONS;
};

export const saveDonations = (donations: DonationRecord[]) => {
  localStorage.setItem(KEYS.DONATIONS, JSON.stringify(donations));
};

export const addDonation = async (donationData: Omit<DonationRecord, 'id' | 'receiptNumber' | 'date'>): Promise<DonationRecord> => {
  let createdDonation: DonationRecord;

  try {
    const res = await api.createDonation(donationData);
    createdDonation = res.donation;
  } catch (err) {
    console.warn('API createDonation fallback to local:', err);
    const donations = getDonations();
    const seq = String(donations.length + 1).padStart(6, '0');
    createdDonation = {
      ...donationData,
      id: `DON-${Date.now().toString().slice(-4)}`,
      receiptNumber: `TS-DON-2026-${seq}`,
      date: new Date().toISOString().split('T')[0]
    };
  }

  const donations = getDonations();
  const idx = donations.findIndex(d => d.id === createdDonation.id || d.receiptNumber === createdDonation.receiptNumber);
  if (idx !== -1) {
    donations[idx] = createdDonation;
  } else {
    donations.unshift(createdDonation);
  }
  localStorage.setItem(KEYS.DONATIONS, JSON.stringify(donations));

  addNotification({
    title: 'Donation Received & Receipt Generated',
    message: `Thank you ${donationData.donorName} for donating ₹${donationData.amount}. Receipt #${createdDonation.receiptNumber} generated.`,
    type: 'DONATION',
    recipientMobile: donationData.mobile
  });

  return createdDonation;
};

export const deleteDonation = (id: string): void => {
  const list = getDonations().filter(d => d.id !== id);
  localStorage.setItem(KEYS.DONATIONS, JSON.stringify(list));
  api.deleteDonation(id).catch(err => console.error('Error deleting donation from DB:', err));
};

// --- EVENTS MANAGEMENT ---
export const getEvents = (): EventItem[] => {
  initStorage();
  const data = localStorage.getItem(KEYS.EVENTS);
  return data ? JSON.parse(data) : INITIAL_EVENTS;
};

export const saveEvents = (events: EventItem[]) => {
  localStorage.setItem(KEYS.EVENTS, JSON.stringify(events));
};

export const addEvent = (eventData: Omit<EventItem, 'id' | 'registeredCount'>): EventItem => {
  const events = getEvents();
  const newEvent: EventItem = {
    ...eventData,
    id: `EVT-${Date.now().toString().slice(-4)}`,
    registeredCount: 0
  };
  events.unshift(newEvent);
  localStorage.setItem(KEYS.EVENTS, JSON.stringify(events));

  // Commit event to DB
  api.createEvent(newEvent).catch(err => console.error('Error creating event in DB:', err));

  return newEvent;
};

export const deleteEvent = (id: string): void => {
  const events = getEvents().filter(e => e.id !== id);
  localStorage.setItem(KEYS.EVENTS, JSON.stringify(events));
  api.deleteEvent(id).catch(err => console.error('Error deleting event from DB:', err));
};

// --- NEWS MANAGEMENT ---
export const getNews = (): NewsItem[] => {
  initStorage();
  const data = localStorage.getItem(KEYS.NEWS);
  return data ? JSON.parse(data) : INITIAL_NEWS;
};

export const saveNews = (news: NewsItem[]) => {
  localStorage.setItem(KEYS.NEWS, JSON.stringify(news));
};

export const addNews = (newsData: Omit<NewsItem, 'id' | 'date'>): NewsItem => {
  const news = getNews();
  const newNews: NewsItem = {
    ...newsData,
    id: `NEWS-${Date.now().toString().slice(-4)}`,
    date: new Date().toISOString().split('T')[0]
  };
  news.unshift(newNews);
  localStorage.setItem(KEYS.NEWS, JSON.stringify(news));

  // Commit news to DB
  api.createNews(newNews).catch(err => console.error('Error creating news in DB:', err));

  return newNews;
};

export const deleteNews = (id: string): void => {
  const news = getNews().filter(n => n.id !== id);
  localStorage.setItem(KEYS.NEWS, JSON.stringify(news));
  api.deleteNews(id).catch(err => console.error('Error deleting news from DB:', err));
};

// --- CERTIFICATES MANAGEMENT ---
export const getCertificates = (): CertificateItem[] => {
  initStorage();
  const data = localStorage.getItem(KEYS.CERTIFICATES);
  return data ? JSON.parse(data) : INITIAL_CERTIFICATES;
};

export const saveCertificates = (certs: CertificateItem[]) => {
  localStorage.setItem(KEYS.CERTIFICATES, JSON.stringify(certs));
};

export const addCertificate = (certData: Omit<CertificateItem, 'id' | 'certificateNumber' | 'qrCode'>): CertificateItem => {
  const certs = getCertificates();
  const seq = String(certs.length + 1).padStart(5, '0');
  const certNum = `TS-CERT-2026-${seq}`;
  const newCert: CertificateItem = {
    ...certData,
    id: `CERT-${Date.now().toString().slice(-4)}`,
    certificateNumber: certNum,
    qrCode: `CERT-VERIFIED|${certNum}|${certData.memberName}|${certData.type}`
  };
  certs.unshift(newCert);
  localStorage.setItem(KEYS.CERTIFICATES, JSON.stringify(certs));

  // Commit to DB
  api.createCertificate(newCert).catch(err => console.error('Error creating certificate in DB:', err));

  return newCert;
};

export const deleteCertificate = (id: string): void => {
  const certs = getCertificates().filter(c => c.id !== id);
  localStorage.setItem(KEYS.CERTIFICATES, JSON.stringify(certs));
  api.deleteCertificate(id).catch(err => console.error('Error deleting certificate from DB:', err));
};

// --- CATEGORIES MANAGEMENT ---
export const getCategories = (): MembershipCategory[] => {
  initStorage();
  const data = localStorage.getItem(KEYS.CATEGORIES);
  return data ? JSON.parse(data) : MEMBERSHIP_CATEGORIES;
};

export const updateCategoryFee = (catId: string, newFee: number) => {
  const cats = getCategories();
  const updated = cats.map(c => c.id === catId ? { ...c, fee: newFee } : c);
  localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(updated));

  // Commit fee update to DB
  api.updateCategoryFee(catId, newFee).catch(err => console.error('Error updating fee in DB:', err));
};

// --- NOTIFICATIONS MANAGEMENT ---
export const getNotifications = (): SystemNotification[] => {
  const data = localStorage.getItem(KEYS.NOTIFICATIONS);
  return data ? JSON.parse(data) : [];
};

export const addNotification = (notif: Omit<SystemNotification, 'id' | 'date' | 'isRead'>) => {
  const list = getNotifications();
  const newNotif: SystemNotification = {
    ...notif,
    id: `NOTIF-${Date.now()}`,
    date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    isRead: false
  };
  list.unshift(newNotif);
  localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(list));
};

// --- GALLERY MANAGEMENT ---
export const getGallery = (): GalleryItem[] => {
  initStorage();
  const data = localStorage.getItem(KEYS.GALLERY);
  return data ? JSON.parse(data) : INITIAL_GALLERY;
};

export const saveGallery = (items: GalleryItem[]): void => {
  localStorage.setItem(KEYS.GALLERY, JSON.stringify(items));
};

export const addGalleryItem = (itemData: Omit<GalleryItem, 'id' | 'date'> & { date?: string }): GalleryItem => {
  const gallery = getGallery();
  const newItem: GalleryItem = {
    ...itemData,
    id: `GAL-${Date.now().toString().slice(-4)}`,
    date: itemData.date || new Date().toISOString().split('T')[0]
  };
  gallery.unshift(newItem);
  saveGallery(gallery);

  // Commit to DB
  api.createGalleryItem(newItem).catch(err => console.error('Error creating gallery item in DB:', err));

  return newItem;
};

export const deleteGalleryItem = (id: string): void => {
  const gallery = getGallery().filter(g => g.id !== id);
  saveGallery(gallery);
  api.deleteGalleryItem(id).catch(err => console.error('Error deleting gallery item from DB:', err));
};

// --- PASARAI WINGS MANAGEMENT ---
export const getPasaraiWings = (): Pasarai[] => {
  initStorage();
  const data = localStorage.getItem(KEYS.PASARAI);
  return data ? JSON.parse(data) : PASARAI_WINGS;
};

export const savePasaraiWings = (wings: Pasarai[]): void => {
  localStorage.setItem(KEYS.PASARAI, JSON.stringify(wings));
};

export const addPasaraiWing = (wingData: Omit<Pasarai, 'id' | 'memberCount'> & { memberCount?: number; id?: string }): Pasarai => {
  const wings = getPasaraiWings();
  const seq = String(wings.length + 1).padStart(2, '0');
  const newWing: Pasarai = {
    ...wingData,
    id: wingData.id || `PAS-${seq}`,
    memberCount: wingData.memberCount || 100
  };
  wings.push(newWing);
  savePasaraiWings(wings);

  // Commit to DB
  api.createPasarai(newWing).catch(err => console.error('Error creating wing in DB:', err));

  return newWing;
};

export const deletePasaraiWing = (id: string): void => {
  const wings = getPasaraiWings().filter(w => w.id !== id);
  savePasaraiWings(wings);
  api.deletePasarai(id).catch(err => console.error('Error deleting wing from DB:', err));
};
