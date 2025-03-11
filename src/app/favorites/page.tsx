'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { toast } from 'sonner';

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
}

export default function FavoritesPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [favorites, setFavorites] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    const fetchFavorites = async () => {
      try {
        const response = await fetch(`/api/favorites`);
        if (!response.ok) {
          throw new Error('Failed to fetch favorites');
        }
        const data = await response.json();
        setFavorites(data);
      } catch (error) {
        console.error('Error fetching favorites:', error);
        toast.error('Failed to load favorites');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, [session, router]);

  const handleRemoveFavorite = async (listingId: string) => {
    try {
      const response = await fetch(`/api/favorites/${listingId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to remove from favorites');
      }

      setFavorites(favorites.filter(favorite => favorite.id !== listingId));
      toast.success('Removed from favorites');
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast.error('Failed to remove from favorites');
    }
  };

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Favorites</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Your saved properties</p>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-8">Loading...</div>
        ) : favorites.length === 0 ? (
          <Card className="text-center py-8 shadow-md">
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                You haven't saved any properties yet.
              </p>
              <Button
                onClick={() => router.push('/listings')}
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
              >
                Browse Listings
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((listing) => (
              <Card key={listing.id} className="shadow-md">
                <div className="aspect-video relative overflow-hidden rounded-t-lg">
                  <Image
                    src={listing.images[0] || '/placeholder.png'}
                    alt={listing.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-xl text-gray-900 dark:text-gray-100">
                    {listing.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    {listing.location}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      ${listing.price.toLocaleString()}/month
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                      <span>{listing.bedrooms} beds</span>
                      <span>•</span>
                      <span>{listing.bathrooms} baths</span>
                      <span>•</span>
                      <span>{listing.size} sqft</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => router.push(`/listings/${listing.id}`)}
                    className="shadow-sm"
                  >
                    View Details
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleRemoveFavorite(listing.id)}
                    className="shadow-sm"
                  >
                    Remove
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 