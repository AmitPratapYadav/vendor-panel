import { apiRequest } from './api'

export async function fetchVendorOrders(params = {}) {
  const query = new URLSearchParams()

  if (params.assignment_status) {
    query.set('assignment_status', params.assignment_status)
  }

  if (params.order_status) {
    query.set('order_status', params.order_status)
  }

  const suffix = query.toString() ? `?${query.toString()}` : ''
  return apiRequest(`/vendor/orders${suffix}`)
}

export async function fetchVendorOrderDetails(orderId) {
  return apiRequest(`/vendor/orders/${orderId}`)
}

export async function acceptVendorOrder(orderId) {
  return apiRequest(`/vendor/orders/${orderId}/accept`, {
    method: 'POST',
  })
}

export async function rejectVendorOrder(orderId, rejectionReason) {
  return apiRequest(`/vendor/orders/${orderId}/reject`, {
    method: 'POST',
    body: JSON.stringify({
      rejection_reason: rejectionReason,
    }),
  })
}

export async function markVendorOrderProcessing(orderId) {
  return apiRequest(`/vendor/orders/${orderId}/mark-processing`, {
    method: 'POST',
  })
}

export async function markVendorOrderDispatched(orderId) {
  return apiRequest(`/vendor/orders/${orderId}/mark-dispatched`, {
    method: 'POST',
  })
}

export async function fetchVendorProfile() {
  return apiRequest('/vendor/profile')
}

export async function updateVendorProfile(payload) {
  return apiRequest('/vendor/profile', {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export async function toggleVendorOnline(isOnline) {
  return apiRequest('/vendor/toggle-online', {
    method: 'POST',
    body: JSON.stringify({
      is_online: isOnline,
    }),
  })
}

export async function fetchZones() {
  return apiRequest('/geo/zones')
}

export async function fetchCities(zoneId = null) {
  const suffix = zoneId ? `?zone_id=${zoneId}` : ''
  return apiRequest(`/geo/cities${suffix}`)
}