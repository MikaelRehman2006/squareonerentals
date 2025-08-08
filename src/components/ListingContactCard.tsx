'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Phone, Mail, Facebook, User } from 'lucide-react';

interface ListingContactCardProps {
  landlord: {
    name: string;
    email: string;
  };
  phoneNumber?: string;
  facebookUrl?: string;
}

export function ListingContactCard({
  landlord,
  phoneNumber,
  facebookUrl,
}: ListingContactCardProps) {
  const hasPhoneNumber = phoneNumber?.trim() !== '';
  const hasFacebookUrl = facebookUrl?.trim() !== '';

  return (
    <Card className="sticky top-4 bg-white border border-gray-200 rounded-2xl shadow-lg transition-shadow hover:shadow-xl">
      <CardContent className="p-6 sm:p-7">
        <h3 className="text-2xl font-bold text-gray-900 uppercase mb-6 tracking-wide">
          Contact Information
        </h3>

        {/* Landlord Info */}
        <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200 mb-6">
          <div className="bg-gray-200 p-2 rounded-full">
            <User className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">{landlord.name}</p>
            <p className="text-sm text-gray-500">Property Owner</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Email */}
          <a
            href={`mailto:${landlord.email}`}
            className="flex items-center gap-3 bg-gray-100 hover:bg-gray-200 px-4 py-3 rounded-xl border border-gray-200 transition"
          >
            <div className="bg-white p-2 rounded-md">
              <Mail className="h-5 w-5 text-blue-600" />
            </div>
            <span className="text-gray-900 font-medium">{landlord.email}</span>
          </a>

          {/* Phone Number */}
          {hasPhoneNumber ? (
            <a
              href={`tel:${phoneNumber}`}
              className="flex items-center gap-3 bg-gray-100 hover:bg-gray-200 px-4 py-3 rounded-xl border border-gray-200 transition"
            >
              <div className="bg-white p-2 rounded-md">
                <Phone className="h-5 w-5 text-blue-600" />
              </div>
              <span className="text-gray-900 font-medium">{phoneNumber}</span>
            </a>
          ) : (
            <div className="flex items-center gap-3 bg-gray-100 px-4 py-3 rounded-xl border border-gray-200 text-gray-400">
              <div className="bg-white p-2 rounded-md">
                <Phone className="h-5 w-5 text-gray-400" />
              </div>
              <span>Didn't state</span>
            </div>
          )}

          {/* Facebook */}
          {hasFacebookUrl ? (
            <a
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-gray-100 hover:bg-gray-200 px-4 py-3 rounded-xl border border-gray-200 transition"
            >
              <div className="bg-white p-2 rounded-md">
                <Facebook className="h-5 w-5 text-blue-600" />
              </div>
              <span className="text-gray-900 font-medium">Facebook Profile</span>
            </a>
          ) : (
            <div className="flex items-center gap-3 bg-gray-100 px-4 py-3 rounded-xl border border-gray-200 text-gray-400">
              <div className="bg-white p-2 rounded-md">
                <Facebook className="h-5 w-4 text-gray-400" />
              </div>
              <span>Didn't state</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
