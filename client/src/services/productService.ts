import api from './api'

export const getProductById = async (id: string) => {
  const res = await api.get(`/products/${id}`)
  return res.data
}

export const getAllProducts = async () => {
  const res = await api.get('/products')
  return res.data
}