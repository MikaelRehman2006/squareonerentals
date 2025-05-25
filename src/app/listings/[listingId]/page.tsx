import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import { Listing, IListing } from '@/models/Listing';
import { User, IUser } from '@/models/User';
import mongoose from 'mongoose';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { ListingImageCarousel } from '@/components/ListingImageCarousel';
import { ListingInfoCard } from '@/components/ListingInfoCard';
import { AmenitiesSection } from '@/components/AmenitiesSection';
import { ListingContactCard } from '@/components/ListingContactCard';

// Helper function to convert building amenities to array
function convertBuildingAmenitiesToArray(amenities: any): string[] {
  if (!amenities) return [];
  
  // If already an array, format each item properly
  if (Array.isArray(amenities)) {
    return amenities.map(amenity => {
      if (typeof amenity === 'string') {
        // If it's already a string, ensure proper formatting
        return amenity.charAt(0).toUpperCase() + amenity.slice(1);
      }
      return String(amenity);
    });
  }
  
  // If amenities is an object with boolean values, extract keys where value is true
  if (typeof amenities === 'object') {
    return Object.entries(amenities)
      .filter(([_, value]) => value === true)
      .map(([key, _]) => {
        // Convert camelCase to readable format (e.g., 'swimmingPool' to 'Swimming Pool')
        return key.replace(/([A-Z])/g, ' $1')
          .replace(/^./, str => str.toUpperCase());
      });
  }
  
  // If it's a string, try to parse it as JSON
  if (typeof amenities === 'string') {
    try {
      const parsed = JSON.parse(amenities);
      return convertBuildingAmenitiesToArray(parsed); // Recursively process the parsed result
    } catch (e) {
      // If parsing fails, it might be a comma-separated string
      return amenities.split(',').map(item => item.trim());
    }
  }
  
  return [];
}

// Helper function to convert features object to array
function convertFeaturesToArray(features: any): string[] {
  if (!features) return [];
  if (Array.isArray(features)) {
    return features.map(feature =>
      typeof feature === 'string' ? feature.charAt(0).toUpperCase() + feature.slice(1) : String(feature)
    );
  }
  if (typeof features === 'string') {
    try {
      const parsed = JSON.parse(features);
      return convertFeaturesToArray(parsed);
    } catch (e) {
      return features.split(',').map(item => item.trim());
    }
  }
  return [];
}

// Helper function to convert utilities object to array
function convertUtilitiesToArray(utilities: any): string[] {
  if (!utilities) return [];
  if (Array.isArray(utilities)) {
    return utilities.map(utility =>
      typeof utility === 'string' ? utility.charAt(0).toUpperCase() + utility.slice(1) : String(utility)
    );
  }
  if (typeof utilities === 'string') {
    try {
      const parsed = JSON.parse(utilities);
      return convertUtilitiesToArray(parsed);
    } catch (e) {
      return utilities.split(',').map(item => item.trim());
    }
  }
  return [];
}

type Props = {
  params: { listingId: string };
};

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
  await connectDB();
  const session = await getServerSession(authOptions) as any;

  // Validate listingId
  if (!mongoose.Types.ObjectId.isValid(params.listingId)) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Invalid Listing ID</h1>
          <p className="mb-4">The listing ID provided is not valid.</p>
          <Link href="/listings" className="text-blue-500 hover:underline">
            Browse other listings
          </Link>
        </div>
      </div>
    );
  }

  try {
    const listing = await Listing.findById(params.listingId)
      .populate<{ userId: IUser }>('userId', 'name email image')
      .lean() as IListing & { userId: IUser };

    if (!listing) {
      return (
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Listing Not Found</h1>
            <p className="mb-4">The listing you're looking for doesn't exist or has been removed.</p>
            <Link href="/listings" className="text-blue-500 hover:underline">
              Browse other listings
            </Link>
          </div>
        </div>
      );
    }

    // If listing is not active and user is not the owner, show unauthorized
    if (listing.status !== 'ACTIVE' && (!session?.user?.id || session.user.id !== listing.userId._id.toString())) {
      return (
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Unauthorized</h1>
            <p className="mb-4">You don't have permission to view this listing.</p>
            <Link href="/listings" className="text-blue-500 hover:underline">
              Browse other listings
            </Link>
          </div>
        </div>
      );
    }

    const isOwner = session?.user?.id === listing.userId._id.toString();

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Image Carousel */}
              <ListingImageCarousel images={listing.images} />

              {/* Title & Price */}
              <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {listing.title}
                </h1>
                <p className="text-2xl text-blue-600 font-semibold">
                  ${listing.price.toLocaleString()} / month
                </p>
              </div>

              {/* Property Info */}
              <ListingInfoCard
                propertyType={listing.propertyType}
                location={listing.location}
                address={listing.address}
                bedrooms={listing.bedrooms}
                bathrooms={listing.bathrooms}
                squareFeet={listing.squareFeet}
                price={listing.price}
                leaseType={listing.leaseType}
                availableDate={listing.availableDate}
                parking={listing.parking}
                listingType={listing.listingType}
                featured={listing.featured}
              />

              {/* Description */}
              <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Description
                </h2>
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {listing.description}
                </p>
              </div>

              {/* Amenities, Features, & Utilities */}
              <AmenitiesSection
                buildingAmenities={convertBuildingAmenitiesToArray(listing.buildingAmenities)}
                features={convertFeaturesToArray(listing.features)}
                utilities={convertUtilitiesToArray(listing.utilities)}
              />
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <ListingContactCard
                landlord={{
                  name: listing.userId.name,
                  email: listing.userId.email,
                }}
                phoneNumber={listing.phoneNumber}
                facebookUrl={listing.facebookUrl}
              />
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error(error);
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error</h1>
          <p className="mb-4">An error occurred while loading the listing.</p>
          <Link href="/listings" className="text-blue-500 hover:underline">
            Browse other listings
          </Link>
        </div>
      </div>
    );
  }
}
