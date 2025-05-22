import { Collection, ObjectId } from 'mongodb';
import mongoose from 'mongoose';
import { connectDB, disconnectDB } from './mongodb';

interface Activity {
  _id: ObjectId;
  id: string;
  userId: string | null;
  type: string;
  data: {
    description: string;
    metadata?: ActivityMetadata;
  };
  createdAt: Date;
  updatedAt: Date;
}

interface ActivityMetadata {
  userId?: string;
  listingId?: string;
  reportId?: string;
  [key: string]: any;
}

export type ActivityType = 
  | 'USER_CREATED'
  | 'USER_UPDATED'
  | 'LISTING_CREATED'
  | 'LISTING_UPDATED'
  | 'LISTING_DELETED'
  | 'REPORT_CREATED'
  | 'REPORT_RESOLVED';

export async function logActivity(
  type: ActivityType,
  description: string,
  metadata?: ActivityMetadata
) {
  try {
    await connectDB(); // Connect to MongoDB using mongoose
    const db = mongoose.connection.db; // Get the native MongoDB driver database instance
    const activitiesCollection: Collection<Activity> = db.collection('activities');

    const activity: Activity = {
      _id: new ObjectId(),
      id: new ObjectId().toString(),
      userId: metadata?.userId || null,
      type,
      data: {
        description,
        metadata,
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await activitiesCollection.insertOne(activity);

  } catch (error) {
    console.error('[LOG_ACTIVITY]', error);
    // Don't throw error to prevent disrupting main flow
  }
}