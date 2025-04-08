export interface User {
  id: string;
  name: string | null;
  image: string | null;
  email: string | null;
}

export interface Listing {
  _id: string;
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  address: string;
  images: string | string[];
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  amenities: string | string[];
  buildingAmenities: string | string[];
  features: string | string[];
  utilities: string | string[];
  propertyType: string;
  listingType: string;
  availableFrom: Date;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  status: string;
  featured: boolean;
  parking: string;
  userImage: string | null;
  userName: string | null;
  userEmail: string | null;
  user: User;
}