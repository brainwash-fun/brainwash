/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["m.media-amazon.com", "www.shutterstock.com"],
  },
  transpilePackages: ["@mui/material", "@mui/icons-material"],
};

module.exports = nextConfig;
