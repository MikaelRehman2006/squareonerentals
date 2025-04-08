'use client';

import { Button } from './ui/button';
import { MessageCircle, User, Mail } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface ContactLandlordCardProps {
  landlord: {
    _id: string;
    name: string;
    email: string;
    image?: string;
  };
  listingId: string;
  isOwner: boolean;
}

export function ContactLandlordCard({
  landlord,
  listingId,
  isOwner
}: ContactLandlordCardProps) {
  if (isOwner) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow sticky top-4">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Listing Owner</h3>
        <div className="flex items-center gap-4 mb-4">
          {landlord.image ? (
            <Image
              src={landlord.image}
              alt={landlord.name}
              width={48}
              height={48}
              className="rounded-full"
            />
          ) : (
            <div className="h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-gray-500" />
            </div>
          )}
          <div>
            <p className="font-semibold text-gray-900">{landlord.name}</p>
            <p className="text-gray-500">{landlord.email}</p>
          </div>
        </div>
        <div className="text-sm text-gray-500">
          This is your listing. You can edit it from your dashboard.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow sticky top-4">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Contact Landlord</h3>
      <div className="flex items-center gap-4 mb-6">
        {landlord.image ? (
          <Image
            src={landlord.image}
            alt={landlord.name}
            width={48}
            height={48}
            className="rounded-full"
          />
        ) : (
          <div className="h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center">
            <User className="h-6 w-6 text-gray-500" />
          </div>
        )}
        <div>
          <p className="font-semibold text-gray-900">{landlord.name}</p>
          <p className="text-gray-500">Property Owner</p>
        </div>
      </div>
      <Link
        href={`/messages?listingId=${listingId}&otherUserId=${landlord._id}`}
        className="w-full"
      >
        <Button className="w-full gap-2">
          <MessageCircle className="h-5 w-5" />
          Send Message
        </Button>
      </Link>
    </div>
  );
}
