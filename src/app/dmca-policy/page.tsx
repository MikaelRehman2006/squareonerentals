export default function DMCAPolicy() {
  return (
    <div className="bg-white min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-4">DMCA Policy</h1>
          <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="space-y-8 text-black">
          <section>
            <h2 className="text-xl font-semibold text-black mb-3">1. Introduction</h2>
            <p className="text-gray-700 mb-4">
              Square One Rentals respects the intellectual property rights of others and expects our users to do the same. This DMCA (Digital Millennium Copyright Act) Policy outlines our procedures for handling copyright infringement claims.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-black mb-3">2. Designated Copyright Agent</h2>
            <p className="text-gray-700 mb-4">
              For copyright infringement claims, please contact our designated copyright agent:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <p className="text-gray-700">
                <strong>Email:</strong> squareone.rental@gmail.com<br/>
                <strong>Subject Line:</strong> DMCA Copyright Infringement Claim<br/>
                <strong>Response Time:</strong> We aim to respond to valid DMCA notices within 48 hours
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-black mb-3">3. Filing a DMCA Takedown Notice</h2>
            <p className="text-gray-700 mb-4">
              To file a copyright infringement claim, you must provide the following information in writing:
            </p>
            
            <h3 className="text-lg font-medium text-black mb-2">3.1 Required Information</h3>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Physical or electronic signature</strong> of the copyright owner or authorized representative</li>
              <li><strong>Identification of the copyrighted work</strong> claimed to have been infringed</li>
              <li><strong>Identification of the infringing material</strong> and its location on our platform</li>
              <li><strong>Contact information</strong> for the complaining party (name, address, phone, email)</li>
              <li><strong>Statement of good faith belief</strong> that use of the material is not authorized</li>
              <li><strong>Statement of accuracy</strong> under penalty of perjury</li>
            </ul>

            <h3 className="text-lg font-medium text-black mb-2">3.2 Notice Format</h3>
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <p className="text-gray-700 font-mono text-sm">
                Subject: DMCA Copyright Infringement Claim<br/><br/>
                
                I, [Your Name], hereby certify that:<br/><br/>
                
                1. I am the copyright owner or authorized to act on behalf of the copyright owner.<br/>
                2. The copyrighted work is: [Description of copyrighted work]<br/>
                3. The infringing material is located at: [URL or specific location]<br/>
                4. I have a good faith belief that the use is not authorized by the copyright owner.<br/>
                5. This notice is accurate and I am authorized to act on behalf of the copyright owner.<br/><br/>
                
                Contact Information:<br/>
                Name: [Your Name]<br/>
                Address: [Your Address]<br/>
                Phone: [Your Phone]<br/>
                Email: [Your Email]<br/><br/>
                
                Signature: [Your Signature]
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-black mb-3">4. Our Response Process</h2>
            
            <h3 className="text-lg font-medium text-black mb-2">4.1 Initial Review</h3>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li>We will review your DMCA notice within 48 hours</li>
              <li>We may request additional information if the notice is incomplete</li>
              <li>We will verify the validity of your copyright claim</li>
            </ul>

            <h3 className="text-lg font-medium text-black mb-2">4.2 Takedown Action</h3>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li>If the notice is valid, we will remove or disable access to the infringing material</li>
              <li>We will notify the user who posted the content</li>
              <li>We will provide the user with your contact information</li>
              <li>We will maintain records of the takedown action</li>
            </ul>

            <h3 className="text-lg font-medium text-black mb-2">4.3 Counter-Notification</h3>
            <p className="text-gray-700 mb-4">
              Users may file a counter-notification if they believe the material was removed in error. We will restore the material within 10-14 business days unless you file a lawsuit.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-black mb-3">5. Counter-Notification Process</h2>
            <p className="text-gray-700 mb-4">
              If you believe your content was removed in error, you may file a counter-notification containing:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li>Your physical or electronic signature</li>
              <li>Identification of the removed material and its previous location</li>
              <li>Statement under penalty of perjury that you have a good faith belief the material was removed in error</li>
              <li>Consent to local federal court jurisdiction</li>
              <li>Your contact information</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-black mb-3">6. Repeat Infringer Policy</h2>
            <p className="text-gray-700 mb-4">
              We maintain a policy for handling repeat copyright infringers:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li>First violation: Warning and content removal</li>
              <li>Second violation: Temporary account suspension (7-30 days)</li>
              <li>Third violation: Permanent account termination</li>
              <li>We reserve the right to terminate accounts immediately for egregious violations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-black mb-3">7. False Claims</h2>
            <p className="text-gray-700 mb-4">
              Filing a false DMCA notice may result in legal consequences. You may be liable for damages, including attorney's fees, if you knowingly misrepresent that material is infringing.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-black mb-3">8. Fair Use and Exceptions</h2>
            <p className="text-gray-700 mb-4">
              We recognize that some uses of copyrighted material may be protected under fair use or other exceptions. Users may include this information in their counter-notification.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-black mb-3">9. Appeals Process</h2>
            <p className="text-gray-700 mb-4">
              If you disagree with our decision regarding a DMCA notice or counter-notification, you may appeal by:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li>Providing additional evidence or clarification</li>
              <li>Requesting a review by our legal team</li>
              <li>Seeking resolution through legal channels</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-black mb-3">10. Contact Information</h2>
            <p className="text-gray-700 mb-4">
              For DMCA-related questions or to file a notice:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">
                <strong>Email:</strong> squareone.rental@gmail.com<br/>
                <strong>Subject:</strong> DMCA Copyright Infringement Claim<br/>
                <strong>Business Hours:</strong> Mon-Fri: 9am-7pm EST, Sat-Sun: 9am-5pm EST<br/>
                <strong>Response Time:</strong> 48 hours for valid notices
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-black mb-3">11. Updates to This Policy</h2>
            <p className="text-gray-700 mb-4">
              We may update this DMCA Policy as our procedures change or as required by law. We will notify users of significant changes by posting updates on this page.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
} 