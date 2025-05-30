import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import { 
  createNotification, 
  createSystemNotification, 
  createNewsletterNotification, 
  createMarketingNotification,
  createPaymentNotification
} from '@/lib/notification';
import { getAdminRole } from '@/lib/admin';
import { User } from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      console.log('Unauthorized - No user session');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check admin role
    const adminRole = getAdminRole(session.user.email);
    if (!adminRole) {
      console.log('Unauthorized - Not an admin');
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { 
      type, 
      title, 
      message, 
      sendToAll, 
      specificUserIds,
      scheduledFor 
    } = body;

    console.log('Received notification request:', { type, title, sendToAll, specificUserIds });

    if (!type || !title || !message) {
      console.log('Missing required fields');
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Get target user IDs if needed
    let targetUserIds: string[] = [];
    
    if (!sendToAll && specificUserIds && specificUserIds.length > 0) {
      targetUserIds = specificUserIds;
      console.log(`Sending to ${targetUserIds.length} specific users`);
    } else if (!sendToAll) {
      console.log('No recipients specified');
      return NextResponse.json(
        { error: 'No recipients specified' },
        { status: 400 }
      );
    }

    // Handle scheduled notifications
    if (scheduledFor) {
      const scheduledDate = new Date(scheduledFor);
      // In a real app, you would save this to a scheduled jobs collection
      // and use a cron job or similar to process them
      console.log(`Notification scheduled for ${scheduledDate}`);
    }

    // Use the appropriate notification function based on type
    let results = [];
    let recipientCount = 0;

    try {
      switch (type) {
        case 'system':
          results = await createSystemNotification(
            `${title}: ${message}`,
            sendToAll ? undefined : targetUserIds
          );
          recipientCount = results.length;
          break;
          
        case 'newsletter':
          results = await createNewsletterNotification(
            title,
            message,
            sendToAll ? undefined : targetUserIds
          );
          recipientCount = results.length;
          break;
          
        case 'marketing':
          results = await createMarketingNotification(
            title,
            message,
            sendToAll ? undefined : targetUserIds
          );
          recipientCount = results.length;
          break;
          
        default:
          // For other types, create individual notifications manually
          if (sendToAll) {
            const users = await User.find({}).select('_id');
            targetUserIds = users.map(user => user._id.toString());
          }
          
          for (const userId of targetUserIds) {
            try {
              const notification = await createNotification({
                userId,
                message: `${title}: ${message}`,
                type: mapNotificationType(type),
              });
              results.push(notification);
            } catch (error) {
              console.error(`Failed to create notification for user ${userId}:`, error);
            }
          }
          recipientCount = results.length;
      }

      console.log(`Successfully created ${recipientCount} notifications`);

      return NextResponse.json({
        success: true,
        recipientCount
      });
    } catch (error) {
      console.error('Error creating notifications:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error sending admin notification:', error);
    return NextResponse.json(
      { error: 'Failed to send notification' },
      { status: 500 }
    );
  }
}

// Helper function to map front-end notification types to database model types
function mapNotificationType(type: string): 'MESSAGE' | 'LISTING_UPDATE' | 'FAVORITE' | 'SYSTEM' | 'NEWSLETTER' | 'MARKETING' | 'PAYMENT' | 'WELCOME' {
  switch (type) {
    case 'system':
      return 'SYSTEM';
    case 'listing_update':
      return 'LISTING_UPDATE';
    case 'favorite_update':
      return 'FAVORITE';
    case 'message':
      return 'MESSAGE';
    case 'newsletter':
      return 'NEWSLETTER';
    case 'marketing':
      return 'MARKETING';
    case 'payment':
      return 'PAYMENT';
    case 'welcome':
      return 'WELCOME';
    default:
      return 'SYSTEM';
  }
} 