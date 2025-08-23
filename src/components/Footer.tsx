import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-6 gap-8">
        <div>
          <h4 className="font-semibold mb-4">About Square One Rentals</h4>
          <p className="text-gray-400">We connect renters with property owners in the Square One area of Mississauga, making the rental process simple and efficient.</p>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2">
            <li><Link href="/listings" className="text-gray-400 hover:text-white">Listings</Link></li>
            <li><Link href="/submit" className="text-gray-400 hover:text-white">Submit Listing</Link></li>
            <li><Link href="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
            <li><Link href="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
            <li><Link href="/terms-and-conditions" className="text-gray-400 hover:text-white">Terms & Conditions</Link></li>
            <li><Link href="/careers" className="text-gray-400 hover:text-white">Careers</Link></li>
            <li><Link href="/realtors" className="text-gray-400 hover:text-white">Find a Realtor</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Support & Help</h4>
          <ul className="space-y-2">
            <li><Link href="/faq" className="text-gray-400 hover:text-white">FAQ</Link></li>
            <li><Link href="/help-center" className="text-gray-400 hover:text-white">Help Center</Link></li>
            <li><Link href="/report-issue" className="text-gray-400 hover:text-white">Report Issue</Link></li>
            <li><Link href="/feedback" className="text-gray-400 hover:text-white">Feedback</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Resources</h4>
          <ul className="space-y-2">
            <li><Link href="/landlord-guide" className="text-gray-400 hover:text-white">Landlord Guide</Link></li>
            <li><Link href="/realtor-guide" className="text-gray-400 hover:text-white">Realtor Guide</Link></li>
            <li><Link href="/market-insights" className="text-gray-400 hover:text-white">Market Insights</Link></li>
            <li><Link href="/rental-calculator" className="text-gray-400 hover:text-white">Rental Calculator</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Legal & Privacy</h4>
          <ul className="space-y-2">
            <li><Link href="/privacy-policy" className="text-gray-400 hover:text-white">Privacy Policy</Link></li>
            <li><Link href="/cookie-policy" className="text-gray-400 hover:text-white">Cookie Policy</Link></li>
            <li><Link href="/accessibility-statement" className="text-gray-400 hover:text-white">Accessibility Statement</Link></li>
            <li><Link href="/dmca-policy" className="text-gray-400 hover:text-white">DMCA Policy</Link></li>
            <li><Link href="/acceptable-use-policy" className="text-gray-400 hover:text-white">Acceptable Use Policy</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Services</h4>
          <ul className="space-y-2">
            <li><Link href="/memberships" className="text-gray-400 hover:text-white">Membership Plans</Link></li>
            <li><Link href="/dashboard" className="text-gray-400 hover:text-white">Dashboard</Link></li>
            <li><Link href="/favorites" className="text-gray-400 hover:text-white">Saved Listings</Link></li>
            <li><Link href="/notifications" className="text-gray-400 hover:text-white">Notifications</Link></li>
            <li><Link href="/settings" className="text-gray-400 hover:text-white">Account Settings</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Business</h4>
          <ul className="space-y-2">
            <li><Link href="/partnerships" className="text-gray-400 hover:text-white">Partnerships</Link></li>
            <li><Link href="/investor-relations" className="text-gray-400 hover:text-white">Investor Relations</Link></li>
            <li><Link href="/property-manager-services" className="text-gray-400 hover:text-white">Business Services</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Contact & Hours</h4>
          <ul className="space-y-2 text-gray-400">
            <li>Email: squareone.rental@gmail.com</li>
            <li>
              <a href="https://www.linkedin.com/company/105313383" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                LinkedIn
              </a>
            </li>
            <li>
              <a href="https://www.facebook.com/groups/618941558289151" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                Facebook Group
              </a>
            </li>
            <li className="mt-4">Business Hours:</li>
            <li>Mon-Fri: 9am-7pm EST</li>
            <li>Sat-Sun: 9am-5pm EST</li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
        <p>&copy; {new Date().getFullYear()} Square One Rentals. All rights reserved.</p>
      </div>
    </footer>
  );
} 