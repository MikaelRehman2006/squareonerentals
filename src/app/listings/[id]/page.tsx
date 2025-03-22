'use client';

import { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { Listing } from '@/types/listing';
import { formatPrice } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import FavoriteButton from '@/components/FavoriteButton';
import ReportButton from '@/components/ReportButton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';

interface PageProps {
  params: {
    id: string;
  };
}

export default function ListingPage({ params }: PageProps) {
  const { id } = params;
  const { data: session } = useSession();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);

  // Default image if none is provided or if the first image is invalid
  const defaultImage = 'https://placehold.co/800x600/e2e8f0/1e293b?text=No+Image+Available';

  // Safely parse string fields that should be arrays
  const parseStringToArray = (value: string | string[] | null | undefined): string[] => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      return typeof value === 'string' 
        ? value.split(',').filter(Boolean).map(item => item.trim())
        : [];
    }
  };

  useEffect(() => {
    async function fetchListing() {
      try {
        setLoading(true);
        const baseUrl = window.location.origin;
        const response = await fetch(`${baseUrl}/api/listings/${id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            notFound();
          }
          throw new Error('Failed to fetch listing');
        }

        const data = await response.json();
        setListing(data);
      } catch (error) {
        console.error('Error fetching listing:', error);
        toast.error('Failed to load listing. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchListing();
    }
  }, [id]);

  if (loading) {
    return (
      <main className="container max-w-6xl py-4">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-pulse">Loading listing details...</div>
        </div>
      </main>
    );
  }

  if (!listing) {
    return notFound();
  }

  const isOwner = session?.user?.id === listing.userId;
  const images = parseStringToArray(listing.images);
  const amenities = parseStringToArray(listing.amenities);
  const features = parseStringToArray(listing.features);
  const utilities = parseStringToArray(listing.utilities);
  
  const imageUrl = images.length > 0 && images[0] && images[0].startsWith('http') 
    ? images[0] 
    : defaultImage;

  return (
    <main className="container max-w-6xl py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column - Images and Basic Info */}
        <div className="space-y-6">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg">
            <Image
              src={imageUrl}
              alt={listing.title}
              fill
              className="object-cover"
              priority
            />
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Property Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">{listing.title}</h1>
                <div className="flex gap-2">
                  <FavoriteButton listingId={listing.id} />
                  {!isOwner && <ReportButton type="LISTING" targetId={listing.id} />}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{listing.propertyType}</Badge>
                <Badge variant="outline">{listing.listingType}</Badge>
                <Badge className="bg-green-500">{formatPrice(listing.price)}/month</Badge>
              </div>
              <p className="text-muted-foreground">{listing.description}</p>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Detailed Information */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Location & Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold">Address</p>
                  <p className="text-muted-foreground">{listing.address}</p>
                </div>
                <div>
                  <p className="font-semibold">Available From</p>
                  <p className="text-muted-foreground">
                    {new Date(listing.availableFrom).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src={listing.userImage || ''} />
                  <AvatarFallback>
                    {listing.userName?.charAt(0)?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{listing.userName || 'Anonymous'}</p>
                  <p className="text-sm text-muted-foreground">{listing.userEmail || 'No email provided'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Property Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Property Details */}
              <div>
                <h3 className="font-semibold mb-3">Basic Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-semibold text-gray-600">Bedrooms</p>
                    <p>{listing.bedrooms}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-600">Bathrooms</p>
                    <p>{listing.bathrooms}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-600">Square Feet</p>
                    <p>{listing.squareFeet}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-600">Parking</p>
                    <p>{listing.parking}</p>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              {/* Building Amenities */}
              <div>
                <h3 className="font-semibold mb-2">Building Amenities</h3>
                <p className="text-sm text-gray-600 mb-3">What the property/building offers</p>
                <div className="flex flex-wrap gap-2">
                  {amenities.map((amenity, index) => (
                    <Badge key={index} variant="outline" className="bg-gray-50">{amenity}</Badge>
                  ))}
                  {amenities.length === 0 && (
                    <p className="text-sm text-gray-500">No building amenities specified</p>
                  )}
                </div>
              </div>

              {/* Unit Features */}
              <div>
                <h3 className="font-semibold mb-2">Unit Features</h3>
                <p className="text-sm text-gray-600 mb-3">What's inside the unit</p>
                <div className="flex flex-wrap gap-2">
                  {features.map((feature, index) => (
                    <Badge key={index} variant="outline" className="bg-blue-50">{feature}</Badge>
                  ))}
                  {features.length === 0 && (
                    <p className="text-sm text-gray-500">No unit features specified</p>
                  )}
                </div>
              </div>

              {/* Utilities Included */}
              <div>
                <h3 className="font-semibold mb-2">Utilities Included</h3>
                <p className="text-sm text-gray-600 mb-3">What's covered in the rent</p>
                <div className="flex flex-wrap gap-2">
                  {utilities.map((utility, index) => (
                    <Badge key={index} variant="outline" className="bg-green-50">{utility}</Badge>
                  ))}
                  {utilities.length === 0 && (
                    <p className="text-sm text-gray-500">No utilities included in rent</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}