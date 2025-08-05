export default function AccessibilityStatement() {
  return (
    <div className="bg-white min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-4">Accessibility Statement</h1>
          <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="space-y-8 text-black">
          <section>
            <h2 className="text-xl font-semibold text-black mb-3">1. Our Commitment</h2>
            <p className="text-gray-700 mb-4">
              Square One Rentals is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-black mb-3">2. Conformance Status</h2>
            <p className="text-gray-700 mb-4">
              The Web Content Accessibility Guidelines (WCAG) defines requirements for designers and developers to improve accessibility for people with disabilities. It defines three levels of conformance: Level A, Level AA, and Level AAA.
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Current Status:</strong> We are working towards WCAG 2.1 Level AA conformance. Some content may not be fully accessible due to known limitations.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-black mb-3">3. Accessibility Features</h2>
            
            <h3 className="text-lg font-medium text-black mb-2">3.1 Keyboard Navigation</h3>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li>All interactive elements can be accessed using keyboard navigation</li>
              <li>Tab order follows logical document structure</li>
              <li>Skip navigation links for main content areas</li>
              <li>Keyboard shortcuts for common actions</li>
            </ul>

            <h3 className="text-lg font-medium text-black mb-2">3.2 Screen Reader Support</h3>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li>Semantic HTML structure for proper screen reader interpretation</li>
              <li>Alternative text for all images and icons</li>
              <li>ARIA labels and roles where appropriate</li>
              <li>Descriptive link text and button labels</li>
            </ul>

            <h3 className="text-lg font-medium text-black mb-2">3.3 Visual Design</h3>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li>High contrast color schemes available</li>
              <li>Resizable text without loss of functionality</li>
              <li>Clear typography with adequate spacing</li>
              <li>Consistent visual hierarchy and layout</li>
            </ul>

            <h3 className="text-lg font-medium text-black mb-2">3.4 Forms and Input</h3>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li>Proper form labels and field associations</li>
              <li>Error messages clearly identified and announced</li>
              <li>Required field indicators</li>
              <li>Input validation with helpful error descriptions</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-black mb-3">4. Known Limitations</h2>
            <p className="text-gray-700 mb-4">
              We are aware of the following accessibility limitations and are working to address them:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li>Some complex interactive elements may require additional ARIA support</li>
              <li>Video content (if added in the future) will need captions and transcripts</li>
              <li>Some third-party integrations may not be fully accessible</li>
              <li>Mobile responsiveness on very small screens may need improvement</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-black mb-3">5. Testing and Evaluation</h2>
            <p className="text-gray-700 mb-4">
              We use the following methods to evaluate accessibility:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li>Automated accessibility testing tools</li>
              <li>Manual testing with keyboard navigation</li>
              <li>Screen reader testing with popular assistive technologies</li>
              <li>Color contrast analysis</li>
              <li>User feedback and testing</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-black mb-3">6. Assistive Technologies</h2>
            <p className="text-gray-700 mb-4">
              Our website has been tested with the following assistive technologies:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li>Screen readers: NVDA, JAWS, VoiceOver</li>
              <li>Browser zoom functionality (up to 200%)</li>
              <li>High contrast mode</li>
              <li>Keyboard-only navigation</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-black mb-3">7. Alternative Formats</h2>
            <p className="text-gray-700 mb-4">
              If you need information from our website in an alternative format, please contact us. We can provide:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li>Large print documents</li>
              <li>Audio descriptions of visual content</li>
              <li>Alternative communication methods</li>
              <li>Assistance with navigation</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-black mb-3">8. Feedback and Support</h2>
            <p className="text-gray-700 mb-4">
              We welcome your feedback on the accessibility of our website. If you experience accessibility barriers or have suggestions for improvement, please contact us:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <p className="text-gray-700">
                <strong>Email:</strong> squareone.rental@gmail.com<br/>
                <strong>Business Hours:</strong> Mon-Fri: 9am-7pm EST, Sat-Sun: 9am-5pm EST<br/>
                <strong>Response Time:</strong> We aim to respond to accessibility feedback within 2 business days
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-black mb-3">9. Continuous Improvement</h2>
            <p className="text-gray-700 mb-4">
              We are committed to continuously improving the accessibility of our website. This includes:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li>Regular accessibility audits and testing</li>
              <li>Training for our development team on accessibility best practices</li>
              <li>Incorporating user feedback into our design process</li>
              <li>Staying updated with accessibility standards and guidelines</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-black mb-3">10. Technical Specifications</h2>
            <p className="text-gray-700 mb-4">
              Accessibility of our website relies on the following technologies:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li>HTML5 for semantic structure</li>
              <li>CSS3 for styling and layout</li>
              <li>JavaScript for interactive functionality</li>
              <li>ARIA (Accessible Rich Internet Applications) attributes</li>
              <li>WCAG 2.1 guidelines for accessibility standards</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-black mb-3">11. Updates to This Statement</h2>
            <p className="text-gray-700 mb-4">
              We may update this Accessibility Statement as we improve our accessibility features or as required by law. We will notify users of significant changes by posting updates on this page.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-black mb-3">12. Contact Information</h2>
            <p className="text-gray-700 mb-4">
              For accessibility-related questions or concerns:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">
                <strong>Email:</strong> squareone.rental@gmail.com<br/>
                <strong>Business Hours:</strong> Mon-Fri: 9am-7pm EST, Sat-Sun: 9am-5pm EST<br/>
                <strong>Accessibility Coordinator:</strong> Available during business hours
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
} 