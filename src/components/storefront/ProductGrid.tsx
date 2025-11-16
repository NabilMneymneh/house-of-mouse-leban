import { useState, useMemo } from 'react'
import { useKV } from '@github/spark/hooks'
import { Product } from '@/types'
import { ProductCard } from './ProductCard'
import { ProductFilters, SortOption } from './ProductFilters'

interface ProductGridProps {
  onProductClick: (product: Product) => void
}

export function ProductGrid({ onProductClick }: ProductGridProps) {
  const [products] = useKV<Product[]>('products', [])
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null)
  const [sortOption, setSortOption] = useState<SortOption>('none')

  const brands = useMemo(() => {
    if (!products) return []
    const brandSet = new Set(products.filter(p => p.inStock).map(p => p.brand))
    return Array.from(brandSet).sort()
  }, [products])

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products?.filter(p => p.inStock) ?? []

    if (selectedBrand) {
      filtered = filtered.filter(p => p.brand === selectedBrand)
    }

    if (sortOption === 'price-asc') {
      filtered = [...filtered].sort((a, b) => a.price - b.price)
    } else if (sortOption === 'price-desc') {
      filtered = [...filtered].sort((a, b) => b.price - a.price)
    }

    return filtered
  }, [products, selectedBrand, sortOption])

  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-muted-foreground text-lg">No products available yet</p>
        <p className="text-sm text-muted-foreground mt-2">Check back soon for our collection</p>
      </div>
    )
  }

  const availableProducts = products?.filter(p => p.inStock) ?? []

  if (availableProducts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-muted-foreground text-lg">All products are currently out of stock</p>
        <p className="text-sm text-muted-foreground mt-2">Check back soon</p>
      </div>
    )
  }

  return (
    <>
      {brands.length > 1 && (
        <ProductFilters
          brands={brands}
          selectedBrand={selectedBrand}
          sortOption={sortOption}
          onBrandChange={setSelectedBrand}
          onSortChange={setSortOption}
        />
      )}

      {filteredAndSortedProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-muted-foreground text-lg">No products match your filters</p>
          <p className="text-sm text-muted-foreground mt-2">Try adjusting your selection</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {filteredAndSortedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={() => onProductClick(product)}
            />
          ))}
        </div>
      )}
    </>
  )
}
