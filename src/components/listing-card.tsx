import { Listing } from '@/types/listing';
import Image from 'next/image';
import Link from 'next/link';

interface ListingCardProps {
  listing: Listing;
}

export default function ListingCard({ listing }: ListingCardProps) {
  return (
    <Link
      href={`/listings/${listing.id}`}
      className="group relative bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200 overflow-hidden"
    >
      <div className="aspect-square relative">
        <Image
          src={listing.images[0] || '/placeholder-image.jpg'}
          alt={listing.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-black mb-2 group-hover:text-blue-600 transition-colors duration-200">
          {listing.title}
        </h3>
        <p className="text-gray-600 mb-2">${listing.price.toLocaleString()}/month</p>
        <p className="text-gray-500 text-sm mb-2">
          {listing.bedrooms} beds • {listing.bathrooms} baths
        </p>
        <p className="text-gray-500 text-sm">{listing.location}</p>
      </div>
    </Link>
  );
}
