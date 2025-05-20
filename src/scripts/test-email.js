const nodemailer = require('nodemailer');
require('dotenv').config(); // Load environment variables

// Log environment variables (without showing the full password)
const userEmail = process.env.EMAIL_USER;
const passwordLength = process.env.EMAIL_PASSWORD ? process.env.EMAIL_PASSWORD.length : 0;
const passwordPreview = process.env.EMAIL_PASSWORD ? '•'.repeat(passwordLength) : 'not set';

console.log('Email configuration:');
console.log(`- EMAIL_USER: ${userEmail || 'not set'}`);
console.log(`- EMAIL_PASSWORD: ${passwordPreview} (${passwordLength} characters)`);

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  },
  debug: true // Enable verbose logging
});

// Test email function
async function sendTestEmail() {
  try {
    console.log('Attempting to verify connection...');
    await transporter.verify();
    console.log('Transporter verification successful!');
    
    console.log('Sending test email...');
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Send to self
      subject: 'Test Email from Square One Rentals',
      text: 'If you receive this email, the SMTP configuration is working correctly.',
      html: '<div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eaeaea;">' +
            '<h2 style="color: #4a5568;">Square One Rentals Test Email</h2>' +
            '<p>If you receive this email, the SMTP configuration is working correctly.</p>' +
            '<p>Sent at: ' + new Date().toLocaleString() + '</p>' +
            '</div>'
    });

    console.log('Message sent successfully!');
    console.log('Message ID:', info.messageId);
    console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    return true;
  } catch (error) {
    console.error('Error sending test email:');
    console.error(error);
    if (error.code === 'EAUTH') {
      console.error('\nThis appears to be an authentication error.');
      console.error('Please check:');
      console.error('1. Your email and password are correct');
      console.error('2. You have enabled "Less secure app access" in your Google account');
      console.error('   or you are using an App Password if 2FA is enabled');
    }
    return false;
  }
}

// Execute the test
sendTestEmail();
