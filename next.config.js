/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/f/:path*',
        destination: 'https://98xavqwq9nylujsp.public.blob.vercel-storage.com/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
