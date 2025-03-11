'use client';

import { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { Listing } from '@/types/listing';
import { formatPrice } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
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
      // First try parsing as JSON
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      // If JSON parsing fails and it's a string, try comma splitting
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
        const response = await fetch(`${baseUrl}/api/listings/${params.id}`);
        
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

    if (params.id) {
      fetchListing();
    }
  }, [params.id]);

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
  const buildingAmenities = parseStringToArray(listing.buildingAmenities);
  
  // Get the first valid image URL or use default
  const imageUrl = images.length > 0 && images[0] && images[0].startsWith('http') 
    ? images[0] 
    : defaultImage;

  return (
    <main className="container max-w-6xl py-4 space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{listing.title}</h1>
          <p className="text-lg text-muted-foreground">{listing.location}</p>
        </div>
        <div className="flex items-center gap-2">
          {!isOwner && <FavoriteButton listingId={listing.id} />}
          <ReportButton targetId={listing.id} type="LISTING" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-8">
          <div className="aspect-[4/3] relative rounded-lg overflow-hidden">
            <Image
              src={imageUrl}
              alt={listing.title}
              fill
              className="object-cover"
              priority
              onError={(e: any) => {
                e.currentTarget.src = defaultImage;
              }}
            />
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Description</h2>
            <p className="text-muted-foreground whitespace-pre-line">
              {listing.description}
            </p>
          </div>
        </div>

        <div className="space-y-8">
          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">
                    ${listing.price.toLocaleString()}/month
                  </p>
                  <p className="text-muted-foreground">
                    {listing.propertyType} · {listing.leaseType}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-medium">{listing.bedrooms}</p>
                  <p className="text-muted-foreground">Bedrooms</p>
                </div>
                <div>
                  <p className="font-medium">{listing.bathrooms}</p>
                  <p className="text-muted-foreground">Bathrooms</p>
                </div>
                <div>
                  <p className="font-medium">{listing.size.toLocaleString()} sq ft</p>
                  <p className="text-muted-foreground">Size</p>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-2">Contact Information</h3>
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={listing.user.image || ''} />
                    <AvatarFallback>
                      {listing.user.name?.[0]?.toUpperCase() || '?'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{listing.user.name || 'Property Owner'}</p>
                    <p className="text-muted-foreground">{listing.user.email}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {amenities.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Amenities</h3>
              <div className="flex flex-wrap gap-2">
                {amenities.map((amenity, index) => (
                  <Badge key={`${amenity}-${index}`} variant="secondary">
                    {amenity.trim()}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {buildingAmenities.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Building Amenities</h3>
              <div className="flex flex-wrap gap-2">
                {buildingAmenities.map((amenity, index) => (
                  <Badge key={`${amenity}-${index}`} variant="secondary">
                    {amenity.trim()}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}