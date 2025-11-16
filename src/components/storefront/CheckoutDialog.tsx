import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useKV } from '@github/spark/hooks'
import { Cart, Order, Product } from '@/types'
import { toast } from 'sonner'

interface CheckoutDialogProps {
  open: boolean
  onClose: () => void
}

const LEBANESE_CITIES = [
  'Beirut', 'Tripoli', 'Sidon', 'Tyre', 'Nabatieh', 'Zahle', 'Baalbek', 
  'Jounieh', 'Byblos', 'Batroun', 'Aley', 'Bhamdoun'
]

export function CheckoutDialog({ open, onClose }: CheckoutDialogProps) {
  const [cart, setCart] = useKV<Cart>('cart', { items: [] })
  const [products] = useKV<Product[]>('products', [])
  const [orders, setOrders] = useKV<Order[]>('orders', [])
  
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    address: '',
    city: '',
    notes: ''
  })
  
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Name is required'
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (!/^(\+961|961|0)?[0-9]{7,8}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid Lebanese phone number'
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required'
    }
    
    if (!formData.city) {
      newErrors.city = 'City is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error('Please fill in all required fields')
      return
    }

    if (!cart?.items || cart.items.length === 0) {
      toast.error('Your cart is empty')
      return
    }

    setIsSubmitting(true)

    const orderItems = cart.items.map(item => {
      const product = products?.find(p => p.id === item.productId)
      return {
        productId: item.productId,
        productName: product?.name ?? 'Unknown Product',
        price: product?.price ?? 0,
        quantity: item.quantity
      }
    })

    const total = orderItems.reduce(
      (sum, item) => sum + (item.price * item.quantity),
      0
    )

    const newOrder: Order = {
      id: `ORD-${Date.now()}`,
      customerName: formData.customerName,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
      items: orderItems,
      total,
      status: 'pending',
      createdAt: Date.now(),
      notes: formData.notes || undefined
    }

    setOrders((currentOrders) => [newOrder, ...(currentOrders ?? [])])
    setCart({ items: [] })

    toast.success(`Order placed! Order #${newOrder.id}`)
    
    setFormData({
      customerName: '',
      phone: '',
      address: '',
      city: '',
      notes: ''
    })
    
    setIsSubmitting(false)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Checkout</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="customerName">Full Name *</Label>
            <Input
              id="customerName"
              value={formData.customerName}
              onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
              className={errors.customerName ? 'border-destructive' : ''}
            />
            {errors.customerName && (
              <p className="text-sm text-destructive">{errors.customerName}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+961 XX XXX XXX"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              className={errors.phone ? 'border-destructive' : ''}
            />
            {errors.phone && (
              <p className="text-sm text-destructive">{errors.phone}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">City *</Label>
            <Select value={formData.city} onValueChange={(value) => setFormData(prev => ({ ...prev, city: value }))}>
              <SelectTrigger id="city" className={errors.city ? 'border-destructive' : ''}>
                <SelectValue placeholder="Select city" />
              </SelectTrigger>
              <SelectContent>
                {LEBANESE_CITIES.map(city => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.city && (
              <p className="text-sm text-destructive">{errors.city}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Delivery Address *</Label>
            <Textarea
              id="address"
              placeholder="Street, Building, Floor, etc."
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              className={errors.address ? 'border-destructive' : ''}
              rows={3}
            />
            {errors.address && (
              <p className="text-sm text-destructive">{errors.address}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Order Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Any special instructions..."
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={2}
            />
          </div>

          <div className="bg-secondary p-4 rounded-lg">
            <p className="text-sm text-muted-foreground mb-2">Payment Method</p>
            <p className="font-semibold">💵 Cash on Delivery</p>
          </div>

          <Button
            type="submit"
            className="w-full h-12 bg-accent text-accent-foreground hover:bg-accent/90 font-semibold"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Placing Order...' : 'Place Order'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
