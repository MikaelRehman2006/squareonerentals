import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import { Notification } from '@/models/Notification';

interface Props {
  params: { notificationId: string };
}

export async function POST(request: NextRequest, { params }: Props) {
  try {
    const { notificationId } = params;
    
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Mark notification as read
    await connectDB();
    
    const notification = await Notification.findOne({
      _id: notificationId,
      userId: session.user.id
    });
    
    if (!notification) {
      return NextResponse.json(
        { error: 'Notification not found' },
        { status: 404 }
      );
    }
    
    notification.read = true;
    await notification.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return NextResponse.json(
      { error: 'Failed to mark notification as read' },
      { status: 500 }
    );
  }
} 