import { Notification, INotification } from '@/models/Notification';
import { connectDB } from './mongodb';
import mongoose from 'mongoose';
import { sendNotificationEmail } from '@/utils/sendgrid';
import { User } from '@/models/User';

/**
 * Create a notification for a user
 */
export async function createNotification({
  userId,
  message,
  type,
  listingId,
  relatedUserId,
}: Pick<INotification, 'userId' | 'message' | 'type' | 'listingId' | 'relatedUserId'>) {
  try {
    await connectDB();
    
    const notification = await Notification.create({
      userId,
      message,
      type,
      listingId,
      relatedUserId,
      read: false,
    });
    
    // Also send an email notification
    try {
      // Get the user's email and name
      const user = await User.findById(userId).select('name email').lean();
      
      if (user && user.email) {
        // Set a subject based on the notification type
        let subject = 'New Notification';
        
        switch (type) {
          case 'PAYMENT':
            subject = 'Payment Notification';
            break;
          case 'LISTING_UPDATE':
            subject = 'Listing Update';
            break;
          case 'SYSTEM':
            subject = 'System Notification';
            break;
          case 'MARKETING':
            subject = 'Special Offer';
            break;
          case 'NEWSLETTER':
            subject = 'Newsletter';
            break;
        }
        
        // Send the email notification
        await sendNotificationEmail({
          userEmail: user.email,
          userName: user.name || 'User',
          subject,
          message,
          notificationType: type,
        });
      }
    } catch (emailError) {
      // Log the error but don't fail the function
      console.error('Error sending notification email:', emailError);
    }
    
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
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
    await connectDB();
    
    const count = await Notification.countDocuments({ 
      userId, 
      read: false 
    });
    
    return count;
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
          type: 'LISTING_UPDATE',
          listingId,
          relatedUserId: actorUserId,
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
    changes.push(`Address updated`);
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
    changes.push(`Parking information updated`);
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
    changes.push(`Amenities have been updated`);
  }

  // Handle unit features changes
  if (JSON.stringify(previousState.features) !== JSON.stringify(currentState.features)) {
    changes.push(`Unit features have been updated`);
  }

  // Handle utilities changes
  if (JSON.stringify(previousState.utilities) !== JSON.stringify(currentState.utilities)) {
    changes.push(`Utilities information has been updated`);
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
  
  // For multiple changes, create a bulleted list
  return `A listing you favorited has been updated with multiple changes:\n• ${changes.join('\n• ')}`;
}

/**
 * Create system notification for all users or specific users
 */
export async function createSystemNotification(
  message: string,
  userIds?: string[]
) {
  try {
    await connectDB();
    
    // If no userIds specified, get all users
    if (!userIds || userIds.length === 0) {
      const allUsers = await mongoose.model('User').find().select('_id');
      userIds = allUsers.map(user => user._id.toString());
    }
    
    // Create notifications for all specified users
    const notifications = await Promise.all(
      userIds.map(userId => 
        createNotification({
          userId,
          message,
          type: 'SYSTEM',
        })
      )
    );
    
    return notifications;
  } catch (error) {
    console.error('Error creating system notification:', error);
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
    await connectDB();
    
    // If no userIds specified, get all users
    if (!userIds || userIds.length === 0) {
      const allUsers = await mongoose.model('User').find().select('_id');
      userIds = allUsers.map(user => user._id.toString());
    }
    
    // Create notifications for all specified users
    const notifications = await Promise.all(
      userIds.map(userId => 
        createNotification({
          userId,
          message: `${title}: ${content}`,
          type: 'NEWSLETTER',
        })
      )
    );
    
    return notifications;
  } catch (error) {
    console.error('Error creating newsletter notification:', error);
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
    await connectDB();
    
    // If no userIds specified, get all users
    if (!userIds || userIds.length === 0) {
      const allUsers = await mongoose.model('User').find().select('_id');
      userIds = allUsers.map(user => user._id.toString());
    }
    
    // Create notifications for all specified users
    const notifications = await Promise.all(
      userIds.map(userId => 
        createNotification({
          userId,
          message: `${offerTitle}: ${offerDetails}`,
          type: 'MARKETING',
        })
      )
    );
    
    return notifications;
  } catch (error) {
    console.error('Error creating marketing notification:', error);
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
    });
    
    return notification;
  } catch (error) {
    console.error('Error creating payment notification:', error);
    throw error;
  }
}
