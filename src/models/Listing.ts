import mongoose, { Schema, model, Document } from 'mongoose';
import { IUser } from './User';

export interface IListing extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  price: number;
  location: string;
  address: string;
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
  parking?: string;
  status: string;
  featured: boolean;
  userId: mongoose.Types.ObjectId | IUser;
  favoritedBy: mongoose.Types.ObjectId[];
  phoneNumber?: string;
  facebookUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const listingSchema = new Schema<IListing>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  location: { type: String, required: true },
  address: { type: String, required: false },
  images: { type: [String], required: true, validate: [val => val.length > 0, 'At least one image is required'] },
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
  parking: { type: String, required: false },
  status: { type: String, required: true, default: 'ACTIVE' },
  featured: { type: Boolean, default: false },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  favoritedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  phoneNumber: { type: String },
  facebookUrl: { type: String },
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

// Safer model initialization that handles cases when mongoose connection isn't ready
let ListingModel: mongoose.Model<IListing>;

try {
  // Check if the model is already registered
  ListingModel = mongoose.model<IListing>('Listing');
} catch (error) {
  // If not, create a new model
  ListingModel = mongoose.model<IListing>('Listing', listingSchema);
}

export const Listing = ListingModel;
