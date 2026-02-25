import apiFetch from './api'

export const createOrder = (listingId: string, quantity: number) =>
  apiFetch('/orders/create', { method: 'POST', body: { listingId, quantity } })

export const verifyPayment = (paymentData: object) =>
  apiFetch('/orders/verify', { method: 'POST', body: paymentData })

export const getUserOrders = () =>
  apiFetch('/orders/my-orders')