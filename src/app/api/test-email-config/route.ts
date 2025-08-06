import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function GET() {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    // Check if API key is set
    const hasApiKey = !!process.env.RESEND_API_KEY;
    const apiKeyLength = process.env.RESEND_API_KEY?.length || 0;
    
    // Test Resend configuration
    let resendTest = null;
    let resendError = null;
    
    try {
      // Try to get domains to test API key
      const { data: domains, error } = await resend.domains.list();
      if (error) {
        resendError = error;
      } else {
        resendTest = {
          domains: domains?.data || [],
          totalDomains: domains?.data?.length || 0
        };
      }
    } catch (error) {
      resendError = error;
    }

    return NextResponse.json({
      success: true,
      config: {
        hasApiKey,
        apiKeyLength,
        apiKeyPrefix: process.env.RESEND_API_KEY?.substring(0, 10) + '...',
        resendTest,
        resendError: resendError ? {
          message: resendError instanceof Error ? resendError.message : 'Unknown error',
          name: resendError instanceof Error ? resendError.name : 'Unknown'
        } : null
      }
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 