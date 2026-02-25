import apiFetch from './api'

export const getProductById = (id: string) =>
  apiFetch(`/products/${id}`)

export const getAllProducts = () =>
  apiFetch('/products')