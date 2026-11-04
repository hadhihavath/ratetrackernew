import { Link } from 'react-router-dom'
import type { Product } from '@/types'
import { formatINR } from '@/utils'
import { cn } from '@/utils'
import { getEffectiveUrl } from '@/utils/cuelinks'
import { useAppStore } from '@/stores/appStore'
import { ExternalLink, Star } from 'lucide-react'

interface ProductCardProps {
  product: Product
  variant?: 'comparison' | 'deal' | 'wishlist'
  onClick?: () => void
}

export function ProductCard({ product, variant = 'comparison', onClick }: ProductCardProps) {
  const { linkMode } = useAppStore()
  const bestStore = product.stores.find(s => s.isBestDeal) || product.stores[0]
  const topStores = product.stores.slice(0, 3)

  const handleStoreClick = (e: React.MouseEvent, store: typeof product.stores[0]) => {
    e.stopPropagation()
    e.preventDefault()
    const url = getEffectiveUrl(store.directUrl, linkMode, `ratetracker_${product.id}_${store.name.toLowerCase()}`)
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  if (variant === 'deal') {
    return (
      <Link
        to={`/product/${product.id}`}
        className="deal-item-card min-w-[148px] max-w-[148px] bg-white border border-border-light rounded-xl p-3 shadow-sm flex flex-col cursor-pointer transition-all hover:-translate-y-1 hover:shadow-md hover:border-border-subtle"
      >
        <span className="deal-badge-discount absolute top-2 right-2 bg-danger-bg text-danger text-xs font-extrabold px-2 py-0.5 rounded">
          -{product.discountPercent}%
        </span>
        <div className="deal-image-wrap w-full h-24 flex items-center justify-center mb-2 bg-bg-subtle rounded-lg overflow-hidden relative">
          <img
            src={product.colors[0].img}
            alt={product.title}
            loading="lazy"
            className="max-w-[90%] max-h-24 object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="deal-item-title text-sm font-bold text-text-main truncate mb-1">
          {product.title}
        </div>
        <div className="deal-price-row mt-auto">
          <div className="deal-price-from text-xs text-text-muted">From</div>
          <span className="deal-price-val text-lg font-extrabold text-text-main">{formatINR(product.bestPrice)}</span>
          <span className="deal-price-original text-sm text-text-muted line-through ml-1">{formatINR(product.originalPrice)}</span>
        </div>
      </Link>
    )
  }

  if (variant === 'wishlist') {
    return (
      <div className="wishlist-item-row flex items-center gap-3 p-3 bg-white border border-border-subtle rounded-lg shadow-sm">
        <input type="checkbox" checked className="wishlist-checkbox w-4 h-4 accent-primary cursor-pointer" />
        <div className="wishlist-thumb w-14 h-14 bg-bg-subtle rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
          <img src={product.colors[0].img} alt={product.title} className="max-w-[90%] max-h-[90%] object-contain" />
        </div>
        <div className="wishlist-info flex-1 min-w-0" onClick={onClick} style={{ cursor: 'pointer' }}>
          <div className="wishlist-title text-sm font-bold text-text-main truncate mb-1">{product.title}</div>
          <div className="wishlist-price-badge flex items-center gap-2">
            <span className="wishlist-price text-lg font-extrabold text-text-main">{formatINR(product.bestPrice)}</span>
            <span className="badge-success text-xs">{bestStore.name}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => handleStoreClick(e as unknown as React.MouseEvent, bestStore)}
            className="btn-primary text-xs px-3 py-1.5"
          >
            Buy
          </button>
        </div>
      </div>
    )
  }

  // Default comparison variant
  return (
    <article
      className="product-compare-card bg-white border border-border-subtle rounded-xl p-4 shadow-sm flex flex-col gap-4 cursor-pointer transition-all hover:border-primary-light hover:shadow-md hover:-translate-y-1"
      onClick={onClick || (() => {})}
    >
      <div className="compare-card-main flex gap-4 items-center">
        <div className="compare-product-img w-20 h-20 bg-bg-subtle rounded-lg flex items-center justify-center p-1.5 flex-shrink-0 overflow-hidden">
          <img src={product.colors[0].img} alt={product.title} className="max-w-full max-h-full object-contain" />
        </div>
        <div className="compare-card-info flex-1 min-w-0">
          <h3 className="compare-product-title text-base font-extrabold text-text-main leading-snug mb-1.5">
            {product.title}
          </h3>
          <div className="compare-rating-row flex items-center gap-2 text-xs text-text-muted mb-2">
            <span className="flex items-center gap-1 text-warning font-bold">
              <Star className="w-3 h-3" />
              {product.rating}
            </span>
            <span>({product.reviewsCount})</span>
            <span className="badge-primary">{product.badge}</span>
          </div>
          <div className="compare-from-price flex items-baseline gap-2">
            <span className="from-label text-sm text-text-muted">From</span>
            <span className="from-amount text-xl font-extrabold text-text-main">{formatINR(product.bestPrice)}</span>
            <span className="text-sm text-text-muted line-through">{formatINR(product.originalPrice)}</span>
          </div>
          <div className="stores-count-subtext text-xs text-text-muted mt-1">
            Compare rates across {product.storeCount} stores
          </div>
        </div>
      </div>
      <div className="store-quick-prices grid grid-cols-3 gap-2 pt-3 border-t border-border-light">
        {topStores.map((store) => (
          <button
            key={store.name}
            onClick={(e) => handleStoreClick(e, store)}
            className={cn(
              'store-price-pill bg-bg-subtle rounded-lg p-2 text-center flex flex-col gap-1 transition-all',
              store.isBestDeal && 'bg-success-bg border border-success-border'
            )}
          >
            <span className={cn(
              'store-name-tag text-xs font-bold truncate',
              store.isBestDeal ? 'text-green-800' : 'text-text-muted'
            )}>
              {store.name} <ExternalLink className="inline w-3 h-3" />
            </span>
            <span className={cn(
              'store-price-value text-sm font-extrabold',
              store.isBestDeal ? 'text-green-700' : 'text-text-main'
            )}>
              {formatINR(store.price)}
            </span>
          </button>
        ))}
      </div>
    </article>
  )
}