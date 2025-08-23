'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { ListingForm } from '@/components/listing-form';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function CreateListingPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  // Empty initial data for new listing
  const initialData = {
    title: '',
    description: '',
    price: 0,
    location: '',
    address: '',
    squareFeet: 0,
    images: [],
    bedrooms: 0,
    bathrooms: 0,
    amenities: [],
    buildingAmenities: [],
    propertyType: '',
    listingType: '',
    leaseType: '',
    availableDate: new Date().toISOString().split('T')[0],
    parking: 'None',
    featured: false,
    status: 'ACTIVE',
    features: {
      wifi: false,
      airConditioning: false,
      laundry: false,
      heating: false,
      furnished: false,
      smartHomeFeatures: false,
      walkInCloset: false,
    },
    utilities: {
      electricity: false,
      gas: false,
      water: false,
      internet: false,
      trashCollection: false,
    },
    phoneNumber: '',
    facebookUrl: '',
  };

  const handleSubmit = async (data: any) => {
    try {
      // Validate that at least one image is provided
      if (!data.images || data.images.length === 0) {
        toast.error('At least one image is required');
        return;
      }
      
      setIsSubmitting(true);
      
      // Format data for API
      const formData = new FormData();
      
      // Add all form fields to FormData
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'images') {
          // Images are handled separately
          return;
        }
        
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          // Handle nested objects like features and utilities
          formData.append(key, JSON.stringify(value));
        } else if (Array.isArray(value)) {
          // Handle arrays
          formData.append(key, JSON.stringify(value));
        } else {
          // Handle primitive values
          formData.append(key, String(value));
        }
      });
      
      // Add images if any
      if (Array.isArray(data.images)) {
        data.images.forEach((image: string) => {
          formData.append('images', image);
        });
      }

      // Submit to API
      const response = await fetch('/api/listings', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      
      if (!response.ok) {
        if (result.redirectUrl && result.redirectUrl === '/memberships') {
          toast.error('You need an active membership to create listings');
          router.push('/memberships');
          return;
        }
        throw new Error(result.error || 'Failed to create listing');
      }
      
      toast.success('Listing created successfully!');
      router.push(`/listings/${result.id}`);
    } catch (error) {
      console.error('Error creating listing:', error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to create listing');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="container mx-auto py-10">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-white via-gray-50 to-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-center">
          <Link href="/listings/manage" className="mr-4 p-2 rounded-full hover:bg-gray-200 transition-colors">
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Create New Listing</h1>
        </div>
        
        <Card className="border border-gray-200">
          <CardHeader className="pb-2">
            <CardTitle>Create Your Listing</CardTitle>
            <CardDescription>
              Enter the details of your property
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ListingForm
              initialData={initialData}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 