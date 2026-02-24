import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import Navbar from '@/components/common/Navbar'
import Footer from '@/components/common/Footer'
import ProtectedRoute from '@/components/common/ProtectedRoute'
import { Leaf } from 'lucide-react'

const Home = lazy(() => import('@/pages/Home'))
const CropDetail = lazy(() => import('@/pages/CropDetail'))
const DiseaseDetail = lazy(() => import('@/pages/DiseaseDetail'))
const Login = lazy(() => import('@/pages/Login'))
const Register = lazy(() => import('@/pages/Register'))
const Profile = lazy(() => import('@/pages/Profile'))
const ProductDetail = lazy(() => import('@/pages/ProductDetail'))
const Chat = lazy(() => import('@/pages/Chat'))
const NotFound = lazy(() => import('@/pages/NotFound'))

// Global loading fallback
const PageLoader = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <Leaf className="w-10 h-10 text-primary animate-pulse" />
      <p className="text-text-secondary text-sm">Loading...</p>
    </div>
  </div>
)

function App() {
  return (
    <BrowserRouter>
    <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/crop/:slug" element={<CropDetail />} />
        <Route path="/disease/:slug" element={<DiseaseDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/chat/:room" element={<Chat />} />
        <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
        <Route path="*" element={<NotFound />} />
      </Routes>
      </Suspense>
      </main>
      <Footer/>
    </div>
    </BrowserRouter>
  )
}

export default App