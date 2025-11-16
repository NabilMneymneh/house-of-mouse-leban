import { useKV } from '@github/spark/hooks'
import { Product } from '@/types'
import { ProductCard } from './ProductCard'

interface ProductGridProps {
  onProductClick: (product: Product) => void
}

export function ProductGrid({ onProductClick }: ProductGridProps) {
  const [products] = useKV<Product[]>('products', [])

  const availableProducts = products?.filter(p => p.inStock) ?? []

  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-muted-foreground text-lg">No products available yet</p>
        <p className="text-sm text-muted-foreground mt-2">Check back soon for our collection</p>
      </div>
    )
  }

  if (availableProducts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-muted-foreground text-lg">All products are currently out of stock</p>
        <p className="text-sm text-muted-foreground mt-2">Check back soon</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {availableProducts.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onClick={() => onProductClick(product)}
        />
      ))}
    </div>
  )
}
