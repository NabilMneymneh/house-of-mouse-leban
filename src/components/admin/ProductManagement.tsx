import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Product } from '@/types'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Plus, Pencil, Trash, X } from '@phosphor-icons/react'
import { toast } from 'sonner'

interface ProductFormData {
  name: string
  brand: string
  price: string
  description: string
  imageUrl: string
  dpi: string
  connectivity: string
  buttons: string
  weight: string
  inStock: boolean
  featured: boolean
  colors: string[]
  colorInput: string
}

const INITIAL_FORM_DATA: ProductFormData = {
  name: '',
  brand: '',
  price: '',
  description: '',
  imageUrl: '',
  dpi: '',
  connectivity: 'Wireless',
  buttons: '6',
  weight: '',
  inStock: true,
  featured: false,
  colors: [],
  colorInput: ''
}

export function ProductManagement() {
  const [products, setProducts] = useKV<Product[]>('products', [])
  const [showDialog, setShowDialog] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState<ProductFormData>(INITIAL_FORM_DATA)

  const handleAddProduct = () => {
    setEditingProduct(null)
    setFormData(INITIAL_FORM_DATA)
    setShowDialog(true)
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      brand: product.brand,
      price: product.price.toString(),
      description: product.description,
      imageUrl: product.imageUrl,
      dpi: product.specs.dpi,
      connectivity: product.specs.connectivity,
      buttons: product.specs.buttons.toString(),
      weight: product.specs.weight || '',
      inStock: product.inStock,
      featured: product.featured || false,
      colors: product.colors || [],
      colorInput: ''
    })
    setShowDialog(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.brand || !formData.price || !formData.imageUrl) {
      toast.error('Please fill in all required fields')
      return
    }

    const price = parseFloat(formData.price)
    if (isNaN(price) || price <= 0) {
      toast.error('Please enter a valid price')
      return
    }

    const buttons = parseInt(formData.buttons)
    if (isNaN(buttons) || buttons <= 0) {
      toast.error('Please enter a valid number of buttons')
      return
    }

    const newProduct: Product = {
      id: editingProduct?.id || `MOUSE-${Date.now()}`,
      name: formData.name,
      brand: formData.brand,
      price,
      description: formData.description,
      imageUrl: formData.imageUrl,
      specs: {
        dpi: formData.dpi,
        connectivity: formData.connectivity,
        buttons,
        weight: formData.weight || undefined
      },
      inStock: formData.inStock,
      featured: formData.featured,
      colors: formData.colors.length > 0 ? formData.colors : undefined
    }

    if (editingProduct) {
      setProducts((currentProducts) =>
        (currentProducts ?? []).map(p => p.id === editingProduct.id ? newProduct : p)
      )
      toast.success('Product updated successfully')
    } else {
      setProducts((currentProducts) => [...(currentProducts ?? []), newProduct])
      toast.success('Product added successfully')
    }

    setShowDialog(false)
    setFormData(INITIAL_FORM_DATA)
    setEditingProduct(null)
  }

  const handleAddColor = () => {
    const color = formData.colorInput.trim()
    if (!color) {
      toast.error('Please enter a color')
      return
    }
    if (formData.colors.includes(color)) {
      toast.error('Color already added')
      return
    }
    setFormData(prev => ({
      ...prev,
      colors: [...prev.colors, color],
      colorInput: ''
    }))
  }

  const handleRemoveColor = (colorToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.filter(c => c !== colorToRemove)
    }))
  }

  const handleDeleteProduct = (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setProducts((currentProducts) =>
        (currentProducts ?? []).filter(p => p.id !== productId)
      )
      toast.success('Product deleted')
    }
  }

  const toggleStock = (productId: string) => {
    setProducts((currentProducts) =>
      (currentProducts ?? []).map(p =>
        p.id === productId ? { ...p, inStock: !p.inStock } : p
      )
    )
    toast.success('Stock status updated')
  }

  return (
    <div className="space-y-4">
      <Button
        onClick={handleAddProduct}
        className="w-full bg-accent text-accent-foreground hover:bg-accent/90 gap-2"
      >
        <Plus size={20} weight="bold" />
        Add New Product
      </Button>

      {(!products || products.length === 0) ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-muted-foreground text-lg">No products yet</p>
          <p className="text-sm text-muted-foreground mt-2">Add your first product to get started</p>
        </div>
      ) : (
        <ScrollArea className="h-[calc(100vh-300px)]">
          <div className="space-y-4">
            {products.map((product) => (
              <Card key={product.id} className="p-4">
                <div className="flex gap-4">
                  <div className="w-20 aspect-square bg-secondary rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground">{product.brand}</p>
                        <h3 className="font-semibold line-clamp-1">{product.name}</h3>
                        <p className="text-lg font-bold text-primary">${product.price.toFixed(2)}</p>
                      </div>
                      <div className="flex gap-1">
                        {product.featured && (
                          <Badge className="bg-accent text-accent-foreground">New</Badge>
                        )}
                        <Badge className={product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {product.inStock ? 'In Stock' : 'Out of Stock'}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{product.specs.dpi} DPI</span>
                      <span>•</span>
                      <span>{product.specs.connectivity}</span>
                      <span>•</span>
                      <span>{product.specs.buttons} Buttons</span>
                    </div>

                    {product.colors && product.colors.length > 0 && (
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs text-muted-foreground">Colors:</span>
                        {product.colors.map((color) => (
                          <Badge key={color} variant="outline" className="text-xs">
                            {color}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditProduct(product)}
                        className="gap-1"
                      >
                        <Pencil size={14} />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleStock(product.id)}
                        className="gap-1"
                      >
                        {product.inStock ? 'Mark Out of Stock' : 'Mark In Stock'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteProduct(product.id)}
                        className="gap-1 text-destructive hover:text-destructive"
                      >
                        <Trash size={14} />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Logitech MX Master 3S"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="brand">Brand *</Label>
              <Input
                id="brand"
                value={formData.brand}
                onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                placeholder="Logitech"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price (USD) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                placeholder="99.99"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL *</Label>
              <Input
                id="imageUrl"
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                placeholder="https://example.com/mouse.jpg"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dpi">DPI</Label>
                <Input
                  id="dpi"
                  value={formData.dpi}
                  onChange={(e) => setFormData(prev => ({ ...prev, dpi: e.target.value }))}
                  placeholder="8000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="connectivity">Connectivity</Label>
                <Input
                  id="connectivity"
                  value={formData.connectivity}
                  onChange={(e) => setFormData(prev => ({ ...prev, connectivity: e.target.value }))}
                  placeholder="Wireless"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="buttons">Number of Buttons</Label>
                <Input
                  id="buttons"
                  type="number"
                  value={formData.buttons}
                  onChange={(e) => setFormData(prev => ({ ...prev, buttons: e.target.value }))}
                  placeholder="6"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="weight">Weight (Optional)</Label>
                <Input
                  id="weight"
                  value={formData.weight}
                  onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                  placeholder="88g"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Detailed product description..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="colors">Available Colors (Optional)</Label>
              <div className="flex gap-2">
                <Input
                  id="colors"
                  value={formData.colorInput}
                  onChange={(e) => setFormData(prev => ({ ...prev, colorInput: e.target.value }))}
                  placeholder="e.g., Black, White, Blue"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleAddColor()
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddColor}
                  className="gap-1 flex-shrink-0"
                >
                  <Plus size={16} />
                  Add
                </Button>
              </div>
              {formData.colors.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.colors.map((color) => (
                    <Badge
                      key={color}
                      variant="secondary"
                      className="gap-1 pr-1"
                    >
                      {color}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 p-0 hover:bg-transparent"
                        onClick={() => handleRemoveColor(color)}
                      >
                        <X size={12} />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="inStock">In Stock</Label>
              <Switch
                id="inStock"
                checked={formData.inStock}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, inStock: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="featured">Featured (Show "New" Badge)</Label>
              <Switch
                id="featured"
                checked={formData.featured}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked }))}
              />
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowDialog(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
              >
                {editingProduct ? 'Update' : 'Add'} Product
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
