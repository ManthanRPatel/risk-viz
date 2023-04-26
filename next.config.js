/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  ignoreBuildErrors: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/Home',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
