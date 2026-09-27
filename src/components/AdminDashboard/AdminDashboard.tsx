import React, { useState } from 'react';
import type { MemberApplication, AdminRole, EventItem, NewsItem, CertificateItem } from '../../types';
import { 
  getMembers, approveMemberApplication, rejectMemberApplication, deleteMember,
  getDonations, deleteDonation,
  getEvents, addEvent, deleteEvent,
  getNews, addNews, deleteNews,
  getCertificates, addCertificate, deleteCertificate
} from '../../services/storageService';
import { TN_DISTRICTS, PASARAI_WINGS } from '../../data/mockData';
import { Shield, Users, Heart, CheckCircle2, XCircle, Search, Download, Plus, Trash2, Calendar, Newspaper, Award } from 'lucide-react';

interface AdminDashboardProps {
  onCloseAdmin: () => void;
  onVerifyQrCode: (membershipNumber: string) => void;
  currentLang: 'en' | 'ta';
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onCloseAdmin,
}) => {
  const [activeAdminTab, setActiveAdminTab] = useState<'MEMBERS' | 'PENDING' | 'EVENTS' | 'NEWS' | 'CERTIFICATES' | 'DONATIONS' | 'REPORTS'>('MEMBERS');
  const [membersList, setMembersList] = useState<MemberApplication[]>(getMembers());
  const [eventsList, setEventsList] = useState<EventItem[]>(getEvents());
  const [newsList, setNewsList] = useState<NewsItem[]>(getNews());
  const [certList, setCertList] = useState<CertificateItem[]>(getCertificates());
  const [donationsList, setDonationsList] = useState(getDonations());

  const [selectedRole, setSelectedRole] = useState<AdminRole>('SUPER_ADMIN');
  const [inspectMember, setInspectMember] = useState<MemberApplication | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  
  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrictFilter, setSelectedDistrictFilter] = useState('ALL');
  const [selectedPasaraiFilter, setSelectedPasaraiFilter] = useState('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('ALL');

  // Form Modal States for Admin Create
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [newEvent, setNewEvent] = useState<Omit<EventItem, 'id' | 'registeredCount'>>({
    title: '',
    titleTamil: '',
    date: new Date().toISOString().split('T')[0],
    time: '10:00 AM',
    venue: 'Sangam Auditorium, Chennai',
    district: 'Chennai',
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
    issuedBy: 'Tamil Sangam State HQ',
    description: 'In recognition of outstanding contribution to Tamil Sangam digital portal.'
  });

  const refreshAllData = () => {
    setMembersList(getMembers());
    setEventsList(getEvents());
    setNewsList(getNews());
    setCertList(getCertificates());
    setDonationsList(getDonations());
  };

  const handleApprove = (appId: string) => {
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

  // Add Event
  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.titleTamil) return;
    addEvent(newEvent);
    refreshAllData();
    setIsAddEventOpen(false);
    setNewEvent({
      title: '',
      titleTamil: '',
      date: new Date().toISOString().split('T')[0],
      time: '10:00 AM',
      venue: 'Sangam Auditorium, Chennai',
      district: 'Chennai',
      description: '',
      registrationFee: 0,
      maxParticipants: 500,
      bannerUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80'
    });
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
    setNewNews({
      title: '',
      titleTamil: '',
      category: 'Press Release',
      summary: '',
      content: '',
      imageUrl: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=600&q=80'
    });
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
    setNewCert({
      memberName: '',
      memberId: 'TS-TN-2026-000101',
      title: 'Official Membership Appreciation Certificate',
      type: 'APPRECIATION',
      issueDate: new Date().toISOString().split('T')[0],
      issuedBy: 'Tamil Sangam State HQ',
      description: 'In recognition of outstanding contribution to Tamil Sangam digital portal.'
    });
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

  const filteredMembers = membersList.filter(m => {
    const matchesSearch = 
      (m.membershipNumber && m.membershipNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      m.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.nameTamil.includes(searchQuery) ||
      m.mobile.includes(searchQuery) ||
      m.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDistrict = selectedDistrictFilter === 'ALL' || m.district === selectedDistrictFilter;
    const matchesPasarai = selectedPasaraiFilter === 'ALL' || m.pasaraiId === selectedPasaraiFilter || m.pasaraiName === selectedPasaraiFilter;
    const matchesStatus = selectedStatusFilter === 'ALL' || m.status === selectedStatusFilter;

    return matchesSearch && matchesDistrict && matchesPasarai && matchesStatus;
  });

  const pendingMembers = membersList.filter(m => m.status === 'PENDING');
  const approvedMembers = membersList.filter(m => m.status === 'APPROVED');
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-slate-900">
      
      {/* Top Admin Header Bar */}
      <div className="bg-[#181B20] text-white rounded-2xl p-6 shadow-2xl gold-header-strip mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-yellow-400 text-slate-950 text-xs font-black px-2.5 py-0.5 rounded uppercase">
              ADMIN WORKBENCH
            </span>
            <span className="text-xs text-amber-300 font-bold">
              Tamil Sangam Digital Portal
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-white mt-1">State & District Admin Management Portal</h2>
        </div>

        {/* Role Switcher */}
        <div className="flex items-center gap-3">
          <div className="text-right text-xs">
            <span className="text-gray-400 block text-[10px]">Active Role</span>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as AdminRole)}
              className="bg-gray-800 border border-amber-500/40 text-yellow-400 font-bold text-xs px-2.5 py-1.5 rounded-lg"
            >
              <option value="SUPER_ADMIN">Super Admin (State HQ)</option>
              <option value="DISTRICT_ADMIN">District Admin</option>
              <option value="FINANCE_ADMIN">Finance & Donation Admin</option>
              <option value="MEMBERSHIP_ADMIN">Membership Desk Admin</option>
            </select>
          </div>

          <button
            onClick={onCloseAdmin}
            className="bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white px-3.5 py-2 rounded-lg text-xs font-bold border border-gray-700 cursor-pointer"
          >
            Exit Admin
          </button>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-md">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Total Members</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{membersList.length}</p>
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
            <span>Active TN Districts</span>
            <Users className="w-4 h-4 text-yellow-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">38</p>
        </div>
      </div>

      {/* Admin Tabs Bar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3 mb-6 text-xs font-bold">
        {[
          { id: 'MEMBERS', label: 'Members Directory', badge: membersList.length },
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
                value={selectedDistrictFilter}
                onChange={(e) => setSelectedDistrictFilter(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-semibold text-slate-950"
              >
                <option value="ALL">All Districts (38)</option>
                {TN_DISTRICTS.map(d => (
                  <option key={d.id} value={d.name}>{d.nameTamil} ({d.name})</option>
                ))}
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
                <option value="ALL">All Statuses</option>
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>

              <button
                onClick={handleExportCSV}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold p-2 rounded-lg text-xs shrink-0 cursor-pointer"
                title="Export Filtered CSV"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Members Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#181B20] text-white uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-3">Member / Photo</th>
                  <th className="p-3">Membership Number</th>
                  <th className="p-3">District / Pasarai</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-900">
                {filteredMembers.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 flex items-center gap-3">
                      <img src={m.photoUrl} alt="" className="w-9 h-11 rounded object-cover border" />
                      <div>
                        <p className="font-bold text-slate-900">{m.fullName}</p>
                        <p className="text-[10px] text-amber-700 font-semibold">{m.nameTamil}</p>
                        <p className="text-[10px] text-slate-500">+91 {m.mobile}</p>
                      </div>
                    </td>
                    <td className="p-3 font-mono font-extrabold text-slate-900">
                      {m.membershipNumber || <span className="text-amber-600">Pending</span>}
                    </td>
                    <td className="p-3">
                      <p className="font-bold text-slate-900">{m.district}</p>
                      <p className="text-[10px] text-slate-500 truncate max-w-[140px]">{m.pasaraiName}</p>
                    </td>
                    <td className="p-3 font-semibold text-slate-700">{m.categoryName}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                        m.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' : m.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {m.status}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-1">
                      <button
                        onClick={() => setInspectMember(m)}
                        className="bg-slate-900 hover:bg-yellow-400 text-white hover:text-slate-950 font-bold px-2.5 py-1.5 rounded text-[11px] transition-colors cursor-pointer"
                      >
                        Inspect
                      </button>
                      <button
                        onClick={() => handleDeleteMember(m.id)}
                        className="bg-red-100 hover:bg-red-600 text-red-700 hover:text-white font-bold p-1.5 rounded text-[11px] transition-colors cursor-pointer"
                        title="Delete Record"
                      >
                        <Trash2 className="w-3.5 h-3.5 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* TAB 2: PENDING APPROVALS QUEUE */}
      {activeAdminTab === 'PENDING' && (
        <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-200 space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <h3 className="text-lg font-extrabold text-slate-900">Pending Membership Applications Queue</h3>
            <p className="text-xs text-slate-500">Inspect candidate identity, Aadhaar card copy, and grant official membership ID.</p>
          </div>

          {pendingMembers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pendingMembers.map((m) => (
                <div key={m.id} className="bg-slate-50 border border-slate-300 rounded-xl p-5 space-y-4 shadow-sm">
                  
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <img src={m.photoUrl} alt="" className="w-14 h-16 rounded-lg object-cover border-2 border-yellow-400" />
                      <div>
                        <h4 className="font-extrabold text-base text-slate-900">{m.fullName}</h4>
                        <p className="text-xs font-semibold text-amber-700">{m.nameTamil}</p>
                        <span className="bg-yellow-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded">
                          {m.categoryName}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 bg-white p-3 rounded-lg border border-slate-200">
                    <p><strong className="text-slate-900">Mobile:</strong> +91 {m.mobile}</p>
                    <p><strong className="text-slate-900">District:</strong> {m.district}</p>
                    <p><strong className="text-slate-900">Pasarai:</strong> {m.pasaraiName}</p>
                    <p><strong className="text-slate-900">Aadhaar:</strong> {m.aadhaarNumber}</p>
                    <p><strong className="text-slate-900">Fee Paid:</strong> ₹{m.paymentAmount}</p>
                    <p><strong className="text-slate-900">Txn:</strong> {m.paymentTransactionId}</p>
                  </div>

                  <div className="flex items-center justify-between gap-3 pt-2">
                    <button
                      onClick={() => setInspectMember(m)}
                      className="bg-slate-800 text-white font-bold px-3 py-2 rounded-lg text-xs hover:bg-slate-700 cursor-pointer"
                    >
                      View File
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleApprove(m.id)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-4 py-2 rounded-lg text-xs shadow cursor-pointer"
                      >
                        APPROVE & ISSUE ID
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500">No pending membership applications at present.</p>
          )}
        </div>
      )}

      {/* TAB 3: EVENTS MANAGER */}
      {activeAdminTab === 'EVENTS' && (
        <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-200 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">State & District Events Manager</h3>
              <p className="text-xs text-slate-500">Create, edit, or remove state conventions, symposiums, and tournaments.</p>
            </div>
            <button
              onClick={() => setIsAddEventOpen(true)}
              className="bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-extrabold text-xs px-4 py-2 rounded-lg shadow flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Event</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {eventsList.map((evt) => (
              <div key={evt.id} className="bg-slate-50 rounded-xl border border-slate-300 p-4 flex flex-col justify-between space-y-3">
                <div className="flex gap-3">
                  <img src={evt.bannerUrl} alt="" className="w-24 h-24 object-cover rounded-lg shrink-0 border" />
                  <div>
                    <span className="bg-slate-900 text-yellow-400 font-bold text-[10px] px-2 py-0.5 rounded uppercase">
                      {evt.district} District
                    </span>
                    <h4 className="font-extrabold text-base text-slate-900 mt-1">{evt.titleTamil}</h4>
                    <p className="text-xs text-slate-600 font-semibold">{evt.title}</p>
                    <p className="text-xs text-amber-700 font-bold mt-1">📅 Date: {evt.date} ({evt.time})</p>
                    <p className="text-xs text-slate-500">📍 Venue: {evt.venue}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 flex justify-end">
                  <button
                    onClick={() => handleDeleteEvent(evt.id)}
                    className="bg-red-100 hover:bg-red-600 text-red-700 hover:text-white font-bold px-3 py-1 rounded text-xs transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Event</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: NEWS & MEDIA MANAGER */}
      {activeAdminTab === 'NEWS' && (
        <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-200 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">News & Press Release Publishing Desk</h3>
              <p className="text-xs text-slate-500">Publish official statements, district announcements, and media releases.</p>
            </div>
            <button
              onClick={() => setIsAddNewsOpen(true)}
              className="bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-extrabold text-xs px-4 py-2 rounded-lg shadow flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Publish News Item</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {newsList.map((n) => (
              <div key={n.id} className="bg-slate-50 rounded-xl border border-slate-300 p-4 flex flex-col justify-between space-y-3">
                <div className="flex gap-3">
                  <img src={n.imageUrl} alt="" className="w-24 h-24 object-cover rounded-lg shrink-0 border" />
                  <div>
                    <span className="bg-amber-600 text-white font-bold text-[10px] px-2 py-0.5 rounded uppercase">
                      {n.category} • {n.date}
                    </span>
                    <h4 className="font-extrabold text-base text-slate-900 mt-1">{n.titleTamil}</h4>
                    <p className="text-xs text-slate-600 font-semibold">{n.title}</p>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{n.summary}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 flex justify-end">
                  <button
                    onClick={() => handleDeleteNewsItem(n.id)}
                    className="bg-red-100 hover:bg-red-600 text-red-700 hover:text-white font-bold px-3 py-1 rounded text-xs transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete News</span>
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
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">Certificate Generation & Issuance</h3>
              <p className="text-xs text-slate-500">Issue official membership certificates, volunteer awards, and appreciation cards.</p>
            </div>
            <button
              onClick={() => setIsAddCertOpen(true)}
              className="bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-extrabold text-xs px-4 py-2 rounded-lg shadow flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Issue New Certificate</span>
            </button>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#181B20] text-white uppercase text-[10px]">
                <tr>
                  <th className="p-3">Certificate No</th>
                  <th className="p-3">Member Name</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Issue Date</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {certList.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-amber-700">{c.certificateNumber}</td>
                    <td className="p-3 font-bold text-slate-900">{c.memberName}</td>
                    <td className="p-3 font-semibold text-slate-700">{c.type}</td>
                    <td className="p-3">{c.issueDate}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleDeleteCertItem(c.id)}
                        className="bg-red-100 hover:bg-red-600 text-red-700 hover:text-white font-bold p-1.5 rounded transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: DONATIONS LEDGER */}
      {activeAdminTab === 'DONATIONS' && (
        <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-200 space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <h3 className="text-lg font-extrabold text-slate-900">State Donation Ledger & Receipts</h3>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#181B20] text-white uppercase text-[10px]">
                <tr>
                  <th className="p-3">Receipt No</th>
                  <th className="p-3">Donor Name</th>
                  <th className="p-3">Contact</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Purpose</th>
                  <th className="p-3">Date</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {donationsList.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-amber-700">{d.receiptNumber}</td>
                    <td className="p-3 font-bold text-slate-900">{d.donorName}</td>
                    <td className="p-3">+91 {d.mobile} • {d.email}</td>
                    <td className="p-3 font-black text-rose-600">₹{d.amount.toLocaleString()}</td>
                    <td className="p-3 text-slate-600">{d.purpose}</td>
                    <td className="p-3">{d.date}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleDeleteDonationItem(d.id)}
                        className="bg-red-100 hover:bg-red-600 text-red-700 hover:text-white font-bold p-1.5 rounded transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 7: REPORTS */}
      {activeAdminTab === 'REPORTS' && (
        <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-200 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">District & Pasarai Analytics Reports</h3>
              <p className="text-xs text-slate-500">Summary reports breakdown across 38 TN Districts and 23 Wings.</p>
            </div>
            <button
              onClick={handleExportCSV}
              className="bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4" /> Export Complete CSV Report
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="border rounded-xl p-4 bg-slate-50">
              <h4 className="font-extrabold text-slate-900 mb-3">District-wise Membership Share</h4>
              <div className="space-y-2">
                {TN_DISTRICTS.slice(0, 8).map(d => (
                  <div key={d.id} className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800">{d.nameTamil} ({d.name})</span>
                    <span className="font-bold text-slate-900">{d.totalMembers} members</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border rounded-xl p-4 bg-slate-50">
              <h4 className="font-extrabold text-slate-900 mb-3">Pasarai Wings Membership Distribution</h4>
              <div className="space-y-2">
                {PASARAI_WINGS.slice(0, 8).map(p => (
                  <div key={p.id} className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800">{p.nameTamil}</span>
                    <span className="font-bold text-amber-700">{p.memberCount} members</span>
                  </div>
                ))}
              </div>
            </div>
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
              <span>Create New Sangam Event</span>
            </h3>

            <form onSubmit={handleCreateEvent} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold mb-1">Event Title (English) *</label>
                <input
                  type="text"
                  required
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  placeholder="e.g. TN Youth Tamil Literature Meet 2026"
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
                  placeholder="எ.கா. மாநில இளைஞர் இலக்கிய சங்கமம் 2026"
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
                  placeholder="State symposium details and registration instructions..."
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
                  placeholder="e.g. State Level Tamil Sangam Convention Announced"
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
                  placeholder="எ.கா. மாநில அளவிலான தமிழ் சங்க மாநாடு அறிவிப்பு"
                  className="w-full p-2.5 bg-slate-50 border rounded-lg font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Summary (Tamil) *</label>
                <textarea
                  rows={2}
                  required
                  value={newNews.summary}
                  onChange={(e) => setNewNews({ ...newNews, summary: e.target.value })}
                  placeholder="சுருக்கம்..."
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
                  placeholder="Full text..."
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

      {/* INSPECT MODAL (Secure Aadhaar View & Approve/Reject/Delete Workflows) */}
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
                <img src={inspectMember.photoUrl} alt="" className="w-20 h-24 rounded-lg object-cover border-2 border-yellow-400" />
                <div>
                  <h4 className="font-extrabold text-lg text-slate-900">{inspectMember.fullName}</h4>
                  <p className="font-semibold text-amber-700">{inspectMember.nameTamil}</p>
                  <p className="text-slate-600 mt-1">District: {inspectMember.district} • Wing: {inspectMember.pasaraiName}</p>
                  <p className="text-slate-600">Mobile: +91 {inspectMember.mobile} • WhatsApp: +91 {inspectMember.whatsapp}</p>
                </div>
              </div>

              {/* Secure Aadhaar Section */}
              <div className="bg-amber-50 border border-amber-300 p-4 rounded-xl space-y-2">
                <span className="font-extrabold text-amber-900 text-xs flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-amber-600" /> Secure Admin Aadhaar Document Verification:
                </span>
                <p className="font-mono font-bold text-sm text-slate-900">Aadhaar No: {inspectMember.aadhaarNumber}</p>
              </div>

              {/* Approval & Delete Actions */}
              <div className="pt-4 border-t border-slate-200 space-y-3">
                {inspectMember.status === 'PENDING' && (
                  <div className="flex items-center justify-between gap-4">
                    <button
                      onClick={() => handleApprove(inspectMember.id)}
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-3 rounded-xl uppercase tracking-wider cursor-pointer"
                    >
                      APPROVE APPLICATION & ASSIGN MEMBERSHIP ID
                    </button>
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

    </div>
  );
};
