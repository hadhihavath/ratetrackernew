import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useAppStore } from '@/stores/appStore'
import { productsApi } from '@/api'
import { ProductCard } from '@/components/product'
import { ArrowLeft, Search as SearchIcon, Filter } from 'lucide-react'
import { GlassCard, GlassInput, GlassContainer, GlassButton } from '@/components/three-d'

const CATEGORY_FILTERS = ['All', 'Mobiles', 'Electronics', 'Laptops', 'Footwear']

export function Search() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { searchQuery, setSearchQuery, activeCategory, setActiveCategory } = useAppStore()

  // Initialize from URL params
  useEffect(() => {
    const q = searchParams.get('q')
    const cat = searchParams.get('category')
    if (q) setSearchQuery(q)
    if (cat) setActiveCategory(cat)
  }, [searchParams, setSearchQuery, setActiveCategory])

  const { data: productsData, isLoading, isError } = useQuery({
    queryKey: ['products', { category: activeCategory, query: searchQuery }],
    queryFn: () => productsApi.getProducts({ category: activeCategory, q: searchQuery }),
    enabled: true,
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (searchQuery.trim()) params.set('q', searchQuery.trim())
    if (activeCategory !== 'All') params.set('category', activeCategory)
    setSearchParams(params)
  }

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category)
    const params = new URLSearchParams()
    if (searchQuery.trim()) params.set('q', searchQuery.trim())
    if (category !== 'All') params.set('category', category)
    setSearchParams(params)
  }

  const goBack = () => navigate('/')

  return (
    <section className="app-screen-view min-h-screen" id="view-search">
      {/* Active Search Header with Glass Container */}
      <div className="sticky top-16 z-40 md:top-0">
        <GlassContainer className="px-4 py-3 border-b border-white/20 dark:border-slate-700/30" padding="none" gradient={true}>
          <div className="view-header flex items-center gap-3">
            <button onClick={goBack} className="back-btn p-2 rounded-full text-text-main hover:bg-white/20 dark:hover:bg-slate-800/50 transition-colors" aria-label="Go back">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <form onSubmit={handleSearch} className="flex-1 search-input-box flex items-center gap-3">
              <GlassInput
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products... (iPhone 15, MacBook, Sony, Shoes)"
                iconLeft={<SearchIcon className="w-4 h-4" />}
                className="bg-white/10 dark:bg-slate-800/30 border-white/20 dark:border-slate-700/30 focus:border-primary/50 focus:ring-primary/50"
              />
            </form>
            <button className="header-action-btn p-2 rounded-full bg-white/10 dark:bg-slate-800/30 border border-white/20 dark:border-slate-700/30 text-text-main transition-colors hover:bg-white/20 dark:hover:bg-slate-700/50" aria-label="Filter">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </GlassContainer>
      </div>

      {/* Category Filter Chips with Glass Effect */}
      <div className="category-filter-chips flex gap-2 px-4 py-2.5 border-b border-border-light overflow-x-auto scrollbar-hide bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        {CATEGORY_FILTERS.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`filter-chip px-4 py-1.5 rounded-full text-sm font-extrabold whitespace-nowrap transition-all ${
              activeCategory === cat
                ? 'bg-primary text-white shadow-lg shadow-primary/30'
                : 'bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm text-text-secondary hover:bg-white/90 dark:hover:bg-slate-700/90 border border-white/30 dark:border-slate-700/50'
            }`}
          >
            {cat} {cat !== 'All' && (
              <span className="ml-1.5 text-xs font-normal opacity-80">
                {productsData?.products?.filter((p: { category: string }) => p.category === cat).length || 0}
              </span>
            )}
          </button>
        ))}
      </div>

      <GlassContainer className="px-4 py-2 border-b border-white/20 dark:border-slate-700/30 mx-4" padding="none" gradient={false}>
        <div className="section-header flex justify-between items-center">
          <h3 className="section-title text-lg font-extrabold tracking-tight text-text-main">Compare Prices</h3>
          <span className="text-xs text-text-muted font-semibold">Real-time Stores Comparison</span>
        </div>
      </GlassContainer>

      {/* Product Comparison List with Glass Cards */}
      <div id="compare-products-list" className="pb-20 md:pb-8 px-4">
        {isLoading ? (
          <div className="space-y-4 py-8">
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
                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/10 dark:border-slate-700/30 mt-3">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="h-16 bg-white/20 dark:bg-slate-800/50 rounded-lg" />
                  ))}
                </div>
              </GlassCard>
            ))}
          </div>
        ) : isError ? (
          <GlassContainer className="text-center py-12 mx-4" padding="lg" rounded="2xl">
            <p className="font-bold text-lg mb-2 text-text-main">Failed to load products</p>
            <GlassButton variant="primary" onClick={() => window.location.reload()}>Retry</GlassButton>
          </GlassContainer>
        ) : productsData && productsData.products.length === 0 ? (
          <GlassContainer className="text-center py-16 mx-4" padding="xl" rounded="2xl">
            <div className="text-4xl mb-3">🔍</div>
            <p className="font-extrabold text-lg text-text-main mb-1">No products found matching "{searchQuery}"</p>
            <p className="text-sm text-text-muted mb-4">Try searching for iPhone 15, MacBook, Sony Headphones, or Shoes</p>
            <GlassButton variant="outline" size="lg" onClick={() => setSearchQuery('iPhone 15')}>
              Try "iPhone 15"
            </GlassButton>
          </GlassContainer>
        ) : (
          productsData?.products?.map((product) => (
            <GlassCard
              key={product.id}
              variant="outlined"
              hoverEffect="lift"
              clickable
              className="mb-3"
              onClick={() => navigate(`/product/${product.id}`)}
            >
              <ProductCard
                product={product}
                variant="comparison"
                onClick={() => navigate(`/product/${product.id}`)}
              />
            </GlassCard>
          ))
        )}
      </div>
    </section>
  )
}