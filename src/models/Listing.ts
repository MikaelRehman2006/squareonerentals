import mongoose from 'mongoose';
import { IUser } from './User';

export interface IListing {
  _id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  price: number;
  location: string;
  images: string[];
  bedrooms: number;
  bathrooms: number;
  size: number;
  amenities: string[];
  buildingAmenities: string[];
  features: string[];
  utilities: string[];
  propertyType: string;
  leaseType: string;
  availableDate: Date;
  status: string;
  featured: boolean;
  userId: mongoose.Types.ObjectId | IUser;
  favoritedBy: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const listingSchema = new mongoose.Schema<IListing>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  location: { type: String, required: true },
  images: { type: [String], default: [] },
  bedrooms: { type: Number, required: true },
  bathrooms: { type: Number, required: true },
  size: { type: Number, required: true },
  amenities: { type: [String], default: [] },
  buildingAmenities: { type: [String], default: [] },
  features: { type: [String], default: [] },
  utilities: { type: [String], default: [] },
  propertyType: { type: String, required: true },
  leaseType: { type: String, required: true },
  availableDate: { type: Date, default: Date.now },
  status: { type: String, default: 'ACTIVE' },
  featured: { type: Boolean, default: false },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  favoritedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, {
  timestamps: true,
});

// Add indexes
listingSchema.index({ userId: 1 });
listingSchema.index({ status: 1 });

export const Listing = mongoose.models.Listing || mongoose.model<IListing>('Listing', listingSchema);
