import { useLocation } from 'react-router-dom'
import { useAppStore, type ViewName } from '@/stores/appStore'
import { Home, Grid, TrendingDown, Building2, Heart, User } from 'lucide-react'

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/categories', label: 'Categories', icon: Grid },
  { path: '/price-drop', label: 'Price Drop', icon: TrendingDown },
  { path: '/hotels', label: 'Hotels', icon: Building2 },
  { path: '/wishlist', label: 'Wishlist', icon: Heart },
  { path: '/account', label: 'Account', icon: User },
] as const

export function BottomNav() {
  const location = useLocation()
  const { setCurrentView } = useAppStore()

  const handleNavClick = (path: string) => {
    setCurrentView(path.slice(1) as ViewName || 'home')
  }

  return (
    <nav className="bottom-nav-bar fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-border-subtle flex items-center justify-around z-50 md:hidden">
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = location.pathname === item.path

        return (
          <button
            key={item.path}
            onClick={() => handleNavClick(item.path)}
            className={`nav-tab-item flex flex-col items-center gap-1 w-[58px] transition-all ${
              isActive ? 'text-primary' : 'text-text-muted'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? '-translate-y-0.5' : ''}`} />
            <span className="text-[10px] font-bold tracking-tight">{item.label}</span>
          </button>
        )
      })}
    </nav>
  )
}