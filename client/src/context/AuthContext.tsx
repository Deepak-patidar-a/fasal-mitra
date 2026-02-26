import { createContext, useContext, useState, useEffect, type ReactNode, useRef } from 'react'
import { apiFetch } from '@/services/api'

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
  const hasFetched = useRef(false)
  
  useEffect(() => {
    if (hasFetched.current) return  // prevent double call from StrictMode
    hasFetched.current = true

  const fetchMe = async () => {
    try {
      const user = await apiFetch('/auth/me')
      setUser(user)
      const saved = await apiFetch('/auth/saved-crops')
      setSavedCrops(saved.map((c: any) => c._id))
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }
  fetchMe()
}, [])

const login = async (email: string, password: string) => {
  const user = await apiFetch('/auth/login', { method: 'POST', body: { email, password } })
  setUser(user)
  const saved = await apiFetch('/auth/saved-crops')
  setSavedCrops(saved.map((c: any) => c._id))
}

const register = async (data: RegisterData) => {
  const user = await apiFetch('/auth/register', { method: 'POST', body: data })
  setUser(user)
}

const logout = async () => {
  await apiFetch('/auth/logout', { method: 'POST' })
  setUser(null)
  setSavedCrops([])
}

const toggleSaveCrop = async (cropId: string) => {
  if (!user) return
  const res = await apiFetch('/auth/save-crop', { method: 'POST', body: { cropId } })
  if (res.saved) {
    setSavedCrops((prev) => [...prev, cropId])
  } else {
    setSavedCrops((prev) => prev.filter((id) => id !== cropId))
  }
}

const addToSearchHistory = async (query: string) => {
  if (!user) return
  await apiFetch('/auth/search-history', { method: 'POST', body: { query } })
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