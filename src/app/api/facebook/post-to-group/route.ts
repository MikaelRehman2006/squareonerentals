import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

interface FacebookPostData {
  message: string;
  link?: string;
  listingId: string;
  title: string;
  price: number;
  location: string;
  imageUrl?: string;
}

export async function POST(request: NextRequest) {
  try {
    // Auth check
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only allow admins to post to Facebook
    // You can modify this logic based on your needs
    if (!session.user.isAdmin) {
      return NextResponse.json({ error: 'Only admins can post to Facebook' }, { status: 403 });
    }

    // Parse request body
    const data = await request.json() as FacebookPostData;
    if (!data.message || !data.listingId || !data.title) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Fetch Facebook credentials from environment variables
    const accessToken = process.env.FACEBOOK_ACCESS_TOKEN;
    const groupId = process.env.FACEBOOK_GROUP_ID;

    if (!accessToken || !groupId) {
      return NextResponse.json(
        { error: 'Facebook integration not configured' },
        { status: 500 }
      );
    }

    // Prepare post content
    const postContent = {
      message: data.message,
      link: data.link,
      // Add more fields as needed
    };

    // Call Facebook Graph API to post to group
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${groupId}/feed`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...postContent,
          access_token: accessToken,
        }),
      }
    );

    // Handle Facebook API response
    const result = await response.json();
    if (!response.ok) {
      console.error('Facebook API error:', result);
      return NextResponse.json(
        { error: 'Failed to post to Facebook', details: result },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      postId: result.id,
      message: 'Successfully posted to Facebook group'
    });
  } catch (error) {
    console.error('Error posting to Facebook:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 