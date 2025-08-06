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
      console.log('❌ Unauthorized - No user session');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check admin role
    const adminRole = getAdminRole(session.user.email);
    if (!adminRole) {
      console.log('❌ Unauthorized - Not an admin');
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

    console.log('📨 Received notification request:', { 
      type, 
      title, 
      sendToAll, 
      specificUserIds: specificUserIds?.length || 0,
      specificUserIdsArray: specificUserIds,
      messageLength: message?.length || 0
    });

    if (!type || !title || !message) {
      console.log('❌ Missing required fields');
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();
    console.log('✅ Database connected');

    // Get target user IDs if needed
    let targetUserIds: string[] = [];
    
    if (sendToAll) {
      // Get all users from database
      console.log('🔍 Fetching all users from database...');
      const allUsers = await User.find({}).select('_id email name');
      targetUserIds = allUsers.map(user => user._id.toString());
      console.log(`✅ Found ${targetUserIds.length} users in database:`, allUsers.map(u => ({ id: u._id.toString(), email: u.email, name: u.name })));
    } else if (specificUserIds && specificUserIds.length > 0) {
      targetUserIds = specificUserIds;
      console.log(`📋 Using ${targetUserIds.length} specific users:`, targetUserIds);
    } else {
      console.log('❌ No recipients specified');
      return NextResponse.json(
        { error: 'No recipients specified' },
        { status: 400 }
      );
    }

    // Handle scheduled notifications
    if (scheduledFor) {
      const scheduledDate = new Date(scheduledFor);
      console.log(`⏰ Notification scheduled for ${scheduledDate}`);
    }

    // Use the appropriate notification function based on type
    let results = [];
    let recipientCount = 0;

    try {
      console.log(`🚀 Processing ${type} notification for ${targetUserIds.length} users...`);
      
      switch (type) {
        case 'system':
          console.log('📢 Creating system notifications...');
          results = await createSystemNotification(
            `${title}: ${message}`,
            targetUserIds
          );
          recipientCount = results.length;
          console.log(`✅ Created ${recipientCount} system notifications`);
          break;
          
        case 'newsletter':
          console.log('📰 Creating newsletter notifications...');
          results = await createNewsletterNotification(
            title,
            message,
            targetUserIds
          );
          recipientCount = results.length;
          console.log(`✅ Created ${recipientCount} newsletter notifications`);
          break;
          
        case 'marketing':
          console.log('🎁 Creating marketing notifications...');
          results = await createMarketingNotification(
            title,
            message,
            targetUserIds
          );
          recipientCount = results.length;
          console.log(`✅ Created ${recipientCount} marketing notifications`);
          break;
          
        default:
          console.log(`📝 Creating ${type} notifications manually...`);
          // For other types, create individual notifications manually
          for (const userId of targetUserIds) {
            try {
              const notification = await createNotification({
                userId,
                message: `${title}: ${message}`,
                type: mapNotificationType(type),
                sendEmail: true, // Explicitly enable email sending
              });
              results.push(notification);
            } catch (error) {
              console.error(`❌ Failed to create notification for user ${userId}:`, error);
            }
          }
          recipientCount = results.length;
          console.log(`✅ Created ${recipientCount} ${type} notifications`);
      }

      console.log(`🎉 Successfully created ${recipientCount} notifications`);

      return NextResponse.json({
        success: true,
        recipientCount
      });
    } catch (error) {
      console.error('❌ Error creating notifications:', error);
      throw error;
    }
  } catch (error) {
    console.error('❌ Error sending admin notification:', error);
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