'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ImageIcon } from 'lucide-react';
import { Button } from './ui/button';

interface ListingImageCarouselProps {
  images: string[];
}

export function ListingImageCarousel({ images }: ListingImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [imageError, setImageError] = useState(false);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right

  useEffect(() => {
    // Process and validate image URLs
    if (images && images.length > 0) {
      console.log('Listing images received:', images);
      
      // Filter out any invalid URLs
      const validImages = images.filter(img => {
        if (!img) {
          console.log('Filtering out empty image URL');
          return false;
        }
        
        // Ensure URLs are properly formatted
        if (img.startsWith('/uploads/')) {
          console.log('Found local image path:', img);
          return true;
        }
        if (img.startsWith('http')) {
          console.log('Found remote image URL:', img);
          return true;
        }
        
        console.log('Invalid image URL format:', img);
        return false;
      });
      
      setImageUrls(validImages);
      console.log('Final valid image URLs:', validImages);
    } else {
      console.log('No images provided to carousel:', images);
    }
  }, [images]);

  if (!imageUrls || imageUrls.length === 0) {
    return (
      <div className="relative h-[500px] bg-gray-100 rounded-lg overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 opacity-50 flex justify-center">
              <ImageIcon size={100} className="text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">No images available</p>
          </div>
        </div>
      </div>
    );
  }

  const nextSlide = () => {
    setDirection(1); // Moving right
    setCurrentIndex((prevIndex) => 
      prevIndex === imageUrls.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setDirection(-1); // Moving left
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? imageUrls.length - 1 : prevIndex - 1
    );
  };

  const handleImageError = () => {
    console.error(`Failed to load image: ${imageUrls[currentIndex]}`);
    setImageError(true);
  };

  return (
    <div className="relative h-[500px] rounded-lg overflow-hidden group">
      <div className="absolute inset-0 overflow-hidden">
        {imageError ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <ImageIcon size={64} className="mx-auto mb-2 text-gray-400" />
              <p className="text-gray-500">Image could not be loaded</p>
            </div>
          </div>
        ) : (
          <div className="w-full h-full relative">
            {imageUrls.map((url, index) => (
              <div 
                key={index}
                className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
                  index === currentIndex 
                    ? 'translate-x-0 z-10' 
                    : index < currentIndex || (currentIndex === 0 && index === imageUrls.length - 1)
                      ? (direction === 1 ? '-translate-x-full' : 'translate-x-full') 
                      : (direction === 1 ? 'translate-x-full' : '-translate-x-full')
                }`}
              >
                <Image
                  src={url}
                  alt={`Property image ${index + 1}`}
                  fill
                  className="object-cover"
                  priority={index === currentIndex}
                  unoptimized={true}
                  onError={() => {
                    if (index === currentIndex) {
                      console.error(`Failed to load image: ${url}`);
                      setImageError(true);
                    }
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      {imageUrls.length > 1 && (
        <div className="absolute inset-0 flex items-center justify-between p-4 opacity-100 transition-opacity z-10">
          <Button
            variant="secondary"
            size="icon"
            className="rounded-full bg-black/60 hover:bg-black/80 text-white border-white border shadow-md h-12 w-12 flex items-center justify-center"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="rounded-full bg-black/60 hover:bg-black/80 text-white border-white border shadow-md h-12 w-12 flex items-center justify-center"
            onClick={nextSlide}
          >
            <ChevronRight className="h-8 w-8" />
          </Button>
        </div>
      )}

      {/* Image Counter */}
      {imageUrls.length > 1 && (
        <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm opacity-100 z-10">
          {currentIndex + 1} / {imageUrls.length}
        </div>
      )}
    </div>
  );
}
