'use client';

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useAppStore } from '@/stores/appStore'
import { productsApi } from '@/api'
import { ProductCard } from '@/components/product'
import { Search, ShoppingBag, Bell, ChevronRight, Sparkles, Store, Shield, ArrowRight, Star, Zap, TrendingUp, Globe } from 'lucide-react'
import { SEO, SEO_CONFIGS } from '@/components/common/SEO'
import { Hero3D, Hero3DLite } from '@/components/three-d/Hero3D'
import { CategoryGrid3D } from '@/components/three-d/CategoryCard3D'
import { GlassCard, GlassCardInteractive, GlassButton } from '@/components/three-d/GlassCard'
import { motion } from 'framer-motion'

const QUICK_TAGS = ['iPhone 15', 'Laptop', 'Headphones', 'Shoes', 'Samsung S23', 'Smart TV']

const FEATURES = [
  { icon: ShoppingBag, title: 'Best Price Comparison', desc: 'Compare & save more', gradient: 'from-emerald-500 to-teal-600' },
  { icon: Bell, title: 'Price Drop Alerts', desc: 'Get notified instantly', gradient: 'from-amber-500 to-orange-600' },
  { icon: Store, title: 'Top Brands & Stores', desc: 'Amazon, Flipkart, Croma & more', gradient: 'from-blue-500 to-indigo-600' },
  { icon: Shield, title: 'Secure Shopping', desc: 'Verified merchants only', gradient: 'from-green-500 to-emerald-600' },
]

const PROMO_BANNER_IMAGE = 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=200&auto=format&fit=crop&q=80'

// Enhanced categories with product counts
const ENHANCED_CATEGORIES = [
  { name: 'Mobiles', icon: '📱', color: '#3b82f6', href: '/search?category=Mobiles', productCount: 247 },
  { name: 'Laptops', icon: '💻', color: '#10b981', href: '/search?category=Laptops', productCount: 189 },
  { name: 'Electronics', icon: '🎧', color: '#f59e0b', href: '/search?category=Electronics', productCount: 312 },
  { name: 'Home Appliances', icon: '🧺', color: '#ef4444', href: '/search?category=Home Appliances', productCount: 156 },
  { name: 'Fashion', icon: '👕', color: '#ec4899', href: '/search?category=Fashion', productCount: 423 },
  { name: 'Footwear', icon: '👟', color: '#14b8a6', href: '/search?category=Footwear', productCount: 198 },
  { name: 'Beauty & Care', icon: '🧴', color: '#f97316', href: '/search?category=Beauty & Personal Care', productCount: 267 },
  { name: 'Sports & Fitness', icon: '🏋️', color: '#8b5cf6', href: '/search?category=Sports & Fitness', productCount: 134 },
]

export function Home() {
  const navigate = useNavigate()
  const { searchQuery, setSearchQuery, activeCategory, deviceMode } = useAppStore()
  const [activeHeroTab, setActiveHeroTab] = useState<'products' | 'hotels'>('products')
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [show3D, setShow3D] = useState(true)

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

  const isMobile = deviceMode === 'mobile'

  return (
    <>
      <SEO {...SEO_CONFIGS.home} />
      <section className="app-screen-view" id="view-home">
        {/* ==================== ENHANCED HERO SECTION WITH 3D ==================== */}
        <div className="relative mx-4 mt-4 rounded-3xl overflow-hidden" style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
          minHeight: isMobile ? '420px' : '480px'
        }}>
          {/* 3D Background */}
          {show3D && !isMobile && <Hero3D />}
          {(!show3D || isMobile) && <Hero3DLite />}

          {/* Floating particles overlay */}
          <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
            <div className="absolute inset-0" style={{
              backgroundImage: `
                radial-gradient(ellipse at 15% 25%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
                radial-gradient(ellipse at 85% 75%, rgba(16, 185, 129, 0.12) 0%, transparent 50%),
                radial-gradient(ellipse at 50% 50%, rgba(245, 158, 11, 0.08) 0%, transparent 60%)
              `
            }} />
          </div>

          {/* Hero Content */}
          <div className="relative z-10 p-5 md:p-8 h-full flex flex-col justify-between">
            {/* Top Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full mb-6 max-w-fit"
            >
              <motion.span
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                className="w-5 h-5"
              >
                <Star className="w-5 h-5 text-warning" />
              </motion.span>
              <span className="text-xs md:text-sm font-extrabold uppercase tracking-wide text-white">
                India's #1 Price Comparison Platform
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="max-w-xl md:max-w-2xl"
            >
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight text-white mb-4">
                Same Product.
                <br />
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Different Prices.
                </span>
              </h1>
              <p className="text-base md:text-lg text-slate-300 leading-relaxed mb-6 max-w-md">
                Compare prices across Amazon, Flipkart, Croma, Reliance Digital & 10+ stores.
                Save up to 40% on every purchase.
              </p>

              {/* Hero Stats */}
              <div className="flex flex-wrap gap-4 md:gap-6 mb-6">
                <StatItem icon={Zap} value="40%" label="Average Savings" />
                <StatItem icon={TrendingUp} value="12+" label="Merchants" />
                <StatItem icon={Globe} value="1M+" label="Products Tracked" />
              </div>

              {/* Hero Category Switcher */}
              <div className="hero-category-tabs flex gap-2.5 flex-wrap">
                <button
                  onClick={() => handleHeroTabChange('products')}
                  className={`hero-cat-btn flex-1 min-w-[160px] flex items-center gap-3 p-4 rounded-xl border transition-all ${
                    activeHeroTab === 'products'
                      ? 'bg-white/10 text-white border-white/30 shadow-xl backdrop-blur-sm'
                      : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10 hover:text-white backdrop-blur-sm'
                  }`}
                >
                  <span className="hero-cat-icon w-12 h-12 rounded-lg flex items-center justify-center text-3xl bg-white/10">
                    🛍️
                  </span>
                  <div className="hero-cat-text text-left">
                    <strong className="block text-sm md:text-base font-bold">Shop Products</strong>
                    <span className="text-xs opacity-75">Compare & save more</span>
                  </div>
                </button>
                <button
                  onClick={() => handleHeroTabChange('hotels')}
                  className={`hero-cat-btn flex-1 min-w-[160px] flex items-center gap-3 p-4 rounded-xl border transition-all ${
                    activeHeroTab === 'hotels'
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white border-transparent shadow-xl shadow-orange-500/30'
                      : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10 hover:text-white backdrop-blur-sm'
                  }`}
                >
                  <span className="hero-cat-icon w-12 h-12 rounded-lg flex items-center justify-center text-3xl bg-white/10">
                    🏨
                  </span>
                  <div className="hero-cat-text text-left">
                    <strong className="block text-sm md:text-base font-bold">Book Hotels</strong>
                    <span className="text-xs opacity-75">Best rates guaranteed</span>
                  </div>
                </button>
              </div>
            </motion.div>

            {/* 3D Toggle (Desktop only) */}
            {!isMobile && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="absolute bottom-4 right-4 z-20"
              >
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={show3D}
                    onChange={(e) => setShow3D(e.target.checked)}
                    className="w-5 h-5 accent-primary rounded border-slate-600 bg-slate-800/50"
                  />
                  <span className="text-xs text-slate-300 font-medium">3D View</span>
                </label>
              </motion.div>
            )}
          </div>
        </div>

        {/* ==================== UNIVERSAL SEARCH BAR ==================== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mx-4 -mt-6 mb-6 relative z-20"
        >
          <GlassCard variant="elevated" blur="lg" className="p-1">
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  id="main-search-input"
                  placeholder="Search for products, brands, or hotels..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-none outline-none pl-12 pr-4 py-3.5 text-base text-slate-900 dark:text-white placeholder:text-slate-400 font-family-inherit"
                  autoComplete="off"
                />
              </div>
              <GlassButton
                type="submit"
                variant="primary"
                size="lg"
                iconRight={<ArrowRight className="w-5 h-5" />}
                className="px-6"
              >
                Search
              </GlassButton>
            </form>
          </GlassCard>
        </motion.div>

        {/* ==================== QUICK SEARCH TAGS ==================== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mx-4 mb-6"
        >
          <div className="flex gap-2 px-1 pb-3 overflow-x-auto scrollbar-hide snap-x">
            {QUICK_TAGS.map((tag, index) => (
              <motion.button
                key={tag}
                onClick={() => handleTagClick(tag)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`tag-pill px-4 py-2.5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border rounded-full text-sm font-semibold whitespace-nowrap transition-all snap-start ${
                  activeTag === tag
                    ? 'bg-primary text-white border-primary/30 shadow-lg shadow-primary/25'
                    : 'text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-primary/10 hover:text-primary hover:border-primary/20'
                }`}
              >
                {tag}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* ==================== FEATURE VALUE BADGES (Glass Cards) ==================== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mx-4 mb-6"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {FEATURES.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <Link
                  to={index === 0 ? '/search' : index === 1 ? '/price-drop' : index === 2 ? '/categories' : '/hotels'}
                  className="block"
                >
                  <GlassCardInteractive
                    hoverEffect="lift"
                    className="p-4 h-full flex flex-col items-center gap-3 text-center"
                  >
                    <div className={`feature-icon-wrapper w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-gradient-to-br ${feature.gradient}`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="feature-badge-title text-sm font-extrabold text-slate-900 dark:text-white leading-snug">
                      {feature.title}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{feature.desc}</span>
                  </GlassCardInteractive>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ==================== TOP DEALS TODAY ==================== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mx-4 mb-6"
        >
          <div className="section-header flex justify-between items-center px-1 pb-2 mb-4">
            <h3 className="section-title text-lg font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="w-5 h-5 text-warning" />
              </motion.div>
              Top Deals Today
            </h3>
            <Link to="/price-drop" className="view-all-link text-sm font-extrabold text-primary flex items-center gap-1 hover:text-primary-hover transition-all group">
              View All
              <motion.div
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ChevronRight className="w-4 h-4" />
              </motion.div>
            </Link>
          </div>

          {isLoading ? (
            <div className="deals-horizontal-scroll flex gap-3 px-1 pb-4 overflow-x-auto scrollbar-hide">
              {[1, 2, 3, 4].map((i) => (
                <GlassCard key={i} variant="outlined" className="min-w-[156px] max-w-[156px] p-3 animate-pulse">
                  <div className="h-28 bg-slate-200/50 dark:bg-slate-700/50 rounded-xl mb-2" />
                  <div className="h-4 bg-slate-200/50 dark:bg-slate-700/50 rounded w-3/4 mb-1" />
                  <div className="h-3 bg-slate-200/50 dark:bg-slate-700/50 rounded w-1/2" />
                </GlassCard>
              ))}
            </div>
          ) : (
            <div className="deals-horizontal-scroll flex gap-3 px-1 pb-4 overflow-x-auto scrollbar-hide">
              {topDeals.map((product) => (
                <ProductCard key={product.id} product={product} variant="deal" />
              ))}
              {topDeals.length === 0 && (
                <GlassCard variant="outlined" className="min-w-[156px] max-w-[156px] p-3 text-center text-slate-500 text-sm">
                  No deals available
                </GlassCard>
              )}
            </div>
          )}
        </motion.div>

        {/* ==================== BIG SAVINGS PROMO BANNER (Enhanced) ==================== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mx-4 mb-6"
        >
          <GlassCard variant="hero" blur="xl" className="p-5 md:p-7 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-purple-500/10" />
            <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="promo-text text-center md:text-left z-10">
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="inline-block bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent text-xs md:text-sm font-extrabold uppercase tracking-wider mb-2"
                >
                  Limited Time Offer
                </motion.span>
                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="text-xl md:text-2xl font-extrabold text-white mb-2"
                >
                  Big Savings
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="text-slate-300 mb-4 md:mb-6"
                >
                  on Your Favourite Brands
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <GlassButton
                    variant="primary"
                    size="md"
                    onClick={() => navigate('/categories')}
                    className="bg-white text-slate-900 hover:bg-slate-100 shadow-lg shadow-white/20"
                  >
                    Shop Now →
                  </GlassButton>
                </motion.div>
              </div>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="promo-img-wrap w-24 h-20 md:w-32 md:h-24 flex-shrink-0 relative z-10"
              >
                <img
                  src={PROMO_BANNER_IMAGE}
                  alt="Headphones deal"
                  className="max-h-full max-w-full object-contain filter drop-shadow-2xl"
                />
                {/* Floating animation */}
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-full blur-2xl animate-pulse" />
              </motion.div>
            </div>
          </GlassCard>
        </motion.div>

        {/* ==================== POPULAR CATEGORIES (3D Grid) ==================== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="mx-4 mb-6"
        >
          <div className="section-header flex justify-between items-center px-1 pb-2 mb-4">
            <h3 className="section-title text-lg font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-primary" />
              Popular Categories
            </h3>
            <Link to="/categories" className="view-all-link text-sm font-extrabold text-primary flex items-center gap-1 group">
              View All
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <CategoryGrid3D
            categories={ENHANCED_CATEGORIES}
            columns={isMobile ? 2 : 4}
            className="px-1"
          />
        </motion.div>

        {/* ==================== CUELINKS LIVE DEALS PREVIEW ==================== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="mx-4 mb-6"
        >
          <div className="section-header flex justify-between items-center px-1 pb-2 mb-4">
            <h3 className="section-title text-lg font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-warning" />
              Live Offers & Coupons
            </h3>
            <Link to="/price-drop" className="view-all-link text-sm font-extrabold text-primary flex items-center gap-1">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <GlassCard variant="outlined" className="p-4">
            <div className="flex items-center gap-3 text-center md:text-left">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-2xl flex-shrink-0 mx-auto md:mx-0">
                🔗
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-slate-900 dark:text-white mb-1">Cuelinks Verified Deals</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                  Real-time offers from Boat, Acer, Campus Shoes, Havells & 26,000+ campaigns
                </p>
                <GlassButton
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/price-drop')}
                >
                  Explore Live Deals
                </GlassButton>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </section>
    </>
  )
}

// Stat Item Component
function StatItem({ icon: Icon, value, label }: { icon: React.ElementType; value: string; label: string }) {
  return (
    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3">
      <Icon className="w-5 h-5 text-primary" />
      <div>
        <div className="text-lg font-extrabold text-white">{value}</div>
        <div className="text-xs text-slate-400">{label}</div>
      </div>
    </div>
  )
}