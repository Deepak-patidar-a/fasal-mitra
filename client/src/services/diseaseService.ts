import apiFetch from './api'

export const getDiseaseBySlug = (slug: string) =>
  apiFetch(`/diseases/${slug}`)