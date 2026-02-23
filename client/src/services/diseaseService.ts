import api from './api'

export const getDiseaseBySlug = async (slug: string) => {
  const res = await api.get(`/diseases/${slug}`)
  return res.data
}