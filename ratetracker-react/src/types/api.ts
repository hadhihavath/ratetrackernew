export interface ApiError {
  error: string
  details?: string
}

export interface HealthResponse {
  platform: string
  status: string
  timestamp: string
  components: {
    frontend: {
      technology: string
      status: string
      responsive: boolean
    }
    backend: {
      technology: string
      runtime: string
      status: string
    }
    database: {
      technology: string
      status: string
      details: {
        connected: boolean
        status: string
        url?: string
        message?: string
      }
    }
    affiliate_integration: {
      technology: string
      publisherCid: string
      status: string
      details: {
        connected: boolean
        publisherCid: string
        status: string
        note?: string
      }
    }
    product_information: {
      technology: string
      approvedMerchantsCount: number
      status: string
    }
    hosting: {
      technology: string
      environment: string
      status: string
    }
  }
}

export interface AlertRequest {
  productId: string
  email: string
  targetPrice: number
  userId?: string
}

export interface AlertResponse {
  success: boolean
  alertId?: string
  message: string
  data?: unknown
}

export interface PriceAlert {
  id: string
  user_id: string
  product_id: string
  target_price: number
  email: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface MerchantFeedsStatus {
  approvedMerchantsCount: number
  merchants: Array<{
    id: string
    name: string
    domain: string
    network: string
    approved: boolean
  }>
  feedSource: string
  lastSync: string
}

export interface UserProfile {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  cuelinks_api_key?: string
  notification_preferences: NotificationPreferences
  created_at: string
  updated_at: string
}

export interface NotificationPreferences {
  price_drops: boolean
  new_deals: boolean
  weekly_digest: boolean
  price_alert_triggered: boolean
}

export interface WishlistItem {
  id: string
  user_id: string
  product_id: string
  created_at: string
}