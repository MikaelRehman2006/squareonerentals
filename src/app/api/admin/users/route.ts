import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/models/User';
import { authOptions } from '@/lib/auth';
import { isOwner, getAdminRole } from '@/lib/admin';

// Helper function to check if user can manage admins
async function canManageAdmins(email: string) {
  if (!email) return false;
  if (isOwner(email)) return true;
  return false;
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email || !getAdminRole(session.user.email)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    // Get all users with their roles
    const users = await User.find({})
      .select('_id email name role createdAt image')
      .sort({ createdAt: -1 });
    
    // Format user objects to include both _id and id for client-side consistency
    const formattedUsers = users.map(user => {
      const userObj = user.toObject();
      return {
        ...userObj,
        // Ensure both _id and id are present
        id: userObj._id.toString(),
        _id: userObj._id.toString()
      };
    });
    
    return NextResponse.json({ users: formattedUsers });
  } catch (error) {
    console.error('Error in GET /api/admin/users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email || !(await canManageAdmins(session.user.email))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Don't allow modifying the owner's role
    if (isOwner(email)) {
      return NextResponse.json(
        { error: 'Cannot modify owner role' },
        { status: 403 }
      );
    }

    await connectDB();

    // Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user if they don't exist
      user = new User({
        email,
        role: 'ADMIN',
        createdAt: new Date(),
      });
    } else {
      // Update existing user's role
      user.role = 'ADMIN';
    }

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
    
    if (!session?.user?.email || !(await canManageAdmins(session.user.email))) {
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

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Don't allow removing the owner
    if (isOwner(user.email)) {
      return NextResponse.json(
        { error: 'Cannot remove owner' },
        { status: 403 }
      );
    }

    // Remove admin role
    user.role = 'USER';
    await user.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/admin/users:', error);
    return NextResponse.json(
      { error: 'Failed to remove admin role' },
      { status: 500 }
    );
  }
}