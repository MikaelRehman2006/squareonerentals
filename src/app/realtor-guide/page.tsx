export default function RealtorGuide() {
  return (
    <div className="bg-white min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-black mb-6">Realtor Guide</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Professional real estate services and resources to help you grow your business 
            and serve your clients better on Square One Rentals.
          </p>
        </div>

        {/* Platform Overview Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-black mb-6">Platform Overview</h2>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">How Square One Rentals Works</h3>
            <p className="text-blue-800 mb-4">
              Our platform connects qualified renters with property owners in the Square One area of Mississauga. 
              As a realtor, you can leverage our tools to serve both landlords and tenants.
            </p>
            <ul className="text-blue-800 space-y-2">
              <li>• Connect with property owners looking to list</li>
              <li>• Help tenants find their perfect rental</li>
              <li>• Access market insights and analytics</li>
              <li>• Build your professional reputation</li>
            </ul>
          </div>
        </section>

        {/* Services for Realtors Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-black mb-6">Services for Realtors</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-900 mb-3">Property Listings</h3>
              <ul className="text-green-800 space-y-2">
                <li>• Professional listing creation</li>
                <li>• High-quality photo management</li>
                <li>• Detailed property descriptions</li>
                <li>• Market-competitive pricing</li>
              </ul>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-purple-900 mb-3">Client Services</h3>
              <ul className="text-purple-800 space-y-2">
                <li>• Tenant screening assistance</li>
                <li>• Application processing</li>
                <li>• Lease agreement support</li>
                <li>• Moving coordination</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Business Services Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-black mb-6">Professional Services</h2>
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-indigo-900 mb-3">Enhanced Business Solutions</h3>
            <p className="text-indigo-800 mb-4">
              Take advantage of our specialized <a href="/property-manager-services" className="text-indigo-600 hover:text-indigo-800 font-semibold">Business Services</a> designed for real estate professionals.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-semibold text-indigo-900">Lead Generation</h4>
                <p className="text-indigo-700 text-sm">Access qualified leads looking for rentals</p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-semibold text-indigo-900">Featured Placement</h4>
                <p className="text-indigo-700 text-sm">Priority listing placement and marketing</p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-semibold text-indigo-900">Market Insights</h4>
                <p className="text-indigo-700 text-sm">Competitive analysis and pricing data</p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-semibold text-indigo-900">Dedicated Support</h4>
                <p className="text-indigo-700 text-sm">Priority support and account management</p>
              </div>
            </div>
          </div>
        </section>

        {/* Working with Landlords Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-black mb-6">Working with Landlords</h2>
          <div className="space-y-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-yellow-900 mb-3">Listing Assistance</h3>
              <ul className="text-yellow-800 space-y-2">
                <li>• Help clients create compelling listings</li>
                <li>• Professional photography recommendations</li>
                <li>• Market analysis and pricing strategy</li>
                <li>• Listing optimization and updates</li>
              </ul>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-yellow-900 mb-3">Property Management</h3>
              <ul className="text-yellow-800 space-y-2">
                <li>• Tenant screening and selection</li>
                <li>• Lease agreement preparation</li>
                <li>• Property maintenance coordination</li>
                <li>• Ongoing landlord support</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Working with Tenants Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-black mb-6">Working with Tenants</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-900 mb-3">Rental Search</h3>
              <ul className="text-green-800 space-y-2">
                <li>• Property search and filtering</li>
                <li>• Neighborhood research</li>
                <li>• Property comparison tools</li>
                <li>• Application assistance</li>
              </ul>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-900 mb-3">Client Support</h3>
              <ul className="text-green-800 space-y-2">
                <li>• Rental application guidance</li>
                <li>• Negotiation support</li>
                <li>• Moving coordination</li>
                <li>• Post-move assistance</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Membership & Survey Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-black mb-6">Getting Started</h2>
          <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">Join Our Platform</h3>
            <p className="text-blue-800 mb-4">
              Start by creating your professional account. Our onboarding survey helps us understand 
              your business needs and personalize your experience.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900">Account Setup</h4>
                <ul className="text-blue-700 text-sm space-y-1">
                  <li>• Professional profile creation</li>
                  <li>• Onboarding survey completion</li>
                  <li>• Service preferences setup</li>
                </ul>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900">Membership Options</h4>
                <ul className="text-blue-700 text-sm space-y-1">
                  <li>• <a href="/memberships" className="text-blue-600 hover:text-blue-800">View Plans</a></li>
                  <li>• Basic and Featured options</li>
                  <li>• Professional features access</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Marketing & Networking Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-black mb-6">Marketing & Networking</h2>
          <div className="space-y-6">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Building Your Profile</h3>
              <ul className="text-gray-700 space-y-2">
                <li>• Professional bio and credentials</li>
                <li>• Client testimonials and reviews</li>
                <li>• Service area specialization</li>
                <li>• Contact information and availability</li>
              </ul>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Networking Opportunities</h3>
              <ul className="text-gray-700 space-y-2">
                <li>• Connect with other professionals</li>
                <li>• Join our Facebook community</li>
                <li>• Attend local events</li>
                <li>• Share market insights</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Resources & Support Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-black mb-6">Resources & Support</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">Professional Tools</h3>
              <ul className="text-blue-800 space-y-2">
                <li>• <a href="/rental-calculator" className="text-blue-600 hover:text-blue-800">Rental Calculator</a></li>
                <li>• <a href="/market-insights" className="text-blue-600 hover:text-blue-800">Market Insights</a></li>
                <li>• <a href="/help-center" className="text-blue-600 hover:text-blue-800">Help Center</a></li>
                <li>• <a href="/faq" className="text-blue-600 hover:text-blue-800">FAQ</a></li>
              </ul>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-900 mb-3">Contact & Support</h3>
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
        <section className="text-center bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4">Ready to Grow Your Business?</h2>
          <p className="text-green-100 mb-6">
            Join Square One Rentals as a professional realtor and start connecting with clients today.
          </p>
          <div className="space-x-4">
            <a 
              href="/signup" 
              className="inline-block bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Create Account
            </a>
            <a 
              href="/property-manager-services" 
              className="inline-block bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors"
            >
              View Services
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
