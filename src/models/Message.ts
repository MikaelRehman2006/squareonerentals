import mongoose from 'mongoose';

export interface IMessage {
  senderId: mongoose.Types.ObjectId;
  receiverId: mongoose.Types.ObjectId;
  listingId: mongoose.Types.ObjectId;
  message: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new mongoose.Schema<IMessage>({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  listingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
}, {
  timestamps: true,
});

// Create compound index for efficient querying of conversations
messageSchema.index({ senderId: 1, receiverId: 1, listingId: 1 });

export const Message = mongoose.models.Message || mongoose.model<IMessage>('Message', messageSchema);
