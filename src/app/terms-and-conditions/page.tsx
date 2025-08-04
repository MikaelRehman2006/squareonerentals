'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms and Conditions</h1>
          <p className="text-lg text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
        </motion.div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900">Square One Rentals - Terms and Conditions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-gray-700">
            
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Acceptance of Terms</h2>
              <p className="mb-4">
                By accessing and using Square One Rentals ("the Platform"), you accept and agree to be bound by the terms and provision of this agreement.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Data Sharing and Matching Services</h2>
              <div className="space-y-3">
                <p>
                  <strong>2.1 Consent for Data Sharing:</strong> By completing our onboarding survey and creating an account, you explicitly consent to the sharing of your preferences, requirements, and contact information with realtors, property managers, and other service providers on our platform.
                </p>
                <p>
                  <strong>2.2 Matching Purpose:</strong> Your information will be shared solely for the purpose of facilitating connections between users and service providers when both parties meet each other's requirements and preferences.
                </p>
                <p>
                  <strong>2.3 Shared Information:</strong> This may include, but is not limited to:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Your name and contact information</li>
                  <li>Property preferences (price range, location, bedrooms, etc.)</li>
                  <li>Move-in dates and requirements</li>
                  <li>User type (renter, buyer, landlord, realtor)</li>
                  <li>Service areas and specializations</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Limitation of Liability</h2>
              <div className="space-y-3">
                <p>
                  <strong>3.1 No Legal Action:</strong> By using our platform, you agree that you will not take any legal action, file lawsuits, or seek damages against Square One Rentals, its owners, employees, or affiliates for any reason related to the use of our services.
                </p>
                <p>
                  <strong>3.2 Service Disclaimer:</strong> Square One Rentals acts as a matching platform only. We do not guarantee the quality, accuracy, or reliability of any listings, service providers, or connections made through our platform.
                </p>
                <p>
                  <strong>3.3 User Responsibility:</strong> Users are responsible for conducting their own due diligence, verifying information, and making informed decisions about any transactions or relationships formed through our platform.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Data Protection and Privacy</h2>
              <div className="space-y-3">
                <p>
                  <strong>4.1 Data Security:</strong> We implement reasonable security measures to protect your personal information, but we cannot guarantee absolute security.
                </p>
                <p>
                  <strong>4.2 Data Retention:</strong> Your information will be retained for as long as your account is active and for a reasonable period thereafter for service improvement purposes.
                </p>
                <p>
                  <strong>4.3 Data Access:</strong> You have the right to access, modify, or delete your personal information at any time through your account settings.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Platform Usage</h2>
              <div className="space-y-3">
                <p>
                  <strong>5.1 Acceptable Use:</strong> You agree to use the platform only for lawful purposes and in accordance with these terms.
                </p>
                <p>
                  <strong>5.2 Prohibited Activities:</strong> You may not:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Provide false or misleading information</li>
                  <li>Harass, abuse, or harm other users</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Use the platform for any illegal or unauthorized purpose</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Service Modifications</h2>
              <p>
                Square One Rentals reserves the right to modify, suspend, or discontinue any aspect of our service at any time without prior notice. We are not liable to you or any third party for any modification, suspension, or discontinuance of the service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Governing Law</h2>
              <p>
                These terms and conditions are governed by and construed in accordance with the laws of Ontario, Canada. Any disputes arising from these terms or the use of our platform shall be resolved through binding arbitration in Ontario, Canada.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Contact Information</h2>
              <p>
                If you have any questions about these Terms and Conditions, please contact us at{' '}
                <a href="mailto:squareone.rental@gmail.com" className="text-blue-600 hover:text-blue-800 underline">
                  squareone.rental@gmail.com
                </a>
              </p>
            </section>

            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>Important Notice:</strong> By using Square One Rentals, you acknowledge that you have read, understood, and agreed to these terms and conditions, including the consent for data sharing and the limitation of liability provisions.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 