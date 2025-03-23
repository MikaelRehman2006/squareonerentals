import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import { Listing } from '@/models/Listing';
import { User } from '@/models/User';
import mongoose from 'mongoose';
import Link from 'next/link';
import Image from 'next/image';

type Props = {
  params: { listingId: string };
};

interface ListingWithUser {
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
  userId: {
    _id: mongoose.Types.ObjectId;
    name: string;
    email: string;
  };
}

export async function generateMetadata({
  params,
}: {
  params: { listingId: string };
}): Promise<Metadata> {
  return {
    title: 'Listing Details - Square One Rentals',
    description: 'View detailed information about a rental listing',
  };
}

export default async function ListingDetailsPage({
  params,
}: Props) {
  try {
    console.log('Connecting to MongoDB...');
    await connectDB();
    
    console.log('Fetching listing with ID:', params.listingId);
    const listing = await Listing.findById(params.listingId)
      .populate('userId')
      .lean() as ListingWithUser | null;

    if (!listing) {
      console.log('Listing not found');
      return (
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Listing Not Found</h1>
            <p className="text-gray-600">The listing you are looking for could not be found.</p>
            <Link
              href="/listings"
              className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Back to Listings
            </Link>
          </div>
        </div>
      );
    }

    console.log('Listing found:', listing.title);
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="aspect-video relative rounded-lg overflow-hidden">
              <Image
                src={listing.images[0] || '/placeholder-image.jpg'}
                alt={listing.title}
                fill
                className="object-cover"
                sizes="100vw"
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{listing.title}</h1>
            <div className="flex items-center gap-4 mb-6">
              <span className="text-xl font-semibold text-gray-900">
                ${listing.price.toLocaleString()}/month
              </span>
              <span className="text-gray-600">• {listing.propertyType}</span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">Location</h3>
                <p className="text-gray-600">{listing.location}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">Bedrooms</h3>
                <p className="text-gray-600">{listing.bedrooms}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">Bathrooms</h3>
                <p className="text-gray-600">{listing.bathrooms}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">Amenities</h3>
                <ul className="text-gray-600 list-disc list-inside">
                  {listing.amenities.map((amenity: string) => (
                    <li key={amenity}>{amenity}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600">{listing.description}</p>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900 mb-1">Posted by</h4>
                  <p className="text-gray-600">{listing.userId.name}</p>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900 mb-1">Email</h4>
                  <a
                    href={`mailto:${listing.userId.email}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {listing.userId.email}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error in ListingDetailsPage:', error);
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Listing</h1>
          <p className="text-gray-600">An error occurred while loading the listing details.</p>
          <p className="text-red-600">Error: {error instanceof Error ? error.message : 'Unknown error'}</p>
          <Link
            href="/listings"
            className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Listings
          </Link>
        </div>
      </div>
    );
  }
}
