import { useNavigate, useLocation } from 'react-router-dom'
import { useAppStore, type ViewName } from '@/stores/appStore'
import { Bell } from 'lucide-react'

const desktopNavItems = [
  { path: '/', label: 'Home' },
  { path: '/search', label: 'Compare' },
  { path: '/categories', label: 'Categories' },
  { path: '/price-drop', label: 'Price Drop' },
  { path: '/hotels', label: 'Hotels' },
  { path: '/wishlist', label: 'Wishlist' },
  { path: '/account', label: 'Account' },
] as const

export function AppHeader() {
  const navigate = useNavigate()
  const location = useLocation()
  const { setCurrentView } = useAppStore()

  const handleNavClick = (path: string) => {
    navigate(path)
    setCurrentView(path.slice(1) as ViewName || 'home')
  }

  return (
    <header className="app-header sticky top-0 z-50 bg-white border-b border-border-light">
      <div className="brand-wrapper flex items-center gap-3 cursor-pointer" onClick={() => handleNavClick('/')}>
        <div className="brand-logo-icon w-9 h-9 rounded-lg flex items-center justify-center text-white" style={{ background: 'var(--primary-gradient)' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
            <line x1="7" y1="7" x2="7.01" y2="7" />
          </svg>
        </div>
        <div className="brand-text-group">
          <h1 className="brand-title text-xl font-extrabold tracking-tight text-text-main leading-none">
            RateTracker<span style={{ color: 'var(--primary)', fontWeight: 900 }}> .in</span>
          </h1>
          <span className="brand-subtitle text-xs font-semibold text-text-muted tracking-wide">Compare • Save • Shop Smart</span>
        </div>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-6 desktop-site-nav">
        {desktopNavItems.map((item) => (
          <button
            key={item.path}
            onClick={() => handleNavClick(item.path)}
            className={`nav-tab-item desktop-nav-link flex items-center gap-1.5 px-2 py-1.5 text-sm font-semibold transition-all ${
              location.pathname === item.path
                ? 'text-primary'
                : 'text-text-muted hover:text-text-main'
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {/* Header Actions */}
      <div className="flex items-center gap-2 ml-auto">
        <button
          onClick={() => handleNavClick('/price-drop')}
          className="header-action-btn relative p-2 rounded-full bg-bg-subtle border border-border-subtle text-text-main transition-all hover:bg-border-subtle"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="badge-dot absolute top-1 right-1 w-2 h-2 rounded-full bg-danger border-2 border-white" />
        </button>
      </div>
    </header>
  )
}