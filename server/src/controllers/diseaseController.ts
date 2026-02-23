import { Request, Response } from 'express'
import Disease from '../models/Disease'

export const getDiseaseBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params

    const disease = await Disease.findOne({ slug })
      .populate('crops', 'name slug')
      .populate('products', 'name type description images listings')

    if (!disease) {
      return res.status(404).json({ message: 'Disease not found' })
    }

    res.json(disease)
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

export const getAllDiseases = async (req: Request, res: Response) => {
  try {
    const diseases = await Disease.find({}, 'name slug severity images crops')
      .populate('crops', 'name slug')
    res.json(diseases)
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}