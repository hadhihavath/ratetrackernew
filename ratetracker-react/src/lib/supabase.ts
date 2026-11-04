import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not configured. Price alerts and user features will not work.')
}

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Type definitions for Supabase tables
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

// Helper functions
export async function createPriceAlert(alert: Omit<PriceAlert, 'id' | 'created_at' | 'updated_at'>) {
  if (!supabase) throw new Error('Supabase not configured')

  const { data, error } = await supabase
    .from('price_alerts')
    .insert([alert])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getUserPriceAlerts(userId: string) {
  if (!supabase) return []

  const { data, error } = await supabase
    .from('price_alerts')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function deletePriceAlert(alertId: string) {
  if (!supabase) throw new Error('Supabase not configured')

  const { error } = await supabase
    .from('price_alerts')
    .delete()
    .eq('id', alertId)

  if (error) throw error
}

export async function getUserWishlist(userId: string) {
  if (!supabase) return []

  const { data, error } = await supabase
    .from('wishlist')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function addToWishlist(userId: string, productId: string) {
  if (!supabase) throw new Error('Supabase not configured')

  const { data, error } = await supabase
    .from('wishlist')
    .insert([{ user_id: userId, product_id: productId }])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function removeFromWishlist(userId: string, productId: string) {
  if (!supabase) throw new Error('Supabase not configured')

  const { error } = await supabase
    .from('wishlist')
    .delete()
    .eq('user_id', userId)
    .eq('product_id', productId)

  if (error) throw error
}

export async function updateUserProfile(userId: string, updates: Partial<UserProfile>) {
  if (!supabase) throw new Error('Supabase not configured')

  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getUserProfile(userId: string) {
  if (!supabase) return null

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null // Not found
    throw error
  }
  return data
}