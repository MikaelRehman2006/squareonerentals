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

  // Sample testimonials data
  const testimonials = [
    {
      id: 1,
      text: "Found my dream apartment through Square One Rentals. The process was smooth and efficient!",
      author: "Sarah M.",
      role: "Tenant"
    },
    {
      id: 2,
      text: "As a landlord, I appreciate how easy it is to list and manage my properties on this platform.",
      author: "John D.",
      role: "Landlord"
    }
  ];

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center text-white">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://source.unsplash.com/featured/?mississauga,skyline"
            alt="Mississauga Skyline"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        
        <div className="relative z-10 text-center px-4">
          <h1 className="text-5xl font-bold mb-4">Welcome to Square One Rentals</h1>
          <p className="text-xl mb-8">The Largest Real Estate Community in Mississauga</p>
          <div className="flex gap-4 justify-center">
            <Link 
              href="/listings"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition"
            >
              Find Listings
            </Link>
            <Link 
              href="/submit"
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition"
            >
              Submit Your Listing
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Listings Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Listings</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button asChild>
              <Link href="/listings">View All Listings</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">1</div>
              <h3 className="text-xl font-semibold mb-2">Search Listings</h3>
              <p className="text-gray-600">Browse through our extensive collection of rental properties in the Square One area.</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">2</div>
              <h3 className="text-xl font-semibold mb-2">Connect with Landlords</h3>
              <p className="text-gray-600">Directly communicate with property owners to schedule viewings and ask questions.</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">3</div>
              <h3 className="text-xl font-semibold mb-2">Secure Your Home</h3>
              <p className="text-gray-600">Complete the rental process with confidence, knowing you've found the perfect place.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 mr-4">JD</div>
                <div>
                  <h4 className="font-semibold">John Doe</h4>
                  <p className="text-gray-500 text-sm">Tenant</p>
                </div>
              </div>
              <p className="text-gray-600">"I found my dream apartment near Square One in just a few days. The platform made it so easy to filter exactly what I was looking for."</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 mr-4">JS</div>
                <div>
                  <h4 className="font-semibold">Jane Smith</h4>
                  <p className="text-gray-500 text-sm">Landlord</p>
                </div>
              </div>
              <p className="text-gray-600">"As a property owner, I've had great success listing my properties here. I receive quality inquiries and the process is streamlined."</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 mr-4">RP</div>
                <div>
                  <h4 className="font-semibold">Robert Patel</h4>
                  <p className="text-gray-500 text-sm">Tenant</p>
                </div>
              </div>
              <p className="text-gray-600">"The detailed listings and neighborhood information helped me make an informed decision. I'm very happy with my new place!"</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Find Your Perfect Home?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Join thousands of satisfied tenants who found their dream home in Mississauga.</p>
          <div className="flex gap-4 justify-center">
            <Link 
              href="/listings"
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition"
            >
              Browse Listings
            </Link>
            <Link 
              href="/submit"
              className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-8 py-3 rounded-lg font-semibold transition"
            >
              Submit a Listing
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}