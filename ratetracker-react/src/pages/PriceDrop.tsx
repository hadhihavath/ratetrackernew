import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useAppStore } from '@/stores/appStore'
import { cuelinksApi } from '@/api'
import { ProductCard } from '@/components/product'
import { openStoreDeal } from '@/utils/cuelinks'
import { ArrowLeft, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'

const CATEGORY_FILTERS = ['All Deals', 'Mobiles', 'Laptops', 'Electronics']

export function PriceDrop() {
  const navigate = useNavigate()
  const { linkMode } = useAppStore()
  const [activeFilter, setActiveFilter] = useState('All Deals')

  const { data: offersData, isLoading } = useQuery({
    queryKey: ['cuelinks-offers'],
    queryFn: () => cuelinksApi.getOffers(),
  })

  const goBack = () => navigate('/')

  const handleDealClick = (deal: any) => {
    openStoreDeal(
      undefined,
      deal.directUrl,
      deal.campaign,
      deal.title,
      linkMode,
      (msg, icon) => toast.success(msg, { icon })
    )
  }

  return (
    <section className="app-screen-view" id="view-pricedrop">
      <div className="view-header flex items-center gap-3 px-4 py-3.5 border-b border-border-light bg-white sticky top-16 z-40 md:top-0">
        <button onClick={goBack} className="back-btn p-2 rounded-full text-text-main hover:bg-bg-subtle transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="view-header-title text-xl font-extrabold text-text-main flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-warning" />
          Price Drop
        </h2>
      </div>

      <div className="px-4 py-2 text-sm text-text-muted font-semibold">
        Grab the best deals before they're gone!
      </div>

      {/* Category Filter Chips */}
      <div className="category-filter-chips flex gap-2 px-4 py-2.5 bg-white border-b border-border-light overflow-x-auto scrollbar-hide">
        {CATEGORY_FILTERS.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={`filter-chip px-4 py-1.5 rounded-full text-sm font-extrabold whitespace-nowrap transition-all ${
              activeFilter === cat
                ? 'bg-primary text-white'
                : 'bg-bg-subtle text-text-secondary hover:bg-border-subtle'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Live Cuelinks Deals */}
      <div id="price-drop-deals-container" className="px-4 py-2 space-y-3">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="product-compare-card bg-white border border-border-subtle rounded-xl p-4 animate-pulse">
                <div className="flex gap-4 items-center">
                  <div className="w-20 h-20 bg-bg-subtle rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <div className="h-5 bg-bg-subtle rounded w-3/4" />
                    <div className="h-4 bg-bg-subtle rounded w-1/2" />
                    <div className="h-6 bg-bg-subtle rounded w-1/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : offersData && offersData.length > 0 ? (
          offersData.map((deal) => (
            <ProductCard
              key={deal.id}
              product={{
                id: deal.id,
                title: deal.title,
                searchTerm: deal.title,
                category: deal.category,
                rating: 4.5,
                reviewsCount: '1k',
                bestPrice: deal.price || 0,
                originalPrice: deal.origPrice || 0,
                discountPercent: deal.price && deal.origPrice
                  ? Math.round(((deal.origPrice - deal.price) / deal.origPrice) * 100)
                  : 0,
                storeCount: 1,
                badge: deal.tag,
                colors: [{ name: 'Default', hex: '#ccc', img: deal.image }],
                stores: [{
                  name: deal.campaign,
                  logo: '',
                  price: deal.price || 0,
                  delivery: deal.endsIn,
                  isBestDeal: true,
                  directUrl: deal.directUrl,
                }],
                history: {},
                lowestEver: { price: deal.price || 0, date: 'Now' },
                specs: {},
              }}
              variant="comparison"
              onClick={() => handleDealClick(deal)}
            />
          ))
        ) : (
          <div className="text-center py-12 text-text-muted">
            <p className="font-bold text-lg mb-2">No live deals available</p>
            <p className="text-sm">Check back later for new offers</p>
          </div>
        )}
      </div>
    </section>
  )
}