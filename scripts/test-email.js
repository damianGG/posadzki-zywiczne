#!/usr/bin/env node

/**
 * Email Configuration Test Script
 * 
 * This script tests if the email configuration is working properly.
 * It verifies that EMAIL_USER and EMAIL_PASS are set and tries to send a test email.
 * 
 * Usage: node scripts/test-email.js [test-recipient-email]
 */

require('dotenv').config();
const nodemailer = require('nodemailer');

const testEmail = process.argv[2] || process.env.EMAIL_USER;

console.log('🧪 Testing Email Configuration...\n');

// Check if environment variables are set
if (!process.env.EMAIL_USER) {
  console.error('❌ ERROR: EMAIL_USER environment variable is not set!');
  console.log('   Please set it in your .env file');
  process.exit(1);
}

if (!process.env.EMAIL_PASS) {
  console.error('❌ ERROR: EMAIL_PASS environment variable is not set!');
  console.log('   Please set it in your .env file');
  process.exit(1);
}

console.log('✅ EMAIL_USER is set:', process.env.EMAIL_USER);
console.log('✅ EMAIL_PASS is set: [HIDDEN]');
console.log('📧 Test recipient:', testEmail);
console.log('\n🔄 Attempting to send test email...\n');

async function testEmailSending() {
  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Verify connection
    console.log('⏳ Verifying SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection verified successfully!\n');

    // Send test email
    console.log('⏳ Sending test email...');
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: testEmail,
      subject: 'Test Email - Posadzki Żywiczne Contest System',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #667eea;">✅ Email Configuration Test</h1>
          <p>This is a test email from the Posadzki Żywiczne contest system.</p>
          <p style="background: #f0f0f0; padding: 15px; border-left: 4px solid #667eea;">
            <strong>Status:</strong> Email configuration is working correctly! 🎉
          </p>
          <p style="color: #666; font-size: 12px; margin-top: 20px;">
            Sent at: ${new Date().toISOString()}<br>
            From: ${process.env.EMAIL_USER}
          </p>
        </div>
      `,
    });

    console.log('✅ Test email sent successfully!');
    console.log('   Message ID:', info.messageId);
    console.log('\n🎉 Email configuration is working correctly!\n');
    console.log('💡 Tips:');
    console.log('   - Check the spam folder if you don\'t see the email in inbox');
    console.log('   - If using Gmail, make sure you\'re using an App Password');
    console.log('   - App Passwords can be generated at: https://myaccount.google.com/apppasswords');
    
  } catch (error) {
    console.error('\n❌ Email sending failed!');
    console.error('Error details:', error.message);
    
    if (error.code === 'EAUTH') {
      console.error('\n🔐 Authentication failed!');
      console.log('   This usually means:');
      console.log('   1. The EMAIL_PASS is incorrect');
      console.log('   2. You need to use an App Password (not your regular Gmail password)');
      console.log('   3. 2-Step Verification might not be enabled on your Google Account');
      console.log('\n   To fix:');
      console.log('   1. Enable 2-Step Verification: https://myaccount.google.com/security');
      console.log('   2. Generate App Password: https://myaccount.google.com/apppasswords');
      console.log('   3. Update EMAIL_PASS in .env file with the generated App Password');
    } else if (error.code === 'ECONNECTION') {
      console.error('\n🌐 Connection failed!');
      console.log('   Check your internet connection and firewall settings');
    }
    
    process.exit(1);
  }
}

testEmailSending();
