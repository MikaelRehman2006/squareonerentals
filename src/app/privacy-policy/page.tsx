export default function PrivacyPolicy() {
  return (
    <div className="bg-white min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-4">Privacy Policy</h1>
          <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="space-y-8 text-black">
          <section>
            <h2 className="text-xl font-semibold text-black mb-3">1. Introduction</h2>
            <p className="text-gray-700 mb-4">
              Square One Rentals ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our rental platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-black mb-3">2. Information We Collect</h2>
            
            <h3 className="text-lg font-medium text-black mb-2">2.1 Personal Information</h3>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li>Contact information (name, email address, phone number)</li>
              <li>Account credentials and authentication data</li>
              <li>Property preferences and search criteria</li>
              <li>Survey responses and user preferences</li>
              <li>Communication history and messages</li>
              <li>Payment session IDs (processed securely by Stripe - we do not collect actual payment details)</li>
            </ul>

            <h3 className="text-lg font-medium text-black mb-2">2.2 Automatically Collected Information</h3>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li>Device information (IP address, browser type, operating system)</li>
              <li>Usage data (pages visited, time spent, interactions)</li>
              <li>Session information and authentication tokens</li>
              <li>Error logs and performance data</li>
            </ul>

            <h3 className="text-lg font-medium text-black mb-2">2.3 Browser Storage</h3>
            <p className="text-gray-700 mb-4">
              We use browser localStorage to store:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li>Survey progress and responses</li>
              <li>User notification preferences</li>
              <li>Payment session IDs (not actual payment details)</li>
              <li>Onboarding completion status</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-black mb-3">3. How We Use Your Information</h2>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li>Provide and maintain our rental platform services</li>
              <li>Match renters with appropriate properties and landlords</li>
              <li>Send notifications about listings, messages, and platform updates</li>
              <li>Process payments and manage subscriptions</li>
              <li>Improve our services and user experience</li>
              <li>Communicate with you about your account and services</li>
              <li>Prevent fraud and ensure platform security</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-black mb-3">4. Information Sharing and Disclosure</h2>
            
            <h3 className="text-lg font-medium text-black mb-2">4.1 With Your Consent</h3>
            <p className="text-gray-700 mb-4">
              We may share your information with realtors and property managers when both parties meet each other's requirements, as outlined in our Terms and Conditions.
            </p>

            <h3 className="text-lg font-medium text-black mb-2">4.2 Service Providers</h3>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Stripe:</strong> Payment processing and subscription management (we do not collect or store your payment details - Stripe handles all payment information securely)</li>
              <li><strong>SendGrid:</strong> Email delivery and communication</li>
              <li><strong>NextAuth:</strong> Authentication and session management</li>
              <li><strong>MongoDB:</strong> Data storage and database services</li>
            </ul>

            <h3 className="text-lg font-medium text-black mb-2">4.3 Legal Requirements</h3>
            <p className="text-gray-700 mb-4">
              We may disclose your information if required by law, court order, or government request, or to protect our rights, property, or safety.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-black mb-3">5. Data Security</h2>
            <p className="text-gray-700 mb-4">
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-black mb-3">6. Your Rights and Choices</h2>
            
            <h3 className="text-lg font-medium text-black mb-2">6.1 Access and Control</h3>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li>Access your personal information through your account settings</li>
              <li>Update or correct your information</li>
              <li>Delete your account and associated data</li>
              <li>Export your data in a portable format</li>
            </ul>

            <h3 className="text-lg font-medium text-black mb-2">6.2 Communication Preferences</h3>
            <p className="text-gray-700 mb-4">
              You can control your notification preferences through your account settings. You may opt out of marketing communications at any time.
            </p>

            <h3 className="text-lg font-medium text-black mb-2">6.3 Browser Storage</h3>
            <p className="text-gray-700 mb-4">
              You can clear localStorage data by clearing your browser data or logging out of your account. This will remove saved preferences and progress.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-black mb-3">7. Data Retention</h2>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li>Account data: Retained while your account is active</li>
              <li>Survey data: Stored until account deletion or manual clearing</li>
              <li>Payment data: Retained as required by financial regulations</li>
              <li>Communication logs: Stored for customer service purposes</li>
              <li>Browser storage: Cleared when you log out or clear browser data</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-black mb-3">8. Children's Privacy</h2>
            <p className="text-gray-700 mb-4">
              Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-black mb-3">9. International Data Transfers</h2>
            <p className="text-gray-700 mb-4">
              Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your data.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-black mb-3">10. Changes to This Policy</h2>
            <p className="text-gray-700 mb-4">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-black mb-3">11. Contact Us</h2>
            <p className="text-gray-700 mb-4">
              If you have questions about this Privacy Policy or our data practices, please contact us at:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">
                <strong>Email:</strong> squareone.rental@gmail.com<br/>
                <strong>Business Hours:</strong> Mon-Fri: 9am-7pm EST, Sat-Sun: 9am-5pm EST
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
} 