import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useAppStore } from '@/stores/appStore'
import { cuelinksApi } from '@/api'
import { openStoreDeal } from '@/utils/cuelinks'
import { ArrowLeft, Sparkles, Tag, Copy, ExternalLink, Clock } from 'lucide-react'
import toast from 'react-hot-toast'
import { GlassCard, GlassContainer, GlassButton } from '@/components/three-d'

const CATEGORY_FILTERS = ['All Deals', 'Electronics', 'Laptops', 'Footwear', 'Home Appliances', 'Fashion']

export function PriceDrop() {
  const navigate = useNavigate()
  const { linkMode } = useAppStore()
  const [activeFilter, setActiveFilter] = useState('All Deals')

  const { data: offersData, isLoading } = useQuery({
    queryKey: ['cuelinks-offers', activeFilter],
    queryFn: () => cuelinksApi.getOffers(activeFilter),
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

  const handleCopyCoupon = (e: React.MouseEvent, code: string) => {
    e.stopPropagation()
    navigator.clipboard.writeText(code)
    toast.success(`Coupon code ${code} copied!`, { icon: '🎟️' })
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
              Price Drop & Exclusive Deals
            </h2>
          </div>
        </GlassContainer>
      </div>

      <GlassContainer className="px-4 py-2.5 mx-4 my-3" padding="sm" rounded="xl" gradient={false}>
        <p className="text-xs md:text-sm text-text-muted font-semibold text-center">
          Verified affiliate offers & promotional coupons from official brand campaigns (CID: 82192)
        </p>
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
      <div id="price-drop-deals-container" className="px-4 py-4 space-y-4 pb-20">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <GlassCard key={i} variant="outlined" className="animate-pulse" hoverEffect="lift">
                <div className="flex gap-4 items-center">
                  <div className="w-24 h-24 bg-white/20 dark:bg-slate-800/50 rounded-lg" />
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
              className="p-4 transition-all duration-300"
            >
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex gap-4 items-center flex-1">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-bg-subtle flex-shrink-0">
                    <img
                      src={deal.image}
                      alt={deal.campaign}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-extrabold text-sm text-primary">{deal.campaign}</span>
                      <span className="bg-success/20 text-success text-xs font-bold px-2 py-0.5 rounded-full">
                        {deal.discount}
                      </span>
                      <span className="bg-amber-500/20 text-amber-500 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        {deal.tag}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm md:text-base text-text-main line-clamp-2">
                      {deal.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-2 text-xs text-text-muted">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {deal.endsIn}
                      </span>
                      <span>Category: {deal.category}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end mt-2 sm:mt-0">
                  {deal.couponCode && (
                    <button
                      onClick={(e) => handleCopyCoupon(e, deal.couponCode!)}
                      className="flex items-center gap-1.5 px-3 py-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-600 dark:text-amber-400 rounded-lg text-xs font-bold transition-colors"
                      title="Copy coupon code"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{deal.couponCode}</span>
                    </button>
                  )}
                  <GlassButton
                    variant="primary"
                    size="sm"
                    iconRight={<ExternalLink className="w-4 h-4" />}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDealClick(deal)
                    }}
                  >
                    Grab Deal
                  </GlassButton>
                </div>
              </div>
            </GlassCard>
          ))
        ) : (
          <GlassContainer className="text-center py-12 mx-4" padding="xl" rounded="2xl">
            <div className="text-4xl mb-3">💎</div>
            <p className="font-bold text-lg text-text-main mb-2">No live deals found in {activeFilter}</p>
            <p className="text-sm text-text-muted mb-4">Try choosing "All Deals" to see all live offers</p>
            <GlassButton variant="outline" onClick={() => setActiveFilter('All Deals')}>View All Deals</GlassButton>
          </GlassContainer>
        )}
      </div>
    </section>
  )
}
