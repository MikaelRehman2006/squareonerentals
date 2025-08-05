'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Users, MessageSquare, Eye, TrendingUp, Star, ArrowRight } from 'lucide-react';

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
          src="/images/MississaugaSkyline.jpg"
          alt="Mississauga Skyline"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white space-y-8 max-w-4xl px-4">
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
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="group"
              >
                <Link href="/listings" className="flex items-center gap-2">
                  Browse Listings
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="bg-transparent border-white hover:bg-white hover:text-primary transition-colors"
              >
                <Link href="/submit" className="flex items-center gap-2">
                  List Your Property
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Our Story</h2>
              <div className="prose prose-lg text-gray-600 leading-relaxed">
                <p>
                  Founded in 2020, Square One Rentals emerged from a vision to transform the rental experience in Mississauga. We recognized the challenges faced by both tenants searching for their ideal homes and landlords looking to connect with reliable renters in our vibrant city.
                </p>
                <p>
                  What began as a local initiative to simplify property rentals has blossomed into a <strong>trusted platform</strong> that thousands in our community rely on daily. Our deep understanding of Mississauga's unique rental landscape, combined with our commitment to <strong>transparency</strong> and <strong>efficiency</strong>, has made us the go-to destination for rental properties in the region.
                </p>
                <p>
                  Today, we're proud to be more than just a rental platform – we're a <strong>cornerstone</strong> of the Mississauga community, helping create meaningful connections between property owners and future tenants, one successful rental at a time.
                </p>
              </div>
            </motion.div>
            <motion.div
              className="relative h-[400px] rounded-2xl overflow-hidden"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <Image
                src="/images/MississaugaSkyline.jpg"
                alt="Mississauga Skyline"
                fill
                className="object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Growth & Impact Section */}
      <section className="py-20 bg-white">
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
                className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <div className="flex justify-center mb-4">
                  <div className="bg-blue-50 p-3 rounded-full">
                    <stat.icon className="w-8 h-8 text-primary" />
                  </div>
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
            <div className="flex flex-col sm:flex-row gap-4 justify-c enter">
              <Button
                asChild
                size="lg"
                
                 className="bg-gray-900 hover:bg-gray-800 text-white font-semibold transition-all duration-300 shadow-sm group"
              >
                <Link 
                  href="https://www.facebook.com/groups/618941558289151" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  Join Our Facebook Group
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="group p-8 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <div className="bg-blue-50 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <span className="text-2xl">{feature.icon}</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
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
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-xl font-semibold text-gray-600">{testimonial.author[0]}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.author}</p>
                    <p className="text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 text-lg leading-relaxed">"{testimonial.text}"</p>
              </motion.div>
            ))}
          </div>

          <motion.div 
            className="mt-12 text-center"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Button
                asChild
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all duration-300 shadow-md group"
>
              <Link href="/feedback" className="flex items-center gap-2">
                Submit Your Experience
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 bg-primary">
        <div className="absolute inset-0">
          <Image
            src="/images/condos-at-square-one-district-12.jpg"
            alt="Square One District"
            fill
            className="object-cover brightness-50"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40" />
        </div>
        
        <motion.div 
          className="relative z-10 container mx-auto px-4 text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Ready to Get Started?
          </h2>
          <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto text-white/90">
            100K+ Mississauga renters are waiting — list yours today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="group"
            >
              <Link href="/listings" className="flex items-center gap-2">
                Browse Listings
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary transition-all"
            >
              <Link href="/submit" className="flex items-center gap-2">
                List Your Property
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}