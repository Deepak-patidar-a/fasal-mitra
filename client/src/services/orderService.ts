import api from './api'

export const createOrder = async (listingId: string, quantity: number) => {
  const res = await api.post('/orders/create', { listingId, quantity })
  return res.data
}

export const verifyPayment = async (paymentData: {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
  dbOrderId: string
}) => {
  const res = await api.post('/orders/verify', paymentData)
  return res.data
}

export const getUserOrders = async () => {
  const res = await api.get('/orders/my-orders')
  return res.data
}