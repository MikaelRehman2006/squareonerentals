'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Heart } from 'lucide-react';
import { toast } from 'sonner';

interface FavoriteButtonProps {
  listingId: string;
  isFavorited?: boolean;
  className?: string;
}

const FavoriteButton = ({ listingId, isFavorited = false, className = '' }: FavoriteButtonProps) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [favorited, setFavorited] = useState(isFavorited);

  const toggleFavorite = async () => {
    if (!session?.user) {
      router.push('/auth/signin');
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`/api/favorites/${listingId}`, {
        method: favorited ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to toggle favorite');
      }

      setFavorited(!favorited);
      toast.success(favorited ? 'Removed from favorites' : 'Added to favorites');
      router.refresh();
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={toggleFavorite}
      disabled={isLoading}
      className={`
        ${className}
        p-2 rounded-full 
        hover:opacity-80 
        transition
        ${favorited ? 'text-rose-500' : 'text-neutral-500'}
      `}
    >
      <Heart
        className={`
          h-6 
          w-6 
          ${favorited ? 'fill-rose-500' : 'fill-none'}
        `}
      />
    </button>
  );
};

export default FavoriteButton;