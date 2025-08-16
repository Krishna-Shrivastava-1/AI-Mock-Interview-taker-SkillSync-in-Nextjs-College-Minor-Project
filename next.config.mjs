// /** @type {import('next').NextConfig} */
// const nextConfig = {};

// export default nextConfig;


import withPWA from 'next-pwa';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your existing Next.js configuration
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