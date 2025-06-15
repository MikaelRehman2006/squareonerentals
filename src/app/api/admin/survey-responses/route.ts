import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/models/User';
import { getAdminRole } from '@/lib/admin';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email || !getAdminRole(session.user.email)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    // Get all users with their preferences
    const users = await User.find({})
      .select('_id name email preferences createdAt')
      .sort({ createdAt: -1 });
    
    // Format user objects
    const formattedUsers = users.map(user => ({
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      preferences: user.preferences,
      createdAt: user.createdAt
    }));
    
    return NextResponse.json({ users: formattedUsers });
  } catch (error) {
    console.error('Error fetching survey responses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch survey responses' },
      { status: 500 }
    );
  }
} 