import apiFetch from './api'

export const getCropBySlug = (slug: string) =>
  apiFetch(`/crops/${slug}`)

export const getAllCrops = () =>
  apiFetch('/crops')

export const searchCrops = (q: string) =>
  apiFetch(`/crops/search?q=${encodeURIComponent(q)}`)