import { cn } from '@/utils'

interface SkeletonProps {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular' | 'card' | 'product' | 'hotel'
  width?: string
  height?: string
}

export function Skeleton({ className, variant = 'text', width, height }: SkeletonProps) {
  const baseStyles = 'animate-pulse bg-bg-subtle rounded'

  const variants = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
    card: 'rounded-xl border border-border-light bg-white',
    product: 'rounded-xl border border-border-light bg-white p-4',
    hotel: 'rounded-xl border border-border-light bg-white p-4',
  }

  return (
    <div
      className={cn(baseStyles, variants[variant], className)}
      style={{ width, height }}
      aria-hidden="true"
    />
  )
}

export function ProductCardSkeleton() {
  return (
    <div className="card-base min-w-[148px] max-w-[148px] flex-shrink-0">
      <Skeleton variant="rectangular" className="aspect-square mb-3" />
      <Skeleton variant="text" className="w-3/4 mb-1" />
      <Skeleton variant="text" className="w-1/2 mb-2" />
      <Skeleton variant="text" className="w-1/4 h-5" />
    </div>
  )
}

export function HotelCardSkeleton() {
  return (
    <div className="card-base">
      <div className="flex gap-4">
        <Skeleton variant="rectangular" className="w-24 h-24 flex-shrink-0 rounded-lg" />
        <div className="flex-1 space-y-3">
          <Skeleton variant="text" className="w-3/4 h-5" />
          <Skeleton variant="text" className="w-1/2 h-4" />
          <Skeleton variant="text" className="w-1/3 h-4" />
          <div className="flex gap-2">
            <Skeleton variant="rectangular" className="flex-1 h-10" />
            <Skeleton variant="rectangular" className="flex-1 h-10" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function ProductDetailSkeleton() {
  return (
    <div className="space-y-6 p-4">
      <div className="flex gap-4 items-start">
        <Skeleton variant="circular" className="w-52 h-52 flex-shrink-0" />
        <div className="flex-1 space-y-3">
          <Skeleton variant="text" className="w-3/4 h-6" />
          <Skeleton variant="text" className="w-1/2 h-4" />
          <Skeleton variant="text" className="w-1/3 h-8" />
          <div className="flex gap-2 mt-4">
            <Skeleton variant="rectangular" className="flex-1 h-12" />
            <Skeleton variant="rectangular" className="flex-1 h-12" />
          </div>
        </div>
      </div>
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} variant="rectangular" className="h-20" />
        ))}
      </div>
    </div>
  )
}

export function SearchSkeleton() {
  return (
    <div className="space-y-4 p-4">
      <Skeleton variant="rectangular" className="h-14 w-full max-w-md mx-auto rounded-full" />
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}

export function CategoryGridSkeleton() {
  return (
    <div className="grid grid-cols-3 gap-3 px-4 pb-4">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Skeleton key={i} variant="card" className="aspect-square flex items-center justify-center">
          <Skeleton variant="circular" className="w-12 h-12" />
          <Skeleton variant="text" className="w-20 h-4 mt-2 mx-auto" />
        </Skeleton>
      ))}
    </div>
  )
}

export function PriceHistoryChartSkeleton() {
  return (
    <div className="card-base p-4 h-64">
      <div className="flex gap-2 mb-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} variant="rectangular" className="flex-1 h-8" />
        ))}
      </div>
      <Skeleton variant="rectangular" className="h-48" />
    </div>
  )
}