/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['m.media-amazon.com', 'www.shutterstock.com'],
  },
  fontLoaders: [{ loader: '@next/font/google', options: { subsets: ['latin'] } }],
  transpilePackages: ['@mui/material', '@mui/icons-material'],
};

module.exports = nextConfig;
