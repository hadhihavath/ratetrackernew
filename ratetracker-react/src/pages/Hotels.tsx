import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { productsApi } from '@/api'
import { HotelCard } from '@/components/hotel'
import { ArrowLeft, Calendar, Users, Search, MapPin } from 'lucide-react'
import toast from 'react-hot-toast'

const POPULAR_DESTINATIONS = [
  { name: 'Goa', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=300&auto=format&fit=crop&q=80', count: '150+ hotels' },
  { name: 'Manali', image: 'https://images.unsplash.com/photo-1602343846087-95c0c0e7fad4?w=300&auto=format&fit=crop&q=80', count: '80+ hotels' },
  { name: 'Jaipur', image: 'https://images.unsplash.com/photo-1599661046827-dacde5f4e4b2?w=300&auto=format&fit=crop&q=80', count: '200+ hotels' },
  { name: 'Munnar', image: 'https://images.unsplash.com/photo-1602216056099-6a0e0f2d5b0b?w=300&auto=format&fit=crop&q=80', count: '60+ hotels' },
]

const SORT_OPTIONS = ['Recommended', 'Price: Low to High', 'Price: High to Low', 'Rating', 'Distance']

export function Hotels() {
  const navigate = useNavigate()
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState('2 Guests, 1 Room')
  const [destination, setDestination] = useState('')
  const [activeSort, setActiveSort] = useState('Recommended')

  const goBack = () => navigate('/')

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

  const { data: hotelsData, isLoading } = useQuery({
    queryKey: ['hotels'],
    queryFn: () => productsApi.getProducts({ category: 'hotels' }),
  })

  // Transform Product to Hotel format for HotelCard
  const hotels = hotelsData?.products?.map((product: any) => ({
    id: product.id,
    name: product.title,
    city: product.category,
    location: product.category,
    rating: product.rating,
    reviewsCount: product.reviewsCount,
    lowestPrice: product.bestPrice,
    originalPrice: product.originalPrice,
    discountPercent: product.discountPercent,
    tag: product.badge || 'Popular',
    image: product.colors?.[0]?.img || 'https://via.placeholder.com/300',
    amenities: [],
    rates: product.stores?.map((store: any) => ({
      ota: store.name,
      price: store.price,
      isLowest: store.isBestDeal,
      directUrl: store.directUrl || '#',
    })) || [],
  })) || []

  return (
    <section className="app-screen-view" id="view-hotels">
      <div className="view-header flex items-center gap-3 px-4 py-3.5 border-b border-border-light bg-white sticky top-16 z-40 md:top-0">
        <button onClick={goBack} className="back-btn p-2 rounded-full text-text-main hover:bg-bg-subtle transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="view-header-title text-xl font-extrabold text-text-main flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          Hotels
        </h2>
      </div>

      {/* Hero Search Widget */}
      <div className="hero-search-widget mx-4 my-4 bg-white border border-border-light rounded-xl p-4 shadow-sm">
        <form onSubmit={handleSearch} className="space-y-3">
          <div className="search-field">
            <label className="block text-xs font-bold text-text-secondary mb-1">Destination</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Where are you going?"
                className="w-full pl-10 pr-4 py-2.5 bg-bg-subtle border border-border-subtle rounded-lg text-text-main placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
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
                  className="w-full pl-10 pr-4 py-2.5 bg-bg-subtle border border-border-subtle rounded-lg text-text-main focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
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
                  className="w-full pl-10 pr-4 py-2.5 bg-bg-subtle border border-border-subtle rounded-lg text-text-main focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
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
                  className="w-full pl-10 pr-4 py-2.5 bg-bg-subtle border border-border-subtle rounded-lg text-text-main focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer"
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
              <button
                type="submit"
                className="w-full btn-primary py-3 text-base font-extrabold flex items-center justify-center gap-2"
              >
                <Search className="w-5 h-5" />
                Search Hotels
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Popular Destinations */}
      <div className="section-header flex justify-between items-center px-4 pt-2 pb-1">
        <h3 className="section-title text-lg font-extrabold tracking-tight text-text-main flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          Popular Destinations
        </h3>
      </div>

      <div className="destinations-scroll flex gap-3 px-4 pb-4 overflow-x-auto scrollbar-hide">
        {POPULAR_DESTINATIONS.map((dest) => (
          <Link
            key={dest.name}
            to="/hotels"
            onClick={(e) => {
              e.preventDefault()
              setDestination(dest.name)
              toast.success(`Showing hotels in ${dest.name}`)
            }}
            className="destination-card min-w-[160px] max-w-[160px] bg-white border border-border-light rounded-xl overflow-hidden flex-shrink-0 transition-all hover:shadow-lg hover:-translate-y-1"
          >
            <div className="relative h-24">
              <img
                src={dest.image}
                alt={dest.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 right-2">
                <span className="bg-black/70 text-white text-xs px-2 py-1 rounded-full">{dest.count}</span>
              </div>
            </div>
            <div className="p-3">
              <h4 className="font-extrabold text-text-main text-sm">{dest.name}</h4>
            </div>
          </Link>
        ))}
      </div>

      {/* Sort Bar */}
      <div className="sort-bar flex items-center gap-2 px-4 py-2 bg-white border-y border-border-light overflow-x-auto scrollbar-hide">
        <span className="text-xs font-bold text-text-muted flex-shrink-0">Sort by:</span>
        {SORT_OPTIONS.map((sort) => (
          <button
            key={sort}
            onClick={() => handleSortChange(sort)}
            className={`sort-btn px-3 py-1.5 rounded-full text-xs font-extrabold whitespace-nowrap transition-all ${
              activeSort === sort
                ? 'bg-primary text-white'
                : 'bg-bg-subtle text-text-secondary hover:bg-border-subtle'
            }`}
          >
            {sort}
          </button>
        ))}
      </div>

      {/* Hotels List */}
      <div id="hotels-list-container" className="px-4 py-2 space-y-3 pb-20">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white border border-border-subtle rounded-xl p-4 animate-pulse">
                <div className="flex gap-4 items-center">
                  <div className="w-24 h-24 bg-bg-subtle rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <div className="h-5 bg-bg-subtle rounded w-3/4" />
                    <div className="h-4 bg-bg-subtle rounded w-1/2" />
                    <div className="h-6 bg-bg-subtle rounded w-1/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : hotels.length > 0 ? (
          hotels.map((hotel) => (
            <HotelCard key={hotel.id} hotel={hotel} />
          ))
        ) : (
          <div className="text-center py-12 text-text-muted">
            <p className="font-bold text-lg mb-2">No hotels available</p>
            <p className="text-sm">Check back later or search for a destination</p>
          </div>
        )}
      </div>
    </section>
  )
}