'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ListingCard } from '@/components/ListingCard';
import { Listing } from '@/types/listing';
import { Button } from '@/components/ui/button';

export default function Home() {
  const [featuredListings, setFeaturedListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchFeaturedListings() {
      try {
        const response = await fetch('/api/listings?featured=true');
        if (response.ok) {
          const data = await response.json();
          setFeaturedListings(data);
        }
      } catch (error) {
        console.error('Error fetching featured listings:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchFeaturedListings();
  }, []);

  const testimonials = [
    {
      id: 1,
      text: "Found my dream apartment through Square One Rentals. The process was smooth and efficient!",
      author: "Lakshveer Chaniana",
      role: "Tenant"
    },
    {
      id: 2,
      text: "As a landlord, I appreciate how easy it is to list and manage my properties on this platform.",
      author: "Owais N.",
      role: "Landlord"
    }
  ];

  return (
    <main className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <section className="relative h-[550px] flex items-center justify-center text-white">
        <div className="absolute inset-0 z-0">
          <Image src="/images/Skyscraper.jpg" alt="Square One Area" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="relative z-10 text-center max-w-3xl mx-auto px-6">
          <h1 className="text-6xl font-extrabold tracking-tight mb-5">Square One Rentals</h1>
          <p className="text-lg font-light opacity-90 mb-8">
            Find your perfect rental in the heart of Mississauga.
          </p>
          <div className="flex gap-5 justify-center">
            <Link href="/listings">
              <Button className="px-6 py-3 text-lg bg-black text-gray-900 hover:bg-gray-200 border border-gray-300 rounded-lg">
                Browse Listings
              </Button>
            </Link>
            <Link href="/submit">
              <Button className="px-6 py-3 text-lg bg-black text-gray-900 hover:bg-gray-200 border border-gray-300 rounded-lg">
                Submit Listing
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Listings Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-gray-900 mb-10 text-center">Featured Listings</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button className="px-6 py-3 text-lg bg-black text-gray-900 hover:bg-gray-200 border border-gray-300 rounded-lg">
              <Link href="/listings">View All Listings</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {["Search Listings", "Connect with Landlords", "Secure Your Home"].map((step, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-lg text-center">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-5">
                  {index + 1}
                </div>
                <h3 className="text-2xl font-semibold mb-3">{step}</h3>
                <p className="text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-gray-100 p-6 rounded-lg shadow-md">
                <p className="text-gray-700 italic mb-4">&ldquo;{testimonial.text}&rdquo;</p>
                <p className="font-bold text-gray-900">{testimonial.author}</p>
                <p className="text-gray-500 text-sm">{testimonial.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section
        className="relative py-24 text-white text-center bg-cover bg-center"
        style={{ backgroundImage: "url('/images/condos-at-square-one-district-12.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 max-w-3xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold !text-white mb-6">
            Ready to Find Your Perfect Home?
          </h2>
          <p className="text-lg md:text-xl opacity-100 mb-10 bg-black/10 px-3 py-1 inline-block rounded-md">
            Join thousands of satisfied tenants who found their dream home in Mississauga.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/listings">
              <Button className="px-6 py-3 text-lg bg-black text-gray-900 hover:bg-gray-200 border border-gray-300 rounded-lg">
                Browse Listings
              </Button>
            </Link>
            <Link href="/submit">
              <Button className="px-6 py-3 text-lg bg-black text-gray-900 hover:bg-gray-200 border border-gray-300 rounded-lg">
                Submit Listing
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
