import mongoose from 'mongoose';

export interface IUser {
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
}

const userSchema = new mongoose.Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  emailVerified: { type: Date },
  image: { type: String },
  password: { type: String },
  role: { type: String, enum: ['USER', 'ADMIN'], default: 'USER' },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Listing' }],
}, {
  timestamps: true,
});

export const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);
