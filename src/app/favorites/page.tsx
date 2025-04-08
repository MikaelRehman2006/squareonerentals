'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { toast } from 'sonner';
import { FavoriteCard } from '@/components/FavoriteCard';

interface Listing {
  id: string;
  title: string;
  price: number;
  location: string;
  image: string;
  bedrooms?: number;
  bathrooms?: number;
  squareFeet?: number;
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
    <motion.div 
      className="min-h-screen bg-gray-50/50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container max-w-7xl mx-auto px-4 py-12">
        <motion.div 
          className="flex justify-between items-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">My Favorites</h1>
            <p className="mt-2 text-lg text-gray-600">Your saved properties</p>
          </div>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse">
                <div className="aspect-[4/3] bg-gray-200" />
                <div className="p-5 space-y-4">
                  <div className="h-6 bg-gray-200 rounded-full w-3/4" />
                  <div className="h-4 bg-gray-200 rounded-full w-1/2" />
                  <div className="h-6 bg-gray-200 rounded-full w-1/3" />
                  <div className="flex gap-4">
                    <div className="h-4 bg-gray-200 rounded-full w-16" />
                    <div className="h-4 bg-gray-200 rounded-full w-16" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : favorites.length === 0 ? (
          <motion.div 
            className="text-center py-16"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white p-8 rounded-2xl shadow-sm max-w-lg mx-auto">
              <div className="relative w-24 h-24 mx-auto mb-6">
                <Heart className="w-full h-full text-gray-200" strokeWidth={1.5} />
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ 
                    repeat: Infinity,
                    repeatType: "reverse",
                    duration: 2
                  }}
                >
                  <Heart className="w-16 h-16 text-gray-300" strokeWidth={1.5} />
                </motion.div>
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-gray-900">No favorites yet</h3>
              <p className="text-gray-600 mb-8 max-w-sm mx-auto">
                Start exploring and save properties you love to see them here.
              </p>
              <Button asChild size="lg" className="font-medium">
                <Link href="/listings">Browse Listings</Link>
              </Button>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((listing, index) => (
              <FavoriteCard
                key={listing.id}
                listing={listing}
                onRemove={handleRemoveFavorite}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}