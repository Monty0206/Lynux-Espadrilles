import type { ImageLoaderProps } from 'next/image'

export default function imageLoader({ src }: ImageLoaderProps): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? ''
  if (src.startsWith('http') || src.startsWith('//') || src.startsWith(base)) {
    return src
  }
  return `${base}${src}`
}
