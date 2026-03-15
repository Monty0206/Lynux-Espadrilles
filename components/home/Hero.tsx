'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function Hero() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section className="min-h-screen bg-cream flex items-center pt-16 lg:pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center py-16 lg:py-24">
          {/* Left: Text */}
          <div
            className={`transition-all duration-700 ease-out ${
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <p className="font-dm text-xs tracking-[0.25em] uppercase text-clay font-medium mb-6">
              Handcrafted in South Africa
            </p>
            <h1 className="font-cormorant font-semibold text-5xl sm:text-6xl lg:text-7xl xl:text-8xl text-ink leading-[1.05] mb-6">
              Shoes made<br />
              <span className="italic text-clay-dark">for every</span><br />
              occasion
            </h1>
            <p className="font-dm text-base lg:text-lg text-ink-light leading-relaxed mb-10 max-w-md">
              Luxury espadrilles handcrafted with French and Spanish inspiration. Comfort in every way.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/shop"
                className="inline-block font-dm text-sm font-medium bg-clay hover:bg-clay-dark text-cream px-8 py-3.5 transition-all duration-300 tracking-wide"
              >
                Shop Collection
              </Link>
              <Link
                href="/about"
                className="inline-block font-dm text-sm font-medium border border-ink text-ink hover:bg-ink hover:text-cream px-8 py-3.5 transition-all duration-300 tracking-wide"
              >
                Our Story
              </Link>
            </div>
          </div>

          {/* Right: Image */}
          <div
            className={`relative transition-all duration-700 delay-200 ease-out ${
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="relative aspect-[4/5] w-full max-w-lg mx-auto lg:max-w-none bg-sand rounded-sm overflow-hidden">
              <Image
                src="/images/the-lynux.png"
                alt="The Lynux — Signature Espadrille"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {/* Floating badge */}
              <div className="absolute bottom-6 left-6 bg-cream/95 backdrop-blur-sm px-5 py-3">
                <p className="font-cormorant text-sm text-ink-light italic">Bestseller</p>
                <p className="font-cormorant font-semibold text-lg text-ink">The Lynux</p>
                <p className="font-dm text-xs text-ink-mid">From R1,099.00</p>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 w-24 h-24 border border-clay/30 rounded-sm -z-10 hidden lg:block" />
          </div>
        </div>
      </div>
    </section>
  )
}
