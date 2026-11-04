import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useAppStore } from '@/stores/appStore'
import { productsApi } from '@/api'
import { ProductCard } from '@/components/product'
import { CATEGORIES } from '@/types'
import { Search, ShoppingBag, Bell, ChevronRight, Sparkles, Store, Shield, ArrowRight, Star } from 'lucide-react'
import { SEO, SEO_CONFIGS } from '@/components/common/SEO'

const QUICK_TAGS = ['iPhone 15', 'Laptop', 'Headphones', 'Shoes', 'Samsung S23', 'Smart TV']

const FEATURES = [
  { icon: ShoppingBag, title: 'Best Price Comparison', color: 'bg-success-bg text-success', desc: 'Compare & save more' },
  { icon: Bell, title: 'Price Drop Alerts', color: 'bg-warning-bg text-warning', desc: 'Get notified when prices drop' },
  { icon: Store, title: 'Top Brands & Stores', color: 'bg-primary-light text-primary', desc: 'Amazon, Flipkart, Croma & more' },
  { icon: Shield, title: 'Secure Shopping', color: 'bg-green-100 text-green-700', desc: 'Verified merchants only' },
]

const PROMO_BANNER_IMAGE = 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=200&auto=format&fit=crop&q=80'

export function Home() {
  const navigate = useNavigate()
  const { searchQuery, setSearchQuery, activeCategory, setActiveCategory } = useAppStore()
  const [activeHeroTab, setActiveHeroTab] = useState<'products' | 'hotels'>('products')
  const [activeTag, setActiveTag] = useState<string | null>(null)

  const { data: productsData, isLoading } = useQuery({
    queryKey: ['products', { category: activeCategory, query: searchQuery }],
    queryFn: () => productsApi.getProducts({ category: activeCategory, q: searchQuery }),
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate('/search')
    }
  }

  const handleTagClick = (tag: string) => {
    setActiveTag(tag)
    setSearchQuery(tag)
    navigate('/search')
  }

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category)
    navigate('/search')
  }

  const handleHeroTabChange = (tab: 'products' | 'hotels') => {
    setActiveHeroTab(tab)
    if (tab === 'hotels') {
      navigate('/hotels')
    } else {
      navigate('/search')
    }
  }

  // Top deals from products data
  const topDeals = productsData?.products?.slice(0, 6) || []

  return (
    <>
      <SEO {...SEO_CONFIGS.home} />
      <section className="app-screen-view" id="view-home">
      {/* Hero Card Banner */}
      <div className="hero-card m-4 rounded-2xl p-5 md:p-6 text-white relative overflow-hidden" style={{ background: 'var(--hero-gradient)' }}>
        <div className="hero-pill-badge inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wide mb-3">
          <Star className="w-4 h-4" />
          <span>India's #1 Price Comparison</span>
        </div>
        <h2 className="hero-heading text-2xl md:text-3xl font-extrabold leading-tight tracking-tight mb-3">
          Same Product.<br />Different Prices.
        </h2>
        <p className="hero-subheading text-sm md:text-base opacity-90 leading-relaxed mb-5 max-w-xs md:max-w-md">
          Compare prices from top stores like Amazon, Flipkart, Croma and get the best deal, always!
        </p>

        {/* Hero Category Switcher */}
        <div className="hero-category-tabs flex gap-2.5">
          <button
            onClick={() => handleHeroTabChange('products')}
            className={`hero-cat-btn flex-1 flex items-center gap-3 p-3 rounded-lg border transition-all ${
              activeHeroTab === 'products'
                ? 'bg-white text-primary border-white shadow-lg'
                : 'bg-white/10 border-white/25 text-white hover:bg-white/20'
            }`}
          >
            <span className="hero-cat-icon w-10 h-10 rounded-lg flex items-center justify-center text-2xl bg-white/20">
              🛍️
            </span>
            <div className="hero-cat-text text-left">
              <strong className="block text-sm font-bold">Shop Products</strong>
              <span className="text-xs opacity-85">Compare & save more</span>
            </div>
          </button>
          <button
            onClick={() => handleHeroTabChange('hotels')}
            className={`hero-cat-btn flex-1 flex items-center gap-3 p-3 rounded-lg border transition-all ${
              activeHeroTab === 'hotels'
                ? 'bg-orange-500 text-white border-orange-500 shadow-lg'
                : 'bg-white/10 border-white/25 text-white hover:bg-white/20'
            }`}
          >
            <span className="hero-cat-icon w-10 h-10 rounded-lg flex items-center justify-center text-2xl bg-white/20">
              🏨
            </span>
            <div className="hero-cat-text text-left">
              <strong className="block text-sm font-bold">Book Hotels</strong>
              <span className="text-xs opacity-85">Find best hotels & deals</span>
            </div>
          </button>
        </div>
      </div>

      {/* Universal Search Bar */}
      <form onSubmit={handleSearch} className="search-container mx-4">
        <div className="search-input-box flex items-center bg-white border-2 border-border-subtle rounded-full px-4 py-2 shadow-sm focus-within:border-primary focus-within:shadow-[0_6px_20px_-2px_rgba(30,98,254,0.2)] transition-all">
          <Search className="w-5 h-5 text-text-muted flex-shrink-0" />
          <input
            type="text"
            id="main-search-input"
            placeholder="Search for products, brands, or hotels..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 border-none outline-none px-3 py-2 text-base text-text-main placeholder:text-text-muted bg-transparent font-family-inherit"
            autoComplete="off"
          />
          <button
            type="submit"
            className="search-action-btn bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center transition-all hover:bg-primary-hover hover:scale-105"
            aria-label="Search"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </form>

      {/* Quick Search Tags */}
      <div className="quick-tags-scroll flex gap-2 px-4 pb-3 overflow-x-auto scrollbar-hide">
        {QUICK_TAGS.map((tag) => (
          <button
            key={tag}
            onClick={() => handleTagClick(tag)}
            className={`tag-pill px-4 py-2 bg-white border rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
              activeTag === tag
                ? 'bg-primary-light text-primary border-primary/30'
                : 'text-text-secondary border-border-subtle hover:bg-primary-light hover:text-primary'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Feature Value Badges */}
      <div className="features-grid grid grid-cols-2 md:grid-cols-4 gap-2.5 px-4 pb-4">
        {FEATURES.map((feature, index) => (
          <Link
            key={feature.title}
            to={index === 0 ? '/search' : index === 1 ? '/price-drop' : index === 2 ? '/categories' : '/hotels'}
            className="feature-badge-card bg-white border border-border-light rounded-lg p-3 flex flex-col items-center gap-2 transition-all hover:-translate-y-1 hover:shadow-md hover:border-border-subtle"
          >
            <div className={`feature-icon-wrapper w-10 h-10 rounded-lg flex items-center justify-center text-xl ${feature.color}`}>
              <feature.icon className="w-5 h-5" />
            </div>
            <span className="feature-badge-title text-xs font-extrabold text-text-main text-center leading-snug">
              {feature.title}
            </span>
          </Link>
        ))}
      </div>

      {/* Top Deals Today Section */}
      <div className="section-header flex justify-between items-center px-4 pt-2 pb-1">
        <h3 className="section-title text-lg font-extrabold tracking-tight text-text-main flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-warning" />
          Top Deals Today
        </h3>
        <Link to="/price-drop" className="view-all-link text-sm font-extrabold text-primary flex items-center gap-1 hover:text-primary-hover transition-all">
          View All <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {isLoading ? (
        <div className="deals-horizontal-scroll flex gap-3 px-4 pb-4 overflow-x-auto scrollbar-hide">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="min-w-[148px] max-w-[148px] bg-white border border-border-light rounded-xl p-3 animate-pulse">
              <div className="h-24 bg-bg-subtle rounded-lg mb-2" />
              <div className="h-4 bg-bg-subtle rounded w-3/4 mb-1" />
              <div className="h-3 bg-bg-subtle rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <div className="deals-horizontal-scroll flex gap-3 px-4 pb-4 overflow-x-auto scrollbar-hide">
          {topDeals.map((product) => (
            <ProductCard key={product.id} product={product} variant="deal" />
          ))}
          {topDeals.length === 0 && (
            <div className="min-w-[148px] max-w-[148px] bg-white border border-border-light rounded-xl p-3 text-center text-text-muted text-sm">
              No deals available
            </div>
          )}
        </div>
      )}

      {/* Big Savings Promotional Banner */}
      <div className="promo-banner mx-4 mb-6 bg-slate-900 rounded-xl p-4 md:p-5 flex flex-col md:flex-row items-center justify-between gap-4" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
        <div className="promo-text text-center md:text-left">
          <strong className="block text-lg font-extrabold text-white mb-1">Big Savings</strong>
          <span className="text-sm text-slate-400 block mb-3 md:mb-4">on Your Favourite Brands</span>
          <Link to="/categories" className="promo-btn inline-block bg-white text-slate-900 px-5 py-2 rounded-full text-sm font-extrabold transition-all hover:bg-primary hover:text-white">
            Shop Now
          </Link>
        </div>
        <div className="promo-img-wrap w-20 h-16 md:w-24 md:h-20 flex-shrink-0">
          <img src={PROMO_BANNER_IMAGE} alt="Headphones deal" className="max-h-full max-w-full object-contain" />
        </div>
      </div>

      {/* Popular Categories Preview */}
      <div className="section-header flex justify-between items-center px-4 pt-2 pb-1">
        <h3 className="section-title text-lg font-extrabold tracking-tight text-text-main flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-primary" />
          Popular Categories
        </h3>
        <Link to="/categories" className="view-all-link text-sm font-extrabold text-primary flex items-center gap-1">
          View All <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="categories-preview-grid grid grid-cols-3 gap-3 px-4 pb-4">
        {CATEGORIES.slice(0, 3).map((cat) => (
          <Link
            key={cat.name}
            to="/categories"
            onClick={() => handleCategoryClick(cat.name)}
            className="category-tile bg-white border border-border-light rounded-lg p-4 flex flex-col items-center text-center gap-2 transition-all hover:-translate-y-1 hover:border-primary-light hover:shadow-md"
          >
            <div className="category-icon-box w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ backgroundColor: cat.color }}>
              {cat.icon}
            </div>
            <span className="category-title text-sm font-extrabold text-text-main">{cat.name}</span>
          </Link>
        ))}
      </div>
    </section>
  )
}