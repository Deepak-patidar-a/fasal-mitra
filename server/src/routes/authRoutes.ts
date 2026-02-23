import { Router } from 'express'
import {
  register,
  login,
  logout,
  refreshToken,
  getMe,
  getSavedCrops,
  addToSearchHistory,
  saveCrop
} from '../controllers/authController'
import { protect } from '../middleware/authMiddleware'

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.post('/logout', logout)
router.post('/refresh', refreshToken)
router.get('/me', protect, getMe)
router.post('/save-crop', protect, saveCrop)
router.post('/search-history', protect, addToSearchHistory)
router.get('/saved-crops', protect, getSavedCrops)

export default router