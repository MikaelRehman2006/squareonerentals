'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-black mb-4">Terms and Conditions</h1>
          <p className="text-lg text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
        </motion.div>

        <Card className="shadow-lg bg-white border border-gray-200">
          <CardHeader className="bg-white">
            <CardTitle className="text-2xl font-bold text-black">Square One Rentals - Terms and Conditions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-black">
            
            <section>
              <h2 className="text-xl font-semibold text-black mb-3">1. Acceptance of Terms</h2>
              <p className="mb-4">
                By accessing and using Square One Rentals ("the Platform"), you accept and agree to be bound by the terms and provision of this agreement.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-black mb-3">2. Data Sharing and Matching Services</h2>
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
              <h2 className="text-xl font-semibold text-black mb-3">3. Limitation of Liability</h2>
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
              <h2 className="text-xl font-semibold text-black mb-3">4. Data Protection and Privacy</h2>
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
              <h2 className="text-xl font-semibold text-black mb-3">5. Platform Usage</h2>
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
              <h2 className="text-xl font-semibold text-black mb-3">6. Service Modifications</h2>
              <p>
                Square One Rentals reserves the right to modify, suspend, or discontinue any aspect of our service at any time without prior notice. We are not liable to you or any third party for any modification, suspension, or discontinuance of the service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-black mb-3">7. Governing Law</h2>
              <p>
                These terms and conditions are governed by and construed in accordance with the laws of Ontario, Canada. Any disputes arising from these terms or the use of our platform shall be resolved through binding arbitration in Ontario, Canada.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-black mb-3">8. Membership and Payment Terms</h2>
              <div className="space-y-3">
                <p>
                  <strong>8.1 Subscription Services:</strong> Square One Rentals offers membership plans (Basic and Featured) that provide access to listing creation and enhanced features.
                </p>
                <p>
                  <strong>8.2 Auto-Renewal:</strong> All subscriptions automatically renew at the end of your billing period (monthly or annually) until canceled. You will be charged the applicable fee for each renewal period.
                </p>
                <p>
                  <strong>8.3 Cancellation Policy:</strong> You may cancel your subscription at any time through your dashboard by navigating to Subscription and clicking 'Manage Subscription'. This will redirect you to Stripe's Customer Portal where you can cancel your subscription. Your access will continue until the end of your current billing period.
                </p>
                <p>
                  <strong>8.4 Payment Processing:</strong> All payments are processed securely through Stripe, a third-party payment processor. By making a payment, you agree to Stripe's terms of service and privacy policy.
                </p>
                <p>
                  <strong>8.5 Refunds:</strong> Refunds are not provided for subscription fees. Once a payment is processed, it is non-refundable.
                </p>
                <p>
                  <strong>8.6 Billing Cycles:</strong> Billing occurs monthly or annually based on your selected plan. Annual billing provides a discount compared to monthly billing.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-black mb-3">9. Listing and Service Terms</h2>
              <div className="space-y-3">
                <p>
                  <strong>9.1 Listing Requirements:</strong> To create listings, you must have an active membership. Listings must contain accurate information and comply with our content guidelines.
                </p>
                <p>
                  <strong>9.2 Commission Structure:</strong> For realtors and property managers, our service operates on a "no fees, just commission-based exposure" model. We do not charge listing fees but may receive commissions from successful transactions.
                </p>
                <p>
                  <strong>9.3 Content Guidelines:</strong> All listings must be accurate, truthful, and comply with applicable laws. Prohibited content includes false information, discriminatory language, or illegal activities.
                </p>
                <p>
                  <strong>9.4 Listing Moderation:</strong> All listings are subject to review and approval. We reserve the right to reject, modify, or remove listings that violate our guidelines or applicable laws.
                </p>
                <p>
                  <strong>9.5 Intellectual Property:</strong> You retain ownership of your listing content, but grant us a license to display and distribute your listings on our platform and partner sites.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-black mb-3">10. Privacy and Data Protection</h2>
              <div className="space-y-3">
                <p>
                  <strong>10.1 GDPR Compliance:</strong> We comply with the General Data Protection Regulation (GDPR) for users in the European Union. You have the right to access, rectify, erase, and port your personal data.
                </p>
                <p>
                  <strong>10.2 Cookie Policy:</strong> We use cookies and similar technologies to improve your experience, analyze usage, and provide personalized content. You can control cookie settings through your browser.
                </p>
                <p>
                  <strong>10.3 Third-Party Services:</strong> We use third-party services including Stripe (payments), Cloudinary (image storage), and SendGrid (email). These services have their own privacy policies and terms of service.
                </p>
                <p>
                  <strong>10.4 Data Retention:</strong> Your personal data is retained for as long as your account is active and for a reasonable period thereafter for service improvement and legal compliance.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-black mb-3">11. Dispute Resolution and Legal</h2>
              <div className="space-y-3">
                <p>
                  <strong>11.1 Dispute Resolution:</strong> Any disputes arising from these terms or the use of our platform shall be resolved through binding arbitration in Ontario, Canada, in accordance with the Arbitration Act.
                </p>
                <p>
                  <strong>11.2 Force Majeure:</strong> We are not liable for any failure to perform due to circumstances beyond our reasonable control, including but not limited to natural disasters, government actions, or technical failures.
                </p>
                <p>
                  <strong>11.3 Severability:</strong> If any provision of these terms is found to be unenforceable or invalid, the remaining provisions will continue to be valid and enforceable.
                </p>
                <p>
                  <strong>11.4 Changes to Terms:</strong> We reserve the right to modify these terms at any time. Continued use of the platform after changes constitutes acceptance of the new terms.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-black mb-3">12. Contact Information</h2>
              <p>
                If you have any questions about these Terms and Conditions, please contact us at{' '}
                <a href="mailto:squareone.rental@gmail.com" className="text-blue-600 hover:text-blue-800 underline">
                  squareone.rental@gmail.com
                </a>
              </p>
            </section>

            <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm text-black">
                <strong>Important Notice:</strong> By using Square One Rentals, you acknowledge that you have read, understood, and agreed to these terms and conditions, including the consent for data sharing and the limitation of liability provisions.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 