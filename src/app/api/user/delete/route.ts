import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/models/User';
import { Listing } from '@/models/Listing';
import { Notification } from '@/models/Notification';
import { isOwner } from '@/lib/admin';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Prevent owner from deleting their account
    if (session.user.email && isOwner(session.user.email)) {
      return NextResponse.json({ error: 'Owner account cannot be deleted' }, { status: 403 });
    }

    const { confirmation } = await request.json();
    
    if (confirmation !== 'delete') {
      return NextResponse.json({ error: 'Invalid confirmation' }, { status: 400 });
    }

    // Connect to database
    await connectDB();
    
    // Find the user
    const user = await User.findById(session.user.id);
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Delete all user's listings
    await Listing.deleteMany({ userId: session.user.id });
    
    // Delete all user's notifications
    await Notification.deleteMany({ userId: session.user.id });
    
    // Delete the user
    await User.findByIdAndDelete(session.user.id);
    
    return NextResponse.json({
      success: true,
      message: 'Account deleted successfully'
    });
    
  } catch (error) {
    console.error('[USER_DELETE]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 