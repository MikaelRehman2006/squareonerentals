import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  emailVerified?: Date;
  image?: string;
  password?: string;
  role: 'USER' | 'ADMIN';
  favorites: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
  preferences?: {
    userTypes: string[];
    city: string;
    completedOnboarding: boolean;
  };
  membership?: {
    type: 'BASIC' | 'FEATURED' | null;
    isAnnual: boolean;
    startDate: Date;
    endDate: Date;
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
    status: 'active' | 'canceled' | 'past_due' | 'inactive';
  };
}

const userSchema: Schema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  emailVerified: { type: Date },
  image: { type: String },
  password: { type: String },
  role: { type: String, enum: ['USER', 'ADMIN'], default: 'USER' },
  favorites: [{ type: Schema.Types.ObjectId, ref: 'Listing' }],
  preferences: {
    type: Schema.Types.Mixed,
    default: {}
  },
  membership: {
    type: { type: String, enum: ['BASIC', 'FEATURED', null], default: null },
    isAnnual: { type: Boolean, default: false },
    startDate: { type: Date },
    endDate: { type: Date },
    stripeCustomerId: { type: String },
    stripeSubscriptionId: { type: String },
    status: { type: String, enum: ['active', 'canceled', 'past_due', 'inactive'], default: 'inactive' }
  }
}, {
  timestamps: true,
});

// Safer model initialization that handles cases when mongoose connection isn't ready
let UserModel: mongoose.Model<IUser>;

try {
  // Check if the model is already registered
  UserModel = mongoose.model<IUser>('User');
} catch (error) {
  // If not, create a new model
  UserModel = mongoose.model<IUser>('User', userSchema);
}

export const User = UserModel;
