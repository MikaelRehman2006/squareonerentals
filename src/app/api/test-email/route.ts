import { NextResponse } from 'next/server';
import { sendTestEmail } from '@/utils/test-email';

// Specify runtime configuration to fix deployment errors
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const success = await sendTestEmail();
    
    if (success) {
      return NextResponse.json({ message: 'Test email sent successfully!' });
    } else {
      return NextResponse.json(
        { error: 'Failed to send test email. Check server logs for details.' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Error in test-email route:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error.message,
        code: error.code
      },
      { status: 500 }
    );
  }
}
