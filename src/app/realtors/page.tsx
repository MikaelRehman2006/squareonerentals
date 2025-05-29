'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Mail, Star, Check, Info, Building2, ArrowRight, X } from 'lucide-react';
import Link from 'next/link';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface Realtor {
  id: string;
  name: string;
  photo: string;
  location: string;
  rating: number;
  reviews: number;
  specialties: string[];
  experience: string;
  description: string;
  about: string;
  email: string;
  phone?: string;
  officePhone?: string;
  officeAddress?: string;
  tagline?: string;
  badge?: string;
  background?: string;
}

const realtors: Realtor[] = [
  {
    id: '3',
    name: 'Gulrez Khan',
    photo: '/images/gulrez.jpg',
    location: 'Mississauga, ON',
    rating: 5.0,
    reviews: 0,
    specialties: ['Residential & Commercial Real Estate', 'Investment Properties', 'Greater Toronto Area (GTA)'],
    experience: '21',
    description: 'Strategic | Reliable | Experienced',
    about: 'With over 21 years of leadership in digital transformation and client success in the banking and tech industries, Gulrez brings a results-driven mindset to every real estate transaction. Whether you\'re buying your first home or investing in commercial property, Gulrez is committed to delivering clarity, trust, and professionalism every step of the way.',
    email: 'https://www.rightathomerealty.com/gulrez-khan',
    phone: '(647) 961-1791',
    officePhone: '(905) 565-9200',
    officeAddress: '480 Eglinton Ave W, Mississauga, ON',
    tagline: 'Strategic | Reliable | Experienced',
    badge: 'Sales Representative – Right At Home Realty Inc.',
    background: 'With over 21 years of leadership in digital transformation and client success in the banking and tech industries, Gulrez brings a results-driven mindset to every real estate transaction. Whether you\'re buying your first home or investing in commercial property, Gulrez is committed to delivering clarity, trust, and professionalism every step of the way.'
  },
  // Add more realtors as needed
];

// Star rating component with hover effect
const StarRating = ({ rating }: { rating: number }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
      ))}
      {hasHalfStar && (
        <div className="relative">
          <Star className="w-4 h-4 text-yellow-400" />
          <div className="absolute top-0 left-0 overflow-hidden" style={{ width: '50%' }}>
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          </div>
        </div>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} className="w-4 h-4 text-yellow-400" />
      ))}
    </div>
  );
};

// Badge component for specialties
const SpecialtyBadge = ({ specialty }: { specialty: string }) => {
  const isLuxury = specialty.toLowerCase().includes('luxury');
  const isStudent = specialty.toLowerCase().includes('student');
  let bgColor = "bg-gray-200 text-gray-700";
  if (isLuxury) bgColor = "bg-amber-100 text-amber-800";
  if (isStudent) bgColor = "bg-blue-100 text-blue-800";
  return (
    <span className={`text-xs font-medium px-3 py-1 rounded-full ${bgColor}`}>{specialty}</span>
  );
};

export default function RealtorsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedRealtor, setSelectedRealtor] = useState<Realtor | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const filteredRealtors = realtors.filter(realtor => 
    realtor.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    realtor.location.toLowerCase().includes(locationFilter.toLowerCase())
  );

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 100,
        damping: 15
      }
    }
  };

  const searchVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        delay: 0.2,
        type: "spring", 
        stiffness: 100 
      }
    }
  };

  return (
    <div className="bg-gradient-to-b from-white via-gray-50 to-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Real Estate Partner Opportunity Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 bg-white/90 rounded-2xl shadow-xl p-8 border border-gray-200"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="h-6 w-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-800">Become a Real Estate Partner</h2>
              </div>
              <p className="text-gray-700 mb-6">
                Partner with us as a Canadian realtor to grow your listings and reach 107K+ renters—no fees, just commission-based exposure.
              </p>
              <Link 
                href="https://www.linkedin.com/hiring/jobs/4231485688"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 transform hover:translate-y-[-2px] group"
              >
                Apply Now
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="flex gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Check className="h-4 w-4 text-green-500" />
                <span>No Fees</span>
              </div>
              <div className="flex items-center gap-1">
                <Check className="h-4 w-4 text-green-500" />
                <span>Commission Based</span>
              </div>
              <div className="flex items-center gap-1">
                <Check className="h-4 w-4 text-green-500" />
                <span>Remote Work</span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-extrabold text-gray-800 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Find a <span className="text-blue-600">Realtor</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-lg text-gray-600 sm:text-xl md:mt-5 md:max-w-3xl">
            Connect with top real estate professionals in your area
          </p>
        </motion.div>
        
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full flex items-center justify-center gap-2 bg-white/90 text-gray-900 py-3 px-4 rounded-xl border border-gray-200"
          >
            <Search className="h-5 w-5" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        {/* Search Filters */}
        <motion.div 
          variants={searchVariants}
          initial="hidden"
          animate="visible"
          className={`flex flex-col sm:flex-row gap-4 mb-12 ${showFilters ? 'block' : 'hidden lg:flex'}`}
        >
          <div className="relative flex-1 group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/90 text-gray-900 placeholder-gray-500"
              placeholder="Search by name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="relative flex-1 group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/90 text-gray-900 placeholder-gray-500"
              placeholder="Filter by location"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
            />
          </div>
        </motion.div>

        <AnimatePresence>
          {filteredRealtors.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-10"
            >
              <p className="text-gray-600 text-lg">No realtors found matching your criteria</p>
            </motion.div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
              variants={containerVariants}
              initial="hidden"
              animate={isLoaded ? "visible" : "hidden"}
            >
              {filteredRealtors.map((realtor) => (
                <motion.div 
                  key={realtor.id}
                  variants={itemVariants}
                  whileHover={{ 
                    scale: 1.01, 
                    transition: { duration: 0.2 } 
                  }}
                  className="bg-white/90 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200"
                >
                  <div className="p-6">
                    {/* Top section with avatar and name */}
                    <div className="flex items-start space-x-4 mb-4">
                      <div className="relative">
                        {realtor.rating >= 4.8 && (
                          <div className="absolute -top-2 -left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10 transform -rotate-12">
                            Top Rated
                          </div>
                        )}
                        <div className="relative h-20 w-20 rounded-full overflow-hidden border-4 border-blue-100 shadow-inner">
                          {realtor.photo ? (
                            <img 
                              src={realtor.photo} 
                              alt={realtor.name} 
                              className="h-full w-full object-cover" 
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center bg-blue-100 text-blue-800 text-xl font-bold">
                              {realtor.name.split(' ').map(n => n[0]).join('')}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center">
                          <h2 className="text-xl font-bold text-gray-800 mr-2">{realtor.name}</h2>
                          <div 
                            className="relative" 
                            onMouseEnter={() => setActiveTooltip(realtor.id)}
                            onMouseLeave={() => setActiveTooltip(null)}
                          >
                            <div className="bg-blue-500 text-white p-1 rounded-full">
                              <Check className="h-4 w-4" />
                            </div>
                            
                            {activeTooltip === realtor.id && (
                              <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="absolute z-10 -left-16 -bottom-12 bg-white text-gray-800 text-xs rounded-lg py-1 px-2 w-32 text-center border border-gray-200 shadow-lg"
                              >
                                Verified Realtor
                                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 rotate-45 bg-white border-l border-t border-gray-200"></div>
                              </motion.div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center mt-1 text-gray-500">
                          <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{realtor.location}</span>
                        </div>
                        
                        <div className="flex items-center mt-2">
                          <StarRating rating={realtor.rating} />
                        </div>
                      </div>
                    </div>
                    
                    {/* Experience and specialties */}
                    <div className="mb-4">
                      <div className="text-sm text-gray-700 mb-2">
                        <span className="font-semibold">{realtor.experience} years</span> of experience
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        {realtor.specialties.map((specialty, index) => (
                          <SpecialtyBadge key={index} specialty={specialty} />
                        ))}
                      </div>
                    </div>
                    
                    {/* Description */}
                    <div className="mb-4">
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {realtor.description}
                      </p>
                    </div>
                    
                    {/* About section with subtle separator */}
                    <div className="pt-3 mt-4 border-t border-gray-200">
                      <p className="text-gray-500 text-sm italic">
                        {realtor.about}
                      </p>
                    </div>
                    
                    {/* Contact button */}
                    <div className="mt-5">
                      <button 
                        onClick={() => {
                          setSelectedRealtor(realtor);
                          setShowContactModal(true);
                        }}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 transform hover:translate-y-[-2px] flex items-center justify-center group"
                      >
                        <Mail className="h-5 w-5 mr-2 group-hover:animate-pulse" />
                        Contact Realtor
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile CTA Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 lg:hidden">
          <div className="flex gap-4">
            <Link
              href="#realtors"
              className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 text-center"
            >
              Browse Realtors
            </Link>
            <Link
              href="https://www.linkedin.com/hiring/jobs/4231485688"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 text-center"
            >
              Apply to Partner
            </Link>
          </div>
        </div>

        {/* Contact Modal */}
        <Dialog open={showContactModal} onOpenChange={setShowContactModal}>
          <DialogContent className="bg-white border border-gray-200 shadow-xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-gray-900">
                Contact Information
              </DialogTitle>
              <DialogDescription className="text-gray-500">
                Get in touch with {selectedRealtor?.name}
              </DialogDescription>
            </DialogHeader>
            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Mail className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">You can contact him at Right at Home Realty</p>
                  <a 
                    href={selectedRealtor?.email}
                    className="text-blue-600 font-medium hover:underline transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    rightathomerealty.com/gulrez-khan
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <MapPin className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="text-gray-900 font-medium">
                    {selectedRealtor?.location}
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowContactModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                Close
              </button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
