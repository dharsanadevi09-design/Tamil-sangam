import type { 
  MemberApplication, 
  DonationRecord, 
  EventItem, 
  NewsItem, 
  CertificateItem, 
  AdminAccount, 
  MembershipCategory, 
  GalleryItem, 
  Pasarai,
  SystemNotification,
  ContactMessage
} from '../types';

const API_BASE = '/api';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.error || `Request failed with status ${response.status}`);
  }

  return response.json();
}

export const api = {
  // Health
  checkHealth: () => request<{ status: string; database: string; stats: any }>('/health'),

  // Auth & OTP
  checkMobile: (mobile: string) =>
    request<{ exists: boolean; member: MemberApplication | null }>(`/members/check-mobile/${encodeURIComponent(mobile)}`),

  sendOtp: (mobile: string, purpose: 'LOGIN' | 'REGISTRATION' = 'LOGIN') =>
    request<{
      success: boolean;
      message: string;
      mobile: string;
      otp: string;
      expiresAt: number;
      isAlreadyRegistered?: boolean;
      existingMember?: MemberApplication | null;
      notRegistered?: boolean;
    }>('/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify({ mobile, purpose })
    }),

  verifyOtp: (mobile: string, otp: string, purpose: 'LOGIN' | 'REGISTRATION' = 'LOGIN') =>
    request<{
      success: boolean;
      message: string;
      isAlreadyRegistered?: boolean;
      member?: MemberApplication | null;
    }>('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ mobile, otp, purpose })
    }),

  memberLogin: (mobile: string, otp?: string) =>
    request<{ success: boolean; member: MemberApplication }>('/auth/member-login', {
      method: 'POST',
      body: JSON.stringify({ mobile, otp })
    }),

  adminLogin: (username: string, password: string) =>
    request<{ success: boolean; admin: AdminAccount }>('/auth/admin-login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    }),

  // Members
  getMembers: (params?: { district?: string; status?: string; search?: string }) => {
    const query = new URLSearchParams();
    if (params?.district) query.set('district', params.district);
    if (params?.status) query.set('status', params.status);
    if (params?.search) query.set('search', params.search);
    const qs = query.toString();
    return request<MemberApplication[]>(`/members${qs ? `?${qs}` : ''}`);
  },

  getMemberById: (id: string) =>
    request<MemberApplication>(`/members/${encodeURIComponent(id)}`),

  createMember: (data: Partial<MemberApplication>) =>
    request<{ success: boolean; message: string; member: MemberApplication }>('/members', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  approveMember: (id: string) =>
    request<{ success: boolean; message: string; member: MemberApplication }>(`/members/${encodeURIComponent(id)}/approve`, {
      method: 'PUT'
    }),

  rejectMember: (id: string, reason: string) =>
    request<{ success: boolean; message: string; member: MemberApplication }>(`/members/${encodeURIComponent(id)}/reject`, {
      method: 'PUT',
      body: JSON.stringify({ reason })
    }),

  deleteMember: (id: string) =>
    request<{ success: boolean; message: string }>(`/members/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    }),

  // Donations
  getDonations: () => request<DonationRecord[]>('/donations'),

  createDonation: (data: Partial<DonationRecord>) =>
    request<{ success: boolean; message: string; donation: DonationRecord }>('/donations', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  deleteDonation: (id: string) =>
    request<{ success: boolean; message: string }>(`/donations/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    }),

  // Events
  getEvents: () => request<EventItem[]>('/events'),

  createEvent: (data: Partial<EventItem>) =>
    request<EventItem>('/events', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  deleteEvent: (id: string) =>
    request<{ success: boolean; message: string }>(`/events/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    }),

  // News
  getNews: () => request<NewsItem[]>('/news'),

  createNews: (data: Partial<NewsItem>) =>
    request<NewsItem>('/news', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  deleteNews: (id: string) =>
    request<{ success: boolean; message: string }>(`/news/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    }),

  // Certificates
  getCertificates: () => request<CertificateItem[]>('/certificates'),

  createCertificate: (data: Partial<CertificateItem>) =>
    request<CertificateItem>('/certificates', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  deleteCertificate: (id: string) =>
    request<{ success: boolean; message: string }>(`/certificates/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    }),

  // Admins
  getAdmins: () => request<AdminAccount[]>('/admins'),

  createAdmin: (data: Partial<AdminAccount>) =>
    request<AdminAccount>('/admins', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  deleteAdmin: (id: string) =>
    request<{ success: boolean; message: string }>(`/admins/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    }),

  // Categories
  getCategories: () => request<MembershipCategory[]>('/categories'),

  updateCategoryFee: (id: string, fee: number) =>
    request<{ success: boolean; message: string }>(`/categories/${encodeURIComponent(id)}/fee`, {
      method: 'PUT',
      body: JSON.stringify({ fee })
    }),

  // Gallery
  getGallery: () => request<GalleryItem[]>('/gallery'),

  createGalleryItem: (data: Partial<GalleryItem>) =>
    request<GalleryItem>('/gallery', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  deleteGalleryItem: (id: string) =>
    request<{ success: boolean; message: string }>(`/gallery/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    }),

  // Pasarai Wings
  getPasarai: () => request<Pasarai[]>('/pasarai'),

  createPasarai: (data: Partial<Pasarai>) =>
    request<Pasarai>('/pasarai', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  deletePasarai: (id: string) =>
    request<{ success: boolean; message: string }>(`/pasarai/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    }),

  // Notifications & Audit Message Logs
  getNotifications: (params?: { mobile?: string; role?: string }) => {
    const query = new URLSearchParams();
    if (params?.mobile) query.set('mobile', params.mobile);
    if (params?.role) query.set('role', params.role);
    const qs = query.toString();
    return request<SystemNotification[]>(`/notifications${qs ? `?${qs}` : ''}`);
  },

  markNotificationRead: (id: string) =>
    request<{ success: boolean; message: string }>(`/notifications/${encodeURIComponent(id)}/read`, {
      method: 'PUT'
    }),

  getMessageLogs: () =>
    request<Array<{
      id: string;
      recipient: string;
      recipientType: string;
      channel: string;
      subject: string;
      message: string;
      status: string;
      createdAt: string;
    }>>('/messages/logs'),

  // Contact Messages & Inquiries
  sendContactMessage: (data: { name: string; mobile: string; email?: string; district: string; message: string }) =>
    request<{ success: boolean; message: string; id: string }>('/contact', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  getContactMessages: () =>
    request<ContactMessage[]>('/contact'),

  resolveContactMessage: (id: string) =>
    request<{ success: boolean; message: string }>(`/contact/${encodeURIComponent(id)}/resolve`, {
      method: 'PUT'
    }),

  deleteContactMessage: (id: string) =>
    request<{ success: boolean; message: string }>(`/contact/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    })
};
