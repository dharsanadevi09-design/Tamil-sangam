import React, { useState } from 'react';
import type { MemberApplication, AdminRole, EventItem, NewsItem, CertificateItem, AdminAccount, GalleryItem, Pasarai } from '../../types';
import { 
  getMembers, approveMemberApplication, rejectMemberApplication, deleteMember,
  getDonations, deleteDonation,
  getEvents, addEvent, deleteEvent,
  getNews, addNews, deleteNews,
  getCertificates, addCertificate, deleteCertificate,
  getAdminAccounts, addAdminAccount, deleteAdminAccount,
  getGallery, addGalleryItem, deleteGalleryItem,
  getPasaraiWings, addPasaraiWing, deletePasaraiWing
} from '../../services/storageService';
import { TN_DISTRICTS, PASARAI_WINGS } from '../../data/mockData';
import { 
  Shield, Users, Heart, CheckCircle2, XCircle, Search, Download, Plus, Trash2, 
  Calendar, Newspaper, Award, UserPlus, Lock, Eye, MapPin, Crown, Landmark, X,
  Image as ImageIcon, Layers, Upload
} from 'lucide-react';

interface AdminDashboardProps {
  onCloseAdmin: () => void;
  onVerifyQrCode: (membershipNumber: string) => void;
  currentLang: 'en' | 'ta';
  currentAdmin?: AdminAccount | null;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onCloseAdmin,
  currentAdmin
}) => {
  const [activeAdminTab, setActiveAdminTab] = useState<'MEMBERS' | 'PENDING' | 'EVENTS' | 'NEWS' | 'GALLERY' | 'WINGS' | 'CERTIFICATES' | 'DONATIONS' | 'REPORTS' | 'ADMINS'>('MEMBERS');
  const [membersList, setMembersList] = useState<MemberApplication[]>(getMembers());
  const [eventsList, setEventsList] = useState<EventItem[]>(getEvents());
  const [newsList, setNewsList] = useState<NewsItem[]>(getNews());
  const [certList, setCertList] = useState<CertificateItem[]>(getCertificates());
  const [donationsList, setDonationsList] = useState(getDonations());
  const [adminAccountsList, setAdminAccountsList] = useState<AdminAccount[]>(getAdminAccounts());
  const [galleryList, setGalleryList] = useState<GalleryItem[]>(getGallery());
  const [wingsList, setWingsList] = useState<Pasarai[]>(getPasaraiWings());

  const [inspectMember, setInspectMember] = useState<MemberApplication | null>(null);
  const [zoomedAadhaarUrl, setZoomedAadhaarUrl] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  
  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrictFilter, setSelectedDistrictFilter] = useState('ALL');
  const [selectedPasaraiFilter, setSelectedPasaraiFilter] = useState('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('ALL');
  const [galleryCategoryFilter, setGalleryCategoryFilter] = useState('ALL');
  const [wingsCategoryFilter, setWingsCategoryFilter] = useState('ALL');

  // District Admin Scoping Logic
  const adminRole: AdminRole = currentAdmin?.role || 'SUPER_ADMIN';
  const adminDistrict = currentAdmin?.district || 'ALL';
  const isSuperAdmin = adminRole === 'SUPER_ADMIN' || adminRole === 'STATE_ADMIN';
  const isDistrictAdmin = adminRole === 'DISTRICT_ADMIN';

  const effectiveDistrictFilter = isDistrictAdmin ? adminDistrict : selectedDistrictFilter;

  // Form Modal States for District Admin Creation
  const [isAddAdminOpen, setIsAddAdminOpen] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    name: '',
    username: '',
    password: '',
    role: 'DISTRICT_ADMIN' as AdminRole,
    district: TN_DISTRICTS[0].name
  });

  // Form Modal States for Events, News, Certificates
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [newEvent, setNewEvent] = useState<Omit<EventItem, 'id' | 'registeredCount'>>({
    title: '',
    titleTamil: '',
    date: new Date().toISOString().split('T')[0],
    time: '10:00 AM',
    venue: 'Sangam Auditorium',
    district: isDistrictAdmin ? adminDistrict : 'Chennai',
    description: '',
    registrationFee: 0,
    maxParticipants: 500,
    bannerUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80'
  });

  const [isAddNewsOpen, setIsAddNewsOpen] = useState(false);
  const [newNews, setNewNews] = useState<Omit<NewsItem, 'id' | 'date'>>({
    title: '',
    titleTamil: '',
    category: 'Press Release',
    summary: '',
    content: '',
    imageUrl: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=600&q=80'
  });

  const [isAddCertOpen, setIsAddCertOpen] = useState(false);
  const [newCert, setNewCert] = useState<Omit<CertificateItem, 'id' | 'certificateNumber' | 'qrCode'>>({
    memberName: '',
    memberId: 'TS-TN-2026-000101',
    title: 'Official Membership Appreciation Certificate',
    type: 'APPRECIATION',
    issueDate: new Date().toISOString().split('T')[0],
    issuedBy: isDistrictAdmin ? `${adminDistrict} District HQ` : 'Tamil Sangam State HQ',
    description: 'In recognition of outstanding contribution to Tamil Sangam digital portal.'
  });

  // Form Modal States for Gallery and Wings Management
  const [isAddGalleryOpen, setIsAddGalleryOpen] = useState(false);
  const [newGalleryItem, setNewGalleryItem] = useState({
    title: '',
    titleTamil: '',
    category: 'Events',
    img: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const [isAddWingOpen, setIsAddWingOpen] = useState(false);
  const [newWing, setNewWing] = useState({
    name: '',
    nameTamil: '',
    category: 'Youth & Sports',
    description: '',
    descriptionTamil: '',
    img: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80',
    memberCount: 150,
    presidentName: '',
    presidentContact: '',
    secretaryName: '',
    secretaryContact: ''
  });

  const refreshAllData = () => {
    setMembersList(getMembers());
    setEventsList(getEvents());
    setNewsList(getNews());
    setCertList(getCertificates());
    setDonationsList(getDonations());
    setAdminAccountsList(getAdminAccounts());
    setGalleryList(getGallery());
    setWingsList(getPasaraiWings());
  };

  const handleApprove = (appId: string) => {
    const targetMember = membersList.find(m => m.id === appId);
    if (isSuperAdmin) {
      alert(`Super Admin Notice:\nSuper Admin cannot accept/approve member applications directly.\n\nOnly the assigned District Admin of ${targetMember?.district || 'that'} district can accept applications and generate Membership IDs.`);
      return;
    }
    const updated = approveMemberApplication(appId);
    if (updated) {
      refreshAllData();
      setInspectMember(null);
    }
  };

  const handleReject = (appId: string) => {
    const reason = rejectionReason || window.prompt('Enter reason for rejection / நிராகரிப்பதற்கான காரணம்:', 'Incomplete documents / ஆவணங்கள் முழுமையாக இல்லை');
    if (!reason) return;
    const updated = rejectMemberApplication(appId, reason);
    if (updated) {
      refreshAllData();
      setInspectMember(null);
      setRejectionReason('');
    }
  };

  const handleDeleteMember = (appId: string) => {
    if (window.confirm('Are you sure you want to delete this member record?')) {
      deleteMember(appId);
      refreshAllData();
      if (inspectMember?.id === appId) setInspectMember(null);
    }
  };

  // Add District Admin (Super Admin Feature)
  const handleCreateAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdmin.name || !newAdmin.username || !newAdmin.password) return;
    addAdminAccount({
      name: newAdmin.name,
      username: newAdmin.username.toLowerCase().trim(),
      password: newAdmin.password,
      role: newAdmin.role,
      district: newAdmin.district
    });
    refreshAllData();
    setIsAddAdminOpen(false);
    setNewAdmin({
      name: '',
      username: '',
      password: '',
      role: 'DISTRICT_ADMIN',
      district: TN_DISTRICTS[0].name
    });
  };

  const handleDeleteAdminAccount = (id: string) => {
    if (window.confirm('Delete this District Admin account?')) {
      deleteAdminAccount(id);
      refreshAllData();
    }
  };

  // Add Event
  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.titleTamil) return;
    addEvent(newEvent);
    refreshAllData();
    setIsAddEventOpen(false);
  };

  const handleDeleteEvent = (id: string) => {
    if (window.confirm('Delete this event listing?')) {
      deleteEvent(id);
      refreshAllData();
    }
  };

  // Add News
  const handleCreateNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNews.title || !newNews.titleTamil) return;
    addNews(newNews);
    refreshAllData();
    setIsAddNewsOpen(false);
  };

  const handleDeleteNewsItem = (id: string) => {
    if (window.confirm('Delete this news announcement?')) {
      deleteNews(id);
      refreshAllData();
    }
  };

  // Add Certificate
  const handleCreateCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCert.memberName) return;
    addCertificate(newCert);
    refreshAllData();
    setIsAddCertOpen(false);
  };

  const handleDeleteCertItem = (id: string) => {
    if (window.confirm('Delete this certificate?')) {
      deleteCertificate(id);
      refreshAllData();
    }
  };

  const handleDeleteDonationItem = (id: string) => {
    if (window.confirm('Delete this donation entry?')) {
      deleteDonation(id);
      refreshAllData();
    }
  };

  // Gallery Handlers
  const handleCreateGallery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGalleryItem.title || !newGalleryItem.img) {
      alert('Please provide a title and image!');
      return;
    }
    addGalleryItem({
      title: newGalleryItem.title,
      titleTamil: newGalleryItem.titleTamil || newGalleryItem.title,
      category: newGalleryItem.category,
      img: newGalleryItem.img,
      description: newGalleryItem.description,
      date: newGalleryItem.date
    });
    refreshAllData();
    setIsAddGalleryOpen(false);
    setNewGalleryItem({
      title: '',
      titleTamil: '',
      category: 'Events',
      img: '',
      description: '',
      date: new Date().toISOString().split('T')[0]
    });
  };

  const handleDeleteGallery = (id: string) => {
    if (window.confirm('Are you sure you want to delete this gallery photo?')) {
      deleteGalleryItem(id);
      refreshAllData();
    }
  };

  const handleGalleryImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewGalleryItem(prev => ({ ...prev, img: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Wings (Pasarai) Handlers
  const handleCreateWing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWing.name || !newWing.nameTamil) {
      alert('Please provide wing name in English and Tamil!');
      return;
    }
    const officeBearers = [];
    if (newWing.presidentName.trim()) {
      officeBearers.push({
        title: 'President / தலைவர்',
        name: newWing.presidentName.trim(),
        mobile: newWing.presidentContact.trim()
      });
    }
    if (newWing.secretaryName.trim()) {
      officeBearers.push({
        title: 'Secretary / செயலாளர்',
        name: newWing.secretaryName.trim(),
        mobile: newWing.secretaryContact.trim()
      });
    }

    addPasaraiWing({
      name: newWing.name,
      nameTamil: newWing.nameTamil,
      category: newWing.category,
      description: newWing.description || `${newWing.name} dedicated to Tamil Sangam initiatives.`,
      descriptionTamil: newWing.descriptionTamil || `${newWing.nameTamil} தமிழ் சங்கத்தின் பிரத்யேகப் பிரிவு.`,
      icon: 'Shield',
      memberCount: Number(newWing.memberCount) || 100,
      officeBearers
    });
    refreshAllData();
    setIsAddWingOpen(false);
    setNewWing({
      name: '',
      nameTamil: '',
      category: 'Youth & Sports',
      description: '',
      descriptionTamil: '',
      img: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80',
      memberCount: 150,
      presidentName: '',
      presidentContact: '',
      secretaryName: '',
      secretaryContact: ''
    });
  };

  const handleDeleteWing = (id: string) => {
    if (window.confirm('Are you sure you want to delete this wing?')) {
      deletePasaraiWing(id);
      refreshAllData();
    }
  };

  // SCOPED MEMBERS & METRICS FILTERING
  const scopedMembersList = isDistrictAdmin
    ? membersList.filter(m => m.district === adminDistrict)
    : membersList;

  const filteredMembers = scopedMembersList.filter(m => {
    const matchesSearch = 
      (m.membershipNumber && m.membershipNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      m.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.nameTamil.includes(searchQuery) ||
      m.mobile.includes(searchQuery) ||
      m.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDistrict = effectiveDistrictFilter === 'ALL' || m.district === effectiveDistrictFilter;
    const matchesPasarai = selectedPasaraiFilter === 'ALL' || m.pasaraiId === selectedPasaraiFilter || m.pasaraiName === selectedPasaraiFilter;
    const matchesStatus = selectedStatusFilter === 'ALL' || m.status === selectedStatusFilter;

    return matchesSearch && matchesDistrict && matchesPasarai && matchesStatus;
  });

  const pendingMembers = scopedMembersList.filter(m => m.status === 'PENDING');
  const approvedMembers = scopedMembersList.filter(m => m.status === 'APPROVED');
  const totalDonationSum = donationsList.reduce((acc, d) => acc + d.amount, 0);

  const handleExportCSV = () => {
    const headers = ['ID', 'MembershipNumber', 'FullName', 'Mobile', 'District', 'Pasarai', 'Category', 'Status', 'JoiningDate'];
    const rows = filteredMembers.map(m => [
      m.id,
      m.membershipNumber || '',
      `"${m.fullName}"`,
      m.mobile,
      m.district,
      `"${m.pasaraiName}"`,
      m.categoryName,
      m.status,
      m.joiningDate || ''
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Tamil_Sangam_Members_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-[#FAF8F5] dark:bg-slate-950 text-slate-900 dark:text-gray-100 min-h-screen py-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Top Admin Header Bar */}
      <div className="bg-gradient-to-r from-[#72151C] via-[#8B1E26] to-[#72151C] text-white rounded-2xl p-6 shadow-xl mb-8 border border-amber-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-400 text-[#72151C] text-xs font-black px-2.5 py-0.5 rounded uppercase shadow">
              ADMIN WORKBENCH
            </span>
            <span className="text-xs text-amber-200 font-bold flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-amber-300" />
              {isSuperAdmin ? (
                <span className="inline-flex items-center gap-1">
                  <Crown className="w-3.5 h-3.5 text-amber-300" />
                  <span>Super Admin Access (State HQ)</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1">
                  <Landmark className="w-3.5 h-3.5 text-amber-300" />
                  <span>District Admin Portal ({adminDistrict})</span>
                </span>
              )}
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-white mt-1 font-heading">
            {isDistrictAdmin ? `${adminDistrict} District Admin Dashboard` : 'State & District Admin Management Portal'}
          </h2>
          {currentAdmin && (
            <p className="text-xs text-amber-100/90 mt-0.5">
              Logged in as: <strong className="text-white underline">{currentAdmin.name}</strong> (@{currentAdmin.username})
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onCloseAdmin}
            className="bg-white/10 hover:bg-white/20 text-white border border-white/25 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow cursor-pointer flex items-center gap-1.5"
          >
            <Lock className="w-3.5 h-3.5 text-amber-300" />
            <span>Logout Admin</span>
          </button>
        </div>
      </div>

      {/* District Admin Role Scope Alert Banner */}
      {isDistrictAdmin && (
        <div className="bg-[#FDF2F2] dark:bg-red-950/40 border-2 border-[#8B1E26]/40 text-slate-900 dark:text-red-100 rounded-xl p-4 mb-6 text-xs flex items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#8B1E26] shrink-0" />
            <div>
              <span className="font-extrabold text-sm flex items-center gap-1.5 text-[#8B1E26] dark:text-red-300">
                <Lock className="w-4 h-4" />
                <span>District Restricted Access: {adminDistrict} District</span>
              </span>
              <p className="text-slate-700 dark:text-slate-300 mt-0.5">
                You are assigned to manage members and approvals exclusively for <strong>{adminDistrict}</strong> district. All lists and metrics below are filtered to your assigned district.
              </p>
            </div>
          </div>
          <span className="bg-[#8B1E26] text-white font-bold px-3 py-1 rounded-lg shrink-0 shadow">
            {scopedMembersList.length} Members in {adminDistrict}
          </span>
        </div>
      )}

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-white dark:bg-[#1E232B] p-4 rounded-xl border border-slate-200/90 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 dark:text-gray-400 text-xs">
            <span>{isDistrictAdmin ? `${adminDistrict} Members` : 'Total Members'}</span>
            <Users className="w-4 h-4 text-[#8B1E26] dark:text-red-400" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{scopedMembersList.length}</p>
        </div>

        <div className="bg-[#FDF2F2] dark:bg-red-950/30 p-4 rounded-xl border border-[#8B1E26]/30 shadow-sm">
          <div className="flex items-center justify-between text-[#8B1E26] dark:text-red-300 text-xs font-bold">
            <span>Pending Approvals</span>
            <Shield className="w-4 h-4 text-[#8B1E26] dark:text-red-400 animate-pulse" />
          </div>
          <p className="text-2xl font-extrabold text-[#8B1E26] dark:text-red-300 mt-1">{pendingMembers.length}</p>
        </div>

        <div className="bg-white dark:bg-[#1E232B] p-4 rounded-xl border border-slate-200/90 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 dark:text-gray-400 text-xs">
            <span>Approved Members</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">{approvedMembers.length}</p>
        </div>

        <div className="bg-white dark:bg-[#1E232B] p-4 rounded-xl border border-slate-200/90 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 dark:text-gray-400 text-xs">
            <span>Total Donations</span>
            <Heart className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">₹{totalDonationSum.toLocaleString()}</p>
        </div>

        <div className="bg-white dark:bg-[#1E232B] p-4 rounded-xl border border-slate-200/90 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 dark:text-gray-400 text-xs">
            <span>{isDistrictAdmin ? 'Assigned District' : 'Active TN Districts'}</span>
            <MapPin className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
            {isDistrictAdmin ? adminDistrict : '38 TN Districts'}
          </p>
        </div>
      </div>

      {/* Admin Tabs Bar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-gray-800 pb-3 mb-6 text-xs font-bold">
        {[
          { id: 'MEMBERS', label: 'Members Directory', badge: scopedMembersList.length },
          { id: 'PENDING', label: 'Pending Queue', badge: pendingMembers.length, highlight: true },
          { id: 'EVENTS', label: 'Events Manager', badge: eventsList.length },
          { id: 'NEWS', label: 'News & Media', badge: newsList.length },
          { id: 'GALLERY', label: 'Gallery Manager', badge: galleryList.length },
          { id: 'WINGS', label: 'Wings Manager', badge: wingsList.length },
          { id: 'CERTIFICATES', label: 'Certificates Manager', badge: certList.length },
          { id: 'DONATIONS', label: 'Donation Ledger', badge: donationsList.length },
          { id: 'REPORTS', label: 'Reports & Analytics' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveAdminTab(tab.id as any)}
            className={`px-3.5 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer font-bold ${
              activeAdminTab === tab.id
                ? 'bg-[#8B1E26] text-white shadow-md border border-[#72151C]'
                : 'bg-white dark:bg-[#1E232B] text-slate-700 dark:text-gray-200 hover:bg-[#FDF2F2] dark:hover:bg-slate-800 hover:text-[#8B1E26] border border-slate-200 dark:border-gray-700'
            }`}
          >
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                activeAdminTab === tab.id
                  ? 'bg-amber-400 text-[#72151C]'
                  : tab.highlight
                  ? 'bg-[#8B1E26] text-white'
                  : 'bg-slate-100 dark:bg-gray-800 text-slate-700 dark:text-gray-300'
              }`}>
                {tab.badge}
              </span>
            )}
          </button>
        ))}

        {/* Super Admin Special Tab: District Admins Management */}
        {isSuperAdmin && (
          <button
            onClick={() => setActiveAdminTab('ADMINS')}
            className={`px-3.5 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer ml-auto font-extrabold ${
              activeAdminTab === 'ADMINS'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md ring-2 ring-amber-400'
                : 'bg-[#8B1E26]/10 text-[#8B1E26] dark:text-amber-300 hover:bg-[#8B1E26]/20 border border-[#8B1E26]/30'
            }`}
          >
            <UserPlus className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>District Admins Manager ({adminAccountsList.length})</span>
          </button>
        )}
      </div>

      {/* TAB 1: MEMBERS DIRECTORY */}
      {activeAdminTab === 'MEMBERS' && (
        <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-200 space-y-6">
          
          {/* Filters Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search ID, Name, Mobile..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-yellow-400 text-slate-950"
              />
            </div>

            <div>
              <select
                disabled={isDistrictAdmin}
                value={effectiveDistrictFilter}
                onChange={(e) => setSelectedDistrictFilter(e.target.value)}
                className={`w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-semibold text-slate-950 ${
                  isDistrictAdmin ? 'opacity-80 cursor-not-allowed border-amber-400 bg-amber-50' : ''
                }`}
              >
                {isDistrictAdmin ? (
                  <option value={adminDistrict}>District Locked: {adminDistrict}</option>
                ) : (
                  <>
                    <option value="ALL">All Districts (38)</option>
                    {TN_DISTRICTS.map(d => (
                      <option key={d.id} value={d.name}>{d.nameTamil} ({d.name})</option>
                    ))}
                  </>
                )}
              </select>
            </div>

            <div>
              <select
                value={selectedPasaraiFilter}
                onChange={(e) => setSelectedPasaraiFilter(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-semibold text-slate-950"
              >
                <option value="ALL">All 23 Pasarai Wings</option>
                {PASARAI_WINGS.map(p => (
                  <option key={p.id} value={p.id}>{p.nameTamil}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedStatusFilter}
                onChange={(e) => setSelectedStatusFilter(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-semibold text-slate-950"
              >
                <option value="ALL">All Status</option>
                <option value="APPROVED">Approved Only</option>
                <option value="PENDING">Pending Only</option>
                <option value="REJECTED">Rejected Only</option>
              </select>

              <button
                onClick={handleExportCSV}
                className="bg-emerald-700 hover:bg-emerald-600 text-white font-bold p-2.5 rounded-lg flex items-center justify-center shrink-0 cursor-pointer shadow"
                title="Export Members to CSV"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Members Table */}
          <div className="overflow-x-auto border border-slate-200 dark:border-gray-800 rounded-xl shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#8B1E26] text-white uppercase text-[10px] tracking-wider font-extrabold">
                <tr>
                  <th className="p-3">Member / App ID</th>
                  <th className="p-3">Name & Details</th>
                  <th className="p-3">District</th>
                  <th className="p-3">Wing (Pasarai)</th>
                  <th className="p-3">Aadhaar Doc</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-gray-800 text-slate-800 dark:text-gray-200 font-semibold">
                {filteredMembers.map((m) => (
                  <tr key={m.id} className="hover:bg-amber-50/50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="p-3 font-mono font-extrabold text-[#8B1E26] dark:text-amber-400">
                      {m.membershipNumber || m.id}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <img src={m.photoUrl} alt="" className="w-9 h-11 rounded object-cover border border-amber-400 shrink-0" />
                        <div>
                          <p className="font-extrabold text-slate-900 dark:text-white">{m.fullName}</p>
                          <p className="text-[11px] text-slate-500 dark:text-gray-400">{m.nameTamil} • +91 {m.mobile}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 font-bold">{m.district}</td>
                    <td className="p-3 text-slate-600 dark:text-gray-300">{m.pasaraiName}</td>
                    <td className="p-3 font-mono text-[11px]">
                      {m.aadhaarDocUrl ? (
                        <span className="text-emerald-700 font-bold bg-emerald-50 border border-emerald-300 px-2 py-0.5 rounded flex items-center gap-1 w-fit">
                          <CheckCircle2 className="w-3 h-3" /> Uploaded
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">No file</span>
                      )}
                    </td>
                    <td className="p-3">
                      <span className={`px-2.5 py-1 rounded text-[10px] font-black ${
                        m.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' :
                        m.status === 'PENDING' ? 'bg-amber-100 text-amber-900 border border-yellow-400' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {m.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => setInspectMember(m)}
                        className="bg-[#8B1E26] hover:bg-[#72151C] text-white font-extrabold px-3.5 py-1.5 rounded-lg text-xs cursor-pointer shadow-sm hover:shadow transition-all"
                      >
                        Inspect / Verify
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: PENDING APPROVAL QUEUE */}
      {activeAdminTab === 'PENDING' && (
        <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-200 space-y-6">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">
                Pending Applications Queue ({pendingMembers.length})
              </h3>
              <p className="text-xs text-slate-500">Review uploaded Aadhaar documents and issue digital membership numbers.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingMembers.map((app) => (
              <div key={app.id} className="border border-slate-200 rounded-xl p-5 bg-slate-50 hover:border-yellow-400 transition-all space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img src={app.photoUrl} alt="" className="w-14 h-16 rounded-lg object-cover border-2 border-yellow-400 shadow-sm" />
                    <div>
                      <h4 className="font-extrabold text-base text-slate-900">{app.fullName}</h4>
                      <p className="text-xs text-amber-700 font-bold">{app.nameTamil}</p>
                      <p className="text-xs text-slate-600">Mobile: +91 {app.mobile}</p>
                    </div>
                  </div>
                  <span className="bg-amber-400 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded">
                    PENDING
                  </span>
                </div>

                <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs space-y-1">
                  <p><strong className="text-slate-900">District:</strong> {app.district}</p>
                  <p><strong className="text-slate-900">Pasarai Wing:</strong> {app.pasaraiName}</p>
                  <p><strong className="text-slate-900">Aadhaar Number:</strong> {app.aadhaarNumber}</p>
                  <p><strong className="text-slate-900">Category:</strong> {app.categoryName} (₹{app.paymentAmount})</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setInspectMember(app)}
                    className="flex-1 bg-[#8B1E26] hover:bg-[#72151C] text-white font-extrabold py-2.5 rounded-lg text-xs uppercase tracking-wide cursor-pointer text-center shadow transition-all"
                  >
                    Inspect Aadhaar & Verify
                  </button>
                  {isDistrictAdmin ? (
                    <button
                      onClick={() => handleApprove(app.id)}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-4 py-2.5 rounded-lg text-xs cursor-pointer shadow"
                    >
                      Approve & Generate ID
                    </button>
                  ) : (
                    <span className="bg-slate-200 dark:bg-gray-800 text-slate-700 dark:text-gray-300 text-[10px] font-extrabold px-3 py-2 rounded-lg border border-slate-300 dark:border-gray-700 inline-flex items-center gap-1" title={`Only ${app.district} District Admin can approve`}>
                      <Lock className="w-3 h-3 text-slate-600" />
                      <span>{app.district} Admin Approval Required</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 8: SUPER ADMIN DISTRICT ADMINS MANAGER */}
      {activeAdminTab === 'ADMINS' && isSuperAdmin && (
        <div className="bg-white dark:bg-[#1E232B] rounded-2xl p-6 shadow-xl border border-slate-200 dark:border-gray-800 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-gray-800 pb-4">
            <div>
              <span className="text-xs font-bold text-[#8B1E26] dark:text-amber-400 bg-red-50 dark:bg-red-950/40 px-2.5 py-1 rounded uppercase border border-[#8B1E26]/20">
                SUPER ADMIN CONTROL
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-2 font-heading">
                District Admins Management / மாவட்ட நிர்வாகிகள்
              </h3>
              <p className="text-xs text-slate-500 dark:text-gray-400">Create and assign district-specific admin accounts with scoped access controls.</p>
            </div>

            <button
              onClick={() => setIsAddAdminOpen(true)}
              className="bg-[#8B1E26] hover:bg-[#72151C] text-white font-extrabold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow cursor-pointer uppercase tracking-wider transition-all"
            >
              <UserPlus className="w-4 h-4 text-amber-300" />
              <span>+ Create District Admin</span>
            </button>
          </div>

          <div className="overflow-x-auto border border-slate-200 dark:border-gray-800 rounded-xl shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#8B1E26] text-white uppercase text-[10px] tracking-wider font-extrabold">
                <tr>
                  <th className="p-3">Admin ID</th>
                  <th className="p-3">Admin Name</th>
                  <th className="p-3">Username</th>
                  <th className="p-3">Assigned Role</th>
                  <th className="p-3">Assigned District</th>
                  <th className="p-3">Created Date</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-gray-800 text-slate-800 dark:text-gray-200 font-semibold">
                {adminAccountsList.map((acc) => (
                  <tr key={acc.id} className="hover:bg-amber-50/50">
                    <td className="p-3 font-mono text-amber-700 font-extrabold">{acc.id}</td>
                    <td className="p-3 font-extrabold text-slate-900">{acc.name}</td>
                    <td className="p-3 font-mono font-bold text-slate-600">@{acc.username}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                        acc.role === 'SUPER_ADMIN' ? 'bg-amber-100 text-amber-900 border border-yellow-400' : 'bg-blue-100 text-blue-900'
                      }`}>
                        {acc.role}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300">
                        {acc.district}
                      </span>
                    </td>
                    <td className="p-3 text-slate-500">{acc.createdAt}</td>
                    <td className="p-3 text-right">
                      {acc.role !== 'SUPER_ADMIN' && (
                        <button
                          onClick={() => handleDeleteAdminAccount(acc.id)}
                          className="text-red-600 hover:text-red-800 font-bold p-1.5 hover:bg-red-50 rounded"
                          title="Delete Admin Account"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: EVENTS MANAGER */}
      {activeAdminTab === 'EVENTS' && (
        <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-200 space-y-6">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">Events Management</h3>
              <p className="text-xs text-slate-500">Publish conventions and youth meets.</p>
            </div>
            <button
              onClick={() => setIsAddEventOpen(true)}
              className="bg-[#8B1E26] hover:bg-[#72151C] text-white font-extrabold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow transition-all"
            >
              <Plus className="w-4 h-4 text-amber-300" /> Add Event Listing
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {eventsList.map((evt) => (
              <div key={evt.id} className="border border-slate-200 dark:border-gray-800 rounded-xl p-4 flex gap-4 bg-slate-50 dark:bg-slate-900">
                <img src={evt.bannerUrl} alt="" className="w-24 h-24 rounded-lg object-cover shrink-0" />
                <div className="flex-1 space-y-1 text-xs">
                  <span className="bg-[#8B1E26] text-amber-300 font-bold px-2 py-0.5 rounded text-[10px]">
                    {evt.district} District
                  </span>
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-sm mt-1">{evt.titleTamil}</h4>
                  <p className="text-slate-600 dark:text-gray-300">{evt.title}</p>
                  <p className="text-[#8B1E26] dark:text-amber-400 font-semibold">Date: {evt.date} • Venue: {evt.venue}</p>
                  <button
                    onClick={() => handleDeleteEvent(evt.id)}
                    className="text-red-600 hover:text-red-800 font-bold text-[11px] pt-1 block cursor-pointer"
                  >
                    Delete Event
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: NEWS & MEDIA */}
      {activeAdminTab === 'NEWS' && (
        <div className="bg-white dark:bg-[#1E232B] rounded-2xl p-6 shadow-xl border border-slate-200 dark:border-gray-800 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-gray-800 pb-4">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white font-heading">News & Press Releases</h3>
              <p className="text-xs text-slate-500 dark:text-gray-400">Publish official announcements and circulars.</p>
            </div>
            <button
              onClick={() => setIsAddNewsOpen(true)}
              className="bg-[#8B1E26] hover:bg-[#72151C] text-white font-extrabold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow transition-all"
            >
              <Plus className="w-4 h-4 text-amber-300" /> Publish Press Release
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {newsList.map((news) => (
              <div key={news.id} className="border border-slate-200 dark:border-gray-800 rounded-xl p-4 flex gap-4 bg-slate-50 dark:bg-slate-900">
                <img src={news.imageUrl} alt="" className="w-24 h-24 rounded-lg object-cover shrink-0" />
                <div className="flex-1 space-y-1 text-xs">
                  <span className="bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800 font-bold px-2 py-0.5 rounded text-[10px]">
                    {news.category}
                  </span>
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-sm mt-1">{news.titleTamil}</h4>
                  <p className="text-slate-600 dark:text-gray-300 line-clamp-2">{news.summary}</p>
                  <button
                    onClick={() => handleDeleteNewsItem(news.id)}
                    className="text-red-600 hover:text-red-800 font-bold text-[11px] pt-1 block cursor-pointer"
                  >
                    Delete Announcement
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: CERTIFICATES MANAGER */}
      {activeAdminTab === 'CERTIFICATES' && (
        <div className="bg-white dark:bg-[#1E232B] rounded-2xl p-6 shadow-xl border border-slate-200 dark:border-gray-800 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-gray-800 pb-4">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white font-heading">Certificates & Awards</h3>
              <p className="text-xs text-slate-500 dark:text-gray-400">Issue official certificates with QR code verification.</p>
            </div>
            <button
              onClick={() => setIsAddCertOpen(true)}
              className="bg-[#8B1E26] hover:bg-[#72151C] text-white font-extrabold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow transition-all"
            >
              <Plus className="w-4 h-4 text-amber-300" /> Issue Certificate
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {certList.map((cert) => (
              <div key={cert.id} className="border border-slate-200 dark:border-gray-800 rounded-xl p-4 bg-slate-50 dark:bg-slate-900 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-extrabold text-[#8B1E26] dark:text-amber-400">{cert.certificateNumber}</span>
                  <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">
                    {cert.type}
                  </span>
                </div>
                <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">{cert.memberName}</h4>
                <p className="text-slate-600 dark:text-gray-300">{cert.title}</p>
                <p className="text-slate-500 dark:text-gray-400 text-[11px]">Issued by: {cert.issuedBy} • Date: {cert.issueDate}</p>
                <button
                  onClick={() => handleDeleteCertItem(cert.id)}
                  className="text-red-600 hover:text-red-800 font-bold text-[11px] pt-1 block cursor-pointer"
                >
                  Delete Certificate
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: DONATION LEDGER */}
      {activeAdminTab === 'DONATIONS' && (
        <div className="bg-white dark:bg-[#1E232B] rounded-2xl p-6 shadow-xl border border-slate-200 dark:border-gray-800 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-gray-800 pb-4">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white font-heading">Donation & Receipt Ledger</h3>
              <p className="text-xs text-slate-500 dark:text-gray-400">Track all public donations and issued receipts.</p>
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-200 dark:border-gray-800 rounded-xl shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#8B1E26] text-white uppercase text-[10px] tracking-wider font-extrabold">
                <tr>
                  <th className="p-3">Receipt #</th>
                  <th className="p-3">Donor Name</th>
                  <th className="p-3">Mobile</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Purpose</th>
                  <th className="p-3">Date</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-gray-800 text-slate-800 dark:text-gray-200 font-semibold">
                {donationsList.map((d) => (
                  <tr key={d.id} className="hover:bg-amber-50/50 dark:hover:bg-gray-800/50">
                    <td className="p-3 font-mono font-extrabold text-[#8B1E26] dark:text-amber-400">{d.receiptNumber}</td>
                    <td className="p-3 font-extrabold text-slate-900 dark:text-white">{d.donorName}</td>
                    <td className="p-3">+91 {d.mobile}</td>
                    <td className="p-3 font-extrabold text-emerald-700 dark:text-emerald-400">₹{d.amount}</td>
                    <td className="p-3 text-slate-600 dark:text-gray-300">{d.purpose}</td>
                    <td className="p-3 text-slate-500 dark:text-gray-400">{d.date}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleDeleteDonationItem(d.id)}
                        className="text-red-600 hover:text-red-800 font-bold p-1 hover:bg-red-50 dark:hover:bg-red-950/30 rounded cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 7: GALLERY MANAGER */}
      {activeAdminTab === 'GALLERY' && (
        <div className="bg-white dark:bg-[#1E232B] rounded-2xl p-6 shadow-xl border border-slate-200 dark:border-gray-800 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-gray-800 pb-4">
            <div>
              <span className="text-xs font-bold text-[#8B1E26] dark:text-amber-400 bg-red-50 dark:bg-red-950/40 px-2.5 py-1 rounded uppercase border border-[#8B1E26]/20">
                MEDIA & GALLERIES
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1 font-heading">
                Gallery Photos Manager / புகைப்படங்கள் மேலாண்மை ({galleryList.length})
              </h3>
              <p className="text-xs text-slate-500 dark:text-gray-400">Add, organize, and publish photos for the public gallery and homepage.</p>
            </div>

            <button
              onClick={() => setIsAddGalleryOpen(true)}
              className="bg-[#8B1E26] hover:bg-[#72151C] text-white font-extrabold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow cursor-pointer uppercase tracking-wider transition-all"
            >
              <Plus className="w-4 h-4 text-amber-300" />
              <span>+ Add Photo / புகைப்படம் சேர்க்க</span>
            </button>
          </div>

          {/* Category Filter Chips */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {['ALL', 'Events', 'Culture', 'Welfare', 'District', 'Pasarai'].map((cat) => (
              <button
                key={cat}
                onClick={() => setGalleryCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  galleryCategoryFilter === cat
                    ? 'bg-[#8B1E26] text-white shadow'
                    : 'bg-slate-100 dark:bg-gray-800 text-slate-700 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat === 'ALL' ? 'All Photos' : cat}
              </button>
            ))}
          </div>

          {/* Photo Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {galleryList
              .filter(item => galleryCategoryFilter === 'ALL' || item.category.toLowerCase() === galleryCategoryFilter.toLowerCase())
              .map((item) => (
                <div key={item.id} className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-gray-800 rounded-xl overflow-hidden group shadow-sm hover:shadow-md transition-all flex flex-col">
                  <div className="relative aspect-[4/3] bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    <img
                      src={item.img}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80';
                      }}
                    />
                    <span className="absolute top-2 left-2 bg-slate-950/80 text-amber-300 text-[10px] font-extrabold px-2 py-0.5 rounded shadow">
                      {item.category}
                    </span>
                    <span className="absolute bottom-2 right-2 bg-slate-950/70 text-white text-[10px] font-mono px-1.5 py-0.5 rounded">
                      {item.date}
                    </span>
                  </div>

                  <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
                    <div>
                      <h4 className="font-extrabold text-sm text-[#8B1E26] dark:text-red-400 font-heading line-clamp-1">
                        {item.titleTamil || item.title}
                      </h4>
                      <p className="text-xs text-slate-700 dark:text-gray-300 font-medium line-clamp-1">
                        {item.title}
                      </p>
                      {item.description && (
                        <p className="text-[11px] text-slate-500 dark:text-gray-400 line-clamp-2 mt-1">
                          {item.description}
                        </p>
                      )}
                    </div>

                    <div className="pt-2 border-t border-slate-200 dark:border-gray-800 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 font-mono">{item.id}</span>
                      <button
                        onClick={() => handleDeleteGallery(item.id)}
                        className="text-red-600 hover:text-red-700 text-xs font-bold flex items-center gap-1 cursor-pointer hover:bg-red-50 dark:hover:bg-red-950/30 px-2 py-1 rounded transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {galleryList.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              <ImageIcon className="w-12 h-12 mx-auto mb-3 text-slate-400" />
              <p className="text-sm font-bold">No gallery photos uploaded yet.</p>
              <button
                onClick={() => setIsAddGalleryOpen(true)}
                className="mt-3 bg-[#8B1E26] text-white px-4 py-2 rounded-xl text-xs font-bold"
              >
                + Add First Photo
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 8: WINGS (PASARAI) MANAGER */}
      {activeAdminTab === 'WINGS' && (
        <div className="bg-white dark:bg-[#1E232B] rounded-2xl p-6 shadow-xl border border-slate-200 dark:border-gray-800 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-gray-800 pb-4">
            <div>
              <span className="text-xs font-bold text-[#8B1E26] dark:text-amber-400 bg-red-50 dark:bg-red-950/40 px-2.5 py-1 rounded uppercase border border-[#8B1E26]/20">
                WINGS & DEPARTMENTS
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1 font-heading">
                Specialized Wings (Pasarai) Manager / பாசறைகள் மேலாண்மை ({wingsList.length})
              </h3>
              <p className="text-xs text-slate-500 dark:text-gray-400">Add, configure, and manage Tamil Sangam specialized action wings and office bearers.</p>
            </div>

            <button
              onClick={() => setIsAddWingOpen(true)}
              className="bg-[#8B1E26] hover:bg-[#72151C] text-white font-extrabold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow cursor-pointer uppercase tracking-wider transition-all"
            >
              <Plus className="w-4 h-4 text-amber-300" />
              <span>+ Add New Wing / புதிய பாசறை சேர்க்க</span>
            </button>
          </div>

          {/* Category Filter Chips */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {['ALL', 'Youth & Sports', 'Culture & Arts', 'Welfare & Social', 'Education & Students', 'Literary & Research', 'Professional & IT', 'Women & Development'].map((cat) => (
              <button
                key={cat}
                onClick={() => setWingsCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  wingsCategoryFilter === cat
                    ? 'bg-[#8B1E26] text-white shadow'
                    : 'bg-slate-100 dark:bg-gray-800 text-slate-700 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat === 'ALL' ? 'All Wings' : cat}
              </button>
            ))}
          </div>

          {/* Wings Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {wingsList
              .filter(w => wingsCategoryFilter === 'ALL' || w.category.toLowerCase().includes(wingsCategoryFilter.toLowerCase()))
              .map((wing) => (
                <div key={wing.id} className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-gray-800 rounded-xl p-5 space-y-4 hover:border-[#8B1E26]/40 transition-all flex flex-col justify-between shadow-sm">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <span className="bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded">
                        {wing.category}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-slate-400">
                        {wing.id}
                      </span>
                    </div>

                    <h4 className="font-extrabold text-base text-[#8B1E26] dark:text-red-400 font-heading">
                      {wing.nameTamil}
                    </h4>
                    <p className="text-xs font-bold text-slate-800 dark:text-white">
                      {wing.name}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-gray-300 line-clamp-2">
                      {wing.descriptionTamil || wing.description}
                    </p>

                    <div className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-gray-300 font-bold bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-200 dark:border-gray-700">
                      <Users className="w-3.5 h-3.5 text-[#8B1E26] dark:text-amber-400" />
                      <span>{wing.memberCount || 100} Registered Members</span>
                    </div>

                    {wing.officeBearers && wing.officeBearers.length > 0 && (
                      <div className="bg-amber-50/60 dark:bg-gray-800/60 p-2.5 rounded-lg border border-amber-200 dark:border-gray-700 text-xs space-y-1">
                        <span className="text-[10px] font-extrabold uppercase text-[#8B1E26] dark:text-amber-300 block">
                          Office Bearers / நிர்வாகிகள்:
                        </span>
                        {wing.officeBearers.map((b, bIdx) => (
                          <div key={bIdx} className="flex justify-between text-[11px] text-slate-700 dark:text-gray-300">
                            <span className="font-bold">{b.title}:</span>
                            <span>{b.name} {b.mobile ? `(+91 ${b.mobile})` : ''}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-200 dark:border-gray-800 flex items-center justify-between">
                    <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Active Wing
                    </span>
                    <button
                      onClick={() => handleDeleteWing(wing.id)}
                      className="text-red-600 hover:text-red-700 text-xs font-bold flex items-center gap-1 cursor-pointer hover:bg-red-50 dark:hover:bg-red-950/30 px-2 py-1 rounded transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Wing</span>
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* TAB 9: REPORTS & ANALYTICS */}
      {activeAdminTab === 'REPORTS' && (
        <div className="bg-white dark:bg-[#1E232B] rounded-2xl p-6 shadow-xl border border-slate-200 dark:border-gray-800 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-gray-800 pb-4">
            <div>
              <span className="text-xs font-bold text-[#8B1E26] dark:text-amber-400 bg-red-50 dark:bg-red-950/40 px-2.5 py-1 rounded uppercase border border-[#8B1E26]/20">
                STATE HQ ANALYTICS
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1 font-heading">
                Reports & Membership Analytics / அறிக்கைகள்
              </h3>
              <p className="text-xs text-slate-500 dark:text-gray-400">Comprehensive overview of memberships, district distribution, donations, and wings.</p>
            </div>

            <button
              onClick={handleExportCSV}
              className="bg-emerald-700 hover:bg-emerald-600 text-white font-extrabold px-4 py-2 rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow transition-all"
            >
              <Download className="w-4 h-4" /> Export All Data (CSV)
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-50 dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-gray-800 space-y-2">
              <span className="text-xs font-bold text-slate-500 dark:text-gray-400">Verification Rate</span>
              <p className="text-3xl font-extrabold text-[#8B1E26] dark:text-red-400">
                {scopedMembersList.length > 0 ? Math.round((approvedMembers.length / scopedMembersList.length) * 100) : 0}%
              </p>
              <p className="text-xs text-slate-600 dark:text-gray-400">{approvedMembers.length} of {scopedMembersList.length} verified</p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-gray-800 space-y-2">
              <span className="text-xs font-bold text-slate-500 dark:text-gray-400">Total Funds Mobilized</span>
              <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                ₹{totalDonationSum.toLocaleString()}
              </p>
              <p className="text-xs text-slate-600 dark:text-gray-400">From {donationsList.length} recorded donations</p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-gray-800 space-y-2">
              <span className="text-xs font-bold text-slate-500 dark:text-gray-400">Active Pasarai Wings</span>
              <p className="text-3xl font-extrabold text-amber-600 dark:text-amber-400">
                {wingsList.length} Wings
              </p>
              <p className="text-xs text-slate-600 dark:text-gray-400">Operating across 38 TN districts</p>
            </div>
          </div>

          {/* District Breakdown */}
          <div className="bg-slate-50 dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-gray-800 space-y-4">
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">District-wise Membership Distribution</h4>
            <div className="space-y-3">
              {['Chennai', 'Madurai', 'Coimbatore', 'Tiruchirappalli', 'Salem'].map((dist) => {
                const count = scopedMembersList.filter(m => m.district === dist).length;
                const pct = scopedMembersList.length > 0 ? Math.round((count / scopedMembersList.length) * 100) : 0;
                return (
                  <div key={dist} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-800 dark:text-gray-200">{dist}</span>
                      <span className="text-slate-500">{count} Members ({pct}%)</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-gray-800 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-[#8B1E26] h-full rounded-full transition-all" style={{ width: `${Math.max(5, pct)}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* CREATE EVENT MODAL */}
      {isAddEventOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative my-8 text-slate-900">
            <button onClick={() => setIsAddEventOpen(false)} className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-extrabold mb-4 border-b pb-2 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-600" />
              <span>Add Event Listing</span>
            </h3>

            <form onSubmit={handleCreateEvent} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold mb-1">Event Title (English) *</label>
                <input
                  type="text"
                  required
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  placeholder="e.g. State Level Youth Tamil Meet 2026"
                  className="w-full p-2.5 bg-slate-50 border rounded-lg font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">நிகழ்ச்சி தலைப்பு (தமிழில்) *</label>
                <input
                  type="text"
                  required
                  value={newEvent.titleTamil}
                  onChange={(e) => setNewEvent({ ...newEvent, titleTamil: e.target.value })}
                  placeholder="எ.கா. மாநில இளைஞர் தமிழ் மாநாடு 2026"
                  className="w-full p-2.5 bg-slate-50 border rounded-lg font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Event Date *</label>
                  <input
                    type="date"
                    required
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border rounded-lg font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">District *</label>
                  <select
                    disabled={isDistrictAdmin}
                    value={newEvent.district}
                    onChange={(e) => setNewEvent({ ...newEvent, district: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border rounded-lg font-semibold"
                  >
                    {TN_DISTRICTS.map(d => (
                      <option key={d.id} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">Venue Address *</label>
                <input
                  type="text"
                  required
                  value={newEvent.venue}
                  onChange={(e) => setNewEvent({ ...newEvent, venue: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border rounded-lg font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Description *</label>
                <textarea
                  rows={3}
                  required
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  placeholder="Event details..."
                  className="w-full p-2.5 bg-slate-50 border rounded-lg font-semibold"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#8B1E26] hover:bg-[#72151C] text-white font-extrabold py-3 rounded-xl uppercase tracking-wider text-xs shadow-md cursor-pointer transition-all"
              >
                PUBLISH EVENT LISTING
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CREATE NEWS MODAL */}
      {isAddNewsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative my-8 text-slate-900">
            <button onClick={() => setIsAddNewsOpen(false)} className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-extrabold mb-4 border-b pb-2 flex items-center gap-2">
              <Newspaper className="w-5 h-5 text-amber-600" />
              <span>Publish News / Press Release</span>
            </h3>

            <form onSubmit={handleCreateNews} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold mb-1">News Title (English) *</label>
                <input
                  type="text"
                  required
                  value={newNews.title}
                  onChange={(e) => setNewNews({ ...newNews, title: e.target.value })}
                  placeholder="e.g. State Level Tamil Sangam Convention"
                  className="w-full p-2.5 bg-slate-50 border rounded-lg font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">செய்தி தலைப்பு (தமிழில்) *</label>
                <input
                  type="text"
                  required
                  value={newNews.titleTamil}
                  onChange={(e) => setNewNews({ ...newNews, titleTamil: e.target.value })}
                  placeholder="எ.கா. மாநில அளவிலான தமிழ் சங்க மாநாடு"
                  className="w-full p-2.5 bg-slate-50 border rounded-lg font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Summary *</label>
                <textarea
                  rows={2}
                  required
                  value={newNews.summary}
                  onChange={(e) => setNewNews({ ...newNews, summary: e.target.value })}
                  placeholder="Summary..."
                  className="w-full p-2.5 bg-slate-50 border rounded-lg font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Full Content *</label>
                <textarea
                  rows={3}
                  required
                  value={newNews.content}
                  onChange={(e) => setNewNews({ ...newNews, content: e.target.value })}
                  placeholder="Full details..."
                  className="w-full p-2.5 bg-slate-50 border rounded-lg font-semibold"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#8B1E26] hover:bg-[#72151C] text-white font-extrabold py-3 rounded-xl uppercase tracking-wider text-xs shadow-md cursor-pointer transition-all"
              >
                PUBLISH PRESS RELEASE
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CREATE CERTIFICATE MODAL */}
      {isAddCertOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative my-8 text-slate-900">
            <button onClick={() => setIsAddCertOpen(false)} className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-extrabold mb-4 border-b pb-2 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-600" />
              <span>Issue Official Certificate</span>
            </h3>

            <form onSubmit={handleCreateCertificate} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold mb-1">Member Name *</label>
                <input
                  type="text"
                  required
                  value={newCert.memberName}
                  onChange={(e) => setNewCert({ ...newCert, memberName: e.target.value })}
                  placeholder="e.g. Sundaram Ramachandran"
                  className="w-full p-2.5 bg-slate-50 border rounded-lg font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Certificate Type *</label>
                <select
                  value={newCert.type}
                  onChange={(e) => setNewCert({ ...newCert, type: e.target.value as any })}
                  className="w-full p-2.5 bg-slate-50 border rounded-lg font-semibold"
                >
                  <option value="APPRECIATION">Appreciation Certificate</option>
                  <option value="PARTICIPATION">Participation Certificate</option>
                  <option value="VOLUNTEER">Volunteer Service Certificate</option>
                  <option value="EVENT">Event Honor Certificate</option>
                  <option value="HONORARY">Honorary Sangam Title</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-[#8B1E26] hover:bg-[#72151C] text-white font-extrabold py-3 rounded-xl uppercase tracking-wider text-xs shadow-md cursor-pointer transition-all"
              >
                ISSUE CERTIFICATE & QR CODE
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CREATE DISTRICT ADMIN MODAL (SUPER ADMIN ONLY) */}
      {isAddAdminOpen && isSuperAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative my-8 text-slate-900">
            <button onClick={() => setIsAddAdminOpen(false)} className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-extrabold mb-4 border-b pb-2 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-amber-600" />
              <span>Create New District Admin / மாவட்ட நிர்வாகி உருவாக்கல்</span>
            </h3>

            <form onSubmit={handleCreateAdmin} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold mb-1">Admin Full Name *</label>
                <input
                  type="text"
                  required
                  value={newAdmin.name}
                  onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                  placeholder="e.g. Madurai District Admin Lead"
                  className="w-full p-2.5 bg-slate-50 border rounded-lg font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Login Username *</label>
                <input
                  type="text"
                  required
                  value={newAdmin.username}
                  onChange={(e) => setNewAdmin({ ...newAdmin, username: e.target.value })}
                  placeholder="e.g. maduraiadmin"
                  className="w-full p-2.5 bg-slate-50 border rounded-lg font-semibold font-mono"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Password *</label>
                <input
                  type="password"
                  required
                  value={newAdmin.password}
                  onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                  placeholder="Password..."
                  className="w-full p-2.5 bg-slate-50 border rounded-lg font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Assign District / மாவட்டம் *</label>
                <select
                  value={newAdmin.district}
                  onChange={(e) => setNewAdmin({ ...newAdmin, district: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border rounded-lg font-semibold"
                >
                  {TN_DISTRICTS.map(d => (
                    <option key={d.id} value={d.name}>{d.nameTamil} ({d.name})</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-[#8B1E26] hover:bg-[#72151C] text-white font-extrabold py-3 rounded-xl uppercase tracking-wider text-xs shadow-md cursor-pointer mt-4 transition-all"
              >
                CREATE DISTRICT ADMIN ACCOUNT
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ADD GALLERY PHOTO MODAL */}
      {isAddGalleryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-[#1E232B] rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-gray-800 relative my-8 text-slate-900 dark:text-white">
            <button onClick={() => setIsAddGalleryOpen(false)} className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 dark:hover:text-gray-200 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-extrabold mb-4 border-b border-slate-200 dark:border-gray-800 pb-2 flex items-center gap-2 font-heading">
              <ImageIcon className="w-5 h-5 text-[#8B1E26] dark:text-amber-400" />
              <span>Add Gallery Photo / புதிய புகைப்படம் சேர்க்க</span>
            </h3>

            <form onSubmit={handleCreateGallery} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold mb-1">Photo Title (English) *</label>
                <input
                  type="text"
                  required
                  value={newGalleryItem.title}
                  onChange={(e) => setNewGalleryItem({ ...newGalleryItem, title: e.target.value })}
                  placeholder="e.g. State Member Conference 2026"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg font-semibold text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">புகைப்படத் தலைப்பு (தமிழில்) *</label>
                <input
                  type="text"
                  required
                  value={newGalleryItem.titleTamil}
                  onChange={(e) => setNewGalleryItem({ ...newGalleryItem, titleTamil: e.target.value })}
                  placeholder="எ.கா. மாநில உறுப்பினர்கள் மாநாடு 2026"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg font-semibold text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Category *</label>
                  <select
                    value={newGalleryItem.category}
                    onChange={(e) => setNewGalleryItem({ ...newGalleryItem, category: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg font-semibold text-slate-900 dark:text-white"
                  >
                    <option value="Events">Events / நிகழ்வுகள்</option>
                    <option value="Culture">Culture / கலை & பண்பாடு</option>
                    <option value="Welfare">Welfare / மக்கள் நலம்</option>
                    <option value="District">District / மாவட்ட நிகழ்வுகள்</option>
                    <option value="Pasarai">Pasarai / பாசறைச் செயல்பாடுகள்</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={newGalleryItem.date}
                    onChange={(e) => setNewGalleryItem({ ...newGalleryItem, date: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg font-semibold text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Photo Upload or URL input */}
              <div className="space-y-2">
                <label className="block font-bold">Photo Image (Upload File or Enter URL) *</label>
                
                <div className="flex items-center gap-2">
                  <label className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-amber-50 dark:bg-slate-800 border-2 border-dashed border-amber-400 rounded-lg cursor-pointer hover:bg-amber-100/50 transition-colors">
                    <Upload className="w-4 h-4 text-[#8B1E26] dark:text-amber-400" />
                    <span className="font-bold text-slate-800 dark:text-gray-200">Upload From Device</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleGalleryImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="relative">
                  <input
                    type="url"
                    placeholder="Or enter image URL (https://...)"
                    value={newGalleryItem.img}
                    onChange={(e) => setNewGalleryItem({ ...newGalleryItem, img: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg font-semibold text-slate-900 dark:text-white"
                  />
                </div>

                {newGalleryItem.img && (
                  <div className="mt-2 relative rounded-lg overflow-hidden border border-amber-400 max-h-40 bg-slate-100 flex items-center justify-center">
                    <img src={newGalleryItem.img} alt="Preview" className="max-h-40 object-cover w-full" />
                    <span className="absolute bottom-1 right-2 bg-slate-900/80 text-white text-[10px] px-2 py-0.5 rounded font-bold">Image Preview</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block font-bold mb-1">Short Description (Optional)</label>
                <textarea
                  rows={2}
                  value={newGalleryItem.description}
                  onChange={(e) => setNewGalleryItem({ ...newGalleryItem, description: e.target.value })}
                  placeholder="Photo details or occasion..."
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg font-semibold text-slate-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#8B1E26] hover:bg-[#72151C] text-white font-extrabold py-3 rounded-xl uppercase tracking-wider text-xs shadow-md transition-all cursor-pointer mt-2"
              >
                PUBLISH PHOTO TO GALLERY / புகைப்படத்தை பதிவேற்றுக
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ADD PASARAI WING MODAL */}
      {isAddWingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-[#1E232B] rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-gray-800 relative my-8 text-slate-900 dark:text-white">
            <button onClick={() => setIsAddWingOpen(false)} className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 dark:hover:text-gray-200 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-extrabold mb-4 border-b border-slate-200 dark:border-gray-800 pb-2 flex items-center gap-2 font-heading">
              <Layers className="w-5 h-5 text-[#8B1E26] dark:text-amber-400" />
              <span>Create New Pasarai Wing / புதிய பாசறை உருவாக்குதல்</span>
            </h3>

            <form onSubmit={handleCreateWing} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Wing Name (English) *</label>
                  <input
                    type="text"
                    required
                    value={newWing.name}
                    onChange={(e) => setNewWing({ ...newWing, name: e.target.value })}
                    placeholder="e.g. Environmental Protection Wing"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg font-semibold text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">பாசறை பெயர் (தமிழில்) *</label>
                  <input
                    type="text"
                    required
                    value={newWing.nameTamil}
                    onChange={(e) => setNewWing({ ...newWing, nameTamil: e.target.value })}
                    placeholder="எ.கா. சுற்றுச்சூழல் பாதுகாப்புப் பாசறை"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg font-semibold text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Category *</label>
                  <select
                    value={newWing.category}
                    onChange={(e) => setNewWing({ ...newWing, category: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg font-semibold text-slate-900 dark:text-white"
                  >
                    <option value="Youth & Sports">Youth & Sports / இளைஞர் & விளையாட்டு</option>
                    <option value="Culture & Arts">Culture & Arts / கலை & பண்பாடு</option>
                    <option value="Welfare & Social">Welfare & Social / மக்கள் நலம்</option>
                    <option value="Education & Students">Education & Students / கல்வி & மாணவர்</option>
                    <option value="Literary & Research">Literary & Research / இலக்கியம் & ஆய்வு</option>
                    <option value="Professional & IT">Professional & IT / தொழில் & தகவல் தொழில்நுட்பம்</option>
                    <option value="Women & Development">Women & Development / மகளிர் மேம்பாடு</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold mb-1">Initial Member Count</label>
                  <input
                    type="number"
                    value={newWing.memberCount}
                    onChange={(e) => setNewWing({ ...newWing, memberCount: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg font-semibold text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">Description (English)</label>
                <textarea
                  rows={2}
                  value={newWing.description}
                  onChange={(e) => setNewWing({ ...newWing, description: e.target.value })}
                  placeholder="Goals and activities of this wing..."
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg font-semibold text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">விளக்கம் (தமிழில்)</label>
                <textarea
                  rows={2}
                  value={newWing.descriptionTamil}
                  onChange={(e) => setNewWing({ ...newWing, descriptionTamil: e.target.value })}
                  placeholder="பாசறையின் நோக்கங்கள் மற்றும் செயல்பாடுகள்..."
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg font-semibold text-slate-900 dark:text-white"
                />
              </div>

              {/* Office Bearers Input */}
              <div className="bg-amber-50/70 dark:bg-gray-800/70 p-3 rounded-xl border border-amber-200 dark:border-gray-700 space-y-3">
                <span className="font-extrabold text-xs text-[#8B1E26] dark:text-amber-400 block">
                  Office Bearers / முக்கிய பொறுப்பாளர்கள் (Optional):
                </span>
                
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="President Name / தலைவர் பெயர்"
                    value={newWing.presidentName}
                    onChange={(e) => setNewWing({ ...newWing, presidentName: e.target.value })}
                    className="p-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded font-semibold text-slate-900 dark:text-white"
                  />
                  <input
                    type="tel"
                    placeholder="President Mobile / அலைபேசி"
                    value={newWing.presidentContact}
                    onChange={(e) => setNewWing({ ...newWing, presidentContact: e.target.value })}
                    className="p-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded font-semibold text-slate-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Secretary Name / செயலாளர் பெயர்"
                    value={newWing.secretaryName}
                    onChange={(e) => setNewWing({ ...newWing, secretaryName: e.target.value })}
                    className="p-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded font-semibold text-slate-900 dark:text-white"
                  />
                  <input
                    type="tel"
                    placeholder="Secretary Mobile / அலைபேசி"
                    value={newWing.secretaryContact}
                    onChange={(e) => setNewWing({ ...newWing, secretaryContact: e.target.value })}
                    className="p-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded font-semibold text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#8B1E26] hover:bg-[#72151C] text-white font-extrabold py-3 rounded-xl uppercase tracking-wider text-xs shadow-md transition-all cursor-pointer mt-2"
              >
                CREATE PASARAI WING / பாசறை உருவாக்குக
              </button>
            </form>
          </div>
        </div>
      )}

      {/* INSPECT MODAL (Secure Aadhaar Image View & Approval Workflow) */}
      {inspectMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8 relative text-slate-900">
            <button onClick={() => setInspectMember(null)} className="absolute right-4 top-4 text-slate-400 hover:text-slate-700">
              <XCircle className="w-6 h-6" />
            </button>

            <h3 className="text-xl font-extrabold text-slate-900 mb-4 border-b pb-2">
              Member File Verification Workbench
            </h3>

            <div className="space-y-4 text-xs">
              
              <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <img src={inspectMember.photoUrl} alt="" className="w-20 h-24 rounded-lg object-cover border-2 border-yellow-400 shrink-0" />
                <div>
                  <h4 className="font-extrabold text-lg text-slate-900">{inspectMember.fullName}</h4>
                  <p className="font-semibold text-amber-700">{inspectMember.nameTamil}</p>
                  <p className="text-slate-600 mt-1">District: {inspectMember.district} • Wing: {inspectMember.pasaraiName}</p>
                  <p className="text-slate-600">Mobile: +91 {inspectMember.mobile} • Email: {inspectMember.email}</p>
                </div>
              </div>

              {/* Secure Aadhaar Card Document Preview Section */}
              <div className="bg-amber-50/90 border-2 border-yellow-400 p-4 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-amber-900 text-xs flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-amber-600" /> Secure Admin Aadhaar Document Verification:
                  </span>
                  <span className="font-mono font-bold text-xs bg-amber-200 text-slate-900 px-2.5 py-0.5 rounded">
                    {inspectMember.aadhaarNumber}
                  </span>
                </div>

                {inspectMember.aadhaarDocUrl ? (
                  <div className="space-y-2">
                    <div className="w-full max-h-60 bg-slate-900 rounded-lg overflow-hidden border border-amber-400 p-2 flex items-center justify-center shadow-md">
                      <img
                        src={inspectMember.aadhaarDocUrl}
                        alt="Uploaded Aadhaar Document"
                        className="max-h-56 object-contain rounded cursor-pointer hover:scale-105 transition-transform"
                        onClick={() => setZoomedAadhaarUrl(inspectMember.aadhaarDocUrl)}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setZoomedAadhaarUrl(inspectMember.aadhaarDocUrl)}
                      className="text-xs font-bold text-amber-900 hover:text-amber-950 flex items-center gap-1 mx-auto underline cursor-pointer"
                    >
                      <Eye className="w-4 h-4" /> Click to View Full-Scale Aadhaar Image
                    </button>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">No Aadhaar document uploaded.</p>
                )}
              </div>

              {/* Approval & Delete Actions */}
              <div className="pt-4 border-t border-slate-200 space-y-3">
                {inspectMember.status === 'PENDING' && (
                  <div className="flex flex-col gap-2">
                    {isDistrictAdmin ? (
                      <button
                        onClick={() => handleApprove(inspectMember.id)}
                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-3 rounded-xl uppercase tracking-wider cursor-pointer shadow-md"
                      >
                        APPROVE APPLICATION & ASSIGN MEMBERSHIP ID
                      </button>
                    ) : (
                      <div className="bg-amber-100/80 border border-yellow-400 p-3 rounded-xl text-amber-900 text-xs font-bold text-center flex items-center justify-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                        <span>Super Admin View: Only the assigned District Admin of {inspectMember.district} District can approve this application and generate Membership ID.</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between gap-2 pt-2">
                  {inspectMember.status === 'PENDING' && (
                    <button
                      onClick={() => handleReject(inspectMember.id)}
                      className="bg-amber-600 hover:bg-amber-500 text-white font-bold py-2 px-4 rounded text-xs cursor-pointer"
                    >
                      REJECT
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteMember(inspectMember.id)}
                    className="bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded text-xs cursor-pointer ml-auto"
                  >
                    DELETE MEMBER RECORD
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* FULL SCALE AADHAAR ZOOM MODAL */}
      {zoomedAadhaarUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <div className="relative max-w-4xl w-full bg-slate-900 p-4 rounded-2xl border border-yellow-400">
            <button
              onClick={() => setZoomedAadhaarUrl(null)}
              className="absolute right-4 top-4 text-white bg-slate-800 hover:bg-slate-700 p-2 rounded-lg cursor-pointer"
            >
              <XCircle className="w-6 h-6 text-yellow-400" />
            </button>
            <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4 text-yellow-400" />
              <span>Full Scale Member Aadhaar Document Image</span>
            </h4>
            <div className="max-h-[80vh] overflow-auto flex items-center justify-center bg-slate-950 p-2 rounded-xl">
              <img src={zoomedAadhaarUrl} alt="Aadhaar Full Document" className="max-w-full h-auto object-contain rounded" />
            </div>
          </div>
        </div>
      )}

    </div>
  </div>
  );
};
