import nodemailer from 'nodemailer';

export async function sendDirectEmail(formData: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}) {
  // Create a simplified transporter that works better in serverless environments
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Use TLS
    auth: {
      user: 'squareone.rental@gmail.com', // Hardcoded to avoid env variable issues
      pass: process.env.EMAIL_PASSWORD
    },
    debug: true, // Enable debug logging
    logger: true // Enable logging
  });

  // Construct the email content
  const emailContent = `
New contact form submission:

Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone || 'Not provided'}
Subject: ${formData.subject}

Message:
${formData.message}

— Square One Rentals Contact Form`;

  try {
    console.log('Attempting to send contact form email...');
    console.log('Using password length:', process.env.EMAIL_PASSWORD?.length || 0);
    
    // Send the email
    const info = await transporter.sendMail({
      from: 'squareone.rental@gmail.com',
      to: 'squareone.rental@gmail.com',
      subject: `Contact Form: ${formData.subject}`,
      text: emailContent,
      replyTo: formData.email // Set reply-to as the sender's email
    });

    console.log('Contact form email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Failed to send contact form email:', error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'Unknown error occurred' };
  }
}
