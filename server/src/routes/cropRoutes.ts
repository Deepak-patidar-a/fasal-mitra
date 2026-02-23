import { Router } from 'express'
import {
  getAllCrops,
  getCropBySlug,
  searchCrops
} from '../controllers/cropController'

const router = Router()

router.get('/', getAllCrops)
router.get('/search', searchCrops)
router.get('/:slug', getCropBySlug)

export default router