import { supabase, createPriceAlert, getUserPriceAlerts, deletePriceAlert } from '@/lib/supabase'
import type { AlertRequest, AlertResponse } from '@/types'

export const alertsApi = {
  // Create a price drop alert using Supabase
  createAlert: async (data: AlertRequest): Promise<AlertResponse> => {
    if (!supabase) {
      // Fallback to API if Supabase not configured
      const apiClient = (await import('./client')).default
      return apiClient.post<AlertResponse>('/api/alerts', data)
    }

    const { data: alert, error } = await createPriceAlert({
      user_id: data.userId || 'anonymous',
      product_id: data.productId,
      target_price: data.targetPrice,
      email: data.email,
      is_active: true,
    })

    if (error) throw error

    return {
      success: true,
      alertId: alert.id,
      message: 'Price alert created successfully',
    }
  },

  // Get user's price alerts
  getUserAlerts: async (userId: string): Promise<AlertResponse[]> => {
    if (!supabase) return []

    const alerts = await getUserPriceAlerts(userId)
    return alerts.map((alert) => ({
      success: true,
      alertId: alert.id,
      message: 'Alert retrieved',
      data: alert,
    }))
  },

  // Delete a price alert
  deleteAlert: async (alertId: string): Promise<AlertResponse> => {
    if (!supabase) {
      const apiClient = (await import('./client')).default
      return apiClient.post<AlertResponse>(`/api/alerts/${alertId}/delete`, {})
    }

    await deletePriceAlert(alertId)
    return { success: true, alertId, message: 'Alert deleted' }
  },

  // Health check for alerts endpoint
  getStatus: async (): Promise<{ status: string; method: string }> => {
    if (!supabase) {
      return { status: 'Supabase not configured', method: 'GET' }
    }
    return { status: 'ok', method: 'GET' }
  },
}

export default alertsApi