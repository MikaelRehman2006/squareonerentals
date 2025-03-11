import { prisma } from './prisma';

export type ActivityType = 
  | 'USER_CREATED'
  | 'USER_UPDATED'
  | 'LISTING_CREATED'
  | 'LISTING_UPDATED'
  | 'LISTING_DELETED'
  | 'REPORT_CREATED'
  | 'REPORT_RESOLVED';

interface ActivityMetadata {
  userId?: string;
  listingId?: string;
  reportId?: string;
  [key: string]: any;
}

export async function logActivity(
  type: ActivityType,
  description: string,
  metadata?: ActivityMetadata
) {
  try {
    await prisma.activity.create({
      data: {
        type,
        description,
        metadata: metadata ? JSON.stringify(metadata) : null,
      },
    });
  } catch (error) {
    console.error('Error logging activity:', error);
    // Don't throw the error to prevent disrupting the main flow
  }
} 