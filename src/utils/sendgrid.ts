import sgMail from '@sendgrid/mail';

interface EmailData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
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
