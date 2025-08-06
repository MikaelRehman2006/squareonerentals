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

interface VerificationEmailData {
  userEmail: string;
  verificationCode: string;
}

/**
 * Sends a verification code email using Resend
 * @param data Verification email data including user email and verification code
 * @returns Promise with the send result
 */
export const sendVerificationEmail = async (data: VerificationEmailData): Promise<boolean> => {
  try {
    console.log('Attempting to send verification email via Resend to:', data.userEmail);
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
        <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin: 0; font-size: 28px;">Square One Rentals</h1>
            <p style="color: #64748b; margin: 10px 0 0 0;">Email Verification</p>
          </div>
          
          <div style="margin-bottom: 25px;">
            <h2 style="color: #1e293b; margin: 0 0 15px 0; font-size: 22px;">Verify Your Email Address</h2>
            <p style="color: #475569; line-height: 1.6; margin: 0 0 15px 0;">
              To complete your registration with Square One Rentals, please enter the verification code below:
            </p>
          </div>
          
          <div style="background-color: #eff6ff; padding: 25px; border-radius: 8px; border: 2px solid #2563eb; margin: 20px 0; text-align: center;">
            <h3 style="color: #1e40af; margin: 0 0 15px 0; font-size: 18px;">Your Verification Code</h3>
            <div style="background-color: white; padding: 15px; border-radius: 6px; border: 2px dashed #2563eb; display: inline-block; min-width: 200px;">
              <span style="color: #1e40af; font-size: 32px; font-weight: bold; letter-spacing: 4px; font-family: 'Courier New', monospace;">
                ${data.verificationCode}
              </span>
            </div>
            <p style="color: #1e40af; margin: 15px 0 0 0; font-size: 14px;">
              This code will expire in 10 minutes
            </p>
          </div>
          
          <div style="background-color: #fef3c7; padding: 15px; border-radius: 6px; border-left: 4px solid #f59e0b; margin: 20px 0;">
            <h4 style="color: #92400e; margin: 0 0 8px 0; font-size: 16px;">⚠️ Important</h4>
            <p style="color: #92400e; margin: 0; font-size: 14px; line-height: 1.5;">
              If you didn't request this verification code, please ignore this email. Your email address will not be verified.
            </p>
          </div>
          
          <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 30px;">
            <p style="color: #64748b; font-size: 14px; margin: 0; text-align: center;">
              Having trouble? Contact us at squareone.rental@gmail.com
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

    // Use verified domain instead of sandbox domain
    const fromEmail = process.env.RESEND_FROM || 'Square One Rentals <squareone.rental@gmail.com>';

    const { data: result, error } = await resend.emails.send({
      from: fromEmail,
      to: [data.userEmail],
      subject: 'Verify Your Email - Square One Rentals',
      html: html,
    });

    if (error) {
      console.error('Resend verification email error:', error);
      return false;
    }

    console.log('Verification email sent successfully via Resend:', result);
    return true;
  } catch (error) {
    console.error('Error sending verification email via Resend:', error);
    return false;
  }
};

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
            <a href="https://squareonerentals.com" 
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

    // Use verified domain instead of sandbox domain
    const fromEmail = process.env.RESEND_FROM || 'Square One Rentals <squareone.rental@gmail.com>';

    const { data: result, error } = await resend.emails.send({
      from: fromEmail,
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
// Helper function to generate notification email templates
function generateNotificationEmailTemplate(data: NotificationEmailData): string {
  const baseTemplate = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
      <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2563eb; margin: 0; font-size: 28px;">Square One Rentals</h1>
        </div>
        
        ${getNotificationHeader(data)}
        
        <div style="margin-bottom: 25px;">
          <h2 style="color: #1e293b; margin: 0 0 15px 0; font-size: 22px;">Hello, ${data.userName}</h2>
          ${getNotificationContent(data)}
        </div>
        
        ${data.actionUrl ? getActionButton(data) : ''}
        
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

  return baseTemplate;
}

function getNotificationHeader(data: NotificationEmailData): string {
  const headers = {
    PAYMENT: `
      <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 20px; border-radius: 8px; margin-bottom: 25px; text-align: center;">
        <div style="color: white; font-size: 18px; font-weight: 600; margin-bottom: 5px;">💳 Payment Notification</div>
        <div style="color: rgba(255,255,255,0.9); font-size: 14px;">Important information about your account</div>
      </div>
    `,
    LISTING_UPDATE: `
      <div style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); padding: 20px; border-radius: 8px; margin-bottom: 25px; text-align: center;">
        <div style="color: white; font-size: 18px; font-weight: 600; margin-bottom: 5px;">🏠 Listing Update</div>
        <div style="color: rgba(255,255,255,0.9); font-size: 14px;">Your property listing has been updated</div>
      </div>
    `,
    SYSTEM: `
      <div style="background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%); padding: 20px; border-radius: 8px; margin-bottom: 25px; text-align: center;">
        <div style="color: white; font-size: 18px; font-weight: 600; margin-bottom: 5px;">⚙️ System Alert</div>
        <div style="color: rgba(255,255,255,0.9); font-size: 14px;">Important platform information</div>
      </div>
    `,
    MARKETING: `
      <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 20px; border-radius: 8px; margin-bottom: 25px; text-align: center;">
        <div style="color: white; font-size: 18px; font-weight: 600; margin-bottom: 5px;">🎁 Special Offer</div>
        <div style="color: rgba(255,255,255,0.9); font-size: 14px;">Exclusive deals for our community</div>
      </div>
    `,
    NEWSLETTER: `
      <div style="background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); padding: 20px; border-radius: 8px; margin-bottom: 25px; text-align: center;">
        <div style="color: white; font-size: 18px; font-weight: 600; margin-bottom: 5px;">📰 Newsletter</div>
        <div style="color: rgba(255,255,255,0.9); font-size: 14px;">Latest news and updates</div>
      </div>
    `,
    FAVORITE: `
      <div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 20px; border-radius: 8px; margin-bottom: 25px; text-align: center;">
        <div style="color: white; font-size: 18px; font-weight: 600; margin-bottom: 5px;">⭐ Saved Property Update</div>
        <div style="color: rgba(255,255,255,0.9); font-size: 14px;">A property you saved has been updated</div>
      </div>
    `,
    MESSAGE: `
      <div style="background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%); padding: 20px; border-radius: 8px; margin-bottom: 25px; text-align: center;">
        <div style="color: white; font-size: 18px; font-weight: 600; margin-bottom: 5px;">💬 New Message</div>
        <div style="color: rgba(255,255,255,0.9); font-size: 14px;">You have a new message</div>
      </div>
    `,
    WELCOME: `
      <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 20px; border-radius: 8px; margin-bottom: 25px; text-align: center;">
        <div style="color: white; font-size: 18px; font-weight: 600; margin-bottom: 5px;">🎉 Welcome!</div>
        <div style="color: rgba(255,255,255,0.9); font-size: 14px;">Welcome to Square One Rentals</div>
      </div>
    `
  };

  return headers[data.notificationType] || headers.SYSTEM;
}

function getNotificationContent(data: NotificationEmailData): string {
  const contentStyles = {
    PAYMENT: 'background-color: #ecfdf5; border-left: 4px solid #10b981;',
    LISTING_UPDATE: 'background-color: #eff6ff; border-left: 4px solid #3b82f6;',
    SYSTEM: 'background-color: #f9fafb; border-left: 4px solid #6b7280;',
    MARKETING: 'background-color: #fffbeb; border-left: 4px solid #f59e0b;',
    NEWSLETTER: 'background-color: #faf5ff; border-left: 4px solid #8b5cf6;',
    FAVORITE: 'background-color: #fef2f2; border-left: 4px solid #ef4444;',
    MESSAGE: 'background-color: #ecfeff; border-left: 4px solid #06b6d4;',
    WELCOME: 'background-color: #ecfdf5; border-left: 4px solid #10b981;'
  };

  const style = contentStyles[data.notificationType] || contentStyles.SYSTEM;

  return `
    <div style="${style} padding: 20px; border-radius: 6px;">
      <p style="color: #475569; line-height: 1.6; margin: 0;">
        ${data.message}
      </p>
    </div>
  `;
}

function getActionButton(data: NotificationEmailData): string {
  const buttonColors = {
    PAYMENT: '#10b981',
    LISTING_UPDATE: '#3b82f6',
    SYSTEM: '#6b7280',
    MARKETING: '#f59e0b',
    NEWSLETTER: '#8b5cf6',
    FAVORITE: '#ef4444',
    MESSAGE: '#06b6d4',
    WELCOME: '#10b981'
  };

  const color = buttonColors[data.notificationType] || buttonColors.SYSTEM;

  return `
    <div style="text-align: center; margin: 30px 0;">
      <a href="${data.actionUrl}" 
         style="background-color: ${color}; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">
        ${data.actionText || 'View Details'}
      </a>
    </div>
  `;
}

export const sendNotificationEmail = async (data: NotificationEmailData): Promise<boolean> => {
  try {
    console.log('📧 Attempting to send notification email via Resend to:', data.userEmail);
    console.log('📧 Email details:', {
      subject: data.subject,
      notificationType: data.notificationType,
      actionUrl: data.actionUrl,
      actionText: data.actionText
    });
    
    const html = generateNotificationEmailTemplate(data);

    // Use verified domain instead of sandbox domain
    const fromEmail = process.env.RESEND_FROM || 'Square One Rentals <squareone.rental@gmail.com>';

    const { data: result, error } = await resend.emails.send({
      from: fromEmail,
      to: [data.userEmail],
      subject: data.subject,
      html: html,
    });

    if (error) {
      console.error('❌ Resend notification email error:', error);
      console.error('❌ Error details:', {
        message: error.message
      });
      return false;
    }

    console.log('✅ Notification email sent successfully via Resend:', {
      id: result?.id,
      to: data.userEmail,
      subject: data.subject,
      from: fromEmail
    });
    return true;
  } catch (error) {
    console.error('❌ Error sending notification email via Resend:', error);
    console.error('❌ Error details:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace'
    });
    return false;
  }
}; 