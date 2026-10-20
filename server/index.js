import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { db, initDatabase } from './db.js';
import { 
  generateAndSaveOtp, 
  verifyOtpCode, 
  dispatchMessage, 
  createNotification, 
  notifyMembershipPayment, 
  notifyMembershipApproval, 
  notifyMembershipRejection, 
  notifyDonation 
} from './notificationService.js';

dotenv.config();

// Initialize SQLite database and tables
initDatabase();

const app = express();
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, '../dist');

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// ==========================================
// 1. HEALTH & SYSTEM STATUS
// ==========================================
app.get('/api/health', (req, res) => {
  const memberStats = db.prepare(`
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN status = 'APPROVED' THEN 1 ELSE 0 END) as approved,
      SUM(CASE WHEN status = 'PENDING' THEN 1 ELSE 0 END) as pending,
      SUM(CASE WHEN status = 'REJECTED' THEN 1 ELSE 0 END) as rejected
    FROM members
  `).get();

  const donationTotal = db.prepare('SELECT COUNT(*) as count, COALESCE(SUM(amount), 0) as totalAmount FROM donations').get();
  const adminCount = db.prepare('SELECT COUNT(*) as count FROM admins').get();

  res.json({
    status: 'ONLINE',
    database: 'SQLite (tamil_sangam.db)',
    timestamp: new Date().toISOString(),
    stats: {
      members: memberStats,
      donations: donationTotal,
      admins: adminCount.count
    }
  });
});

// Interactive API Dashboard & Documentation
app.get('/api', (req, res) => {
  const memberStats = db.prepare(`
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN status = 'APPROVED' THEN 1 ELSE 0 END) as approved,
      SUM(CASE WHEN status = 'PENDING' THEN 1 ELSE 0 END) as pending
    FROM members
  `).get();
  const donationTotal = db.prepare('SELECT COUNT(*) as count, COALESCE(SUM(amount), 0) as totalAmount FROM donations').get();
  const adminCount = db.prepare('SELECT COUNT(*) as count FROM admins').get();
  const contactCount = db.prepare("SELECT COUNT(*) as count FROM contact_messages WHERE status = 'NEW'").get();

  if (req.accepts('html')) {
    return res.send(`
      <!DOCTYPE html>
      <html lang="ta">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Tamil Sangam Backend API - Live Status</title>
        <style>
          body { font-family: system-ui, -apple-system, sans-serif; background: #0F172A; color: #F8FAFC; margin: 0; padding: 40px 20px; display: flex; justify-content: center; }
          .card { max-width: 650px; width: 100%; background: #1E293B; border: 1px solid #334155; border-radius: 20px; padding: 32px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); }
          .badge { display: inline-flex; align-items: center; gap: 6px; background: #065F46; color: #34D399; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 700; }
          h1 { margin: 12px 0 6px; font-size: 24px; color: #FCD34D; }
          p { margin: 0 0 20px; font-size: 14px; color: #94A3B8; }
          .stats { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 24px; }
          .stat-box { background: #0F172A; border: 1px solid #334155; border-radius: 12px; padding: 14px; }
          .stat-label { font-size: 11px; color: #94A3B8; text-transform: uppercase; font-weight: 700; }
          .stat-val { font-size: 20px; font-weight: 800; color: #F1F5F9; margin-top: 4px; }
          .links { display: flex; flex-direction: column; gap: 8px; }
          .btn { display: block; text-align: center; text-decoration: none; padding: 12px 18px; border-radius: 12px; font-weight: 700; font-size: 13px; transition: all 0.2s; }
          .btn-primary { background: linear-gradient(135deg, #8B1E26, #B91C1C); color: white; border: 1px solid #EF4444; }
          .btn-primary:hover { background: #991B1B; }
          .btn-sec { background: #334155; color: #E2E8F0; }
          .btn-sec:hover { background: #475569; }
        </style>
      </head>
      <body>
        <div class="card">
          <span class="badge">● SQLITE DATABASE CONNECTED (LIVE)</span>
          <h1>தமிழ் சங்கம் API சர்வர் / Tamil Sangam Backend</h1>
          <p>Node.js Express & SQLite backend is running actively on port ${PORT}.</p>
          <div class="stats">
            <div class="stat-box">
              <div class="stat-label">Total Members</div>
              <div class="stat-val">${memberStats.total || 0} (${memberStats.approved || 0} Approved)</div>
            </div>
            <div class="stat-box">
              <div class="stat-label">Pending Approval Queue</div>
              <div class="stat-val" style="color: #FBBF24;">${memberStats.pending || 0} Waiting</div>
            </div>
            <div class="stat-box">
              <div class="stat-label">Total Donations</div>
              <div class="stat-val" style="color: #34D399;">₹${Number(donationTotal.totalAmount).toLocaleString()}</div>
            </div>
            <div class="stat-box">
              <div class="stat-label">New Help Inquiries</div>
              <div class="stat-val" style="color: #38BDF8;">${contactCount.count || 0} Messages</div>
            </div>
          </div>
          <div class="links">
            <a href="/" class="btn btn-primary">🌐 Open Tamil Sangam Web Portal (Port ${PORT})</a>
            <a href="http://localhost:5173" class="btn btn-primary" style="background: #0284C7; border-color: #38BDF8;">⚡ Open Vite Dev Server (http://localhost:5173)</a>
            <a href="/api/health" class="btn btn-sec">🩺 View /api/health Endpoint</a>
            <a href="/api/members" class="btn btn-sec">👥 View /api/members Directory</a>
            <a href="/api/contact" class="btn btn-sec">📩 View /api/contact Messages</a>
            <a href="/api/messages/logs" class="btn btn-sec">📱 View /api/messages/logs SMS Audit</a>
          </div>
        </div>
      </body>
      </html>
    `);
  }

  res.json({
    status: 'ONLINE',
    service: 'Tamil Sangam Backend API',
    database: 'SQLite (tamil_sangam.db)',
    port: PORT,
    stats: {
      members: memberStats,
      donations: donationTotal,
      admins: adminCount.count,
      pendingInquiries: contactCount.count
    }
  });
});

// ==========================================
// 2. AUTH & OTP WORKFLOWS
// ==========================================

// Check if mobile number is already registered
app.get('/api/members/check-mobile/:mobile', (req, res) => {
  try {
    const cleanMobile = req.params.mobile.replace(/\D/g, '').slice(-10) || '9840123456';
    const member = db.prepare('SELECT * FROM members WHERE mobile = ? OR mobile LIKE ? ORDER BY createdAt DESC LIMIT 1')
      .get(cleanMobile, `%${cleanMobile}`);

    res.json({
      exists: !!member,
      member: member || null
    });
  } catch (err) {
    console.error('Error in check-mobile:', err);
    res.status(500).json({ error: 'Failed to check mobile number' });
  }
});

// Step 1: Send OTP to User Mobile
app.post('/api/auth/send-otp', (req, res) => {
  try {
    const { mobile, purpose = 'LOGIN' } = req.body;
    if (!mobile) {
      return res.status(400).json({ error: 'Mobile number is required' });
    }

    const cleanMobile = mobile.replace(/\D/g, '').slice(-10) || '9840123456';
    const existingMember = db.prepare('SELECT * FROM members WHERE mobile = ? OR mobile LIKE ? ORDER BY createdAt DESC LIMIT 1')
      .get(cleanMobile, `%${cleanMobile}`);

    // If attempting to LOGIN, ensure mobile exists in members table
    if (purpose === 'LOGIN' && !existingMember) {
      return res.status(404).json({
        success: false,
        notRegistered: true,
        error: 'இந்த கைபேசி எண் தமிழ் சங்கத்தில் பதிவு செய்யப்படவில்லை. தயவுசெய்து முதலில் உறுப்பினர் சேர்க்கையில் இணையவும். / This mobile number is not registered. Please Join Tamil Sangam first.'
      });
    }

    const result = generateAndSaveOtp(cleanMobile, purpose);
    res.json({
      success: true,
      message: 'OTP dispatched successfully via SMS to user mobile',
      mobile: result.cleanMobile,
      expiresAt: result.expiresAt,
      isAlreadyRegistered: !!existingMember,
      existingMember: existingMember || null
    });
  } catch (err) {
    console.error('Error in send-otp:', err);
    res.status(500).json({ error: 'Failed to generate OTP' });
  }
});

// Step 2: Verify OTP
app.post('/api/auth/verify-otp', (req, res) => {
  try {
    const { mobile, otp, purpose = 'LOGIN' } = req.body;
    if (!mobile || !otp) {
      return res.status(400).json({ error: 'Mobile number and OTP are required' });
    }

    const verification = verifyOtpCode(mobile, otp, purpose);
    if (!verification.success) {
      return res.status(400).json({ error: verification.message });
    }

    const cleanMobile = mobile.replace(/\D/g, '').slice(-10) || '9840123456';
    const existingMember = db.prepare('SELECT * FROM members WHERE mobile = ? OR mobile LIKE ? ORDER BY createdAt DESC LIMIT 1')
      .get(cleanMobile, `%${cleanMobile}`);

    res.json({
      success: true,
      message: 'OTP verified successfully',
      isAlreadyRegistered: !!existingMember,
      member: existingMember || null
    });
  } catch (err) {
    console.error('Error in verify-otp:', err);
    res.status(500).json({ error: 'Failed to verify OTP' });
  }
});

// Step 3: Member Login with OTP
app.post('/api/auth/member-login', (req, res) => {
  try {
    const { mobile, otp } = req.body;
    if (!mobile) {
      return res.status(400).json({ error: 'Mobile number is required' });
    }

    if (otp) {
      const verification = verifyOtpCode(mobile, otp, 'LOGIN');
      if (!verification.success) {
        return res.status(400).json({ error: verification.message });
      }
    }

    const cleanMobile = mobile.replace(/\D/g, '').slice(-10) || '9840123456';
    const member = db.prepare('SELECT * FROM members WHERE mobile = ? OR mobile LIKE ? ORDER BY createdAt DESC LIMIT 1')
      .get(cleanMobile, `%${cleanMobile}`);

    if (!member) {
      return res.status(404).json({
        success: false,
        notRegistered: true,
        error: 'உறுப்பினர் கணக்கு காணப்படவில்லை. தயவுசெய்து முதலில் உறுப்பினர் சேர்க்கையில் இணையவும். / Member account not found. Please join Tamil Sangam first.'
      });
    }

    res.json({
      success: true,
      member
    });
  } catch (err) {
    console.error('Error in member-login:', err);
    res.status(500).json({ error: 'Member login failed' });
  }
});

// Admin Login
app.post('/api/auth/admin-login', (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    const cleanUser = username.trim().toLowerCase();
    let admin = db.prepare('SELECT * FROM admins WHERE LOWER(username) = ? AND password = ?').get(cleanUser, password);

    // Fallback default admin credentials
    if (!admin && password === 'p@$$word' && (cleanUser === 'superadmin' || cleanUser === 'admin')) {
      admin = db.prepare('SELECT * FROM admins WHERE role = ? LIMIT 1').get('SUPER_ADMIN');
    }

    if (!admin) {
      return res.status(401).json({ error: 'Invalid Username or Password' });
    }

    res.json({
      success: true,
      admin
    });
  } catch (err) {
    console.error('Error in admin-login:', err);
    res.status(500).json({ error: 'Admin login failed' });
  }
});

// ==========================================
// 3. MEMBERSHIP & REGISTRATION APIS
// ==========================================

// Get all members with optional filters
app.get('/api/members', (req, res) => {
  try {
    const { district, status, search } = req.query;
    let query = 'SELECT * FROM members WHERE 1=1';
    const params = [];

    if (district && district !== 'ALL') {
      query += ' AND district = ?';
      params.push(district);
    }

    if (status && status !== 'ALL') {
      query += ' AND status = ?';
      params.push(status);
    }

    if (search) {
      query += ' AND (fullName LIKE ? OR membershipNumber LIKE ? OR mobile LIKE ? OR district LIKE ?)';
      const s = `%${search}%`;
      params.push(s, s, s, s);
    }

    query += ' ORDER BY createdAt DESC';
    const members = db.prepare(query).all(...params);
    res.json(members);
  } catch (err) {
    console.error('Error fetching members:', err);
    res.status(500).json({ error: 'Failed to fetch members' });
  }
});

// Get member by ID or Membership Number or Mobile
app.get('/api/members/:id', (req, res) => {
  try {
    const cleanId = req.params.id.trim();
    const member = db.prepare(`
      SELECT * FROM members 
      WHERE id = ? OR membershipNumber = ? OR mobile = ? OR mobile LIKE ?
      LIMIT 1
    `).get(cleanId, cleanId, cleanId, `%${cleanId}`);

    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }
    res.json(member);
  } catch (err) {
    console.error('Error fetching member:', err);
    res.status(500).json({ error: 'Failed to fetch member' });
  }
});

// Create new Member Application (after payment)
app.post('/api/members', (req, res) => {
  try {
    const appData = req.body;
    const id = `APP-${Date.now().toString().slice(-4)}`;
    const today = new Date().toISOString().split('T')[0];

    // NOTE: ID Card Number (membershipNumber) is ONLY generated when Admin approves!
    // On payment success, status is PENDING and sent to Admin's pending review list.
    const stmt = db.prepare(`
      INSERT INTO members (
        id, membershipNumber, mobileVerified, fullName, nameTamil, dob, gender, guardianName,
        occupation, education, bloodGroup, mobile, whatsapp, email, altMobile, doorNo, street,
        village, postOffice, taluk, district, state, pincode, country, aadhaarNumber, aadhaarDocUrl,
        photoUrl, categoryId, categoryName, pasaraiId, pasaraiName, paymentMethod, paymentAmount,
        paymentTransactionId, paymentDate, status, joiningDate, validityDate, rejectionReason, qrCodeData
      ) VALUES (
        ?, NULL, 1, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?,
        ?, ?, 'PENDING', ?, NULL, '', ''
      )
    `);

    stmt.run(
      id,
      appData.fullName,
      appData.nameTamil || '',
      appData.dob || '',
      appData.gender || 'Male',
      appData.guardianName || '',
      appData.occupation || '',
      appData.education || '',
      appData.bloodGroup || '',
      appData.mobile,
      appData.whatsapp || appData.mobile,
      appData.email || '',
      appData.altMobile || '',
      appData.doorNo || '',
      appData.street || '',
      appData.village || '',
      appData.postOffice || '',
      appData.taluk || '',
      appData.district || 'Chennai',
      appData.state || 'Tamil Nadu',
      appData.pincode || '',
      appData.country || 'India',
      appData.aadhaarNumber || '',
      appData.aadhaarDocUrl || '',
      appData.photoUrl || '',
      appData.categoryId || 'CAT-GEN',
      appData.categoryName || 'General Member',
      appData.pasaraiId || 'PAS-01',
      appData.pasaraiName || 'இளைஞர் பாசறை',
      appData.paymentMethod || 'UPI / GPay',
      appData.paymentAmount || 100,
      appData.paymentTransactionId || `TXN-${Date.now().toString().slice(-6)}`,
      appData.paymentDate || today,
      today
    );

    const created = db.prepare('SELECT * FROM members WHERE id = ?').get(id);

    // Trigger Payment Confirmation Email & SMS to User AND Alert to Admin
    notifyMembershipPayment({
      member: created,
      amount: created.paymentAmount,
      paymentMethod: created.paymentMethod,
      transactionId: created.paymentTransactionId
    });

    res.status(201).json({
      success: true,
      message: 'Payment confirmed. Application submitted to Admin for approval.',
      member: created
    });
  } catch (err) {
    console.error('Error creating member:', err);
    res.status(500).json({ error: 'Failed to create member application' });
  }
});

// Admin approves Member Application
app.put('/api/members/:id/approve', (req, res) => {
  try {
    const memberId = req.params.id;
    const member = db.prepare('SELECT * FROM members WHERE id = ?').get(memberId);
    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    // Generate Sequential Membership Number
    const approvedCount = db.prepare("SELECT COUNT(*) as count FROM members WHERE status = 'APPROVED'").get().count + 1;
    const seqStr = String(approvedCount).padStart(6, '0');
    
    const idFormatSetting = db.prepare("SELECT value FROM settings WHERE key = 'id_format'").get();
    const idFormat = idFormatSetting ? idFormatSetting.value : 'TS-TN-2026-{SEQ}';
    const memNum = idFormat.replace('{SEQ}', seqStr);

    const today = new Date().toISOString().split('T')[0];
    
    // Calculate validity based on category
    let valMonths = 12;
    if (member.categoryId) {
      const cat = db.prepare('SELECT validityMonths FROM categories WHERE id = ?').get(member.categoryId);
      if (cat && cat.validityMonths) valMonths = cat.validityMonths;
    }
    const expDate = new Date();
    expDate.setMonth(expDate.getMonth() + valMonths);
    const validityStr = expDate.toISOString().split('T')[0];

    const qrData = `VERIFIED|${memNum}|${member.fullName}|${member.district}|${member.categoryName}`;

    db.prepare(`
      UPDATE members SET
        status = 'APPROVED',
        membershipNumber = ?,
        joiningDate = ?,
        validityDate = ?,
        qrCodeData = ?,
        updatedAt = datetime('now', 'localtime')
      WHERE id = ?
    `).run(memNum, today, validityStr, qrData, memberId);

    const approvedMember = db.prepare('SELECT * FROM members WHERE id = ?').get(memberId);

    // Trigger Approval Notification & SMS / WhatsApp to User
    notifyMembershipApproval({ member: approvedMember });

    res.json({
      success: true,
      message: `Membership approved. Member ID assigned: ${memNum}`,
      member: approvedMember
    });
  } catch (err) {
    console.error('Error approving member:', err);
    res.status(500).json({ error: 'Failed to approve member' });
  }
});

// Admin rejects Member Application
app.put('/api/members/:id/reject', (req, res) => {
  try {
    const memberId = req.params.id;
    const { reason = 'Incomplete documentation' } = req.body;

    const member = db.prepare('SELECT * FROM members WHERE id = ?').get(memberId);
    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    db.prepare(`
      UPDATE members SET
        status = 'REJECTED',
        rejectionReason = ?,
        updatedAt = datetime('now', 'localtime')
      WHERE id = ?
    `).run(reason, memberId);

    const rejectedMember = db.prepare('SELECT * FROM members WHERE id = ?').get(memberId);

    // Trigger Rejection Notification & Message
    notifyMembershipRejection({ member: rejectedMember, reason });

    res.json({
      success: true,
      message: 'Application rejected',
      member: rejectedMember
    });
  } catch (err) {
    console.error('Error rejecting member:', err);
    res.status(500).json({ error: 'Failed to reject member' });
  }
});

// Delete member
app.delete('/api/members/:id', (req, res) => {
  try {
    const memberId = req.params.id;
    db.prepare('DELETE FROM members WHERE id = ?').run(memberId);
    res.json({ success: true, message: 'Member deleted successfully' });
  } catch (err) {
    console.error('Error deleting member:', err);
    res.status(500).json({ error: 'Failed to delete member' });
  }
});

// ==========================================
// 4. DONATIONS APIS
// ==========================================

app.get('/api/donations', (req, res) => {
  try {
    const donations = db.prepare('SELECT * FROM donations ORDER BY createdAt DESC').all();
    res.json(donations);
  } catch (err) {
    console.error('Error fetching donations:', err);
    res.status(500).json({ error: 'Failed to fetch donations' });
  }
});

app.post('/api/donations', (req, res) => {
  try {
    const data = req.body;
    const donCount = db.prepare('SELECT COUNT(*) as count FROM donations').get().count + 1;
    const seq = String(donCount).padStart(6, '0');
    const receiptNum = `TS-DON-2026-${seq}`;
    const id = `DON-${Date.now().toString().slice(-4)}`;
    const dateStr = data.date || new Date().toISOString().split('T')[0];

    const stmt = db.prepare(`
      INSERT INTO donations (id, receiptNumber, donorName, mobile, whatsapp, email, address, amount, purpose, paymentMethod, transactionId, date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      receiptNum,
      data.donorName || 'Anonymous Donor',
      data.mobile || '',
      data.whatsapp || data.mobile || '',
      data.email || '',
      data.address || '',
      parseFloat(data.amount) || 1000,
      data.purpose || 'General Sangam Social Service',
      data.paymentMethod || 'UPI',
      data.transactionId || `TXN-${Date.now().toString().slice(-8)}`,
      dateStr
    );

    const donation = db.prepare('SELECT * FROM donations WHERE id = ?').get(id);

    // Trigger Notification & Messages to Donor AND Admin
    notifyDonation({ donation });

    res.status(201).json({
      success: true,
      message: 'Donation received successfully',
      donation
    });
  } catch (err) {
    console.error('Error adding donation:', err);
    res.status(500).json({ error: 'Failed to add donation' });
  }
});

app.delete('/api/donations/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM donations WHERE id = ?').run(req.params.id);
    res.json({ success: true, message: 'Donation deleted successfully' });
  } catch (err) {
    console.error('Error deleting donation:', err);
    res.status(500).json({ error: 'Failed to delete donation' });
  }
});

// ==========================================
// 5. EVENTS APIS
// ==========================================

app.get('/api/events', (req, res) => {
  try {
    const events = db.prepare('SELECT * FROM events ORDER BY date ASC').all();
    res.json(events);
  } catch (err) {
    console.error('Error fetching events:', err);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

app.post('/api/events', (req, res) => {
  try {
    const data = req.body;
    const id = `EVT-${Date.now().toString().slice(-4)}`;
    db.prepare(`
      INSERT INTO events (id, title, titleTamil, date, time, venue, district, description, registrationFee, maxParticipants, registeredCount, bannerUrl, pasaraiId)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?)
    `).run(
      id, data.title, data.titleTamil, data.date, data.time, data.venue,
      data.district, data.description, data.registrationFee || 0,
      data.maxParticipants || 500, data.bannerUrl, data.pasaraiId || ''
    );
    const event = db.prepare('SELECT * FROM events WHERE id = ?').get(id);
    res.status(201).json(event);
  } catch (err) {
    console.error('Error adding event:', err);
    res.status(500).json({ error: 'Failed to add event' });
  }
});

app.delete('/api/events/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM events WHERE id = ?').run(req.params.id);
    res.json({ success: true, message: 'Event deleted' });
  } catch (err) {
    console.error('Error deleting event:', err);
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

// ==========================================
// 6. NEWS APIS
// ==========================================

app.get('/api/news', (req, res) => {
  try {
    const news = db.prepare('SELECT * FROM news ORDER BY date DESC').all();
    res.json(news);
  } catch (err) {
    console.error('Error fetching news:', err);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

app.post('/api/news', (req, res) => {
  try {
    const data = req.body;
    const id = `NEWS-${Date.now().toString().slice(-4)}`;
    const dateStr = data.date || new Date().toISOString().split('T')[0];
    db.prepare(`
      INSERT INTO news (id, title, titleTamil, category, date, summary, content, imageUrl)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, data.title, data.titleTamil, data.category, dateStr, data.summary, data.content, data.imageUrl);
    const item = db.prepare('SELECT * FROM news WHERE id = ?').get(id);
    res.status(201).json(item);
  } catch (err) {
    console.error('Error adding news:', err);
    res.status(500).json({ error: 'Failed to add news' });
  }
});

app.delete('/api/news/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM news WHERE id = ?').run(req.params.id);
    res.json({ success: true, message: 'News deleted' });
  } catch (err) {
    console.error('Error deleting news:', err);
    res.status(500).json({ error: 'Failed to delete news' });
  }
});

// ==========================================
// 7. CERTIFICATES APIS
// ==========================================

app.get('/api/certificates', (req, res) => {
  try {
    const certs = db.prepare('SELECT * FROM certificates ORDER BY createdAt DESC').all();
    res.json(certs);
  } catch (err) {
    console.error('Error fetching certificates:', err);
    res.status(500).json({ error: 'Failed to fetch certificates' });
  }
});

app.post('/api/certificates', (req, res) => {
  try {
    const data = req.body;
    const count = db.prepare('SELECT COUNT(*) as count FROM certificates').get().count + 1;
    const seq = String(count).padStart(5, '0');
    const certNum = `TS-CERT-2026-${seq}`;
    const id = `CERT-${Date.now().toString().slice(-4)}`;
    const qrCode = `CERT-VERIFIED|${certNum}|${data.memberName}|${data.type}`;

    db.prepare(`
      INSERT INTO certificates (id, certificateNumber, memberId, memberName, title, type, issueDate, issuedBy, description, qrCode)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id, certNum, data.memberId || '', data.memberName, data.title,
      data.type || 'APPRECIATION', data.issueDate || new Date().toISOString().split('T')[0],
      data.issuedBy || 'Tamil Sangam State Headquarters', data.description || '', qrCode
    );

    const cert = db.prepare('SELECT * FROM certificates WHERE id = ?').get(id);
    res.status(201).json(cert);
  } catch (err) {
    console.error('Error adding certificate:', err);
    res.status(500).json({ error: 'Failed to add certificate' });
  }
});

app.delete('/api/certificates/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM certificates WHERE id = ?').run(req.params.id);
    res.json({ success: true, message: 'Certificate deleted' });
  } catch (err) {
    console.error('Error deleting certificate:', err);
    res.status(500).json({ error: 'Failed to delete certificate' });
  }
});

// ==========================================
// 8. ADMIN ACCOUNTS APIS
// ==========================================

app.get('/api/admins', (req, res) => {
  try {
    const admins = db.prepare('SELECT id, name, username, role, district, createdAt FROM admins ORDER BY createdAt ASC').all();
    res.json(admins);
  } catch (err) {
    console.error('Error fetching admins:', err);
    res.status(500).json({ error: 'Failed to fetch admins' });
  }
});

app.post('/api/admins', (req, res) => {
  try {
    const data = req.body;
    const id = `ADMIN-${Date.now().toString().slice(-4)}`;
    const today = new Date().toISOString().split('T')[0];

    db.prepare(`
      INSERT INTO admins (id, name, username, password, role, district, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      id, data.name, data.username.toLowerCase().trim(),
      data.password, data.role || 'DISTRICT_ADMIN',
      data.district || 'Chennai', today
    );

    const admin = db.prepare('SELECT id, name, username, role, district, createdAt FROM admins WHERE id = ?').get(id);
    res.status(201).json(admin);
  } catch (err) {
    console.error('Error adding admin:', err);
    res.status(500).json({ error: 'Failed to add admin' });
  }
});

app.delete('/api/admins/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM admins WHERE id = ?').run(req.params.id);
    res.json({ success: true, message: 'Admin account deleted' });
  } catch (err) {
    console.error('Error deleting admin:', err);
    res.status(500).json({ error: 'Failed to delete admin' });
  }
});

// ==========================================
// 9. CATEGORIES APIS
// ==========================================

app.get('/api/categories', (req, res) => {
  try {
    const categories = db.prepare('SELECT * FROM categories').all();
    res.json(categories);
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

app.put('/api/categories/:id/fee', (req, res) => {
  try {
    const { fee } = req.body;
    db.prepare('UPDATE categories SET fee = ? WHERE id = ?').run(parseFloat(fee), req.params.id);
    res.json({ success: true, message: 'Category fee updated' });
  } catch (err) {
    console.error('Error updating category fee:', err);
    res.status(500).json({ error: 'Failed to update category fee' });
  }
});

// ==========================================
// 10. GALLERY APIS
// ==========================================

app.get('/api/gallery', (req, res) => {
  try {
    const gallery = db.prepare('SELECT * FROM gallery ORDER BY date DESC').all();
    res.json(gallery);
  } catch (err) {
    console.error('Error fetching gallery:', err);
    res.status(500).json({ error: 'Failed to fetch gallery' });
  }
});

app.post('/api/gallery', (req, res) => {
  try {
    const data = req.body;
    const id = `GAL-${Date.now().toString().slice(-4)}`;
    const dateStr = data.date || new Date().toISOString().split('T')[0];

    db.prepare(`
      INSERT INTO gallery (id, title, titleTamil, category, img, description, date)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(id, data.title, data.titleTamil || '', data.category || 'Events', data.img, data.description || '', dateStr);

    const item = db.prepare('SELECT * FROM gallery WHERE id = ?').get(id);
    res.status(201).json(item);
  } catch (err) {
    console.error('Error adding gallery item:', err);
    res.status(500).json({ error: 'Failed to add gallery item' });
  }
});

app.delete('/api/gallery/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM gallery WHERE id = ?').run(req.params.id);
    res.json({ success: true, message: 'Gallery item deleted' });
  } catch (err) {
    console.error('Error deleting gallery item:', err);
    res.status(500).json({ error: 'Failed to delete gallery item' });
  }
});

// ==========================================
// 11. PASARAI WINGS APIS
// ==========================================

app.get('/api/pasarai', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM pasarai').all();
    const wings = rows.map(r => ({
      ...r,
      officeBearers: r.officeBearers ? JSON.parse(r.officeBearers) : []
    }));
    res.json(wings);
  } catch (err) {
    console.error('Error fetching pasarai:', err);
    res.status(500).json({ error: 'Failed to fetch pasarai' });
  }
});

app.post('/api/pasarai', (req, res) => {
  try {
    const data = req.body;
    const id = data.id || `PAS-${Date.now().toString().slice(-4)}`;
    const bearers = typeof data.officeBearers === 'string' ? data.officeBearers : JSON.stringify(data.officeBearers || []);

    db.prepare(`
      INSERT INTO pasarai (id, name, nameTamil, description, descriptionTamil, officeBearers, memberCount, icon, category, image)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, data.name, data.nameTamil, data.description, data.descriptionTamil, bearers, data.memberCount || 100, data.icon || 'Users', data.category || 'Youth', data.image || '');

    const wing = db.prepare('SELECT * FROM pasarai WHERE id = ?').get(id);
    res.status(201).json({
      ...wing,
      officeBearers: wing.officeBearers ? JSON.parse(wing.officeBearers) : []
    });
  } catch (err) {
    console.error('Error adding pasarai wing:', err);
    res.status(500).json({ error: 'Failed to add wing' });
  }
});

app.delete('/api/pasarai/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM pasarai WHERE id = ?').run(req.params.id);
    res.json({ success: true, message: 'Pasarai wing deleted' });
  } catch (err) {
    console.error('Error deleting pasarai:', err);
    res.status(500).json({ error: 'Failed to delete wing' });
  }
});

// ==========================================
// 12. NOTIFICATIONS & DISPATCHED MESSAGES LOG
// ==========================================

app.get('/api/notifications', (req, res) => {
  try {
    const { mobile, role } = req.query;
    let query = 'SELECT * FROM notifications WHERE 1=1';
    const params = [];

    if (mobile) {
      query += " AND (recipientMobile = ? OR recipientMobile IS NULL OR targetRole = 'ALL')";
      params.push(mobile);
    }

    if (role) {
      query += " AND (targetRole = ? OR targetRole = 'ALL')";
      params.push(role);
    }

    query += ' ORDER BY createdAt DESC LIMIT 50';
    const notifications = db.prepare(query).all(...params);
    res.json(notifications);
  } catch (err) {
    console.error('Error fetching notifications:', err);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

app.put('/api/notifications/:id/read', (req, res) => {
  try {
    db.prepare('UPDATE notifications SET isRead = 1 WHERE id = ?').run(req.params.id);
    res.json({ success: true, message: 'Notification marked as read' });
  } catch (err) {
    console.error('Error updating notification:', err);
    res.status(500).json({ error: 'Failed to update notification' });
  }
});

// Get Live Message Audit Logs (Simulated SMS / WhatsApp / Email)
app.get('/api/messages/logs', (req, res) => {
  try {
    const logs = db.prepare('SELECT * FROM messages_log ORDER BY createdAt DESC LIMIT 100').all();
    res.json(logs);
  } catch (err) {
    console.error('Error fetching message logs:', err);
    res.status(500).json({ error: 'Failed to fetch message logs' });
  }
});

// ==========================================
// 13. CONTACT & INQUIRIES APIS
// ==========================================

// Submit new contact inquiry
app.post('/api/contact', (req, res) => {
  try {
    const { name, mobile, email, district, message } = req.body;
    if (!name || !mobile || !message) {
      return res.status(400).json({ error: 'Name, mobile and message are required' });
    }

    const id = `INQ-${Date.now().toString().slice(-6)}`;
    db.prepare(`
      INSERT INTO contact_messages (id, name, mobile, email, district, message, status)
      VALUES (?, ?, ?, ?, ?, ?, 'NEW')
    `).run(id, name.trim(), mobile.trim(), email?.trim() || '', district || 'Tamil Nadu', message.trim());

    // Notification for Admin
    createNotification({
      title: 'New Help & Contact Inquiry',
      message: `Inquiry #${id} from ${name} (${district || 'Tamil Nadu'}, ${mobile}): "${message.slice(0, 50)}..."`,
      type: 'SYSTEM',
      recipientMobile: mobile,
      targetRole: 'ADMIN'
    });

    // SMS/WhatsApp acknowledgement log for User
    dispatchMessage({
      recipient: mobile,
      recipientType: 'USER',
      channel: 'SMS',
      subject: 'Tamil Sangam Help Desk Acknowledgement',
      message: `[தமிழ் சங்கம் தமிழ்நாடு] வணக்கம் ${name}! உங்களின் செய்தி பெறப்பட்டது (குறிப்பு எண்: ${id}). எங்கள் மாநில தலைமைச் செயலகம் விரைவில் தொடர்பு கொள்ளும். / Thank you ${name}! Your inquiry ${id} has been registered.`
    });

    res.status(201).json({
      success: true,
      message: 'Inquiry submitted successfully',
      id
    });
  } catch (err) {
    console.error('Error in post contact:', err);
    res.status(500).json({ error: 'Failed to submit contact message' });
  }
});

// Get all contact messages for admin
app.get('/api/contact', (req, res) => {
  try {
    const messages = db.prepare('SELECT * FROM contact_messages ORDER BY createdAt DESC').all();
    res.json(messages);
  } catch (err) {
    console.error('Error fetching contact messages:', err);
    res.status(500).json({ error: 'Failed to fetch contact messages' });
  }
});

// Resolve contact message
app.put('/api/contact/:id/resolve', (req, res) => {
  try {
    db.prepare("UPDATE contact_messages SET status = 'RESOLVED' WHERE id = ?").run(req.params.id);
    res.json({ success: true, message: 'Inquiry marked as resolved' });
  } catch (err) {
    console.error('Error resolving contact message:', err);
    res.status(500).json({ error: 'Failed to resolve inquiry' });
  }
});

// Delete contact message
app.delete('/api/contact/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM contact_messages WHERE id = ?').run(req.params.id);
    res.json({ success: true, message: 'Inquiry deleted' });
  } catch (err) {
    console.error('Error deleting contact message:', err);
    res.status(500).json({ error: 'Failed to delete inquiry' });
  }
});

// Static production assets & SPA fallback
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.redirect('/api');
  });
}

// Start Express Server
app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 Tamil Sangam Backend Server running on port ${PORT}`);
  console.log(`📦 Database: SQLite connected at server/data/tamil_sangam.db`);
  console.log(`🔗 Web Application: http://localhost:${PORT}`);
  console.log(`🔗 API Dashboard:   http://localhost:${PORT}/api`);
  console.log(`🔗 Health Check:     http://localhost:${PORT}/api/health`);
  console.log(`======================================================\n`);
});
