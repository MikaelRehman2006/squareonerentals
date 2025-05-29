import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import { Notification } from '@/models/Notification';
import mongoose from 'mongoose';

export async function GET() {
  try {
    await connectDB();
    const session = await getServerSession(authOptions) as any;

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Convert user ID to proper format if needed
    let userId: string | mongoose.Types.ObjectId;
    try {
      userId = new mongoose.Types.ObjectId(session.user.id);
    } catch (err) {
      userId = session.user.id;
    }

    // First try to find notifications without population
    const notifications = await Notification.find({ 
      userId: session.user.id 
    })
    .sort({ createdAt: -1 })
    .lean();

    // Process notifications to handle potentially invalid references
    const processedNotifications = notifications.map(notification => {
      // Create a safe copy
      const safeNotification: any = { ...notification };
      
      // Make sure notification is properly formatted for client
      if (safeNotification._id) {
        safeNotification._id = safeNotification._id.toString();
      }
      
      // Handle listingId - ensure it's at least present as an ID if can't be populated
      if (safeNotification.listingId && typeof safeNotification.listingId === 'object') {
        // Keep it as is
      } else if (safeNotification.listingId) {
        // Convert to simple object with ID
        safeNotification.listingId = { _id: safeNotification.listingId.toString() };
      }
      
      // Handle relatedUserId - ensure it's at least present as an ID if can't be populated
      if (safeNotification.relatedUserId && typeof safeNotification.relatedUserId === 'object') {
        // Keep it as is
      } else if (safeNotification.relatedUserId) {
        // Convert to simple object with ID
        safeNotification.relatedUserId = { _id: safeNotification.relatedUserId.toString() };
      }
      
      return safeNotification;
    });

    return NextResponse.json(processedNotifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions) as any;

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { notificationId } = body;

    await Notification.findOneAndUpdate(
      { _id: notificationId, userId: session.user.id },
      { read: true }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating notification:', error);
    return NextResponse.json(
      { error: 'Failed to update notification' },
      { status: 500 }
    );
  }
}