export default function LandlordGuide() {
  return (
    <div className="bg-white min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-black mb-6">Landlord Guide</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to know about listing and managing your rental properties 
            on Square One Rentals in Mississauga.
          </p>
        </div>

        {/* Getting Started Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-black mb-6">Getting Started</h2>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">Create Your Account</h3>
            <p className="text-blue-800 mb-4">
              Start by creating a free account on Square One Rentals. Our onboarding survey 
              helps us understand your needs and personalize your experience.
            </p>
            <ul className="text-blue-800 space-y-2">
              <li>• Quick signup process</li>
              <li>• Personalized onboarding survey</li>
              <li>• Access to your dashboard</li>
            </ul>
          </div>
        </section>

        {/* Listing Your Property Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-black mb-6">Listing Your Property</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-900 mb-3">Basic Requirements</h3>
              <ul className="text-green-800 space-y-2">
                <li>• At least one high-quality photo (required)</li>
                <li>• Detailed property description</li>
                <li>• Accurate pricing information</li>
                <li>• Contact information</li>
              </ul>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-purple-900 mb-3">Photo Guidelines</h3>
              <ul className="text-purple-800 space-y-2">
                <li>• Minimum 1 image required</li>
                <li>• Maximum 10 images allowed</li>
                <li>• High resolution, well-lit photos</li>
                <li>• Show key features and rooms</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Membership Plans Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-black mb-6">Membership Plans</h2>
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">Choose Your Plan</h3>
            <p className="text-blue-800 mb-4">
              We offer flexible membership options to suit your needs. Visit our 
              <a href="/memberships" className="text-blue-600 hover:text-blue-800 font-semibold"> Membership Plans</a> page for detailed pricing and features.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900">Basic Plan</h4>
                <p className="text-blue-700 text-sm">Essential features for individual landlords</p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900">Featured Plan</h4>
                <p className="text-blue-700 text-sm">Enhanced visibility and priority placement</p>
              </div>
            </div>
          </div>
        </section>

        {/* Property Management Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-black mb-6">Property Management</h2>
          <div className="space-y-6">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Managing Your Listings</h3>
              <ul className="text-gray-700 space-y-2">
                <li>• Edit property details anytime</li>
                <li>• Update photos and descriptions</li>
                <li>• Adjust pricing and availability</li>
                <li>• Monitor inquiry responses</li>
              </ul>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Tenant Communication</h3>
              <ul className="text-gray-700 space-y-2">
                <li>• In-platform messaging system</li>
                <li>• Notification preferences</li>
                <li>• Quick response templates</li>
                <li>• Inquiry management tools</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Business Services Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-black mb-6">Additional Services</h2>
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-green-900 mb-3">Professional Support</h3>
            <p className="text-green-800 mb-4">
              Need help managing multiple properties or want professional assistance? 
              Check out our <a href="/property-manager-services" className="text-green-600 hover:text-green-800 font-semibold">Business Services</a> for property managers and bulk listing options.
            </p>
            <ul className="text-green-800 space-y-2">
              <li>• Bulk listing management</li>
              <li>• Professional photography services</li>
              <li>• Tenant screening assistance</li>
              <li>• Dedicated account support</li>
            </ul>
          </div>
        </section>

        {/* Legal & Compliance Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-black mb-6">Legal & Compliance</h2>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-yellow-900 mb-3">Important Information</h3>
            <p className="text-yellow-800 mb-4">
              As a landlord, you're responsible for understanding and complying with 
              Ontario rental laws and regulations.
            </p>
            <ul className="text-yellow-800 space-y-2">
              <li>• Familiarize yourself with the Residential Tenancies Act</li>
              <li>• Understand your rights and responsibilities</li>
              <li>• Keep proper documentation and records</li>
              <li>• Consider consulting with legal professionals</li>
            </ul>
          </div>
        </section>

        {/* Help & Support Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-black mb-6">Help & Support</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">Resources</h3>
              <ul className="text-blue-800 space-y-2">
                <li>• <a href="/help-center" className="text-blue-600 hover:text-blue-800">Help Center</a></li>
                <li>• <a href="/faq" className="text-blue-600 hover:text-blue-800">Frequently Asked Questions</a></li>
                <li>• <a href="/rental-calculator" className="text-blue-600 hover:text-blue-800">Rental Calculator</a></li>
                <li>• <a href="/market-insights" className="text-blue-600 hover:text-blue-800">Market Insights</a></li>
              </ul>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-900 mb-3">Contact Support</h3>
              <ul className="text-green-800 space-y-2">
                <li>• Email: squareone.rental@gmail.com</li>
                <li>• Business Hours: Mon-Fri 9am-7pm EST</li>
                <li>• Weekend Support: Sat-Sun 9am-5pm EST</li>
                <li>• <a href="/feedback" className="text-green-600 hover:text-green-800">Feedback Form</a></li>
              </ul>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4">Ready to List Your Property?</h2>
          <p className="text-blue-100 mb-6">
            Join Square One Rentals today and connect with qualified tenants in the Mississauga area.
          </p>
          <div className="space-x-4">
            <a 
              href="/submit" 
              className="inline-block bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Submit Your Listing
            </a>
            <a 
              href="/memberships" 
              className="inline-block bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              View Plans
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
