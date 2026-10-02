import React, { useState } from 'react';
import type { MemberApplication, AdminRole, EventItem, NewsItem, CertificateItem, AdminAccount } from '../../types';
import { 
  getMembers, approveMemberApplication, rejectMemberApplication, deleteMember,
  getDonations, deleteDonation,
  getEvents, addEvent, deleteEvent,
  getNews, addNews, deleteNews,
  getCertificates, addCertificate, deleteCertificate,
  getAdminAccounts, addAdminAccount, deleteAdminAccount
} from '../../services/storageService';
import { TN_DISTRICTS, PASARAI_WINGS } from '../../data/mockData';
import { Shield, Users, Heart, CheckCircle2, XCircle, Search, Download, Plus, Trash2, Calendar, Newspaper, Award, UserPlus, Lock, Eye, MapPin } from 'lucide-react';

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
  const [activeAdminTab, setActiveAdminTab] = useState<'MEMBERS' | 'PENDING' | 'EVENTS' | 'NEWS' | 'CERTIFICATES' | 'DONATIONS' | 'REPORTS' | 'ADMINS'>('MEMBERS');
  const [membersList, setMembersList] = useState<MemberApplication[]>(getMembers());
  const [eventsList, setEventsList] = useState<EventItem[]>(getEvents());
  const [newsList, setNewsList] = useState<NewsItem[]>(getNews());
  const [certList, setCertList] = useState<CertificateItem[]>(getCertificates());
  const [donationsList, setDonationsList] = useState(getDonations());
  const [adminAccountsList, setAdminAccountsList] = useState<AdminAccount[]>(getAdminAccounts());

  const [inspectMember, setInspectMember] = useState<MemberApplication | null>(null);
  const [zoomedAadhaarUrl, setZoomedAadhaarUrl] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  
  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrictFilter, setSelectedDistrictFilter] = useState('ALL');
  const [selectedPasaraiFilter, setSelectedPasaraiFilter] = useState('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('ALL');

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

  const refreshAllData = () => {
    setMembersList(getMembers());
    setEventsList(getEvents());
    setNewsList(getNews());
    setCertList(getCertificates());
    setDonationsList(getDonations());
    setAdminAccountsList(getAdminAccounts());
  };

  const handleApprove = (appId: string) => {
    const targetMember = membersList.find(m => m.id === appId);
    if (isSuperAdmin) {
      alert(`🔒 Super Admin Notice:\nSuper Admin cannot accept/approve member applications directly.\n\nOnly the assigned District Admin of ${targetMember?.district || 'that'} district can accept applications and generate Membership IDs.`);
      return;
    }
    const updated = approveMemberApplication(appId);
    if (updated) {
      refreshAllData();
      setInspectMember(null);
    }
  };

  const handleReject = (appId: string) => {
    if (!rejectionReason) return;
    const updated = rejectMemberApplication(appId, rejectionReason);
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
      <div className="bg-[#8B1E26] text-white rounded-2xl p-6 shadow-2xl mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-white text-[#8B1E26] text-xs font-black px-2.5 py-0.5 rounded uppercase shadow">
              ADMIN WORKBENCH
            </span>
            <span className="text-xs text-amber-200 font-bold flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-white" />
              {isSuperAdmin ? '👑 Super Admin Access (State HQ)' : `🏛️ District Admin Portal (${adminDistrict})`}
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-white mt-1 font-heading">
            {isDistrictAdmin ? `${adminDistrict} District Admin Dashboard` : 'State & District Admin Management Portal'}
          </h2>
          {currentAdmin && (
            <p className="text-xs text-gray-100 mt-0.5">
              Logged in as: <strong className="text-white underline">{currentAdmin.name}</strong> (@{currentAdmin.username})
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onCloseAdmin}
            className="bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white px-4 py-2 rounded-xl text-xs font-bold border border-gray-700 cursor-pointer flex items-center gap-1.5"
          >
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>Logout Admin</span>
          </button>
        </div>
      </div>

      {/* District Admin Role Scope Alert Banner */}
      {isDistrictAdmin && (
        <div className="bg-amber-50 border-2 border-yellow-400 text-amber-900 rounded-xl p-4 mb-6 text-xs flex items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <span className="font-extrabold text-sm block">
                🔒 District Restricted Access: {adminDistrict} District
              </span>
              <p className="text-amber-800">
                You are assigned to manage members and approvals exclusively for <strong>{adminDistrict}</strong> district. All lists and metrics below are filtered to your assigned district.
              </p>
            </div>
          </div>
          <span className="bg-amber-200 text-amber-900 font-bold px-3 py-1 rounded-lg shrink-0">
            {scopedMembersList.length} Members in {adminDistrict}
          </span>
        </div>
      )}

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-md">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>{isDistrictAdmin ? `${adminDistrict} Members` : 'Total Members'}</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{scopedMembersList.length}</p>
        </div>

        <div className="bg-amber-50/80 p-4 rounded-xl border border-yellow-400 shadow-md">
          <div className="flex items-center justify-between text-amber-900 text-xs font-bold">
            <span>Pending Approvals</span>
            <Shield className="w-4 h-4 text-amber-600 animate-pulse" />
          </div>
          <p className="text-2xl font-extrabold text-amber-900 mt-1">{pendingMembers.length}</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-md">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Approved Members</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-extrabold text-emerald-700 mt-1">{approvedMembers.length}</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-md">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Total Donations</span>
            <Heart className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-xl font-extrabold text-slate-900 mt-1">₹{totalDonationSum.toLocaleString()}</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-md">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>{isDistrictAdmin ? 'Assigned District' : 'Active TN Districts'}</span>
            <Users className="w-4 h-4 text-yellow-600" />
          </div>
          <p className="text-xl font-extrabold text-slate-900 mt-1">
            {isDistrictAdmin ? adminDistrict : '38 TN Districts'}
          </p>
        </div>
      </div>

      {/* Admin Tabs Bar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3 mb-6 text-xs font-bold">
        {[
          { id: 'MEMBERS', label: 'Members Directory', badge: scopedMembersList.length },
          { id: 'PENDING', label: 'Pending Queue', badge: pendingMembers.length, highlight: true },
          { id: 'EVENTS', label: 'Events Manager', badge: eventsList.length },
          { id: 'NEWS', label: 'News & Media', badge: newsList.length },
          { id: 'CERTIFICATES', label: 'Certificates Manager', badge: certList.length },
          { id: 'DONATIONS', label: 'Donation Ledger', badge: donationsList.length },
          { id: 'REPORTS', label: 'Reports & Analytics' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveAdminTab(tab.id as any)}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
              activeAdminTab === tab.id
                ? 'bg-[#181B20] text-yellow-400 shadow'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                tab.highlight ? 'bg-yellow-400 text-slate-950' : 'bg-slate-200 text-slate-800'
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
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer ml-auto ${
              activeAdminTab === 'ADMINS'
                ? 'bg-yellow-400 text-slate-950 shadow ring-2 ring-yellow-400'
                : 'bg-[#181B20] text-amber-300 hover:bg-gray-800'
            }`}
          >
            <UserPlus className="w-4 h-4 text-yellow-400" />
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
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#181B20] text-gray-300 uppercase text-[10px] tracking-wider font-extrabold">
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
              <tbody className="divide-y divide-slate-200 text-slate-800 font-semibold">
                {filteredMembers.map((m) => (
                  <tr key={m.id} className="hover:bg-amber-50/50 transition-colors">
                    <td className="p-3 font-mono font-extrabold text-amber-700">
                      {m.membershipNumber || m.id}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <img src={m.photoUrl} alt="" className="w-9 h-11 rounded object-cover border border-amber-400 shrink-0" />
                        <div>
                          <p className="font-extrabold text-slate-900">{m.fullName}</p>
                          <p className="text-[11px] text-slate-500">{m.nameTamil} • +91 {m.mobile}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 font-bold">{m.district}</td>
                    <td className="p-3 text-slate-600">{m.pasaraiName}</td>
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
                        className="bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-extrabold px-3 py-1.5 rounded-lg text-xs cursor-pointer shadow-sm"
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
                    className="flex-1 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-extrabold py-2.5 rounded-lg text-xs uppercase tracking-wide cursor-pointer text-center"
                  >
                    Inspect Aadhaar & Verify
                  </button>
                  {isDistrictAdmin ? (
                    <button
                      onClick={() => handleApprove(app.id)}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-4 py-2.5 rounded-lg text-xs cursor-pointer"
                    >
                      Approve & Generate ID
                    </button>
                  ) : (
                    <span className="bg-slate-200 text-slate-700 text-[10px] font-extrabold px-3 py-2 rounded-lg border border-slate-300" title={`Only ${app.district} District Admin can approve`}>
                      🔒 {app.district} Admin Approval Required
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
        <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-200 space-y-6">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded uppercase">
                SUPER ADMIN CONTROLE
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                District Admins Management / மாவட்ட நிர்வாகிகள்
              </h3>
              <p className="text-xs text-slate-500">Create and assign district-specific admin accounts with scoped access controls.</p>
            </div>

            <button
              onClick={() => setIsAddAdminOpen(true)}
              className="bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-extrabold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow cursor-pointer uppercase tracking-wider"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ Create District Admin</span>
            </button>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#181B20] text-gray-300 uppercase text-[10px] tracking-wider font-extrabold">
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
              <tbody className="divide-y divide-slate-200 text-slate-800 font-semibold">
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
              className="bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-extrabold px-4 py-2 rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow"
            >
              <Plus className="w-4 h-4" /> Add Event Listing
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {eventsList.map((evt) => (
              <div key={evt.id} className="border border-slate-200 rounded-xl p-4 flex gap-4 bg-slate-50">
                <img src={evt.bannerUrl} alt="" className="w-24 h-24 rounded-lg object-cover shrink-0" />
                <div className="flex-1 space-y-1 text-xs">
                  <span className="bg-slate-900 text-yellow-400 font-bold px-2 py-0.5 rounded text-[10px]">
                    {evt.district} District
                  </span>
                  <h4 className="font-extrabold text-slate-900 text-sm mt-1">{evt.titleTamil}</h4>
                  <p className="text-slate-600">{evt.title}</p>
                  <p className="text-amber-700 font-semibold">Date: {evt.date} • Venue: {evt.venue}</p>
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
        <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-200 space-y-6">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">News & Press Releases</h3>
              <p className="text-xs text-slate-500">Publish official announcements and circulars.</p>
            </div>
            <button
              onClick={() => setIsAddNewsOpen(true)}
              className="bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-extrabold px-4 py-2 rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow"
            >
              <Plus className="w-4 h-4" /> Publish Press Release
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {newsList.map((news) => (
              <div key={news.id} className="border border-slate-200 rounded-xl p-4 flex gap-4 bg-slate-50">
                <img src={news.imageUrl} alt="" className="w-24 h-24 rounded-lg object-cover shrink-0" />
                <div className="flex-1 space-y-1 text-xs">
                  <span className="bg-yellow-400 text-slate-950 font-bold px-2 py-0.5 rounded text-[10px]">
                    {news.category}
                  </span>
                  <h4 className="font-extrabold text-slate-900 text-sm mt-1">{news.titleTamil}</h4>
                  <p className="text-slate-600 line-clamp-2">{news.summary}</p>
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
        <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-200 space-y-6">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">Certificates & Awards</h3>
              <p className="text-xs text-slate-500">Issue official certificates with QR code verification.</p>
            </div>
            <button
              onClick={() => setIsAddCertOpen(true)}
              className="bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-extrabold px-4 py-2 rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow"
            >
              <Plus className="w-4 h-4" /> Issue Certificate
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {certList.map((cert) => (
              <div key={cert.id} className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-extrabold text-amber-700">{cert.certificateNumber}</span>
                  <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">
                    {cert.type}
                  </span>
                </div>
                <h4 className="font-extrabold text-slate-900 text-sm">{cert.memberName}</h4>
                <p className="text-slate-600">{cert.title}</p>
                <p className="text-slate-500 text-[11px]">Issued by: {cert.issuedBy} • Date: {cert.issueDate}</p>
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
        <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-200 space-y-6">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">Donation & Receipt Ledger</h3>
              <p className="text-xs text-slate-500">Track all public donations and issued receipts.</p>
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#181B20] text-gray-300 uppercase text-[10px] font-extrabold">
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
              <tbody className="divide-y divide-slate-200 text-slate-800 font-semibold">
                {donationsList.map((d) => (
                  <tr key={d.id} className="hover:bg-amber-50/50">
                    <td className="p-3 font-mono font-extrabold text-amber-700">{d.receiptNumber}</td>
                    <td className="p-3 font-extrabold text-slate-900">{d.donorName}</td>
                    <td className="p-3">+91 {d.mobile}</td>
                    <td className="p-3 font-extrabold text-emerald-700">₹{d.amount}</td>
                    <td className="p-3 text-slate-600">{d.purpose}</td>
                    <td className="p-3 text-slate-500">{d.date}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleDeleteDonationItem(d.id)}
                        className="text-red-600 hover:text-red-800 font-bold p-1 hover:bg-red-50 rounded"
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

      {/* CREATE EVENT MODAL */}
      {isAddEventOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative my-8 text-slate-900">
            <button onClick={() => setIsAddEventOpen(false)} className="absolute right-4 top-4 text-slate-400 hover:text-slate-700">✕</button>
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
                className="w-full bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-extrabold py-3 rounded-xl uppercase tracking-wider text-xs shadow cursor-pointer"
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
            <button onClick={() => setIsAddNewsOpen(false)} className="absolute right-4 top-4 text-slate-400 hover:text-slate-700">✕</button>
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
                className="w-full bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-extrabold py-3 rounded-xl uppercase tracking-wider text-xs shadow cursor-pointer"
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
            <button onClick={() => setIsAddCertOpen(false)} className="absolute right-4 top-4 text-slate-400 hover:text-slate-700">✕</button>
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
                className="w-full bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-extrabold py-3 rounded-xl uppercase tracking-wider text-xs shadow cursor-pointer"
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
            <button onClick={() => setIsAddAdminOpen(false)} className="absolute right-4 top-4 text-slate-400 hover:text-slate-700">✕</button>
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
                className="w-full bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-extrabold py-3 rounded-xl uppercase tracking-wider text-xs shadow cursor-pointer mt-4"
              >
                CREATE DISTRICT ADMIN ACCOUNT
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
                      <div className="bg-amber-100/80 border border-yellow-400 p-3 rounded-xl text-amber-900 text-xs font-bold text-center">
                        🔒 Super Admin View: Only the assigned District Admin of {inspectMember.district} District can approve this application and generate Membership ID.
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
