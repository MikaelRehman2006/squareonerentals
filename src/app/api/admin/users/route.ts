import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/models/User';
import { authOptions } from '@/lib/auth';

// Helper function to check if user is admin
async function isAdmin(email: string) {
  if (!email) return false;
  
  // Check if user has ADMIN role in database
  await connectDB();
  const user = await User.findOne({ email });
  if (user?.role === 'ADMIN') return true;
  
  // Fallback to hardcoded admin emails
  const adminEmails = ['volcanxic@gmail.com', 'mikaelr112@gmail.com'];
  return adminEmails.includes(email.toLowerCase());
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email || !(await isAdmin(session.user.email))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    // Get all users with admin role
    const adminUsers = await User.find({ role: 'ADMIN' }).select('email role');
    
    return NextResponse.json({ users: adminUsers });
  } catch (error) {
    console.error('Error in GET /api/admin/users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admin users' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email || !(await isAdmin(session.user.email))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { email, role } = await request.json();

    if (!email || role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Update user role to admin
    user.role = 'ADMIN';
    await user.save();

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('Error in POST /api/admin/users:', error);
    return NextResponse.json(
      { error: 'Failed to update user role' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email || !(await isAdmin(session.user.email))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Find user and remove admin role
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Don't allow removing the last admin
    const adminCount = await User.countDocuments({ role: 'ADMIN' });
    if (adminCount <= 1 && user.role === 'ADMIN') {
      return NextResponse.json(
        { error: 'Cannot remove the last admin user' },
        { status: 400 }
      );
    }

    user.role = 'USER';
    await user.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/admin/users:', error);
    return NextResponse.json(
      { error: 'Failed to update user role' },
      { status: 500 }
    );
  }
}