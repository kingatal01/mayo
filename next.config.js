/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      // Les photos de médecins sont envoyées en data URL (max 2 Mo)
      bodySizeLimit: '4mb',
    },
  },
}

module.exports = nextConfig
