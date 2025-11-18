export interface Product {
  id: string
  name: string
  brand: string
  price: number
  description: string
  imageUrl?: string
  imageUrls?: string[]
  specs: {
    dpi: string
    connectivity: string
    buttons: number
    weight?: string
  }
  inStock: boolean
  featured?: boolean
  colors?: string[]
}

export interface CartItem {
  productId: string
  quantity: number
}

export interface Cart {
  items: CartItem[]
}

export type OrderStatus = 'pending' | 'confirmed' | 'out-for-delivery' | 'delivered' | 'cancelled'

export interface Order {
  id: string
  customerName: string
  phone: string
  address: string
  city: string
  items: Array<{
    productId: string
    productName: string
    price: number
    quantity: number
  }>
  total: number
  status: OrderStatus
  createdAt: number
  notes?: string
}
