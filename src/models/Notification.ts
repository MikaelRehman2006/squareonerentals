import mongoose from 'mongoose';

export interface INotification {
  userId: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new mongoose.Schema<INotification>({
  userId: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, required: true },
  read: { type: Boolean, default: false },
}, {
  timestamps: true,
});

export const Notification = mongoose.models.Notification || mongoose.model<INotification>('Notification', notificationSchema);
