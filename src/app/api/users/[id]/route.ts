import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import type { CustomSession } from '@/types/session';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions) as CustomSession | null;

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user info
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        name: true,
        image: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get last message and unread count
    const [lastMessage, unreadCount] = await Promise.all([
      prisma.message.findFirst({
        where: {
          OR: [
            { senderId: session.user.id, receiverId: params.id },
            { senderId: params.id, receiverId: session.user.id }
          ]
        },
        orderBy: {
          createdAt: 'desc'
        },
        select: {
          content: true,
          createdAt: true,
          senderId: true
        }
      }),
      prisma.message.count({
        where: {
          senderId: params.id,
          receiverId: session.user.id,
          read: false
        }
      })
    ]);

    return NextResponse.json({
      id: user.id,
      name: user.name,
      image: user.image,
      lastMessage,
      unreadCount
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
} 