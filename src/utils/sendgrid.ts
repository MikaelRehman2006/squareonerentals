import sgMail from '@sendgrid/mail';

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
  notificationType: 'PAYMENT' | 'LISTING_UPDATE' | 'SYSTEM' | 'MARKETING' | 'NEWSLETTER' | 'MESSAGE' | 'FAVORITE';
}

/**
 * Initializes the SendGrid API with the API key from environment variables
 */
export const initSendGrid = () => {
  if (process.env.SENDGRID_API_KEY) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    return true;
  }
  console.error('SENDGRID_API_KEY is not defined in environment variables');
  return false;
};

/**
 * Sends an email using SendGrid
 * @param data Email data including name, email, phone, subject and message
 * @returns Promise with the send result
 */
export const sendContactEmail = async (data: EmailData) => {
  try {
    // Initialize SendGrid if not already initialized
    initSendGrid();
    
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

/**
 * Sends a notification email to a user
 * @param data Notification email data
 * @returns Promise with the send result
 */
export const sendNotificationEmail = async (data: NotificationEmailData) => {
  try {
    // Initialize SendGrid if not already initialized
    initSendGrid();
    
    // Format the email content based on notification type
    const { userEmail, userName, subject, message, notificationType } = data;
    
    // Create email template based on notification type
    let emailSubject = '';
    let emailContent = '';
    
    switch (notificationType) {
      case 'PAYMENT':
        emailSubject = `Square One Rentals - ${subject}`;
        emailContent = `
Hello ${userName},

${message}

If you have any questions about your payment, please contact us at squareone.rental@gmail.com.

Thank you for using Square One Rentals!
        `;
        break;
        
      case 'LISTING_UPDATE':
        emailSubject = `Square One Rentals - Listing Update`;
        emailContent = `
Hello ${userName},

${message}

You can view your listings in your Square One Rentals dashboard.

Thank you for using Square One Rentals!
        `;
        break;
      
      case 'FAVORITE':
        emailSubject = `Square One Rentals - Favorite Activity`;
        emailContent = `
Hello ${userName},

${message}

Check your favorites in your Square One Rentals dashboard.

Thank you for using Square One Rentals!
        `;
        break;
        
      case 'MESSAGE':
        emailSubject = `Square One Rentals - New Message`;
        emailContent = `
Hello ${userName},

${message}

You can view and reply to all your messages from your Square One Rentals dashboard.

Thank you for using Square One Rentals!
        `;
        break;
        
      case 'SYSTEM':
      case 'MARKETING':
      case 'NEWSLETTER':
      default:
        emailSubject = `Square One Rentals - ${subject || 'Notification'}`;
        emailContent = `
Hello ${userName},

${message}

Thank you for using Square One Rentals!
        `;
        break;
    }

    // Create the email
    const msg = {
      to: userEmail,
      from: 'squareone.rental@gmail.com', // Must be verified sender in SendGrid
      subject: emailSubject,
      text: emailContent,
    };

    // Send the email
    console.log(`Sending notification email to ${userEmail}...`);
    const result = await sgMail.send(msg);
    console.log(`Notification email sent successfully to ${userEmail}!`);
    
    return { success: true, result };
  } catch (error) {
    console.error('Error sending notification email:', error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'Unknown error occurred' };
  }
};
