/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/api/article/:writer",
        destination: "/api/article/:writer",
      },
    ];
  },
};

module.exports = nextConfig;
