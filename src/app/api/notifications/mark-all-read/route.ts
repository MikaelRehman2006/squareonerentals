import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import { Notification } from '@/models/Notification';

export async function POST(request: Request) {
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
    const { notificationIds } = body;

    if (!Array.isArray(notificationIds) || notificationIds.length === 0) {
      return NextResponse.json(
        { error: 'Invalid notification IDs' },
        { status: 400 }
      );
    }

    // Only allow marking notifications that belong to the authenticated user
    const result = await Notification.updateMany(
      { 
        _id: { $in: notificationIds },
        userId: session.user.id
      },
      { $set: { read: true } }
    );

    return NextResponse.json({ 
      success: true,
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    console.error('Error marking notifications as read:', error);
    return NextResponse.json(
      { error: 'Failed to mark notifications as read' },
      { status: 500 }
    );
  }
}
