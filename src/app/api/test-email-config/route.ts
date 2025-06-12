import { NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';
import { EMAIL_CONFIG } from '@/lib/envConfig';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const emailParam = url.searchParams.get('email');
  
  // Use provided email or a default
  const testEmail = emailParam || 'test@example.com';
  
  // Create response object with configuration details
  const diagnosticInfo = {
    config: {
      hasApiKey: !!EMAIL_CONFIG.apiKey,
      apiKeyLength: EMAIL_CONFIG.apiKey ? EMAIL_CONFIG.apiKey.length : 0,
      fromEmail: EMAIL_CONFIG.fromEmail,
      contactEmail: EMAIL_CONFIG.contactEmail,
      isConfigured: EMAIL_CONFIG.isConfigured,
    },
    environment: {
      nodeEnv: process.env.NODE_ENV,
      vercelEnv: process.env.VERCEL_ENV,
    }
  };
  
  // If no API key is configured, return error
  if (!EMAIL_CONFIG.isConfigured) {
    return NextResponse.json({
      ...diagnosticInfo,
      error: 'SendGrid API key is not configured',
      recommendation: 'Check your environment variables and make sure EMAIL_API_KEY is set'
    }, { status: 500 });
  }
  
  try {
    // Try to initialize SendGrid
    sgMail.setApiKey(EMAIL_CONFIG.apiKey);
    
    // Prepare a simple test email
    const msg = {
      to: testEmail,
      from: {
        email: EMAIL_CONFIG.fromEmail,
        name: 'Square One Rentals'
      },
      subject: 'SendGrid Configuration Test',
      text: 'This is a test email to verify your SendGrid configuration.',
      html: '<p>This is a test email to verify your SendGrid configuration.</p>',
    };
    
    // Only send the email if a valid recipient was provided
    let sendResult = null;
    if (emailParam && emailParam.includes('@')) {
      try {
        sendResult = await sgMail.send(msg);
        return NextResponse.json({
          ...diagnosticInfo,
          success: true,
          message: `Test email sent to ${testEmail}`,
          sendGridResponse: {
            statusCode: sendResult[0]?.statusCode,
            headers: sendResult[0]?.headers ? Object.keys(sendResult[0].headers) : []
          }
        });
      } catch (sendError: any) {
        return NextResponse.json({
          ...diagnosticInfo,
          error: 'Failed to send test email',
          sendGridError: {
            message: sendError.message,
            code: sendError.code,
            response: sendError.response ? {
              statusCode: sendError.response.statusCode,
              body: sendError.response.body,
              headers: sendError.response.headers ? Object.keys(sendError.response.headers) : []
            } : null
          },
          recommendation: getSendGridErrorRecommendation(sendError)
        }, { status: 500 });
      }
    }
    
    // If no email was provided, just check configuration
    return NextResponse.json({
      ...diagnosticInfo,
      success: true,
      message: 'SendGrid is properly configured, but no email was sent (no valid email provided)',
      recommendation: 'Add ?email=your@email.com to the URL to send a test email'
    });
    
  } catch (error: any) {
    return NextResponse.json({
      ...diagnosticInfo,
      error: 'Error initializing SendGrid',
      details: {
        message: error.message,
        stack: error.stack
      }
    }, { status: 500 });
  }
}

// Helper function to provide recommendations based on common SendGrid errors
function getSendGridErrorRecommendation(error: any): string {
  const statusCode = error.response?.statusCode;
  const errorMessage = error.message || '';
  
  if (statusCode === 401) {
    return 'Your SendGrid API key is invalid or revoked. Check your SendGrid account and update your API key.';
  } else if (statusCode === 403) {
    return 'Your SendGrid account is suspended or the API key doesn\'t have the required permissions.';
  } else if (errorMessage.includes('domain')) {
    return 'The sender domain is not verified. Log into SendGrid and verify your sender domain.';
  } else if (errorMessage.includes('sender')) {
    return 'The sender email is not verified. Log into SendGrid and verify your sender email.';
  } else if (errorMessage.includes('rate limit')) {
    return 'You\'ve hit SendGrid\'s rate limits. Wait a while before trying again.';
  }
  
  return 'Check your SendGrid dashboard for more details on this error.';
} 