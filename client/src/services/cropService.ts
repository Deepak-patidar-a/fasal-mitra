import api from './api'

export const getCropBySlug = async (slug: string) => {
  const res = await api.get(`/crops/${slug}`)
  return res.data
}

export const getAllCrops = async () => {
  const res = await api.get('/crops')
  return res.data
}

export const searchCrops = async (query: string) => {
  const res = await api.get(`/crops/search?q=${query}`)
  return res.data
}