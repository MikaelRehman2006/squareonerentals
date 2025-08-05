export default function HelpCenter() {
  return (
    <div className="bg-white min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-black mb-4">Help Center</h1>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Find step-by-step guides, tutorials, and helpful resources to make the most of Square One Rentals.
          </p>
        </div>

        {/* Search Section */}
        <div className="mb-12">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for help articles..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Start Guide */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-black mb-6">Quick Start Guide</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                <span className="text-white font-bold text-lg">1</span>
              </div>
              <h3 className="text-lg font-semibold text-black mb-2">Create Your Account</h3>
              <p className="text-gray-600 mb-4">
                Sign up with your email or Google account to get started with Square One Rentals.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Click "Sign Up" in the top navigation</li>
                <li>• Choose email or Google authentication</li>
                <li>• Complete your profile information</li>
                <li>• Verify your email address</li>
              </ul>
            </div>

            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                <span className="text-white font-bold text-lg">2</span>
              </div>
              <h3 className="text-lg font-semibold text-black mb-2">Choose Your Plan</h3>
              <p className="text-gray-600 mb-4">
                Select a membership plan that fits your needs and budget.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Browse available membership plans</li>
                <li>• Compare features and pricing</li>
                <li>• Choose Basic or Featured membership</li>
                <li>• Complete secure payment with Stripe</li>
              </ul>
            </div>

            <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                <span className="text-white font-bold text-lg">3</span>
              </div>
              <h3 className="text-lg font-semibold text-black mb-2">Start Using the Platform</h3>
              <p className="text-gray-600 mb-4">
                Begin browsing listings or posting your own properties.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Browse available rental listings</li>
                <li>• Use filters to find your perfect home</li>
                <li>• Contact landlords or post your listing</li>
                <li>• Save favorites and manage your account</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Tutorial Categories */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-black mb-6">Tutorials & Guides</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* For Renters */}
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h3 className="text-xl font-semibold text-black mb-4">For Renters</h3>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-medium text-black mb-2">Finding Your Perfect Home</h4>
                  <p className="text-gray-600 text-sm">
                    Learn how to search listings, use filters, and contact landlords effectively.
                  </p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-medium text-black mb-2">Managing Your Account</h4>
                  <p className="text-gray-600 text-sm">
                    How to save favorites, update preferences, and manage notifications.
                  </p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <h4 className="font-medium text-black mb-2">Contacting Landlords</h4>
                  <p className="text-gray-600 text-sm">
                    Best practices for reaching out to property owners and scheduling viewings.
                  </p>
                </div>
              </div>
            </div>

            {/* For Landlords */}
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h3 className="text-xl font-semibold text-black mb-4">For Landlords</h3>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-medium text-black mb-2">Creating Effective Listings</h4>
                  <p className="text-gray-600 text-sm">
                    Tips for writing compelling descriptions and taking great photos.
                  </p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-medium text-black mb-2">Managing Your Properties</h4>
                  <p className="text-gray-600 text-sm">
                    How to update listings, respond to inquiries, and track performance.
                  </p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <h4 className="font-medium text-black mb-2">Finding Quality Tenants</h4>
                  <p className="text-gray-600 text-sm">
                    Strategies for attracting and screening potential renters.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Common Tasks */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-black mb-6">Common Tasks</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-black mb-2">How to Post a Listing</h3>
              <p className="text-gray-600 text-sm mb-3">
                Step-by-step guide to creating and publishing your rental listing.
              </p>
              <a href="/help-center/post-listing" className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-block">
                Read Guide →
              </a>
            </div>

            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-black mb-2">Using Search Filters</h3>
              <p className="text-gray-600 text-sm mb-3">
                Learn how to use price, location, and amenity filters effectively.
              </p>
              <a href="/help-center/search-filters" className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-block">
                Read Guide →
              </a>
            </div>

            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-black mb-2">Managing Notifications</h3>
              <p className="text-gray-600 text-sm mb-3">
                How to customize your notification preferences and stay updated.
              </p>
              <a href="/help-center/notifications" className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-block">
                Read Guide →
              </a>
            </div>

            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-black mb-2">Payment & Billing</h3>
              <p className="text-gray-600 text-sm mb-3">
                Understanding your membership charges and payment methods.
              </p>
              <a href="/help-center/payment-billing" className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-block">
                Read Guide →
              </a>
            </div>

            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-black mb-2">Account Security</h3>
              <p className="text-gray-600 text-sm mb-3">
                Best practices for keeping your account safe and secure.
              </p>
              <a href="/help-center/account-security" className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-block">
                Read Guide →
              </a>
            </div>

            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-black mb-2">Contacting Landlords</h3>
              <p className="text-gray-600 text-sm mb-3">
                Best practices for reaching out to property owners and scheduling viewings.
              </p>
              <a href="/help-center/contacting-landlords" className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-block">
                Read Guide →
              </a>
            </div>
          </div>
        </div>

        {/* Video Tutorials */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-black mb-6">Video Tutorials</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-100 rounded-lg p-6">
              <div className="w-full h-48 bg-gray-300 rounded-lg mb-4 flex items-center justify-center">
                <svg className="w-16 h-16 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
              <h3 className="font-semibold text-black mb-2">Getting Started with Square One Rentals</h3>
              <p className="text-gray-600 text-sm">Learn the basics of creating an account and navigating the platform.</p>
            </div>

            <div className="bg-gray-100 rounded-lg p-6">
              <div className="w-full h-48 bg-gray-300 rounded-lg mb-4 flex items-center justify-center">
                <svg className="w-16 h-16 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
              <h3 className="font-semibold text-black mb-2">How to Post Your First Listing</h3>
              <p className="text-gray-600 text-sm">Step-by-step guide to creating and publishing a rental listing.</p>
            </div>
          </div>
        </div>

        {/* Contact Support */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Still Need Help?</h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Can't find what you're looking for? Our support team is here to help you get the most out of Square One Rentals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/contact" className="bg-white text-blue-600 py-3 px-8 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block">
              Contact Support
            </a>
            <a href="/report-issue" className="border-2 border-white text-white py-3 px-8 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors inline-block">
              Report an Issue
            </a>
          </div>
          <div className="mt-6 text-blue-100">
            <p><strong>Email:</strong> squareone.rental@gmail.com</p>
            <p><strong>Business Hours:</strong> Mon-Fri: 9am-7pm EST, Sat-Sun: 9am-5pm EST</p>
            <p><strong>Response Time:</strong> We aim to respond within 24 hours</p>
          </div>
        </div>
      </div>
    </div>
  );
} 