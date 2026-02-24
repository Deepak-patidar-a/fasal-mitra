import NodeCache from 'node-cache'

// TTL = Time To Live in seconds
// Crops and diseases don't change often — cache for 1 hour
const cache = new NodeCache({ stdTTL: 3600, checkperiod: 600 })

export const getCache = <T>(key: string): T | undefined => {
  return cache.get<T>(key)
}

export const setCache = <T>(key: string, value: T): void => {
  cache.set(key, value)
}

export const deleteCache = (key: string): void => {
  cache.del(key)
}

export const flushCache = (): void => {
  cache.flushAll()
}

export default cache