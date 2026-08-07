/** @type {import('next').NextConfig} */

// Build « basse ressource » : activé avec LOW_RESOURCE_BUILD=1
// -> limite Next.js à un seul worker (build quasi mono-thread) pour éviter
//    que l'hébergeur ne tue le processus (RAM/CPU limités).
const lowResource = process.env.LOW_RESOURCE_BUILD === '1'

const nextConfig = {
  experimental: {
    serverActions: {
      // Les photos de médecins sont envoyées en data URL (max 2 Mo)
      bodySizeLimit: '4mb',
    },
    ...(lowResource ? { cpus: 1, workerThreads: false } : {}),
  },
  // Les source maps de production consomment beaucoup de mémoire au build
  productionBrowserSourceMaps: false,
}

module.exports = nextConfig
