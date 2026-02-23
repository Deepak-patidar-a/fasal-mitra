import { Router } from 'express'
import {
  createOrder,
  verifyPayment,
  getUserOrders
} from '../controllers/orderController'
import { protect } from '../middleware/authMiddleware'

const router = Router()

// All order routes require authentication
router.post('/create', protect, createOrder)
router.post('/verify', protect, verifyPayment)
router.get('/my-orders', protect, getUserOrders)

export default router