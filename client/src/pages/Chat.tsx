import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  ArrowLeft,
  Send,
  Wifi,
  WifiOff,
  Leaf,
  MessageCircle,
  User
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/AuthContext'
import { useChat } from '@/hooks/useChat'

const Chat = () => {
  const { room } = useParams()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { user } = useAuth()

  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { messages, connected, typingUser, sendMessage, emitTyping } = useChat(
    room || 'general',
    user?.name || 'Anonymous',
    user?.role || 'farmer'
  )

  // Auto scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typingUser])

  const handleSend = () => {
    if (!input.trim()) return
    sendMessage(input.trim())
    setInput('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const isMyMessage = (userName: string) => userName === user?.name

  return (
    <div className="min-h-screen bg-background flex flex-col">

      {/* Header */}
      <div className="bg-surface border-b border-border px-4 md:px-8 py-4 flex items-center justify-between sticky top-16 z-40">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="text-text-secondary hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-1.5 rounded-lg">
              <Leaf className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-text-primary capitalize">
                {room} {t('chat_room')}
              </h1>
              <p className="text-xs text-text-secondary">{t('chat_subtitle')}</p>
            </div>
          </div>
        </div>

        {/* Connection status */}
        <div className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
          connected
            ? 'bg-success/10 text-success'
            : 'bg-error/10 text-error'
        }`}>
          {connected
            ? <><Wifi className="w-3 h-3" /> {t('connected')}</>
            : <><WifiOff className="w-3 h-3" /> {t('disconnected')}</>
          }
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 lg:px-12 py-6">
        <div className="max-w-4xl mx-auto flex flex-col gap-4">

          {/* Empty state */}
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="bg-primary/10 p-5 rounded-full">
                <MessageCircle className="w-10 h-10 text-primary" />
              </div>
              <div className="text-center">
                <h3 className="text-base font-bold text-text-primary">
                  {t('chat_empty_title')}
                </h3>
                <p className="text-sm text-text-secondary mt-1">
                  {t('chat_empty_desc')}
                </p>
              </div>
            </div>
          )}

          {/* Messages */}
          {messages.map((msg) => {
            const isMine = isMyMessage(msg.userName)
            return (
              <div
                key={msg.id}
                className={`flex items-end gap-2 ${isMine ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  msg.userRole === 'expert'
                    ? 'bg-accent/10'
                    : 'bg-primary/10'
                }`}>
                  <User className={`w-4 h-4 ${
                    msg.userRole === 'expert' ? 'text-accent' : 'text-primary'
                  }`} />
                </div>

                {/* Bubble */}
                <div className={`flex flex-col gap-1 max-w-xs md:max-w-md lg:max-w-lg ${
                  isMine ? 'items-end' : 'items-start'
                }`}>
                  {/* Name + Role */}
                  <div className={`flex items-center gap-2 ${isMine ? 'flex-row-reverse' : ''}`}>
                    <span className="text-xs font-semibold text-text-primary">
                      {isMine ? t('you') : msg.userName}
                    </span>
                    {msg.userRole === 'expert' && (
                      <span className="text-xs bg-accent/10 text-accent px-1.5 py-0.5 rounded-full">
                        {t('expert')}
                      </span>
                    )}
                  </div>

                  {/* Message bubble */}
                  <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    isMine
                      ? 'bg-primary text-white rounded-br-sm'
                      : msg.userRole === 'expert'
                        ? 'bg-accent/10 text-text-primary border border-accent/20 rounded-bl-sm'
                        : 'bg-surface border border-border text-text-primary rounded-bl-sm'
                  }`}>
                    {msg.message}
                  </div>

                  {/* Timestamp */}
                  <span className="text-xs text-text-secondary">
                    {formatTime(msg.timestamp)}
                  </span>
                </div>
              </div>
            )
          })}

          {/* Typing indicator */}
          {typingUser && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-4 h-4 text-primary" />
              </div>
              <div className="bg-surface border border-border px-4 py-2.5 rounded-2xl rounded-bl-sm">
                <div className="flex items-center gap-1">
                  <span className="text-xs text-text-secondary">{typingUser} {t('is_typing')}</span>
                  <span className="flex gap-0.5 ml-1">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="w-1.5 h-1.5 bg-text-secondary rounded-full animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-surface border-t border-border px-4 md:px-8 lg:px-12 py-4 sticky bottom-0">
        <div className="max-w-4xl mx-auto">
          {!user ? (
            <div className="flex items-center justify-center gap-3 py-2">
              <p className="text-sm text-text-secondary">{t('login_to_chat')}</p>
              <Button
                size="sm"
                className="bg-primary hover:bg-primary-light"
                onClick={() => navigate('/login')}
              >
                {t('login')}
              </Button>
            </div>
          ) : (
            <div className="flex items-end gap-3">
              <textarea
                value={input}
                onChange={(e) => {
                  setInput(e.target.value)
                  emitTyping()
                }}
                onKeyDown={handleKeyDown}
                placeholder={t('chat_placeholder')}
                rows={1}
                className="flex-1 bg-background border border-border rounded-xl px-4 py-3 text-sm text-text-primary outline-none focus:border-primary transition-colors resize-none placeholder:text-text-secondary"
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || !connected}
                className="bg-primary hover:bg-primary-light shrink-0 h-11 w-11 p-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          )}
          <p className="text-xs text-text-secondary mt-2 text-center">
            {t('chat_enter_hint')}
          </p>
        </div>
      </div>

    </div>
  )
}

export default Chat