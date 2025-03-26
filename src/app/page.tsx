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
          setFeaturedListings(data.listings);
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
          <h1 className="text-6xl font-extrabold tracking-tight mb-5 text-white">Square One Rentals</h1>
          <p className="text-lg font-light opacity-90 mb-8">
            Find your perfect rental in the heart of Mississauga.
          </p>
          <div className="flex gap-5 justify-center">
            <Link href="/listings">
              <Button className="px-6 py-3 text-lg bg-white text-black hover:bg-gray-200 border border-gray-300 rounded-lg">
                Browse Listings
              </Button>
            </Link>
            <Link href="/submit">
              <Button className="px-6 py-3 text-lg bg-white text-black hover:bg-gray-200 border border-gray-300 rounded-lg">
                Submit Listing
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Listings Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold mb-10 text-center text-black">Featured Listings</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button className="px-6 py-3 text-lg bg-white text-black hover:bg-gray-200 border border-gray-300 rounded-lg">
              <Link href="/listings">View All Listings</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-12 text-black">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {["Search Listings", "Connect with Landlords", "Secure Your Home"].map((step, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-lg text-center">
                <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  {index + 1}
                </div>
                <h3 className="text-2xl font-semibold mb-3 text-black">{step}</h3>
                <p className="text-black">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center text-black">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-gray-100 p-6 rounded-lg shadow-md">
                <p className="text-black italic mb-4">&ldquo;{testimonial.text}&rdquo;</p>
                <p className="font-bold text-black">{testimonial.author}</p>
                <p className="text-black">{testimonial.role}</p>
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
              <Button className="px-6 py-3 text-lg bg-white text-black hover:bg-gray-200 border border-gray-300 rounded-lg">
                Browse Listings
              </Button>
            </Link>
            <Link href="/submit">
              <Button className="px-6 py-3 text-lg bg-white text-black hover:bg-gray-200 border border-gray-300 rounded-lg">
                Submit Listing
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
