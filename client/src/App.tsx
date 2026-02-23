import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from '@/pages/Home'
import CropDetail from '@/pages/CropDetail'
import DiseaseDetail from '@/pages/DiseaseDetail'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import NotFound from '@/pages/NotFound'
import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'
import ProtectedRoute from './components/common/ProtectedRoute'
import Profile from './pages/Profile'
import ProductDetail from './pages/ProductDetail'
import Chat from './pages/Chat'

function App() {
  return (
    <BrowserRouter>
    <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1">
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
      </main>
      <Footer/>
    </div>
    </BrowserRouter>
  )
}

export default App