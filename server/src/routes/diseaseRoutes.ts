import { Router } from 'express'
import { getAllDiseases, getDiseaseBySlug } from '../controllers/diseaseController'

const router = Router()

router.get('/', getAllDiseases)
router.get('/:slug', getDiseaseBySlug)

export default router