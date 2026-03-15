'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const heroSlides = [
  { src: "/images/the-lynux.png", name: "The Lynux", price: "From R1,099.00", slug: "the-lynux" },
  { src: "/images/the-mule-3.jpg", name: "The Mule", price: "From R1,299.00", slug: "the-mule" },
  { src: "/images/florencia-cerrada.jpg", name: "Florencia Cerrada", price: "From R1,499.00", slug: "florencia-cerrada" },
  { src: "/images/lucia-wedge.png", name: "Lucia Wedge", price: "From R1,299.00", slug: "lucia-wedge" },
  { src: "/images/the-bella.jpg", name: "The Bella", price: "From R999.00", slug: "the-bella" },
  { src: "/images/valeria.png", name: "Valeria", price: "From R1,099.00", slug: "valeria" },
  { src: "/images/ariana.png", name: "Ariana", price: "From R1,099.00", slug: "ariana" },
  { src: "/images/carnero-slipper.jpg", name: "Carnero Slipper", price: "From R1,299.00", slug: "carnero-slipper" },
]

const INTERVAL = 4000
const FADE_DURATION = 800

export default function Hero() {
  const [visible, setVisible] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [nextIndex, setNextIndex] = useState<number | null>(null)
  const [transitioning, setTransitioning] = useState(false)
  const [badgeVisible, setBadgeVisible] = useState(true)
  const [hovered, setHovered] = useState(false)
  const [arrowsVisible, setArrowsVisible] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const transitioningRef = useRef(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const goToSlide = useCallback((index: number) => {
    if (transitioningRef.current || index === currentIndex) return
    transitioningRef.current = true
    setTransitioning(true)
    setNextIndex(index)
    setBadgeVisible(false)
    setTimeout(() => {
      setCurrentIndex(index)
      setNextIndex(null)
      setTransitioning(false)
      transitioningRef.current = false
      setBadgeVisible(true)
    }, FADE_DURATION)
  }, [currentIndex])

  const advance = useCallback(() => {
    const next = (currentIndex + 1) % heroSlides.length
    goToSlide(next)
  }, [currentIndex, goToSlide])

  const goBack = useCallback(() => {
    const prev = (currentIndex - 1 + heroSlides.length) % heroSlides.length
    goToSlide(prev)
  }, [currentIndex, goToSlide])

  useEffect(() => {
    if (hovered) {
      if (intervalRef.current) clearInterval(intervalRef.current)
      return
    }
    intervalRef.current = setInterval(advance, INTERVAL)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [hovered, advance])

  const current = heroSlides[currentIndex]
  const next = nextIndex !== null ? heroSlides[nextIndex] : null

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

          {/* Right: Slideshow */}
          <div
            className={`relative transition-all duration-700 delay-200 ease-out ${
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div
              className="relative aspect-[4/5] w-full max-w-lg mx-auto lg:max-w-none bg-sand rounded-sm overflow-hidden cursor-pointer"
              onMouseEnter={() => { setHovered(true); setArrowsVisible(true) }}
              onMouseLeave={() => { setHovered(false); setArrowsVisible(false) }}
            >
              {/* Current image */}
              <Image
                src={current.src}
                alt={current.name}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                style={{ opacity: transitioning ? 0 : 1, transition: `opacity ${FADE_DURATION}ms ease-in-out` }}
              />

              {/* Next image (fades in) */}
              {next && (
                <Image
                  src={next.src}
                  alt={next.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  style={{ opacity: transitioning ? 1 : 0, transition: `opacity ${FADE_DURATION}ms ease-in-out` }}
                />
              )}

              {/* Preload remaining slides (hidden) */}
              {heroSlides.slice(1).map((slide, i) => (
                <Image
                  key={slide.slug}
                  src={slide.src}
                  alt=""
                  fill
                  className="object-cover pointer-events-none"
                  sizes="1px"
                  style={{ opacity: 0, position: 'absolute' }}
                  aria-hidden
                />
              ))}

              {/* Left arrow */}
              <button
                onClick={e => { e.preventDefault(); goBack() }}
                aria-label="Previous slide"
                style={{
                  position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                  width: 36, height: 36, borderRadius: '50%',
                  background: 'rgba(28,26,23,0.45)', backdropFilter: 'blur(4px)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  opacity: arrowsVisible ? 1 : 0,
                  transition: 'opacity 250ms ease',
                  zIndex: 10, border: 'none', cursor: 'pointer',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
              </button>

              {/* Right arrow */}
              <button
                onClick={e => { e.preventDefault(); advance() }}
                aria-label="Next slide"
                style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  width: 36, height: 36, borderRadius: '50%',
                  background: 'rgba(28,26,23,0.45)', backdropFilter: 'blur(4px)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  opacity: arrowsVisible ? 1 : 0,
                  transition: 'opacity 250ms ease',
                  zIndex: 10, border: 'none', cursor: 'pointer',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
              </button>

              {/* Navigation dots */}
              <div style={{
                position: 'absolute', bottom: 80, left: 0, right: 0,
                display: 'flex', justifyContent: 'center', gap: 6, zIndex: 10,
              }}>
                {heroSlides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goToSlide(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    style={{
                      width: i === currentIndex ? 10 : 8,
                      height: i === currentIndex ? 10 : 8,
                      borderRadius: '50%',
                      background: i === currentIndex ? '#C8A97E' : 'rgba(255,255,255,0.6)',
                      border: 'none', cursor: 'pointer', padding: 0,
                      transition: 'all 300ms ease',
                    }}
                  />
                ))}
              </div>

              {/* Product badge */}
              <Link
                href={`/product/${current.slug}`}
                className="absolute bottom-6 left-6 bg-cream/95 backdrop-blur-sm px-5 py-3"
                style={{
                  opacity: badgeVisible ? 1 : 0,
                  transition: 'opacity 300ms ease',
                  zIndex: 10,
                }}
              >
                <p className="font-dm text-[10px] tracking-[0.15em] uppercase text-ink-light">Now Viewing</p>
                <p className="font-cormorant font-semibold text-lg text-ink leading-tight">{current.name}</p>
                <p className="font-dm text-xs text-ink-mid">{current.price}</p>
              </Link>
            </div>

            {/* Corner accent */}
            <div className="absolute -top-4 -right-4 w-24 h-24 border border-clay/30 rounded-sm -z-10 hidden lg:block" />
          </div>

        </div>
      </div>
    </section>
  )
}
