import { Request, Response } from 'express'
import Product from '../models/Product'

export const getProductsByDisease = async (req: Request, res: Response) => {
  try {
    const { diseaseId } = req.params

    const products = await Product.find({
      _id: { $in: await getProductIdsByDisease(Array.isArray(diseaseId) ? diseaseId[0] : diseaseId) }
    }).populate('listings')

    res.json(products)
  } catch {
    res.status(500).json({ message: 'Server error' })
  }
}

// Helper
const getProductIdsByDisease = async (diseaseId: string) => {
  const Disease = (await import('../models/Disease')).default
  const disease = await Disease.findById(diseaseId)
  return disease?.products || []
}

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find().populate('listings')
    res.json(products)
  } catch {
    res.status(500).json({ message: 'Server error' })
  }
}

export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id).populate('listings')
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }
    res.json(product)
  } catch {
    res.status(500).json({ message: 'Server error' })
  }
}