/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  output: 'standalone',
  experimental: {
    outputFileTracingRoot: undefined,
  },
  // Ensure proper static file handling
  trailingSlash: false,
  // Disable server-side features that might cause issues in Amplify
  serverRuntimeConfig: {
    // Will only be available on the server side
  },
  publicRuntimeConfig: {
    // Will be available on both server and client
  },
  // Add more permissive settings for build
  swcMinify: true,
  // Handle static generation issues
  generateBuildId: async () => {
    return 'build-' + Date.now()
  },
  // Disable some problematic features during build
  poweredByHeader: false,
  compress: true,
  // Handle client-side only features
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
    }
    return config
  },
}

export default nextConfig