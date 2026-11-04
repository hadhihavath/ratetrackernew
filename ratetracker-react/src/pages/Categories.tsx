import { Link, useNavigate } from 'react-router-dom'
import { useAppStore } from '@/stores/appStore'
import { CATEGORIES, BRANDS } from '@/types'
import { ArrowLeft, Search, ChevronRight, ShoppingBag } from 'lucide-react'

const PROMO_BANNER_IMAGE = 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=200&auto=format&fit=crop&q=80'

export function Categories() {
  const navigate = useNavigate()
  const { setActiveCategory } = useAppStore()

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category)
    navigate('/search')
  }

  const goBack = () => navigate('/')

  return (
    <section className="app-screen-view" id="view-categories">
      <div className="view-header flex items-center gap-3 px-4 py-3.5 border-b border-border-light bg-white sticky top-16 z-40 md:top-0">
        <button onClick={goBack} className="back-btn p-2 rounded-full text-text-main hover:bg-bg-subtle transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="view-header-title text-xl font-extrabold text-text-main">Categories</h2>
        <Link to="/search" className="header-action-btn p-2 rounded-full bg-bg-subtle border border-border-subtle text-text-main transition-colors hover:bg-border-subtle">
          <Search className="w-5 h-5" />
        </Link>
      </div>

      {/* Full Categories Grid */}
      <div className="categories-preview-grid grid grid-cols-3 gap-3 px-4 py-4">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.name}
            to="/search"
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

      {/* Popular Brands */}
      <div className="section-header flex justify-between items-center px-4 pt-2 pb-1">
        <h3 className="section-title text-lg font-extrabold tracking-tight text-text-main flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-primary" />
          Popular Brands
        </h3>
        <Link to="/search" className="view-all-link text-sm font-extrabold text-primary flex items-center gap-1">
          View All <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="brands-row grid grid-cols-4 gap-2.5 px-4 pb-4">
        {BRANDS.map((brand) => (
          <Link
            key={brand.name}
            to="/search"
            onClick={(e) => {
              e.preventDefault()
              navigate(`/search?q=${encodeURIComponent(brand.name)}`)
            }}
            className="brand-chip-card bg-white border border-border-subtle rounded-lg py-2.5 flex items-center justify-center font-extrabold text-sm text-text-main transition-all hover:border-primary hover:text-primary hover:scale-[1.02]"
          >
            {brand.name}
          </Link>
        ))}
      </div>

      {/* Big Savings Promotional Banner */}
      <div className="promo-banner mx-4 mb-6 bg-slate-900 rounded-xl p-4 md:p-5 flex flex-col md:flex-row items-center justify-between gap-4" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
        <div className="promo-text text-center md:text-left">
          <strong className="block text-lg font-extrabold text-white mb-1">Big Savings</strong>
          <span className="text-sm text-slate-400 block mb-3 md:mb-4">on Your Favourite Brands</span>
          <Link to="/search" className="promo-btn inline-block bg-white text-slate-900 px-5 py-2 rounded-full text-sm font-extrabold transition-all hover:bg-primary hover:text-white">
            Shop Now
          </Link>
        </div>
        <div className="promo-img-wrap w-20 h-16 md:w-24 md:h-20 flex-shrink-0">
          <img src={PROMO_BANNER_IMAGE} alt="Headphones deal" className="max-h-full max-w-full object-contain" />
        </div>
      </div>
    </section>
  )
}