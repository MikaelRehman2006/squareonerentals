export default function FAQ() {
  return (
    <div className="bg-white min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-4">Frequently Asked Questions</h1>
          <p className="text-gray-600">Find answers to common questions about Square One Rentals</p>
        </div>

        <div className="space-y-6">
          {/* General Questions */}
          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">General Questions</h2>
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-medium text-black mb-2">What is Square One Rentals?</h3>
                <p className="text-gray-700">
                  Square One Rentals is a platform that connects renters with property owners in the Square One area of Mississauga. We make the rental process simple and efficient by providing a centralized location for listings and connections.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-medium text-black mb-2">How do I create an account?</h3>
                <p className="text-gray-700">
                  You can create an account by clicking "Sign Up" in the top navigation. You can sign up with your email address or use Google authentication for a faster process.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-medium text-black mb-2">Is Square One Rentals free to use?</h3>
                <p className="text-gray-700">
                  Browsing listings and creating an account is completely free. However, to post listings and access premium features, you'll need a membership plan starting at $4.99/month.
                </p>
              </div>
            </div>
          </section>

          {/* Membership & Billing */}
          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">Membership & Billing</h2>
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-medium text-black mb-2">What's included in a Basic Membership?</h3>
                <p className="text-gray-700">
                  Basic membership includes Facebook listing (standard), website listing (standard), standard email support, 30 days of active visibility, 10MB storage cap, and access to find realtors and other realtor services.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-medium text-black mb-2">What's included in a Featured Membership?</h3>
                <p className="text-gray-700">
                  Featured membership includes Facebook listing (featured), website listing (featured), priority email support, 30 days of active visibility, 25MB storage cap, and access to more realtor services.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-medium text-black mb-2">How do subscriptions work?</h3>
                <p className="text-gray-700">
                  Subscriptions auto-renew at the end of your billing period (monthly or annually) until canceled. You can manage your subscription at any time through your dashboard.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-medium text-black mb-2">Can I cancel my membership?</h3>
                <p className="text-gray-700">
                  Yes, you can cancel your membership at any time from your dashboard by navigating to Subscription and clicking 'Manage Subscription'. This will take you to the Stripe portal where you can cancel your subscription.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-medium text-black mb-2">Is my payment information secure?</h3>
                <p className="text-gray-700">
                  Yes! We use Stripe, the world's most trusted payment platform, to process all payments. We never collect or store your payment information directly - Stripe handles all payment details securely with bank-level encryption and PCI compliance.
                </p>
              </div>
            </div>
          </section>

          {/* Listings */}
          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">Listings & Properties</h2>
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-medium text-black mb-2">How do I post a listing?</h3>
                <p className="text-gray-700">
                  To post a listing, you need an active membership. Then click "Submit Listing" in the navigation and fill out the property details form. Make sure to include accurate information and high-quality photos.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-medium text-black mb-2">How long do listings stay active?</h3>
                <p className="text-gray-700">
                  Listings remain active for 30 days from the posting date. You can renew them before they expire to keep them visible to potential renters.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-medium text-black mb-2">Can I edit my listing after posting?</h3>
                <p className="text-gray-700">
                  Yes, you can edit your listings at any time through your dashboard. Go to "Manage Listings" to update property details, photos, or pricing.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-medium text-black mb-2">What information should I include in my listing?</h3>
                <p className="text-gray-700">
                  Include accurate property details, clear photos, accurate pricing, available move-in date, amenities, and contact information. The more detailed your listing, the more likely you are to find qualified renters.
                </p>
              </div>
            </div>
          </section>

          {/* Communication */}
          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">Communication & Support</h2>
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-medium text-black mb-2">How do I contact a landlord or renter?</h3>
                <p className="text-gray-700">
                  You can contact landlords or renters through the contact information provided in their listings. We also have a messaging system for secure communication between parties.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-medium text-black mb-2">What if I have a problem with a listing?</h3>
                <p className="text-gray-700">
                  If you encounter issues with a listing (false information, inappropriate content, etc.), you can report it using the "Report" button on the listing page. We review all reports within 24-48 hours.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-medium text-black mb-2">How do I get customer support?</h3>
                <p className="text-gray-700">
                  You can contact our support team at squareone.rental@gmail.com. Basic members receive standard email support, while Featured members get priority support with faster response times.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-medium text-black mb-2">What are your business hours?</h3>
                <p className="text-gray-700">
                  Our support team is available Monday-Friday 9am-7pm EST and Saturday-Sunday 9am-5pm EST. We aim to respond to all inquiries within 24 hours.
                </p>
              </div>
            </div>
          </section>

          {/* Technical */}
          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">Technical Support</h2>
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-medium text-black mb-2">I can't log into my account</h3>
                <p className="text-gray-700">
                  Try resetting your password using the "Forgot Password" link on the login page. If you're still having issues, contact our support team with your email address.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-medium text-black mb-2">The website isn't loading properly</h3>
                <p className="text-gray-700">
                  Try clearing your browser cache and cookies, or try accessing the site from a different browser. If the problem persists, contact our support team.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-medium text-black mb-2">I can't upload photos to my listing</h3>
                <p className="text-gray-700">
                  Make sure your photos are in JPG, PNG, or WebP format and under 5MB each. If you're still having issues, try uploading one photo at a time or contact support.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-medium text-black mb-2">How do I manage my notifications?</h3>
                                 <p className="text-gray-700">
                   You can manage your notification preferences in your account settings. Go to Settings &gt; Notifications to customize which emails and alerts you receive.
                 </p>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">Still Need Help?</h2>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <p className="text-gray-700 mb-4">
                If you couldn't find the answer to your question here, please contact our support team:
              </p>
              <div className="space-y-2">
                <p className="text-gray-700">
                  <strong>Email:</strong> squareone.rental@gmail.com
                </p>
                <p className="text-gray-700">
                  <strong>Business Hours:</strong> Mon-Fri: 9am-7pm EST, Sat-Sun: 9am-5pm EST
                </p>
                <p className="text-gray-700">
                  <strong>Response Time:</strong> We aim to respond within 24 hours
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
} 