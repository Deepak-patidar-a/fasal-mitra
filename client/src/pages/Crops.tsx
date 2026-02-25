import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Leaf, AlertTriangle } from 'lucide-react'
import { getAllCrops } from '@/services/cropService'
import { CropsPageSkeleton } from '@/components/common/Skeleton'
import PageTransition from '@/components/common/PageTransition'


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

const Crops = () => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const lang = (i18n.language?.split('-')[0] || 'en') as 'en' | 'hi'

  const [crops, setCrops] = useState<Crop[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [filter, setFilter] = useState<'All' | 'Kharif' | 'Rabi' | 'Zaid'>('All')

  useEffect(() => {
    const fetchCrops = async () => {
      try {
        setLoading(true)
        const data = await getAllCrops()
        setCrops(data)
      } catch {
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    fetchCrops()
  }, [])

  const filtered = filter === 'All'
    ? crops
    : crops.filter(c => c.type === filter)

  if (loading) {
    return <CropsPageSkeleton />
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-center">
          <AlertTriangle className="w-10 h-10 text-error" />
          <p className="text-text-secondary text-sm">{t('something_went_wrong')}</p>
        </div>
      </div>
    )
  }

  return (
    <PageTransition>
    <div className="min-h-screen bg-background">

      {/* Header */}
      <section className="bg-gradient-to-b from-primary/10 to-background px-4 md:px-8 lg:px-12 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-primary/10 p-2.5 rounded-xl">
              <Leaf className="w-6 h-6 text-primary" />
            </div>
            <span className="text-xs text-text-secondary font-medium uppercase tracking-wide">
              {t('all_crops')}
            </span>
          </div>
          <h1 className="text-2xl md:text-4xl font-bold text-text-primary mb-2">
            {t('crops_heading')}
          </h1>
          <p className="text-text-secondary text-sm md:text-base">
            {t('crops_subheading')}
          </p>
        </div>
      </section>

      {/* Filter tabs */}
      <section className="px-4 md:px-8 lg:px-12 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 flex-wrap mb-8">
            {(['All', 'Kharif', 'Rabi', 'Zaid'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                  filter === type
                    ? 'bg-primary text-white border-primary'
                    : 'bg-surface text-text-secondary border-border hover:border-primary hover:text-primary'
                }`}
              >
                {type === 'All' ? t('all') : type}
                <span className="ml-2 text-xs opacity-70">
                  {type === 'All'
                    ? crops.length
                    : crops.filter(c => c.type === type).length}
                </span>
              </button>
            ))}
          </div>

          {/* Crops Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filtered.map((crop) => (
              <button
                key={crop._id}
                onClick={() => navigate(`/crop/${crop.slug}`)}
                className="bg-surface border border-border rounded-2xl p-5 flex flex-col items-center gap-3 hover:border-primary hover:shadow-md transition-all text-center group"
              >
                {/* Crop icon */}
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  {crop.images[0] ? (
                    <img
                      src={crop.images[0]}
                      alt={crop.name[lang]}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <Leaf className="w-8 h-8 text-primary" />
                  )}
                </div>

                {/* Name */}
                <div>
                  <p className="text-sm font-semibold text-text-primary">
                    {crop.name[lang]}
                  </p>
                  <span className={`text-xs px-2 py-0.5 rounded-full border mt-1 inline-block ${typeColors[crop.type]}`}>
                    {crop.type}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Leaf className="w-10 h-10 text-text-secondary/30" />
              <p className="text-text-secondary text-sm">{t('no_crops_found')}</p>
            </div>
          )}
        </div>
      </section>
    </div>
    </PageTransition>
  )
}

export default Crops