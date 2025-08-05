export default function NotificationsGuide() {
  return (
    <div className="bg-white min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <a href="/help-center" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← Back to Help Center
          </a>
          <h1 className="text-3xl font-bold text-black mb-4">Managing Notifications</h1>
          <p className="text-gray-600">Learn how to customize your notification preferences and stay updated with important information.</p>
        </div>

        <div className="space-y-8">
          {/* Overview */}
          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">Overview</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <p className="text-gray-700 mb-4">
                Square One Rentals sends notifications to keep you informed about important events, 
                new listings, inquiries, and account updates. You can customize which notifications you receive.
              </p>
              <p className="text-gray-700">
                <strong>Access:</strong> Notifications can be managed through your account settings and viewed in the notifications dropdown.
              </p>
            </div>
          </section>

          {/* Types of Notifications */}
          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">Types of Notifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-black mb-3">For Renters</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• New listings matching your criteria</li>
                  <li>• Price changes on saved listings</li>
                  <li>• Responses to your inquiries</li>
                  <li>• Account security alerts</li>
                  <li>• Membership updates</li>
                </ul>
              </div>
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-black mb-3">For Landlords</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• New inquiries on your listings</li>
                  <li>• Listing view notifications</li>
                  <li>• Account security alerts</li>
                  <li>• Membership renewal reminders</li>
                  <li>• Platform updates and announcements</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Accessing Notifications */}
          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">Accessing Your Notifications</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">1</div>
                <div>
                  <p className="text-gray-700">View notifications from the top navigation:</p>
                  <div className="mt-3 space-y-2">
                    <div className="bg-gray-100 rounded-lg p-4">
                      <h4 className="font-semibold text-black mb-2">How to Access:</h4>
                      <ul className="space-y-1 text-sm text-gray-700">
                        <li>• Click the bell icon in the top navigation bar</li>
                        <li>• View recent notifications in the dropdown</li>
                        <li>• Click "View All" to see all notifications</li>
                        <li>• Mark notifications as read by clicking on them</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Notification Settings */}
          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">Managing Notification Settings</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">2</div>
                <div>
                  <p className="text-gray-700">Customize your notification preferences:</p>
                  <div className="mt-3 space-y-4">
                    <div className="bg-gray-100 rounded-lg p-4">
                      <h4 className="font-semibold text-black mb-2">Email Notifications:</h4>
                      <ul className="space-y-1 text-sm text-gray-700">
                        <li>• New listing alerts</li>
                        <li>• Inquiry responses</li>
                        <li>• Account security alerts</li>
                        <li>• Membership updates</li>
                        <li>• Platform announcements</li>
                      </ul>
                    </div>
                    <div className="bg-gray-100 rounded-lg p-4">
                      <h4 className="font-semibold text-black mb-2">In-App Notifications:</h4>
                      <ul className="space-y-1 text-sm text-gray-700">
                        <li>• Real-time updates</li>
                        <li>• Instant messaging</li>
                        <li>• Status changes</li>
                        <li>• Quick actions</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Settings Page */}
          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">Notification Settings Page</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">3</div>
                <div>
                  <p className="text-gray-700">Access detailed notification settings:</p>
                  <div className="mt-3 space-y-2">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <h4 className="font-semibold text-black mb-2">How to Access Settings:</h4>
                      <ul className="space-y-1 text-sm text-gray-700">
                        <li>• Go to your account dashboard</li>
                        <li>• Click on "Settings" in the navigation</li>
                        <li>• Select "Notifications" tab</li>
                        <li>• Toggle individual notification types on/off</li>
                        <li>• Save your preferences</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Notification Actions */}
          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">Notification Actions</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-black mb-3">Mark as Read</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Click on any notification to mark it as read</li>
                    <li>• Use "Mark All as Read" to clear all notifications</li>
                    <li>• Read notifications will disappear from the unread count</li>
                  </ul>
                </div>
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-black mb-3">Quick Actions</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Reply to inquiries directly from notifications</li>
                    <li>• View listing details with one click</li>
                    <li>• Navigate to relevant pages quickly</li>
                    <li>• Delete unwanted notifications</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Mobile Notifications */}
          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">Mobile Notifications</h2>
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-semibold text-black mb-3">Mobile Experience:</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Notifications work the same on mobile devices</li>
                  <li>• Tap the bell icon to view notifications</li>
                  <li>• Swipe to mark notifications as read</li>
                  <li>• Access settings through the mobile menu</li>
                  <li>• Real-time updates on mobile browsers</li>
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
                    <h4 className="font-medium text-black">Not receiving notifications</h4>
                    <p className="text-sm text-gray-600">Check your notification settings and email spam folder</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-black">Too many notifications</h4>
                    <p className="text-sm text-gray-600">Customize your settings to reduce notification frequency</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-black">Notifications not updating</h4>
                    <p className="text-sm text-gray-600">Try refreshing the page or clearing your browser cache</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Support */}
          <section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">Need More Help?</h2>
            <p className="text-blue-100 mb-6">
              If you're having trouble with notifications, our support team is here to help.
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