import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'tamil_sangam.db');
const db = new DatabaseSync(dbPath);

// Enable WAL mode & foreign keys
db.exec('PRAGMA journal_mode = WAL;');
db.exec('PRAGMA foreign_keys = ON;');

// Initialize Tables
export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS members (
      id TEXT PRIMARY KEY,
      membershipNumber TEXT UNIQUE,
      mobileVerified INTEGER DEFAULT 1,
      fullName TEXT NOT NULL,
      nameTamil TEXT,
      dob TEXT,
      gender TEXT,
      guardianName TEXT,
      occupation TEXT,
      education TEXT,
      bloodGroup TEXT,
      mobile TEXT NOT NULL,
      whatsapp TEXT,
      email TEXT,
      altMobile TEXT,
      doorNo TEXT,
      street TEXT,
      village TEXT,
      postOffice TEXT,
      taluk TEXT,
      district TEXT NOT NULL,
      state TEXT DEFAULT 'Tamil Nadu',
      pincode TEXT,
      country TEXT DEFAULT 'India',
      aadhaarNumber TEXT,
      aadhaarDocUrl TEXT,
      photoUrl TEXT,
      categoryId TEXT,
      categoryName TEXT,
      pasaraiId TEXT,
      pasaraiName TEXT,
      paymentMethod TEXT,
      paymentAmount REAL DEFAULT 0,
      paymentTransactionId TEXT,
      paymentDate TEXT,
      status TEXT DEFAULT 'PENDING',
      joiningDate TEXT,
      validityDate TEXT,
      rejectionReason TEXT,
      qrCodeData TEXT,
      createdAt TEXT DEFAULT (datetime('now', 'localtime')),
      updatedAt TEXT DEFAULT (datetime('now', 'localtime'))
    );

    CREATE INDEX IF NOT EXISTS idx_members_mobile ON members(mobile);
    CREATE INDEX IF NOT EXISTS idx_members_district ON members(district);
    CREATE INDEX IF NOT EXISTS idx_members_status ON members(status);

    CREATE TABLE IF NOT EXISTS donations (
      id TEXT PRIMARY KEY,
      receiptNumber TEXT UNIQUE NOT NULL,
      donorName TEXT NOT NULL,
      mobile TEXT,
      whatsapp TEXT,
      email TEXT,
      address TEXT,
      amount REAL NOT NULL,
      purpose TEXT,
      paymentMethod TEXT,
      transactionId TEXT,
      date TEXT,
      createdAt TEXT DEFAULT (datetime('now', 'localtime'))
    );

    CREATE TABLE IF NOT EXISTS events (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      titleTamil TEXT,
      date TEXT,
      time TEXT,
      venue TEXT,
      district TEXT,
      description TEXT,
      registrationFee REAL DEFAULT 0,
      maxParticipants INTEGER DEFAULT 500,
      registeredCount INTEGER DEFAULT 0,
      bannerUrl TEXT,
      pasaraiId TEXT,
      createdAt TEXT DEFAULT (datetime('now', 'localtime'))
    );

    CREATE TABLE IF NOT EXISTS news (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      titleTamil TEXT,
      category TEXT,
      date TEXT,
      summary TEXT,
      content TEXT,
      imageUrl TEXT,
      createdAt TEXT DEFAULT (datetime('now', 'localtime'))
    );

    CREATE TABLE IF NOT EXISTS certificates (
      id TEXT PRIMARY KEY,
      certificateNumber TEXT UNIQUE NOT NULL,
      memberId TEXT,
      memberName TEXT NOT NULL,
      title TEXT NOT NULL,
      type TEXT,
      issueDate TEXT,
      issuedBy TEXT,
      description TEXT,
      qrCode TEXT,
      createdAt TEXT DEFAULT (datetime('now', 'localtime'))
    );

    CREATE TABLE IF NOT EXISTS admins (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL,
      district TEXT NOT NULL,
      createdAt TEXT DEFAULT (datetime('now', 'localtime'))
    );

    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      nameTamil TEXT,
      fee REAL NOT NULL,
      validityMonths INTEGER NOT NULL,
      description TEXT
    );

    CREATE TABLE IF NOT EXISTS gallery (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      titleTamil TEXT,
      category TEXT,
      img TEXT NOT NULL,
      description TEXT,
      date TEXT,
      createdAt TEXT DEFAULT (datetime('now', 'localtime'))
    );

    CREATE TABLE IF NOT EXISTS pasarai (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      nameTamil TEXT,
      description TEXT,
      descriptionTamil TEXT,
      officeBearers TEXT,
      memberCount INTEGER DEFAULT 0,
      icon TEXT,
      category TEXT,
      image TEXT
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      type TEXT NOT NULL,
      recipientMobile TEXT,
      recipientEmail TEXT,
      targetRole TEXT DEFAULT 'ALL',
      isRead INTEGER DEFAULT 0,
      date TEXT,
      createdAt TEXT DEFAULT (datetime('now', 'localtime'))
    );

    CREATE TABLE IF NOT EXISTS messages_log (
      id TEXT PRIMARY KEY,
      recipient TEXT NOT NULL,
      recipientType TEXT NOT NULL, -- 'USER' | 'ADMIN'
      channel TEXT NOT NULL,      -- 'SMS' | 'WHATSAPP' | 'EMAIL'
      subject TEXT,
      message TEXT NOT NULL,
      status TEXT DEFAULT 'SENT', -- 'SENT' | 'DELIVERED'
      createdAt TEXT DEFAULT (datetime('now', 'localtime'))
    );

    CREATE TABLE IF NOT EXISTS otps (
      id TEXT PRIMARY KEY,
      mobile TEXT NOT NULL,
      otp TEXT NOT NULL,
      purpose TEXT NOT NULL, -- 'LOGIN' | 'REGISTRATION'
      expiresAt INTEGER NOT NULL,
      verified INTEGER DEFAULT 0,
      createdAt TEXT DEFAULT (datetime('now', 'localtime'))
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT
    );

    CREATE TABLE IF NOT EXISTS contact_messages (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      mobile TEXT NOT NULL,
      email TEXT,
      district TEXT NOT NULL,
      message TEXT NOT NULL,
      status TEXT DEFAULT 'NEW',
      createdAt TEXT DEFAULT (datetime('now', 'localtime'))
    );
  `);

  seedInitialData();
}

// Seed initial system data if tables are empty
function seedInitialData() {
  const adminCount = db.prepare('SELECT COUNT(*) as count FROM admins').get();
  if (adminCount.count === 0) {
    const insertAdmin = db.prepare(`
      INSERT INTO admins (id, name, username, password, role, district, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const defaultAdmins = [
      { id: 'ADMIN-01', name: 'State HQ Super Admin', username: 'superadmin', password: 'p@$$word', role: 'SUPER_ADMIN', district: 'ALL', createdAt: '2026-01-01' },
      { id: 'ADMIN-02', name: 'Madurai District Admin', username: 'maduraiadmin', password: 'p@$$word', role: 'DISTRICT_ADMIN', district: 'Madurai', createdAt: '2026-01-05' },
      { id: 'ADMIN-03', name: 'Chennai District Admin', username: 'chennaiadmin', password: 'p@$$word', role: 'DISTRICT_ADMIN', district: 'Chennai', createdAt: '2026-01-05' },
      { id: 'ADMIN-04', name: 'Coimbatore District Admin', username: 'coimbatoreadmin', password: 'p@$$word', role: 'DISTRICT_ADMIN', district: 'Coimbatore', createdAt: '2026-01-05' },
      { id: 'ADMIN-05', name: 'Tiruchirappalli District Admin', username: 'trichyadmin', password: 'p@$$word', role: 'DISTRICT_ADMIN', district: 'Tiruchirappalli', createdAt: '2026-01-05' },
    ];

    for (const admin of defaultAdmins) {
      insertAdmin.run(admin.id, admin.name, admin.username, admin.password, admin.role, admin.district, admin.createdAt);
    }
  }

  // Categories
  const catCount = db.prepare('SELECT COUNT(*) as count FROM categories').get();
  if (catCount.count === 0) {
    const insertCat = db.prepare(`
      INSERT INTO categories (id, name, nameTamil, fee, validityMonths, description)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const defaultCats = [
      { id: 'CAT-GEN', name: 'General Member', nameTamil: 'பொது உறுப்பினர்', fee: 100, validityMonths: 12, description: 'Standard annual membership with access to all Sangam activities and newsletters.' },
      { id: 'CAT-LIFE', name: 'Life Member', nameTamil: 'ஆயுள் உறுப்பினர்', fee: 1000, validityMonths: 120, description: 'Lifetime membership with voting rights in general body and priority event access.' },
      { id: 'CAT-STU', name: 'Student Member', nameTamil: 'மாணவர் உறுப்பினர்', fee: 50, validityMonths: 12, description: 'Discounted membership for active school/college students.' },
      { id: 'CAT-YOUTH', name: 'Youth Member', nameTamil: 'இளைஞர் உறுப்பினர்', fee: 100, validityMonths: 12, description: 'For members aged 18 to 35 actively engaged in youth development.' },
      { id: 'CAT-WOMEN', name: 'Women Member', nameTamil: 'மகளிர் உறுப்பினர்', fee: 100, validityMonths: 12, description: 'Dedicated membership empowering women in culture and social causes.' },
      { id: 'CAT-SENIOR', name: 'Senior Member', nameTamil: 'மூத்த உறுப்பினர்', fee: 50, validityMonths: 12, description: 'For senior citizens (aged 60+) with special recognition.' },
      { id: 'CAT-PROF', name: 'Professional Member', nameTamil: 'தொழில்முறை உறுப்பினர்', fee: 500, validityMonths: 12, description: 'For doctors, engineers, lawyers, IT professionals, and executives.' },
      { id: 'CAT-INST', name: 'Institutional Member', nameTamil: 'நிறுவன உறுப்பினர்', fee: 5000, validityMonths: 12, description: 'For registered organisations, colleges, and literary societies.' },
    ];
    for (const c of defaultCats) {
      insertCat.run(c.id, c.name, c.nameTamil, c.fee, c.validityMonths, c.description);
    }
  }

  // Initial Members
  const memCount = db.prepare('SELECT COUNT(*) as count FROM members').get();
  if (memCount.count === 0) {
    const insertMember = db.prepare(`
      INSERT INTO members (
        id, membershipNumber, mobileVerified, fullName, nameTamil, dob, gender, guardianName,
        occupation, education, bloodGroup, mobile, whatsapp, email, altMobile, doorNo, street,
        village, postOffice, taluk, district, state, pincode, country, aadhaarNumber, aadhaarDocUrl,
        photoUrl, categoryId, categoryName, pasaraiId, pasaraiName, paymentMethod, paymentAmount,
        paymentTransactionId, paymentDate, status, joiningDate, validityDate, rejectionReason, qrCodeData
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
      )
    `);

    const initialMembers = [
      {
        id: 'APP-1001',
        membershipNumber: 'TS-TN-2026-000001',
        mobileVerified: 1,
        fullName: 'Sundaram Ramachandran',
        nameTamil: 'சுந்தரம் இராமச்சந்திரன்',
        dob: '1985-06-15',
        gender: 'Male',
        guardianName: 'Ramachandran Iyer',
        occupation: 'Senior Software Engineer',
        education: 'M.Tech Computer Science',
        bloodGroup: 'O+',
        mobile: '9840123456',
        whatsapp: '9840123456',
        email: 'sundaram.r@gmail.com',
        altMobile: '',
        doorNo: '42/1',
        street: 'Anna Salai',
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
        categoryId: 'CAT-LIFE',
        categoryName: 'Life Member',
        pasaraiId: 'PAS-06',
        pasaraiName: 'தகவல் தொழில்நுட்பப் பாசறை',
        paymentMethod: 'UPI / GPay',
        paymentAmount: 1000,
        paymentTransactionId: 'GPI9842109581',
        paymentDate: '2026-01-10',
        status: 'APPROVED',
        joiningDate: '2026-01-10',
        validityDate: '2036-01-10',
        rejectionReason: '',
        qrCodeData: 'TS-TN-2026-000001|Sundaram Ramachandran|Chennai|CAT-LIFE'
      },
      {
        id: 'APP-1002',
        membershipNumber: 'TS-TN-2026-000002',
        mobileVerified: 1,
        fullName: 'Kavitha Thangaraj',
        nameTamil: 'கவிதா தங்கராஜ்',
        dob: '1992-09-22',
        gender: 'Female',
        guardianName: 'Thangaraj M',
        occupation: 'Professor of Tamil Literature',
        education: 'Ph.D Tamil Literature',
        bloodGroup: 'A+',
        mobile: '9789012345',
        whatsapp: '9789012345',
        email: 'kavitha.tamil@maduraicollege.edu.in',
        altMobile: '',
        doorNo: '18B',
        street: 'KK Nagar Main Road',
        village: 'KK Nagar',
        postOffice: 'KK Nagar',
        taluk: 'Madurai South',
        district: 'Madurai',
        state: 'Tamil Nadu',
        pincode: '625020',
        country: 'India',
        aadhaarNumber: '4567-8901-2345',
        aadhaarDocUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80',
        photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
        categoryId: 'CAT-PROF',
        categoryName: 'Professional Member',
        pasaraiId: 'PAS-05',
        pasaraiName: 'இலக்கியப் பாசறை',
        paymentMethod: 'Net Banking',
        paymentAmount: 500,
        paymentTransactionId: 'NETB-882194012',
        paymentDate: '2026-01-12',
        status: 'APPROVED',
        joiningDate: '2026-01-12',
        validityDate: '2027-01-12',
        rejectionReason: '',
        qrCodeData: 'TS-TN-2026-000002|Kavitha Thangaraj|Madurai|CAT-PROF'
      },
      {
        id: 'APP-1003',
        membershipNumber: null,
        mobileVerified: 1,
        fullName: 'Arun Kumar Selvam',
        nameTamil: 'அருண் குமார் செல்வம்',
        dob: '1998-11-04',
        gender: 'Male',
        guardianName: 'Selvam K',
        occupation: 'Mechanical Engineer',
        education: 'B.E Mechanical',
        bloodGroup: 'B+',
        mobile: '9944012345',
        whatsapp: '9944012345',
        email: 'arun.selvam98@gmail.com',
        altMobile: '',
        doorNo: '75',
        street: 'Gandhi Road',
        village: 'RS Puram',
        postOffice: 'RS Puram HO',
        taluk: 'Coimbatore South',
        district: 'Coimbatore',
        state: 'Tamil Nadu',
        pincode: '641002',
        country: 'India',
        aadhaarNumber: '9012-3456-7890',
        aadhaarDocUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
        categoryId: 'CAT-YOUTH',
        categoryName: 'Youth Member',
        pasaraiId: 'PAS-01',
        pasaraiName: 'இளைஞர் பாசறை',
        paymentMethod: 'UPI / PhonePe',
        paymentAmount: 100,
        paymentTransactionId: 'UPI-7719284102',
        paymentDate: '2026-01-18',
        status: 'PENDING',
        joiningDate: null,
        validityDate: null,
        rejectionReason: '',
        qrCodeData: null
      }
    ];

    for (const m of initialMembers) {
      insertMember.run(
        m.id, m.membershipNumber, m.mobileVerified, m.fullName, m.nameTamil, m.dob, m.gender, m.guardianName,
        m.occupation, m.education, m.bloodGroup, m.mobile, m.whatsapp, m.email, m.altMobile, m.doorNo, m.street,
        m.village, m.postOffice, m.taluk, m.district, m.state, m.pincode, m.country, m.aadhaarNumber, m.aadhaarDocUrl,
        m.photoUrl, m.categoryId, m.categoryName, m.pasaraiId, m.pasaraiName, m.paymentMethod, m.paymentAmount,
        m.paymentTransactionId, m.paymentDate, m.status, m.joiningDate, m.validityDate, m.rejectionReason, m.qrCodeData
      );
    }
  }

  // Initial Donations
  const donCount = db.prepare('SELECT COUNT(*) as count FROM donations').get();
  if (donCount.count === 0) {
    const insertDonation = db.prepare(`
      INSERT INTO donations (id, receiptNumber, donorName, mobile, whatsapp, email, address, amount, purpose, paymentMethod, transactionId, date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const initialDonations = [
      { id: 'DON-01', receiptNumber: 'TS-DON-2026-000001', donorName: 'Dr. M. Sivasankaran', mobile: '9840112233', whatsapp: '9840112233', email: 'sivasankaran.m@gmail.com', address: 'Plot 12, Anna Nagar West, Chennai', amount: 25000, purpose: 'Sangam Literature Archival & Rare Manuscript Preservation', paymentMethod: 'Net Banking NEFT', transactionId: 'NEFT-88129038', date: '2026-01-05' },
      { id: 'DON-02', receiptNumber: 'TS-DON-2026-000002', donorName: 'Mrs. Jayanthi Natarajan', mobile: '9444123456', whatsapp: '9444123456', email: 'jayanthi.natarajan@yahoo.co.in', address: '45, West Masi Street, Madurai', amount: 10000, purpose: 'Thirukkural Youth Olympiad Prizes', paymentMethod: 'UPI / GPay', transactionId: 'UPI-77129034', date: '2026-01-08' },
      { id: 'DON-03', receiptNumber: 'TS-DON-2026-000003', donorName: 'Er. R. Venkatesh', mobile: '9884056789', whatsapp: '9884056789', email: 'venkatesh.r@techcorp.com', address: 'Cross Cut Road, Gandhipuram, Coimbatore', amount: 5000, purpose: 'Free Rural Student Tamil Computing Software Kit', paymentMethod: 'Credit Card', transactionId: 'CC-99120485', date: '2026-01-14' },
    ];

    for (const d of initialDonations) {
      insertDonation.run(d.id, d.receiptNumber, d.donorName, d.mobile, d.whatsapp, d.email, d.address, d.amount, d.purpose, d.paymentMethod, d.transactionId, d.date);
    }
  }

  // Initial Events
  const evtCount = db.prepare('SELECT COUNT(*) as count FROM events').get();
  if (evtCount.count === 0) {
    const insertEvent = db.prepare(`
      INSERT INTO events (id, title, titleTamil, date, time, venue, district, description, registrationFee, maxParticipants, registeredCount, bannerUrl, pasaraiId)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const initialEvents = [
      { id: 'EVT-01', title: 'World Tamil Sangam Literary Conclave 2026', titleTamil: 'உலகத் தமிழ் சங்க இலக்கிய மாநாடு 2026', date: '2026-04-14', time: '09:30 AM', venue: 'Madurai World Tamil Sangam Auditorium', district: 'Madurai', description: 'Annual grand gathering of Tamil researchers, poets, and overseas Sangam representatives focusing on ancient Sangam poetry and global Tamil heritage.', registrationFee: 0, maxParticipants: 1200, registeredCount: 840, bannerUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80', pasaraiId: 'PAS-05' },
      { id: 'EVT-02', title: 'All Tamil Nadu Thirukkural Recitation Championship', titleTamil: 'அனைத்து தமிழ்நாடு திருக்குறள் முற்றோதல் பெருவிழா', date: '2026-05-01', time: '10:00 AM', venue: 'Kalaivanar Arangam, Wallajah Road', district: 'Chennai', description: 'State-level championship for students and youth with cash awards totaling 10 Lakhs, gold medals, and state honours for reciting all 1330 kurals.', registrationFee: 0, maxParticipants: 600, registeredCount: 490, bannerUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80', pasaraiId: 'PAS-03' },
    ];

    for (const e of initialEvents) {
      insertEvent.run(e.id, e.title, e.titleTamil, e.date, e.time, e.venue, e.district, e.description, e.registrationFee, e.maxParticipants, e.registeredCount, e.bannerUrl, e.pasaraiId);
    }
  }

  // Initial News
  const newsCount = db.prepare('SELECT COUNT(*) as count FROM news').get();
  if (newsCount.count === 0) {
    const insertNews = db.prepare(`
      INSERT INTO news (id, title, titleTamil, category, date, summary, content, imageUrl)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const initialNews = [
      { id: 'NEWS-01', title: 'Statewide Digital Membership Drive Surpasses 1 Lakh Target', titleTamil: 'மாநில அளவிலான டிஜிட்டல் உறுப்பினர் சேர்க்கை 1 லட்சத்தை கடந்தது', category: 'Press Release', date: '2026-02-01', summary: 'Tamil Sangam achieves major historical milestone as verified digital members with smart QR cards cross 1,00,000 across 38 districts.', content: 'Tamil Sangam – Tamil Nadu has officially crossed 1,00,000 digital members across all 38 revenue districts of Tamil Nadu. The state executive council extends hearty congratulations to all district secretaries, taluk coordinators, and youth wing volunteers.', imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80' },
      { id: 'NEWS-02', title: 'Smart ID Card Delivery via India Post Speed Post Launched', titleTamil: 'இந்தியா போஸ்ட் ஸ்பீட் போஸ்ட் மூலம் ஸ்மார்ட் அட்டை விநியோகம் தொடக்கம்', category: 'Announcement', date: '2026-01-28', summary: 'Approved members can now receive NFC-enabled smart PVC membership cards dispatched directly to their registered residential address.', content: 'All approved life and general members will now receive official PVC Smart Cards via India Post Speed Post within 7 working days of application approval. Real-time postal tracking will be updated in the Member Dashboard.', imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80' }
    ];

    for (const n of initialNews) {
      insertNews.run(n.id, n.title, n.titleTamil, n.category, n.date, n.summary, n.content, n.imageUrl);
    }
  }

  // Initial Certificates
  const certCount = db.prepare('SELECT COUNT(*) as count FROM certificates').get();
  if (certCount.count === 0) {
    const insertCert = db.prepare(`
      INSERT INTO certificates (id, certificateNumber, memberId, memberName, title, type, issueDate, issuedBy, description, qrCode)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const initialCerts = [
      { id: 'CERT-01', certificateNumber: 'TS-CERT-2026-00001', memberId: 'TS-TN-2026-000001', memberName: 'Sundaram Ramachandran', title: 'Distinguished Life Member & Digital Portal Contributor', type: 'APPRECIATION', issueDate: '2026-01-15', issuedBy: 'Tamil Sangam State Headquarters, Chennai', description: 'Conferred in recognition of distinguished service in building community software tools and lifelong commitment to Tamil heritage.', qrCode: 'CERT-VERIFIED|TS-CERT-2026-00001|Sundaram Ramachandran|APPRECIATION' },
      { id: 'CERT-02', certificateNumber: 'TS-CERT-2026-00002', memberId: 'TS-TN-2026-000002', memberName: 'Kavitha Thangaraj', title: 'Excellence in Sangam Literature Research Award', type: 'HONORARY', issueDate: '2026-01-20', issuedBy: 'Madurai District Executive Council', description: 'Awarded for extraordinary scholarly research on Sangam landscape poetry and active community mentorship.', qrCode: 'CERT-VERIFIED|TS-CERT-2026-00002|Kavitha Thangaraj|HONORARY' }
    ];

    for (const c of initialCerts) {
      insertCert.run(c.id, c.certificateNumber, c.memberId, c.memberName, c.title, c.type, c.issueDate, c.issuedBy, c.description, c.qrCode);
    }
  }

  // Initial Gallery
  const galCount = db.prepare('SELECT COUNT(*) as count FROM gallery').get();
  if (galCount.count === 0) {
    const insertGal = db.prepare(`
      INSERT INTO gallery (id, title, titleTamil, category, img, description, date)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const initialGallery = [
      { id: 'GAL-01', title: 'Madurai Meenakshi Temple & Golden Pond', titleTamil: 'மதுரை மீனாட்சி அம்மன் கோயில் & பொற்றாமரைக் குளம்', category: 'Culture', img: '/hero-temple.jpg', description: 'Heritage Sangam site', date: '2026-01-15' },
      { id: 'GAL-02', title: 'Madurai Temple Chariot Festival', titleTamil: 'மதுரை கோயில் தேரோட்டம்', category: 'Events', img: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?q=80&w=800&auto=format&fit=crop', description: 'Chariot festival gathering', date: '2026-01-18' },
      { id: 'GAL-03', title: 'Classical Bharatanatyam Recital', titleTamil: 'பாரம்பரிய பரதநாட்டிய அரங்கேற்றம்', category: 'Culture', img: 'https://images.unsplash.com/photo-1601972599720-36938d4ecd31?q=80&w=800&auto=format&fit=crop', description: 'Annual cultural festival recital', date: '2026-01-20' },
      { id: 'GAL-04', title: 'Tree Sapling Plantation Drive', titleTamil: 'மரக்கன்றுகள் நடும் பசுமை இயக்கம்', category: 'Welfare', img: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=800&auto=format&fit=crop', description: '10,000 saplings planted across districts', date: '2026-01-22' }
    ];

    for (const g of initialGallery) {
      insertGal.run(g.id, g.title, g.titleTamil, g.category, g.img, g.description, g.date);
    }
  }

  // Initial Pasarai Wings
  const pasCount = db.prepare('SELECT COUNT(*) as count FROM pasarai').get();
  if (pasCount.count === 0) {
    const insertPas = db.prepare(`
      INSERT INTO pasarai (id, name, nameTamil, description, descriptionTamil, officeBearers, memberCount, icon, category, image)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const defaultWings = [
      { id: 'PAS-01', name: 'Youth Wing', nameTamil: 'இளைஞர் பாசறை', description: 'Empowering young minds through sports and leadership training.', descriptionTamil: 'விளையாட்டு மற்றும் தலைமைத்துவ பயிற்சி மூலம் இளைஞர்களை ஊக்குவித்தல்.', officeBearers: JSON.stringify([{ title: 'State Secretary', name: 'K. Senthil Kumar', mobile: '+91 98765 43210' }]), memberCount: 8450, icon: 'Users', category: 'Youth & Leadership', image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=800&auto=format&fit=crop' },
      { id: 'PAS-02', name: 'Women Wing', nameTamil: 'மகளிர் பாசறை', description: 'Fostering women entrepreneurship and cultural leadership.', descriptionTamil: 'பெண்கள் தொழில்முனைவு மற்றும் கலாச்சார தலைமையினை வளர்த்தல்.', officeBearers: JSON.stringify([{ title: 'State President', name: 'Dr. S. Kanimozhi', mobile: '+91 98765 43212' }]), memberCount: 6820, icon: 'HeartHandshake', category: 'Women Empowerment', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop' },
      { id: 'PAS-03', name: 'Student Wing', nameTamil: 'மாணவர் பாசறை', description: 'Supporting students with scholarships and career guidance.', descriptionTamil: 'மாணவர்களுக்கு கல்வி உதவித்தொகை மற்றும் வழிகாட்டுதல் வழங்குதல்.', officeBearers: JSON.stringify([{ title: 'State Convenor', name: 'V. Karthik', mobile: '+91 98765 43214' }]), memberCount: 11200, icon: 'GraduationCap', category: 'Education', image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop' },
      { id: 'PAS-05', name: 'Literature Wing', nameTamil: 'இலக்கியப் பாசறை', description: 'Promoting Sangam literature and Thirukkural symposiums.', descriptionTamil: 'சங்க இலக்கியம் மற்றும் திருக்குறள் கருத்தரங்குகளை ஊக்குவித்தல்.', officeBearers: JSON.stringify([{ title: 'Chief Advisor', name: 'Prof. N. Muthusamy', mobile: '+91 98765 43216' }]), memberCount: 3900, icon: 'BookOpen', category: 'Literature', image: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=800&auto=format&fit=crop' },
      { id: 'PAS-06', name: 'IT & Technology Wing', nameTamil: 'தகவல் தொழில்நுட்பப் பாசறை', description: 'Advancing Tamil computing and tech mentorship.', descriptionTamil: 'தமிழ் கணிமை மற்றும் தொழில்நுட்ப வழிகாட்டுதல்.', officeBearers: JSON.stringify([{ title: 'State Lead', name: 'Er. Sundararajan R.', mobile: '+91 98765 43217' }]), memberCount: 5100, icon: 'Cpu', category: 'Technology', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop' },
    ];

    for (const w of defaultWings) {
      insertPas.run(w.id, w.name, w.nameTamil, w.description, w.descriptionTamil, w.officeBearers, w.memberCount, w.icon, w.category, w.image);
    }
  }

  // ID Format setting
  const idFormatSetting = db.prepare('SELECT value FROM settings WHERE key = ?').get('id_format');
  if (!idFormatSetting) {
    db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)').run('id_format', 'TS-TN-2026-{SEQ}');
  }
}

// Export raw db and helper queries
export { db };
