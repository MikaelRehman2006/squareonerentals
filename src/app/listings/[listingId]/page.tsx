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
import { ContactLandlordCard } from '@/components/ContactLandlordCard';

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
                bedrooms={listing.bedrooms}
                bathrooms={listing.bathrooms}
                squareFeet={listing.squareFeet}
                price={listing.price}
                leaseType={listing.leaseType}
                availableDate={listing.availableDate}
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
                buildingAmenities={listing.buildingAmenities}
                features={listing.features}
                utilities={listing.utilities}
              />
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <ContactLandlordCard
                landlord={{
                  _id: listing.userId._id.toString(),
                  name: listing.userId.name,
                  email: listing.userId.email,
                  image: listing.userId.image || undefined
                }}
                listingId={listing._id.toString()}
                isOwner={isOwner}
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
