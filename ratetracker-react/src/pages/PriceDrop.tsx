import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useAppStore } from '@/stores/appStore'
import { cuelinksApi } from '@/api'
import { ProductCard } from '@/components/product'
import { openStoreDeal } from '@/utils/cuelinks'
import { ArrowLeft, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'
import { GlassCard, GlassContainer, GlassButton } from '@/components/three-d'

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
    <section className="app-screen-view min-h-screen" id="view-pricedrop">
      {/* Header with Glass Container */}
      <div className="sticky top-16 z-40 md:top-0">
        <GlassContainer className="px-4 py-3 border-b border-white/20 dark:border-slate-700/30" padding="none" gradient={true}>
          <div className="view-header flex items-center gap-3">
            <button onClick={goBack} className="back-btn p-2 rounded-full text-text-main hover:bg-white/20 dark:hover:bg-slate-800/50 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="view-header-title text-xl font-extrabold text-text-main flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-warning" />
              Price Drop
            </h2>
          </div>
        </GlassContainer>
      </div>

      <GlassContainer className="px-4 py-2 mx-4 mb-4" padding="sm" rounded="xl" gradient={false}>
        <p className="text-sm text-text-muted font-semibold text-center">Grab the best deals before they're gone!</p>
      </GlassContainer>

      {/* Category Filter Chips with Glass Effect */}
      <div className="category-filter-chips flex gap-2 px-4 py-2.5 border-b border-border-light overflow-x-auto scrollbar-hide bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        {CATEGORY_FILTERS.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={`filter-chip px-4 py-1.5 rounded-full text-sm font-extrabold whitespace-nowrap transition-all ${
              activeFilter === cat
                ? 'bg-primary text-white shadow-lg shadow-primary/30'
                : 'bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm text-text-secondary hover:bg-white/90 dark:hover:bg-slate-700/90 border border-white/30 dark:border-slate-700/50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Live Cuelinks Deals */}
      <div id="price-drop-deals-container" className="px-4 py-4 space-y-3">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <GlassCard key={i} variant="outlined" className="animate-pulse" hoverEffect="lift">
                <div className="flex gap-4 items-center">
                  <div className="w-20 h-20 bg-white/20 dark:bg-slate-800/50 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <div className="h-5 bg-white/20 dark:bg-slate-800/50 rounded w-3/4" />
                    <div className="h-4 bg-white/20 dark:bg-slate-800/50 rounded w-1/2" />
                    <div className="h-6 bg-white/20 dark:bg-slate-800/50 rounded w-1/3" />
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        ) : offersData && offersData.length > 0 ? (
          offersData.map((deal) => (
            <GlassCard
              key={deal.id}
              variant="outlined"
              hoverEffect="lift"
              clickable
              onClick={() => handleDealClick(deal)}
              className="transition-all duration-300"
            >
              <ProductCard
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
            </GlassCard>
          ))
        ) : (
          <GlassContainer className="text-center py-12 mx-4" padding="xl" rounded="2xl">
            <div className="text-4xl mb-3">💎</div>
            <p className="font-bold text-lg text-text-main mb-2">No live deals available</p>
            <p className="text-sm text-text-muted mb-4">Check back later for new offers</p>
            <GlassButton variant="outline" onClick={() => window.location.reload()}>Refresh Deals</GlassButton>
          </GlassContainer>
        )}
      </div>
    </section>
  )
}