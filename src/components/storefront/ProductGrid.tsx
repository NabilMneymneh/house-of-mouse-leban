import { useState, useMemo, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Product, Cart } from '@/types'
import { ProductCard } from './ProductCard'
import { ProductFilters, SortOption } from './ProductFilters'
import { toast } from 'sonner'
import { SAMPLE_PRODUCTS } from '@/lib/sampleProducts'

interface ProductGridProps {
  onProductClick: (product: Product) => void
}

export function ProductGrid({ onProductClick }: ProductGridProps) {
  const [products, setProducts] = useKV<Product[]>('products', [])
  const [cart, setCart] = useKV<Cart>('cart', { items: [] })

  useEffect(() => {
    if (!products || products.length === 0) {
      setProducts(SAMPLE_PRODUCTS)
    }
  }, [])
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [sortOption, setSortOption] = useState<SortOption>('none')

  const brands = useMemo(() => {
    if (!products) return []
    const brandSet = new Set(products.filter(p => p.inStock).map(p => p.brand))
    return Array.from(brandSet).sort()
  }, [products])

  const colors = useMemo(() => {
    if (!products) return []
    const colorSet = new Set<string>()
    products.filter(p => p.inStock).forEach(p => {
      if (p.colors) {
        p.colors.forEach(color => colorSet.add(color))
      }
    })
    return Array.from(colorSet).sort()
  }, [products])

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products?.filter(p => p.inStock) ?? []

    if (selectedBrand) {
      filtered = filtered.filter(p => p.brand === selectedBrand)
    }

    if (selectedColor) {
      filtered = filtered.filter(p => p.colors?.includes(selectedColor))
    }

    if (sortOption === 'price-asc') {
      filtered = [...filtered].sort((a, b) => a.price - b.price)
    } else if (sortOption === 'price-desc') {
      filtered = [...filtered].sort((a, b) => b.price - a.price)
    }

    return filtered
  }, [products, selectedBrand, selectedColor, sortOption])

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation()
    
    setCart((currentCart) => {
      const items = currentCart?.items ?? []
      const existingItem = items.find(item => item.productId === product.id)
      
      if (existingItem) {
        return {
          items: items.map(item =>
            item.productId === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        }
      } else {
        return {
          items: [...items, { productId: product.id, quantity: 1 }]
        }
      }
    })
    
    toast.success(`${product.name} added to cart`)
  }

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
      {(brands.length > 1 || colors.length > 0) && (
        <ProductFilters
          brands={brands}
          colors={colors}
          selectedBrand={selectedBrand}
          selectedColor={selectedColor}
          sortOption={sortOption}
          onBrandChange={setSelectedBrand}
          onColorChange={setSelectedColor}
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
              onAddToCart={(e) => handleAddToCart(product, e)}
            />
          ))}
        </div>
      )}
    </>
  )
}
