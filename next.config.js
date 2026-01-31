/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standalone output for Node.js deployment
  output: 'standalone',
  
  // Compress responses
  compress: true,
  
  // Image optimization
  images: {
    domains: ['swapmylookcom-be-production.up.railway.app'],
    // Add other domains as needed
  },
  
  // Environment variables available to the browser
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  
  // Production optimizations
  swcMinify: true,
  reactStrictMode: true,
}

module.exports = nextConfig