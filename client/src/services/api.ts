const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

let isRefreshing = false

const request = async (endpoint: string, options: any = {}, isRetry = false): Promise<any> => {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: options.method || 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    body: options.body ? JSON.stringify(options.body) : undefined
  })

  // If 401 and this is NOT already a retry — try refresh once
  if (response.status === 401 && !isRetry) {
    // Don't retry auth endpoints — avoid infinite loop
    if (endpoint.includes('/auth/')) {
      throw new Error('Unauthorized')
    }

    if (isRefreshing) {
      throw new Error('Unauthorized')
    }

    isRefreshing = true

    try {
      const refreshRes = await fetch(`${BASE_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include'
      })

      if (!refreshRes.ok) throw new Error('Refresh failed')

      // Retry original request once with isRetry=true
      return await request(endpoint, options, true)
    } catch {
      // Refresh failed — user needs to login again
      window.location.href = '/login'
      throw new Error('Session expired')
    } finally {
      isRefreshing = false
    }
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }))
    throw new Error(error.message || 'Request failed')
  }

  const text = await response.text()
  return text ? JSON.parse(text) : null
}

export const apiFetch = (endpoint: string, options: any = {}) =>
  request(endpoint, options, false)

export default apiFetch