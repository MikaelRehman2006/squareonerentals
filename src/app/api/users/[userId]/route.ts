import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/mongodb';
import { Collection, ObjectId } from 'mongodb';

interface User {
  _id: ObjectId;
  id: string;
  name: string;
  email: string;
  role: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Message {
  _id: ObjectId;
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  createdAt: Date;
  read: boolean;
}

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions) as any;
    if (!session?.user?.id) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { db } = await connectToDatabase();
    const usersCollection: Collection<User> = db.collection('users');
    const messagesCollection: Collection<Message> = db.collection('messages');

    const user = await usersCollection.findOne({ id: params.userId });

    if (!user) {
      return new NextResponse(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get latest message and unread count
    const [latestMessage, unreadCount] = await Promise.all([
      messagesCollection.findOne(
        {
          $or: [
            { senderId: session.user.id, receiverId: params.userId },
            { senderId: params.userId, receiverId: session.user.id }
          ]
        },
        { sort: { createdAt: -1 } }
      ),
      messagesCollection.countDocuments({
        senderId: params.userId,
        receiverId: session.user.id,
        read: false
      })
    ]);

    return NextResponse.json({
      id: user.id,
      name: user.name,
      image: user.image,
      latestMessage,
      unreadCount
    });

  } catch (error) {
    console.error('[USER_GET]', error);
    return new NextResponse(JSON.stringify({ error: 'Internal error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
