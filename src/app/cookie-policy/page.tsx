export default function CookiePolicy() {
  return (
    <div className="bg-white min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-4">Cookie Policy</h1>
          <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="space-y-8 text-black">
          <section>
            <h2 className="text-xl font-semibold text-black mb-3">1. Introduction</h2>
            <p className="text-gray-700 mb-4">
              This Cookie Policy explains how Square One Rentals uses browser storage and similar technologies to enhance your experience on our platform. While we don't use traditional HTTP cookies, we do use browser storage mechanisms that serve similar purposes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-black mb-3">2. What Are Cookies and Browser Storage?</h2>
            <p className="text-gray-700 mb-4">
              <strong>Cookies</strong> are small text files stored on your device by websites. <strong>Browser storage</strong> (localStorage, sessionStorage) is a modern web technology that stores data directly in your browser.
            </p>
            <p className="text-gray-700 mb-4">
              We primarily use <strong>localStorage</strong> to store information that improves your experience on our platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-black mb-3">3. Types of Data Storage We Use</h2>
            
            <h3 className="text-lg font-medium text-black mb-2">3.1 Essential Storage (Always Active)</h3>
            <p className="text-gray-700 mb-4">
              These are necessary for the website to function properly:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Authentication Tokens:</strong> Keep you logged in during your session</li>
              <li><strong>Session Management:</strong> Track your active browsing session</li>
              <li><strong>Security Features:</strong> Prevent fraud and ensure account security</li>
              <li><strong>Payment Session Data:</strong> Store payment processing information temporarily</li>
            </ul>

            <h3 className="text-lg font-medium text-black mb-2">3.2 Functional Storage (Optional)</h3>
            <p className="text-gray-700 mb-4">
              These enhance your experience but are not essential:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Survey Progress:</strong> Save your responses while completing surveys</li>
              <li><strong>User Preferences:</strong> Remember your notification settings and preferences</li>
              <li><strong>Onboarding Status:</strong> Track whether you've completed the signup process</li>
              <li><strong>Form Data:</strong> Temporarily save form inputs to prevent data loss</li>
            </ul>

            <h3 className="text-lg font-medium text-black mb-2">3.3 Analytics and Performance</h3>
            <p className="text-gray-700 mb-4">
              We do not currently use analytics cookies or tracking technologies. We may implement these in the future to improve our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-black mb-3">4. How We Use Browser Storage</h2>
            
            <h3 className="text-lg font-medium text-black mb-2">4.1 localStorage Usage</h3>
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <p className="text-gray-700 font-mono text-sm">
                Examples of data we store in localStorage:
              </p>
              <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1">
                <li>Survey progress: <code>survey_progress_user@email.com</code></li>
                <li>Notification settings: <code>notificationSettings</code></li>
                <li>Payment sessions: <code>stripe_session_id</code></li>
                <li>Onboarding status: <code>onboarding_completed_user@email.com</code></li>
              </ul>
            </div>

            <h3 className="text-lg font-medium text-black mb-2">4.2 Session Management</h3>
            <p className="text-gray-700 mb-4">
              We use NextAuth.js for secure session management, which stores authentication tokens to keep you logged in and maintain your account security.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-black mb-3">5. Third-Party Services</h2>
            <p className="text-gray-700 mb-4">
              We use the following third-party services that may set their own cookies or storage:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Stripe:</strong> Payment processing (may set cookies for fraud prevention)</li>
              <li><strong>NextAuth:</strong> Authentication (uses secure session storage)</li>
              <li><strong>SendGrid:</strong> Email delivery (no cookies, server-side only)</li>
              <li><strong>MongoDB:</strong> Database (no cookies, server-side only)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-black mb-3">6. Managing Your Storage</h2>
            
            <h3 className="text-lg font-medium text-black mb-2">6.1 Browser Controls</h3>
            <p className="text-gray-700 mb-4">
              You can control browser storage through your browser settings:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Clear Browser Data:</strong> Remove all stored data for our site</li>
              <li><strong>Private/Incognito Mode:</strong> Browse without storing data</li>
              <li><strong>Browser Extensions:</strong> Use privacy extensions to manage storage</li>
            </ul>

            <h3 className="text-lg font-medium text-black mb-2">6.2 Account Controls</h3>
            <p className="text-gray-700 mb-4">
              Through your account settings, you can:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li>Update your notification preferences</li>
              <li>Clear your survey progress</li>
              <li>Log out to clear session data</li>
              <li>Delete your account to remove all stored data</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-black mb-3">7. Data Retention</h2>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Session Data:</strong> Cleared when you log out or close your browser</li>
              <li><strong>Survey Progress:</strong> Stored until you complete or clear the survey</li>
              <li><strong>User Preferences:</strong> Stored until you change them or clear browser data</li>
              <li><strong>Payment Sessions:</strong> Stored temporarily during payment processing</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-black mb-3">8. Your Rights</h2>
            <p className="text-gray-700 mb-4">
              Under applicable privacy laws, you have the right to:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li>Access information about what data we store</li>
              <li>Request deletion of your stored data</li>
              <li>Opt out of non-essential storage</li>
              <li>Control how your data is used</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-black mb-3">9. Updates to This Policy</h2>
            <p className="text-gray-700 mb-4">
              We may update this Cookie Policy as our practices change or as required by law. We will notify you of any material changes by posting the updated policy on this page.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-black mb-3">10. Contact Us</h2>
            <p className="text-gray-700 mb-4">
              If you have questions about our use of browser storage or this Cookie Policy, please contact us:
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