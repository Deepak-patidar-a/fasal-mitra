import { Request, Response } from 'express'
import Crop from '../models/Crop'
import { getCache, setCache } from '../utils/cache'

export const getCropBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params
    const cacheKey = `crop_${slug}`

    // Check cache first
    const cached = getCache<any>(cacheKey)
    if (cached) {
      console.log(`Cache HIT: ${cacheKey}`)
      return res.json(cached)
    }

    const crop = await Crop.findOne({ slug })
      .populate('diseases', 'name slug severity images')

    if (!crop) {
      return res.status(404).json({ message: 'Crop not found' })
    }

    // Store in cache
    setCache(cacheKey, crop)
    console.log(`Cache MISS: ${cacheKey}`)

    res.json(crop)
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

export const getAllCrops = async (req: Request, res: Response) => {
  try {
    const cacheKey = 'all_crops'

    const cached = getCache<any>(cacheKey)
    if (cached) {
      console.log('Cache HIT: all_crops')
      return res.json(cached)
    }

    const crops = await Crop.find({}, 'name slug type images')
    setCache(cacheKey, crops)
    console.log('Cache MISS: all_crops')

    res.json(crops)
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

export const searchCrops = async (req: Request, res: Response) => {
  try {
    const { q } = req.query

    if (!q) {
      return res.status(400).json({ message: 'Query is required' })
    }

    const cacheKey = `search_${q}`

    const cached = getCache<any>(cacheKey)
    if (cached) {
      console.log(`Cache HIT: ${cacheKey}`)
      return res.json(cached)
    }

    const crops = await Crop.find(
      {
        $or: [
          { 'name.en': { $regex: q, $options: 'i' } },
          { 'name.hi': { $regex: q, $options: 'i' } },
          { slug: { $regex: q, $options: 'i' } }
        ]
      } as any,
      'name slug type images'
    )

    setCache(cacheKey, crops)
    res.json(crops)
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}