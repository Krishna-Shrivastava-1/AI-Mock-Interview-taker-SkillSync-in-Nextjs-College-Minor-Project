// /** @type {import('next').NextConfig} */
// const nextConfig = {};

// export default nextConfig;


import withPWA from 'next-pwa';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your existing Next.js configuration
  //  images: {
  //     domains: [
  //       'avatars.githubusercontent.com', // Correct format: just the domain
  //       'github.com', // Correct format: just the domain
  //       'images.unsplash.com', // Example for Unsplash
  //         'newsdata.io',
  //         'i0.wp.com'
  //     ],
  //   },
  images: {
    domains: [], // This is deprecated in favor of remotePatterns
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '**', // Matches any hostname
      },
      {
        protocol: 'https',
        hostname: '**', // Matches any hostname
      },
    ],
  }
};

// Define the PWA configuration
const pwaConfig = {
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
};

// Export the combined configuration
export default withPWA(pwaConfig)(nextConfig);