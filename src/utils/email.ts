import nodemailer from 'nodemailer';

interface EmailTemplate {
  subject: string;
  body: string;
}

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USER,
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    refreshToken: process.env.EMAIL_REFRESH_TOKEN,
    accessToken: process.env.EMAIL_ACCESS_TOKEN
  }
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
  message: string
): EmailTemplate => ({
  subject: `Contact Form: ${subject}`,
  body: `
New contact form submission:

Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}

— Square One Rentals Contact Form`,
});

export const sendEmail = async (to: string, template: EmailTemplate, replyTo?: string) => {
  try {
    const result = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject: template.subject,
      text: template.body,
      replyTo
    });

    console.log('Email sent successfully:', result.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
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
