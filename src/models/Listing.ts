import mongoose, { Schema, model, Document } from 'mongoose';
import { IUser } from './User';

export interface IListing extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  price: number;
  location: string;
  images: string[];
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  amenities: string[];
  buildingAmenities: string[];
  features: string[];
  utilities: string[];
  propertyType: string;
  listingType: string;
  leaseType: string;
  availableDate: Date;
  status: string;
  featured: boolean;
  userId: mongoose.Types.ObjectId | IUser;
  favoritedBy: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const listingSchema = new Schema<IListing>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  location: { type: String, required: true },
  images: { type: [String], default: [] },
  bedrooms: { type: Number, required: true },
  bathrooms: { type: Number, required: true },
  squareFeet: { type: Number, required: true },
  amenities: { type: [String], default: [] },
  buildingAmenities: { type: [String], default: [] },
  features: { type: [String], default: [] },
  utilities: { type: [String], default: [] },
  propertyType: { type: String, required: true },
  listingType: { type: String, required: true },
  leaseType: { type: String, required: true, default: 'FIXED' },
  availableDate: { type: Date, required: true },
  status: { type: String, required: true, default: 'ACTIVE' },
  featured: { type: Boolean, default: false },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  favoritedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
}, {
  timestamps: true, // This adds createdAt and updatedAt fields
  toJSON: {
    virtuals: true,
    transform: function(doc, ret) {
      ret.id = ret._id.toString();
      delete ret.__v;
      return ret;
    }
  },
  toObject: {
    virtuals: true
  }
});

// Create indexes for better query performance
listingSchema.index({ location: 'text', title: 'text', description: 'text' });
listingSchema.index({ status: 1, featured: -1, createdAt: -1 });
listingSchema.index({ userId: 1 });
listingSchema.index({ price: 1 });
listingSchema.index({ bedrooms: 1 });
listingSchema.index({ propertyType: 1 });

export const Listing = mongoose.models.Listing || model<IListing>('Listing', listingSchema);
