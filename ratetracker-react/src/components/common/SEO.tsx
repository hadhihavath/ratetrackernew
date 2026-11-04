import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

interface SEOProps {
  title?: string
  description?: string
  image?: string
  url?: string
  type?: 'website' | 'article'
  noIndex?: boolean
  noFollow?: boolean
}

const DEFAULT_TITLE = 'RateTracker.in - Compare Prices Across Amazon, Flipkart & Top Indian Stores'
const DEFAULT_DESCRIPTION = 'Compare product and hotel prices across Amazon, Flipkart, Croma, Reliance Digital, Booking.com & more. Track price drops, history, and get the lowest price guaranteed.'
const DEFAULT_IMAGE = '/og-image.png'
const SITE_URL = import.meta.env.VITE_APP_URL || 'https://ratetracker.in'

export function SEO({
  title,
  description,
  image,
  url,
  type = 'website',
  noIndex = false,
  noFollow = false,
}: SEOProps) {
  const location = useLocation()
  const currentUrl = url || `${SITE_URL}${location.pathname}${location.search}`
  const currentImage = image || `${SITE_URL}${DEFAULT_IMAGE}`
  const pageTitle = title ? `${title} | RateTracker.in` : DEFAULT_TITLE
  const pageDescription = description || DEFAULT_DESCRIPTION

  useEffect(() => {
    // Update document title
    document.title = pageTitle

    // Update meta tags
    updateMetaTag('description', pageDescription)
    updateMetaTag('og:title', pageTitle)
    updateMetaTag('og:description', pageDescription)
    updateMetaTag('og:image', currentImage)
    updateMetaTag('og:url', currentUrl)
    updateMetaTag('og:type', type)
    updateMetaTag('twitter:card', 'summary_large_image')
    updateMetaTag('twitter:title', pageTitle)
    updateMetaTag('twitter:description', pageDescription)
    updateMetaTag('twitter:image', currentImage)

    // Robots meta
    const robotsContent = [
      noIndex ? 'noindex' : 'index',
      noFollow ? 'nofollow' : 'follow',
    ].join(', ')
    updateMetaTag('robots', robotsContent)

    // Canonical URL
    updateCanonicalUrl(currentUrl)
  }, [pageTitle, pageDescription, currentUrl, currentImage, type, noIndex, noFollow])

  return null // This component doesn't render anything visible
}

function updateMetaTag(name: string, content: string) {
  let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement
  if (!meta) {
    meta = document.querySelector(`meta[property="${name}"]`) as HTMLMetaElement
  }
  if (!meta) {
    meta = document.createElement('meta')
    if (name.startsWith('og:') || name.startsWith('twitter:')) {
      meta.setAttribute('property', name)
    } else {
      meta.setAttribute('name', name)
    }
    document.head.appendChild(meta)
  }
  meta.setAttribute('content', content)
}

function updateCanonicalUrl(url: string) {
  let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement
  if (!link) {
    link = document.createElement('link')
    link.setAttribute('rel', 'canonical')
    document.head.appendChild(link)
  }
  link.setAttribute('href', url)
}

// Predefined SEO configs for each page
export const SEO_CONFIGS = {
  home: {
    title: 'RateTracker.in - Compare Prices & Save More',
    description: 'Compare product and hotel prices across Amazon, Flipkart, Croma, Reliance Digital, Booking.com & more. Track price drops, history, and get the lowest price guaranteed.',
  },
  search: {
    title: 'Search & Compare Prices',
    description: 'Search for products across multiple stores and compare prices instantly. Find the best deals on electronics, fashion, home & more.',
  },
  productDetail: (productName: string) => ({
    title: `${productName} - Price Comparison`,
    description: `Compare prices for ${productName} across Amazon, Flipkart, Croma & more. View price history, set alerts, and buy at the lowest price.`,
  }),
  categories: {
    title: 'Browse Categories',
    description: 'Explore product categories including Electronics, Fashion, Home & Kitchen, Beauty, Sports & more. Find the best deals in each category.',
  },
  priceDrop: {
    title: 'Price Drop Deals & Coupons',
    description: 'Discover the latest price drops, deals, and coupon codes across all major Indian stores. Save money on your favorite products.',
  },
  hotels: {
    title: 'Hotel Price Comparison',
    description: 'Compare hotel prices across Booking.com, MakeMyTrip, Goibibo & more. Find the best hotel deals for your next trip.',
  },
  wishlist: {
    title: 'My Wishlist',
    description: 'Track your saved products and get notified when prices drop. Manage your wishlist and never miss a deal.',
    noIndex: true,
  },
  account: {
    title: 'Account & Settings',
    description: 'Manage your RateTracker account, Cuelinks configuration, notification preferences, and more.',
    noIndex: true,
  },
}