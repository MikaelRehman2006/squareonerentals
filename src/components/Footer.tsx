import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
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