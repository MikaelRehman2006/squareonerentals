import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import { Listing } from '@/models/Listing';
import { User } from '@/models/User';
import mongoose from 'mongoose';
import ListingForm from '@/components/listing-form';

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
        <h1 className="text-3xl font-bold mb-8">Edit Listing</h1>
        <ListingForm
          initialData={listing}
          onSubmit={async (data) => {
            try {
              await connectDB();
              await Listing.findByIdAndUpdate(
                params.listingId,
                { $set: data },
                { new: true }
              );
              // Redirect to listings page after successful update
              window.location.href = '/dashboard/listings';
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
