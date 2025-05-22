import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMembership extends Document {
  userId: string;
  type: 'BASIC' | 'FEATURED';
  isAnnual: boolean;
  stripeSubscriptionId: string;
  status: 'ACTIVE' | 'CANCELED' | 'EXPIRED';
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const MembershipSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    type: { type: String, enum: ['BASIC', 'FEATURED'], required: true },
    isAnnual: { type: Boolean, default: false },
    stripeSubscriptionId: { type: String, required: true },
    status: { type: String, enum: ['ACTIVE', 'CANCELED', 'EXPIRED'], default: 'ACTIVE' },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Create indexes for better query performance
MembershipSchema.index({ userId: 1 });
MembershipSchema.index({ status: 1 });
MembershipSchema.index({ endDate: 1 });

// Check if the model is already defined to prevent recompilation error
let Membership: Model<IMembership>;

try {
  // If model exists, use that
  Membership = mongoose.model<IMembership>('Membership');
} catch {
  // If model doesn't exist, create it
  Membership = mongoose.model<IMembership>('Membership', MembershipSchema);
}

export { Membership };
