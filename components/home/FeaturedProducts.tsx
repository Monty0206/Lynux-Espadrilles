import Link from 'next/link'
import { getFeaturedProducts } from '@/lib/products'
import ProductCard from '@/components/shop/ProductCard'

export default function FeaturedProducts() {
  const featured = getFeaturedProducts()

  return (
    <section className="py-20 lg:py-28 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="font-dm text-xs tracking-[0.25em] uppercase text-clay font-medium mb-3">
            Curated for you
          </p>
          <h2 className="font-cormorant font-semibold text-4xl lg:text-5xl text-ink mb-4">
            Featured Collection
          </h2>
          <p className="font-dm text-base text-ink-light max-w-md mx-auto">
            Handcrafted with love, designed for you
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-12">
          {featured.slice(0, 4).map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/shop"
            className="inline-block font-dm text-sm font-medium border border-ink text-ink hover:bg-ink hover:text-cream px-10 py-3.5 transition-all duration-300 tracking-wide"
          >
            View All
          </Link>
        </div>
      </div>
    </section>
  )
}
