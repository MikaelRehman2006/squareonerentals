'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  // Improved empty check to handle empty strings, null, and undefined
  const hasPhoneNumber = phoneNumber && phoneNumber.trim() !== '';
  const hasFacebookUrl = facebookUrl && facebookUrl.trim() !== '';

  return (
    <Card className="sticky top-4 bg-[#1F1F1F] border border-[#333333] rounded-xl shadow-lg hover:shadow-xl transition-all">
      <CardContent className="p-7">
        <h3 className="text-xl font-semibold text-[#E0E0E0] uppercase mb-5">Contact Information</h3>
        
        <div className="space-y-5">
          {/* Landlord Name */}
          <div className="flex items-center gap-3 bg-[#252525] p-3 rounded-lg border border-[#3b3b3b]">
            <div className="bg-[#2A2A2A] p-2 rounded-lg">
              <User className="h-5 w-5 text-[#3B82F6]" />
            </div>
            <div>
              <p className="font-medium text-[#E0E0E0]">{landlord.name}</p>
              <p className="text-sm text-[#A0A0A0]">Property Owner</p>
            </div>
          </div>

          {/* Contact Methods */}
          <div className="space-y-4">
            {/* Email - Always available */}
            <a 
              href={`mailto:${landlord.email}`}
              className="flex items-center gap-3 bg-[#2A2A2A] hover:bg-[#333333] text-[#E0E0E0] px-4 py-3 rounded-lg border border-[#444444] transition-colors duration-200"
            >
              <div className="bg-[#1F1F1F] p-2 rounded-md">
                <Mail className="h-5 w-5 text-[#3B82F6]" />
              </div>
              <span className="text-[#E0E0E0]">{landlord.email}</span>
            </a>

            {/* Phone Number */}
            {hasPhoneNumber ? (
              <a 
                href={`tel:${phoneNumber}`}
                className="flex items-center gap-3 bg-[#2A2A2A] hover:bg-[#333333] text-[#E0E0E0] px-4 py-3 rounded-lg border border-[#444444] transition-colors duration-200"
              >
                <div className="bg-[#1F1F1F] p-2 rounded-md">
                  <Phone className="h-5 w-5 text-[#3B82F6]" />
                </div>
                <span className="text-[#E0E0E0]">{phoneNumber}</span>
              </a>
            ) : (
              <div className="flex items-center gap-3 bg-[#2A2A2A] px-4 py-3 rounded-lg border border-[#444444]">
                <div className="bg-[#1F1F1F] p-2 rounded-md">
                  <Phone className="h-5 w-5 text-[#666666]" />
                </div>
                <span className="text-[#BBBBBB]">Phone not provided</span>
              </div>
            )}

            {/* Facebook Link */}
            {hasFacebookUrl ? (
              <a 
                href={facebookUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-[#2A2A2A] hover:bg-[#333333] text-[#E0E0E0] px-4 py-3 rounded-lg border border-[#444444] transition-colors duration-200"
              >
                <div className="bg-[#1F1F1F] p-2 rounded-md">
                  <Facebook className="h-5 w-5 text-[#3B82F6]" />
                </div>
                <span className="text-[#E0E0E0]">Facebook Profile</span>
              </a>
            ) : (
              <div className="flex items-center gap-3 bg-[#2A2A2A] px-4 py-3 rounded-lg border border-[#444444]">
                <div className="bg-[#1F1F1F] p-2 rounded-md">
                  <Facebook className="h-5 w-5 text-[#666666]" />
                </div>
                <span className="text-[#BBBBBB]">Facebook not provided</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
