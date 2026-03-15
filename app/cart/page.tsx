'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/app/context/CartContext'

const formatPrice = (price: number): string =>
  'R' + price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart()

  if (cartCount === 0) {
    return (
      <div className="pt-20 lg:pt-24 min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-cormorant font-semibold text-4xl text-ink mb-4">Your cart is empty</h1>
          <p className="font-dm text-sm text-ink-light mb-8">Start browsing our collection.</p>
          <Link
            href="/shop"
            className="inline-block font-dm text-sm font-medium bg-clay hover:bg-clay-dark text-cream px-10 py-3.5 transition-all duration-300 tracking-wide"
          >
            Shop Collection
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-20 lg:pt-24 min-h-screen bg-cream">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="font-cormorant font-semibold text-4xl lg:text-5xl text-ink mb-10">Your Cart</h1>

        <div className="space-y-6 mb-10">
          {cartItems.map(item => (
            <div key={item.cartId} className="flex gap-6 py-6 border-b border-sand-dark">
              <div className="relative w-24 h-24 bg-sand flex-shrink-0">
                <Image
                  src={item.colourImage || item.product.image}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-cormorant font-semibold text-lg text-ink">{item.product.name}</h3>
                <p className="font-dm text-xs text-ink-light mt-1">
                  Size {item.size}
                  {item.colour && ` · ${item.colour}`}
                  {item.jute && ` · ${item.jute}`}
                  {item.toe && ` · ${item.toe}`}
                </p>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center border border-sand-dark">
                    <button
                      onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                      className="px-3 py-1 font-dm text-sm text-ink-mid hover:text-ink transition-colors"
                    >−</button>
                    <span className="px-3 py-1 font-dm text-sm text-ink border-x border-sand-dark">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                      className="px-3 py-1 font-dm text-sm text-ink-mid hover:text-ink transition-colors"
                    >+</button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.cartId)}
                    className="font-dm text-xs text-ink-light hover:text-accent transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-dm text-sm text-ink">{formatPrice(item.product.price * item.quantity)}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-sand p-6">
          <div className="flex justify-between items-center mb-4">
            <span className="font-dm text-sm text-ink-mid">Subtotal</span>
            <span className="font-cormorant font-semibold text-2xl text-ink">{formatPrice(cartTotal)}</span>
          </div>
          <p className="font-dm text-xs text-ink-light mb-6">R65 flat rate delivery · Made to order</p>
          <Link
            href="/checkout"
            className="block w-full text-center font-dm text-sm font-medium bg-clay hover:bg-clay-dark text-cream py-4 transition-all duration-300 tracking-wide"
          >
            Proceed to Checkout
          </Link>
          <p className="font-dm text-xs text-ink-light text-center mt-3">
            We&apos;ll confirm your order and provide payment details.
          </p>
        </div>
      </div>
    </div>
  )
}
