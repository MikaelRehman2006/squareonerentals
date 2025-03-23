'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import ListingForm from '@/components/listing-form';

interface Listing {
  id: string;
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
  availableDate: string;
  status: string;
}

export default function EditListingPage({
  params,
}: {
  params: { listingId: string };
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const [listing, setListing] = useState<Listing | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    const fetchListing = async () => {
      try {
        const response = await fetch(`/api/listings/${params.listingId}`, {
          credentials: 'include'
        });
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Listing not found');
          } else {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch listing');
          }
        }
        const data: Listing = await response.json();
        setListing(data);
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error fetching listing:', error);
          setError(error.message);
        } else {
          console.error('Error fetching listing:', error);
          setError('Failed to fetch listing');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchListing();
  }, [session, router, params.listingId]);

  const handleSubmit = async (data: Listing) => {
    try {
      const response = await fetch(`/api/listings/${params.listingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Listing not found');
        } else {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to update listing');
        }
      }

      toast.success('Listing updated successfully');
      router.push('/dashboard');
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error updating listing:', error);
        toast.error(error.message);
      } else {
        console.error('Error updating listing:', error);
        toast.error('Failed to update listing');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">Loading listing...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!listing) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Listing</h1>
      <ListingForm
        initialData={listing}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
