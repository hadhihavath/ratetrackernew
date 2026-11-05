import { Link, useNavigate } from 'react-router-dom'
import { CATEGORIES, BRANDS } from '@/types'
import { ArrowLeft, Search, ChevronRight, ShoppingBag } from 'lucide-react'
import { CategoryGrid3D, GlassContainer, GlassButton } from '@/components/three-d'

export function Categories() {
  const navigate = useNavigate()

  const goBack = () => navigate('/')

  // Prepare categories for 3D grid
  const categories3D = CATEGORIES.map((cat) => ({
    name: cat.name,
    icon: cat.icon,
    color: cat.color,
    href: `/search?category=${encodeURIComponent(cat.name)}`,
    productCount: Math.floor(Math.random() * 200) + 50, // Simulated product counts
  }))

  // Prepare brands for 3D grid
  const brands3D = BRANDS.map((brand) => ({
    name: brand.name,
    icon: '🏷️',
    color: '#1e3a8a',
    href: `/search?q=${encodeURIComponent(brand.name)}`,
    productCount: Math.floor(Math.random() * 100) + 20,
  }))

  return (
    <section className="app-screen-view min-h-screen" id="view-categories">
      <div className="view-header flex items-center gap-3 px-4 py-3.5 border-b border-border-light bg-white/80 backdrop-blur-xl sticky top-16 z-40 md:top-0">
        <button onClick={goBack} className="back-btn p-2 rounded-full text-text-main hover:bg-bg-subtle transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="view-header-title text-xl font-extrabold text-text-main">Categories</h2>
        <Link to="/search" className="header-action-btn p-2 rounded-full bg-bg-subtle border border-border-subtle text-text-main transition-colors hover:bg-border-subtle">
          <Search className="w-5 h-5" />
        </Link>
      </div>

      <div className="px-4 py-6 space-y-8">
        {/* Categories Section with 3D Grid */}
        <div>
          <div className="section-header flex justify-between items-center mb-4">
            <h3 className="section-title text-lg font-extrabold tracking-tight text-text-main flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-primary" />
              Shop by Category
            </h3>
            <Link to="/search" className="view-all-link text-sm font-extrabold text-primary flex items-center gap-1">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <CategoryGrid3D
            categories={categories3D}
            columns={3}
            className="px-4"
          />
        </div>

        {/* Popular Brands Section with 3D Grid */}
        <div>
          <div className="section-header flex justify-between items-center mb-4">
            <h3 className="section-title text-lg font-extrabold tracking-tight text-text-main flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-primary" />
              Popular Brands
            </h3>
            <Link to="/search" className="view-all-link text-sm font-extrabold text-primary flex items-center gap-1">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <CategoryGrid3D
            categories={brands3D}
            columns={4}
            className="px-4"
          />
        </div>

        {/* Big Savings Promotional Banner with Glass Container */}
        <GlassContainer
          className="mx-4 mb-6"
          padding="lg"
          rounded="2xl"
          gradient={true}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="promo-text text-center md:text-left">
              <strong className="block text-lg md:text-xl font-extrabold text-white mb-2">Big Savings</strong>
              <span className="text-sm md:text-base text-slate-300 block mb-4 md:mb-5">on Your Favourite Brands</span>
              <GlassButton
                variant="primary"
                size="md"
                iconLeft={<Search className="w-4 h-4" />}
                onClick={() => navigate('/search')}
              >
                Shop Now
              </GlassButton>
            </div>
            <div className="promo-img-wrap w-24 h-20 md:w-28 md:h-24 flex-shrink-0">
              <div className="w-full h-full rounded-xl bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                <span className="text-4xl md:text-5xl">🎧</span>
              </div>
            </div>
          </div>
        </GlassContainer>
      </div>
    </section>
  )
}