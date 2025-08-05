export default function ContactingLandlordsGuide() {
  return (
    <div className="bg-white min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <a href="/help-center" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← Back to Help Center
          </a>
          <h1 className="text-3xl font-bold text-black mb-4">Contacting Landlords</h1>
          <p className="text-gray-600">Best practices for reaching out to property owners and scheduling viewings.</p>
        </div>

        <div className="space-y-8">
          {/* Overview */}
          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">Overview</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <p className="text-gray-700 mb-4">
                Each listing on Square One Rentals includes contact information for the landlord or property manager. 
                This information is displayed on the listing page and typically includes email, phone number, and sometimes additional contact methods.
              </p>
              <p className="text-gray-700">
                <strong>Location:</strong> Contact information can be found on each individual listing page, usually in the "Contact Landlord" section.
              </p>
            </div>
          </section>

          {/* Finding Contact Information */}
          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">Finding Contact Information</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">1</div>
                <div>
                  <p className="text-gray-700">Locate contact information on listing pages:</p>
                  <div className="mt-3 space-y-2">
                    <div className="bg-gray-100 rounded-lg p-4">
                      <h4 className="font-semibold text-black mb-2">Where to Look:</h4>
                      <ul className="space-y-1 text-sm text-gray-700">
                        <li>• Click on any listing to view details</li>
                        <li>• Scroll down to find the "Contact Landlord" section</li>
                        <li>• Look for email, phone, and other contact methods</li>
                        <li>• Some listings may have additional contact forms</li>
                        <li>• Contact info is typically prominently displayed</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Methods */}
          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">Available Contact Methods</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-black mb-3">Email Contact</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Most common contact method</li>
                  <li>• Professional and documented</li>
                  <li>• Easy to attach documents</li>
                  <li>• Can include photos and details</li>
                  <li>• Good for initial inquiries</li>
                </ul>
              </div>
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-black mb-3">Phone Contact</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Direct and immediate response</li>
                  <li>• Good for urgent matters</li>
                  <li>• Can discuss details quickly</li>
                  <li>• Better for scheduling viewings</li>
                  <li>• More personal interaction</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Best Practices */}
          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">Best Practices</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">2</div>
                <div>
                  <p className="text-gray-700">Follow these guidelines for successful communication:</p>
                  <div className="mt-3 space-y-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h4 className="font-semibold text-black mb-2">Do's:</h4>
                      <ul className="space-y-1 text-sm text-gray-700">
                        <li>• Be professional and polite</li>
                        <li>• Include your name and contact information</li>
                        <li>• Mention the specific property address</li>
                        <li>• Ask about availability and viewing times</li>
                        <li>• Provide your move-in timeline</li>
                        <li>• Ask about application requirements</li>
                      </ul>
                    </div>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <h4 className="font-semibold text-black mb-2">Don'ts:</h4>
                      <ul className="space-y-1 text-sm text-gray-700">
                        <li>• Don't be overly casual or informal</li>
                        <li>• Don't send generic messages</li>
                        <li>• Don't ask for information already in the listing</li>
                        <li>• Don't be pushy or demanding</li>
                        <li>• Don't share personal information unnecessarily</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Sample Messages */}
          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">Sample Contact Messages</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-black mb-3">Email Template</h3>
                  <div className="bg-gray-50 p-4 rounded text-sm">
                    <p className="text-gray-700 mb-2">
                      <strong>Subject:</strong> Inquiry about [Property Address]
                    </p>
                    <p className="text-gray-700 mb-2">
                      Hi [Landlord Name],
                    </p>
                    <p className="text-gray-700 mb-2">
                      I'm interested in the [X-bedroom] property at [Address] listed on Square One Rentals. 
                      I'm looking to move in around [Date] and would like to schedule a viewing.
                    </p>
                    <p className="text-gray-700 mb-2">
                      Could you please let me know what times work best for you? I'm available [your availability].
                    </p>
                    <p className="text-gray-700 mb-2">
                      Thank you,<br/>
                      [Your Name]<br/>
                      [Your Phone Number]
                    </p>
                  </div>
                </div>
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-black mb-3">Phone Script</h3>
                  <div className="bg-gray-50 p-4 rounded text-sm">
                    <p className="text-gray-700 mb-2">
                      "Hi, my name is [Your Name]. I'm calling about the [X-bedroom] property at [Address] 
                      that I saw listed on Square One Rentals. I'm interested in scheduling a viewing."
                    </p>
                    <p className="text-gray-700 mb-2">
                      "I'm looking to move in around [Date]. What would be a good time to see the property?"
                    </p>
                    <p className="text-gray-700 mb-2">
                      "Could you also tell me about the application process and what documents I'll need?"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Scheduling Viewings */}
          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">Scheduling Viewings</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">3</div>
                <div>
                  <p className="text-gray-700">Tips for scheduling successful property viewings:</p>
                  <div className="mt-3 space-y-2">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <h4 className="font-semibold text-black mb-2">Viewing Tips:</h4>
                      <ul className="space-y-1 text-sm text-gray-700">
                        <li>• Be flexible with your schedule</li>
                        <li>• Confirm the viewing time and address</li>
                        <li>• Arrive 5-10 minutes early</li>
                        <li>• Bring a list of questions to ask</li>
                        <li>• Take photos if permitted</li>
                        <li>• Ask about utilities and maintenance</li>
                        <li>• Inquire about the application process</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Questions to Ask */}
          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">Questions to Ask</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-black mb-3">Property Questions</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• What's included in the rent?</li>
                    <li>• Are utilities included?</li>
                    <li>• What's the parking situation?</li>
                    <li>• Are pets allowed?</li>
                    <li>• What's the neighborhood like?</li>
                    <li>• How old is the building?</li>
                  </ul>
                </div>
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-black mb-3">Application Questions</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• What documents do I need?</li>
                    <li>• Is there an application fee?</li>
                    <li>• How long does approval take?</li>
                    <li>• What's the security deposit?</li>
                    <li>• When is rent due?</li>
                    <li>• What's the lease term?</li>
                  </ul>
                </div>
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
                    <h4 className="font-medium text-black">No response from landlord</h4>
                    <p className="text-sm text-gray-600">Try calling instead of emailing, or wait 24-48 hours before following up</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-black">Property already rented</h4>
                    <p className="text-sm text-gray-600">Ask if they have other similar properties available</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-black">Contact information not working</h4>
                    <p className="text-sm text-gray-600">Report the issue through the listing's "Report" button</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Support */}
          <section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">Need More Help?</h2>
            <p className="text-blue-100 mb-6">
              If you're having trouble contacting landlords, our support team is here to help.
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