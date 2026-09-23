import type { MemberApplication, DonationRecord, EventItem, CertificateItem, NewsItem, SystemNotification, MembershipCategory } from '../types';
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
};

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
};

export const getMembers = (): MemberApplication[] => {
  initStorage();
  const data = localStorage.getItem(KEYS.MEMBERS);
  return data ? JSON.parse(data) : INITIAL_MEMBERS;
};

export const saveMembers = (members: MemberApplication[]) => {
  localStorage.setItem(KEYS.MEMBERS, JSON.stringify(members));
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

  members[index] = {
    ...members[index],
    status: 'APPROVED',
    membershipNumber: memNum,
    joiningDate: today,
    validityDate: validityStr,
    qrCodeData: `VERIFIED|${memNum}|${members[index].fullName}|${members[index].district}|${members[index].categoryName}`
  };

  saveMembers(members);

  addNotification({
    title: 'Membership Approved!',
    message: `Congratulations ${members[index].fullName}! Your Membership ID is ${memNum}. Your Digital ID card is ready.`,
    type: 'MEMBERSHIP',
    recipientMobile: members[index].mobile
  });

  return members[index];
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

// News
export const getNews = (): NewsItem[] => {
  initStorage();
  const data = localStorage.getItem(KEYS.NEWS);
  return data ? JSON.parse(data) : INITIAL_NEWS;
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
