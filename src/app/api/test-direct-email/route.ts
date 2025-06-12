import { NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';
import { EMAIL_CONFIG } from '@/lib/envConfig';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const email = url.searchParams.get('email');
  
  // If no email is provided, return an error
  if (!email) {
    return NextResponse.json(
      { error: 'Email parameter is required' },
      { status: 400 }
    );
  }
  
  // Initialize SendGrid
  try {
    // Log configuration details
    const configDetails = {
      hasApiKey: !!EMAIL_CONFIG.apiKey,
      apiKeyLength: EMAIL_CONFIG.apiKey ? EMAIL_CONFIG.apiKey.length : 0,
      fromEmail: EMAIL_CONFIG.fromEmail,
      isConfigured: EMAIL_CONFIG.isConfigured
    };
    
    console.log('SendGrid Config:', configDetails);
    
    if (!EMAIL_CONFIG.isConfigured) {
      return NextResponse.json({
        error: 'SendGrid API key is not configured',
        config: configDetails
      }, { status: 500 });
    }
    
    // Set API key
    sgMail.setApiKey(EMAIL_CONFIG.apiKey);
    
    // Create a simple email without using templates
    const msg = {
      to: email,
      from: EMAIL_CONFIG.fromEmail,
      subject: 'Direct Test Email from Square One Rentals',
      text: 'This is a direct test email sent without using templates. If you received this, your SendGrid configuration is working correctly.',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4f46e5;">Square One Rentals Test Email</h2>
          <p>This is a direct test email sent without using templates.</p>
          <p>If you received this, your SendGrid configuration is working correctly.</p>
          <p>This email was sent to: ${email}</p>
          <p>Time sent: ${new Date().toISOString()}</p>
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666;">
            <p>Square One Rentals</p>
          </div>
        </div>
      `,
    };
    
    try {
      // Log attempt
      console.log('Attempting to send direct email to:', email);
      
      // Send email
      const result = await sgMail.send(msg);
      
      console.log('Email sent successfully!', {
        statusCode: result[0]?.statusCode,
      });
      
      return NextResponse.json({
        success: true,
        message: `Direct test email sent to ${email}`,
        result: {
          statusCode: result[0]?.statusCode,
        }
      });
    } catch (sendError: any) {
      console.error('Error sending email:', sendError);
      
      // Get detailed error info
      const errorInfo = {
        message: sendError.message,
        code: sendError.code,
        response: sendError.response ? {
          body: sendError.response.body,
          statusCode: sendError.response.statusCode,
        } : null
      };
      
      return NextResponse.json({
        error: 'Failed to send direct test email',
        details: errorInfo,
        config: configDetails
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error('General error:', error);
    
    return NextResponse.json({
      error: 'Error in direct email test',
      message: error.message,
      stack: error.stack
    }, { status: 500 });
  }
} 