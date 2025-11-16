import { useState, useEffect } from 'react'
import { ProductGrid } from './ProductGrid'
import { ProductDetail } from './ProductDetail'
import { CartSheet } from './CartSheet'
import { CheckoutDialog } from './CheckoutDialog'
import { Product } from '@/types'

interface StorefrontProps {
  showCart?: boolean
  onCartClose?: () => void
}

export function Storefront({ showCart = false, onCartClose }: StorefrontProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [cartOpen, setCartOpen] = useState(showCart)
  const [showCheckout, setShowCheckout] = useState(false)

  useEffect(() => {
    setCartOpen(showCart)
  }, [showCart])

  const handleCartClose = () => {
    setCartOpen(false)
    onCartClose?.()
  }

  return (
    <>
      <header className="sticky top-0 bg-gradient-to-r from-primary to-secondary text-primary-foreground z-40 shadow-md">
        <div className="px-5 py-4">
          <h1 className="text-2xl font-bold tracking-tight">House of Mouse</h1>
          <p className="text-sm opacity-90">Premium Computer Mice in Lebanon</p>
        </div>
      </header>

      <main className="px-5 py-6">
        <ProductGrid onProductClick={setSelectedProduct} />
      </main>

      <ProductDetail
        product={selectedProduct}
        open={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      <CartSheet
        open={cartOpen}
        onClose={handleCartClose}
        onCheckout={() => {
          setCartOpen(false)
          setShowCheckout(true)
        }}
      />

      <CheckoutDialog
        open={showCheckout}
        onClose={() => setShowCheckout(false)}
      />
    </>
  )
}
