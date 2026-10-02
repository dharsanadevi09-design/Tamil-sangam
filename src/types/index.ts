export type MembershipStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED';

export type AdminRole = 
  | 'SUPER_ADMIN' 
  | 'STATE_ADMIN' 
  | 'DISTRICT_ADMIN' 
  | 'TALUK_ADMIN' 
  | 'FINANCE_ADMIN' 
  | 'MEMBERSHIP_ADMIN' 
  | 'EVENT_ADMIN' 
  | 'CONTENT_ADMIN';

export interface AdminAccount {
  id: string;
  name: string;
  username: string;
  password: string;
  role: AdminRole;
  district: string; // 'ALL' for Super Admin or specific district name like 'Madurai'
  createdAt: string;
}

export interface MembershipCategory {
  id: string;
  name: string;
  nameTamil: string;
  fee: number;
  validityMonths: number;
  description: string;
}

export interface District {
  id: string;
  name: string;
  nameTamil: string;
  totalMembers: number;
  totalTaluks: number;
}

export interface Pasarai {
  id: string;
  name: string;
  nameTamil: string;
  description: string;
  descriptionTamil: string;
  officeBearers: { title: string; name: string; mobile: string }[];
  memberCount: number;
  icon: string;
  category: string;
  image?: string;
}

export interface MemberApplication {
  id: string;
  mobileVerified: boolean;
  
  // Personal Info
  fullName: string;
  nameTamil: string;
  dob: string;
  gender: string;
  guardianName: string;
  occupation: string;
  education: string;
  bloodGroup?: string;

  // Contact Info
  mobile: string;
  whatsapp: string;
  email: string;
  altMobile?: string;

  // Address Details
  doorNo: string;
  street: string;
  village: string;
  postOffice: string;
  taluk: string;
  district: string;
  state: string;
  pincode: string;
  country: string;

  // Identity Verification
  aadhaarNumber: string;
  aadhaarDocUrl: string; // Simulated secure document URL
  photoUrl: string;

  // Category & Unit
  categoryId: string;
  categoryName: string;
  pasaraiId: string;
  pasaraiName: string;

  // Payment Details
  paymentMethod: string;
  paymentAmount: number;
  paymentTransactionId: string;
  paymentDate: string;

  // Status & Membership Output
  status: MembershipStatus;
  membershipNumber?: string;
  joiningDate?: string;
  validityDate?: string;
  rejectionReason?: string;
  qrCodeData?: string;
}

export interface DonationRecord {
  id: string;
  receiptNumber: string;
  donorName: string;
  mobile: string;
  whatsapp: string;
  email: string;
  address: string;
  amount: number;
  purpose: string;
  paymentMethod: string;
  transactionId: string;
  date: string;
}

export interface EventItem {
  id: string;
  title: string;
  titleTamil: string;
  date: string;
  time: string;
  venue: string;
  district: string;
  description: string;
  registrationFee: number;
  maxParticipants: number;
  registeredCount: number;
  bannerUrl: string;
  pasaraiId?: string;
}

export interface EventRegistration {
  id: string;
  eventId: string;
  eventTitle: string;
  memberName: string;
  memberMobile: string;
  memberEmail: string;
  ticketsCount: number;
  amountPaid: number;
  registrationDate: string;
  qrCode: string;
}

export interface CertificateItem {
  id: string;
  certificateNumber: string;
  memberId: string;
  memberName: string;
  title: string;
  type: 'PARTICIPATION' | 'APPRECIATION' | 'VOLUNTEER' | 'EVENT' | 'HONORARY';
  issueDate: string;
  issuedBy: string;
  description: string;
  qrCode: string;
}

export interface NewsItem {
  id: string;
  title: string;
  titleTamil: string;
  category: 'News' | 'Press Release' | 'Announcement' | 'Circular' | 'Public Notice';
  date: string;
  summary: string;
  content: string;
  imageUrl?: string;
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  date: string;
  type: 'MEMBERSHIP' | 'DONATION' | 'EVENT' | 'SYSTEM';
  recipientMobile?: string;
  isRead: boolean;
}
