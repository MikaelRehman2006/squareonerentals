import Link from 'next/link';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">About Square One Rentals</h1>
        <p className="text-xl text-gray-600">Connecting tenants and landlords in the heart of Mississauga.</p>
      </div>

      {/* Hero Section */}
      <div className="relative w-full h-96 mb-16 rounded-xl overflow-hidden">
        <Image
          src="https://source.unsplash.com/featured/?mississauga,skyline"
          alt="Mississauga Skyline"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-xl max-w-3xl">
              To simplify the rental process in Mississauga, making it easy for tenants to find their
              dream homes and for landlords to connect with quality tenants.
            </p>
          </div>
        </div>
      </div>

      {/* Our Story */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-lg text-gray-600 mb-4">
              Square One Rentals was founded in 2023 with a simple goal: to create a better rental
              experience for everyone in the Mississauga area, especially around the popular Square One district.
            </p>
            <p className="text-lg text-gray-600 mb-4">
              We recognized that finding a quality rental property or a reliable tenant can be a time-consuming
              and frustrating process. By leveraging technology and local expertise, we've created a platform
              that simplifies and streamlines the rental process.
            </p>
            <p className="text-lg text-gray-600">
              Today, we are proud to be Mississauga's premier rental community, connecting hundreds of
              tenants with landlords each month and helping people find their perfect home.
            </p>
          </div>
          <div className="relative h-80 rounded-xl overflow-hidden">
            <Image
              src="https://source.unsplash.com/featured/?apartment,building"
              alt="Modern apartment building"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Why Choose Square One Rentals</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Local Expertise</h3>
            <p className="text-gray-600">
              We focus exclusively on the Mississauga area, giving us deep knowledge of local neighborhoods,
              market conditions, and rental trends.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Verified Listings</h3>
            <p className="text-gray-600">
              All our listings undergo a verification process to ensure they are accurate,
              legitimate, and represent properties fairly.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Direct Communication</h3>
            <p className="text-gray-600">
              Our platform allows tenants and landlords to communicate directly,
              making the rental process more efficient and transparent.
            </p>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Our Team</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Team members would go here - showing sample structure */}
          <div className="text-center">
            <div className="relative w-32 h-32 rounded-full overflow-hidden mx-auto mb-4">
              <Image
                src="https://source.unsplash.com/featured/?person,professional"
                alt="Team Member"
                fill
                className="object-cover"
              />
            </div>
            <h3 className="text-xl font-semibold">Jane Doe</h3>
            <p className="text-gray-600">Founder & CEO</p>
          </div>
          <div className="text-center">
            <div className="relative w-32 h-32 rounded-full overflow-hidden mx-auto mb-4">
              <Image
                src="https://source.unsplash.com/featured/?man,professional"
                alt="Team Member"
                fill
                className="object-cover"
              />
            </div>
            <h3 className="text-xl font-semibold">John Smith</h3>
            <p className="text-gray-600">Community Manager</p>
          </div>
          <div className="text-center">
            <div className="relative w-32 h-32 rounded-full overflow-hidden mx-auto mb-4">
              <Image
                src="https://source.unsplash.com/featured/?woman,professional"
                alt="Team Member"
                fill
                className="object-cover"
              />
            </div>
            <h3 className="text-xl font-semibold">Sarah Johnson</h3>
            <p className="text-gray-600">Property Expert</p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-blue-600 text-white rounded-xl p-8 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-xl mb-6 max-w-2xl mx-auto">
          Whether you're looking for your next home or wanting to list your property,
          Square One Rentals is here to help.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/listings"
            className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold transition"
          >
            Browse Listings
          </Link>
          <Link
            href="/contact"
            className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-6 py-3 rounded-lg font-semibold transition"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
} 