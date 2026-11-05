'use client';

import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useAppStore } from '@/stores/appStore'
import { productsApi } from '@/api'
import { StorePriceCard } from '@/components/product'
import type { Product } from '@/types'
import { formatINR } from '@/utils'
import { openStoreDeal } from '@/utils/cuelinks'
import { ArrowLeft, Heart, Share2, Star, ExternalLink, Tag, TrendingUp, RotateCcw } from 'lucide-react'
import toast from 'react-hot-toast'
import { ProductViewer3D, getProduct3DType } from '@/components/three-d/ProductViewer3D'
import { PriceChart3D } from '@/components/three-d/PriceChart3D'
import { GlassCard, GlassButton } from '@/components/three-d/GlassCard'
import { motion, AnimatePresence } from 'framer-motion'

const DETAIL_TABS = [
  { id: 'price-comparison', label: 'Price Comparison', icon: Tag },
  { id: 'price-history', label: 'Price History', icon: TrendingUp },
  { id: 'specifications', label: 'Specifications', icon: Star },
]

const HISTORY_PERIODS = ['1M', '3M', '6M', '1Y'] as const

export function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const {
    selectedProduct,
    setSelectedProduct,
    selectedColorIndex,
    setSelectedColorIndex,
    currentDetailTab,
    setCurrentDetailTab,
    currentHistoryPeriod,
    setCurrentHistoryPeriod,
    wishlist,
    toggleWishlist,
    linkMode,
  } = useAppStore()

  const [product, setProduct] = useState<Product | null>(selectedProduct)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [is3DView, setIs3DView] = useState(true)

  const { data: productData, isLoading, isError } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productsApi.getProductById(id!),
    enabled: !!id,
  })

  // Update local state when product data loads
  useEffect(() => {
    if (productData?.product) {
      setProduct(productData.product)
      setSelectedProduct(productData.product)
      setIsWishlisted(wishlist.includes(productData.product.id))
      setSelectedColorIndex(0)
    }
  }, [productData, wishlist, setSelectedProduct, setIsWishlisted, setSelectedColorIndex])

  const handleColorChange = (index: number) => {
    setSelectedColorIndex(index)
  }

  const handleTabChange = (tabId: string) => {
    setCurrentDetailTab(tabId as typeof currentDetailTab)
  }

  const handlePeriodChange = (period: typeof currentHistoryPeriod) => {
    setCurrentHistoryPeriod(period)
  }

  const handleWishlistToggle = () => {
    if (!product) return
    toggleWishlist(product.id)
    setIsWishlisted(!isWishlisted)
    toast.success(isWishlisted ? 'Removed from Wishlist' : 'Saved to Wishlist!', { icon: isWishlisted ? '✕' : '♥' })
  }

  const handleShare = () => {
    if (!product) return
    if (navigator.share) {
      navigator.share({
        title: product.title,
        text: `Check out this deal: ${formatINR(product.bestPrice)} for ${product.title}`,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard!')
    }
  }

  const handleStoreClick = (store: Product['stores'][0]) => {
    if (!product) return
    openStoreDeal(
      undefined,
      store.directUrl,
      store.name,
      product.title,
      linkMode,
      (msg: string, icon?: string) => toast.success(msg, { icon })
    )
  }

  const handleBuyNow = () => {
    if (!product) return
    const bestStore = product.stores.find((s) => s.isBestDeal) || product.stores[0]
    handleStoreClick(bestStore)
  }

  const goBack = () => navigate('/search')

  const product3DType = product ? getProduct3DType(product.category) : 'default'
  const currentProduct = product || selectedProduct
  const historyData = currentProduct?.history[currentHistoryPeriod] || currentProduct?.history['6M'] || []
  const lowestEver = currentProduct?.lowestEver

  if (isLoading && !product) {
    return (
      <section className="app-screen-view product-detail-view flex flex-col" id="view-detail">
        <div className="detail-top-nav flex items-center justify-between px-4 py-3">
          <button onClick={goBack} className="back-btn p-2 rounded-full text-text-main hover:bg-bg-subtle transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-4 bg-bg-subtle rounded-full animate-pulse" />
            <div className="h-6 bg-bg-subtle rounded w-1/2 mx-auto mb-2" />
            <div className="h-4 bg-bg-subtle rounded w-1/3 mx-auto" />
          </div>
        </div>
      </section>
    )
  }

  if ((isError || !product) && !selectedProduct) {
    return (
      <section className="app-screen-view product-detail-view flex flex-col" id="view-detail">
        <div className="detail-top-nav flex items-center justify-between px-4 py-3">
          <button onClick={goBack} className="back-btn p-2 rounded-full text-text-main hover:bg-bg-subtle transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 flex items-center justify-center px-4 text-text-muted">
          <p>Product not found</p>
        </div>
      </section>
    )
  }

  if (!currentProduct) {
    return null
  }

  const colors = currentProduct.colors.map(c => c.hex)

  return (
    <section className="app-screen-view product-detail-view flex flex-col" id="view-detail">
      {/* Top Nav Bar */}
      <div className="detail-top-nav flex items-center justify-between px-4 py-3">
        <button onClick={goBack} className="back-btn p-2 rounded-full text-text-main hover:bg-bg-subtle transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="detail-nav-actions flex items-center gap-2">
          <GlassButton
            variant="ghost"
            size="sm"
            onClick={handleWishlistToggle}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current text-danger' : 'text-slate-600 dark:text-slate-400'}`} />
          </GlassButton>
          <GlassButton variant="ghost" size="sm" onClick={handleShare} aria-label="Share">
            <Share2 className="w-5 h-5" />
          </GlassButton>
          {!isMobile && (
            <GlassButton variant="ghost" size="sm" onClick={() => setIs3DView(!is3DView)} aria-label={is3DView ? 'Switch to 2D' : 'Switch to 3D'}>
              {is3DView ? <RotateCcw className="w-5 h-5" /> : <RotateCcw className="w-5 h-5" />}
            </GlassButton>
          )}
        </div>
      </div>

      {/* Gallery & 3D Viewer */}
      <div className="detail-gallery-wrap flex flex-col items-center py-6 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900/50 dark:to-slate-900">
        <AnimatePresence mode="wait">
          {is3DView ? (
            <motion.div
              key="3d"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-md mx-4 md:mx-auto"
            >
              <GlassCard variant="elevated" blur="lg" className="p-2" style={{ borderRadius: '1.5rem' }}>
                <ProductViewer3D
                  productType={product3DType}
                  color={currentProduct.colors[selectedColorIndex].hex}
                  colors={colors}
                  selectedColorIndex={selectedColorIndex}
                  onColorChange={handleColorChange}
                  className="min-h-[350px] md:min-h-[400px]"
                />
              </GlassCard>
            </motion.div>
          ) : (
            <motion.div
              key="2d"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-md mx-4 md:mx-auto"
            >
              <GlassCard variant="elevated" blur="lg" className="p-2" style={{ borderRadius: '1.5rem' }}>
                <div className="aspect-square flex items-center justify-center relative">
                  <img
                    src={currentProduct.colors[selectedColorIndex].img}
                    alt={currentProduct.title}
                    className="max-w-full max-h-full object-contain transition-opacity duration-300"
                  />
                </div>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 3D/2D Toggle */}
        {!isMobile && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 flex items-center gap-2"
          >
            <GlassButton
              variant={is3DView ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setIs3DView(!is3DView)}
              iconLeft={is3DView ? <RotateCcw className="w-4 h-4" /> : <RotateCcw className="w-4 h-4" />}
            >
              {is3DView ? '3D View' : '2D Image'}
            </GlassButton>
          </motion.div>
        )}

        {/* Color Switcher */}
        <div className="mt-4 flex items-center gap-2" role="group" aria-label="Color options">
          {currentProduct.colors.map((color, index) => (
            <motion.button
              key={index}
              onClick={() => handleColorChange(index)}
              whileTap={{ scale: 0.9 }}
              className={`w-8 h-8 md:w-10 md:h-10 rounded-full border-3 transition-all duration-200 ${
                index === selectedColorIndex
                  ? 'border-primary scale-110 shadow-lg shadow-primary/30 ring-2 ring-primary/20'
                  : 'border-transparent hover:border-white/50 hover:scale-105'
              }`}
              style={{
                backgroundColor: color.hex,
                boxShadow: index === selectedColorIndex
                  ? `0 0 0 4px ${color.hex}30, 0 4px 16px ${color.hex}40`
                  : '0 2px 8px rgba(0,0,0,0.1)',
              }}
              aria-label={`Select ${color.name}`}
              aria-pressed={index === selectedColorIndex}
            />
          ))}
        </div>
      </div>

      {/* Product Info Block */}
      <div className="detail-info-block px-4 pb-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-border-light">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="detail-title text-xl md:text-2xl font-extrabold text-text-main leading-snug mb-3"
        >
          {currentProduct.title}
        </motion.h2>
        <div className="detail-rating-row flex items-center gap-3 mb-3 flex-wrap">
          <span className="flex items-center gap-1 text-warning font-bold text-sm">
            <Star className="w-4 h-4" />
            {currentProduct.rating}
            <span className="text-text-muted font-normal">({currentProduct.reviewsCount} reviews)</span>
          </span>
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="discount-pill bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-xs font-extrabold px-3 py-1 rounded-full"
          >
            {currentProduct.discountPercent}% OFF
          </motion.span>
          <span className="badge-primary text-xs font-bold px-2 py-1 rounded-full">{currentProduct.badge}</span>
        </div>
        <div className="detail-price-headline flex items-baseline gap-2 flex-wrap">
          <span className="text-sm text-text-muted">From</span>
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="detail-from-price text-3xl md:text-4xl font-extrabold text-text-main tracking-tight"
          >
            {formatINR(currentProduct.bestPrice)}
          </motion.span>
          <span className="detail-orig-price text-lg text-text-muted line-through">{formatINR(currentProduct.originalPrice)}</span>
          <span className="text-sm font-medium text-success ml-auto flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            Save {formatINR(currentProduct.originalPrice - currentProduct.bestPrice)}
          </span>
        </div>
      </div>

      {/* Segmented Tabs */}
      <div className="segmented-tabs-bar flex border-b border-border-subtle bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-4 sticky top-0 z-10">
        {DETAIL_TABS.map((tab) => {
          const Icon = tab.icon
          return (
            <motion.button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              whileTap={{ scale: 0.98 }}
              className={`seg-tab-btn flex items-center gap-2 px-4 py-3 text-sm font-extrabold border-b-2 transition-colors ${
                currentDetailTab === tab.id
                  ? 'text-primary border-primary'
                  : 'text-text-muted border-transparent hover:text-text-main hover:border-border-subtle'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </motion.button>
          )
        })}
      </div>

      {/* Tab Panels */}
      <div className="flex-1 overflow-y-auto pb-28 md:pb-0">
        <AnimatePresence mode="wait">
          {/* Price Comparison Tab */}
          {currentDetailTab === 'price-comparison' && (
            <motion.div
              key="price-comparison"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="tab-content-panel p-4 space-y-4"
            >
              <div className="stores-comparison-list space-y-3">
                {currentProduct.stores.map((store: Product['stores'][0]) => (
                  <StorePriceCard key={store.name} store={store} product={currentProduct} />
                ))}
              </div>

              {/* Price Drop Alert Banner */}
              <GlassCard variant="outlined" className="p-4 border-blue-200/50 dark:border-blue-800/50 bg-blue-50/50 dark:bg-blue-900/20">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="alert-banner-text">
                    <strong className="text-blue-800 dark:text-blue-300 text-sm block">Not sure? Set Price Drop Alert</strong>
                    <span className="text-blue-700 dark:text-blue-400 text-xs">Get notified when the price drops below your target</span>
                  </div>
                  <GlassButton
                    variant="primary"
                    size="sm"
                    onClick={() => toast.success('Opening price alert modal...', { icon: '🔔' })}
                    iconLeft={<Tag className="w-4 h-4" />}
                  >
                    Set Alert
                  </GlassButton>
                </div>
              </GlassCard>
            </motion.div>
          )}

          {/* Price History Tab */}
          {currentDetailTab === 'price-history' && (
            <motion.div
              key="price-history"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="tab-content-panel p-4 space-y-4"
            >
              <GlassCard variant="outlined" className="p-4">
                <div className="history-time-toggles flex bg-bg-subtle rounded-lg p-1 gap-1 mb-4">
                  {HISTORY_PERIODS.map((period) => (
                    <motion.button
                      key={period}
                      onClick={() => handlePeriodChange(period)}
                      whileTap={{ scale: 0.95 }}
                      className={`time-btn flex-1 py-2 px-3 text-sm font-extrabold rounded transition-all ${
                        currentHistoryPeriod === period
                          ? 'bg-white text-primary shadow-sm'
                          : 'text-text-muted hover:text-text-main hover:bg-white/50 dark:hover:bg-slate-800/50'
                      }`}
                    >
                      {period}
                    </motion.button>
                  ))}
                </div>

                <PriceChart3D
                  data={historyData}
                  period={currentHistoryPeriod}
                  bestPrice={currentProduct.bestPrice}
                  originalPrice={currentProduct.originalPrice}
                  lowestEver={lowestEver || { price: currentProduct.bestPrice, date: 'Now' }}
                  height={350}
                />
              </GlassCard>

              {/* Lowest Price Callout */}
              {lowestEver && (
                <GlassCard variant="elevated" className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200/50 dark:border-green-800/50">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <span className="text-2xl">🏆</span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-green-800 dark:text-green-300">Lowest Price Ever</div>
                        <div className="text-2xl font-extrabold text-green-700 dark:text-green-400">{formatINR(lowestEver.price)}</div>
                        <div className="text-xs text-green-600 dark:text-green-500">({lowestEver.date})</div>
                      </div>
                    </div>
                    <span className="great-deal-tag bg-green-600 text-white text-xs font-extrabold px-3 py-1.5 rounded-full">Great Deal</span>
                  </div>
                </GlassCard>
              )}

              {/* Price Alert Banner in History Tab */}
              <GlassCard variant="outlined" className="p-4 border-blue-200/50 dark:border-blue-800/50 bg-blue-50/50 dark:bg-blue-900/20">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="alert-banner-text">
                    <strong className="text-blue-800 dark:text-blue-300 text-sm block">Set Price Drop Alert</strong>
                    <span className="text-blue-700 dark:text-blue-400 text-xs">Get notified when the price reaches your target</span>
                  </div>
                  <GlassButton
                    variant="primary"
                    size="sm"
                    onClick={() => toast.success('Opening price alert modal...', { icon: '🔔' })}
                    iconLeft={<Tag className="w-4 h-4" />}
                  >
                    Set Alert
                  </GlassButton>
                </div>
              </GlassCard>
            </motion.div>
          )}

          {/* Specifications Tab */}
          {currentDetailTab === 'specifications' && (
            <motion.div
              key="specifications"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="tab-content-panel p-4 space-y-0"
            >
              <GlassCard variant="outlined" className="overflow-hidden">
                <div id="detail-specs-list" className="divide-y divide-border-light">
                  {Object.entries(currentProduct.specs).map(([key, val], index) => (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="flex flex-col md:flex-row md:items-center justify-between py-4 px-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <span className="text-text-secondary font-semibold mb-1 md:mb-0">{key}</span>
                      <span className="font-bold text-text-main text-right max-w-[65%] text-sm md:text-base">{String(val)}</span>
                    </motion.div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="detail-bottom-bar fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-border-subtle px-4 py-3 flex gap-3 z-50 max-w-[420px] mx-auto md:max-w-none md:justify-center">
        <div className="bottom-bar-inner flex gap-3 w-full max-w-2xl mx-auto">
          <GlassButton
            variant={isWishlisted ? 'secondary' : 'outline'}
            size="lg"
            onClick={handleWishlistToggle}
            fullWidth={true}
            className="flex-1"
          >
            <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current text-danger' : ''}`} />
            <span>{isWishlisted ? 'In Wishlist' : 'Add to Wishlist'}</span>
          </GlassButton>
          <GlassButton
            variant="primary"
            size="lg"
            onClick={handleBuyNow}
            fullWidth={true}
            className="flex-2 shadow-xl shadow-primary/30"
            iconRight={<ExternalLink className="w-4 h-4" />}
          >
            Buy Now at Lowest Price
          </GlassButton>
        </div>
      </div>
    </section>
  )
}

// Helper to detect mobile
const isMobile = typeof window !== 'undefined' && window.innerWidth < 768