export default function AccountSecurityGuide() {
  return (
    <div className="bg-white min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <a href="/help-center" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← Back to Help Center
          </a>
          <h1 className="text-3xl font-bold text-black mb-4">Account Security</h1>
          <p className="text-gray-600">Best practices for keeping your Square One Rentals account safe and secure.</p>
        </div>

        <div className="space-y-8">
          {/* Overview */}
          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">Overview</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <p className="text-gray-700 mb-4">
                Your account security is our top priority. We use industry-standard security measures to protect your data, 
                but there are also steps you can take to keep your account safe.
              </p>
              <p className="text-gray-700">
                <strong>Security Features:</strong> We use NextAuth.js for secure authentication and encrypt all sensitive data.
              </p>
            </div>
          </section>

          {/* Password Security */}
          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">Password Security</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">1</div>
                <div>
                  <p className="text-gray-700">Create a strong password:</p>
                  <div className="mt-3 space-y-2">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h4 className="font-semibold text-black mb-2">Password Requirements:</h4>
                      <ul className="space-y-1 text-sm text-gray-700">
                        <li>• At least 8 characters long</li>
                        <li>• Include uppercase and lowercase letters</li>
                        <li>• Include numbers and special characters</li>
                        <li>• Avoid common words or phrases</li>
                        <li>• Don't reuse passwords from other sites</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Two-Factor Authentication */}
          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">Two-Factor Authentication</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">2</div>
                <div>
                  <p className="text-gray-700">Enable two-factor authentication for extra security:</p>
                  <div className="mt-3 space-y-2">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <h4 className="font-semibold text-black mb-2">How to Enable 2FA:</h4>
                      <ul className="space-y-1 text-sm text-gray-700">
                        <li>• Go to your account settings</li>
                        <li>• Look for "Security" or "Two-Factor Authentication"</li>
                        <li>• Follow the setup instructions</li>
                        <li>• Save your backup codes in a secure location</li>
                        <li>• Test the setup to ensure it works</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Login Security */}
          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">Login Security</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-black mb-3">Best Practices</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Always log out when using shared computers</li>
                    <li>• Don't save passwords on public devices</li>
                    <li>• Use a private browser window when possible</li>
                    <li>• Check for HTTPS in the URL</li>
                    <li>• Be wary of phishing attempts</li>
                  </ul>
                </div>
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-black mb-3">Warning Signs</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Unexpected login attempts</li>
                    <li>• Changes you didn't make</li>
                    <li>• Suspicious emails or messages</li>
                    <li>• Unusual account activity</li>
                    <li>• Failed login notifications</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Data Protection */}
          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">Data Protection</h2>
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-semibold text-black mb-3">How We Protect Your Data:</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• <strong>Encryption:</strong> All data is encrypted in transit and at rest</li>
                  <li>• <strong>Secure Servers:</strong> Data stored on secure, monitored servers</li>
                  <li>• <strong>Regular Backups:</strong> Automated backups to prevent data loss</li>
                  <li>• <strong>Access Controls:</strong> Limited access to sensitive information</li>
                  <li>• <strong>Monitoring:</strong> Continuous security monitoring and alerts</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Privacy Settings */}
          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">Privacy Settings</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">3</div>
                <div>
                  <p className="text-gray-700">Control your privacy and data sharing:</p>
                  <div className="mt-3 space-y-2">
                    <div className="bg-gray-100 rounded-lg p-4">
                      <h4 className="font-semibold text-black mb-2">Privacy Options:</h4>
                      <ul className="space-y-1 text-sm text-gray-700">
                        <li>• Control who can see your contact information</li>
                        <li>• Manage notification preferences</li>
                        <li>• Choose what data is shared with realtors</li>
                        <li>• Control survey response sharing</li>
                        <li>• Manage third-party data sharing</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Account Recovery */}
          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">Account Recovery</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-black mb-3">If You Forget Your Password</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Click "Forgot Password" on the login page</li>
                    <li>• Enter your email address</li>
                    <li>• Check your email for reset instructions</li>
                    <li>• Create a new strong password</li>
                    <li>• Update your password in other accounts</li>
                  </ul>
                </div>
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-black mb-3">If Your Account is Compromised</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Change your password immediately</li>
                    <li>• Enable two-factor authentication</li>
                    <li>• Check for suspicious activity</li>
                    <li>• Contact support if needed</li>
                    <li>• Monitor your account regularly</li>
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
                <h3 className="font-semibold text-black mb-2">Common Security Issues:</h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-black">Can't log in</h4>
                    <p className="text-sm text-gray-600">Try resetting your password or contact support if the issue persists</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-black">Suspicious activity</h4>
                    <p className="text-sm text-gray-600">Change your password immediately and enable two-factor authentication</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-black">Account locked</h4>
                    <p className="text-sm text-gray-600">Contact support to unlock your account after verifying your identity</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Support */}
          <section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">Need More Help?</h2>
            <p className="text-blue-100 mb-6">
              If you're having trouble with account security, our support team is here to help.
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