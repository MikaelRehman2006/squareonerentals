export default function PostListingGuide() {
  return (
    <div className="bg-white min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <a href="/help-center" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← Back to Help Center
          </a>
          <h1 className="text-3xl font-bold text-black mb-4">How to Post a Listing</h1>
          <p className="text-gray-600">Step-by-step guide to creating and publishing your rental listing on Square One Rentals.</p>
        </div>

        <div className="space-y-8">
          {/* Prerequisites */}
          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">Before You Start</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-semibold text-black mb-3">Requirements:</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Active Square One Rentals account</li>
                <li>• Valid membership (Basic or Featured)</li>
                <li>• Property details and photos ready</li>
                <li>• Contact information for inquiries</li>
              </ul>
            </div>
          </section>

          {/* Step 1 */}
          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">Step 1: Access the Submit Listing Page</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">1</div>
                <div>
                  <p className="text-gray-700">Navigate to the "Submit Listing" page by clicking the button in the top navigation bar.</p>
                  <div className="mt-2 p-3 bg-gray-100 rounded border-l-4 border-blue-600">
                    <p className="text-sm text-gray-600">Location: Top navigation bar → "Submit Listing"</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Step 2 */}
          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">Step 2: Fill Out Property Details</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">2</div>
                <div>
                  <p className="text-gray-700">Complete all required fields in the listing form:</p>
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      <span className="text-sm font-medium">Property Address</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      <span className="text-sm font-medium">Monthly Rent</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      <span className="text-sm font-medium">Number of Bedrooms</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      <span className="text-sm font-medium">Number of Bathrooms</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                      <span className="text-sm">Property Type</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                      <span className="text-sm">Available Date</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Step 3 */}
          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">Step 3: Add Property Description</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">3</div>
                <div>
                  <p className="text-gray-700">Write a compelling description of your property:</p>
                  <div className="mt-3 space-y-2">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <h4 className="font-semibold text-black mb-2">Tips for Great Descriptions:</h4>
                      <ul className="space-y-1 text-sm text-gray-700">
                        <li>• Highlight unique features and amenities</li>
                        <li>• Mention nearby attractions and transportation</li>
                        <li>• Include information about utilities and parking</li>
                        <li>• Be honest about any limitations</li>
                        <li>• Use clear, professional language</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Step 4 */}
          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">Step 4: Upload Photos</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">4</div>
                <div>
                  <p className="text-gray-700">Add high-quality photos of your property:</p>
                  <div className="mt-3 space-y-2">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h4 className="font-semibold text-black mb-2">Photo Requirements:</h4>
                      <ul className="space-y-1 text-sm text-gray-700">
                        <li>• Minimum 3 photos, maximum 10</li>
                        <li>• File formats: JPG, PNG, WebP</li>
                        <li>• Maximum file size: 5MB per photo</li>
                        <li>• Include photos of all rooms and key features</li>
                        <li>• Ensure good lighting and clear angles</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Step 5 */}
          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">Step 5: Set Amenities and Features</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">5</div>
                <div>
                  <p className="text-gray-700">Select all applicable amenities and features:</p>
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-black mb-2">Common Amenities:</h4>
                      <ul className="space-y-1 text-sm text-gray-700">
                        <li>• Air Conditioning</li>
                        <li>• Heating</li>
                        <li>• Dishwasher</li>
                        <li>• In-Unit Laundry</li>
                        <li>• Balcony/Patio</li>
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
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Step 6 */}
          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">Step 6: Review and Publish</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">6</div>
                <div>
                  <p className="text-gray-700">Review your listing before publishing:</p>
                  <div className="mt-3 space-y-2">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-semibold text-black mb-2">Final Checklist:</h4>
                      <ul className="space-y-1 text-sm text-gray-700">
                        <li>✓ All required fields completed</li>
                        <li>✓ Photos uploaded successfully</li>
                        <li>✓ Description is accurate and complete</li>
                        <li>✓ Contact information is correct</li>
                        <li>✓ Pricing and availability are accurate</li>
                      </ul>
                    </div>
                    <p className="text-sm text-gray-600 mt-3">Click "Publish Listing" to make your property visible to potential renters.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* After Publishing */}
          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">After Publishing</h2>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-black mb-3">What Happens Next:</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Your listing will be visible on the main listings page</li>
                <li>• Featured listings appear at the top of search results</li>
                <li>• You'll receive notifications for new inquiries</li>
                <li>• You can edit your listing anytime from your dashboard</li>
                <li>• Listings remain active for 30 days</li>
              </ul>
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
                    <h4 className="font-medium text-black">Photos won't upload</h4>
                    <p className="text-sm text-gray-600">Check file size (max 5MB) and format (JPG, PNG, WebP)</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-black">Form won't submit</h4>
                    <p className="text-sm text-gray-600">Ensure all required fields are completed and try refreshing the page</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-black">Listing not appearing</h4>
                    <p className="text-sm text-gray-600">Check your membership status and ensure the listing was published successfully</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Support */}
          <section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">Need More Help?</h2>
            <p className="text-blue-100 mb-6">
              If you're having trouble posting your listing, our support team is here to help.
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