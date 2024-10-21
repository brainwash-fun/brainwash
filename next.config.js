const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "m.media-amazon.com",
      },
      {
        protocol: "https",
        hostname: "www.shutterstock.com",
      },
    ],
  },
  transpilePackages: ["@mui/material", "@mui/icons-material"],
  reactStrictMode: true,
  compiler: {
    reactRemoveProperties: {
      properties: ["^data-new-gr-c-s-check-loaded$", "^data-gr-ext-installed$"],
    },
  },
  // Update webpack configuration for module aliases
  webpack: (config) => {
    config.resolve.alias["@"] = path.join(__dirname, "src");
    config.devtool = "source-map";
    return config;
  },
};

module.exports = nextConfig;
