import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useAppStore } from '@/stores/appStore'
import { productsApi } from '@/api'
import { formatINR } from '@/utils'
import { openStoreDeal } from '@/utils/cuelinks'
import { ArrowLeft, Heart, ShoppingBag, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { GlassCard, GlassContainer, GlassButton } from '@/components/three-d'

export function Wishlist() {
  const navigate = useNavigate()
  const { wishlist, toggleWishlist, linkMode } = useAppStore()

  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const [isSelectionMode, setIsSelectionMode] = useState(false)

  const goBack = () => navigate('/')

  const { data: productsData } = useQuery({
    queryKey: ['products'],
    queryFn: () => productsApi.getProducts(),
  })

  const allProducts = productsData?.products || []
  const wishlistProducts = allProducts.filter((p) => wishlist.includes(p.id))

  const handleWishlistToggle = (e: React.MouseEvent, productId: string) => {
    e.stopPropagation()
    toggleWishlist(productId)
    setSelectedItems((prev) => {
      const next = new Set(prev)
      next.delete(productId)
      return next
    })
    toast.success('Removed from Wishlist', { icon: '💔' })
  }

  const handleDeleteSelected = () => {
    if (selectedItems.size === 0) return
    selectedItems.forEach((id: string) => toggleWishlist(id))
    setSelectedItems(new Set())
    setIsSelectionMode(false)
    toast.success(`${selectedItems.size} items removed`, { icon: '✅' })
  }

  const handleStoreClick = (e: React.MouseEvent, store: { name: string; directUrl: string }, productTitle: string) => {
    e.stopPropagation()
    openStoreDeal(
      undefined,
      store.directUrl,
      store.name,
      productTitle,
      linkMode,
      (msg: string, icon?: string) => toast.success(msg, { icon })
    )
  }

  if (wishlist.length === 0 || wishlistProducts.length === 0) {
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
              <div className="w-8" />
            </div>
          </GlassContainer>
        </div>

        <GlassContainer className="mx-4 my-8 flex-1 flex flex-col items-center justify-center px-4 text-center py-12" padding="xl" rounded="2xl" gradient={true}>
          <div className="w-24 h-24 rounded-full bg-danger/20 flex items-center justify-center mb-6">
            <Heart className="w-12 h-12 text-danger" />
          </div>
          <h3 className="text-xl font-extrabold text-text-main mb-2">Your Wishlist is Empty</h3>
          <p className="text-text-muted mb-6 max-w-xs">Save products you love and track price drops across stores</p>
          <GlassButton
            variant="primary"
            size="lg"
            iconLeft={<ShoppingBag className="w-5 h-5" />}
            onClick={() => navigate('/search')}
          >
            Start Comparing Products
          </GlassButton>
        </GlassContainer>
      </section>
    )
  }

  return (
    <section className="app-screen-view min-h-screen" id="view-wishlist">
      {/* Header */}
      <div className="sticky top-16 z-40 md:top-0">
        <GlassContainer className="px-4 py-3 border-b border-white/20 dark:border-slate-700/30" padding="none" gradient={true}>
          <div className="view-header flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={goBack} className="back-btn p-2 rounded-full text-text-main hover:bg-white/20 dark:hover:bg-slate-800/50 transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h2 className="view-header-title text-xl font-extrabold text-text-main flex items-center gap-2">
                <Heart className="w-5 h-5 text-danger fill-current" />
                Wishlist ({wishlistProducts.length})
              </h2>
            </div>
            {isSelectionMode ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDeleteSelected}
                  className="px-3 py-1.5 bg-danger/20 hover:bg-danger/30 text-danger rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete ({selectedItems.size})
                </button>
                <button
                  onClick={() => {
                    setIsSelectionMode(false)
                    setSelectedItems(new Set())
                  }}
                  className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-text-main rounded-lg text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsSelectionMode(true)}
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-text-main rounded-lg text-xs font-bold transition-colors"
              >
                Select
              </button>
            )}
          </div>
        </GlassContainer>
      </div>

      {/* Wishlist Items List */}
      <div className="px-4 py-4 space-y-4 pb-20">
        {wishlistProducts.map((product) => {
          const bestStore = product.stores.find((s) => s.isBestDeal) || product.stores[0]
          const isSelected = selectedItems.has(product.id)

          return (
            <GlassCard
              key={product.id}
              variant="outlined"
              hoverEffect="lift"
              clickable
              onClick={() => {
                if (isSelectionMode) {
                  const next = new Set(selectedItems)
                  if (isSelected) next.delete(product.id)
                  else next.add(product.id)
                  setSelectedItems(next)
                } else {
                  navigate(`/product/${product.id}`)
                }
              }}
              className="p-4 transition-all duration-300"
            >
              <div className="flex gap-4 items-center">
                {isSelectionMode && (
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {}}
                    className="w-5 h-5 rounded text-primary focus:ring-primary/20 cursor-pointer"
                  />
                )}
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-bg-subtle flex-shrink-0">
                  <img
                    src={product.colors?.[0]?.img || 'https://via.placeholder.com/150'}
                    alt={product.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-bold text-primary">{product.category}</span>
                  <h3 className="font-extrabold text-sm md:text-base text-text-main line-clamp-2">
                    {product.title}
                  </h3>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-base font-extrabold text-success">
                      {formatINR(product.bestPrice)}
                    </span>
                    <span className="text-xs text-text-muted line-through">
                      {formatINR(product.originalPrice)}
                    </span>
                    <span className="text-xs font-bold text-success">
                      {product.discountPercent}% OFF
                    </span>
                  </div>
                  <div className="text-xs text-text-muted mt-1">
                    Best deal at <strong className="text-text-main">{bestStore?.name}</strong> • {product.storeCount} stores
                  </div>
                </div>

                <div className="flex flex-col gap-2 items-end flex-shrink-0">
                  <button
                    onClick={(e) => handleWishlistToggle(e, product.id)}
                    className="p-2 text-danger hover:bg-danger/10 rounded-full transition-colors"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => handleStoreClick(e, bestStore, product.title)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-bold shadow-md hover:bg-primary-hover transition-colors"
                  >
                    Buy ↗
                  </button>
                </div>
              </div>
            </GlassCard>
          )
        })}
      </div>
    </section>
  )
}
