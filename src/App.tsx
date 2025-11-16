import { useState, useEffect } from 'react'
import { Toaster } from '@/components/ui/sonner'
import { Storefront } from '@/components/storefront/Storefront'
import { AdminPortal } from '@/components/admin/AdminPortal'
import { BottomNav } from '@/components/layout/BottomNav'

type View = 'storefront' | 'cart' | 'admin'

function App() {
  const [currentView, setCurrentView] = useState<View>('storefront')

  useEffect(() => {
    const checkPath = () => {
      if (window.location.pathname === '/crew') {
        setCurrentView('admin')
      }
    }
    
    checkPath()
    
    window.addEventListener('popstate', checkPath)
    return () => window.removeEventListener('popstate', checkPath)
  }, [])

  const handleViewChange = (view: View) => {
    setCurrentView(view)
    if (view === 'admin') {
      window.history.pushState({}, '', '/crew')
    } else {
      window.history.pushState({}, '', '/')
    }
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <Toaster position="top-center" />
      
      {(currentView === 'storefront' || currentView === 'cart') && (
        <Storefront 
          showCart={currentView === 'cart'} 
          onCartClose={() => handleViewChange('storefront')}
        />
      )}
      {currentView === 'admin' && <AdminPortal />}
      
      <BottomNav currentView={currentView} onViewChange={handleViewChange} showAdmin={true} />
    </div>
  )
}

export default App
