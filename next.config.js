/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'cdn.cosmicjs.com',
      'imgix.cosmicjs.com',
      'images.unsplash.com',
      'res.cloudinary.com'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.cosmicjs.com'
      },
      {
        protocol: 'https',
        hostname: 'imgix.cosmicjs.com'
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com'
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com'
      }
    ]
  },
  typescript: {
    ignoreBuildErrors: true
  },
  eslint: {
    ignoreDuringBuilds: false
  },
  // Vercel optimizations
  experimental: {
    optimizePackageImports: ['@vercel/speed-insights']
  },
  // Ensure static generation works properly
  output: 'standalone',
}

module.exports = nextConfig