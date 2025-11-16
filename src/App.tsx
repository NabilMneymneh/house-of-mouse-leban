import { useState } from 'react'
import { Toaster } from '@/components/ui/sonner'
import { Storefront } from '@/components/storefront/Storefront'
import { AdminPortal } from '@/components/admin/AdminPortal'
import { BottomNav } from '@/components/layout/BottomNav'

type View = 'storefront' | 'cart' | 'admin'

function App() {
  const [currentView, setCurrentView] = useState<View>('storefront')

  return (
    <div className="min-h-screen bg-background pb-20">
      <Toaster position="top-center" />
      
      {(currentView === 'storefront' || currentView === 'cart') && (
        <Storefront 
          showCart={currentView === 'cart'} 
          onCartClose={() => setCurrentView('storefront')}
        />
      )}
      {currentView === 'admin' && <AdminPortal />}
      
      <BottomNav currentView={currentView} onViewChange={setCurrentView} />
    </div>
  )
}

export default App
