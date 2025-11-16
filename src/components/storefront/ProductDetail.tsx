import { useState } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Product } from '@/types'
import { useKV } from '@github/spark/hooks'
import { Cart } from '@/types'
import { Plus, Minus } from '@phosphor-icons/react'
import { toast } from 'sonner'

interface ProductDetailProps {
  product: Product | null
  open: boolean
  onClose: () => void
}

export function ProductDetail({ product, open, onClose }: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1)
  const [cart, setCart] = useKV<Cart>('cart', { items: [] })

  if (!product) return null

  const handleAddToCart = () => {
    setCart((currentCart) => {
      const items = currentCart?.items ?? []
      const existingItem = items.find(item => item.productId === product.id)
      
      if (existingItem) {
        return {
          items: items.map(item =>
            item.productId === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
        }
      }
      
      return {
        items: [...items, { productId: product.id, quantity }]
      }
    })
    
    toast.success(`Added ${quantity}x ${product.name} to cart`)
    setQuantity(1)
    onClose()
  }

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[90vh] overflow-y-auto px-[20px]">
        <SheetHeader>
          <SheetTitle className="text-left">{product.name}</SheetTitle>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          <div className="aspect-square bg-secondary rounded-lg overflow-hidden">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-sm text-muted-foreground font-medium">{product.brand}</p>
                <h2 className="text-2xl font-bold text-primary mt-1">
                  ${product.price.toFixed(2)}
                </h2>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                In Stock
              </Badge>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-3">
              Specifications
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg" style={{ backgroundColor: '#f5f5f5' }}>
                <p className="text-xs text-muted-foreground">DPI</p>
                <p className="font-semibold">{product.specs.dpi}</p>
              </div>
              <div className="p-3 rounded-lg" style={{ backgroundColor: '#f5f5f5' }}>
                <p className="text-xs text-muted-foreground">Connectivity</p>
                <p className="font-semibold">{product.specs.connectivity}</p>
              </div>
              <div className="p-3 rounded-lg" style={{ backgroundColor: '#f5f5f5' }}>
                <p className="text-xs text-muted-foreground">Buttons</p>
                <p className="font-semibold">{product.specs.buttons}</p>
              </div>
              {product.specs.weight && (
                <div className="p-3 rounded-lg" style={{ backgroundColor: '#f5f5f5' }}>
                  <p className="text-xs text-muted-foreground">Weight</p>
                  <p className="font-semibold">{product.specs.weight}</p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {product.colors && product.colors.length > 0 && (
            <>
              <div>
                <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-3">
                  Available Colors
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <Badge key={color} variant="secondary" className="text-sm py-1.5 px-3">
                      {color}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />
            </>
          )}

          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-3">
              Description
            </h3>
            <p className="text-sm leading-relaxed">{product.description}</p>
          </div>

          <div className="sticky bottom-0 left-0 right-0 bg-background pt-4 pb-6 border-t">
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-border rounded-lg">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="rounded-r-none"
                >
                  <Minus size={20} />
                </Button>
                <span className="px-4 font-semibold min-w-[3rem] text-center">
                  {quantity}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                  className="rounded-l-none"
                >
                  <Plus size={20} />
                </Button>
              </div>
              
              <Button
                className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90 h-12 text-base font-semibold"
                onClick={handleAddToCart}
              >
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
