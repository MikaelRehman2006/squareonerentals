'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Users, MessageSquare, Eye, TrendingUp } from 'lucide-react';

const features = [
  {
    title: 'Local Expertise',
    description: 'Deep knowledge of Mississauga neighborhoods and market trends.',
    icon: '🏙️'
  },
  {
    title: 'Verified Listings',
    description: 'Every property is verified for authenticity and accuracy.',
    icon: '✓'
  },
  {
    title: 'Smart Platform',
    description: 'Advanced tools to streamline your rental journey.',
    icon: '💡'
  },
  {
    title: 'Direct Contact',
    description: 'Connect directly with property owners and managers.',
    icon: '📱'
  }
];

const testimonials = [
  {
    text: "The verification process gave me confidence in my rental choice.",
    author: "J.P.",
    role: "Tenant"
  },
  {
    text: "Listing my properties has never been easier.",
    author: "R.K.",
    role: "Property Owner"
  }
];

const stats = [
  {
    number: '20K+',
    label: 'Posts',
    subtext: 'in the past year',
    icon: MessageSquare
  },
  {
    number: '1000s',
    label: 'Views',
    subtext: 'per post on average',
    icon: Eye
  },
  {
    number: '3M+',
    label: 'Total Views',
    subtext: 'in one year',
    icon: TrendingUp
  },
  {
    number: '100K+',
    label: 'Members',
    subtext: 'in our community',
    icon: Users
  }
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[500px] overflow-hidden">
        <Image
          src="/images/mississauga-skyline.jpg"
          alt="Mississauga Skyline"
          fill
          className="object-cover brightness-75"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white space-y-6 max-w-4xl px-4">
            <motion.h1 
              className="text-5xl md:text-6xl font-bold"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Transforming Rental Experience
            </motion.h1>
            <motion.p 
              className="text-xl md:text-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              We help tenants find homes they love and landlords connect with qualified renters in Mississauga.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-3xl mx-auto space-y-8"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900">Our Story</h2>
            <div className="prose prose-lg mx-auto text-gray-600 leading-relaxed">
              <p>
                Founded in 2023, Square One Rentals emerged from a vision to transform the rental experience in Mississauga. We recognized the challenges faced by both tenants searching for their ideal homes and landlords looking to connect with reliable renters in our vibrant city.
              </p>
              <p>
                What began as a local initiative to simplify property rentals has blossomed into a trusted platform that thousands in our community rely on daily. Our deep understanding of Mississauga's unique rental landscape, combined with our commitment to transparency and efficiency, has made us the go-to destination for rental properties in the region.
              </p>
              <p>
                Today, we're proud to be more than just a rental platform – we're a cornerstone of the Mississauga community, helping create meaningful connections between property owners and future tenants, one successful rental at a time.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Growth & Impact Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Growth & Impact</h2>
            <p className="mt-4 text-xl text-gray-600">Our thriving Facebook community by the numbers</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <div className="flex justify-center mb-4">
                  <stat.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-4xl font-bold text-gray-900 mb-2">{stat.number}</h3>
                <p className="text-lg font-semibold text-gray-700">{stat.label}</p>
                <p className="text-sm text-gray-500">{stat.subtext}</p>
              </motion.div>
            ))}
          </div>

          <motion.div 
            className="mt-16 max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-lg text-gray-600 mb-6">
              Join our vibrant Facebook community of over 100,000 members, where we share the latest rental listings, market insights, and neighborhood updates. Our group has become Mississauga's largest and most active rental community, with over 20,000 posts and 3 million views in the past year alone.
            </p>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="group"
            >
              <Link 
                href="https://www.facebook.com/groups/618941558289151" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                Join Our Facebook Group
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Why Choose Square One Rentals</h2>
            <p className="mt-4 text-xl text-gray-600">Experience the difference with our feature-rich platform</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="group p-8 bg-gray-50 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">What People Say</h2>
            <p className="mt-4 text-xl text-gray-600">Hear from our community members</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.author}
                className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <p className="text-gray-600 text-lg leading-relaxed mb-6">"{testimonial.text}"</p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.author}</p>
                  <p className="text-gray-500">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <motion.div 
          className="container mx-auto px-4 text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-8">Ready to Get Started?</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="group relative overflow-hidden"
            >
              <Link href="/listings" className="flex items-center gap-2">
                Browse Listings
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="bg-transparent border-white hover:bg-white hover:text-primary transition-colors"
            >
              <Link href="/submit">
                List Your Property
              </Link>
            </Button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}