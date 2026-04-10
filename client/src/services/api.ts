const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

let refreshPromise: Promise<void> | null = null

const isRefreshableEndpoint = (endpoint: string) => {
  const nonRefreshable = ['/auth/login', '/auth/register', '/auth/refresh', '/auth/logout']
  return !nonRefreshable.some((route) => endpoint.startsWith(route))
}

const ensureSession = async () => {
  if (!refreshPromise) {
    refreshPromise = fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include'
    }).then((refreshRes) => {
      if (!refreshRes.ok) throw new Error('Refresh failed')
    }).finally(() => {
      refreshPromise = null
    })
  }

  return refreshPromise
}

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

  if (response.status === 401 && !isRetry && isRefreshableEndpoint(endpoint)) {
    try {
      await ensureSession()
      return await request(endpoint, options, true)
    } catch {
      window.location.href = '/login'
      throw new Error('Session expired')
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
