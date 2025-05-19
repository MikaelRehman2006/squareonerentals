'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Mail, Star, Check, Info } from 'lucide-react';

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
}

const realtors: Realtor[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    photo: '/avatars/realtor1.jpg',
    location: 'Downtown Toronto',
    rating: 4.8,
    reviews: 156,
    specialties: ['Luxury Rentals', 'Student Housing'],
    experience: '8',
    description: 'Highly experienced realtor with a passion for helping clients find their dream home.',
    about: 'Sarah has been in the real estate industry for over 8 years and has a proven track record of success.'
  },
  {
    id: '2',
    name: 'Michael Chen',
    photo: '/avatars/realtor2.jpg',
    location: 'North York',
    rating: 4.9,
    reviews: 203,
    specialties: ['Condos', 'Family Homes'],
    experience: '12',
    description: 'Dedicated and knowledgeable realtor with a focus on providing exceptional client service.',
    about: 'Michael has been a realtor for over 12 years and has a deep understanding of the local market.'
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
  
  let bgColor = "bg-gray-100 text-gray-800";
  if (isLuxury) bgColor = "bg-amber-100 text-amber-800";
  if (isStudent) bgColor = "bg-blue-100 text-blue-800";
  
  return (
    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${bgColor}`}>
      {specialty}
    </span>
  );
};

export default function RealtorsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

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
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl sm:tracking-tight lg:text-6xl">
            Find a <span className="text-blue-600 dark:text-blue-400">Realtor</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-lg text-gray-500 dark:text-gray-400 sm:text-xl md:mt-5 md:max-w-3xl">
            Connect with top real estate professionals in your area
          </p>
        </motion.div>
        
        <motion.div 
          variants={searchVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col sm:flex-row gap-4 mb-12"
        >
          <div className="relative flex-1 group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="Search by name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none opacity-0 group-focus-within:opacity-100 transition-opacity duration-200">
              <Info className="h-4 w-4 text-blue-500" />
            </div>
          </div>
          
          <div className="relative flex-1 group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="Filter by location"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none opacity-0 group-focus-within:opacity-100 transition-opacity duration-200">
              <Info className="h-4 w-4 text-blue-500" />
            </div>
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
              <p className="text-gray-500 dark:text-gray-400 text-lg">No realtors found matching your criteria</p>
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
                    scale: 1.02, 
                    transition: { duration: 0.2 } 
                  }}
                  className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700"
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
                        <div className="relative h-20 w-20 rounded-full overflow-hidden border-4 border-blue-100 dark:border-blue-900 shadow-inner">
                          {realtor.photo ? (
                            <img 
                              src={realtor.photo} 
                              alt={realtor.name} 
                              className="h-full w-full object-cover" 
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center bg-blue-500 text-white text-xl font-bold">
                              {realtor.name.split(' ').map(n => n[0]).join('')}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center">
                          <h2 className="text-xl font-bold text-gray-900 dark:text-white mr-2">{realtor.name}</h2>
                          <div 
                            className="relative" 
                            onMouseEnter={() => setActiveTooltip(realtor.id)}
                            onMouseLeave={() => setActiveTooltip(null)}
                          >
                            <div className="bg-blue-500 text-white p-1 rounded-full">
                              <Check className="h-4 w-4" />
                            </div>
                            
                            {/* Tooltip */}
                            {activeTooltip === realtor.id && (
                              <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="absolute z-10 -left-16 -bottom-12 bg-gray-900 text-white text-xs rounded py-1 px-2 w-32 text-center"
                              >
                                Verified Realtor
                                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 rotate-45 bg-gray-900"></div>
                              </motion.div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center mt-1 text-gray-500 dark:text-gray-400">
                          <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                          <span className="text-sm">{realtor.location}</span>
                        </div>
                        
                        <div className="flex items-center mt-2">
                          <StarRating rating={realtor.rating} />
                          <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            {realtor.rating.toFixed(1)}/5.0
                          </span>
                          <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">
                            ({realtor.reviews} reviews)
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Experience and specialties */}
                    <div className="mb-4">
                      <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">
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
                      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                        {realtor.description}
                      </p>
                    </div>
                    
                    {/* About section with subtle separator */}
                    <div className="pt-3 mt-4 border-t border-gray-100 dark:border-gray-700">
                      <p className="text-gray-500 dark:text-gray-400 text-sm italic">
                        {realtor.about}
                      </p>
                    </div>
                    
                    {/* Contact button */}
                    <div className="mt-5">
                      <button 
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:translate-y-[-2px] flex items-center justify-center group"
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
      </div>
    </div>
  );
}
