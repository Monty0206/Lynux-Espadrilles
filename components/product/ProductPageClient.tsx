'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getProductBySlug, getAllProducts } from '@/lib/products'
import { useCart } from '@/app/context/CartContext'
import ProductCard from '@/components/shop/ProductCard'
import { Product } from '@/types'

const formatPrice = (price: number): string =>
  'R' + price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

function StarRating({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(star => (
        <svg key={star} width={size} height={size} viewBox="0 0 24 24"
          fill={star <= Math.round(rating) ? 'currentColor' : 'none'}
          stroke="currentColor" strokeWidth="1.5" className="text-clay">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
    </div>
  )
}

function SizeGuideModal({ onClose }: { onClose: () => void }) {
  const sizes = [
    { sa: 3, eu: 36, length: '22.5cm' },
    { sa: 4, eu: 37, length: '23.5cm' },
    { sa: 5, eu: 38, length: '24.5cm' },
    { sa: 6, eu: 39, length: '25.5cm' },
    { sa: 7, eu: 40, length: '26cm' },
    { sa: 8, eu: 41, length: '26.5cm' },
    { sa: 9, eu: 42, length: '27cm' },
  ]
  return (
    <div className="fixed inset-0 bg-ink/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-cream max-w-sm w-full p-8 relative" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-ink-light hover:text-ink transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
        <h3 className="font-cormorant font-semibold text-2xl text-ink mb-6">Size Guide</h3>
        <table className="w-full">
          <thead>
            <tr className="border-b border-sand-dark">
              <th className="font-dm text-xs text-ink-light text-left pb-3">SA Size</th>
              <th className="font-dm text-xs text-ink-light text-left pb-3">EU Size</th>
              <th className="font-dm text-xs text-ink-light text-left pb-3">Foot Length</th>
            </tr>
          </thead>
          <tbody>
            {sizes.map(({ sa, eu, length }) => (
              <tr key={sa} className="border-b border-sand/50">
                <td className="font-dm text-sm text-ink py-3">{sa}</td>
                <td className="font-dm text-sm text-ink py-3">{eu}</td>
                <td className="font-dm text-sm text-ink py-3">{length}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="font-dm text-xs text-ink-light mt-4">Measure your foot from heel to toe. If between sizes, size up.</p>
      </div>
    </div>
  )
}

export default function ProductPageClient({ slug }: { slug: string }) {
  const product = getProductBySlug(slug)

  const [mainImage, setMainImage] = useState<string>(product?.images[0] ?? '')
  const [selectedSize, setSelectedSize] = useState<number | null>(null)
  const [selectedJute, setSelectedJute] = useState<string | null>(null)
  const [selectedToe, setSelectedToe] = useState<string | null>(null)
  const [selectedColour, setSelectedColour] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [showSizeGuide, setShowSizeGuide] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)
  const [imageTransition, setImageTransition] = useState(true)
  const { addToCart } = useCart()

  useEffect(() => {
    if (product && !mainImage) setMainImage(product.images[0])
  }, [product, mainImage])

  if (!product) {
    return (
      <div className="pt-24 min-h-screen bg-cream flex items-center justify-center">
        <p className="font-dm text-sm text-ink-light">Product not found.</p>
      </div>
    )
  }

  const allProducts = getAllProducts()
  const related = allProducts.filter(p => p.slug !== product.slug).slice(0, 3)

  const needsJute = product.juteOptions.length > 0
  const needsToe = product.toeOptions.length > 0
  const needsColour = product.colours.length > 0

  const isComplete =
    selectedSize !== null &&
    (!needsJute || selectedJute !== null) &&
    (!needsToe || selectedToe !== null) &&
    (!needsColour || selectedColour !== null)

  const getMissingText = () => {
    const missing: string[] = []
    if (!selectedSize) missing.push('a size')
    if (needsColour && !selectedColour) missing.push('a colour')
    if (needsJute && !selectedJute) missing.push('a sole style')
    if (needsToe && !selectedToe) missing.push('a toe style')
    if (!missing.length) return null
    return `Please select ${missing.join(' and ')} to continue`
  }

  const handleSwitchImage = (img: string) => {
    setImageTransition(false)
    setTimeout(() => { setMainImage(img); setImageTransition(true) }, 150)
  }

  const handleAddToCart = () => {
    if (!isComplete) return
    addToCart(product, selectedSize!, selectedColour ?? '', selectedJute ?? '', selectedToe ?? '', quantity)
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  const pillClass = (active: boolean) =>
    `px-4 py-2 text-xs font-dm tracking-wide border transition-all duration-200 cursor-pointer ${
      active
        ? 'bg-clay border-clay text-cream'
        : 'bg-cream border-sand-dark text-ink hover:bg-sand'
    }`

  return (
    <>
      {showSizeGuide && <SizeGuideModal onClose={() => setShowSizeGuide(false)} />}
      <div className="pt-20 lg:pt-24 min-h-screen bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 mb-8">
            <Link href="/" className="font-dm text-xs text-ink-light hover:text-ink transition-colors">Home</Link>
            <span className="text-ink-light text-xs">/</span>
            <Link href="/shop" className="font-dm text-xs text-ink-light hover:text-ink transition-colors">Shop</Link>
            <span className="text-ink-light text-xs">/</span>
            <span className="font-dm text-xs text-ink">{product.name}</span>
          </nav>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-10 lg:gap-16">
            {/* Gallery */}
            <div>
              <div className="relative aspect-square bg-sand overflow-hidden mb-4">
                {mainImage && <Image
                  src={mainImage}
                  alt={product.name}
                  fill
                  className={`object-cover transition-opacity duration-300 ${imageTransition ? 'opacity-100' : 'opacity-0'}`}
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  priority
                />}
              </div>
              {product.images.length > 1 && (
                <div className="flex gap-3 flex-wrap">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => handleSwitchImage(img)}
                      className={`relative w-20 h-20 flex-shrink-0 overflow-hidden border-2 transition-all duration-200 ${
                        mainImage === img ? 'border-clay' : 'border-transparent hover:border-sand-dark'
                      }`}
                    >
                      <Image src={img} alt={`${product.name} view ${i + 1}`} fill className="object-cover" sizes="80px" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              <p className="font-dm text-xs tracking-[0.2em] uppercase text-clay mb-3">Lynux Collection</p>
              <h1 className="font-cormorant font-semibold text-4xl lg:text-5xl text-ink mb-4 leading-tight">{product.name}</h1>

              {product.rating && (
                <div className="flex items-center gap-2 mb-4">
                  <StarRating rating={product.rating} />
                  <span className="font-dm text-xs text-ink-light">({product.reviewCount} review{product.reviewCount !== 1 ? 's' : ''})</span>
                </div>
              )}

              <div className="mb-5">
                {product.priceRange ? (
                  <p className="font-dm text-2xl text-ink-mid">
                    {formatPrice(product.priceRange.min)} – {formatPrice(product.priceRange.max)}
                  </p>
                ) : (
                  <p className="font-dm text-2xl text-ink-mid">{formatPrice(product.price)}</p>
                )}
              </div>

              <hr className="border-sand-dark mb-5" />

              <p className="font-dm text-sm text-ink-light leading-relaxed mb-5">{product.description}</p>

              <ul className="space-y-2 mb-8">
                {product.features.map(f => (
                  <li key={f} className="flex items-start gap-2 font-dm text-sm text-ink-mid">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-clay flex-shrink-0 mt-0.5">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>

              {/* Size */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-dm text-xs uppercase tracking-[0.15em] text-ink font-medium">
                    Size {selectedSize ? `— ${selectedSize}` : ''}
                  </span>
                  <button onClick={() => setShowSizeGuide(true)} className="font-dm text-xs text-clay hover:text-clay-dark underline underline-offset-2 transition-colors">
                    View Size Guide
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map(size => (
                    <button key={size} onClick={() => setSelectedSize(size)} className={pillClass(selectedSize === size)}>{size}</button>
                  ))}
                </div>
              </div>

              {/* Jute */}
              {needsJute && (
                <div className="mb-6">
                  <p className="font-dm text-xs uppercase tracking-[0.15em] text-ink font-medium mb-3">
                    Sole Style {selectedJute ? `— ${selectedJute}` : ''}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {product.juteOptions.map(opt => (
                      <button key={opt} onClick={() => setSelectedJute(opt)} className={pillClass(selectedJute === opt)}>{opt}</button>
                    ))}
                  </div>
                </div>
              )}

              {/* Toe */}
              {needsToe && (
                <div className="mb-6">
                  <p className="font-dm text-xs uppercase tracking-[0.15em] text-ink font-medium mb-3">
                    Toe Style {selectedToe ? `— ${selectedToe}` : ''}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {product.toeOptions.map(opt => (
                      <button key={opt} onClick={() => setSelectedToe(opt)} className={pillClass(selectedToe === opt)}>{opt}</button>
                    ))}
                  </div>
                </div>
              )}

              {/* Colour */}
              {needsColour && (
                <div className="mb-6">
                  <p className="font-dm text-xs uppercase tracking-[0.15em] text-ink font-medium mb-3">
                    Colour{selectedColour ? `: ${selectedColour}` : ''}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {product.colours.map(colour => (
                      <button
                        key={colour.name}
                        onClick={() => setSelectedColour(colour.name)}
                        title={colour.name}
                        className="transition-all duration-200 hover:scale-110 flex-shrink-0"
                        style={{
                          width: '36px', height: '36px', borderRadius: '50%',
                          background: colour.hex ? colour.hex : 'conic-gradient(red, yellow, green, blue, purple, red)',
                          border: (colour.hex === '#FDFCF9' || colour.hex === '#FFFFF0') ? '1px solid #EAE3D2' : 'none',
                          outline: selectedColour === colour.name ? '2px solid #C8A97E' : 'none',
                          outlineOffset: '3px',
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mb-6">
                <p className="font-dm text-xs uppercase tracking-[0.15em] text-ink font-medium mb-3">Quantity</p>
                <div className="flex items-center border border-sand-dark w-fit">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-4 py-2.5 font-dm text-sm text-ink-mid hover:text-ink hover:bg-sand transition-all">−</button>
                  <span className="px-5 py-2.5 font-dm text-sm text-ink border-x border-sand-dark min-w-[3rem] text-center">{quantity}</span>
                  <button onClick={() => setQuantity(q => q + 1)} className="px-4 py-2.5 font-dm text-sm text-ink-mid hover:text-ink hover:bg-sand transition-all">+</button>
                </div>
              </div>

              {!isComplete && (
                <p className="font-dm text-xs text-ink-light italic mb-4">{getMissingText()}</p>
              )}

              <button
                onClick={handleAddToCart}
                disabled={!isComplete}
                className={`w-full py-4 font-dm text-sm font-medium tracking-widest uppercase transition-all duration-300 mb-6 ${
                  isComplete
                    ? addedToCart ? 'bg-clay-dark text-cream' : 'bg-clay hover:bg-clay-dark text-cream'
                    : 'bg-sand-dark text-ink-light cursor-not-allowed'
                }`}
              >
                {addedToCart ? 'Added ✓' : 'Add to Cart'}
              </button>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-3 py-6 border-t border-sand-dark">
                {[
                  { label: 'Handcrafted to Order', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-clay"><path d="M12 22C6.5 22 2 17.5 2 12S6.5 2 12 2s10 4.5 10 10-4.5 10-10 10z"/><path d="M8 12l3 3 5-5"/></svg> },
                  { label: 'R65 Flat Rate Delivery', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-clay"><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 4v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg> },
                  { label: 'Free Defect Exchange', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-clay"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg> },
                ].map(({ label, icon }) => (
                  <div key={label} className="flex flex-col items-center text-center gap-2">
                    {icon}
                    <span className="font-dm text-[10px] text-ink-light leading-tight">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Reviews */}
          <div className="mt-20 border-t border-sand-dark pt-12">
            <h2 className="font-cormorant font-semibold text-3xl text-ink mb-8">Customer Reviews</h2>
            {product.reviews && product.reviews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {product.reviews.map((review, i) => (
                  <div key={i} className="bg-sand p-6">
                    <StarRating rating={review.rating} size={14} />
                    <p className="font-dm text-sm text-ink-mid leading-relaxed mt-3 mb-4">&ldquo;{review.comment}&rdquo;</p>
                    <p className="font-dm text-xs font-medium text-ink">{review.author}</p>
                    <p className="font-dm text-xs text-ink-light">{review.date}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-sand p-10 text-center">
                <p className="font-cormorant italic text-2xl text-ink-light mb-2">No reviews yet</p>
                <p className="font-dm text-sm text-ink-light">Be the first to review this style.</p>
              </div>
            )}
          </div>

          {/* Related */}
          <div className="mt-20 border-t border-sand-dark pt-12">
            <h2 className="font-cormorant font-semibold text-3xl text-ink mb-8">You might also like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>

        </div>
      </div>
    </>
  )
}
