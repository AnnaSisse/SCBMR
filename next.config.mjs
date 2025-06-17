/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Only run ESLint on local development
    ignoreDuringBuilds: process.env.NODE_ENV === 'production',
  },
  typescript: {
    // Only run TypeScript on local development
    ignoreBuildErrors: process.env.NODE_ENV === 'production',
  },
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
}

export default nextConfig