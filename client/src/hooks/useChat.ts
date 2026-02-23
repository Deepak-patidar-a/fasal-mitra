import { useState, useEffect, useRef } from 'react'
import { connectSocket, disconnectSocket } from '@/services/socketService'

export interface ChatMessage {
  id: string
  message: string
  userName: string
  userRole: string
  timestamp: string
}

export const useChat = (room: string, userName: string, userRole: string) => {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [connected, setConnected] = useState(false)
  const [typingUser, setTypingUser] = useState<string | null>(null)
  const socketRef = useRef(connectSocket())
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const socket = socketRef.current

    socket.on('connect', () => setConnected(true))
    socket.on('disconnect', () => setConnected(false))

    // Join the crop room
    socket.emit('join_room', room)

    // Listen for messages
    socket.on('receive_message', (data: ChatMessage) => {
      setMessages((prev) => [...prev, data])
    })

    // Typing indicators
    socket.on('user_typing', ({ userName }: { userName: string }) => {
      setTypingUser(userName)
    })

    socket.on('user_stop_typing', () => {
      setTypingUser(null)
    })

    setConnected(socket.connected)

    return () => {
      socket.emit('leave_room', room)
      socket.off('receive_message')
      socket.off('user_typing')
      socket.off('user_stop_typing')
      socket.off('connect')
      socket.off('disconnect')
    }
  }, [room])

  const sendMessage = (message: string) => {
    socketRef.current.emit('send_message', {
      room,
      message,
      userName,
      userRole,
      timestamp: new Date().toISOString()
    })
  }

  const emitTyping = () => {
    socketRef.current.emit('typing', { room, userName })

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
    typingTimeoutRef.current = setTimeout(() => {
      socketRef.current.emit('stop_typing', { room })
    }, 1500)
  }

  return { messages, connected, typingUser, sendMessage, emitTyping }
}