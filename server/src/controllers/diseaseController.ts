import { Request, Response } from 'express'
import Disease from '../models/Disease'
import { getCache, setCache } from '../utils/cache'

export const getDiseaseBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params
    const cacheKey = `disease_${slug}`

    const cached = getCache<any>(cacheKey)
    if (cached) {
      console.log(`Cache HIT: ${cacheKey}`)
      return res.json(cached)
    }

    const disease = await Disease.findOne({ slug })
      .populate('crops', 'name slug')
      .populate('products', 'name type description images listings')

    if (!disease) {
      return res.status(404).json({ message: 'Disease not found' })
    }

    setCache(cacheKey, disease)
    res.json(disease)
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

export const getAllDiseases = async (req: Request, res: Response) => {
  try {
    const cacheKey = 'all_diseases'

    const cached = getCache<any>(cacheKey)
    if (cached) {
      return res.json(cached)
    }

    const diseases = await Disease.find({}, 'name slug severity images crops')
      .populate('crops', 'name slug')

    setCache(cacheKey, diseases)
    res.json(diseases)
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}