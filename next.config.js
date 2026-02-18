/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['firebasestorage.googleapis.com'],
  },
  async rewrites() {
    return [
      {
        source: '/order',
        destination: 'https://online-ordering-blush.vercel.app/order',
      },
      {
        source: '/order/:path*',
        destination: 'https://online-ordering-blush.vercel.app/order/:path*',
      },
    ]
  },
}

module.exports = nextConfig
