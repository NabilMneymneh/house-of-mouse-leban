import { ShoppingCart, House, User } from '@phosphor-icons/react'
import { useKV } from '@github/spark/hooks'
import { Cart } from '@/types'

type View = 'storefront' | 'cart' | 'admin'

interface BottomNavProps {
  currentView: View
  onViewChange: (view: View) => void
  showAdmin?: boolean
}

export function BottomNav({ currentView, onViewChange, showAdmin = true }: BottomNavProps) {
  const [cart] = useKV<Cart>('cart', { items: [] })
  
  const cartItemCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0

  const allNavItems = [
    { id: 'storefront' as View, icon: House, label: 'Shop' },
    { id: 'cart' as View, icon: ShoppingCart, label: 'Cart', badge: cartItemCount },
    { id: 'admin' as View, icon: User, label: 'Admin' },
  ]

  const navItems = showAdmin ? allNavItems : allNavItems.filter(item => item.id !== 'admin')

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-border z-50">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = currentView === item.id
          
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <div className="relative">
                <Icon size={24} weight={isActive ? 'fill' : 'regular'} />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
              </div>
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
