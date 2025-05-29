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
  
  // Handle title changes
  if (previousState.title !== currentState.title) {
    return `A listing you favorited has been updated with a new title: "${currentState.title}".`;
  }

  // Handle address/location changes
  if (previousState.address !== currentState.address || 
      previousState.location?.coordinates !== currentState.location?.coordinates) {
    return `A listing you favorited has updated its location/address information.`;
  }

  // Handle square footage changes
  if (previousState.squareFeet !== currentState.squareFeet) {
    return `A listing you favorited has updated its size from ${previousState.squareFeet} sq ft to ${currentState.squareFeet} sq ft.`;
  }

  // Handle bedroom changes
  if (previousState.bedrooms !== currentState.bedrooms) {
    return `A listing you favorited has updated from ${previousState.bedrooms} to ${currentState.bedrooms} bedrooms.`;
  }

  // Handle bathroom changes
  if (previousState.bathrooms !== currentState.bathrooms) {
    return `A listing you favorited has updated from ${previousState.bathrooms} to ${currentState.bathrooms} bathrooms.`;
  }

  // Handle property type changes
  if (previousState.propertyType !== currentState.propertyType) {
    return `A listing you favorited has changed its property type from ${previousState.propertyType} to ${currentState.propertyType}.`;
  }

  // Handle listing type changes
  if (previousState.listingType !== currentState.listingType) {
    return `A listing you favorited has changed from ${previousState.listingType} to ${currentState.listingType}.`;
  }

  // Handle lease type changes
  if (previousState.leaseType !== currentState.leaseType) {
    return `A listing you favorited has updated its lease type from ${previousState.leaseType} to ${currentState.leaseType}.`;
  }

  // Handle availability date changes
  if (previousState.availableFrom !== currentState.availableFrom) {
    const prevDate = new Date(previousState.availableFrom);
    const currDate = new Date(currentState.availableFrom);
    const formatDate = (date: Date) => date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    return `A listing you favorited has changed its availability date from ${formatDate(prevDate)} to ${formatDate(currDate)}.`;
  }

  // Handle parking changes
  if (previousState.parking !== currentState.parking) {
    return `A listing you favorited has updated its parking information.`;
  }
  
  // Handle image changes
  if (Array.isArray(previousState.images) && Array.isArray(currentState.images) &&
      previousState.images.length !== currentState.images.length) {
    if (currentState.images.length > previousState.images.length) {
      return 'New photos have been added to a listing you favorited.';
    }
    return 'Photos have been updated on a listing you favorited.';
  }

  // Handle amenities changes (generic message)
  if (JSON.stringify(previousState.amenities) !== JSON.stringify(currentState.amenities)) {
    return 'The owner of a listing you favorited has updated the amenities.';
  }

  // Handle unit features changes (generic message)
  if (JSON.stringify(previousState.features) !== JSON.stringify(currentState.features)) {
    return 'The owner of a listing you favorited has updated the unit features.';
  }

  // Handle utilities changes (generic message)
  if (JSON.stringify(previousState.utilities) !== JSON.stringify(currentState.utilities)) {
    return 'The owner of a listing you favorited has updated the utilities information.';
  }

  // Handle description changes
  if (previousState.description !== currentState.description) {
    return 'The description has been updated for a listing you favorited.';
  }
  
  // Default message for general updates
  return 'A listing you favorited has been updated.';
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
