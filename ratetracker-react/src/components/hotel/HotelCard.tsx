import type { Hotel } from '@/types'
import { formatINR } from '@/utils'
import { cn } from '@/utils'
import { getEffectiveUrl } from '@/utils/cuelinks'
import { useAppStore } from '@/stores/appStore'
import { MapPin, Star, ExternalLink } from 'lucide-react'

interface HotelCardProps {
  hotel: Hotel
}

export function HotelCard({ hotel }: HotelCardProps) {
  const { linkMode } = useAppStore()
  const bestRate = hotel.rates.find(r => r.isLowest) || hotel.rates[0]

  const handleRateClick = (e: React.MouseEvent, rate: Hotel['rates'][0]) => {
    e.stopPropagation()
    e.preventDefault()
    const url = getEffectiveUrl(rate.directUrl, linkMode, `ratetracker_${hotel.id}_${rate.ota.toLowerCase()}`)
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const handleBookClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    const url = getEffectiveUrl(bestRate.directUrl, linkMode, `ratetracker_${hotel.id}_${bestRate.ota.toLowerCase()}`)
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <article className="hotel-card bg-white border border-border-subtle rounded-xl overflow-hidden shadow-sm transition-all hover:shadow-md hover:-translate-y-1 cursor-pointer">
      <div className="hotel-card-image relative h-40 bg-bg-subtle">
        <img
          src={hotel.image}
          alt={hotel.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <span className="hotel-badge-value absolute top-3 left-3 bg-success text-white text-xs font-extrabold px-2 py-1 rounded-full">
          {hotel.tag}
        </span>
      </div>
      <div className="hotel-card-body p-4">
        <div className="hotel-title-row flex justify-between items-start mb-2">
          <div>
            <h3 className="hotel-name text-lg font-extrabold text-text-main">{hotel.name}</h3>
            <div className="hotel-location flex items-center gap-1 text-xs text-text-muted mt-1">
              <MapPin className="w-3 h-3" />
              {hotel.location}
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-baseline justify-end gap-1">
              <span className="text-xl font-extrabold text-text-main">{formatINR(hotel.lowestPrice)}</span>
              <span className="text-xs text-text-muted">/night</span>
            </div>
            <span className="text-xs text-success font-bold">{hotel.discountPercent}% OFF</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-text-muted mb-3">
          <span className="flex items-center gap-1 text-warning font-bold">
            <Star className="w-4 h-4" />
            {hotel.rating}
          </span>
          <span className="font-medium">({hotel.reviewsCount})</span>
        </div>

        <div className="hotel-rates-comparison grid grid-cols-4 gap-2 pt-3 border-t border-border-light mt-3">
          {hotel.rates.map((rate) => (
            <button
              key={rate.ota}
              onClick={(e) => handleRateClick(e, rate)}
              className={cn(
                'hotel-rate-pill bg-bg-subtle rounded p-2 text-center transition-all',
                rate.isLowest && 'bg-success-bg border border-success-border'
              )}
            >
              <span className={cn(
                'hotel-ota-name text-[9px] font-bold block',
                rate.isLowest ? 'text-green-800' : 'text-text-muted'
              )}>
                {rate.ota} <ExternalLink className="inline w-3 h-3" />
              </span>
              <span className={cn(
                'hotel-ota-price text-sm font-extrabold',
                rate.isLowest ? 'text-green-700' : 'text-text-main'
              )}>
                {formatINR(rate.price)}
              </span>
            </button>
          ))}
        </div>

        <button
          onClick={handleBookClick}
          className="btn-primary w-full mt-4 py-3 text-base flex items-center justify-center gap-2"
        >
          Book Now via {bestRate.ota} <ExternalLink className="w-4 h-4" />
        </button>
      </div>
    </article>
  )
}