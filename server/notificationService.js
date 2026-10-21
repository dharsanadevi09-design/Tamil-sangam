import { db } from './db.js';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

// Helper to read dynamic settings from SQLite database
export function getSetting(key) {
  try {
    const row = db.prepare('SELECT value FROM settings WHERE key = ?').get(key);
    return row ? row.value : null;
  } catch {
    return null;
  }
}

// Helper to save dynamic settings to SQLite database
export function setSetting(key, value) {
  try {
    db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)').run(key, value);
    return true;
  } catch {
    return false;
  }
}

// Create Nodemailer Transporter if SMTP credentials exist
let emailTransporter = null;
const smtpHost = process.env.SMTP_HOST || getSetting('smtp_host');
const smtpUser = process.env.SMTP_USER || getSetting('smtp_user');
const smtpPass = process.env.SMTP_PASS || getSetting('smtp_pass');

if (smtpHost && smtpUser && smtpPass) {
  try {
    emailTransporter = nodemailer.createTransport({
      host: smtpHost,
      port: Number(process.env.SMTP_PORT || getSetting('smtp_port')) || 587,
      secure: process.env.SMTP_SECURE === 'true' || getSetting('smtp_secure') === 'true',
      auth: {
        user: smtpUser,
        pass: smtpPass
      }
    });
    console.log('📧 SMTP Email Transporter configured successfully');
  } catch (err) {
    console.warn('⚠️ SMTP Email Transporter setup error:', err.message);
  }
}

// ----------------------------------------------------
// 1. FAST2SMS Integration (Instant Indian Mobile SMS)
// ----------------------------------------------------
async function sendViaFast2Sms({ mobile, otp, message }) {
  const apiKey = process.env.FAST2SMS_API_KEY || getSetting('fast2sms_api_key');
  if (!apiKey) return false;

  const cleanMobile = mobile.replace(/\D/g, '').slice(-10);
  if (cleanMobile.length !== 10) return false;

  try {
    // Fast2SMS Quick OTP route
    const payload = otp
      ? { variables_values: otp, route: 'otp', numbers: cleanMobile }
      : { message: message, language: 'english', route: 'q', numbers: cleanMobile };

    const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
      method: 'POST',
      headers: {
        'authorization': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    console.log(`📱 [Fast2SMS Live Dispatch] To: ${cleanMobile} | Status:`, data.message || data);
    return data.return === true;
  } catch (err) {
    console.warn(`⚠️ Fast2SMS delivery error to ${cleanMobile}:`, err.message);
    return false;
  }
}

// ----------------------------------------------------
// 2. 2FACTOR Integration (Instant Indian Mobile SMS OTP)
// ----------------------------------------------------
async function sendVia2Factor({ mobile, otp }) {
  const apiKey = process.env.TWOFACTOR_API_KEY || getSetting('twofactor_api_key');
  if (!apiKey || !otp) return false;

  const cleanMobile = mobile.replace(/\D/g, '').slice(-10);
  if (cleanMobile.length !== 10) return false;

  try {
    const url = `https://2factor.in/API/V1/${apiKey}/SMS/${cleanMobile}/${otp}/TamilSangam`;
    const response = await fetch(url, { method: 'GET' });
    const data = await response.json();
    console.log(`📱 [2Factor Live Dispatch] To: ${cleanMobile} | Status:`, data.Status || data);
    return data.Status === 'Success';
  } catch (err) {
    console.warn(`⚠️ 2Factor delivery error to ${cleanMobile}:`, err.message);
    return false;
  }
}

// ----------------------------------------------------
// 3. TWILIO Integration (Global Mobile SMS)
// ----------------------------------------------------
async function sendViaTwilio({ mobile, message }) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID || getSetting('twilio_account_sid');
  const authToken = process.env.TWILIO_AUTH_TOKEN || getSetting('twilio_auth_token');
  const fromPhone = process.env.TWILIO_PHONE_NUMBER || getSetting('twilio_phone_number');

  if (!accountSid || !authToken || !fromPhone) return false;

  const cleanMobile = mobile.replace(/\D/g, '').slice(-10);
  const toPhone = cleanMobile.length === 10 ? `+91${cleanMobile}` : `+${cleanMobile}`;

  try {
    const params = new URLSearchParams({
      To: toPhone,
      From: fromPhone,
      Body: message
    });

    const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    });

    const data = await response.json();
    console.log(`📱 [Twilio Live Dispatch] To: ${toPhone} | Status:`, data.sid || data.message);
    return !data.error_code;
  } catch (err) {
    console.warn(`⚠️ Twilio delivery error to ${toPhone}:`, err.message);
    return false;
  }
}

// ----------------------------------------------------
// 4. Dispatch SMS / WhatsApp / Email
// ----------------------------------------------------
export async function dispatchMessage({ recipient, recipientType = 'USER', channel = 'SMS', subject = '', message, html = '' }) {
  const id = `MSG-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  
  try {
    const stmt = db.prepare(`
      INSERT INTO messages_log (id, recipient, recipientType, channel, subject, message, status)
      VALUES (?, ?, ?, ?, ?, ?, 'SENT')
    `);
    stmt.run(id, recipient, recipientType, channel, subject, message);
  } catch (dbErr) {
    console.warn('Failed to insert message into messages_log:', dbErr.message);
  }

  // A. REAL SMS DISPATCH (Fast2SMS, 2Factor, or Twilio)
  if (channel === 'SMS') {
    const cleanMobile = recipient.replace(/\D/g, '').slice(-10);
    const otpMatch = message.match(/\b\d{6}\b/)?.[0] || '';

    let delivered = false;
    if (cleanMobile.length === 10) {
      delivered = await sendViaFast2Sms({ mobile: cleanMobile, otp: otpMatch, message });
      if (!delivered && otpMatch) {
        delivered = await sendVia2Factor({ mobile: cleanMobile, otp: otpMatch });
      }
      if (!delivered) {
        delivered = await sendViaTwilio({ mobile: cleanMobile, message });
      }
    }

    if (!delivered) {
      console.log(`\n======================================================`);
      console.log(`📱 [DISPATCHED SMS TO USER MOBILE] Recipient: +91 ${cleanMobile}`);
      console.log(`Message: ${message}`);
      if (otpMatch) console.log(`👉 Random OTP Code: ${otpMatch}`);
      console.log(`💡 NOTE: To deliver live cellular SMS to phone SIM card, set FAST2SMS_API_KEY or TWOFACTOR_API_KEY in .env or Admin Settings.`);
      console.log(`======================================================\n`);
    }
  }

  // B. REAL EMAIL DISPATCH (Nodemailer)
  if (channel === 'EMAIL' && emailTransporter && recipient && recipient.includes('@')) {
    try {
      await emailTransporter.sendMail({
        from: process.env.SMTP_FROM || getSetting('smtp_from') || '"தமிழ் சங்கம் தமிழ்நாடு" <noreply@tamilsangamtn.org>',
        to: recipient,
        subject: subject,
        text: message,
        html: html || undefined
      });
      console.log(`📧 [LIVE EMAIL SENT] To: ${recipient} | Subject: ${subject}`);
    } catch (mailErr) {
      console.warn(`⚠️ Live email delivery failed to ${recipient}:`, mailErr.message);
    }
  }

  return { id, recipient, channel, status: 'SENT', message };
}

// Create a system notification in DB
export function createNotification({ title, message, type = 'SYSTEM', recipientMobile = null, recipientEmail = null, targetRole = 'ALL' }) {
  const id = `NOTIF-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const dateStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', ' + new Date().toISOString().split('T')[0];

  try {
    const stmt = db.prepare(`
      INSERT INTO notifications (id, title, message, type, recipientMobile, recipientEmail, targetRole, isRead, date)
      VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?)
    `);
    stmt.run(id, title, message, type, recipientMobile, recipientEmail, targetRole, dateStr);
  } catch (dbErr) {
    console.warn('Failed to insert notification:', dbErr.message);
  }

  return { id, title, message, type, recipientMobile, recipientEmail, targetRole, isRead: 0, date: dateStr };
}

// Generate & save strictly RANDOM OTP
export async function generateAndSaveOtp(mobile, purpose = 'LOGIN') {
  const cleanMobile = mobile.replace(/\D/g, '').slice(-10);
  if (!cleanMobile || cleanMobile.length !== 10) {
    throw new Error('Valid 10-digit mobile number required');
  }

  // Cryptographically secure random 6-digit OTP (100000 - 999999)
  const otp = crypto.randomInt(100000, 1000000).toString();
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes validity
  const id = `OTP-${Date.now()}-${crypto.randomInt(100, 1000)}`;

  // Invalidate previous unverified OTPs for this number & purpose
  db.prepare(`UPDATE otps SET verified = 2 WHERE mobile = ? AND purpose = ? AND verified = 0`).run(cleanMobile, purpose);

  db.prepare(`
    INSERT INTO otps (id, mobile, otp, purpose, expiresAt, verified)
    VALUES (?, ?, ?, ?, ?, 0)
  `).run(id, cleanMobile, otp, purpose, expiresAt);

  // Send SMS to User's Mobile Number
  const otpMessage = `[தமிழ் சங்கம்] உங்கள் சரிபார்ப்புக் குறியீடு (OTP): ${otp}. இது 10 நிமிடங்கள் செல்லுபடியாகும். தயவுசெய்து இதை யாருடனும் பகிர வேண்டாம். / Tamil Sangam OTP is ${otp}. Valid for 10 mins.`;
  
  await dispatchMessage({
    recipient: cleanMobile,
    recipientType: 'USER',
    channel: 'SMS',
    subject: 'Tamil Sangam OTP Verification',
    message: otpMessage
  });

  // Check if member has registered email to ALSO dispatch OTP to email (instant mobile notification via Gmail)
  try {
    const member = db.prepare('SELECT email, fullName FROM members WHERE mobile = ? OR mobile LIKE ? LIMIT 1').get(cleanMobile, `%${cleanMobile}`);
    if (member && member.email) {
      await dispatchMessage({
        recipient: member.email,
        recipientType: 'USER',
        channel: 'EMAIL',
        subject: `[தமிழ் சங்கம்] உங்களின் உள்நுழைவு OTP எண்: ${otp}`,
        message: `வணக்கம் ${member.fullName}, தமிழ் சங்கத்தில் உள்நுழைவதற்கான உங்கள் 6 இலக்க OTP எண்: ${otp}. இது 10 நிமிடங்கள் செல்லுபடியாகும்.`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 500px; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background: #fff;">
            <h2 style="color: #8B1E26; margin: 0 0 10px;">தமிழ் சங்கம் தமிழ்நாடு</h2>
            <p>வணக்கம் <strong>${member.fullName}</strong>,</p>
            <p>உங்கள் கணக்கில் உள்நுழைவதற்கான 6 இலக்க சரிபார்ப்புக் குறியீடு (OTP):</p>
            <div style="background: #fef3c7; border: 2px dashed #f59e0b; padding: 15px; border-radius: 8px; text-align: center; margin: 15px 0;">
              <span style="font-family: monospace; font-size: 28px; font-weight: bold; letter-spacing: 4px; color: #8B1E26;">${otp}</span>
            </div>
            <p style="font-size: 12px; color: #64748b;">இது 10 நிமிடங்கள் மட்டுமே செல்லுபடியாகும். பாதுகாப்பு கருதி இதை யாருடனும் பகிர வேண்டாம்.</p>
          </div>
        `
      });
    }
  } catch (emailOtpErr) {
    console.warn('Email OTP dispatch error:', emailOtpErr.message);
  }

  const isRealSmsGatewayActive = !!(
    process.env.FAST2SMS_API_KEY || getSetting('fast2sms_api_key') ||
    process.env.TWOFACTOR_API_KEY || getSetting('twofactor_api_key') ||
    process.env.TWILIO_ACCOUNT_SID || getSetting('twilio_account_sid')
  );

  return { otp, cleanMobile, expiresAt, isRealSmsGatewayActive };
}

// Strictly verify OTP entered by user (NO bypass, NO 123456 fallback)
export function verifyOtpCode(mobile, enteredOtp, purpose = 'LOGIN') {
  const cleanMobile = mobile.replace(/\D/g, '').slice(-10);
  if (!cleanMobile || cleanMobile.length !== 10) {
    return { success: false, message: 'சரியான 10 இலக்க மொபைல் எண் தேவை / Valid 10-digit mobile number required' };
  }
  const cleanEnteredOtp = String(enteredOtp || '').trim();
  if (!cleanEnteredOtp || cleanEnteredOtp.length !== 6) {
    return { success: false, message: '6 இலக்க OTP எண் தேவை / 6-digit OTP code required' };
  }

  const now = Date.now();

  const record = db.prepare(`
    SELECT * FROM otps 
    WHERE mobile = ? AND otp = ? AND purpose = ? AND verified = 0 AND expiresAt > ?
    ORDER BY createdAt DESC LIMIT 1
  `).get(cleanMobile, cleanEnteredOtp, purpose, now);

  if (record) {
    db.prepare(`UPDATE otps SET verified = 1 WHERE id = ?`).run(record.id);
    return { success: true, message: 'OTP verified successfully' };
  }

  return { 
    success: false, 
    message: 'தவறான அல்லது காலாவதியான OTP எண். உங்கள் மொபைலுக்கு வந்த OTP எண்ணை உள்ளிடவும். / Invalid or expired OTP. Please enter the OTP sent to your mobile phone.' 
  };
}

// TRIGGER: Membership Application Submitted & Payment Completed (Status: PENDING)
export async function notifyMembershipPayment({ member, amount, paymentMethod, transactionId }) {
  const txn = transactionId || member.paymentTransactionId || `TXN-${Date.now().toString().slice(-6)}`;
  
  // 1. Send SMS to User
  const userMsg = `[தமிழ் சங்கம்] வணக்கம் ${member.fullName}! உறுப்பினர் சேர்க்கைக் கட்டணம் ₹${amount} (${paymentMethod}) வெற்றிகரமாக பெறப்பட்டது. விண்ணப்ப எண்: ${member.id}. தங்களின் விண்ணப்பம் தற்போது நிர்வாகியின் பரிசீலனைக்கு (Admin Approval) அனுப்பப்பட்டுள்ளது. நிர்வாகி ஒப்புதல் அளித்தவுடன் உங்களின் அதிகாரப்பூர்வ உறுப்பினர் அட்டை எண் (ID Card Number) மின்னஞ்சல் வழியாக அனுப்பப்படும்.`;
  
  await dispatchMessage({
    recipient: member.mobile,
    recipientType: 'USER',
    channel: 'SMS',
    subject: `Tamil Sangam Payment Received - Ref: ${member.id}`,
    message: userMsg
  });

  // 2. Send EMAIL to User (Payment Success)
  if (member.email) {
    const emailSubject = `[தமிழ் சங்கம்] உறுப்பினர் கட்டணம் ₹${amount} பெறப்பட்டது - விண்ணப்ப எண்: ${member.id}`;
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; background: #ffffff;">
        <div style="background-color: #8B1E26; color: #ffffff; padding: 24px; text-align: center;">
          <h2 style="margin: 0; font-size: 24px; font-weight: 800;">தமிழ் சங்கம் தமிழ்நாடு</h2>
          <p style="margin: 6px 0 0; font-size: 14px; color: #fde047; font-weight: bold;">உறுப்பினர் கட்டணம் பெறப்பட்டதற்கான உறுதிப்படுத்தல் (Payment Success)</p>
        </div>
        <div style="padding: 24px; color: #1e293b; line-height: 1.6;">
          <p style="font-size: 16px;">வணக்கம் <strong>${member.fullName}</strong>,</p>
          <p>தமிழ் சங்கத்தில் உறுப்பினர் ஆவதற்கான தங்களின் கட்டணம் <strong>₹${amount}</strong> (${paymentMethod}) வெற்றிகரமாக பெறப்பட்டது. தங்களின் விண்ணப்பம் பதிவு செய்யப்பட்டு நிர்வாகியின் ஒப்புதலுக்காக அனுப்பப்பட்டுள்ளது.</p>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px;">
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; color: #64748b;">விண்ணப்ப எண் (Application No):</td>
              <td style="padding: 10px 0; font-weight: bold; font-family: monospace; color: #8B1E26;">${member.id}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; color: #64748b;">பரிவர்த்தனை எண் (Transaction ID):</td>
              <td style="padding: 10px 0; font-family: monospace;">${txn}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; color: #64748b;">செலுத்திய தொகை (Amount Paid):</td>
              <td style="padding: 10px 0; font-weight: bold; color: #15803d; font-size: 16px;">₹${amount}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; color: #64748b;">உறுப்பினர் பிரிவு (Category):</td>
              <td style="padding: 10px 0;">${member.categoryName || 'General Member'}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; color: #64748b;">மாவட்டம் (District):</td>
              <td style="padding: 10px 0;">${member.district}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #64748b;">விண்ணப்ப நிலை (Status):</td>
              <td style="padding: 10px 0; font-weight: bold; color: #d97706;">நிர்வாகியின் பரிசீலனையில் உள்ளது (Pending Admin Approval)</td>
            </tr>
          </table>

          <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 14px; margin: 20px 0; border-radius: 6px; font-size: 13px; color: #92400e;">
            <strong>📌 அடுத்த கட்டம் (Next Step):</strong><br>
            தங்களின் ஆவணங்கள் மற்றும் விவரங்களை மாநில நிர்வாகி சரிபார்த்து ஒப்புதல் (Approve) அளித்தவுடன், <strong>உங்களின் அதிகாரப்பூர்வ உறுப்பினர் அடையாள அட்டை எண் (ID Card Number)</strong> உருவாக்கப்பட்டு மின்னஞ்சல் வழியாக அனுப்பப்படும். அதன்பின் வலைத்தளத்தில் தங்கள் டிஜிட்டல் ID கார்டைப் பதிவிறக்கம் செய்து கொள்ளலாம்.
          </div>

          <p style="font-size: 13px; color: #64748b; margin-top: 24px;">நன்றி,<br><strong>மாநில தலைமை செயலகம்<br>தமிழ் சங்கம் தமிழ்நாடு</strong></p>
        </div>
      </div>
    `;

    await dispatchMessage({
      recipient: member.email,
      recipientType: 'USER',
      channel: 'EMAIL',
      subject: emailSubject,
      message: `வணக்கம் ${member.fullName}, உறுப்பினர் கட்டணம் ₹${amount} பெறப்பட்டது. விண்ணப்ப எண்: ${member.id}. விண்ணப்பம் நிர்வாகியின் பரிசீலனையில் உள்ளது. நிர்வாகி ஒப்புதல் அளித்தவுடன் உறுப்பினர் எண் மற்றும் ID கார்டு அனுப்பப்படும்.`,
      html: emailHtml
    });
  }

  // 3. Send Notification to Admin
  const adminMsg = `[தமிழ் சங்கம் நிர்வாகி அறிவிப்பு] புதிய உறுப்பினர் கட்டணம் செலுத்தப்பட்டுள்ளது! பெயர்: ${member.fullName}, மாவட்டம்: ${member.district}, அலைபேசி: ${member.mobile}, கட்டணம்: ₹${amount} (${paymentMethod}). விண்ணப்ப எண்: ${member.id}. ஒப்புதல் அளிக்க Pending Applications-ஐப் பார்வையிடவும்.`;
  
  await dispatchMessage({
    recipient: 'STATE-ADMIN-HQ',
    recipientType: 'ADMIN',
    channel: 'SMS',
    subject: 'New Paid Application - Admin Pending Review',
    message: adminMsg
  });

  createNotification({
    title: 'New Member Fee Paid - Pending Approval',
    message: `Received ₹${amount} from ${member.fullName} (${member.district}). Application #${member.id} waiting for your approval.`,
    type: 'MEMBERSHIP',
    recipientMobile: member.mobile,
    targetRole: 'ADMIN'
  });
}

// TRIGGER: Membership Application Approved by Admin (ID Card Number Generated)
export async function notifyMembershipApproval({ member }) {
  // 1. Send SMS to User
  const userMsg = `[தமிழ் சங்கம்] வாழ்த்துகள் ${member.fullName}! உங்கள் உறுப்பினர் சேர்க்கை நிர்வாகத்தால் அங்கீகரிக்கப்பட்டது (Approved). உங்களின் உறுப்பினர் அட்டை எண்: ${member.membershipNumber}. வலைத்தளத்தில் உங்கள் மொபைல் எண் மூலம் உள்நுழைந்து டிஜிட்டல் ID கார்டைப் பதிவிறக்கம் செய்து கொள்ளலாம்.`;
  
  await dispatchMessage({
    recipient: member.mobile,
    recipientType: 'USER',
    channel: 'SMS',
    subject: 'Tamil Sangam Membership Approved - ID Card Ready',
    message: userMsg
  });

  // 2. Send EMAIL to User (Approval Success + Generated ID Card Number)
  if (member.email) {
    const emailSubject = `[தமிழ் சங்கம்] உறுப்பினர் சேர்க்கை அங்கீகரிக்கப்பட்டது! உங்களின் உறுப்பினர் எண்: ${member.membershipNumber}`;
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; background: #ffffff;">
        <div style="background-color: #15803d; color: #ffffff; padding: 24px; text-align: center;">
          <h2 style="margin: 0; font-size: 24px; font-weight: 800;">தமிழ் சங்கம் தமிழ்நாடு</h2>
          <p style="margin: 6px 0 0; font-size: 15px; color: #fde047; font-weight: bold;">உறுப்பினர் சேர்க்கை அங்கீகரிக்கப்பட்டது (Approval Success) 🌟</p>
        </div>
        <div style="padding: 24px; color: #1e293b; line-height: 1.6;">
          <p style="font-size: 16px;">அன்புடையீர் <strong>${member.fullName}</strong>,</p>
          <p>தமிழ் சங்கத்தில் உறுப்பினர் ஆவதற்கான தங்களின் விண்ணப்பம் மாநில நிர்வாகத்தால் சரிபார்க்கப்பட்டு வெற்றிகரமாக <strong>ஒப்புதல் அளிக்கப்பட்டு அங்கீகரிக்கப்பட்டது</strong>.</p>
          
          <div style="background: linear-gradient(135deg, #8B1E26, #b91c1c); color: #ffffff; padding: 18px; border-radius: 12px; text-align: center; margin: 20px 0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
            <p style="margin: 0; font-size: 12px; letter-spacing: 1px; color: #fde047; text-transform: uppercase;">உங்களின் அதிகாரப்பூர்வ உறுப்பினர் அடையாள அட்டை எண்</p>
            <h1 style="margin: 8px 0 0; font-size: 28px; font-family: monospace; letter-spacing: 2px;">${member.membershipNumber}</h1>
          </div>

          <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px;">
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; color: #64748b;">உறுப்பினர் பெயர்:</td>
              <td style="padding: 10px 0; font-weight: bold;">${member.fullName} (${member.nameTamil || ''})</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; color: #64748b;">உறுப்பினர் எண் (Member ID):</td>
              <td style="padding: 10px 0; font-family: monospace; font-weight: bold; color: #8B1E26; font-size: 15px;">${member.membershipNumber}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; color: #64748b;">மாவட்டம்:</td>
              <td style="padding: 10px 0;">${member.district}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; color: #64748b;">உறுப்பினர் பிரிவு:</td>
              <td style="padding: 10px 0;">${member.categoryName || 'General Member'}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; color: #64748b;">இணைந்த தேதி:</td>
              <td style="padding: 10px 0;">${member.joiningDate}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; color: #64748b;">செல்லுபடியாகும் காலம் (Validity):</td>
              <td style="padding: 10px 0; font-weight: bold; color: #15803d;">${member.validityDate}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #64748b;">நிலை (Status):</td>
              <td style="padding: 10px 0; font-weight: bold; color: #15803d;">APPROVED (அங்கீகரிக்கப்பட்டது)</td>
            </tr>
          </table>

          <div style="background-color: #f0fdf4; border-left: 4px solid #16a34a; padding: 14px; margin: 20px 0; border-radius: 6px; font-size: 13px; color: #166534;">
            <strong>💳 டிஜிட்டல் உறுப்பினர் அடையாள அட்டை (Digital ID Card):</strong><br>
            உங்களின் அதிகாரப்பூர்வ டிஜிட்டல் ID கார்டு வெற்றிகரமாக உருவாக்கப்பட்டுள்ளது. எங்கள் வலைத்தளத்தில் தங்களின் மொபைல் எண் (+91 ${member.mobile}) மூலம் OTP உள்ளிட்டு Login செய்து உங்கள் டிஜிட்டல் ID கார்டை உடனே பதிவிறக்கம் செய்து கொள்ளலாம்.
          </div>

          <p style="font-size: 13px; color: #64748b; margin-top: 24px;">தமிழ் வெல்க! தமிழ் வளர்க!<br><strong>மாநில நிர்வாகக் குழு<br>தமிழ் சங்கம் தமிழ்நாடு</strong></p>
        </div>
      </div>
    `;

    await dispatchMessage({
      recipient: member.email,
      recipientType: 'USER',
      channel: 'EMAIL',
      subject: emailSubject,
      message: `வாழ்த்துகள் ${member.fullName}! உங்கள் உறுப்பினர் சேர்க்கை அங்கீகரிக்கப்பட்டது. உங்களின் உறுப்பினர் எண்: ${member.membershipNumber}. செல்லுபடியாகும் காலம்: ${member.validityDate}. வலைத்தளத்தில் லாகின் செய்து உங்கள் டிஜிட்டல் ID கார்டைப் பதிவிறக்கம் செய்து கொள்ளலாம்.`,
      html: emailHtml
    });
  }

  createNotification({
    title: 'Membership Approved! 🌟',
    message: `Congratulations ${member.fullName}! Your Membership ID is ${member.membershipNumber}. Your Digital ID card is ready to download.`,
    type: 'MEMBERSHIP',
    recipientMobile: member.mobile,
    recipientEmail: member.email,
    targetRole: 'USER'
  });
}

// TRIGGER: Membership Application Rejected by Admin
export async function notifyMembershipRejection({ member, reason }) {
  const userMsg = `[தமிழ் சங்கம்] ${member.fullName}, உங்கள் உறுப்பினர் விண்ணப்பம் நிராகரிக்கப்பட்டது. காரணம்: ${reason || 'Incomplete Documents'}. தேவையான திருத்தங்களுடன் மீண்டும் விண்ணப்பிக்கவும். உதவிக்கு: 9840123456.`;
  
  await dispatchMessage({
    recipient: member.mobile,
    recipientType: 'USER',
    channel: 'SMS',
    subject: 'Membership Application Update',
    message: userMsg
  });

  if (member.email) {
    await dispatchMessage({
      recipient: member.email,
      recipientType: 'USER',
      channel: 'EMAIL',
      subject: '[தமிழ் சங்கம்] உறுப்பினர் விண்ணப்பம் குறித்த தகவல்',
      message: userMsg,
      html: `<div style="font-family: Arial; padding: 20px;"><h3 style="color: #b91c1c;">விண்ணப்பம் நிராகரிக்கப்பட்டது</h3><p>${userMsg}</p></div>`
    });
  }

  createNotification({
    title: 'Membership Application Update',
    message: `Your membership application was not approved. Reason: ${reason || 'Documents need resubmission'}.`,
    type: 'MEMBERSHIP',
    recipientMobile: member.mobile,
    targetRole: 'USER'
  });
}

// TRIGGER: Donation Paid
export async function notifyDonation({ donation }) {
  const donorMsg = `[தமிழ் சங்கம்] மிக்க நன்றி ${donation.donorName}! தமிழ் சங்கத்தின் பணிகளுக்காக தாங்கள் வழங்கிய ₹${donation.amount} நன்கொடை வெற்றிகரமாக பெறப்பட்டது. ரசீது எண்: ${donation.receiptNumber}. சங்கத்தின் பண்பாட்டுப் பணிகளில் தங்களின் பங்களிப்பு போற்றத்தக்கது.`;
  
  await dispatchMessage({
    recipient: donation.mobile,
    recipientType: 'USER',
    channel: 'SMS',
    subject: 'Tamil Sangam Donation Receipt & Acknowledgement',
    message: donorMsg
  });

  if (donation.email) {
    await dispatchMessage({
      recipient: donation.email,
      recipientType: 'USER',
      channel: 'EMAIL',
      subject: `[தமிழ் சங்கம்] நன்கொடை ரசீது - ₹${donation.amount} (ரசீது எண்: ${donation.receiptNumber})`,
      message: donorMsg,
      html: `
        <div style="font-family: Arial; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
          <h2 style="color: #8B1E26;">தமிழ் சங்கம் தமிழ்நாடு</h2>
          <p>நன்கொடை ரசீது எண்: <strong>${donation.receiptNumber}</strong></p>
          <p>தொகை: <strong>₹${donation.amount}</strong></p>
          <p>நோக்கம்: ${donation.purpose}</p>
          <p>மிக்க நன்றி!</p>
        </div>
      `
    });
  }

  createNotification({
    title: 'Donation Received & Receipt Generated',
    message: `Thank you ${donation.donorName} for donating ₹${donation.amount}. Receipt #${donation.receiptNumber} generated.`,
    type: 'DONATION',
    recipientMobile: donation.mobile,
    recipientEmail: donation.email,
    targetRole: 'USER'
  });
}
