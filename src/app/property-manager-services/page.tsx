export default function PropertyManagerServices() {
  return (
    <div className="bg-white min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-black mb-4">Property Manager Services</h1>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Streamline your property management operations with our comprehensive platform. 
            Find qualified tenants, manage your portfolio, and grow your business efficiently.
          </p>
        </div>

        {/* Hero Section */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 text-white mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold mb-4">Transform Your Property Management</h2>
              <p className="text-green-100 mb-6">
                Join leading property management companies who trust our platform to find qualified tenants, 
                manage their portfolios, and maximize their rental income.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-white text-green-600 py-3 px-6 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  Start Free Trial
                </button>
                <button className="border-2 border-white text-white py-3 px-6 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors">
                  Schedule Demo
                </button>
              </div>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <p className="text-green-100 text-sm">Trusted by 500+ Property Managers</p>
            </div>
          </div>
        </div>

        {/* Key Features */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-black mb-6 text-center">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-black mb-2">Tenant Screening</h3>
              <p className="text-gray-600">
                Comprehensive background checks, credit reports, and rental history verification to ensure you find the best tenants.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-black mb-2">Portfolio Analytics</h3>
              <p className="text-gray-600">
                Detailed reports on occupancy rates, rental income, market trends, and property performance to optimize your portfolio.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6m-6 0l-6 6m6-6l6 6m-6 6v4a2 2 0 002 2h4a2 2 0 002-2v-4m-6 0h6m-6 0l-6-6m6 6l6-6" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-black mb-2">Bulk Management</h3>
              <p className="text-gray-600">
                Manage multiple properties efficiently with bulk listing tools, automated workflows, and centralized communication.
              </p>
            </div>
          </div>
        </div>

        {/* Services Breakdown */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-black mb-6 text-center">Comprehensive Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="border-l-4 border-blue-500 pl-6">
                <h3 className="text-lg font-semibold text-black mb-2">Lead Generation & Marketing</h3>
                <ul className="text-gray-600 space-y-2">
                  <li>• Featured property listings on our platform</li>
                  <li>• Social media marketing campaigns</li>
                  <li>• Email marketing to qualified leads</li>
                  <li>• SEO-optimized property pages</li>
                </ul>
              </div>

              <div className="border-l-4 border-green-500 pl-6">
                <h3 className="text-lg font-semibold text-black mb-2">Tenant Management</h3>
                <ul className="text-gray-600 space-y-2">
                  <li>• Comprehensive tenant screening</li>
                  <li>• Application processing automation</li>
                  <li>• Lease agreement templates</li>
                  <li>• Tenant communication portal</li>
                </ul>
              </div>

              <div className="border-l-4 border-purple-500 pl-6">
                <h3 className="text-lg font-semibold text-black mb-2">Financial Management</h3>
                <ul className="text-gray-600 space-y-2">
                  <li>• Rent collection and tracking</li>
                  <li>• Expense management and reporting</li>
                  <li>• Financial performance analytics</li>
                  <li>• Tax preparation assistance</li>
                </ul>
              </div>
            </div>

            <div className="space-y-6">
              <div className="border-l-4 border-orange-500 pl-6">
                <h3 className="text-lg font-semibold text-black mb-2">Maintenance & Repairs</h3>
                <ul className="text-gray-600 space-y-2">
                  <li>• Maintenance request tracking</li>
                  <li>• Vendor management system</li>
                  <li>• Emergency response coordination</li>
                  <li>• Property inspection scheduling</li>
                </ul>
              </div>

              <div className="border-l-4 border-teal-500 pl-6">
                <h3 className="text-lg font-semibold text-black mb-2">Legal & Compliance</h3>
                <ul className="text-gray-600 space-y-2">
                  <li>• Lease agreement compliance</li>
                  <li>• Eviction process support</li>
                  <li>• Legal document templates</li>
                  <li>• Regulatory compliance monitoring</li>
                </ul>
              </div>

              <div className="border-l-4 border-red-500 pl-6">
                <h3 className="text-lg font-semibold text-black mb-2">Reporting & Analytics</h3>
                <ul className="text-gray-600 space-y-2">
                  <li>• Occupancy rate tracking</li>
                  <li>• Rental income analysis</li>
                  <li>• Market trend reports</li>
                  <li>• Performance benchmarking</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Plans */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-black mb-6 text-center">Pricing Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-black mb-2">Starter</h3>
              <p className="text-gray-600 mb-4">For small property managers</p>
              <div className="text-3xl font-bold text-black mb-6">$29.99<span className="text-lg text-gray-600">/month</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-700">
                  <svg className="w-5 h-5 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Up to 10 properties
                </li>
                <li className="flex items-center text-gray-700">
                  <svg className="w-5 h-5 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Basic tenant screening
                </li>
                <li className="flex items-center text-gray-700">
                  <svg className="w-5 h-5 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Email support
                </li>
              </ul>
              <button className="w-full bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-700 transition-colors">
                Get Started
              </button>
            </div>

            <div className="bg-white border-2 border-blue-500 rounded-2xl p-8 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                Most Popular
              </div>
              <h3 className="text-xl font-bold text-black mb-2">Professional</h3>
              <p className="text-gray-600 mb-4">For growing property managers</p>
              <div className="text-3xl font-bold text-black mb-6">$79.99<span className="text-lg text-gray-600">/month</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-700">
                  <svg className="w-5 h-5 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Up to 50 properties
                </li>
                <li className="flex items-center text-gray-700">
                  <svg className="w-5 h-5 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Advanced tenant screening
                </li>
                <li className="flex items-center text-gray-700">
                  <svg className="w-5 h-5 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Priority support
                </li>
                <li className="flex items-center text-gray-700">
                  <svg className="w-5 h-5 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Analytics & reporting
                </li>
              </ul>
              <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                Get Started
              </button>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-black mb-2">Enterprise</h3>
              <p className="text-gray-600 mb-4">For large property companies</p>
              <div className="text-3xl font-bold text-black mb-6">$199.99<span className="text-lg text-gray-600">/month</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-700">
                  <svg className="w-5 h-5 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Unlimited properties
                </li>
                <li className="flex items-center text-gray-700">
                  <svg className="w-5 h-5 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Dedicated account manager
                </li>
                <li className="flex items-center text-gray-700">
                  <svg className="w-5 h-5 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  24/7 phone support
                </li>
                <li className="flex items-center text-gray-700">
                  <svg className="w-5 h-5 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Custom integrations
                </li>
              </ul>
              <button className="w-full bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-700 transition-colors">
                Contact Sales
              </button>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Transform Your Property Management?</h2>
          <p className="text-green-100 mb-6 max-w-2xl mx-auto">
            Join hundreds of property managers who have streamlined their operations and increased their rental income with our platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-green-600 py-3 px-8 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Start Free Trial
            </button>
            <button className="border-2 border-white text-white py-3 px-8 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors">
              Schedule Demo
            </button>
          </div>
          <div className="mt-6 text-green-100">
            <p><strong>Email:</strong> squareone.rental@gmail.com</p>
            <p><strong>Phone:</strong> (905) 555-0123</p>
            <p><strong>Business Hours:</strong> Mon-Fri: 9am-7pm EST</p>
          </div>
        </div>
      </div>
    </div>
  );
} 