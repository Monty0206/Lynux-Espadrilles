import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    loader: 'custom',
    loaderFile: './lib/imageLoader.ts',
  },
  basePath: '/Lynux-Espadrilles',
  assetPrefix: '/Lynux-Espadrilles/',
}

export default nextConfig
