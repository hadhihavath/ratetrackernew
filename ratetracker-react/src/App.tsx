import { Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAppStore } from './stores/appStore'
import { DeviceFrame } from './components/layout/DeviceFrame'
import { ErrorBoundary } from './components/common'
import { PriceAlertModal } from './components/common/PriceAlertModal'
import { Skeleton } from './components/common'

// Lazy load all page components for code splitting
const Home = lazy(() => import('./pages/Home').then((m) => ({ default: m.Home })))
const Search = lazy(() => import('./pages/Search').then((m) => ({ default: m.Search })))
const ProductDetail = lazy(() => import('./pages/ProductDetail').then((m) => ({ default: m.ProductDetail })))
const Categories = lazy(() => import('./pages/Categories').then((m) => ({ default: m.Categories })))
const PriceDrop = lazy(() => import('./pages/PriceDrop').then((m) => ({ default: m.PriceDrop })))
const Hotels = lazy(() => import('./pages/Hotels').then((m) => ({ default: m.Hotels })))
const Wishlist = lazy(() => import('./pages/Wishlist').then((m) => ({ default: m.Wishlist })))
const Account = lazy(() => import('./pages/Account').then((m) => ({ default: m.Account })))

// Loading fallback component
function PageLoadingFallback() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] px-4">
      <Skeleton variant="circular" className="w-12 h-12 mb-4" />
      <Skeleton variant="text" className="w-32 h-4" />
    </div>
  )
}

function AppRoutes() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageLoadingFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/price-drop" element={<PriceDrop />} />
          <Route path="/hotels" element={<Hotels />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/account" element={<Account />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  )
}

function App() {
  const { deviceMode } = useAppStore()

  return (
    <div className={`min-h-screen ${deviceMode === 'mobile' ? 'mode-mobile' : 'mode-desktop'}`}>
      <DeviceFrame>
        <AppRoutes />
        <PriceAlertModal />
      </DeviceFrame>
    </div>
  )
}

export default App