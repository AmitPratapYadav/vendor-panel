import { apiRequest } from './api'

export async function fetchVendorDashboard(range = 'month') {
  return apiRequest(`/vendor/dashboard?range=${encodeURIComponent(range)}`)
}

export async function searchVendorOrders(query) {
  return apiRequest(`/vendor/search?q=${encodeURIComponent(query)}`)
}

export async function fetchVendorNotifications() {
  return apiRequest('/vendor/notifications')
}

export async function markVendorNotificationRead(notificationId) {
  return apiRequest(`/vendor/notifications/${notificationId}/read`, {
    method: 'POST',
  })
}

export async function fetchVendorProducts(params = {}) {
  const query = new URLSearchParams()

  if (params.search) query.set('search', params.search)
  if (params.category_id) query.set('category_id', params.category_id)
  if (params.catalog_status && params.catalog_status !== 'all') query.set('catalog_status', params.catalog_status)
  if (params.page) query.set('page', params.page)
  if (params.per_page) query.set('per_page', params.per_page)

  const suffix = query.toString() ? `?${query.toString()}` : ''
  return apiRequest(`/vendor/products${suffix}`)
}

export async function fetchVendorProduct(productId) {
  return apiRequest(`/vendor/products/${productId}`)
}

export async function syncVendorProductCatalog(productId, payload) {
  return apiRequest(`/vendor/products/${productId}/catalog`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}
