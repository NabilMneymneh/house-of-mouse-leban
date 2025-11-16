import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Order, OrderStatus } from '@/types'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string }> = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  confirmed: { label: 'Confirmed', color: 'bg-blue-100 text-blue-800' },
  'out-for-delivery': { label: 'Out for Delivery', color: 'bg-purple-100 text-purple-800' },
  delivered: { label: 'Delivered', color: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800' },
}

export function OrderManagement() {
  const [orders, setOrders] = useKV<Order[]>('orders', [])
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all')

  const filteredOrders = (orders ?? []).filter(order => 
    statusFilter === 'all' || order.status === statusFilter
  )

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((currentOrders) => 
      (currentOrders ?? []).map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    )
    toast.success('Order status updated')
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-muted-foreground text-lg">No orders yet</p>
        <p className="text-sm text-muted-foreground mt-2">Orders will appear here when customers place them</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setStatusFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
            statusFilter === 'all' 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-secondary text-secondary-foreground'
          }`}
        >
          All ({orders.length})
        </button>
        {Object.entries(STATUS_CONFIG).map(([status, config]) => {
          const count = orders.filter(o => o.status === status).length
          return (
            <button
              key={status}
              onClick={() => setStatusFilter(status as OrderStatus)}
              className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
                statusFilter === status 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-secondary text-secondary-foreground'
              }`}
            >
              {config.label} ({count})
            </button>
          )
        })}
      </div>

      <ScrollArea className="h-[calc(100vh-300px)]">
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <Card key={order.id} className="p-4">
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-bold text-sm">Order #{order.id}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(order.createdAt)}</p>
                  </div>
                  <Badge className={STATUS_CONFIG[order.status].color}>
                    {STATUS_CONFIG[order.status].label}
                  </Badge>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Customer</p>
                    <p className="font-semibold">{order.customerName}</p>
                    <p className="text-sm">{order.phone}</p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Delivery Address</p>
                    <p className="text-sm">{order.address}</p>
                    <p className="text-sm font-medium">{order.city}</p>
                  </div>

                  {order.notes && (
                    <div>
                      <p className="text-xs text-muted-foreground font-medium">Notes</p>
                      <p className="text-sm">{order.notes}</p>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground font-medium">Items</p>
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span>{item.quantity}x {item.productName}</span>
                      <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between font-bold text-primary pt-2 border-t">
                    <span>Total</span>
                    <span>${order.total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground font-medium">Update Status</p>
                  <Select
                    value={order.status}
                    onValueChange={(value) => updateOrderStatus(order.id, value as OrderStatus)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(STATUS_CONFIG).map(([status, config]) => (
                        <SelectItem key={status} value={status}>
                          {config.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
