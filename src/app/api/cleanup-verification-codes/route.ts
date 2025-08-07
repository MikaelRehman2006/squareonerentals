import { NextResponse } from 'next/server';
import { cleanupExpiredCodes } from '@/lib/verification';

export async function POST() {
  try {
    // Clean up expired verification codes
    cleanupExpiredCodes();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Expired verification codes cleaned up' 
    });
  } catch (error) {
    console.error('Cleanup error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to cleanup expired codes' 
    }, { status: 500 });
  }
}

// Also allow GET for manual cleanup
export async function GET() {
  return POST();
}
