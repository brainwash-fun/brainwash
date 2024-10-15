/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
<<<<<<< HEAD
    domains: ["m.media-amazon.com", "www.shutterstock.com"],
  },
  transpilePackages: ["@mui/material", "@mui/icons-material"],
=======
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com',
      },
      {
        protocol: 'https',
        hostname: 'www.shutterstock.com',
      },
    ],
  },
  transpilePackages: ['@mui/material', '@mui/icons-material'],
  reactStrictMode: true,
  compiler: {
    reactRemoveProperties: { properties: ['^data-new-gr-c-s-check-loaded$', '^data-gr-ext-installed$'] }
  }
>>>>>>> eb7623f97315d0c2ed1d877e505252572e636d98
};

module.exports = nextConfig;
