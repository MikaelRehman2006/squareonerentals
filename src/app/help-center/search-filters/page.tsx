export default function SearchFiltersGuide() {
  return (
    <div className="bg-white min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <a href="/help-center" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← Back to Help Center
          </a>
          <h1 className="text-3xl font-bold text-black mb-4">Using Search Filters</h1>
          <p className="text-gray-600">Learn how to use price, location, and amenity filters effectively to find your perfect rental.</p>
        </div>

        <div className="space-y-8">
          {/* Overview */}
          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">Overview</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <p className="text-gray-700 mb-4">
                Square One Rentals offers powerful search filters to help you find the perfect rental property. 
                You can filter by price range, property details, amenities, and more.
              </p>
              <p className="text-gray-700">
                <strong>Location:</strong> Filters are available on the main listings page and can be accessed via the "Filters" button.
              </p>
            </div>
          </section>

          {/* Price Range */}
          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">Price Range Filter</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">1</div>
                <div>
                  <p className="text-gray-700">Set your minimum and maximum monthly rent budget:</p>
                  <div className="mt-3 space-y-2">
                    <div className="bg-gray-100 rounded-lg p-4">
                      <h4 className="font-semibold text-black mb-2">How to Use:</h4>
                      <ul className="space-y-1 text-sm text-gray-700">
                        <li>• Enter your minimum budget in the "Min Price" field</li>
                        <li>• Enter your maximum budget in the "Max Price" field</li>
                        <li>• Leave either field empty to set no limit</li>
                        <li>• Prices are in Canadian Dollars (CAD)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Property Details */}
          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">Property Details Filters</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">2</div>
                <div>
                  <p className="text-gray-700">Filter by specific property characteristics:</p>
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-100 rounded-lg p-4">
                      <h4 className="font-semibold text-black mb-2">Bedrooms:</h4>
                      <ul className="space-y-1 text-sm text-gray-700">
                        <li>• Studio (0 bedrooms)</li>
                        <li>• 1 Bedroom</li>
                        <li>• 2 Bedrooms</li>
                        <li>• 3+ Bedrooms</li>
                      </ul>
                    </div>
                    <div className="bg-gray-100 rounded-lg p-4">
                      <h4 className="font-semibold text-black mb-2">Bathrooms:</h4>
                      <ul className="space-y-1 text-sm text-gray-700">
                        <li>• 1 Bathroom</li>
                        <li>• 1.5 Bathrooms</li>
                        <li>• 2 Bathrooms</li>
                        <li>• 2+ Bathrooms</li>
                      </ul>
                    </div>
                    <div className="bg-gray-100 rounded-lg p-4">
                      <h4 className="font-semibold text-black mb-2">Property Type:</h4>
                      <ul className="space-y-1 text-sm text-gray-700">
                        <li>• Apartment</li>
                        <li>• Condo</li>
                        <li>• House</li>
                        <li>• Townhouse</li>
                        <li>• Basement</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Amenities */}
          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">Amenities Filter</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">3</div>
                <div>
                  <p className="text-gray-700">Select the amenities that are important to you:</p>
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-black mb-2">Common Amenities:</h4>
                      <ul className="space-y-1 text-sm text-gray-700">
                        <li>• Air Conditioning</li>
                        <li>• Heating</li>
                        <li>• Dishwasher</li>
                        <li>• In-Unit Laundry</li>
                        <li>• Balcony/Patio</li>
                        <li>• Hardwood Floors</li>
                        <li>• Walk-in Closet</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-black mb-2">Building Features:</h4>
                      <ul className="space-y-1 text-sm text-gray-700">
                        <li>• Gym</li>
                        <li>• Pool</li>
                        <li>• Parking</li>
                        <li>• Security</li>
                        <li>• Elevator</li>
                        <li>• Concierge</li>
                        <li>• Rooftop Deck</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Features */}
          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">Features Filter</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">4</div>
                <div>
                  <p className="text-gray-700">Filter by additional property features:</p>
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-black mb-2">Property Features:</h4>
                      <ul className="space-y-1 text-sm text-gray-700">
                        <li>• Pet Friendly</li>
                        <li>• Furnished</li>
                        <li>• Utilities Included</li>
                        <li>• Internet Included</li>
                        <li>• Cable Included</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-black mb-2">Accessibility:</h4>
                      <ul className="space-y-1 text-sm text-gray-700">
                        <li>• Wheelchair Accessible</li>
                        <li>• Ground Floor</li>
                        <li>• Elevator Access</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Utilities */}
          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">Utilities Filter</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">5</div>
                <div>
                  <p className="text-gray-700">Filter by included utilities:</p>
                  <div className="mt-3 space-y-2">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h4 className="font-semibold text-black mb-2">Available Utilities:</h4>
                      <ul className="space-y-1 text-sm text-gray-700">
                        <li>• Electricity</li>
                        <li>• Water</li>
                        <li>• Heat</li>
                        <li>• Internet</li>
                        <li>• Cable TV</li>
                        <li>• Garbage</li>
                        <li>• Parking</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Tips */}
          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">Search Tips</h2>
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h3 className="font-semibold text-black mb-3">Best Practices:</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• <strong>Start broad:</strong> Begin with fewer filters and narrow down as needed</li>
                  <li>• <strong>Price range:</strong> Set a realistic range to see more options</li>
                  <li>• <strong>Must-have amenities:</strong> Only select amenities you absolutely need</li>
                  <li>• <strong>Location flexibility:</strong> Consider nearby areas for more options</li>
                  <li>• <strong>Reset filters:</strong> Use the "Reset Filters" button to start over</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Mobile Filters */}
          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">Using Filters on Mobile</h2>
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-semibold text-black mb-3">Mobile Experience:</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Tap the "Filters" button to open the filter panel</li>
                  <li>• Scroll through all available filter options</li>
                  <li>• Use the "Reset Filters" button to clear all selections</li>
                  <li>• Close the panel to see filtered results</li>
                  <li>• All filter functionality is the same as desktop</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Troubleshooting */}
          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">Troubleshooting</h2>
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-black mb-2">Common Issues:</h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-black">No results found</h4>
                    <p className="text-sm text-gray-600">Try removing some filters or expanding your price range</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-black">Filters not working</h4>
                    <p className="text-sm text-gray-600">Try refreshing the page and reapplying your filters</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-black">Mobile filters not showing</h4>
                    <p className="text-sm text-gray-600">Make sure you're tapping the "Filters" button, not a nested filter option</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Support */}
          <section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">Need More Help?</h2>
            <p className="text-blue-100 mb-6">
              If you're having trouble with search filters, our support team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/contact" className="bg-white text-blue-600 py-3 px-8 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block">
                Contact Support
              </a>
              <a href="/report-issue" className="border-2 border-white text-white py-3 px-8 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors inline-block">
                Report an Issue
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
} 