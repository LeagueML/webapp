/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    removeConsole: {
      exclude: ['error'],
    },
  },
  swcMinify: true,
  images: {
    loader: 'custom'
  }
};

module.exports = nextConfig;
