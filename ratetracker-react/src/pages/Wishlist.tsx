import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '@/stores/appStore'
import { formatINR } from '@/utils'
import { openStoreDeal } from '@/utils/cuelinks'
import { ArrowLeft, Heart, ShoppingBag, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { GlassCard, GlassContainer, GlassButton } from '@/components/three-d'

const WISHLIST_FILTERS = ['All', 'Products', 'Hotels']

export function Wishlist() {
  const navigate = useNavigate()
  const {
    wishlist,
    toggleWishlist,
    linkMode,
  } = useAppStore()

  const [activeFilter, setActiveFilter] = useState('All')
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const [isSelectionMode, setIsSelectionMode] = useState(false)

  const goBack = () => navigate('/')

  const filteredWishlist = wishlist.filter(() => {
    if (activeFilter === 'All') return true
    return activeFilter === 'Products'
  })

  const handleWishlistToggle = (productId: string) => {
    toggleWishlist(productId)
    setSelectedItems((prev) => {
      const next = new Set(prev)
      next.delete(productId)
      return next
    })
    toast.success('Removed from Wishlist', { icon: '💔' })
  }

  const handleBuySelected = () => {
    if (selectedItems.size === 0) return
    toast.success(`Buying ${selectedItems.size} items...`, { icon: '🛒' })
    setSelectedItems(new Set())
    setIsSelectionMode(false)
  }

  const handleDeleteSelected = () => {
    if (selectedItems.size === 0) return
    selectedItems.forEach((id: string) => toggleWishlist(id))
    setSelectedItems(new Set())
    setIsSelectionMode(false)
    toast.success(`${selectedItems.size} items removed`, { icon: '✅' })
  }

  const handleStoreClick = (store: { name: string; directUrl: string }, product: { title: string }) => {
    openStoreDeal(
      undefined,
      store.directUrl,
      store.name,
      product.title,
      linkMode,
      (msg: string, icon?: string) => toast.success(msg, { icon })
    )
  }

  // Get product details for wishlist items
  const wishlistProducts = filteredWishlist.map((id) => {
    return {
      id,
      title: `Product ${id}`,
      bestPrice: Math.floor(Math.random() * 50000) + 5000,
      originalPrice: Math.floor(Math.random() * 60000) + 10000,
      discountPercent: Math.floor(Math.random() * 40) + 10,
      category: 'Electronics',
      rating: 4.5,
      reviewsCount: '1k',
      colors: [{ name: 'Default', hex: '#ccc', img: 'https://via.placeholder.com/150' }],
      stores: [
        { name: 'Amazon', logo: '', price: Math.floor(Math.random() * 50000) + 5000, delivery: 'Tomorrow', isBestDeal: true, directUrl: '#' },
        { name: 'Flipkart', logo: '', price: Math.floor(Math.random() * 50000) + 5000, delivery: '2 days', isBestDeal: false, directUrl: '#' },
      ] as const,
      history: {},
      lowestEver: { price: 0, date: 'Now' },
      specs: {},
    }
  })

  if (wishlist.length === 0) {
    return (
      <section className="app-screen-view min-h-screen" id="view-wishlist">
        <div className="sticky top-16 z-40 md:top-0">
          <GlassContainer className="px-4 py-3 border-b border-white/20 dark:border-slate-700/30" padding="none" gradient={true}>
            <div className="view-header flex items-center justify-between">
              <button onClick={goBack} className="back-btn p-2 rounded-full text-text-main hover:bg-white/20 dark:hover:bg-slate-800/50 transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h2 className="view-header-title text-xl font-extrabold text-text-main flex items-center gap-2">
                <Heart className="w-5 h-5 text-danger fill-current" />
                Wishlist
              </h2>
            </div>
          </GlassContainer>
        </div>

        <GlassContainer className="mx-4 my-8 flex-1 flex flex-col items-center justify-center px-4 text-center py-12" padding="xl" rounded="2xl" gradient={true}>
          <div className="w-24 h-24 rounded-full bg-danger/20 flex items-center justify-center mb-6">
            <Heart className="w-12 h-12 text-danger" />
          </div>
          <h3 className="text-xl font-extrabold text-text-main mb-2">Your Wishlist is Empty</h3>
          <p className="text-text-muted mb-6 max-w-xs">Save products you love and get notified when prices drop</p>
          <GlassButton
            variant="primary"
            size="lg"
            iconLeft={<ShoppingBag className="w-5 h-5" />}
            onClick={() => navigate('/search')}
          >
            Start Shopping
          </GlassButton>
        </GlassContainer>
      </section>
    )
  }

  return (
    <section className="app-screen-view min-h-screen" id="view-wishlist">
      {/* Header with Glass Container */}
      <div className="sticky top-16 z-40 md:top-0">
        <GlassContainer className="px-4 py-3 border-b border-white/20 dark:border-slate-700/30" padding="none" gradient={true}>
          <div className="view-header flex items-center justify-between">
            <button onClick={goBack} className="back-btn p-2 rounded-full text-text-main hover:bg-white/20 dark:hover:bg-slate-800/50 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="view-header-title text-xl font-extrabold text-text-main flex items-center gap-2">
              <Heart className="w-5 h-5 text-danger fill-current" />
              Wishlist
              <span className="wishlist-count bg-danger/20 text-danger text-xs font-extrabold px-2 py-0.5 rounded-full">
                {wishlist.length}
              </span>
            </h2>
            <button
              onClick={() => setIsSelectionMode(!isSelectionMode)}
              className="header-action-btn px-3 py-1.5 rounded-full bg-white/10 dark:bg-slate-800/30 border border-white/20 dark:border-slate-700/30 text-text-main text-sm font-extrabold transition-colors hover:bg-white/20 dark:hover:bg-slate-700/50"
            >
              {isSelectionMode ? 'Done' : 'Select'}
            </button>
          </div>
        </GlassContainer>
      </div>

      {/* Filter Chips with Glass Effect */}
      <div className="category-filter-chips flex gap-2 px-4 py-2.5 border-b border-border-light overflow-x-auto scrollbar-hide bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        {WISHLIST_FILTERS.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`filter-chip px-4 py-1.5 rounded-full text-sm font-extrabold whitespace-nowrap transition-all ${
              activeFilter === filter
                ? 'bg-primary text-white shadow-lg shadow-primary/30'
                : 'bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm text-text-secondary hover:bg-white/90 dark:hover:bg-slate-700/90 border border-white/30 dark:border-slate-700/50'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Selection Mode Bar */}
      {isSelectionMode && (
        <GlassContainer className="fixed top-16 left-0 right-0 px-4 py-3 z-40 md:static md:bg-transparent md:text-primary md:shadow-none md:border-t md:border-white/20 md:dark:border-slate-700/30" padding="none" rounded="lg" gradient={true}>
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold md:hidden">
              {selectedItems.size} selected
            </span>
            <div className="flex items-center gap-3 md:hidden">
              <GlassButton
                variant="primary"
                size="sm"
                disabled={selectedItems.size === 0}
                onClick={handleBuySelected}
              >
                Buy ({selectedItems.size})
              </GlassButton>
              <GlassButton
                variant="outline"
                size="sm"
                disabled={selectedItems.size === 0}
                onClick={handleDeleteSelected}
              >
                Remove
              </GlassButton>
            </div>
          </div>
        </GlassContainer>
      )}

      {/* Wishlist Items with Glass Cards */}
      <div id="wishlist-items-container" className="px-4 py-4 space-y-3 pb-28 md:pb-8">
        {wishlistProducts.map((product) => (
          <GlassCard
            key={product.id}
            variant="outlined"
            hoverEffect="lift"
            className={`wishlist-item overflow-hidden transition-all ${
              selectedItems.has(product.id) ? 'ring-2 ring-primary ring-offset-2' : ''
            }`}
          >
            <div className="p-4">
              <div className="flex gap-4 items-start">
                {/* Checkbox for selection mode */}
                {isSelectionMode && (
                  <div className="flex-shrink-0 mt-1">
                    <input
                      type="checkbox"
                      checked={selectedItems.has(product.id)}
                      onChange={() => {
                        const next = new Set(selectedItems)
                        if (next.has(product.id)) next.delete(product.id)
                        else next.add(product.id)
                        setSelectedItems(next)
                      }}
                      className="w-5 h-5 text-primary border-primary rounded focus:ring-primary focus:ring-2"
                    />
                  </div>
                )}

                {/* Product Image */}
                <div className="w-20 h-20 flex-shrink-0 bg-white/20 dark:bg-slate-800/50 rounded-lg overflow-hidden">
                  <img
                    src={product.colors[0].img}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-extrabold text-text-main text-sm line-clamp-2">{product.title}</h4>
                    {!isSelectionMode && (
                      <button
                        onClick={() => handleWishlistToggle(product.id)}
                        className="flex-shrink-0 p-1.5 rounded-full text-danger hover:bg-danger/10 transition-colors"
                        aria-label="Remove from wishlist"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-text-muted mt-1 line-clamp-1">{product.category}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-lg font-extrabold text-text-main">{formatINR(product.bestPrice)}</span>
                    <span className="text-sm text-text-muted line-through">{formatINR(product.originalPrice)}</span>
                    <span className="discount-pill bg-green-100 text-green-800 text-xs font-extrabold px-2 py-0.5 rounded-full">
                      {product.discountPercent}% OFF
                    </span>
                  </div>
                </div>
              </div>

              {/* Store Quick Actions */}
              <div className="mt-3 pt-3 border-t border-white/20 dark:border-slate-700/30">
                <div className="flex flex-wrap gap-2">
                  {product.stores.slice(0, 3).map((store) => (
                    <GlassButton
                      key={store.name}
                      variant={store.isBestDeal ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => handleStoreClick(store, product)}
                      className="flex-1 min-w-[100px] text-xs font-extrabold"
                    >
                      {store.name} <span className="ml-1">{formatINR(store.price)}</span>
                    </GlassButton>
                  ))}
                </div>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Bottom Action Bar (Selection Mode) - Mobile */}
      {isSelectionMode && (
        <GlassContainer className="fixed bottom-0 left-0 right-0 px-4 py-3 z-50 max-w-[420px] mx-auto md:hidden" padding="none" gradient={true}>
          <div className="flex gap-3">
            <GlassButton
              variant="primary"
              size="lg"
              fullWidth
              disabled={selectedItems.size === 0}
              onClick={handleBuySelected}
            >
              Buy ({selectedItems.size})
            </GlassButton>
            <GlassButton
              variant="outline"
              size="lg"
              fullWidth
              disabled={selectedItems.size === 0}
              onClick={handleDeleteSelected}
            >
              Remove
            </GlassButton>
          </div>
        </GlassContainer>
      )}
    </section>
  )
}