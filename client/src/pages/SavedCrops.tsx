import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Leaf, Heart, AlertTriangle, ArrowLeft } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import apiFetch from '@/services/api'
import PageTransition from '@/components/common/PageTransition'
import { CropsPageSkeleton } from '@/components/common/Skeleton'
import LazyImage from '@/components/common/LazyImage'

interface Crop {
  _id: string
  name: { en: string; hi: string }
  slug: string
  type: 'Kharif' | 'Rabi' | 'Zaid'
  images: string[]
}

const typeColors = {
  Kharif: 'bg-blue-50 text-blue-600 border-blue-100',
  Rabi: 'bg-amber-50 text-amber-600 border-amber-100',
  Zaid: 'bg-green-50 text-green-600 border-green-100'
}

const SavedCrops = () => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { user, toggleSaveCrop} = useAuth()
  const lang = (i18n.language?.split('-')[0] || 'en') as 'en' | 'hi'

  const [crops, setCrops] = useState<Crop[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchSavedCrops = async () => {
      try {
        setLoading(true)
        const data = await apiFetch('/auth/saved-crops')
        setCrops(data)
      } catch {
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    if (user) fetchSavedCrops()
  }, [user])

  const handleUnsave = async (e: React.MouseEvent, cropId: string) => {
    e.stopPropagation()
    await toggleSaveCrop(cropId)
    setCrops(prev => prev.filter(c => c._id !== cropId))
  }

  if (loading) return <CropsPageSkeleton />

  return (
    <PageTransition>
      <div className="min-h-screen bg-background px-4 md:px-8 lg:px-12 py-10">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-sm text-text-secondary hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('back')}
          </button>

          <div className="flex items-center gap-3 mb-8">
            <div className="bg-primary/10 p-2.5 rounded-xl">
              <Heart className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-text-primary">
                {t('saved_crops')}
              </h1>
              <p className="text-sm text-text-secondary">
                {crops.length} {t('crops_saved')}
              </p>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <AlertTriangle className="w-10 h-10 text-error" />
              <p className="text-text-secondary text-sm">{t('something_went_wrong')}</p>
            </div>
          )}

          {/* Empty state */}
          {!error && crops.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="bg-primary/10 p-6 rounded-full">
                <Heart className="w-12 h-12 text-primary" />
              </div>
              <div className="text-center">
                <h3 className="text-base font-bold text-text-primary">
                  {t('no_saved_crops_title')}
                </h3>
                <p className="text-sm text-text-secondary mt-1">
                  {t('no_saved_crops_desc')}
                </p>
              </div>
              <button
                onClick={() => navigate('/crops')}
                className="mt-2 px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-light transition-colors"
              >
                {t('browse_crops')}
              </button>
            </div>
          )}

          {/* Crops grid */}
          {crops.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {crops.map((crop) => (
                <div
                  key={crop._id}
                  className="relative bg-surface border border-border rounded-2xl p-5 flex flex-col items-center gap-3 hover:border-primary hover:shadow-md transition-all group cursor-pointer"
                  onClick={() => navigate(`/crop/${crop.slug}`)}
                >
                  {/* Unsave button */}
                  <button
                    onClick={(e) => handleUnsave(e, crop._id)}
                    className="absolute top-3 right-3 p-1.5 rounded-full bg-background hover:bg-error/10 hover:text-error transition-colors text-text-secondary"
                  >
                    <Heart className="w-3.5 h-3.5 fill-current text-primary" />
                  </button>

                  {/* Image */}
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-border bg-primary/10">
                    {crop.images[0] ? (
                      <LazyImage
                        src={crop.images[0]}
                        alt={crop.name[lang]}
                        className="w-full h-full"
                        fallback={
                          <div className="w-full h-full flex items-center justify-center">
                            <Leaf className="w-8 h-8 text-primary" />
                          </div>
                        }
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Leaf className="w-8 h-8 text-primary" />
                      </div>
                    )}
                  </div>

                  {/* Name + type */}
                  <div className="text-center">
                    <p className="text-sm font-semibold text-text-primary">
                      {crop.name[lang]}
                    </p>
                    <span className={`text-xs px-2 py-0.5 rounded-full border mt-1 inline-block ${typeColors[crop.type]}`}>
                      {crop.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </PageTransition>
  )
}

export default SavedCrops