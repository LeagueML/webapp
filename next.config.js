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
    formats: ['image/avif', 'image/webp']
  }
}

module.exports = nextConfig;
