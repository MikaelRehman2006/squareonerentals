import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/models/User';
import { Listing } from '@/models/Listing';
import { Notification } from '@/models/Notification';
import { isOwner } from '@/lib/admin';
import mongoose from 'mongoose';

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
      const deleteResult = await ImageMetadata.deleteMany({ userId: session.user.id });
      console.log(`Deleted ${deleteResult.deletedCount} image metadata records for user ${session.user.id}`);
    } catch (metadataError) {
      console.error('Error cleaning up image metadata:', metadataError);
      // Continue with user deletion even if metadata cleanup fails
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