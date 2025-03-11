'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Heart } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

interface FavoriteButtonProps {
  listingId: string;
  initialFavorited?: boolean;
  onFavoriteChange?: (isFavorited: boolean) => void;
  className?: string;
}

export default function FavoriteButton({ 
  listingId, 
  initialFavorited = false, 
  onFavoriteChange,
  className = '' 
}: FavoriteButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isFavorited, setIsFavorited] = useState(initialFavorited);
  const [isLoading, setIsLoading] = useState(false);

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent event bubbling to parent links/elements
    e.stopPropagation();

    if (!session) {
      router.push('/auth/signin');
      return;
    }

    if (isLoading) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/favorites/${listingId}`, {
        method: isFavorited ? 'DELETE' : 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to update favorite status');
      }

      const newFavoritedState = !isFavorited;
      setIsFavorited(newFavoritedState);
      onFavoriteChange?.(newFavoritedState);
      toast.success(isFavorited ? 'Removed from favorites' : 'Added to favorites');
    } catch (error) {
      console.error('Error updating favorite status:', error);
      toast.error('Failed to update favorite status');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className={`rounded-full ${className} ${
        isFavorited ? 'text-red-500 hover:text-red-600' : 'text-gray-600 hover:text-gray-700'
      }`}
      onClick={handleFavoriteClick}
      disabled={isLoading}
    >
      <Heart className={`h-5 w-5 ${isFavorited ? 'fill-current' : ''}`} />
      <span className="sr-only">{isFavorited ? 'Remove from favorites' : 'Add to favorites'}</span>
    </Button>
  );
}