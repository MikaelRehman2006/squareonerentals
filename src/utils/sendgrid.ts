import sgMail from '@sendgrid/mail';
import fs from 'fs';
import path from 'path';
import Handlebars from 'handlebars';

interface EmailData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

// New interface for notification emails
interface NotificationEmailData {
  userEmail: string;
  userName: string;
  subject: string;
  message: string;
  notificationType: 'PAYMENT' | 'LISTING_UPDATE' | 'SYSTEM' | 'MARKETING' | 'NEWSLETTER' | 'MESSAGE' | 'FAVORITE' | 'WELCOME';
}

// Initialize SendGrid
if (process.env.EMAIL_API_KEY) {
  sgMail.setApiKey(process.env.EMAIL_API_KEY);
}

// Load and compile email templates
const templateDir = path.join(process.cwd(), 'src', 'email-templates');

// Cache for compiled templates
const templateCache: Record<string, Handlebars.TemplateDelegate> = {};

// Helper function to load template
const getTemplate = (templateName: string): Handlebars.TemplateDelegate => {
  // Return from cache if available
  if (templateCache[templateName]) {
    return templateCache[templateName];
  }

  // Load and compile the template
  try {
    const templatePath = path.join(templateDir, `${templateName}.html`);
    const templateSource = fs.readFileSync(templatePath, 'utf-8');
    const template = Handlebars.compile(templateSource);
    
    // Cache the compiled template
    templateCache[templateName] = template;
    
    return template;
  } catch (error) {
    console.error(`Error loading email template ${templateName}:`, error);
    throw new Error(`Email template ${templateName} not found`);
  }
};

/**
 * Sends an email using SendGrid
 * @param data Email data including name, email, phone, subject and message
 * @returns Promise with the send result
 */
export const sendContactEmail = async (data: EmailData) => {
  try {
    // Format the email content
    const { name, email, phone, subject, message } = data;
    
    const content = `
New contact form submission:

Name: ${name}
Email: ${email}
Phone: ${phone || 'Not provided'}
Subject: ${subject}

Message:
${message}

— Square One Rentals Contact Form`;

    // Create the email
    const msg = {
      to: 'squareone.rental@gmail.com',
      from: 'squareone.rental@gmail.com', // Must be verified sender in SendGrid
      subject: `Contact Form: ${subject}`,
      text: content,
      replyTo: email // So you can reply directly to the sender
    };

    // Send the email
    console.log('Sending email via SendGrid...');
    const result = await sgMail.send(msg);
    console.log('Email sent successfully via SendGrid!');
    
    return { success: true, result };
  } catch (error) {
    console.error('Error sending email via SendGrid:', error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'Unknown error occurred' };
  }
};

// Interface for notification email
interface NotificationEmailParams {
  userEmail: string;
  userName: string;
  subject: string;
  message: string;
  notificationType: 'PAYMENT' | 'LISTING_UPDATE' | 'FAVORITE' | 'SYSTEM' | 'NEWSLETTER' | 'MARKETING' | 'MESSAGE' | 'WELCOME';
  actionUrl?: string;
  actionText?: string;
}

// Interface for listing update email
interface ListingUpdateEmailParams {
  userEmail: string;
  userName: string;
  subject: string;
  message: string;
  listingId: string;
  listingTitle: string;
  listingAddress: string;
  listingPrice: string | number;
  listingType: string;
  listingBedrooms: string | number;
  listingBathrooms: string | number;
  listingSqft: string | number;
  listingImage: string;
  changes: string[];
}

/**
 * Send a general notification email
 */
export const sendNotificationEmail = async (params: NotificationEmailParams): Promise<boolean> => {
  try {
    if (!process.env.EMAIL_API_KEY) {
      console.warn('Email API key not configured, skipping email sending');
      return false;
    }

    // Get template
    const template = getTemplate('notification-template');
    
    // Prepare template data
    const templateData = {
      notification_title: params.notificationType === 'LISTING_UPDATE' 
        ? 'Listing Update' 
        : params.notificationType === 'PAYMENT'
        ? 'Payment Notification'
        : params.notificationType === 'WELCOME'
        ? 'Welcome to Square One Rentals'
        : 'Notification',
      user_name: params.userName,
      notification_message: params.message,
      action_url: params.actionUrl || 'https://squareonerentals-1234.vercel.app',
      action_text: params.actionText || 'Visit Square One Rentals',
      unsubscribe_url: `https://squareonerentals-1234.vercel.app/unsubscribe?email=${encodeURIComponent(params.userEmail)}&type=${params.notificationType.toLowerCase()}`,
      preferences_url: 'https://squareonerentals-1234.vercel.app/settings#notifications'
    };
    
    // Render HTML
    const html = template(templateData);
    
    // Prepare email
    const msg = {
      to: params.userEmail,
      from: {
        email: 'notifications@squareonerentals.ca',
        name: 'Square One Rentals'
      },
      subject: params.subject,
      html,
      trackingSettings: {
        clickTracking: {
          enable: true
        },
        openTracking: {
          enable: true
        }
      }
    };
    
    // Send email
    await sgMail.send(msg);
    
    return true;
  } catch (error) {
    console.error('Error sending notification email:', error);
    return false;
  }
};

/**
 * Send a listing update email with detailed listing information
 */
export const sendListingUpdateEmail = async (params: ListingUpdateEmailParams): Promise<boolean> => {
  try {
    if (!process.env.EMAIL_API_KEY) {
      console.warn('Email API key not configured, skipping email sending');
      return false;
    }

    // Get template
    const template = getTemplate('listing-update-template');
    
    // Prepare template data
    const templateData = {
      notification_title: 'Listing Update',
      user_name: params.userName,
      notification_message: params.message,
      listing_image: params.listingImage,
      listing_title: params.listingTitle,
      listing_address: params.listingAddress,
      listing_price: params.listingPrice,
      listing_type: params.listingType,
      listing_bedrooms: params.listingBedrooms,
      listing_bathrooms: params.listingBathrooms,
      listing_sqft: params.listingSqft,
      changes: params.changes,
      listing_url: `https://squareonerentals-1234.vercel.app/listings/${params.listingId}`,
      unsubscribe_url: `https://squareonerentals-1234.vercel.app/unsubscribe?email=${encodeURIComponent(params.userEmail)}&type=listing_update`,
      preferences_url: 'https://squareonerentals-1234.vercel.app/settings#notifications'
    };
    
    // Render HTML
    const html = template(templateData);
    
    // Prepare email
    const msg = {
      to: params.userEmail,
      from: {
        email: 'notifications@squareonerentals.ca',
        name: 'Square One Rentals'
      },
      subject: params.subject,
      html,
      trackingSettings: {
        clickTracking: {
          enable: true
        },
        openTracking: {
          enable: true
        }
      }
    };
    
    // Send email
    await sgMail.send(msg);
    
    return true;
  } catch (error) {
    console.error('Error sending listing update email:', error);
    return false;
  }
};

/**
 * Send a test email to verify email configuration
 */
export const sendTestEmail = async (toEmail: string): Promise<boolean> => {
  try {
    if (!process.env.EMAIL_API_KEY) {
      console.warn('Email API key not configured, skipping test email');
      return false;
    }

    // Prepare email
    const msg = {
      to: toEmail,
      from: {
        email: 'notifications@squareonerentals.ca',
        name: 'Square One Rentals'
      },
      subject: 'Test Email from Square One Rentals',
      text: 'This is a test email to verify your email configuration is working correctly.',
      html: '<p>This is a test email to verify your email configuration is working correctly.</p>',
    };
    
    // Send email
    await sgMail.send(msg);
    
    return true;
  } catch (error) {
    console.error('Error sending test email:', error);
    return false;
  }
};

export default {
  sendNotificationEmail,
  sendListingUpdateEmail,
  sendTestEmail
};
