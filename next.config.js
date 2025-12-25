/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        // Jab koi b-jh.vercel.app/f/file-name par jaye
        source: '/f/:path*',
        // To asliyat mein yahan se file uthaye
        destination: 'https://98xavqwq9nylujsp.public.blob.vercel-storage.com/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
