import { useState } from 'react'
import { createOrder, verifyPayment } from '@/services/orderService'

interface PaymentOptions {
  listingId: string
  quantity: number
  productName: string
  userName: string
  userEmail: string
  onSuccess: () => void
  onFailure: () => void
}

export const useRazorpay = () => {
  const [processing, setProcessing] = useState(false)

  const initiatePayment = async (options: PaymentOptions) => {
    setProcessing(true)

    try {
      // Step 1 — Get order from our backend
      const orderData = await createOrder(options.listingId, options.quantity)

      // Step 2 — Open Razorpay popup
      const razorpayOptions = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Fasal Mitra',
        description: options.productName,
        order_id: orderData.orderId,
        prefill: {
          name: options.userName,
          email: options.userEmail
        },
        theme: {
          color: '#4A7C59'
        },
        handler: async (response: any) => {
          // Step 3 — Verify payment on our backend
          try {
            await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              dbOrderId: orderData.dbOrderId
            })
            options.onSuccess()
          } catch {
            options.onFailure()
          }
        },
        modal: {
          ondismiss: () => {
            setProcessing(false)
          }
        }
      }

      const rzp = new (window as any).Razorpay(razorpayOptions)
      rzp.open()
    } catch (error) {
      options.onFailure()
    } finally {
      setProcessing(false)
    }
  }

  return { initiatePayment, processing }
}