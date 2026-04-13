import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User'
import { generateTokens } from '../utils/generateTokens'


export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, password, role, preferredLanguage } = req.body

    // Check if user exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' })
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12)

    // Create user
    const user = await User.create({
      name,
      email,
      phone,
      passwordHash,
      role: role || 'farmer',
      preferredLanguage: preferredLanguage || 'en'
    })

    generateTokens(res, user._id.toString(), user.role)

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      preferredLanguage: user.preferredLanguage
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    // Find user
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.passwordHash)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    generateTokens(res, user._id.toString(), user.role)

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      preferredLanguage: user.preferredLanguage
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

export const logout = async (req: Request, res: Response) => {
  res.clearCookie('accessToken')
  res.clearCookie('refreshToken')
  res.json({ message: 'Logged out successfully' })
}

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.refreshToken
    if (!token) {
      return res.status(401).json({ message: 'No refresh token' })
    }

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET as string) as {
      userId: string
      role: string
    }

    generateTokens(res, decoded.userId, decoded.role)
    res.json({ message: 'Token refreshed' })
  } catch {
    res.status(401).json({ message: 'Invalid refresh token' })
  }
}

export const getMe = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId
    const user = await User.findById(userId).select('-passwordHash')
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    res.json(user)
  } catch {
    res.status(500).json({ message: 'Server error' })
  }
}

export const saveCrop = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId
    const { cropId } = req.body

    if (!cropId) {
      return res.status(400).json({ message: 'cropId is required' })
    }

    // Check if already saved
    const user = await User.findById(userId).lean()
    if (!user) return res.status(404).json({ message: 'User not found' })

    const alreadySaved = user.savedCrops
      .map((id: any) => id.toString())
      .includes(cropId)

    if (alreadySaved) {
      // Remove from saved
      await User.findByIdAndUpdate(userId, {
        $pull: { savedCrops: cropId }
      })
    } else {
      // Add to saved
      await User.findByIdAndUpdate(userId, {
        $addToSet: { savedCrops: cropId }
      })
    }

    res.json({ saved: !alreadySaved })
  } catch (error) {
    console.error('saveCrop error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

export const addToSearchHistory = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId
    const { query } = req.body

    if (!query) {
      return res.status(400).json({ message: 'Query is required' })
    }

    await User.findByIdAndUpdate(
      userId,
      {
        $push: {
          searchHistory: {
            $each: [query],
            $slice: -10
          }
        }
      }
    )

    res.json({ message: 'Search history updated' })
  } catch (error) {
    console.error('addToSearchHistory error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

export const getSavedCrops = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId
    const user = await User.findById(userId)
      .populate('savedCrops', 'name slug type images')
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json(user.savedCrops)
  } catch {
    res.status(500).json({ message: 'Server error' })
  }
}