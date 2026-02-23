import jwt from 'jsonwebtoken'
import { Response } from 'express'

export const generateTokens = (res: Response, userId: string, role: string) => {
  const accessToken = jwt.sign(
    { userId, role },
    process.env.JWT_ACCESS_SECRET as string,
    { expiresIn: '15m' }
  )

  const refreshToken = jwt.sign(
    { userId, role },
    process.env.JWT_REFRESH_SECRET as string,
    { expiresIn: '7d' }
  )

  // Set access token cookie
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 15 * 60 * 1000 // 15 minutes
  })

  // Set refresh token cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  })

  return { accessToken, refreshToken }
}