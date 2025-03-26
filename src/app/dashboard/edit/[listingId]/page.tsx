import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import { Listing } from '@/models/Listing';
import { User } from '@/models/User';
import mongoose from 'mongoose';
import { ListingForm } from '@/components/listing-form';

export async function generateMetadata({
  params,
}: {
  params: { listingId: string };
}): Promise<Metadata> {
  return {
    title: 'Edit Listing - Square One Rentals',
    description: 'Edit your rental listing',
  };
}

// Define interface for form data
interface ListingFormData {
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
  availableDate: string;
  status: string;
}

export default async function EditListingPage({
  params,
}: {
  params: { listingId: string };
}) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return <div>Unauthorized</div>;
    }

    const listing = await Listing.findById(params.listingId).populate('userId');

    if (!listing) {
      return <div>Listing not found</div>;
    }

    // Ensure user owns this listing
    if (listing.userId.toString() !== session.user.id) {
      return <div>Unauthorized</div>;
    }

    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-black">Edit Listing</h1>
        <ListingForm
          initialData={{
            title: listing.title,
            description: listing.description,
            price: listing.price,
            location: listing.location,
            images: listing.images || [],
            bedrooms: listing.bedrooms,
            bathrooms: listing.bathrooms,
            squareFeet: listing.squareFeet,
            amenities: listing.amenities || [],
            buildingAmenities: listing.buildingAmenities || [],
            features: listing.features || [],
            utilities: listing.utilities || [],
            propertyType: listing.propertyType,
            listingType: listing.listingType,
            leaseType: listing.leaseType || 'fixed',
            availableDate: new Date(listing.availableDate).toISOString().split('T')[0],
            status: listing.status,
          }}
          onSubmit={async (data: ListingFormData) => {
            try {
              // Send data to API endpoint instead of direct DB update
              const response = await fetch(`/api/listings/${params.listingId}`, {
                method: 'PATCH',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
              });
              
              if (!response.ok) {
                throw new Error('Failed to update listing');
              }
              
              // Redirect to dashboard after successful update
              window.location.href = '/dashboard';
            } catch (error) {
              console.error('Error updating listing:', error);
              alert('Failed to update listing. Please try again.');
            }
          }}
        />
      </div>
    );
  } catch (error) {
    console.error('Error in EditListingPage:', error);
    return <div>Error loading listing</div>;
  }
}
