export default function PaymentBillingGuide() {
  return (
    <div className="bg-white min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <a href="/help-center" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← Back to Help Center
          </a>
          <h1 className="text-3xl font-bold text-black mb-4">Payment & Billing</h1>
          <p className="text-gray-600">Understanding your membership charges and payment methods on Square One Rentals.</p>
        </div>

        <div className="space-y-8">
          {/* Overview */}
          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">Overview</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <p className="text-gray-700 mb-4">
                Square One Rentals uses Stripe for secure payment processing. We never collect or store your payment information directly - 
                Stripe handles all payment details with bank-level encryption and PCI compliance.
              </p>
              <p className="text-gray-700">
                <strong>Security:</strong> All payments are processed securely through Stripe, the world's most trusted payment platform.
              </p>
            </div>
          </section>

          {/* Membership Plans */}
          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">Membership Plans</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-black mb-3">Basic Membership</h3>
                <p className="text-2xl font-bold text-blue-600 mb-2">$4.99/month</p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Facebook listing (standard)</li>
                  <li>• Website listing (standard)</li>
                  <li>• Standard email support</li>
                  <li>• 30 days active visibility</li>
                  <li>• 10MB storage cap</li>
                </ul>
              </div>
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-black mb-3">Featured Membership</h3>
                <p className="text-2xl font-bold text-blue-600 mb-2">$9.99/month</p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Facebook listing (featured)</li>
                  <li>• Website listing (featured)</li>
                  <li>• Priority email support</li>
                  <li>• 30 days active visibility</li>
                  <li>• 25MB storage cap</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Payment Methods */}
          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">Payment Methods</h2>
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="font-semibold text-black mb-3">Accepted Payment Methods:</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Credit Cards (Visa, Mastercard, American Express)</li>
                  <li>• Debit Cards</li>
                  <li>• Digital Wallets (Apple Pay, Google Pay)</li>
                  <li>• Bank Transfers (in select regions)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Billing Cycle */}
          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">Billing Cycle</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">1</div>
                <div>
                  <p className="text-gray-700">Understanding your billing cycle:</p>
                  <div className="mt-3 space-y-2">
                    <div className="bg-gray-100 rounded-lg p-4">
                      <h4 className="font-semibold text-black mb-2">Billing Details:</h4>
                      <ul className="space-y-1 text-sm text-gray-700">
                        <li>• Subscriptions auto-renew monthly</li>
                        <li>• Billing occurs on the same date each month</li>
                        <li>• You'll receive email confirmation for each charge</li>
                        <li>• Failed payments will result in service suspension</li>
                        <li>• You can cancel anytime from your dashboard</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Managing Subscriptions */}
          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">Managing Your Subscription</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">2</div>
                <div>
                  <p className="text-gray-700">How to manage your membership:</p>
                  <div className="mt-3 space-y-4">
                    <div className="bg-gray-100 rounded-lg p-4">
                      <h4 className="font-semibold text-black mb-2">Access Subscription Management:</h4>
                      <ul className="space-y-1 text-sm text-gray-700">
                        <li>• Go to your dashboard</li>
                        <li>• Click on "Subscription" in the navigation</li>
                        <li>• Click "Manage Subscription"</li>
                        <li>• This will redirect you to Stripe's secure portal</li>
                      </ul>
                    </div>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <h4 className="font-semibold text-black mb-2">Available Actions:</h4>
                      <ul className="space-y-1 text-sm text-gray-700">
                        <li>• Cancel your subscription</li>
                        <li>• Update payment method</li>
                        <li>• View billing history</li>
                        <li>• Download invoices</li>
                        <li>• Change subscription plan</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Security */}
          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">Payment Security</h2>
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-semibold text-black mb-3">Security Features:</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• <strong>PCI Compliance:</strong> Stripe maintains the highest level of PCI compliance</li>
                  <li>• <strong>Encryption:</strong> All payment data is encrypted in transit and at rest</li>
                  <li>• <strong>No Storage:</strong> We never see or store your actual payment details</li>
                  <li>• <strong>Fraud Protection:</strong> Advanced fraud detection systems</li>
                  <li>• <strong>Secure Processing:</strong> Bank-level security standards</li>
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
                    <h4 className="font-medium text-black">Payment declined</h4>
                    <p className="text-sm text-gray-600">Check with your bank, ensure sufficient funds, and verify card details</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-black">Subscription not working</h4>
                    <p className="text-sm text-gray-600">Check your email for payment confirmation and contact support if needed</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-black">Can't access billing</h4>
                    <p className="text-sm text-gray-600">Try logging out and back in, or contact support for assistance</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Support */}
          <section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">Need More Help?</h2>
            <p className="text-blue-100 mb-6">
              If you're having trouble with payments or billing, our support team is here to help.
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