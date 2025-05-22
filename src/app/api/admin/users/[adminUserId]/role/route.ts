import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/models/User';
import mongoose from 'mongoose';
import { isOwner } from '@/lib/admin';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { adminUserId: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Connect to the database
    await connectDB();
    
    const { role } = await request.json();

    if (!role || !['USER', 'ADMIN'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    const userId = params.adminUserId;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ error: 'Invalid user ID format' }, { status: 400 });
    }
    
    // Get user before update to check if it's an owner
    const userToUpdate = await User.findById(userId);
    if (!userToUpdate) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Don't allow modifying owner's role
    if (isOwner(userToUpdate.email)) {
      return NextResponse.json({ error: 'Cannot modify owner role' }, { status: 403 });
    }

    // Update the user's role
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true, select: 'name email role' }
    );
    
    // Log the action
    console.log(`User role updated: ${updatedUser.email} changed to ${role} by admin ${session.user.email}`);

    return NextResponse.json({
      user: updatedUser,
      message: 'Role updated successfully. The user must sign out and sign back in for changes to take effect.'
    });
  } catch (error) {
    console.error('Error updating user role:', error);
    return NextResponse.json({ error: 'Failed to update user role' }, { status: 500 });
  }
}
