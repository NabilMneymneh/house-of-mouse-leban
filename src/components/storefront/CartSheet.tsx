import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { useKV } from '@github/spark/hooks'
import { Cart, Product } from '@/types'
import { Trash, Plus, Minus } from '@phosphor-icons/react'
import { toast } from 'sonner'

interface CartSheetProps {
  open: boolean
  onClose: () => void
  onCheckout: () => void
}

export function CartSheet({ open, onClose, onCheckout }: CartSheetProps) {
  const [cart, setCart] = useKV<Cart>('cart', { items: [] })
  const [products] = useKV<Product[]>('products', [])

  const cartItems = cart?.items.map(item => {
    const product = products?.find(p => p.id === item.productId)
    return { ...item, product }
  }).filter(item => item.product) ?? []

  const total = cartItems.reduce(
    (sum, item) => sum + (item.product!.price * item.quantity),
    0
  )

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return
    
    setCart((currentCart) => ({
      items: (currentCart?.items || []).map(item =>
        item.productId === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    }))
  }

  const removeItem = (productId: string) => {
    setCart((currentCart) => ({
      items: (currentCart?.items || []).filter(item => item.productId !== productId)
    }))
    toast.success('Item removed from cart')
  }

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty')
      return
    }
    onCheckout()
  }

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-md px-5">
        <SheetHeader>
          <SheetTitle>Shopping Cart ({cartItems.length})</SheetTitle>
        </SheetHeader>

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] text-center px-4">
            <p className="text-muted-foreground text-lg mb-2">Your cart is empty</p>
            <p className="text-sm text-muted-foreground mb-6">
              Add some mice to get started
            </p>
            <Button onClick={onClose}>Continue Shopping</Button>
          </div>
        ) : (
          <div className="flex flex-col h-[calc(100vh-100px)] mt-6">
            <ScrollArea className="flex-1 -mx-5 px-5">
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.productId} className="flex gap-4 pb-4 border-b">
                    <div className="w-20 h-20 bg-secondary rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.product!.imageUrl}
                        alt={item.product!.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm line-clamp-1">
                        {item.product!.name}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        ${item.product!.price.toFixed(2)}
                      </p>
                      
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center border border-border rounded">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          >
                            <Minus size={14} />
                          </Button>
                          <span className="px-2 text-sm font-medium min-w-[2rem] text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          >
                            <Plus size={14} />
                          </Button>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive"
                          onClick={() => removeItem(item.productId)}
                        >
                          <Trash size={16} />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-bold">
                        ${(item.product!.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="pt-4 pb-10 border-t space-y-4">
              <div className="flex items-center justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">${total.toFixed(2)}</span>
              </div>
              
              <Button
                className="w-full h-12 bg-accent text-accent-foreground hover:bg-accent/90 font-semibold"
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
