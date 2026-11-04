import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useAppStore } from '@/stores/appStore'
import { productsApi } from '@/api'
import { ProductCard } from '@/components/product'
import { ArrowLeft, Search as SearchIcon, Filter } from 'lucide-react'

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
    <section className="app-screen-view" id="view-search">
      {/* Active Search Header */}
      <div className="view-header flex items-center gap-3 px-4 py-3.5 border-b border-border-light bg-white sticky top-16 z-40 md:top-0">
        <button onClick={goBack} className="back-btn p-2 rounded-full text-text-main hover:bg-bg-subtle transition-colors" aria-label="Go back">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <form onSubmit={handleSearch} className="flex-1 search-input-box flex items-center bg-white border-2 border-border-subtle rounded-full px-4 py-1.5 focus-within:border-primary focus-within:shadow-[0_6px_20px_-2px_rgba(30,98,254,0.2)] transition-all">
          <SearchIcon className="w-4 h-4 text-text-muted flex-shrink-0" />
          <input
            type="text"
            id="active-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="flex-1 border-none outline-none px-2 py-2 text-base text-text-main placeholder:text-text-muted bg-transparent font-family-inherit"
            autoComplete="off"
          />
        </form>
        <button className="header-action-btn p-2 rounded-full bg-bg-subtle border border-border-subtle text-text-main transition-colors hover:bg-border-subtle" aria-label="Filter">
          <Filter className="w-4 h-4" />
        </button>
      </div>

      {/* Category Filter Chips */}
      <div className="category-filter-chips flex gap-2 px-4 py-2.5 bg-white border-b border-border-light overflow-x-auto scrollbar-hide">
        {CATEGORY_FILTERS.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`filter-chip px-4 py-1.5 rounded-full text-sm font-extrabold whitespace-nowrap transition-all ${
              activeCategory === cat
                ? 'bg-primary text-white'
                : 'bg-bg-subtle text-text-secondary hover:bg-border-subtle'
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

      <div className="section-header flex justify-between items-center px-4 py-2 border-b border-border-light bg-white">
        <h3 className="section-title text-lg font-extrabold tracking-tight text-text-main">Compare Prices</h3>
        <span className="text-xs text-text-muted font-semibold">Real-time Stores Comparison</span>
      </div>

      {/* Product Comparison List */}
      <div id="compare-products-list" className="pb-20 md:pb-8">
        {isLoading ? (
          <div className="space-y-4 px-4 py-8">
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
                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border-light mt-3">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="h-16 bg-bg-subtle rounded-lg" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-12 px-4 text-text-muted">
            <p className="font-bold text-lg mb-2">Failed to load products</p>
            <button onClick={() => window.location.reload()} className="btn-primary">Retry</button>
          </div>
        ) : productsData && productsData.products.length === 0 ? (
          <div className="text-center py-16 px-4 text-text-muted">
            <div className="text-4xl mb-3">🔍</div>
            <p className="font-extrabold text-lg text-text-main mb-1">No products found matching "{searchQuery}"</p>
            <p className="text-sm">Try searching for iPhone 15, MacBook, Sony Headphones, or Shoes</p>
          </div>
        ) : (
          productsData?.products?.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              variant="comparison"
              onClick={() => navigate(`/product/${product.id}`)}
            />
          ))
        )}
      </div>
    </section>
  )
}