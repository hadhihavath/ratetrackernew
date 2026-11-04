import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '@/stores/appStore'
import { formatINR } from '@/utils'
import { openStoreDeal } from '@/utils/cuelinks'
import { ArrowLeft, Heart, ShoppingBag, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

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
      <section className="app-screen-view" id="view-wishlist">
        <div className="view-header flex items-center justify-between px-4 py-3.5 border-b border-border-light bg-white sticky top-16 z-40 md:top-0">
          <button onClick={goBack} className="back-btn p-2 rounded-full text-text-main hover:bg-bg-subtle transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="view-header-title text-xl font-extrabold text-text-main flex items-center gap-2">
            <Heart className="w-5 h-5 text-danger fill-current" />
            Wishlist
          </h2>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-4 text-center py-12">
          <div className="w-24 h-24 rounded-full bg-danger-bg flex items-center justify-center mb-6">
            <Heart className="w-12 h-12 text-danger" />
          </div>
          <h3 className="text-xl font-extrabold text-text-main mb-2">Your Wishlist is Empty</h3>
          <p className="text-text-muted mb-6 max-w-xs">Save products you love and get notified when prices drop</p>
          <button
            onClick={() => navigate('/search')}
            className="btn-primary px-6 py-3 flex items-center gap-2"
          >
            <ShoppingBag className="w-5 h-5" />
            Start Shopping
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="app-screen-view" id="view-wishlist">
      {/* Header */}
      <div className="view-header flex items-center justify-between px-4 py-3.5 border-b border-border-light bg-white sticky top-16 z-40 md:top-0">
        <button onClick={goBack} className="back-btn p-2 rounded-full text-text-main hover:bg-bg-subtle transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="view-header-title text-xl font-extrabold text-text-main flex items-center gap-2">
          <Heart className="w-5 h-5 text-danger fill-current" />
          Wishlist
          <span className="wishlist-count bg-danger-bg text-danger text-xs font-extrabold px-2 py-0.5 rounded-full">
            {wishlist.length}
          </span>
        </h2>
        <button
          onClick={() => setIsSelectionMode(!isSelectionMode)}
          className="header-action-btn px-3 py-1.5 rounded-full bg-bg-subtle border border-border-subtle text-text-main text-sm font-extrabold transition-colors hover:bg-border-subtle"
        >
          {isSelectionMode ? 'Done' : 'Select'}
        </button>
      </div>

      {/* Filter Chips */}
      <div className="category-filter-chips flex gap-2 px-4 py-2.5 bg-white border-b border-border-light overflow-x-auto scrollbar-hide">
        {WISHLIST_FILTERS.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`filter-chip px-4 py-1.5 rounded-full text-sm font-extrabold whitespace-nowrap transition-all ${
              activeFilter === filter
                ? 'bg-primary text-white'
                : 'bg-bg-subtle text-text-secondary hover:bg-border-subtle'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Selection Mode Bar */}
      {isSelectionMode && (
        <div className="selection-bar fixed top-16 left-0 right-0 bg-primary text-white px-4 py-3 flex items-center justify-between z-40 md:static md:bg-transparent md:text-primary md:shadow-none md:border-t md:border-border-light">
          <span className="text-sm font-semibold md:hidden">
            {selectedItems.size} selected
          </span>
          <div className="flex items-center gap-3 md:hidden">
            <button
              onClick={handleBuySelected}
              disabled={selectedItems.size === 0}
              className="bg-white text-primary px-4 py-2 rounded-lg text-sm font-extrabold disabled:opacity-50"
            >
              Buy ({selectedItems.size})
            </button>
            <button
              onClick={handleDeleteSelected}
              disabled={selectedItems.size === 0}
              className="border border-white/30 px-4 py-2 rounded-lg text-sm font-extrabold disabled:opacity-50"
            >
              Remove
            </button>
          </div>
        </div>
      )}

      {/* Wishlist Items */}
      <div id="wishlist-items-container" className="px-4 py-2 space-y-3 pb-28 md:pb-8">
        {wishlistProducts.map((product) => (
          <div
            key={product.id}
            className={`wishlist-item bg-white border border-border-subtle rounded-xl overflow-hidden transition-all ${
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
                <div className="w-20 h-20 flex-shrink-0 bg-bg-subtle rounded-lg overflow-hidden">
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
                        className="flex-shrink-0 p-1.5 rounded-full text-danger hover:bg-danger-bg transition-colors"
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
              <div className="mt-3 pt-3 border-t border-border-light">
                <div className="flex flex-wrap gap-2">
                  {product.stores.slice(0, 3).map((store) => (
                    <button
                      key={store.name}
                      onClick={() => handleStoreClick(store, product)}
                      className={`store-btn flex-1 min-w-[100px] py-2 px-3 rounded-lg text-xs font-extrabold transition-all ${
                        store.isBestDeal
                          ? 'bg-primary text-white shadow-blue'
                          : 'bg-white border border-border-subtle text-text-secondary hover:bg-bg-subtle'
                      }`}
                    >
                      {store.name}
                      <span className="ml-1">{formatINR(store.price)}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Action Bar (Selection Mode) - Mobile */}
      {isSelectionMode && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border-subtle px-4 py-3 flex gap-3 z-50 max-w-[420px] mx-auto md:hidden">
          <button
            onClick={handleBuySelected}
            disabled={selectedItems.size === 0}
            className="btn-buy-action flex-1 bg-primary text-white border-none rounded-lg py-3 text-base font-extrabold cursor-pointer disabled:opacity-50"
          >
            Buy ({selectedItems.size})
          </button>
          <button
            onClick={handleDeleteSelected}
            disabled={selectedItems.size === 0}
            className="btn-wishlist-action flex-1 bg-white border-2 border-danger-border text-danger py-3 text-base font-extrabold rounded-lg cursor-pointer disabled:opacity-50"
          >
            Remove
          </button>
        </div>
      )}
    </section>
  )
}