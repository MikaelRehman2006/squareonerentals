import mongoose, { Document, Schema } from 'mongoose';

export interface IContact extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'NEW' | 'READ' | 'REPLIED' | 'ARCHIVED';
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
  updatedAt: Date;
  readAt?: Date;
  repliedAt?: Date;
  adminNotes?: string;
}

const contactSchema = new Schema<IContact>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['NEW', 'READ', 'REPLIED', 'ARCHIVED'], 
    default: 'NEW' 
  },
  ipAddress: { type: String },
  userAgent: { type: String },
  adminNotes: { type: String },
  readAt: { type: Date },
  repliedAt: { type: Date }
}, {
  timestamps: true,
});

// Create indexes for better query performance
contactSchema.index({ status: 1, createdAt: -1 });
contactSchema.index({ email: 1 });
contactSchema.index({ createdAt: -1 });

// Safer model initialization that handles cases when mongoose connection isn't ready
let ContactModel: mongoose.Model<IContact>;

try {
  // Check if the model is already registered
  ContactModel = mongoose.model<IContact>('Contact');
} catch (error) {
  // If not, create a new model
  ContactModel = mongoose.model<IContact>('Contact', contactSchema);
}

export const Contact = ContactModel;
