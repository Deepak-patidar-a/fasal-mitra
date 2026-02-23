import { Router } from 'express'
import {
  getAllProducts,
  getProductById,
  getProductsByDisease
} from '../controllers/productController'

const router = Router()

router.get('/', getAllProducts)
router.get('/:id', getProductById)
router.get('/disease/:diseaseId', getProductsByDisease)

export default router