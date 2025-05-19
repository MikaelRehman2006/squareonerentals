import nodemailer from 'nodemailer';
import { config } from 'dotenv';
config(); // Load environment variables

async function testEmail() {
  console.log('Testing email configuration...');
  console.log('Email user:', process.env.EMAIL_USER);
  
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: 'Test Email',
      text: 'This is a test email from Square One Rentals'
    });

    console.log('Email sent successfully!');
    console.log('Message ID:', info.messageId);
  } catch (error) {
    console.error('Error details:', {
      code: error.code,
      message: error.message,
      response: error.response
    });
  }
}

testEmail();
