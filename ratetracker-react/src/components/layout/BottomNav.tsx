import { useLocation, useNavigate } from 'react-router-dom'
import { useAppStore, type ViewName } from '@/stores/appStore'
import { Home, Grid, TrendingDown, Building2, Heart, User, Search } from 'lucide-react'

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/search', label: 'Search', icon: Search },
  { path: '/categories', label: 'Categories', icon: Grid },
  { path: '/price-drop', label: 'Deals', icon: TrendingDown },
  { path: '/hotels', label: 'Hotels', icon: Building2 },
  { path: '/wishlist', label: 'Wishlist', icon: Heart },
  { path: '/account', label: 'Account', icon: User },
] as const

export function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()
  const { setCurrentView } = useAppStore()

  const handleNavClick = (path: string) => {
    const viewName = (path === '/' ? 'home' : path.slice(1)) as ViewName
    setCurrentView(viewName)
    navigate(path)
  }

  return (
    <nav className="bottom-nav-bar fixed bottom-0 left-0 right-0 h-16 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-border-subtle flex items-center justify-around z-50 md:hidden">
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = location.pathname === item.path

        return (
          <button
            key={item.path}
            onClick={() => handleNavClick(item.path)}
            className={`nav-tab-item flex flex-col items-center gap-1 py-1 px-1 transition-all ${
              isActive ? 'text-primary font-bold' : 'text-text-muted hover:text-text-main'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? '-translate-y-0.5 scale-110 text-primary' : ''}`} />
            <span className="text-[10px] font-semibold tracking-tight">{item.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
