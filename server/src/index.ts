import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import mongoose from 'mongoose'

dotenv.config()

import './models/User'
import './models/Crop'
import './models/Disease'
import './models/Product'
import './models/Listing'
import './models/Order'
import cropRoutes from './routes/cropRoutes'
import diseaseRoutes from './routes/diseaseRoutes'
import authRoutes from './routes/authRoutes'

const app = express()
const PORT = process.env.PORT || 8000

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))
app.use(express.json())
app.use(cookieParser())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/crops', cropRoutes)
app.use('/api/diseases', diseaseRoutes)

// MongoDB Connection
const connectDB = async () => {
  try {
    console.log('Connecting to MongoDB...')
    const uri = process.env.MONGODB_URI as string
    await mongoose.connect(uri)
    console.log('MongoDB connected 🌱')
  } catch (error) {
    console.error('MongoDB connection failed:', error)
    process.exit(1)
  }
}

connectDB()

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running 🌱' ,
    db: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})