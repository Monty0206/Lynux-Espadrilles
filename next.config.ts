import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  basePath: '/Lynux-Espadrilles',
  assetPrefix: '/Lynux-Espadrilles/',
}

export default nextConfig
