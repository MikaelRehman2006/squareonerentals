import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface WelcomeEmailData {
  userEmail: string;
  userName: string;
}

interface NotificationEmailData {
  userEmail: string;
  userName: string;
  subject: string;
  message: string;
  notificationType: 'PAYMENT' | 'LISTING_UPDATE' | 'SYSTEM' | 'MARKETING' | 'NEWSLETTER' | 'MESSAGE' | 'FAVORITE' | 'WELCOME';
  actionUrl?: string;
  actionText?: string;
}

/**
 * Sends a welcome email using Resend
 * @param data Welcome email data including user email and name
 * @returns Promise with the send result
 */
export const sendWelcomeEmail = async (data: WelcomeEmailData): Promise<boolean> => {
  try {
    console.log('Attempting to send welcome email via Resend to:', data.userEmail);
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
        <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin: 0; font-size: 28px;">Square One Rentals</h1>
            <p style="color: #64748b; margin: 10px 0 0 0;">Welcome to the community!</p>
          </div>
          
          <div style="margin-bottom: 25px;">
            <h2 style="color: #1e293b; margin: 0 0 15px 0; font-size: 22px;">Welcome, ${data.userName}! 🎉</h2>
            <p style="color: #475569; line-height: 1.6; margin: 0 0 15px 0;">
              We're excited to have you join Square One Rentals! You're now part of a community of renters and landlords in the Greater Toronto Area.
            </p>
          </div>
          
          <div style="background-color: #eff6ff; padding: 20px; border-radius: 6px; border-left: 4px solid #2563eb; margin: 20px 0;">
            <h3 style="color: #1e40af; margin: 0 0 10px 0; font-size: 18px;">📧 Important: Email Notifications</h3>
            <p style="color: #1e40af; margin: 0; line-height: 1.5;">
              To ensure you receive all our important notifications, please:
            </p>
            <ul style="color: #1e40af; margin: 10px 0 0 0; padding-left: 20px;">
              <li>Mark this email as "Not Spam"</li>
              <li>Add <strong>squareone.rental@gmail.com</strong> to your contacts</li>
              <li>Check your spam folder if you don't see future emails</li>
            </ul>
          </div>
          
          <div style="margin: 25px 0;">
            <h3 style="color: #1e293b; margin: 0 0 15px 0; font-size: 18px;">What's Next?</h3>
            <div style="display: flex; flex-direction: column; gap: 12px;">
              <div style="display: flex; align-items: center; gap: 10px;">
                <span style="background-color: #2563eb; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold;">1</span>
                <span style="color: #475569;">Browse available rental listings</span>
              </div>
              <div style="display: flex; align-items: center; gap: 10px;">
                <span style="background-color: #2563eb; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold;">2</span>
                <span style="color: #475569;">Create your own listing if you're a landlord</span>
              </div>
              <div style="display: flex; align-items: center; gap: 10px;">
                <span style="background-color: #2563eb; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold;">3</span>
                <span style="color: #475569;">Set up your profile and preferences</span>
              </div>
            </div>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://squareonerentals-1234.vercel.app" 
               style="background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">
              Get Started
            </a>
          </div>
          
          <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 30px;">
            <p style="color: #64748b; font-size: 14px; margin: 0; text-align: center;">
              You'll see a 🔴 notification badge beside your profile icon when you have unread notifications.
            </p>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 20px;">
          <p style="color: #94a3b8; font-size: 12px; margin: 0;">
            © 2024 Square One Rentals. All rights reserved.
          </p>
        </div>
      </div>
    `;

    const { data: result, error } = await resend.emails.send({
      from: 'Square One Rentals <onboarding@resend.dev>',
      to: [data.userEmail],
      subject: 'Welcome to Square One Rentals! 🎉',
      html: html,
    });

    if (error) {
      console.error('Resend email error:', error);
      return false;
    }

    console.log('Welcome email sent successfully via Resend:', result);
    return true;
  } catch (error) {
    console.error('Error sending welcome email via Resend:', error);
    return false;
  }
};

/**
 * Sends a notification email using Resend
 * @param data Notification email data
 * @returns Promise with the send result
 */
export const sendNotificationEmail = async (data: NotificationEmailData): Promise<boolean> => {
  try {
    console.log('Attempting to send notification email via Resend to:', data.userEmail);
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
        <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin: 0; font-size: 28px;">Square One Rentals</h1>
          </div>
          
          <div style="margin-bottom: 25px;">
            <h2 style="color: #1e293b; margin: 0 0 15px 0; font-size: 22px;">Hello, ${data.userName}</h2>
            <div style="background-color: #f1f5f9; padding: 20px; border-radius: 6px; border-left: 4px solid #2563eb;">
              <p style="color: #475569; line-height: 1.6; margin: 0;">
                ${data.message}
              </p>
            </div>
          </div>
          
          ${data.actionUrl ? `
            <div style="text-align: center; margin: 30px 0;">
              <a href="${data.actionUrl}" 
                 style="background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">
                ${data.actionText || 'View Details'}
              </a>
            </div>
          ` : ''}
          
          <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 30px;">
            <p style="color: #64748b; font-size: 14px; margin: 0; text-align: center;">
              You can manage your notification preferences in your account settings.
            </p>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 20px;">
          <p style="color: #94a3b8; font-size: 12px; margin: 0;">
            © 2024 Square One Rentals. All rights reserved.
          </p>
        </div>
      </div>
    `;

    const { data: result, error } = await resend.emails.send({
      from: 'Square One Rentals <onboarding@resend.dev>',
      to: [data.userEmail],
      subject: data.subject,
      html: html,
    });

    if (error) {
      console.error('Resend notification email error:', error);
      return false;
    }

    console.log('Notification email sent successfully via Resend:', result);
    return true;
  } catch (error) {
    console.error('Error sending notification email via Resend:', error);
    return false;
  }
}; 