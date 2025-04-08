import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import { Message } from '@/models/Message';
import { Notification } from '@/models/Notification';
import { User } from '@/models/User';
import { Listing } from '@/models/Listing';
import { sendEmail, createNewMessageEmail } from '@/utils/email';

export async function GET(request: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions) as any;

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const listingId = searchParams.get('listingId');
    const otherUserId = searchParams.get('otherUserId');

    const query: any = {
      $or: [
        { senderId: session.user.id },
        { receiverId: session.user.id }
      ]
    };

    if (listingId) {
      query.listingId = listingId;
    }

    if (otherUserId) {
      query.$or = [
        { senderId: session.user.id, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: session.user.id }
      ];
    }

    const messages = await Message.find(query)
      .sort({ createdAt: -1 })
      .populate('senderId', 'name image')
      .populate('receiverId', 'name image')
      .populate('listingId', 'title')
      .lean();

    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

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
    const { receiverId, listingId, message } = body;

    // Validate listing exists and get title
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      );
    }

    // Validate receiver exists and get email
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return NextResponse.json(
        { error: 'Receiver not found' },
        { status: 404 }
      );
    }

    // Create message
    const newMessage = await Message.create({
      senderId: session.user.id,
      receiverId,
      listingId,
      message,
    });

    // Create notification
    await Notification.create({
      userId: receiverId,
      type: 'MESSAGE',
      message: `New message about your listing "${listing.title}"`,
      listingId,
      relatedUserId: session.user.id,
    });

    // Send email
    const emailTemplate = createNewMessageEmail(
      receiver.name,
      listing.title,
      message,
      `${process.env.NEXT_PUBLIC_APP_URL}/messages?listingId=${listingId}&otherUserId=${session.user.id}`
    );

    await sendEmail(receiver.email, emailTemplate);

    return NextResponse.json(newMessage);
  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json(
      { error: 'Failed to create message' },
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
    const { messageId } = body;

    await Message.findOneAndUpdate(
      { _id: messageId, receiverId: session.user.id },
      { isRead: true }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating message:', error);
    return NextResponse.json(
      { error: 'Failed to update message' },
      { status: 500 }
    );
  }
}
