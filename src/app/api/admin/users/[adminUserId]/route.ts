import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/models/User';
import { Listing } from '@/models/Listing';
import { Notification } from '@/models/Notification';
import mongoose from 'mongoose';
import { isOwner } from '@/lib/admin';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { adminUserId: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    // Connect to the database
    await connectDB();
    
    const { role } = await request.json();

    if (!role || !['USER', 'ADMIN'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    // Use MongoDB to update the user
    const userId = params.adminUserId;
    const isValidId = mongoose.Types.ObjectId.isValid(userId);
    
    if (!isValidId) {
      return NextResponse.json({ error: 'Invalid user ID format' }, { status: 400 });
    }
    
    // Find and update the user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true, select: 'name email role' }
    );
    
    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Log to console instead of using logActivity
    console.log(`User ${updatedUser.name || updatedUser.email} role changed to ${role} by ${session.user.email}`);

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { adminUserId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is admin
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Connect to the database
    await connectDB();
    
    const userId = params.adminUserId;
    const isValidId = mongoose.Types.ObjectId.isValid(userId);
    
    if (!isValidId) {
      return NextResponse.json({ error: 'Invalid user ID format' }, { status: 400 });
    }
    
    // Get the user to be deleted first
    const userToDelete = await User.findById(userId);
    
    if (!userToDelete) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Don't allow deleting yourself
    if (session.user.email === userToDelete.email) {
      return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 });
    }

    // Don't allow deleting the owner
    if (isOwner(userToDelete.email)) {
      return NextResponse.json({ error: 'Cannot delete the owner account' }, { status: 403 });
    }

    // Clean up image metadata for all user's listings before deleting them
    try {
      // Get or initialize the ImageMetadata model
      let ImageMetadata: mongoose.Model<any>;
      try {
        ImageMetadata = mongoose.model('ImageMetadata');
      } catch (e) {
        const ImageMetadataSchema = new mongoose.Schema({
          userId: { type: String, required: true, index: true },
          url: { type: String, required: true, unique: true },
          publicId: { type: String, required: true },
          size: { type: Number, required: true },
          listingId: { type: String, index: true },
          createdAt: { type: Date, default: Date.now }
        });
        
        ImageMetadata = mongoose.model('ImageMetadata', ImageMetadataSchema);
      }

      // Delete all image metadata associated with this user
      const deleteResult = await ImageMetadata.deleteMany({ userId });
      console.log(`Deleted ${deleteResult.deletedCount} image metadata records for user ${userId}`);
    } catch (metadataError) {
      console.error('Error cleaning up image metadata:', metadataError);
      // Continue with user deletion even if metadata cleanup fails
    }

    // Delete user's listings
    await Listing.deleteMany({ userId });
    
    // Delete user's notifications
    await Notification.deleteMany({ userId });
    
    // Delete the user
    await User.findByIdAndDelete(userId);
    
    console.log(`User ${userToDelete.email} deleted by admin ${session.user.email}`);

    return NextResponse.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}