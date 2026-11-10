import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { hotelsApi } from '@/api'
import { HotelCard } from '@/components/hotel'
import type { Hotel } from '@/types'
import { ArrowLeft, Calendar, Users, Search, MapPin } from 'lucide-react'
import toast from 'react-hot-toast'
import { GlassCard, GlassContainer, GlassButton, GlassInput } from '@/components/three-d'

const POPULAR_DESTINATIONS = [
  { name: 'Goa', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=300&auto=format&fit=crop&q=80', count: '150+ hotels' },
  { name: 'Manali', image: 'https://images.unsplash.com/photo-1602343846087-95c0c0e7fad4?w=300&auto=format&fit=crop&q=80', count: '80+ hotels' },
  { name: 'Jaipur', image: 'https://images.unsplash.com/photo-1599661046827-dacde5f4e4b2?w=300&auto=format&fit=crop&q=80', count: '200+ hotels' },
  { name: 'Munnar', image: 'https://images.unsplash.com/photo-1602216056099-6a0e0f2d5b0b?w=300&auto=format&fit=crop&q=80', count: '60+ hotels' },
]

const SORT_OPTIONS = ['Recommended', 'Price: Low to High', 'Price: High to Low', 'Rating']

export function Hotels() {
  const navigate = useNavigate()
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState('2 Guests, 1 Room')
  const [destination, setDestination] = useState('')
  const [activeSort, setActiveSort] = useState('Recommended')

  const goBack = () => navigate('/')

  const { data: hotelsData, isLoading } = useQuery({
    queryKey: ['hotels', destination],
    queryFn: () => hotelsApi.getHotels(destination),
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!destination.trim()) {
      toast.error('Please enter a destination')
      return
    }
    toast.success(`Searching hotels in ${destination}...`, { icon: '🔍' })
  }

  const handleSortChange = (sort: string) => {
    setActiveSort(sort)
  }

  let hotels: Hotel[] = hotelsData?.hotels || []

  // Apply sorting
  if (activeSort === 'Price: Low to High') {
    hotels = [...hotels].sort((a, b) => a.lowestPrice - b.lowestPrice)
  } else if (activeSort === 'Price: High to Low') {
    hotels = [...hotels].sort((a, b) => b.lowestPrice - a.lowestPrice)
  } else if (activeSort === 'Rating') {
    hotels = [...hotels].sort((a, b) => b.rating - a.rating)
  }

  return (
    <section className="app-screen-view min-h-screen" id="view-hotels">
      {/* Header with Glass Container */}
      <div className="sticky top-16 z-40 md:top-0">
        <GlassContainer className="px-4 py-3 border-b border-white/20 dark:border-slate-700/30" padding="none" gradient={true}>
          <div className="view-header flex items-center gap-3">
            <button onClick={goBack} className="back-btn p-2 rounded-full text-text-main hover:bg-white/20 dark:hover:bg-slate-800/50 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="view-header-title text-xl font-extrabold text-text-main flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Hotels Price Comparison
            </h2>
          </div>
        </GlassContainer>
      </div>

      {/* Hero Search Widget with Glass Effect */}
      <GlassContainer className="mx-4 my-4" padding="lg" rounded="2xl" gradient={true}>
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="search-field">
            <label className="block text-xs font-bold text-text-secondary mb-1">Destination</label>
            <GlassInput
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Where are you going? (e.g. Goa, Manali, Jaipur)"
              iconLeft={<MapPin className="w-5 h-5" />}
              className="bg-white/10 dark:bg-slate-800/30 border-white/20 dark:border-slate-700/30 focus:border-primary/50 focus:ring-primary/50"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="search-field">
              <label className="block text-xs font-bold text-text-secondary mb-1">Check-in</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white/10 dark:bg-slate-800/30 border border-white/20 dark:border-slate-700/30 rounded-lg text-text-main focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>
            <div className="search-field">
              <label className="block text-xs font-bold text-text-secondary mb-1">Check-out</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white/10 dark:bg-slate-800/30 border border-white/20 dark:border-slate-700/30 rounded-lg text-text-main focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  min={checkIn || new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>
            <div className="search-field">
              <label className="block text-xs font-bold text-text-secondary mb-1">Guests & Rooms</label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                <select
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white/10 dark:bg-slate-800/30 border border-white/20 dark:border-slate-700/30 rounded-lg text-text-main focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer"
                >
                  <option>1 Guest, 1 Room</option>
                  <option>2 Guests, 1 Room</option>
                  <option>3 Guests, 1 Room</option>
                  <option>4 Guests, 2 Rooms</option>
                  <option>5 Guests, 2 Rooms</option>
                </select>
              </div>
            </div>
            <div className="search-field md:col-span-4">
              <GlassButton
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                iconLeft={<Search className="w-5 h-5" />}
              >
                Search Hotels & Compare OTAs
              </GlassButton>
            </div>
          </div>
        </form>
      </GlassContainer>

      {/* Popular Destinations with Glass Cards */}
      <GlassContainer className="px-4 pt-2 pb-1 mx-4" padding="none" gradient={false}>
        <div className="section-header flex justify-between items-center">
          <h3 className="section-title text-lg font-extrabold tracking-tight text-text-main flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            Popular Destinations
          </h3>
          {destination && (
            <button
              onClick={() => setDestination('')}
              className="text-xs font-bold text-primary hover:underline"
            >
              Clear Filter
            </button>
          )}
        </div>
      </GlassContainer>

      <div className="destinations-scroll flex gap-3 px-4 pb-4 overflow-x-auto scrollbar-hide">
        {POPULAR_DESTINATIONS.map((dest) => (
          <GlassCard
            key={dest.name}
            variant="outlined"
            hoverEffect="lift"
            clickable
            className="min-w-[160px] max-w-[160px] flex-shrink-0 p-0 overflow-hidden"
            onClick={(e) => {
              e.preventDefault()
              setDestination(dest.name)
              toast.success(`Showing hotels in ${dest.name}`)
            }}
          >
            <div className="relative h-24 overflow-hidden">
              <img
                src={dest.image}
                alt={dest.name}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
              <div className="absolute bottom-2 left-2 right-2">
                <span className="bg-black/70 text-white text-xs px-2 py-1 rounded-full">{dest.count}</span>
              </div>
            </div>
            <div className="p-3">
              <h4 className="font-extrabold text-text-main text-sm">{dest.name}</h4>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Sort Bar with Glass Effect */}
      <div className="sort-bar flex items-center gap-2 px-4 py-2 border-y border-white/20 dark:border-slate-700/30 overflow-x-auto scrollbar-hide bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <span className="text-xs font-bold text-text-muted flex-shrink-0">Sort by:</span>
        {SORT_OPTIONS.map((sort) => (
          <button
            key={sort}
            onClick={() => handleSortChange(sort)}
            className={`sort-btn px-3 py-1.5 rounded-full text-xs font-extrabold whitespace-nowrap transition-all ${
              activeSort === sort
                ? 'bg-primary text-white shadow-lg shadow-primary/30'
                : 'bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm text-text-secondary hover:bg-white/90 dark:hover:bg-slate-700/90 border border-white/30 dark:border-slate-700/50'
            }`}
          >
            {sort}
          </button>
        ))}
      </div>

      {/* Hotels List with Glass Cards */}
      <div id="hotels-list-container" className="px-4 py-4 space-y-4 pb-20">
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
        ) : hotels.length > 0 ? (
          hotels.map((hotel) => (
            <GlassCard key={hotel.id} variant="outlined" hoverEffect="lift" className="p-0 overflow-hidden">
              <HotelCard hotel={hotel} />
            </GlassCard>
          ))
        ) : (
          <GlassContainer className="text-center py-12 mx-4" padding="xl" rounded="2xl">
            <div className="text-4xl mb-3">🏨</div>
            <p className="font-bold text-lg text-text-main mb-2">No hotels found matching "{destination}"</p>
            <p className="text-sm text-text-muted mb-4">Try exploring Goa or clear the destination search</p>
            <GlassButton variant="outline" onClick={() => setDestination('')}>Show All Hotels</GlassButton>
          </GlassContainer>
        )}
      </div>
    </section>
  )
}
