/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['via.placeholder.com', 'images.unsplash.com'],
  },
  // Allow cross-origin requests from Replit dev environment
  allowedDevOrigins: [
    '15f6911f-6a7e-4a7b-9e6a-5ebad318126e-00-1404825g3lift.picard.replit.dev',
    'localhost:3000',
    '172.31.128.64:3000'
  ],
  // Disable strict mode for development
  reactStrictMode: false,
  // Ensure proper handling of client-side routing
  trailingSlash: false,
}

module.exports = nextConfig