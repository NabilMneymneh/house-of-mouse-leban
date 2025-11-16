import { useEffect, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { OrderManagement } from './OrderManagement'
import { ProductManagement } from './ProductManagement'
import { Package, ShoppingBag } from '@phosphor-icons/react'

export function AdminPortal() {
  const [user, setUser] = useState<{ isOwner: boolean } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await window.spark.user()
        setUser(userData)
      } catch (error) {
        console.error('Failed to get user:', error)
      } finally {
        setLoading(false)
      }
    }
    checkAuth()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-5rem)]">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (!user?.isOwner) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-5rem)] px-4 text-center">
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg max-w-md">
          <h2 className="font-bold text-lg mb-2">Access Denied</h2>
          <p className="text-sm">
            Only the shop owner can access the admin portal.
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      <header className="sticky top-0 bg-primary text-primary-foreground z-40 shadow-md">
        <div className="px-5 py-4">
          <h1 className="text-2xl font-bold tracking-tight">Admin Portal</h1>
          <p className="text-sm opacity-90">Manage orders and products</p>
        </div>
      </header>

      <main className="px-5 py-6">
        <Tabs defaultValue="orders" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="orders" className="gap-2">
              <Package size={18} />
              Orders
            </TabsTrigger>
            <TabsTrigger value="products" className="gap-2">
              <ShoppingBag size={18} />
              Products
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <OrderManagement />
          </TabsContent>

          <TabsContent value="products">
            <ProductManagement />
          </TabsContent>
        </Tabs>
      </main>
    </>
  )
}
