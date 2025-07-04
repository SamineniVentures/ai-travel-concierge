import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Recommended for Vercel: enable output standalone for smaller deployment size
  // output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    esmExternals: true,
  },
  webpack: (config, { isServer }) => {
    // Ensure proper module resolution
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    
    // Add alias resolution for @/lib/utils
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(process.cwd(), './'),
      '@/lib/utils': path.resolve(process.cwd(), './lib/utils.ts'),
      '@/lib/api': path.resolve(process.cwd(), './lib/api.ts'),
    };
    
    return config;
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
    ],
  },
};

export default nextConfig;
