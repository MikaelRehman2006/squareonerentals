export interface User {
  id: string;
  name: string | null;
  image: string | null;
  email: string | null;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  images: string | string[];
  bedrooms: number;
  bathrooms: number;
  size: number;
  amenities: string | string[];
  buildingAmenities: string | string[];
  propertyType: string;
  leaseType: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  status: string;
  featured: boolean;
  landlordEmail: string;
  landlordPhone?: string;
  user: User;
}