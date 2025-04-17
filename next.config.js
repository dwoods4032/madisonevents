/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true, // ← THIS is important
  },
};

module.exports = nextConfig;
