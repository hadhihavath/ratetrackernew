import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useAppStore } from '@/stores/appStore'
import { productsApi } from '@/api'
import { StorePriceCard, ProductColorSwitcher } from '@/components/product'
import { PriceHistoryChart } from '@/components/charts'
import type { Product } from '@/types'
import { formatINR } from '@/utils'
import { openStoreDeal } from '@/utils/cuelinks'
import { ArrowLeft, Heart, Share2, Star, ExternalLink, Tag, TrendingUp } from 'lucide-react'
import toast from 'react-hot-toast'

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
    product.stores.find((s) => s.isBestDeal) || product.stores[0]
    const bestStore = product.stores.find((s) => s.isBestDeal) || product.stores[0]
    handleStoreClick(bestStore)
  }

  const goBack = () => navigate('/search')

  if (isLoading && !product) {
    return (
      <section className="app-screen-view product-detail-view" id="view-detail">
        <div className="detail-top-nav px-4 py-3">
          <button onClick={goBack} className="back-btn p-2 rounded-full text-text-main hover:bg-bg-subtle">
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
      <section className="app-screen-view product-detail-view" id="view-detail">
        <div className="detail-top-nav px-4 py-3">
          <button onClick={goBack} className="back-btn p-2 rounded-full text-text-main hover:bg-bg-subtle">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 flex items-center justify-center px-4 text-text-muted">
          <p>Product not found</p>
        </div>
      </section>
    )
  }

  const currentProduct = product || selectedProduct

  if (!currentProduct) {
    return null
  }

  const historyData = currentProduct.history[currentHistoryPeriod] || currentProduct.history['6M'] || []
  const lowestEver = currentProduct.lowestEver

  return (
    <section className="app-screen-view product-detail-view flex flex-col" id="view-detail">
      {/* Top Nav Bar */}
      <div className="detail-top-nav flex items-center justify-between px-4 py-3">
        <button onClick={goBack} className="back-btn p-2 rounded-full text-text-main hover:bg-bg-subtle transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="detail-nav-actions flex items-center gap-2">
          <button
            onClick={handleWishlistToggle}
            className={`icon-circle-btn p-2 rounded-full border transition-colors ${
              isWishlisted
                ? 'bg-danger-bg text-danger border-danger-border'
                : 'bg-white text-text-secondary border-border-subtle hover:bg-bg-subtle hover:text-primary'
            }`}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={handleShare}
            className="icon-circle-btn p-2 rounded-full bg-white border border-border-subtle text-text-secondary hover:bg-bg-subtle hover:text-primary transition-colors"
            aria-label="Share"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Gallery & Color Switcher */}
      <div className="detail-gallery-wrap flex flex-col items-center py-4 bg-slate-50">
        <div className="detail-main-img-box w-52 h-52 md:w-56 md:h-56 flex items-center justify-center relative">
          <img
            id="detail-main-img"
            src={currentProduct.colors[selectedColorIndex].img}
            alt={currentProduct.title}
            className="max-w-full max-h-full object-contain transition-opacity duration-300"
          />
        </div>
        <ProductColorSwitcher
          colors={currentProduct.colors}
          selectedIndex={selectedColorIndex}
          onColorChange={handleColorChange}
        />
      </div>

      {/* Product Info Block */}
      <div className="detail-info-block px-4 pb-4 bg-white border-b border-border-light">
        <h2 className="detail-title text-xl font-extrabold text-text-main leading-snug mb-2">{currentProduct.title}</h2>
        <div className="detail-rating-row flex items-center gap-2 mb-3">
          <span className="flex items-center gap-1 text-warning font-bold text-sm">
            <Star className="w-4 h-4" />
            {currentProduct.rating}
            <span className="text-text-muted font-normal">({currentProduct.reviewsCount} reviews)</span>
          </span>
          <span className="discount-pill bg-green-100 text-green-800 text-xs font-extrabold px-2 py-1 rounded-full">
            {currentProduct.discountPercent}% OFF
          </span>
        </div>
        <div className="detail-price-headline flex items-baseline gap-2">
          <span className="text-sm text-text-muted">From</span>
          <span className="detail-from-price text-3xl font-extrabold text-text-main tracking-tight">{formatINR(currentProduct.bestPrice)}</span>
          <span className="detail-orig-price text-lg text-text-muted line-through">{formatINR(currentProduct.originalPrice)}</span>
        </div>
      </div>

      {/* Segmented Tabs */}
      <div className="segmented-tabs-bar flex border-b border-border-subtle bg-white px-4">
        {DETAIL_TABS.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`seg-tab-btn flex items-center gap-1.5 px-4 py-3 text-sm font-extrabold border-b-2 transition-colors ${
                currentDetailTab === tab.id
                  ? 'text-primary border-primary'
                  : 'text-text-muted border-transparent hover:text-text-main'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Tab Panels */}
      <div className="flex-1 overflow-y-auto pb-28 md:pb-0">
        {/* Price Comparison Tab */}
        <div className={`tab-content-panel ${currentDetailTab === 'price-comparison' ? 'block' : 'hidden'} p-4`}>
          <div className="stores-comparison-list space-y-3">
            {currentProduct.stores.map((store: Product['stores'][0]) => (
              <StorePriceCard key={store.name} store={store} product={currentProduct} />
            ))}
          </div>

          {/* Price Drop Alert Banner */}
          <div className="price-alert-banner mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between gap-3">
            <div className="alert-banner-text">
              <strong className="text-blue-800 text-sm block">Not sure? Set Price Drop Alert</strong>
              <span className="text-blue-700 text-xs">Get notified when the price drops lower</span>
            </div>
            <button
              onClick={() => {
                // Trigger modal open - in real app use context
                toast.success('Opening price alert modal...', { icon: '🔔' })
              }}
              className="set-alert-pill-btn bg-blue-600 text-white text-xs font-extrabold px-3 py-1.5 rounded-full whitespace-nowrap hover:bg-blue-700 transition-colors"
            >
              Set Alert
            </button>
          </div>
        </div>

        {/* Price History Tab */}
        <div className={`tab-content-panel ${currentDetailTab === 'price-history' ? 'block' : 'hidden'} p-4`}>
          <div className="history-time-toggles flex bg-bg-subtle rounded-lg p-1 gap-1 mb-4">
            {HISTORY_PERIODS.map((period) => (
              <button
                key={period}
                onClick={() => handlePeriodChange(period)}
                className={`time-btn flex-1 py-2 text-sm font-extrabold rounded transition-colors ${
                  currentHistoryPeriod === period
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-text-muted hover:text-text-main'
                }`}
              >
                {period}
              </button>
            ))}
          </div>

          <PriceHistoryChart
            data={historyData}
            lowestPrice={lowestEver?.price}
            lowestDate={lowestEver?.date}
          />
        </div>

        {/* Specifications Tab */}
        <div className={`tab-content-panel ${currentDetailTab === 'specifications' ? 'block' : 'hidden'} p-4`}>
          <div id="detail-specs-list" className="space-y-0">
            {Object.entries(currentProduct.specs).map(([key, val]) => (
              <div key={key} className="flex justify-between py-3 border-b border-border-light text-sm">
                <span className="text-text-secondary font-semibold">{key}</span>
                <span className="font-bold text-text-main text-right max-w-[60%]">{String(val)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="detail-bottom-bar fixed bottom-0 left-0 right-0 bg-white border-t border-border-subtle px-4 py-3 flex gap-3 z-50 max-w-[420px] mx-auto md:max-w-none md:justify-center">
        <div className="bottom-bar-inner flex gap-3 w-full max-w-2xl mx-auto">
          <button
            onClick={handleWishlistToggle}
            className={`btn-wishlist-action flex-1 flex items-center justify-center gap-2 py-3 text-sm font-extrabold rounded-lg transition-colors ${
              isWishlisted
                ? 'bg-danger-bg text-danger border-danger-border'
                : 'bg-white text-text-secondary border-2 border-border-subtle hover:bg-bg-subtle hover:border-border-light'
            }`}
          >
            <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
            <span>{isWishlisted ? 'In Wishlist' : 'Add to Wishlist'}</span>
          </button>
          <button
            onClick={handleBuyNow}
            className="btn-buy-action flex-2 bg-primary text-white border-none rounded-lg py-3 text-base font-extrabold cursor-pointer shadow-blue transition-all hover:bg-primary-hover hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            <span>Buy Now at Lowest Price</span>
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  )
}