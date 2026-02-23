import express, { Request, Response } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import { createServer } from 'http'
import { Server } from 'socket.io'

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
import productRoutes from './routes/productRoutes'
import orderRoutes from './routes/orderRoutes'

const app = express()
const httpServer = createServer(app)


const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  process.env.FRONTEND_URL as string
].filter(Boolean)
console.log('Allowed origins:', allowedOrigins)
// Socket.io setup
const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST']
  },
  transports: ['websocket', 'polling']
})
const PORT = process.env.PORT || 8000

// Middleware
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}))
app.use(express.json())
app.use(cookieParser())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/crops', cropRoutes)
app.use('/api/diseases', diseaseRoutes)
app.use('/api/products', productRoutes)
app.use('/api/orders', orderRoutes)

// Health check
app.get('/api/health', (req : Request, res : Response) => {
  res.json({ status: 'Server is running 🌱' ,
    db: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  })
})

// Socket.io logic
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`)

  // Join a crop room
  socket.on('join_room', (room: string) => {
    socket.join(room)
    console.log(`${socket.id} joined room: ${room}`)

    // Tell everyone in room someone joined
    socket.to(room).emit('user_joined', {
      message: `A new user joined the ${room} discussion`
    })
  })

  // Leave a room
  socket.on('leave_room', (room: string) => {
    socket.leave(room)
    console.log(`${socket.id} left room: ${room}`)
  })

  // Send message to room
  socket.on('send_message', (data: {
    room: string
    message: string
    userName: string
    userRole: string
    timestamp: string
  }) => {
    // Broadcast to everyone in room including sender
    io.to(data.room).emit('receive_message', {
      id: `${socket.id}_${Date.now()}`,
      message: data.message,
      userName: data.userName,
      userRole: data.userRole,
      timestamp: data.timestamp
    })
  })

  // Typing indicator
  socket.on('typing', (data: { room: string; userName: string }) => {
    socket.to(data.room).emit('user_typing', { userName: data.userName })
  })

  socket.on('stop_typing', (data: { room: string }) => {
    socket.to(data.room).emit('user_stop_typing')
  })

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`)
  })
})


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

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})