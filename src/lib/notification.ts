import { Notification, INotification } from '@/models/Notification';
import { connectDB } from './mongodb';
import mongoose from 'mongoose';
import { sendNotificationEmail } from '@/utils/resend';
import { User } from '@/models/User';

/**
 * Check if user should receive notifications based on their preferences
 */
async function shouldSendNotification(userId: string, notificationType: string, channel: 'inApp' | 'email'): Promise<boolean> {
  try {
    const user = await User.findById(userId);
    if (!user) {
      console.log(`❌ User not found for notification preferences: ${userId}`);
      return false;
    }

    const preferences = (user.preferences as any)?.notificationSettings;
    if (!preferences) {
      console.log(`📋 No notification preferences found for user ${userId}, defaulting to true`);
      return true; // Default to true if no preferences set
    }

    // Map notification types to preference keys
    const typeMapping: Record<string, string> = {
      'SYSTEM': 'systemAlerts',
      'NEWSLETTER': 'newsletter',
      'MARKETING': 'specialOffers',
      'FAVORITE': 'favoriteUpdates',
      'LISTING_UPDATE': 'listingChanges',
      'PAYMENT': 'paymentNotifications',
      'WELCOME': 'systemAlerts', // Welcome notifications fall under system alerts
    };

    const preferenceKey = typeMapping[notificationType];
    if (!preferenceKey) {
      console.log(`⚠️ Unknown notification type: ${notificationType}, defaulting to true`);
      return true; // Default to true for unknown types
    }

    const userPreference = preferences[preferenceKey];
    if (!userPreference) {
      console.log(`📋 No preference found for ${preferenceKey}, defaulting to true`);
      return true; // Default to true if preference not set
    }

    const shouldSend = userPreference[channel] !== false;
    console.log(`🔔 Notification preference check: user=${userId}, type=${notificationType}, channel=${channel}, preference=${preferenceKey}, shouldSend=${shouldSend}`);
    return shouldSend; // Only return false if explicitly set to false
  } catch (error) {
    console.error('Error checking user notification preferences:', error);
    return true; // Default to true on error
  }
}

/**
 * Create a notification for a user and optionally send an email
 */
export async function createNotification({
  userId,
  message,
  type,
  listingId,
  relatedUserId,
  sendEmail = true,
}: Pick<INotification, 'userId' | 'message' | 'type' | 'listingId' | 'relatedUserId'> & { sendEmail?: boolean }) {
  try {
    console.log(`🔔 Creating ${type} notification for user ${userId} (sendEmail: ${sendEmail})`);
    
    // Ensure we have a valid MongoDB connection
    const db = await connectDB();
    if (!db) {
      throw new Error('Failed to connect to database');
    }
    
    // Validate the notification type
    const validTypes = ['MESSAGE', 'LISTING_UPDATE', 'FAVORITE', 'SYSTEM', 'NEWSLETTER', 'MARKETING', 'PAYMENT', 'WELCOME'];
    if (!validTypes.includes(type)) {
      throw new Error(`Invalid notification type: ${type}`);
    }
    
    // Check if user wants in-app notifications
    const shouldSendInApp = await shouldSendNotification(userId, type, 'inApp');
    if (!shouldSendInApp) {
      console.log(`⚠️ In-app notifications disabled for user ${userId}, type ${type}`);
      // Still create notification but mark as read immediately
      const notification = await Notification.create({
        userId,
        message,
        type,
        listingId,
        relatedUserId,
        read: true, // Mark as read since user doesn't want to see it
      });
      return notification;
    }
    
    // Create the notification
    const notification = await Notification.create({
      userId,
      message,
      type,
      listingId,
      relatedUserId,
      read: false,
    });
    
    if (!notification) {
      throw new Error('Failed to create notification - no notification object returned');
    }
    
    console.log(`✅ Notification created successfully:`, {
      id: notification._id,
      userId: notification.userId,
      type: notification.type,
      message: notification.message
    });

    // Send email notification if requested
    if (sendEmail) {
      // Check if user wants email notifications
      const shouldSendEmail = await shouldSendNotification(userId, type, 'email');
      if (!shouldSendEmail) {
        console.log(`⚠️ Email notifications disabled for user ${userId}, type ${type}`);
      } else {
        console.log(`📧 Email sending enabled - triggering email send...`);
        try {
          await sendNotificationEmailForUser(userId, {
            message,
            type,
            listingId,
            relatedUserId,
          });
          console.log(`✅ Email send process completed for user ${userId}`);
        } catch (emailError) {
          console.error(`❌ Failed to send notification email for user ${userId}:`, emailError);
          // Don't throw error here - notification was created successfully
        }
      }
    } else {
      console.log(`⚠️ Email sending disabled for this notification`);
    }
    
    return notification;
  } catch (error) {
    console.error('❌ Error creating notification:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace',
      userId,
      type,
      message,
      sendEmail
    });
    
    // Re-throw the error to be handled by the caller
    throw error;
  }
}

/**
 * Send notification email for a user
 */
async function sendNotificationEmailForUser(
  userId: string, 
  notificationData: {
    message: string;
    type: string;
    listingId?: string;
    relatedUserId?: string;
  }
) {
  try {
    console.log(`📧 Starting email send process for user ${userId}`);
    
    // Get user information
    const user = await User.findById(userId);
    if (!user) {
      console.error(`❌ User not found for notification email: ${userId}`);
      console.error(`❌ This means the user doesn't exist in the database`);
      return;
    }

    console.log(`✅ User found: ${user.name} (${user.email})`);
    console.log(`📧 User email: ${user.email}`);
    console.log(`👤 User name: ${user.name}`);

    // Check if user has email preferences (for now, default to true)
    // In the future, this could be stored in user preferences
    const shouldSendEmail = true; // TODO: Check user email preferences
    
    if (!shouldSendEmail) {
      console.log(`⚠️ Email notifications disabled for user ${userId}`);
      return;
    }

    // Generate subject line based on notification type
    const subject = generateEmailSubject(notificationData.type, notificationData.message);
    console.log(`📝 Generated subject: ${subject}`);
    
    // Send email using Resend
    console.log(`🚀 Attempting to send email to ${user.email}...`);
    const emailResult = await sendNotificationEmail({
      userEmail: user.email,
      userName: user.name,
      subject,
      message: notificationData.message,
      notificationType: notificationData.type as any,
      actionUrl: generateActionUrl(notificationData.type, notificationData.listingId),
      actionText: generateActionText(notificationData.type),
    });

    if (emailResult) {
      console.log(`✅ Notification email sent successfully to ${user.email}`);
    } else {
      console.error(`❌ Failed to send notification email to ${user.email}`);
    }
  } catch (error) {
    console.error('❌ Error sending notification email:', error);
    console.error('Error details:', {
      userId,
      notificationData,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace'
    });
  }
}

/**
 * Generate email subject based on notification type
 */
function generateEmailSubject(type: string, message: string): string {
  const typeSubjects = {
    SYSTEM: 'System Alert - Square One Rentals',
    NEWSLETTER: 'Newsletter - Square One Rentals',
    MARKETING: 'Special Offer - Square One Rentals',
    PAYMENT: 'Payment Notification - Square One Rentals',
    LISTING_UPDATE: 'Listing Update - Square One Rentals',
    FAVORITE: 'Favorite Listing Update - Square One Rentals',
    MESSAGE: 'New Message - Square One Rentals',
    WELCOME: 'Welcome to Square One Rentals',
  };

  return typeSubjects[type as keyof typeof typeSubjects] || 'Notification - Square One Rentals';
}

/**
 * Generate action URL based on notification type
 */
function generateActionUrl(type: string, listingId?: string): string {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://squareone-rentals.com';
  
  switch (type) {
    case 'LISTING_UPDATE':
    case 'FAVORITE':
      return listingId ? `${baseUrl}/listings/${listingId}` : `${baseUrl}/listings`;
    case 'PAYMENT':
      return `${baseUrl}/dashboard/billing`;
    case 'MESSAGE':
      return `${baseUrl}/notifications`;
    case 'SYSTEM':
    case 'NEWSLETTER':
    case 'MARKETING':
      return `${baseUrl}/dashboard`;
    default:
      return baseUrl;
  }
}

/**
 * Generate action text based on notification type
 */
function generateActionText(type: string): string {
  const actionTexts = {
    SYSTEM: 'View Details',
    NEWSLETTER: 'Read More',
    MARKETING: 'View Offer',
    PAYMENT: 'View Billing',
    LISTING_UPDATE: 'View Listing',
    FAVORITE: 'View Listing',
    MESSAGE: 'View Message',
    WELCOME: 'Get Started',
  };

  return actionTexts[type as keyof typeof actionTexts] || 'View Details';
}

/**
 * Get all notifications for a user
 */
export async function getUserNotifications(userId: string, limit = 50, offset = 0) {
  try {
    await connectDB();
    
    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .populate('listingId', 'title images location price')
      .populate('relatedUserId', 'name image');
    
    return notifications;
  } catch (error) {
    console.error('Error fetching user notifications:', error);
    throw error;
  }
}

/**
 * Mark notifications as read
 */
export async function markNotificationsAsRead(notificationIds: string[]) {
  try {
    await connectDB();
    
    await Notification.updateMany(
      { _id: { $in: notificationIds } },
      { $set: { read: true } }
    );
    
    return true;
  } catch (error) {
    console.error('Error marking notifications as read:', error);
    throw error;
  }
}

/**
 * Get unread notification count for a user
 */
export async function getUnreadCount(userId: string) {
  try {
    if (!userId) {
      console.warn('getUnreadCount called with empty userId');
      return 0;
    }

    // Check if userId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.warn(`Invalid userId format: ${userId}`);
      return 0;
    }

    await connectDB();
    
    const count = await Notification.countDocuments({ 
      userId, 
      read: false 
    });
    
    return count || 0;
  } catch (error) {
    console.error('Error getting unread notification count:', error);
    return 0;
  }
}

/**
 * Create notification for users who favorited a listing that was updated
 * Compares previous and current states to create meaningful change notifications
 */
export async function notifyFavoritedListingChange(
  listingId: string, 
  previousState: any, 
  currentState: any,
  actorUserId: string // The user who made the change
) {
  try {
    await connectDB();
    
    // 1. Find all users who favorited this listing
    const users = await getUsersWhoFavoritedListing(listingId);
    
    // 2. Skip if no users have favorited this listing
    if (!users || users.length === 0) {
      return;
    }
    
    // 3. Generate notification message based on changes
    const message = generateChangeMessage(previousState, currentState);
    
    // 4. Create notifications for each user who favorited the listing
    // Create notifications for all users who favorited the listing
    // We do NOT filter out the user who made the change, as they might want to know
    // about their own changes when made through different interfaces (like admin panel)
    const notifications = await Promise.all(
      users.map(async (user: any) => {
        // Determine if this was an admin action from the admin panel
        // This is a heuristic - if the previous and current states differ in specific ways,
        // it's likely an admin action rather than a regular edit
        const isLikelyAdminAction = 
          previousState.status !== currentState.status || 
          previousState.featured !== currentState.featured;
          
        // Create special messages for admins changing their own listings
        let adminMessage = null;
        if (user._id && user._id.toString() === actorUserId && isLikelyAdminAction) {
          if (previousState.status !== currentState.status) {
            adminMessage = `You changed the status of your listing from ${previousState.status?.toLowerCase() || 'unknown'} to ${currentState.status?.toLowerCase() || 'unknown'} via the Admin Panel.`;
          } else if (previousState.featured !== currentState.featured) {
            const action = currentState.featured ? 'featured' : 'unfeatured';
            adminMessage = `You ${action} your own listing via the Admin Panel.`;
          }
        }
        
        return createNotification({
          userId: user._id.toString(),
          message: adminMessage || message,
          type: 'FAVORITE',
          listingId,
          relatedUserId: actorUserId,
          sendEmail: true, // Explicitly enable email sending
        });
      })
    );
    
    return notifications;
  } catch (error) {
    console.error('Error notifying users about listing change:', error);
  }
}

/**
 * Create notification when an admin changes listing status
 */
export async function notifyAdminStatusChange(
  listingId: string,
  previousStatus: string,
  currentStatus: string,
  ownerId: string,
  adminId: string
) {
  try {
    
    const statusMap: Record<string, string> = {
      'ACTIVE': 'active',
      'PENDING': 'pending review',
      'ARCHIVED': 'archived',
      'FEATURED': 'featured',
      'REJECTED': 'rejected',
      'FLAGGED': 'flagged for review'
    };
    
    const prevStatusDisplay = statusMap[previousStatus] || previousStatus.toLowerCase();
    const currStatusDisplay = statusMap[currentStatus] || currentStatus.toLowerCase();
    
    let message = '';
    
    // Create more specific messages for common admin actions
    if (currentStatus === 'FLAGGED') {
      message = `Your listing has been flagged for review by an administrator. This typically happens when content requires verification or has potential policy violations.`;
    } else if (currentStatus === 'ARCHIVED' && previousStatus !== 'ARCHIVED') {
      message = `Your listing has been archived by an administrator. It is no longer visible to other users.`;
    } else if (currentStatus === 'ACTIVE' && previousStatus === 'ARCHIVED') {
      message = `Good news! Your listing has been reactivated by an administrator and is now visible to other users.`;
    } else if (currentStatus === 'ACTIVE' && previousStatus === 'FLAGGED') {
      message = `Good news! Your listing has passed admin review and has been reactivated.`;
    } else if (currentStatus === 'FEATURED') {
      message = `Congratulations! Your listing has been featured by an administrator and will receive more visibility.`;
    } else if (currentStatus === 'REJECTED') {
      message = `Your listing has been rejected by an administrator and is no longer visible to other users. This typically happens due to policy violations.`;
    } else {
      // Generic message for other status changes
      message = `An administrator has changed your listing status from ${prevStatusDisplay} to ${currStatusDisplay}.`;
    }
    
    const notification = await createNotification({
      userId: ownerId,
      message,
      type: 'LISTING_UPDATE',
      listingId,
      relatedUserId: adminId,
      sendEmail: true, // Explicitly enable email sending
    });
    
    return notification;
  } catch (error) {
    console.error('Error notifying owner about admin status change:', error);
    return null;
  }
}

// Helper function to get users who favorited a listing
async function getUsersWhoFavoritedListing(listingId: string) {
  try {
    await connectDB();
    
    // Convert listingId string to ObjectId to ensure proper matching
    const objectId = new mongoose.Types.ObjectId(listingId);
    
    // First, check if the listing has a favoritedBy field with user IDs
    const listing = await mongoose.model('Listing').findById(objectId).lean() as any;
    
    let userIds: mongoose.Types.ObjectId[] = [];
    
    // If listing has favoritedBy field with user IDs, use those
    if (listing && listing.favoritedBy && Array.isArray(listing.favoritedBy) && listing.favoritedBy.length > 0) {
      userIds = listing.favoritedBy;
      console.log(`Found ${userIds.length} users in listing.favoritedBy for listing ${listingId}`);
    }
    
    // Also find users who have this listing in their favorites array
    const usersWithFavorite = await mongoose.model('User').find({
      favorites: objectId
    }).lean() as any[];
    
    console.log(`Found ${usersWithFavorite.length} users with listing in their favorites array for listing ${listingId}`);
    
    // Combine the two sets of users (from listing.favoritedBy and user.favorites)
    const userIdStrings = new Set([
      ...userIds.map(id => id.toString()),
      ...usersWithFavorite.map(user => user._id ? user._id.toString() : '')
    ].filter(Boolean));
    
    // Fetch the complete user objects for all user IDs
    const users = await mongoose.model('User').find({
      _id: { $in: Array.from(userIdStrings).map(id => new mongoose.Types.ObjectId(id)) }
    }).lean() as any[];
    
    console.log(`After combining, found a total of ${users.length} unique users who favorited listing ${listingId}`);
    
    return users;
  } catch (error) {
    console.error('Error finding users who favorited listing:', error);
    return [];
  }
}

// Helper function to generate a meaningful change message
function generateChangeMessage(previousState: any, currentState: any) {
  if (!previousState || !currentState) {
    return 'A listing you favorited has been updated.';
  }
  
  // Collect all the changes
  const changes: string[] = [];
  
  // Handle status changes
  if (previousState.status !== currentState.status) {
    if (currentState.status === 'ARCHIVED') {
      changes.push('The listing is no longer available');
    } else if (currentState.status === 'ACTIVE' && previousState.status === 'ARCHIVED') {
      changes.push('The listing is available again');
    } else {
      changes.push(`Status changed from ${previousState.status?.toLowerCase() || 'unknown'} to ${currentState.status?.toLowerCase() || 'unknown'}`);
    }
  }
  
  // Handle price changes
  if (previousState.price !== currentState.price) {
    const priceDiff = currentState.price - previousState.price;
    if (priceDiff < 0) {
      changes.push(`Price reduced from $${previousState.price} to $${currentState.price}`);
    } else if (priceDiff > 0) {
      changes.push(`Price increased from $${previousState.price} to $${currentState.price}`);
    }
  }
  
  // Handle title changes
  if (previousState.title !== currentState.title) {
    changes.push(`Title updated to "${currentState.title}"`);
  }

  // Handle address/location changes
  if (previousState.address !== currentState.address) {
    changes.push(`Address has been updated`);
  }
  
  if (typeof previousState.location === 'string' && 
      typeof currentState.location === 'string' && 
      previousState.location !== currentState.location) {
    changes.push(`Location updated from "${previousState.location}" to "${currentState.location}"`);
  }

  // Handle square footage changes
  if (previousState.squareFeet !== currentState.squareFeet) {
    changes.push(`Size updated from ${previousState.squareFeet} sq ft to ${currentState.squareFeet} sq ft`);
  }

  // Handle bedroom changes
  if (previousState.bedrooms !== currentState.bedrooms) {
    changes.push(`Bedrooms updated from ${previousState.bedrooms} to ${currentState.bedrooms}`);
  }

  // Handle bathroom changes
  if (previousState.bathrooms !== currentState.bathrooms) {
    changes.push(`Bathrooms updated from ${previousState.bathrooms} to ${currentState.bathrooms}`);
  }

  // Handle property type changes
  if (previousState.propertyType !== currentState.propertyType) {
    changes.push(`Property type changed from ${previousState.propertyType} to ${currentState.propertyType}`);
  }

  // Handle listing type changes
  if (previousState.listingType !== currentState.listingType) {
    changes.push(`Listing type changed from ${previousState.listingType} to ${currentState.listingType}`);
  }

  // Handle lease type changes
  if (previousState.leaseType !== currentState.leaseType) {
    changes.push(`Lease type updated from ${previousState.leaseType} to ${currentState.leaseType}`);
  }

  // Handle availability date changes
  if (previousState.availableDate !== currentState.availableDate) {
    const prevDate = new Date(previousState.availableDate);
    const currDate = new Date(currentState.availableDate);
    const formatDate = (date: Date) => date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    changes.push(`Availability date changed from ${formatDate(prevDate)} to ${formatDate(currDate)}`);
  }

  // Handle parking changes
  if (previousState.parking !== currentState.parking) {
    changes.push(`Parking information has been updated`);
  }
  
  // Handle image changes
  if (Array.isArray(previousState.images) && Array.isArray(currentState.images) &&
      previousState.images.length !== currentState.images.length) {
    if (currentState.images.length > previousState.images.length) {
      changes.push(`New photos have been added`);
    } else {
      changes.push(`Photos have been updated`);
    }
  }

  // Handle amenities changes
  if (JSON.stringify(previousState.amenities) !== JSON.stringify(currentState.amenities)) {
    changes.push(`Building amenities have been updated`);
  }

  // Handle unit features changes
  if (JSON.stringify(previousState.features) !== JSON.stringify(currentState.features)) {
    changes.push(`Unit features have been updated`);
  }

  // Handle utilities changes
  if (JSON.stringify(previousState.utilities) !== JSON.stringify(currentState.utilities)) {
    changes.push(`Utilities included have been updated`);
  }

  // Handle description changes
  if (previousState.description !== currentState.description) {
    changes.push(`Description has been updated`);
  }
  
  // If no specific changes were detected
  if (changes.length === 0) {
    return 'A listing you favorited has been updated.';
  }
  
  // If there's only one change, use the standard format
  if (changes.length === 1) {
    return `A listing you favorited has been updated: ${changes[0]}.`;
  }
  
  // For multiple changes, create a bulleted list with proper HTML formatting
  return `A listing you favorited has been updated with multiple changes:<br><br>• ${changes.join('<br>• ')}`;
}

/**
 * Create system notification for all users or specific users
 */
export async function createSystemNotification(
  message: string,
  userIds?: string[]
) {
  try {
    console.log('📢 Starting createSystemNotification...', { message, userIdsCount: userIds?.length || 0 });
    await connectDB();
    console.log('✅ Database connected for system notification');
    
    // If no userIds specified, get all users
    if (!userIds || userIds.length === 0) {
      console.log('🔍 No userIds provided, fetching all users...');
      const allUsers = await mongoose.model('User').find().select('_id');
      userIds = allUsers.map(user => user._id.toString());
      console.log(`✅ Found ${userIds.length} users for system notification`);
    } else {
      console.log(`📋 Using provided ${userIds.length} userIds for system notification`);
    }
    
    console.log('🚀 Creating system notifications for users:', userIds);
    
    // Create notifications for all specified users
    const notifications = await Promise.all(
      userIds!.map(async (userId, index) => {
        console.log(`📝 Creating system notification ${index + 1}/${userIds!.length} for user ${userId}`);
        try {
          const notification = await createNotification({
            userId,
            message,
            type: 'SYSTEM',
            sendEmail: true, // Explicitly enable email sending
          });
          console.log(`✅ System notification created for user ${userId}:`, notification._id);
          return notification;
        } catch (error) {
          console.error(`❌ Failed to create system notification for user ${userId}:`, error);
          throw error;
        }
      })
    );
    
    console.log(`🎉 Successfully created ${notifications.length} system notifications`);
    return notifications;
  } catch (error) {
    console.error('❌ Error creating system notification:', error);
    throw error;
  }
}

/**
 * Create newsletter notification for all users or specific users
 */
export async function createNewsletterNotification(
  title: string,
  content: string,
  userIds?: string[]
) {
  try {
    console.log('📰 Starting createNewsletterNotification...', { title, content, userIdsCount: userIds?.length || 0 });
    await connectDB();
    console.log('✅ Database connected for newsletter notification');
    
    // If no userIds specified, get all users
    if (!userIds || userIds.length === 0) {
      console.log('🔍 No userIds provided, fetching all users...');
      const allUsers = await mongoose.model('User').find().select('_id');
      userIds = allUsers.map(user => user._id.toString());
      console.log(`✅ Found ${userIds.length} users for newsletter notification`);
    } else {
      console.log(`📋 Using provided ${userIds.length} userIds for newsletter notification`);
    }
    
    console.log('🚀 Creating newsletter notifications for users:', userIds);
    
    // Create notifications for all specified users
    const notifications = await Promise.all(
      userIds!.map(async (userId, index) => {
        console.log(`📝 Creating newsletter notification ${index + 1}/${userIds!.length} for user ${userId}`);
        try {
          const notification = await createNotification({
            userId,
            message: `${title}: ${content}`,
            type: 'NEWSLETTER',
            sendEmail: true, // Explicitly enable email sending
          });
          console.log(`✅ Newsletter notification created for user ${userId}:`, notification._id);
          return notification;
        } catch (error) {
          console.error(`❌ Failed to create newsletter notification for user ${userId}:`, error);
          throw error;
        }
      })
    );
    
    console.log(`🎉 Successfully created ${notifications.length} newsletter notifications`);
    return notifications;
  } catch (error) {
    console.error('❌ Error creating newsletter notification:', error);
    throw error;
  }
}

/**
 * Create marketing notification for all users or specific users
 */
export async function createMarketingNotification(
  offerTitle: string,
  offerDetails: string,
  userIds?: string[]
) {
  try {
    console.log('🎁 Starting createMarketingNotification...', { offerTitle, offerDetails, userIdsCount: userIds?.length || 0 });
    await connectDB();
    console.log('✅ Database connected for marketing notification');
    
    // If no userIds specified, get all users
    if (!userIds || userIds.length === 0) {
      console.log('🔍 No userIds provided, fetching all users...');
      const allUsers = await mongoose.model('User').find().select('_id');
      userIds = allUsers.map(user => user._id.toString());
      console.log(`✅ Found ${userIds.length} users for marketing notification`);
    } else {
      console.log(`📋 Using provided ${userIds.length} userIds for marketing notification`);
    }
    
    console.log('🚀 Creating marketing notifications for users:', userIds);
    
    // Create notifications for all specified users
    const notifications = await Promise.all(
      userIds!.map(async (userId, index) => {
        console.log(`📝 Creating marketing notification ${index + 1}/${userIds!.length} for user ${userId}`);
        try {
          const notification = await createNotification({
            userId,
            message: `${offerTitle}: ${offerDetails}`,
            type: 'MARKETING',
            sendEmail: true, // Explicitly enable email sending
          });
          console.log(`✅ Marketing notification created for user ${userId}:`, notification._id);
          return notification;
        } catch (error) {
          console.error(`❌ Failed to create marketing notification for user ${userId}:`, error);
          throw error;
        }
      })
    );
    
    console.log(`🎉 Successfully created ${notifications.length} marketing notifications`);
    return notifications;
  } catch (error) {
    console.error('❌ Error creating marketing notification:', error);
    throw error;
  }
}

/**
 * Create payment notification for a specific user
 */
export async function createPaymentNotification(
  userId: string,
  paymentType: 'receipt' | 'invoice' | 'failure',
  amount: number,
  details: string
) {
  try {
    await connectDB();
    
    let message = '';
    
    switch (paymentType) {
      case 'receipt':
        message = `Payment Receipt: $${amount} - ${details}`;
        break;
      case 'invoice':
        message = `New Invoice: $${amount} - ${details}`;
        break;
      case 'failure':
        message = `Payment Failed: $${amount} - ${details}`;
        break;
    }
    
    const notification = await createNotification({
      userId,
      message,
      type: 'PAYMENT',
      sendEmail: true, // Explicitly enable email sending
    });
    
    return notification;
  } catch (error) {
    console.error('Error creating payment notification:', error);
    throw error;
  }
}
