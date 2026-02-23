import { io, Socket } from 'socket.io-client'

let socket: Socket | null = null

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8000'

export const connectSocket = (): Socket => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    })

    socket.on('connect', () => {
      console.log('Socket connected:', socket?.id)
    })

    socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err.message)
    })
  }
  return socket
}

export const getSocket = (): Socket | null => socket

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}