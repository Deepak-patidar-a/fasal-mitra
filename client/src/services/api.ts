const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

interface RequestOptions {
  method?: string
  body?: any
  headers?: Record<string, string>
}

let isRefreshing = false
let failedQueue: Array<{
  resolve: (value: any) => void
  reject: (reason: any) => void
  url: string
  options: RequestOptions
}> = []

const processQueue = (error: any) => {
  failedQueue.forEach(({ resolve, reject, url, options }) => {
    if (error) reject(error)
    else resolve(apiFetch(url, options))
  })
  failedQueue = []
}

export const apiFetch = async (
  endpoint: string,
  options: RequestOptions = {}
): Promise<any> => {
  const url = `${BASE_URL}${endpoint}`

  const response = await fetch(url, {
    method: options.method || 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    body: options.body ? JSON.stringify(options.body) : undefined
  })

  // Token expired — try refresh
  if (response.status === 401 && !endpoint.includes('/auth/refresh')) {
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject, url: endpoint, options })
      })
    }

    isRefreshing = true

    try {
      const refreshRes = await fetch(`${BASE_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include'
      })

      if (!refreshRes.ok) throw new Error('Refresh failed')

      processQueue(null)
      return apiFetch(endpoint, options)
    } catch (err) {
      processQueue(err)
      window.location.href = '/login'
      throw err
    } finally {
      isRefreshing = false
    }
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }))
    throw new Error(error.message || 'Request failed')
  }

  // Handle empty responses
  const text = await response.text()
  return text ? JSON.parse(text) : null
}

export default apiFetch