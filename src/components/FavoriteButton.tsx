'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Heart } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent event bubbling
    e.stopPropagation();

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
        const error = await response.json();
        throw new Error(error.error || 'Failed to toggle favorite');
      }

      const data = await response.json();
      setFavorited(data.isFavorited);
      toast.success(data.message);
      router.refresh();
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error(error instanceof Error ? error.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={toggleFavorite}
            disabled={isLoading}
            variant="ghost"
            size="icon"
            className={`
              ${className}
              rounded-full
              hover:bg-gray-100
              transition-all
              ${favorited ? 'text-rose-500' : 'text-gray-500'}
              ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <Heart
              className={`
                h-5
                w-5
                transition-all
                ${favorited ? 'fill-rose-500' : 'fill-none'}
                ${isLoading ? 'animate-pulse' : ''}
              `}
            />
            <span className="sr-only">{favorited ? 'Remove from favorites' : 'Add to favorites'}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{favorited ? 'Remove from favorites' : 'Add to favorites'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default FavoriteButton;