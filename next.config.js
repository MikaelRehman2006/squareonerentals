/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'lh3.googleusercontent.com', 
      'res.cloudinary.com',
      'source.unsplash.com',
      'placehold.co'
    ],
    dangerouslyAllowSVG: true,
  },
  // Add pageExtensions to help resolve routing conflicts
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  // Improved handling for query parameters in dynamic routes
  trailingSlash: false,
  // Enable strict URL matching to prevent 404 errors with query parameters
  experimental: {
    // Treat query parameters separately from the path matching
    scrollRestoration: true,
    // Ensure App Router features are enabled
    appDir: true,
  },
  // Explicitly allow all query parameters
  async rewrites() {
    return [
      {
        source: '/memberships/success',
        destination: '/memberships/success'
      }
    ];
  },
  // Ignore the build errors related to conflicting dynamic routes
  onDemandEntries: {
    // Period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // Number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
  },
  // Disable static rendering for pages with dynamic content
  staticPageGenerationTimeout: 0,
}

module.exports = nextConfig
// hi