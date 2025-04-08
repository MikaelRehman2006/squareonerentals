import mongoose from 'mongoose';

export interface INotification {
  userId: string;
  message: string;
  type: 'MESSAGE' | 'LISTING_UPDATE' | 'FAVORITE' | 'SYSTEM';
  read: boolean;
  listingId?: string;
  relatedUserId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new mongoose.Schema<INotification>({
  userId: { type: String, required: true },
  message: { type: String, required: true },
  type: { 
    type: String, 
    required: true,
    enum: ['MESSAGE', 'LISTING_UPDATE', 'FAVORITE', 'SYSTEM']
  },
  read: { type: Boolean, default: false },
  listingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing' },
  relatedUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, {
  timestamps: true,
});

export const Notification = mongoose.models.Notification || mongoose.model<INotification>('Notification', notificationSchema);
