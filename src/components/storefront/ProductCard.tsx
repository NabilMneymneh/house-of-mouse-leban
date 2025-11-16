import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Product } from '@/types'

interface ProductCardProps {
  product: Product
  onClick: () => void
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  return (
    <Card 
      className="overflow-hidden cursor-pointer transition-all hover:shadow-lg active:scale-[0.98]"
      onClick={onClick}
    >
      <div className="aspect-square bg-secondary relative">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        {product.featured && (
          <Badge className="absolute top-2 right-2 bg-accent text-accent-foreground">
            New
          </Badge>
        )}
      </div>
      
      <div className="p-3 space-y-2">
        <div>
          <p className="text-xs text-muted-foreground font-medium">{product.brand}</p>
          <h3 className="font-semibold text-sm line-clamp-2">{product.name}</h3>
        </div>
        
        {product.colors && product.colors.length > 0 && (
          <div className="flex items-center gap-1 flex-wrap">
            {product.colors.slice(0, 3).map((color) => (
              <Badge key={color} variant="outline" className="text-xs px-1.5 py-0">
                {color}
              </Badge>
            ))}
            {product.colors.length > 3 && (
              <span className="text-xs text-muted-foreground">+{product.colors.length - 3}</span>
            )}
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <p className="text-lg font-bold text-primary">
            ${product.price.toFixed(2)}
          </p>
          <p className="text-xs text-muted-foreground">{product.specs.connectivity}</p>
        </div>
      </div>
    </Card>
  )
}
