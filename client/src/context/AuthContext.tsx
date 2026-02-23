import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import api from '@/services/api'

interface User {
  _id: string
  name: string
  email: string
  role: 'farmer' | 'expert'
  preferredLanguage: 'en' | 'hi'
}

interface AuthContextType {
  user: User | null
  loading: boolean
  savedCrops: string[]
  login: (email: string, password: string) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => Promise<void>
  toggleSaveCrop: (cropId: string) => Promise<void>
  addToSearchHistory: (query: string) => Promise<void>
}

interface RegisterData {
  name: string
  email: string
  phone: string
  password: string
  role: 'farmer' | 'expert'
  preferredLanguage: 'en' | 'hi'
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [savedCrops, setSavedCrops] = useState<string[]>([])

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await api.get('/auth/me')
        setUser(res.data)
        // Load saved crops
        const saved = await api.get('/auth/saved-crops')
        setSavedCrops(saved.data.map((c: any) => c._id))
      } catch {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    fetchMe()
  }, [])

  const login = async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password })
    setUser(res.data)
    const saved = await api.get('/auth/saved-crops')
    setSavedCrops(saved.data.map((c: any) => c._id))
  }

  const register = async (data: RegisterData) => {
    const res = await api.post('/auth/register', data)
    setUser(res.data)
  }

  const logout = async () => {
    await api.post('/auth/logout')
    setUser(null)
    setSavedCrops([])
  }

  const toggleSaveCrop = async (cropId: string) => {
    if (!user) return
    const res = await api.post('/auth/save-crop', { cropId })
    if (res.data.saved) {
      setSavedCrops((prev) => [...prev, cropId])
    } else {
      setSavedCrops((prev) => prev.filter((id) => id !== cropId))
    }
  }

  const addToSearchHistory = async (query: string) => {
    if (!user) return
    await api.post('/auth/search-history', { query })
  }

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      savedCrops,
      login,
      register,
      logout,
      toggleSaveCrop,
      addToSearchHistory
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}