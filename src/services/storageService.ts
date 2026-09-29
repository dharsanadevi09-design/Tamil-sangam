import type { MemberApplication, DonationRecord, EventItem, CertificateItem, NewsItem, SystemNotification, MembershipCategory, AdminAccount } from '../types';
import { INITIAL_MEMBERS, INITIAL_DONATIONS, INITIAL_EVENTS, INITIAL_NEWS, INITIAL_CERTIFICATES, MEMBERSHIP_CATEGORIES } from '../data/mockData';

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
};

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

// Initialize LocalStorage with mock data if missing
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
};

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
  return newAdmin;
};

export const deleteAdminAccount = (id: string): void => {
  const admins = getAdminAccounts().filter(a => a.id !== id);
  saveAdminAccounts(admins);
};

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
  return newMember;
};

export const addMemberApplication = (app: Omit<MemberApplication, 'id' | 'status'>): MemberApplication => {
  const members = getMembers();
  const newApp: MemberApplication = {
    ...app,
    id: `APP-${Date.now().toString().slice(-4)}`,
    status: 'PENDING',
  };
  members.unshift(newApp);
  saveMembers(members);
  
  addNotification({
    title: 'New Membership Application Submitted',
    message: `Application from ${app.fullName} (${app.district}) received and pending Admin approval.`,
    type: 'MEMBERSHIP',
    recipientMobile: app.mobile
  });

  return newApp;
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
    title: 'Membership Approved!',
    message: `Congratulations ${approvedMember.fullName}! Your Membership ID is ${memNum}. Your Digital ID card is ready.`,
    type: 'MEMBERSHIP',
    recipientMobile: approvedMember.mobile
  });

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
  return members[index];
};

// Donations
export const getDonations = (): DonationRecord[] => {
  initStorage();
  const data = localStorage.getItem(KEYS.DONATIONS);
  return data ? JSON.parse(data) : INITIAL_DONATIONS;
};

export const addDonation = (donationData: Omit<DonationRecord, 'id' | 'receiptNumber' | 'date'>): DonationRecord => {
  const donations = getDonations();
  const seq = String(donations.length + 1).padStart(6, '0');
  const receiptNum = `TS-DON-2026-${seq}`;
  const newDonation: DonationRecord = {
    ...donationData,
    id: `DON-${Date.now().toString().slice(-4)}`,
    receiptNumber: receiptNum,
    date: new Date().toISOString().split('T')[0]
  };
  donations.unshift(newDonation);
  localStorage.setItem(KEYS.DONATIONS, JSON.stringify(donations));

  addNotification({
    title: 'Donation Received & Receipt Generated',
    message: `Thank you ${donationData.donorName} for donating ₹${donationData.amount}. Receipt #${receiptNum} generated.`,
    type: 'DONATION',
    recipientMobile: donationData.mobile
  });

  return newDonation;
};

export const deleteDonation = (id: string): void => {
  const list = getDonations().filter(d => d.id !== id);
  localStorage.setItem(KEYS.DONATIONS, JSON.stringify(list));
};

// Events
export const getEvents = (): EventItem[] => {
  initStorage();
  const data = localStorage.getItem(KEYS.EVENTS);
  return data ? JSON.parse(data) : INITIAL_EVENTS;
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
  return newEvent;
};

export const deleteEvent = (id: string): void => {
  const events = getEvents().filter(e => e.id !== id);
  localStorage.setItem(KEYS.EVENTS, JSON.stringify(events));
};

// News
export const getNews = (): NewsItem[] => {
  initStorage();
  const data = localStorage.getItem(KEYS.NEWS);
  return data ? JSON.parse(data) : INITIAL_NEWS;
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
  return newNews;
};

export const deleteNews = (id: string): void => {
  const news = getNews().filter(n => n.id !== id);
  localStorage.setItem(KEYS.NEWS, JSON.stringify(news));
};

// Certificates
export const getCertificates = (): CertificateItem[] => {
  initStorage();
  const data = localStorage.getItem(KEYS.CERTIFICATES);
  return data ? JSON.parse(data) : INITIAL_CERTIFICATES;
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
  return newCert;
};

export const deleteCertificate = (id: string): void => {
  const certs = getCertificates().filter(c => c.id !== id);
  localStorage.setItem(KEYS.CERTIFICATES, JSON.stringify(certs));
};

// Categories
export const getCategories = (): MembershipCategory[] => {
  initStorage();
  const data = localStorage.getItem(KEYS.CATEGORIES);
  return data ? JSON.parse(data) : MEMBERSHIP_CATEGORIES;
};

export const updateCategoryFee = (catId: string, newFee: number) => {
  const cats = getCategories();
  const updated = cats.map(c => c.id === catId ? { ...c, fee: newFee } : c);
  localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(updated));
};

// Notifications
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
