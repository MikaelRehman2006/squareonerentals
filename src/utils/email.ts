import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'squareone.rental@gmail.com',
    pass: process.env.EMAIL_PASSWORD,
  },
});

interface EmailTemplate {
  subject: string;
  body: string;
}

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
  subject: `New Contact Form Submission: ${subject}`,
  body: `
Name: ${name}
Email: ${email}
Subject: ${subject}
Message: ${message}

— Sent from Square One Rentals`,
});

export const sendEmail = async (to: string, template: EmailTemplate) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER || 'squareone.rental@gmail.com',
      to,
      subject: template.subject,
      text: template.body,
    });
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};
