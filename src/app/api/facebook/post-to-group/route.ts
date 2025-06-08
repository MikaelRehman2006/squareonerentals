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
    if (!session.user.role || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: 'Only admins can post to Facebook' }, { status: 403 });
    }

    // Parse request body
    const data = await request.json() as FacebookPostData;
    if (!data.message || !data.listingId || !data.title) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Fetch Facebook credentials from environment variables
    const accessToken = process.env.FACEBOOK_ACCESS_TOKEN;
    const pageId = process.env.FACEBOOK_PAGE_ID;
    const groupId = process.env.FACEBOOK_GROUP_ID;

    console.log('Facebook integration check:', {
      hasAccessToken: !!accessToken,
      hasPageId: !!pageId,
      hasGroupId: !!groupId
    });

    if (!accessToken || !pageId) {
      return NextResponse.json(
        { error: 'Facebook integration not configured' },
        { status: 500 }
      );
    }

    // Prepare post content
    const postContent = {
      message: data.message,
      link: data.link,
    };

    // First, we need to post as the Page - either to the Page's feed or directly to the group
    let endpoint = `https://graph.facebook.com/v18.0/${pageId}/feed`;
    
    // If we have a group ID and want to post directly to the group
    if (groupId) {
      // For posting to a group as a Page, we need to use the page access token
      // and post to the group's feed
      endpoint = `https://graph.facebook.com/v18.0/${groupId}/feed`;
    }

    console.log('Using Facebook API endpoint:', endpoint);
    console.log('Post content:', postContent);

    // Call Facebook Graph API to post as the Page
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...postContent,
        access_token: accessToken,
      }),
    });

    // Handle Facebook API response
    const result = await response.json();
    
    console.log('Facebook API response status:', response.status);
    console.log('Facebook API response:', result);
    
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
      message: groupId 
        ? 'Successfully posted to Facebook group' 
        : 'Successfully posted to Facebook Page'
    });
  } catch (error) {
    console.error('Error posting to Facebook:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 