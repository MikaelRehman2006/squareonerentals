import mongoose from 'mongoose';

export interface INotification {
  userId: string;
  message: string;
  type: 'MESSAGE' | 'LISTING_UPDATE' | 'FAVORITE' | 'SYSTEM' | 'NEWSLETTER' | 'MARKETING' | 'PAYMENT' | 'WELCOME';
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
    enum: ['MESSAGE', 'LISTING_UPDATE', 'FAVORITE', 'SYSTEM', 'NEWSLETTER', 'MARKETING', 'PAYMENT', 'WELCOME']
  },
  read: { type: Boolean, default: false },
  listingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing' },
  relatedUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, {
  timestamps: true,
});

// Safer model initialization that handles cases when mongoose connection isn't ready
let NotificationModel: mongoose.Model<INotification>;

try {
  // Check if the model is already registered
  NotificationModel = mongoose.model<INotification>('Notification');
} catch (error) {
  // If not, create a new model
  NotificationModel = mongoose.model<INotification>('Notification', notificationSchema);
}

export const Notification = NotificationModel;
