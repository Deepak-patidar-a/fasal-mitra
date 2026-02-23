import { Request, Response } from 'express'
import Crop from '../models/Crop'

// Get crop by slug with diseases populated
export const getCropBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params

    const crop = await Crop.findOne({ slug })
      .populate('diseases', 'name slug severity images')

    if (!crop) {
      return res.status(404).json({ message: 'Crop not found' })
    }

    res.json(crop)
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

// Get all crops (for crops listing page)
export const getAllCrops = async (req: Request, res: Response) => {
  try {
    const crops = await Crop.find({}, 'name slug type images')
    res.json(crops)
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

// Search crops by name
export const searchCrops = async (req: Request, res: Response) => {
  try {
    const { q } = req.query

    if (!q) {
      return res.status(400).json({ message: 'Query is required' })
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

    res.json(crops)
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}