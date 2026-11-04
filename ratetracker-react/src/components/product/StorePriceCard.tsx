import type { Product } from '@/types'
import { formatINR } from '@/utils'
import { cn } from '@/utils'
import { getEffectiveUrl } from '@/utils/cuelinks'
import { useAppStore } from '@/stores/appStore'
import { Truck, ExternalLink } from 'lucide-react'

interface StorePriceCardProps {
  store: Product['stores'][0]
  product: Product
}

export function StorePriceCard({ store, product }: StorePriceCardProps) {
  const { linkMode } = useAppStore()

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    const url = getEffectiveUrl(store.directUrl, linkMode, `ratetracker_${product.id}_${store.name.toLowerCase()}`)
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className={cn(
      'store-deal-row bg-white border rounded-lg p-4 flex items-center justify-between shadow-sm transition-all',
      store.isBestDeal && 'border-green-300 bg-green-50 highlight-best'
    )}>
      <div className="store-brand-col flex items-center gap-3">
        <div className="store-logo-box w-11 h-11 rounded-lg bg-bg-subtle flex items-center justify-center p-1">
          <img
            src={store.logo}
            alt={store.name}
            className="max-w-[90%] max-h-[90%] object-contain"
            onError={(e) => {
              e.currentTarget.src = 'https://cdn-icons-png.flaticon.com/512/1170/1170678.png'
            }}
          />
        </div>
        <div className="store-details-col">
          <div className="store-title-badge-row flex items-center gap-2">
            <span className="store-name-text text-base font-extrabold text-text-main capitalize">{store.name}</span>
            {store.dealBadge && (
              <span className="badge-success text-xs">{store.dealBadge}</span>
            )}
          </div>
          <span className="delivery-subtext flex items-center gap-1 text-xs text-text-muted">
            <Truck className="w-3 h-3" />
            {store.delivery}
          </span>
        </div>
      </div>
      <div className="store-action-col flex items-center gap-3">
        <div className="text-right">
          <div className="store-price-display text-xl font-extrabold text-text-main">{formatINR(store.price)}</div>
          <span className="cuelinks-tag-micro text-[9px] text-text-muted block text-right mt-0.5">
            {linkMode === 'cuelinks' ? 'Monetized via Cuelinks' : 'Direct Store Link'}
          </span>
        </div>
        <button
          onClick={handleClick}
          className="view-deal-btn btn-primary px-4 py-2 text-sm flex items-center gap-1.5 whitespace-nowrap"
        >
          View Deal <ExternalLink className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}