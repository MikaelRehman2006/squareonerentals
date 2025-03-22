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
}

module.exports = nextConfig