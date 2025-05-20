import { Notification, INotification } from '@/models/Notification';
import { connectDB } from './mongodb';
import mongoose from 'mongoose';

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
      users.map(async user => {
        // Determine if this was an admin action from the admin panel
        // This is a heuristic - if the previous and current states differ in specific ways,
        // it's likely an admin action rather than a regular edit
        const isLikelyAdminAction = 
          previousState.status !== currentState.status || 
          previousState.featured !== currentState.featured;
          
        // Create special messages for admins changing their own listings
        let adminMessage = null;
        if (user._id.toString() === actorUserId && isLikelyAdminAction) {
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
      'REJECTED': 'rejected'
    };
    
    const prevStatusDisplay = statusMap[previousStatus] || previousStatus.toLowerCase();
    const currStatusDisplay = statusMap[currentStatus] || currentStatus.toLowerCase();
    
    const message = `An administrator has changed your listing status from ${prevStatusDisplay} to ${currStatusDisplay}.`;
    
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
    
    // Find all users who have this listing in their favorites array
    const users = await mongoose.model('User').find({
      favorites: { $in: [listingId] }
    });
    
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
  
  // Handle status changes
  if (previousState.status !== currentState.status) {
    if (currentState.status === 'ARCHIVED') {
      return 'A listing you favorited is no longer available.';
    } else if (currentState.status === 'ACTIVE' && previousState.status === 'ARCHIVED') {
      return 'A listing you previously favorited is available again.';
    }
  }
  
  // Handle price changes
  if (previousState.price !== currentState.price) {
    const priceDiff = currentState.price - previousState.price;
    if (priceDiff < 0) {
      return `A listing you favorited has reduced its price from $${previousState.price} to $${currentState.price}.`;
    } else if (priceDiff > 0) {
      return `A listing you favorited has increased its price from $${previousState.price} to $${currentState.price}.`;
    }
  }
  
  // Handle description or title changes
  if (previousState.title !== currentState.title) {
    return `A listing you favorited has been updated with a new title: "${currentState.title}".`;
  }
  
  // Handle image changes
  if (Array.isArray(previousState.images) && Array.isArray(currentState.images) &&
      previousState.images.length !== currentState.images.length) {
    if (currentState.images.length > previousState.images.length) {
      return 'New photos have been added to a listing you favorited.';
    }
  }
  
  // Default message for general updates
  return 'A listing you favorited has been updated.';
}
