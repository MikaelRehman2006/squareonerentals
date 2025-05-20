import nodemailer from 'nodemailer';

interface EmailTemplate {
  subject: string;
  body: string;
}

// Create a more reliable Gmail transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // Use TLS instead of SSL
  auth: {
    user: process.env.EMAIL_USER || 'squareone.rental@gmail.com',
    pass: process.env.EMAIL_PASSWORD
  },
  debug: true // Enable debugging
});

export const createNewMessageEmail = (
  landlordName: string,
  listingTitle: string,
  message: string,
  chatUrl: string
): EmailTemplate => ({
  subject: `New Interest in Your Listing`,
  body: `
Hi ${landlordName},

A user has shown interest in your listing titled "${listingTitle}".

They sent the following message:
"${message}"

View the chat: ${chatUrl}

— Square One Rentals`,
});

export const createListingUpdateEmail = (
  landlordName: string,
  listingTitle: string,
  dashboardUrl: string
): EmailTemplate => ({
  subject: `Your Listing Has Been Updated`,
  body: `
Hi ${landlordName},

Your listing titled "${listingTitle}" has been successfully updated.

View your listings here: ${dashboardUrl}

— Square One Rentals`,
});

export const createContactFormEmail = (
  name: string,
  email: string,
  subject: string,
  message: string,
  phone?: string
): EmailTemplate => ({
  subject: `Contact Form: ${subject}`,
  body: `
New contact form submission:

Name: ${name}
Email: ${email}
Phone: ${phone || 'Not provided'}
Subject: ${subject}

Message:
${message}

— Square One Rentals Contact Form`,
});

export const sendEmail = async (to: string, template: EmailTemplate, replyTo?: string) => {
  try {
    // Log attempt to send email for debugging
    console.log('Attempting to send email from:', process.env.EMAIL_USER);
    console.log('To:', to);
    console.log('Subject:', template.subject);
    
    // Create mail options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject: template.subject,
      text: template.body,
      replyTo
    };

    // Send email with detailed error handling
    const result = await transporter.sendMail(mailOptions);

    console.log('Email sent successfully:', result.messageId);
    return true;
  } catch (error) {
    // Detailed error logging
    console.error('Error sending email:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    // Check for auth errors
    const errorString = String(error);
    if (errorString.includes('auth')) {
      console.error('Authentication error detected. Please check EMAIL_USER and EMAIL_PASSWORD in .env');
    }
    
    return false;
  }
};

export const sendTestEmail = async () => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: 'Test Email from Square One Rentals',
      text: 'If you receive this email, the SMTP configuration is working correctly.'
    });

    console.log('Test email sent successfully:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending test email:', error);
    throw error;
  }
};
