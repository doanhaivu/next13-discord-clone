/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.externals.push({
      "utf-8-validate": "commonjs utf-8-validate",
      bufferutil: "commonjs bufferutil"
    });

    return config;
  },
  images: {
    domains: [
      "uploadthing.com",
      "uploadthingy.com",
    ]
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://chatvector.fly.dev/:path*' // Proxy to Backend
      },
    ]
  },
}

module.exports = nextConfig
